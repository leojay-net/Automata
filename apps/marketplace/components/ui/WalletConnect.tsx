'use client';

import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Wallet, LogOut, ChevronDown, User, FileText } from "lucide-react";
import Link from 'next/link';

export default function WalletConnect() {
    const { connect, disconnect, connected, account, wallets } = useWallet();
    const [isOpen, setIsOpen] = useState(false);

    // Hydration mismatch fix
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    const handleConnect = (walletName: string) => {
        connect(walletName);
        setIsOpen(false);
    };

    if (connected && account) {
        return (
            <div className="relative">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-2 px-6 py-2 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 font-mono text-sm shadow-lg backdrop-blur-md transition-all"
                >
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    {account.address.toString().slice(0, 6)}...{account.address.toString().slice(-4)}
                    <ChevronDown size={14} />
                </motion.button>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute right-0 mt-2 w-56 rounded-xl bg-neutral-900 border border-white/10 shadow-xl overflow-hidden z-50 py-2"
                        >
                            <Link href="/profile" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/5 transition-colors text-sm" onClick={() => setIsOpen(false)}>
                                <User size={16} />
                                My Profile
                            </Link>

                            <Link href="/docs" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/5 transition-colors text-sm" onClick={() => setIsOpen(false)}>
                                <FileText size={16} />
                                Documentation
                            </Link>

                            <div className="h-px bg-white/5 my-1 mx-4" />

                            <button
                                onClick={disconnect}
                                className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:bg-white/5 transition-colors text-sm"
                            >
                                <LogOut size={16} />
                                Disconnect
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    }


    return (
        <div className="relative">
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="px-6 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 font-bold text-white shadow-lg hover:shadow-blue-500/20 flex items-center gap-2"
            >
                <Wallet size={18} />
                Connect Wallet
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-64 rounded-xl bg-neutral-900 border border-white/10 shadow-xl overflow-hidden z-50 p-2"
                    >
                        <div className="text-xs font-semibold text-gray-500 px-2 py-2 uppercase tracking-wider">
                            Select Wallet
                        </div>
                        {wallets?.map((wallet) => (
                            <button
                                key={wallet.name}
                                onClick={() => handleConnect(wallet.name)}
                                className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-white/10 transition-colors text-left"
                            >
                                <img src={wallet.icon} alt={wallet.name} className="w-6 h-6 rounded-md" />
                                <span className="font-bold">{wallet.name}</span>
                                {wallet.readyState === "Installed" && (
                                    <span className="ml-auto text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">
                                        Detected
                                    </span>
                                )}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
