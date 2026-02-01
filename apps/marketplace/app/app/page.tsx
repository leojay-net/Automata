'use client';

import { motion } from 'framer-motion';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Wallet, Zap, TrendingUp, Activity, Plus } from 'lucide-react';
import { SERVICES, MOCK_USAGE_WALLETS, MOCK_ACTIVITY } from '@/lib/data';
import dynamic from 'next/dynamic';

const UsageChart = dynamic(() => import('@/components/analytics/UsageChart'), { ssr: false });

export default function AppDashboard() {
    const { connected } = useWallet();
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    const totalBalance = MOCK_USAGE_WALLETS.reduce((sum, w) => sum + parseFloat(w.balance), 0);
    const recentTxCount = MOCK_ACTIVITY.filter(a => a.status === 'Success').length;

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <motion.h1
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl font-bold mb-2"
                    >
                        Dashboard
                    </motion.h1>
                    <p className="text-gray-400">Overview of your automata activity</p>
                </div>

                {connected && (
                    <Link href="/app/wallets">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
                        >
                            <Plus size={18} />
                            New Wallet
                        </motion.button>
                    </Link>
                )}
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Total Balance"
                    value={`${totalBalance.toFixed(2)} APT`}
                    change="+12.5%"
                    icon={Wallet}
                    color="blue"
                />
                <StatCard
                    title="Active Wallets"
                    value={MOCK_USAGE_WALLETS.length.toString()}
                    change="2 active"
                    icon={Zap}
                    color="purple"
                />
                <StatCard
                    title="Total Transactions"
                    value={recentTxCount.toString()}
                    change="This week"
                    icon={Activity}
                    color="green"
                />
                <StatCard
                    title="Services Used"
                    value={new Set(MOCK_ACTIVITY.map(a => a.service)).size.toString()}
                    change="5 available"
                    icon={TrendingUp}
                    color="orange"
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
                        <h2 className="text-lg font-bold mb-4">Usage Over Time</h2>
                        <UsageChart />
                    </div>
                </div>

                <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold">Quick Actions</h2>
                    </div>
                    <div className="space-y-3">
                        <QuickAction href="/app/wallets" label="Create Usage Wallet" icon={Wallet} />
                        <QuickAction href="/app/policies" label="Attach Policy" icon={Zap} />
                        <QuickAction href="/app/publish" label="Publish Service" icon={Plus} />
                        <QuickAction href="/app/services" label="Browse Marketplace" icon={ArrowUpRight} />
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold">Recent Activity</h2>
                    <Link href="/app/analytics" className="text-sm text-blue-400 hover:text-blue-300">
                        View All →
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="text-gray-500 text-xs uppercase border-b border-white/5">
                            <tr>
                                <th className="text-left py-3 px-2">Service</th>
                                <th className="text-left py-3 px-2">Wallet</th>
                                <th className="text-left py-3 px-2">Cost</th>
                                <th className="text-left py-3 px-2">Time</th>
                                <th className="text-right py-3 px-2">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {MOCK_ACTIVITY.slice(0, 5).map((tx) => (
                                <tr key={tx.id} className="hover:bg-white/5">
                                    <td className="py-3 px-2 font-medium">{tx.service}</td>
                                    <td className="py-3 px-2 text-gray-400">{tx.wallet}</td>
                                    <td className="py-3 px-2 font-mono">{tx.cost}</td>
                                    <td className="py-3 px-2 text-gray-500">{tx.timestamp}</td>
                                    <td className="py-3 px-2 text-right">
                                        <span className={`px-2 py-1 rounded-full text-xs ${tx.status === 'Success'
                                                ? 'bg-green-500/10 text-green-400'
                                                : 'bg-red-500/10 text-red-400'
                                            }`}>
                                            {tx.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, change, icon: Icon, color }: {
    title: string;
    value: string;
    change: string;
    icon: React.ElementType;
    color: 'blue' | 'purple' | 'green' | 'orange';
}) {
    const colors = {
        blue: 'from-blue-500/20 to-blue-600/5 border-blue-500/20',
        purple: 'from-purple-500/20 to-purple-600/5 border-purple-500/20',
        green: 'from-green-500/20 to-green-600/5 border-green-500/20',
        orange: 'from-orange-500/20 to-orange-600/5 border-orange-500/20',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-xl bg-gradient-to-br ${colors[color]} border p-5`}
        >
            <div className="flex justify-between items-start mb-3">
                <Icon size={20} className="text-gray-400" />
                <span className="text-xs text-gray-500">{change}</span>
            </div>
            <div className="text-2xl font-bold mb-1">{value}</div>
            <div className="text-sm text-gray-400">{title}</div>
        </motion.div>
    );
}

function QuickAction({ href, label, icon: Icon }: { href: string; label: string; icon: React.ElementType }) {
    return (
        <Link href={href}>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all group">
                <Icon size={18} className="text-gray-400 group-hover:text-white" />
                <span className="text-sm text-gray-300 group-hover:text-white">{label}</span>
                <ArrowUpRight size={14} className="ml-auto text-gray-600 group-hover:text-gray-400" />
            </div>
        </Link>
    );
}
