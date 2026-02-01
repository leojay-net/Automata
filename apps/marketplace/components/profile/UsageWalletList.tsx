'use client';

import { motion } from 'framer-motion';
import { MOCK_USAGE_WALLETS } from '@/lib/data';
import { Wallet, Shield, Zap, Terminal } from 'lucide-react';
import { useState } from 'react';

export default function UsageWalletList() {
    const [selectedWallet, setSelectedWallet] = useState<string | null>(null);

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Wallet className="text-blue-400" /> Usage Wallets
            </h2>

            <div className="flex flex-col gap-6">
                {MOCK_USAGE_WALLETS.map((wallet, idx) => (
                    <motion.div
                        key={wallet.address}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/30 transition-all cursor-pointer group relative overflow-hidden"
                        onClick={() => setSelectedWallet(selectedWallet === wallet.address ? null : wallet.address)}
                    >
                        <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Terminal size={16} className="text-gray-500" />
                        </div>

                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-bold text-lg text-white">{wallet.name}</h3>
                                <div className="text-xs font-mono text-gray-500 flex items-center gap-2 mt-1">
                                    {wallet.address}
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-xl font-bold text-white">{wallet.balance} <span className="text-xs text-gray-400">APT</span></div>
                                <div className="text-xs text-gray-500">Available</div>
                            </div>
                        </div>

                        <div className="flex gap-2 mb-4">
                            {wallet.tags.map(tag => (
                                <span key={tag} className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-[10px] uppercase tracking-wider text-gray-400">
                                    {tag}
                                </span>
                            ))}
                        </div>

                        <div className="space-y-3">
                            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                <Shield size={12} /> Active Policies
                            </div>
                            {wallet.policies.map(policy => (
                                <div key={policy.id} className="p-3 rounded-lg bg-black/20 text-sm flex justify-between items-center border border-white/5">
                                    <div className="flex flex-col">
                                        <span className="text-gray-300 font-mono text-xs">{policy.spender}</span>
                                        <span className="text-[10px] text-gray-500">Spender</span>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-blue-400 font-mono text-xs">{policy.remaining} / {policy.dailyLimit} APT</div>
                                        <div className="text-[10px] text-gray-500">Daily Remaining</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {selectedWallet === wallet.address && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="mt-4 pt-4 border-t border-dashed border-white/10"
                            >
                                <div className="text-xs text-gray-500 mb-2 font-mono">CLI Command to Top-up:</div>
                                <div className="bg-black p-2 rounded border border-white/10 font-mono text-xs text-green-400 select-all">
                                    automata wallet fund --address {wallet.address} --amount 10
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                ))}
            </div>

            <div className="p-4 rounded-xl border border-dashed border-white/10 flex flex-col items-center justify-center text-gray-500 hover:text-white hover:border-white/20 transition-all cursor-pointer bg-white/5 hover:bg-white/10">
                <div className="mb-2 bg-white/10 p-2 rounded-full"><Zap size={20} /></div>
                <span className="text-sm">Create New Usage Wallet via CLI</span>
                <code className="mt-2 text-xs bg-black px-2 py-1 rounded text-gray-400">automata wallet create --fund 2APT</code>
            </div>
        </div>
    );
}
