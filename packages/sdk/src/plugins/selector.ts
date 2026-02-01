import { Plugin } from '../types';

export interface SelectorOptions {
    /** Indexer API URL (default: http://localhost:3001) */
    indexerUrl?: string;
    /** Required tags the service must have */
    tags?: string[];
    /** Minimum reputation score (0-100) */
    minReputation?: number;
    /** Selection strategy */
    strategy: 'cheapest' | 'best-reputation' | 'balanced';
}

interface ServiceInfo {
    provider: string;
    name: string;
    base_price: number;
    metadata_url: string;
    tags: string[];
    reputation_score: number;
}

/**
 * Selector Plugin - Intelligently selects the best provider based on criteria.
 * This is the "cheapestAgentPlugin" mentioned in the architecture docs.
 */
export const selectorPlugin = (options: SelectorOptions): Plugin => {
    const indexerUrl = options.indexerUrl || 'http://localhost:3001';

    return {
        name: 'selector-plugin',

        beforeCall: async (req) => {
            // Query the indexer for matching services
            const params = new URLSearchParams();
            if (options.tags?.length) params.set('tags', options.tags.join(','));
            if (options.minReputation) params.set('minReputation', String(options.minReputation));

            const url = `${indexerUrl}/services?${params.toString()}`;

            try {
                const response = await fetch(url);
                if (!response.ok) {
                    console.warn(`[Selector] Indexer returned ${response.status}, using original API`);
                    return;
                }

                const data = await response.json();
                const services: ServiceInfo[] = data.services || [];

                if (services.length === 0) {
                    console.warn('[Selector] No matching services found');
                    return;
                }

                // Find the requested API
                const requestedService = services.find(s =>
                    s.name.toLowerCase() === req.api.toLowerCase()
                );

                if (requestedService) {
                    // The requested service exists and matches criteria
                    console.log(`[Selector] Using requested service: ${requestedService.name} (${requestedService.base_price} APT, rep: ${requestedService.reputation_score})`);
                    return;
                }

                // If the requested service doesn't match criteria, suggest alternatives
                let best: ServiceInfo;

                switch (options.strategy) {
                    case 'cheapest':
                        services.sort((a, b) => a.base_price - b.base_price);
                        best = services[0];
                        break;
                    case 'best-reputation':
                        services.sort((a, b) => b.reputation_score - a.reputation_score);
                        best = services[0];
                        break;
                    case 'balanced':
                    default:
                        // Score = reputation / (price + 1) - higher is better
                        services.sort((a, b) => {
                            const scoreA = a.reputation_score / (a.base_price + 1);
                            const scoreB = b.reputation_score / (b.base_price + 1);
                            return scoreB - scoreA;
                        });
                        best = services[0];
                        break;
                }

                console.log(`[Selector] Suggested alternative: ${best.name} (${best.base_price} APT, rep: ${best.reputation_score})`);

                // Mutate the request to use the better service
                // Note: This is an opinionated design - you could also throw to let caller decide
                (req as any).api = best.name;
                (req as any)._selectedProvider = best;

            } catch (e: any) {
                console.warn(`[Selector] Failed to query indexer: ${e.message}`);
                // Continue with original request
            }
        }
    };
};

/**
 * Convenience wrapper for cheapest selection
 */
export const cheapestAgentPlugin = (options?: Omit<SelectorOptions, 'strategy'>): Plugin => {
    return selectorPlugin({ ...options, strategy: 'cheapest' });
};

/**
 * Convenience wrapper for best reputation selection
 */
export const bestReputationPlugin = (options?: Omit<SelectorOptions, 'strategy'>): Plugin => {
    return selectorPlugin({ ...options, strategy: 'best-reputation' });
};
