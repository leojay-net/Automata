'use client';

import dynamic from 'next/dynamic';
import DocsSidebar from '@/components/docs/DocsSidebar';
import Link from 'next/link';
import { ArrowLeft, Rocket } from 'lucide-react';

const FlowDiagram = dynamic(() => import('@/components/docs/FlowDiagram'), { ssr: false });

export default function DocsPage() {
    return (
        <div className="max-w-7xl mx-auto pt-8 pb-24">
            <div className="mb-8 flex justify-between items-center">
                <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white transition-colors">
                    <ArrowLeft size={20} className="mr-2" /> Back to Market
                </Link>
                <Link href="/app" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:opacity-90 transition-opacity">
                    <Rocket size={16} /> Launch App
                </Link>
            </div>

            <div className="flex gap-12">
                <DocsSidebar />

                <main className="flex-1 min-w-0">
                    <div className="prose prose-invert prose-lg max-w-none">
                        {/* Introduction */}
                        <section id="introduction" className="mb-20">
                            <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 mb-6">
                                automata Protocol
                            </h1>
                            <p className="text-xl text-gray-300 leading-relaxed mb-6">
                                The automata Protocol is a decentralized infrastructure layer for AI service discovery and consumption on Aptos.
                                It bridges the gap between on-chain payments and off-chain inference, providing a secure, verifiable, and reputation-based marketplace for AI agents and developers.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 not-prose">
                                <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                                    <div className="text-2xl font-bold text-blue-400">Usage Wallets</div>
                                    <div className="text-sm text-gray-400">Pre-funded accounts for micro-payments</div>
                                </div>
                                <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
                                    <div className="text-2xl font-bold text-purple-400">Spend Policies</div>
                                    <div className="text-sm text-gray-400">Control who can spend and how much</div>
                                </div>
                                <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                                    <div className="text-2xl font-bold text-green-400">Reputation</div>
                                    <div className="text-sm text-gray-400">On-chain trust scoring for providers</div>
                                </div>
                            </div>
                        </section>

                        {/* Getting Started */}
                        <section id="getting-started" className="mb-20 scroll-mt-24">
                            <h2 className="text-3xl font-bold text-white mb-8 border-b border-white/10 pb-4">Getting Started</h2>

                            <div className="space-y-8">
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-4">Option 1: Use the Web App</h3>
                                    <p className="text-gray-400 mb-4">
                                        The easiest way to get started is through our web dashboard. Click <strong>"Launch App"</strong> in the navigation to access:
                                    </p>
                                    <ul className="list-disc pl-6 text-gray-400 space-y-2">
                                        <li><strong>Dashboard</strong> — Overview of your wallets and activity</li>
                                        <li><strong>Wallets</strong> — Create and manage Usage Wallets</li>
                                        <li><strong>Policies</strong> — Set up spending controls</li>
                                        <li><strong>Marketplace</strong> — Browse and consume AI services</li>
                                        <li><strong>Publish</strong> — List your own AI services</li>
                                        <li><strong>Agents</strong> — Manage your on-chain identity</li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold text-white mb-4">Option 2: Use the CLI</h3>
                                    <p className="text-gray-400 mb-4">
                                        For programmatic access and automation, install the automata CLI:
                                    </p>
                                    <div className="bg-black/50 p-4 rounded-xl border border-white/10 font-mono text-sm not-prose">
                                        <div className="text-gray-500 mb-2"># Install globally</div>
                                        <div className="text-blue-400 mb-4">npm install -g @automata/cli</div>
                                        <div className="text-gray-500 mb-2"># Create your first usage wallet</div>
                                        <div className="text-green-400 mb-4">automata wallet create --fund 1.0</div>
                                        <div className="text-gray-500 mb-2"># Search for services</div>
                                        <div className="text-green-400">automata search "gpt" --max-price 0.05</div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Architecture */}
                        <section id="architecture" className="mb-20 scroll-mt-24">
                            <h2 className="text-3xl font-bold text-white mb-8 border-b border-white/10 pb-4">Architecture</h2>
                            <p className="text-gray-400 mb-8">
                                The system operates through a cyclic interaction between the Consumer (Wallet), the Marketplace (Frontend), the Smart Contracts (Registry/Payment), and the AI Provider Nodes.
                            </p>
                            <FlowDiagram />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 not-prose">
                                <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                                    <h3 className="font-bold text-blue-400 mb-2">Move Contracts</h3>
                                    <p className="text-sm text-gray-400">usage_wallet, spend_policy, market, identity, reputation modules handle all on-chain logic.</p>
                                </div>
                                <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                                    <h3 className="font-bold text-purple-400 mb-2">Indexer Service</h3>
                                    <p className="text-sm text-gray-400">Syncs on-chain data and provides REST API for service discovery and filtering.</p>
                                </div>
                                <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                                    <h3 className="font-bold text-green-400 mb-2">TypeScript SDK</h3>
                                    <p className="text-sm text-gray-400">Client library with plugins for intelligent provider selection (cheapest, best reputation).</p>
                                </div>
                                <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                                    <h3 className="font-bold text-orange-400 mb-2">CLI Tool</h3>
                                    <p className="text-sm text-gray-400">Command-line interface for wallet, policy, search, call, and agent management.</p>
                                </div>
                            </div>
                        </section>

                        {/* Features - Usage Wallets */}
                        <section id="usage-wallets" className="mb-20 scroll-mt-24">
                            <h2 className="text-3xl font-bold text-white mb-8 border-b border-white/10 pb-4">Usage Wallets</h2>
                            <p className="text-gray-400 mb-6">
                                Traditional blockchain payments require signing every transaction. automata introduces <strong>Usage Wallets</strong>—pre-funded accounts that allow for high-frequency, low-latency micro-payments to authorized AI endpoints without user interaction for every request.
                            </p>

                            <div className="bg-black/50 p-6 rounded-xl border border-white/10 font-mono text-sm not-prose mb-6">
                                <div className="text-gray-500 mb-2"># CLI: Create a usage wallet with 2 APT</div>
                                <div className="text-green-400 mb-4">automata wallet create --fund 2.0 --name "AI Agent Wallet"</div>
                                <div className="text-gray-500 mb-2"># CLI: Check wallet balance</div>
                                <div className="text-green-400">automata wallet balance 0x1234...</div>
                            </div>

                            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 not-prose">
                                <div className="font-medium text-blue-400 mb-1">Web App</div>
                                <div className="text-sm text-gray-400">Go to <strong>App → Wallets → Create Wallet</strong> to create through the UI</div>
                            </div>
                        </section>

                        {/* Features - Spend Policies */}
                        <section id="policies" className="mb-20 scroll-mt-24">
                            <h2 className="text-3xl font-bold text-white mb-8 border-b border-white/10 pb-4">Spend Policies</h2>
                            <p className="text-gray-400 mb-6">
                                Spend Policies allow you to delegate spending authority to AI agents or other addresses with fine-grained controls:
                            </p>

                            <ul className="list-disc pl-6 text-gray-400 space-y-2 mb-6">
                                <li><strong>Max Per Call</strong> — Limit how much can be spent per API call</li>
                                <li><strong>Daily Limit</strong> — Cap total daily spending</li>
                                <li><strong>Allowed Tags</strong> — Restrict to specific service categories (e.g., "inference", "audio")</li>
                                <li><strong>Expiration</strong> — Set time-limited authorization</li>
                            </ul>

                            <div className="bg-black/50 p-6 rounded-xl border border-white/10 font-mono text-sm not-prose mb-6">
                                <div className="text-gray-500 mb-2"># Attach a policy to a wallet</div>
                                <div className="text-green-400 mb-4">automata policy attach --wallet 0x123... --spender 0xAgent... --max-per-call 0.1 --allowed-tags inference,generation</div>
                                <div className="text-gray-500 mb-2"># List policies for a wallet</div>
                                <div className="text-green-400">automata policy list --wallet 0x123...</div>
                            </div>

                            <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 not-prose">
                                <div className="font-medium text-purple-400 mb-1">Web App</div>
                                <div className="text-sm text-gray-400">Go to <strong>App → Policies → Attach Policy</strong> to set up through the UI</div>
                            </div>
                        </section>

                        {/* Features - Marketplace */}
                        <section id="marketplace" className="mb-20 scroll-mt-24">
                            <h2 className="text-3xl font-bold text-white mb-8 border-b border-white/10 pb-4">Service Marketplace</h2>
                            <p className="text-gray-400 mb-6">
                                The marketplace is where AI providers list their services and consumers discover them. Each service includes:
                            </p>

                            <ul className="list-disc pl-6 text-gray-400 space-y-2 mb-6">
                                <li><strong>Name & Description</strong> — What the service does</li>
                                <li><strong>Price</strong> — Cost per API call in APT</li>
                                <li><strong>Tags</strong> — Categories like "inference", "audio", "image"</li>
                                <li><strong>Reputation Score</strong> — On-chain trust rating (0-100)</li>
                                <li><strong>Provider Address</strong> — On-chain identity of the service owner</li>
                            </ul>

                            <div className="bg-black/50 p-6 rounded-xl border border-white/10 font-mono text-sm not-prose mb-6">
                                <div className="text-gray-500 mb-2"># Search for services</div>
                                <div className="text-green-400 mb-4">automata search "image generation" --max-price 0.05</div>
                                <div className="text-gray-500 mb-2"># Call a service</div>
                                <div className="text-green-400">automata call openai-gpt4 /v1/chat --wallet 0x123... --data '&#123;"prompt": "Hello"&#125;'</div>
                            </div>

                            <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 not-prose">
                                <div className="font-medium text-green-400 mb-1">Web App</div>
                                <div className="text-sm text-gray-400">Go to <strong>App → Marketplace</strong> to browse, filter, and purchase services</div>
                            </div>
                        </section>

                        {/* Publishing Services */}
                        <section id="publishing" className="mb-20 scroll-mt-24">
                            <h2 className="text-3xl font-bold text-white mb-8 border-b border-white/10 pb-4">Publishing Services</h2>
                            <p className="text-gray-400 mb-6">
                                Providers can list their AI services on the marketplace to earn APT for each API call:
                            </p>

                            <div className="bg-black/50 p-6 rounded-xl border border-white/10 font-mono text-sm not-prose mb-6">
                                <div className="text-gray-500 mb-2"># Publish a service</div>
                                <div className="text-green-400">automata publish ./api-spec.json --name "My GPT Service" --price 0.01 --endpoint https://api.example.com</div>
                            </div>

                            <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 not-prose">
                                <div className="font-medium text-orange-400 mb-1">Web App</div>
                                <div className="text-sm text-gray-400">Go to <strong>App → Publish</strong> to list your service through the UI with a form</div>
                            </div>
                        </section>

                        {/* Agent Identity */}
                        <section id="agents" className="mb-20 scroll-mt-24">
                            <h2 className="text-3xl font-bold text-white mb-8 border-b border-white/10 pb-4">Agent Identity & Reputation</h2>
                            <p className="text-gray-400 mb-6">
                                Agents (both consumers and providers) can register an on-chain identity and build reputation:
                            </p>

                            <div className="bg-black/50 p-6 rounded-xl border border-white/10 font-mono text-sm not-prose mb-6">
                                <div className="text-gray-500 mb-2"># Register as an agent</div>
                                <div className="text-green-400 mb-4">automata agent register --name "My AI Agent"</div>
                                <div className="text-gray-500 mb-2"># Initialize reputation tracking</div>
                                <div className="text-green-400 mb-4">automata agent init-reputation</div>
                                <div className="text-gray-500 mb-2"># Get agent info</div>
                                <div className="text-green-400">automata agent info --address 0x123...</div>
                            </div>

                            <div className="p-4 rounded-xl bg-pink-500/10 border border-pink-500/20 not-prose">
                                <div className="font-medium text-pink-400 mb-1">Web App</div>
                                <div className="text-sm text-gray-400">Go to <strong>App → My Agents</strong> to manage your identity and view reputation</div>
                            </div>
                        </section>

                        {/* SDK Reference */}
                        <section id="sdk" className="mb-20 scroll-mt-24">
                            <h2 className="text-3xl font-bold text-white mb-8 border-b border-white/10 pb-4">SDK Reference</h2>
                            <p className="text-gray-400 mb-6">
                                The TypeScript SDK provides programmatic access to all automata features:
                            </p>

                            <div className="bg-black/50 p-6 rounded-xl border border-white/10 font-mono text-sm not-prose mb-6 overflow-x-auto">
                                <pre className="text-gray-300">{`import { AutomataClient } from '@automata/sdk';
import { cheapestAgentPlugin } from '@automata/sdk/plugins';

// Initialize client with plugins
const client = new AutomataClient({
  network: 'testnet',
  plugins: [
    cheapestAgentPlugin({ 
      tags: ['inference'], 
      minReputation: 80 
    })
  ]
});

// Create a usage wallet
const wallet = await client.createUsageWallet(1.0); // 1 APT

// Attach a spending policy
await client.attachPolicy(wallet.address, {
  spender: agentAddress,
  maxPerCall: 0.1,
  allowedTags: ['inference', 'generation']
});

// Make a paid API call
const response = await client.call({
  api: 'openai-gpt4',
  path: '/v1/chat/completions',
  wallet: wallet.address,
  body: { prompt: 'Hello, world!' }
});`}</pre>
                            </div>

                            <h3 className="text-xl font-bold text-white mb-4">Available Plugins</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 not-prose">
                                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                    <div className="font-bold text-blue-400 mb-1">cheapestAgentPlugin</div>
                                    <div className="text-sm text-gray-400">Automatically selects the cheapest provider matching criteria</div>
                                </div>
                                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                    <div className="font-bold text-purple-400 mb-1">bestReputationPlugin</div>
                                    <div className="text-sm text-gray-400">Selects the provider with highest reputation</div>
                                </div>
                                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                    <div className="font-bold text-green-400 mb-1">selectorPlugin</div>
                                    <div className="text-sm text-gray-400">Custom strategy: cheapest, best-reputation, or balanced</div>
                                </div>
                            </div>
                        </section>

                        {/* CLI Reference */}
                        <section id="cli" className="mb-20 scroll-mt-24">
                            <h2 className="text-3xl font-bold text-white mb-8 border-b border-white/10 pb-4">CLI Reference</h2>
                            <p className="text-gray-400 mb-6">
                                Complete command reference for the <code>automata</code> CLI:
                            </p>

                            <div className="space-y-6 not-prose">
                                <CLICommand
                                    category="Wallet"
                                    commands={[
                                        { cmd: 'automata wallet create', desc: 'Create a new usage wallet', opts: '--fund <amount>, --name <name>' },
                                        { cmd: 'automata wallet balance <address>', desc: 'Check wallet balance', opts: '' },
                                    ]}
                                />
                                <CLICommand
                                    category="Policy"
                                    commands={[
                                        { cmd: 'automata policy attach', desc: 'Attach spending policy to wallet', opts: '--wallet, --spender, --max-per-call, --allowed-tags' },
                                        { cmd: 'automata policy list', desc: 'List policies for a wallet', opts: '--wallet' },
                                    ]}
                                />
                                <CLICommand
                                    category="Discovery"
                                    commands={[
                                        { cmd: 'automata search <query>', desc: 'Search for services', opts: '--max-price' },
                                    ]}
                                />
                                <CLICommand
                                    category="API Calls"
                                    commands={[
                                        { cmd: 'automata call <api> <path>', desc: 'Call a paid service', opts: '--wallet, --data' },
                                    ]}
                                />
                                <CLICommand
                                    category="Agent"
                                    commands={[
                                        { cmd: 'automata agent register', desc: 'Register agent identity', opts: '--name' },
                                        { cmd: 'automata agent init-reputation', desc: 'Initialize reputation tracking', opts: '' },
                                        { cmd: 'automata agent info', desc: 'Get agent information', opts: '--address' },
                                    ]}
                                />
                                <CLICommand
                                    category="Publishing"
                                    commands={[
                                        { cmd: 'automata publish <file>', desc: 'Publish a service', opts: '--name, --price, --endpoint' },
                                    ]}
                                />
                            </div>
                        </section>

                        {/* Indexer API */}
                        <section id="indexer" className="mb-20 scroll-mt-24">
                            <h2 className="text-3xl font-bold text-white mb-8 border-b border-white/10 pb-4">Indexer API</h2>
                            <p className="text-gray-400 mb-6">
                                The Indexer Service provides a REST API for querying the marketplace:
                            </p>

                            <div className="space-y-4 not-prose">
                                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="px-2 py-0.5 rounded bg-green-500/20 text-green-400 text-xs font-mono">GET</span>
                                        <code className="text-blue-400">/services</code>
                                    </div>
                                    <p className="text-sm text-gray-400 mb-2">List all services with filtering</p>
                                    <code className="text-xs text-gray-500">?q=search&tags=ai,audio&maxPrice=1000&minReputation=80</code>
                                </div>
                                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="px-2 py-0.5 rounded bg-green-500/20 text-green-400 text-xs font-mono">GET</span>
                                        <code className="text-blue-400">/services/:name</code>
                                    </div>
                                    <p className="text-sm text-gray-400">Get a specific service by name</p>
                                </div>
                                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="px-2 py-0.5 rounded bg-green-500/20 text-green-400 text-xs font-mono">GET</span>
                                        <code className="text-blue-400">/discover/cheapest</code>
                                    </div>
                                    <p className="text-sm text-gray-400 mb-2">Find the cheapest service matching criteria</p>
                                    <code className="text-xs text-gray-500">?tags=inference&minReputation=80</code>
                                </div>
                                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 text-xs font-mono">POST</span>
                                        <code className="text-blue-400">/sync</code>
                                    </div>
                                    <p className="text-sm text-gray-400">Force re-sync from blockchain</p>
                                </div>
                            </div>
                        </section>
                    </div>
                </main>
            </div>
        </div>
    );
}

function CLICommand({ category, commands }: { category: string; commands: { cmd: string; desc: string; opts: string }[] }) {
    return (
        <div className="rounded-xl bg-white/5 border border-white/10 overflow-hidden">
            <div className="px-4 py-2 bg-black/30 border-b border-white/10">
                <span className="font-bold text-white">{category}</span>
            </div>
            <div className="divide-y divide-white/5">
                {commands.map(c => (
                    <div key={c.cmd} className="p-4">
                        <code className="text-blue-400 font-mono text-sm">{c.cmd}</code>
                        <p className="text-sm text-gray-400 mt-1">{c.desc}</p>
                        {c.opts && <code className="text-xs text-gray-500 mt-1 block">Options: {c.opts}</code>}
                    </div>
                ))}
            </div>
        </div>
    );
}
