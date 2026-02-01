'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { useState, useEffect } from 'react';
import {
    Wallet,
    Plus,
    Copy,
    Check,
    RefreshCw,
    Shield,
    Trash2,
    ExternalLink,
    Terminal
} from 'lucide-react';
import { depositToWallet, createUsageWallet, fetchUsageWallet } from '@/lib/sdk';
import { useToast } from '@/components/ui/Toast';
import Link from 'next/link';

export default function WalletsPage() {
    const { connected, account, signAndSubmitTransaction } = useWallet();
    const { success, error } = useToast();
    const [mounted, setMounted] = useState(false);

    // Create Modal State
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [creating, setCreating] = useState(false);
    const [fundAmount, setFundAmount] = useState('1.0');
    const [walletName, setWalletName] = useState('');

    // Fund Modal State
    const [showFundModal, setShowFundModal] = useState(false);
    const [funding, setFunding] = useState(false);
    const [depositAmount, setDepositAmount] = useState('1.0');

    const [copied, setCopied] = useState<string | null>(null);
    const [wallets, setWallets] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => setMounted(true), []);

    const loadWallets = async () => {
        if (connected && account?.address) {
            setLoading(true);
            const wallet = await fetchUsageWallet(account.address.toString());
            if (wallet) {
                setWallets([wallet]);
            } else {
                setWallets([]);
            }
            setLoading(false);
        }
    };

    useEffect(() => {
        loadWallets();
    }, [connected, account]);

    if (!mounted) return null;

    const handleCreateWallet = async () => {
        if (!connected) return;
        setCreating(true);

        const result = await createUsageWallet({
            fundAmount: parseFloat(fundAmount),
            signAndSubmitTransaction: signAndSubmitTransaction as any
        });

        setCreating(false);
        if (result.success) {
            setShowCreateModal(false);
            setFundAmount('1.0');
            setWalletName('');
            success('Wallet Created', `Usage wallet funded with ${fundAmount} APT`);
            loadWallets(); // Refresh list
        } else {
            error('Failed to Create Wallet', result.error || 'Transaction failed');
        }
    };

    const handleFundWallet = async () => {
        if (!connected) return;
        setFunding(true);

        const result = await depositToWallet({
            amount: parseFloat(depositAmount),
            signAndSubmitTransaction: signAndSubmitTransaction as any
        });

        setFunding(false);
        if (result.success) {
            setShowFundModal(false);
            setDepositAmount('1.0');
            success('Deposit Successful', `Added ${depositAmount} APT to usage wallet`);
            loadWallets(); // Refresh balance
        } else {
            error('Deposit Failed', result.error || 'Transaction failed');
        }
    };

    const copyAddress = (addr: string) => {
        navigator.clipboard.writeText(addr);
        setCopied(addr);
        setTimeout(() => setCopied(null), 2000);
    };

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
                        Usage Wallets
                    </motion.h1>
                    <p className="text-gray-400">Pre-funded accounts for AI service consumption</p>
                </div>

                {connected && (
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
                    >
                        <Plus size={18} />
                        Create Wallet
                    </motion.button>
                )}
            </div>

            {/* CLI Hint */}
            <div className="p-4 rounded-xl bg-black/30 border border-white/10 flex items-center gap-4">
                <Terminal className="text-gray-500" size={20} />
                <div className="flex-1">
                    <span className="text-gray-400 text-sm">CLI equivalent: </span>
                    <code className="text-green-400 font-mono text-sm">automata wallet create --fund 2APT</code>
                </div>
            </div>

            {/* Wallets Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {!connected ? (
                    <div className="col-span-2 text-center py-20 bg-white/5 rounded-2xl border border-white/10">
                        <Wallet size={48} className="mx-auto text-gray-600 mb-4" />
                        <h3 className="text-xl font-bold text-gray-400">Connect Wallet</h3>
                        <p className="text-gray-500 mt-2">Connect your Petra wallet to view usage accounts</p>
                    </div>
                ) : loading ? (
                    <div className="col-span-2 text-center py-20">
                        <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto" />
                    </div>
                ) : wallets.length === 0 ? (
                    <div className="col-span-2 text-center py-20 bg-white/5 rounded-2xl border border-white/10">
                        <Wallet size={48} className="mx-auto text-gray-600 mb-4" />
                        <h3 className="text-xl font-bold text-gray-400">No Usage Wallets</h3>
                        <p className="text-gray-500 mt-2">Create a new wallet to start consuming services</p>
                    </div>
                ) : (
                    wallets.map((wallet, idx) => (
                        <motion.div
                            key={wallet.address}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden"
                        >
                            {/* Header */}
                            <div className="p-6 border-b border-white/5">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-white">{wallet.name}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <code className="text-xs text-gray-500 font-mono">
                                                {typeof wallet.address === 'string' ? wallet.address : 'INVALID_ADDRESS'}
                                            </code>
                                            <button
                                                onClick={() => copyAddress(typeof wallet.address === 'string' ? wallet.address : '')}
                                                className="text-gray-500 hover:text-white"
                                            >
                                                {copied === wallet.address ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                        <span className="text-xs text-gray-500">Active</span>
                                    </div>
                                </div>

                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl font-bold text-white">{wallet.balance}</span>
                                    <span className="text-gray-500">APT</span>
                                </div>
                            </div>

                            {/* Tags */}
                            <div className="px-6 py-3 border-b border-white/5 flex gap-2">
                                {(wallet.tags || []).map((tag: any) => (
                                    <span key={typeof tag === 'string' ? tag : 'tag-' + Math.random()} className="px-2 py-0.5 rounded-md bg-white/5 text-xs text-gray-400 uppercase tracking-wider">
                                        {typeof tag === 'string' ? tag : JSON.stringify(tag)}
                                    </span>
                                ))}
                            </div>

                            {/* Policies */}
                            <div className="p-6">
                                <div className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-wider mb-3">
                                    <Shield size={12} />
                                    Active Policies ({wallet.policies ? wallet.policies.length : 0})
                                </div>
                                <div className="space-y-2">
                                    {wallet.policies && wallet.policies.map((policy: any) => (
                                        <div key={policy.id} className="p-3 rounded-lg bg-black/30 border border-white/5 flex justify-between items-center">
                                            <div>
                                                <code className="text-xs text-gray-300 font-mono">{policy.spender}</code>
                                                <div className="text-[10px] text-gray-600 mt-0.5">Spender</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm font-mono text-blue-400">{policy.remaining} / {policy.dailyLimit}</div>
                                                <div className="text-[10px] text-gray-600">Daily Limit</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="px-6 py-4 bg-black/20 border-t border-white/5 flex gap-3">
                                <button
                                    onClick={() => setShowFundModal(true)}
                                    className="flex-1 py-2 rounded-lg bg-blue-600/20 text-blue-400 text-sm font-medium hover:bg-blue-600/30 transition-colors"
                                >
                                    Fund Wallet
                                </button>
                                <Link href="/app/policies" className="flex-1 py-2 rounded-lg bg-white/5 text-gray-400 text-sm font-medium hover:bg-white/10 transition-colors text-center">
                                    Add Policy
                                </Link>
                            </div>
                        </motion.div>
                    )))}
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
                            <h2 className="text-xl font-bold mb-4">Create Usage Wallet</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Wallet Name</label>
                                    <input
                                        type="text"
                                        value={walletName}
                                        onChange={(e) => setWalletName(e.target.value)}
                                        placeholder="e.g., Production Inference"
                                        className="w-full px-4 py-3 rounded-lg bg-black/30 border border-white/10 text-white focus:border-blue-500 focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Initial Funding (APT)</label>
                                    <input
                                        type="number"
                                        value={fundAmount}
                                        onChange={(e) => setFundAmount(e.target.value)}
                                        step="0.1"
                                        min="0"
                                        className="w-full px-4 py-3 rounded-lg bg-black/30 border border-white/10 text-white font-mono focus:border-blue-500 focus:outline-none"
                                    />
                                </div>

                                <div className="p-3 rounded-lg bg-black/30 border border-white/5">
                                    <div className="text-xs text-gray-500 mb-1">CLI Equivalent</div>
                                    <code className="text-sm text-green-400 font-mono">
                                        automata wallet create --fund {fundAmount}APT
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
                                    onClick={handleCreateWallet}
                                    disabled={creating || !fundAmount}
                                    className="flex-1 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors disabled:opacity-50"
                                >
                                    {creating ? 'Creating...' : 'Create Wallet'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            {/* Fund Modal */}
            <AnimatePresence>
                {showFundModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                        onClick={() => setShowFundModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-md rounded-2xl bg-neutral-900 border border-white/10 p-6 shadow-2xl"
                        >
                            <h2 className="text-xl font-bold mb-4">Fund Usage Wallet</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Deposit Amount (APT)</label>
                                    <input
                                        type="number"
                                        value={depositAmount}
                                        onChange={(e) => setDepositAmount(e.target.value)}
                                        step="0.1"
                                        min="0"
                                        className="w-full px-4 py-3 rounded-lg bg-black/30 border border-white/10 text-white font-mono focus:border-blue-500 focus:outline-none"
                                    />
                                    <p className="mt-2 text-xs text-gray-500">
                                        This will transfer APT from your connected wallet to the usage wallet.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => setShowFundModal(false)}
                                    className="flex-1 py-3 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleFundWallet}
                                    disabled={funding || !depositAmount}
                                    className="flex-1 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium transition-colors disabled:opacity-50"
                                >
                                    {funding ? 'Depositing...' : 'Deposit Funds'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
