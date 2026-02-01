'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import ServiceCard from './ui/ServiceCard';
import WalletConnect from './ui/WalletConnect';
import { SERVICES } from '../lib/data';

const UsageChart = dynamic(() => import('./analytics/UsageChart'), { ssr: false });

import Link from 'next/link';
import { Book, LayoutDashboard, Rocket } from 'lucide-react';

export default function Dashboard() {
    const [searchTerm, setSearchTerm] = useState('');
    const router = useRouter();

    const filteredServices = SERVICES.filter(service =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto">
            <header className="flex flex-col md:flex-row justify-between items-center mb-12">
                <div className="mb-6 md:mb-0">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-2"
                    >
                        automata Market
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-400"
                    >
                        Decentralized AI Service Protocol
                    </motion.p>
                </div>

                <div className="flex gap-4 items-center">
                    <nav className="hidden md:flex gap-2 bg-white/5 rounded-xl p-1.5 border border-white/10 mr-2">
                        <Link
                            href="/app"
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg transition-all hover:opacity-90"
                        >
                            <Rocket size={16} />
                            Launch App
                        </Link>
                        <Link
                            href="/docs"
                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white rounded-lg transition-all"
                        >
                            <Book size={16} />
                            Docs
                        </Link>
                    </nav>

                    <motion.input
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: '300px', opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        type="text"
                        placeholder="Search services..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500/50 backdrop-blur-sm transition-all"
                    />
                    <WalletConnect />
                </div>
            </header>

            <div className="mb-12">
                <UsageChart />
            </div>

            <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
                {filteredServices.map((service, index) => (
                    <motion.div
                        key={service.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <ServiceCard
                            name={service.name}
                            description={service.description}
                            price={service.price}
                            provider={service.provider}
                            reputation={service.reputation}
                            onClick={() => router.push(`/service/${service.id}`)}
                        />
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
}
