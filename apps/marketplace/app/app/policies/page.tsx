'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { useState, useEffect } from 'react';
import {
    Shield,
    Plus,
    Trash2,
    Terminal,
    AlertCircle
} from 'lucide-react';
import { attachPolicy, fetchUsageWallet } from '@/lib/sdk';
import { useToast } from '@/components/ui/Toast';

export default function PoliciesPage() {
    const { connected, account, signAndSubmitTransaction } = useWallet();
    const { success, error } = useToast();
    const [mounted, setMounted] = useState(false);

    // UI State
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [creating, setCreating] = useState(false);
    const [loading, setLoading] = useState(false);

    // Data State
    const [allPolicies, setAllPolicies] = useState<any[]>([]);

    // Form state
    const [spenderAddress, setSpenderAddress] = useState('');
    const [maxDaily, setMaxDaily] = useState('10.0');
    const [allowedTags, setAllowedTags] = useState('');

    useEffect(() => setMounted(true), []);

    const loadPolicies = async () => {
        if (connected && account?.address) {
            setLoading(true);

            // Get known spenders from local storage
            const saved = localStorage.getItem(`automata_spenders_${account.address.toString()}`);
            const knownSpenders = saved ? JSON.parse(saved) : [];

            const wallet = await fetchUsageWallet(account.address.toString(), knownSpenders);
            if (wallet && wallet.policies) {
                // Enrich policy data with wallet info
                const enrichedPolicies = wallet.policies.map((p: any) => ({
                    ...p,
                    walletName: wallet.name || 'Usage Wallet',
                    id: `${wallet.address}-${p.spender}`
                }));
                setAllPolicies(enrichedPolicies);
            } else {
                setAllPolicies([]);
            }
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPolicies();
    }, [connected, account]);

    const handleCreatePolicy = async () => {
        if (!connected || !spenderAddress) return;
        setCreating(true);

        const result = await attachPolicy({
            spenderAddress,
            maxDaily: parseFloat(maxDaily),
            signAndSubmitTransaction: signAndSubmitTransaction as any
        });

        setCreating(false);
        if (result.success) {
            // Save to local storage for discovery
            const saved = localStorage.getItem(`automata_spenders_${account?.address.toString()}`);
            const current = saved ? JSON.parse(saved) : [];
            if (!current.includes(spenderAddress)) {
                current.push(spenderAddress);
                localStorage.setItem(`automata_spenders_${account?.address.toString()}`, JSON.stringify(current));
            }

            setShowCreateModal(false);
            setSpenderAddress('');
            setMaxDaily('10.0');
            setAllowedTags('');
            success('Policy Attached', `Address ${spenderAddress.slice(0, 6)}... can now spend ${maxDaily} APT/day`);
            loadPolicies(); // Refresh list
        } else {
            error('Failed to Attach Policy', result.error || 'Transaction failed');
        }
    };

    if (!mounted) return null;

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <motion.h1
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl font-bold mb-2"
                    >
                        Spending Policies
                    </motion.h1>
                    <p className="text-gray-400">Control how agents can spend from your Usage Wallets</p>
                </div>

                {connected && (
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
                    >
                        <Plus size={18} />
                        Attach Policy
                    </motion.button>
                )}
            </div>

            {/* CLI Hint */}
            <div className="p-4 rounded-xl bg-black/30 border border-white/10 flex items-center gap-4">
                <Terminal className="text-gray-500" size={20} />
                <div className="flex-1">
                    <span className="text-gray-400 text-sm">CLI equivalent: </span>
                    <code className="text-green-400 font-mono text-sm">automata policy attach --spender 0x... --max-daily 10 --allowed-tags ai,data</code>
                </div>
            </div>

            {/* Info Box */}
            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-start gap-3">
                <AlertCircle className="text-blue-400 mt-0.5" size={20} />
                <div>
                    <div className="font-medium text-blue-200">How Policies Work</div>
                    <p className="text-sm text-blue-200/70 mt-1">
                        Policies authorize specific agents (spenders) to draw from your Usage Wallets up to a daily limit.
                        This enables autonomous AI agents to pay for services without manual approval per transaction.
                    </p>
                </div>
            </div>

            {/* Policies Table */}
            <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="text-gray-500 text-xs uppercase border-b border-white/10 bg-black/20">
                            <tr>
                                <th className="text-left py-4 px-6 font-semibold">Spender</th>
                                <th className="text-left py-4 px-6 font-semibold">Wallet</th>
                                <th className="text-left py-4 px-6 font-semibold">Daily Limit</th>
                                <th className="text-left py-4 px-6 font-semibold">Used Today</th>
                                <th className="text-left py-4 px-6 font-semibold">Status</th>
                                <th className="text-right py-4 px-6 font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {!connected ? (
                                <tr>
                                    <td colSpan={6} className="py-8 text-center text-gray-500">Connect wallet to view policies</td>
                                </tr>
                            ) : loading ? (
                                <tr>
                                    <td colSpan={6} className="py-8 text-center text-gray-400">Loading policies...</td>
                                </tr>
                            ) : allPolicies.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-8 text-center text-gray-500">No active policies found</td>
                                </tr>
                            ) : (
                                allPolicies.map((policy, idx) => {
                                    const usedPercent = policy.dailyLimit > 0
                                        ? ((parseFloat(policy.dailyLimit) - parseFloat(policy.remaining)) / parseFloat(policy.dailyLimit)) * 100
                                        : 0;

                                    return (
                                        <motion.tr
                                            key={policy.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="hover:bg-white/5 transition-colors"
                                        >
                                            <td className="py-4 px-6">
                                                <code className="text-xs font-mono text-white bg-black/30 px-2 py-1 rounded">
                                                    {policy.spender}
                                                </code>
                                            </td>
                                            <td className="py-4 px-6 text-gray-400">{policy.walletName}</td>
                                            <td className="py-4 px-6 font-mono">{policy.dailyLimit} APT</td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-24 h-2 bg-black/30 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full ${usedPercent > 80 ? 'bg-red-500' : usedPercent > 50 ? 'bg-yellow-500' : 'bg-green-500'
                                                                }`}
                                                            style={{ width: `${usedPercent}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-gray-500 text-xs">{policy.remaining} left</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className="px-2 py-1 rounded-full text-xs bg-green-500/10 text-green-400 border border-green-500/20">
                                                    Active
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                <button className="p-2 rounded-lg hover:bg-red-500/10 text-gray-500 hover:text-red-400 transition-colors">
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </motion.tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Modal */}
            <AnimatePresence>
                {showCreateModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                        onClick={() => setShowCreateModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-md rounded-2xl bg-neutral-900 border border-white/10 p-6 shadow-2xl"
                        >
                            <h2 className="text-xl font-bold mb-4">Attach Spending Policy</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Spender Address</label>
                                    <input
                                        type="text"
                                        value={spenderAddress}
                                        onChange={(e) => setSpenderAddress(e.target.value)}
                                        placeholder="0x..."
                                        className="w-full px-4 py-3 rounded-lg bg-black/30 border border-white/10 text-white font-mono text-sm focus:border-blue-500 focus:outline-none"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">The agent/contract allowed to spend</p>
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Max Daily Spend (APT)</label>
                                    <input
                                        type="number"
                                        value={maxDaily}
                                        onChange={(e) => setMaxDaily(e.target.value)}
                                        step="0.1"
                                        min="0"
                                        className="w-full px-4 py-3 rounded-lg bg-black/30 border border-white/10 text-white font-mono focus:border-blue-500 focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Allowed Tags (optional)</label>
                                    <input
                                        type="text"
                                        value={allowedTags}
                                        onChange={(e) => setAllowedTags(e.target.value)}
                                        placeholder="ai, data, inference"
                                        className="w-full px-4 py-3 rounded-lg bg-black/30 border border-white/10 text-white focus:border-blue-500 focus:outline-none"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Comma-separated service categories this agent can access</p>
                                </div>

                                <div className="p-3 rounded-lg bg-black/30 border border-white/5">
                                    <div className="text-xs text-gray-500 mb-1">CLI Equivalent</div>
                                    <code className="text-sm text-green-400 font-mono break-all">
                                        automata policy attach --spender {spenderAddress || '0x...'} --max-daily {maxDaily}{allowedTags ? ` --allowed-tags ${allowedTags}` : ''}
                                    </code>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => setShowCreateModal(false)}
                                    className="flex-1 py-3 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCreatePolicy}
                                    disabled={creating || !spenderAddress}
                                    className="flex-1 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors disabled:opacity-50"
                                >
                                    {creating ? 'Attaching...' : 'Attach Policy'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
