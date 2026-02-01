'use client';

import MainLayout from '@/components/layout/MainLayout';
import UsageWalletList from '@/components/profile/UsageWalletList';
import ActivityHistory from '@/components/profile/ActivityHistory';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import WalletConnect from '@/components/ui/WalletConnect';
import { motion } from 'framer-motion';

export default function ProfilePage() {
    const { connected, account } = useWallet();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    if (!connected) {
        return (
            <MainLayout>
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                    <h1 className="text-4xl font-bold mb-4">Connect to View Profile</h1>
                    <p className="text-gray-400 mb-8 max-w-md">
                        Please connect your Aptos wallet to manage your Usage Wallets, view transaction history, and configure spending policies.
                    </p>
                    <WalletConnect />
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="max-w-7xl mx-auto pt-6 pb-20">
                <div className="flex justify-between items-center mb-12">
                    <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white transition-colors">
                        <ArrowLeft size={20} className="mr-2" /> Back to Market
                    </Link>
                    <WalletConnect />
                </div>

                <div className="mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 className="text-4xl font-bold mb-2">My Console</h1>
                        <p className="text-gray-400">Manage your decentralized AI consumption infrastructure.</p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-1">
                        <UsageWalletList />
                    </div>

                    <div className="lg:col-span-2">
                        <ActivityHistory />
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
