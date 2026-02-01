import express from 'express';
import cors from 'cors';
import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;
const MODULE_ID = process.env.Automata_MODULE_ID || '0x1::automata';

// Initialize Aptos client
const aptos = new Aptos(new AptosConfig({
    network: (process.env.APTOS_NETWORK as Network) || Network.TESTNET
}));

// In-memory cache (production would use Redis/Postgres)
interface ServiceCache {
    provider: string;
    name: string;
    base_price: number;
    metadata_url: string;
    tags: string[];
    reputation_score: number;
    last_updated: number;
}

let serviceCache: ServiceCache[] = [];
let lastSync = 0;

/**
 * Sync services from on-chain registry
 */
async function syncFromChain(): Promise<void> {
    try {
        const registryOwner = MODULE_ID.split('::')[0];
        const resource = await aptos.getAccountResource({
            accountAddress: registryOwner,
            resourceType: `${MODULE_ID}::market::GlobalRegistry`
        });

        if (!resource) {
            console.log('[Indexer] No registry found on-chain');
            return;
        }

        const services = (resource as any).services || [];

        serviceCache = await Promise.all(services.map(async (s: any) => {
            // Fetch reputation for each provider
            let repScore = 100;
            try {
                const repResource = await aptos.getAccountResource({
                    accountAddress: s.provider,
                    resourceType: `${MODULE_ID}::reputation::ReputationScore`
                });
                if (repResource) {
                    const rep = repResource as any;
                    repScore = rep.total_transactions > 0
                        ? Math.round((rep.score / rep.total_transactions) * 100)
                        : 100;
                }
            } catch { /* Provider has no reputation initialized */ }

            // Extract tags from metadata_url (simplified - real impl would fetch & parse)
            const tags = extractTags(s.metadata_url, s.name);

            return {
                provider: s.provider,
                name: s.name,
                base_price: Number(s.base_price),
                metadata_url: s.metadata_url,
                tags,
                reputation_score: repScore,
                last_updated: Date.now()
            };
        }));

        lastSync = Date.now();
        console.log(`[Indexer] Synced ${serviceCache.length} services from chain`);
    } catch (e: any) {
        console.error('[Indexer] Sync failed:', e.message);
    }
}

/**
 * Extract tags from service name/url (simplified heuristic)
 */
function extractTags(url: string, name: string): string[] {
    const tags: string[] = [];
    const combined = (url + name).toLowerCase();

    if (combined.includes('gpt') || combined.includes('llm') || combined.includes('claude')) tags.push('ai');
    if (combined.includes('image') || combined.includes('diffusion') || combined.includes('dalle')) tags.push('image');
    if (combined.includes('audio') || combined.includes('whisper') || combined.includes('tts')) tags.push('audio');
    if (combined.includes('data') || combined.includes('analytics')) tags.push('data');
    if (combined.includes('sentiment') || combined.includes('nlp')) tags.push('nlp');

    if (tags.length === 0) tags.push('general');
    return tags;
}

// ==================== API ROUTES ====================

/**
 * GET /health - Health check
 */
app.get('/health', (_, res) => {
    res.json({ status: 'ok', lastSync, serviceCount: serviceCache.length });
});

/**
 * GET /services - List all services with optional filtering
 * Query params: ?q=search&tags=ai,data&maxPrice=1000&minReputation=80
 */
app.get('/services', (req, res) => {
    let results = [...serviceCache];

    // Text search
    const q = (req.query.q as string || '').toLowerCase();
    if (q) {
        results = results.filter(s =>
            s.name.toLowerCase().includes(q) ||
            s.tags.some(t => t.includes(q))
        );
    }

    // Tag filter
    const tagsParam = req.query.tags as string;
    if (tagsParam) {
        const requiredTags = tagsParam.split(',').map(t => t.trim().toLowerCase());
        results = results.filter(s =>
            requiredTags.some(rt => s.tags.includes(rt))
        );
    }

    // Price filter
    const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : undefined;
    if (maxPrice !== undefined) {
        results = results.filter(s => s.base_price <= maxPrice);
    }

    // Reputation filter
    const minRep = req.query.minReputation ? Number(req.query.minReputation) : undefined;
    if (minRep !== undefined) {
        results = results.filter(s => s.reputation_score >= minRep);
    }

    // Sort by reputation (descending) by default
    results.sort((a, b) => b.reputation_score - a.reputation_score);

    res.json({
        count: results.length,
        lastSync,
        services: results
    });
});

/**
 * GET /services/:name - Get specific service by name
 */
app.get('/services/:name', (req, res) => {
    const service = serviceCache.find(s =>
        s.name.toLowerCase() === req.params.name.toLowerCase()
    );

    if (!service) {
        return res.status(404).json({ error: 'Service not found' });
    }

    res.json(service);
});

/**
 * GET /services/cheapest - Find cheapest service matching criteria
 * Query params: ?tags=ai&minReputation=80
 */
app.get('/discover/cheapest', (req, res) => {
    let candidates = [...serviceCache];

    const tagsParam = req.query.tags as string;
    if (tagsParam) {
        const requiredTags = tagsParam.split(',').map(t => t.trim().toLowerCase());
        candidates = candidates.filter(s =>
            requiredTags.some(rt => s.tags.includes(rt))
        );
    }

    const minRep = req.query.minReputation ? Number(req.query.minReputation) : 0;
    candidates = candidates.filter(s => s.reputation_score >= minRep);

    if (candidates.length === 0) {
        return res.status(404).json({ error: 'No matching services found' });
    }

    // Sort by price ascending
    candidates.sort((a, b) => a.base_price - b.base_price);

    res.json(candidates[0]);
});

/**
 * POST /sync - Force re-sync from chain
 */
app.post('/sync', async (_, res) => {
    await syncFromChain();
    res.json({ status: 'synced', count: serviceCache.length, timestamp: lastSync });
});

// ==================== STARTUP ====================

async function start() {
    console.log('[Indexer] Starting automata Discovery Service...');

    // Initial sync
    await syncFromChain();

    // Periodic sync every 30 seconds
    setInterval(syncFromChain, 30_000);

    app.listen(PORT, () => {
        console.log(`[Indexer] API running on http://localhost:${PORT}`);
        console.log(`[Indexer] Module ID: ${MODULE_ID}`);
    });
}

start().catch(console.error);
