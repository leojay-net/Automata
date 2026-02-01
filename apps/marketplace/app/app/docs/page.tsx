'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
    Book,
    Terminal,
    Code2,
    Wallet,
    Shield,
    Zap,
    Search,
    Copy,
    Check,
    ChevronRight,
    ExternalLink
} from 'lucide-react';

const CLI_COMMANDS = [
    {
        category: 'Wallet Management',
        icon: Wallet,
        commands: [
            {
                cmd: 'automata wallet create',
                description: 'Create a new usage wallet with optional initial balance',
                options: ['--balance <amount>', '--name <name>'],
                example: 'automata wallet create --balance 1.0 --name "AI Agent Wallet"'
            },
            {
                cmd: 'automata wallet list',
                description: 'List all your usage wallets',
                options: [],
                example: 'automata wallet list'
            },
            {
                cmd: 'automata wallet deposit',
                description: 'Deposit APT into a usage wallet',
                options: ['--wallet <address>', '--amount <amount>'],
                example: 'automata wallet deposit --wallet 0x123... --amount 5.0'
            }
        ]
    },
    {
        category: 'Policy Management',
        icon: Shield,
        commands: [
            {
                cmd: 'automata policy create',
                description: 'Create a spend policy with limits',
                options: ['--max-per-call <amount>', '--allowed-tags <tags>'],
                example: 'automata policy create --max-per-call 0.1 --allowed-tags inference,generation'
            },
            {
                cmd: 'automata policy attach',
                description: 'Attach a policy to a usage wallet',
                options: ['--wallet <address>', '--policy <address>'],
                example: 'automata policy attach --wallet 0x123... --policy 0x456...'
            },
            {
                cmd: 'automata policy list',
                description: 'List all policies attached to a wallet',
                options: ['--wallet <address>'],
                example: 'automata policy list --wallet 0x123...'
            }
        ]
    },
    {
        category: 'Service Discovery',
        icon: Search,
        commands: [
            {
                cmd: 'automata search',
                description: 'Search for services in the marketplace',
                options: ['--tag <tag>', '--max-price <amount>'],
                example: 'automata search "gpt-4" --max-price 0.05 --tag inference'
            }
        ]
    },
    {
        category: 'Service Calls',
        icon: Zap,
        commands: [
            {
                cmd: 'automata call',
                description: 'Call a paid API service',
                options: ['--service <id>', '--wallet <address>', '--data <json>'],
                example: 'automata call --service openai-gpt4 --wallet 0x123... --data \'{"prompt": "Hello"}\''
            }
        ]
    },
    {
        category: 'Agent Identity',
        icon: Code2,
        commands: [
            {
                cmd: 'automata agent register',
                description: 'Register as an agent on-chain',
                options: ['--name <name>'],
                example: 'automata agent register --name "My AI Agent"'
            },
            {
                cmd: 'automata agent init-reputation',
                description: 'Initialize on-chain reputation',
                options: [],
                example: 'automata agent init-reputation'
            },
            {
                cmd: 'automata agent info',
                description: 'Get agent information and stats',
                options: ['--address <address>'],
                example: 'automata agent info --address 0x123...'
            }
        ]
    },
    {
        category: 'Publishing',
        icon: ExternalLink,
        commands: [
            {
                cmd: 'automata publish',
                description: 'Publish a service to the marketplace',
                options: ['--name <name>', '--endpoint <url>', '--price <amount>'],
                example: 'automata publish --name "My API" --endpoint https://api.example.com --price 0.01'
            }
        ]
    }
];

export default function DocsPage() {
    const [mounted, setMounted] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

    useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopiedCmd(text);
        setTimeout(() => setCopiedCmd(null), 2000);
    };

    const filteredCommands = CLI_COMMANDS.map(cat => ({
        ...cat,
        commands: cat.commands.filter(cmd =>
            cmd.cmd.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cmd.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
    })).filter(cat => cat.commands.length > 0);

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            {/* Header */}
            <div>
                <motion.h1
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl font-bold mb-2"
                >
                    CLI Documentation
                </motion.h1>
                <p className="text-gray-400">Complete reference for the automata command-line interface</p>
            </div>

            {/* Quick Start */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 p-6"
            >
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Terminal size={20} className="text-blue-400" />
                    Quick Start
                </h2>
                <div className="space-y-3">
                    <div className="flex items-center gap-4">
                        <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-sm">1</span>
                        <code className="flex-1 px-4 py-2 rounded-lg bg-black/30 text-green-400 font-mono text-sm">npm install -g @automata/cli</code>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-sm">2</span>
                        <code className="flex-1 px-4 py-2 rounded-lg bg-black/30 text-green-400 font-mono text-sm">automata wallet create --balance 1.0</code>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-sm">3</span>
                        <code className="flex-1 px-4 py-2 rounded-lg bg-black/30 text-green-400 font-mono text-sm">automata call --service openai-gpt4 --data '&#123;"prompt": "Hello"&#125;'</code>
                    </div>
                </div>
            </motion.div>

            {/* Search */}
            <div className="relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search commands..."
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-blue-500 focus:outline-none"
                />
            </div>

            {/* Commands */}
            <div className="space-y-8">
                {filteredCommands.map((category, catIdx) => (
                    <motion.div
                        key={category.category}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: catIdx * 0.1 }}
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <category.icon size={20} className="text-blue-400" />
                            <h2 className="text-xl font-bold">{category.category}</h2>
                        </div>

                        <div className="space-y-4">
                            {category.commands.map((cmd, idx) => (
                                <div
                                    key={cmd.cmd}
                                    className="rounded-xl bg-white/5 border border-white/10 overflow-hidden"
                                >
                                    <div className="p-4 border-b border-white/5">
                                        <div className="flex items-center justify-between mb-2">
                                            <code className="text-lg font-mono text-blue-400">{cmd.cmd}</code>
                                            <button
                                                onClick={() => copyToClipboard(cmd.cmd)}
                                                className="text-gray-500 hover:text-white p-1"
                                            >
                                                {copiedCmd === cmd.cmd ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                                            </button>
                                        </div>
                                        <p className="text-gray-400">{cmd.description}</p>
                                    </div>

                                    {cmd.options.length > 0 && (
                                        <div className="p-4 border-b border-white/5 bg-black/20">
                                            <div className="text-sm text-gray-500 mb-2">Options:</div>
                                            <div className="flex flex-wrap gap-2">
                                                {cmd.options.map(opt => (
                                                    <code key={opt} className="px-2 py-1 rounded bg-white/5 text-gray-300 text-xs font-mono">
                                                        {opt}
                                                    </code>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="p-4 bg-black/30">
                                        <div className="text-sm text-gray-500 mb-2">Example:</div>
                                        <div className="flex items-center gap-2">
                                            <code className="flex-1 text-green-400 font-mono text-sm overflow-x-auto">{cmd.example}</code>
                                            <button
                                                onClick={() => copyToClipboard(cmd.example)}
                                                className="text-gray-500 hover:text-white p-1 shrink-0"
                                            >
                                                {copiedCmd === cmd.example ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* SDK Reference Link */}
            <div className="rounded-2xl bg-white/5 border border-white/10 p-6 flex items-center justify-between">
                <div>
                    <h3 className="font-bold mb-1">Need the SDK?</h3>
                    <p className="text-gray-400 text-sm">Use the TypeScript SDK for programmatic integration</p>
                </div>
                <a
                    href="https://github.com/automata-protocol/sdk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 text-blue-400 hover:bg-white/10 transition-colors"
                >
                    View SDK Docs
                    <ChevronRight size={16} />
                </a>
            </div>
        </div>
    );
}
