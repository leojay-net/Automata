'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import {
    BarChart3,
    TrendingUp,
    TrendingDown,
    Calendar,
    Download,
    Filter
} from 'lucide-react';
import { MOCK_ACTIVITY, MOCK_USAGE_WALLETS } from '@/lib/data';

const UsageChart = dynamic(() => import('@/components/analytics/UsageChart'), { ssr: false });

export default function AnalyticsPage() {
    const [mounted, setMounted] = useState(false);
    const [timeRange, setTimeRange] = useState('7d');

    useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    // Calculate stats
    const totalSpent = MOCK_ACTIVITY
        .filter(a => a.status === 'Success')
        .reduce((sum, a) => sum + parseFloat(a.cost.replace(' APT', '')), 0);

    const successRate = (MOCK_ACTIVITY.filter(a => a.status === 'Success').length / MOCK_ACTIVITY.length) * 100;

    const serviceBreakdown = MOCK_ACTIVITY.reduce((acc, tx) => {
        acc[tx.service] = (acc[tx.service] || 0) + parseFloat(tx.cost.replace(' APT', ''));
        return acc;
    }, {} as Record<string, number>);

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
                        Analytics
                    </motion.h1>
                    <p className="text-gray-400">Monitor your automata usage and spending</p>
                </div>

                <div className="flex gap-3">
                    <select
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                        className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none"
                    >
                        <option value="24h">Last 24 Hours</option>
                        <option value="7d">Last 7 Days</option>
                        <option value="30d">Last 30 Days</option>
                        <option value="90d">Last 90 Days</option>
                    </select>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-colors">
                        <Download size={16} />
                        Export
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Total Spent"
                    value={`${totalSpent.toFixed(2)} APT`}
                    change="+23%"
                    trend="up"
                    subtitle="vs last period"
                />
                <StatCard
                    title="API Calls"
                    value={MOCK_ACTIVITY.length.toString()}
                    change="+12"
                    trend="up"
                    subtitle="this period"
                />
                <StatCard
                    title="Success Rate"
                    value={`${successRate.toFixed(1)}%`}
                    change="-2%"
                    trend="down"
                    subtitle="vs last period"
                />
                <StatCard
                    title="Avg Cost/Call"
                    value={`${(totalSpent / MOCK_ACTIVITY.length).toFixed(3)} APT`}
                    change="stable"
                    trend="neutral"
                    subtitle="per request"
                />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Chart */}
                <div className="lg:col-span-2 rounded-2xl bg-white/5 border border-white/10 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold">Spending Over Time</h2>
                        <div className="flex gap-2">
                            <button className="px-3 py-1 rounded-lg bg-blue-600/20 text-blue-400 text-sm">APT</button>
                            <button className="px-3 py-1 rounded-lg bg-white/5 text-gray-400 text-sm hover:text-white">Calls</button>
                        </div>
                    </div>
                    <UsageChart />
                </div>

                {/* Service Breakdown */}
                <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
                    <h2 className="text-lg font-bold mb-6">By Service</h2>
                    <div className="space-y-4">
                        {Object.entries(serviceBreakdown)
                            .sort(([, a], [, b]) => b - a)
                            .map(([service, amount], idx) => {
                                const percent = (amount / totalSpent) * 100;
                                return (
                                    <div key={service}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-gray-300">{service}</span>
                                            <span className="text-gray-500">{amount.toFixed(2)} APT</span>
                                        </div>
                                        <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${percent}%` }}
                                                transition={{ delay: idx * 0.1, duration: 0.5 }}
                                                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                </div>
            </div>

            {/* Wallet Breakdown */}
            <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
                <h2 className="text-lg font-bold mb-6">Wallet Activity</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {MOCK_USAGE_WALLETS.map(wallet => {
                        const walletTxs = MOCK_ACTIVITY.filter(a => a.wallet === wallet.name);
                        const walletSpent = walletTxs.reduce((sum, a) => sum + parseFloat(a.cost.replace(' APT', '')), 0);

                        return (
                            <div key={wallet.address} className="p-4 rounded-xl bg-black/30 border border-white/5">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <div className="font-medium text-white">{wallet.name}</div>
                                        <code className="text-xs text-gray-500">{wallet.address}</code>
                                    </div>
                                    <span className="text-lg font-bold text-white">{wallet.balance} APT</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-white/5">
                                    <div>
                                        <div className="text-xs text-gray-500">Transactions</div>
                                        <div className="font-mono text-white">{walletTxs.length}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500">Spent</div>
                                        <div className="font-mono text-white">{walletSpent.toFixed(2)} APT</div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Transaction History */}
            <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
                <div className="p-6 border-b border-white/5 flex justify-between items-center">
                    <h2 className="text-lg font-bold">Transaction History</h2>
                    <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-white">
                        <Filter size={14} />
                        Filter
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="text-gray-500 text-xs uppercase border-b border-white/10 bg-black/20">
                            <tr>
                                <th className="text-left py-4 px-6 font-semibold">Service</th>
                                <th className="text-left py-4 px-6 font-semibold">Wallet</th>
                                <th className="text-left py-4 px-6 font-semibold">Cost</th>
                                <th className="text-left py-4 px-6 font-semibold">Time</th>
                                <th className="text-right py-4 px-6 font-semibold">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {MOCK_ACTIVITY.map((tx, idx) => (
                                <motion.tr
                                    key={tx.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: idx * 0.03 }}
                                    className="hover:bg-white/5"
                                >
                                    <td className="py-4 px-6 font-medium text-white">{tx.service}</td>
                                    <td className="py-4 px-6 text-gray-400">{tx.wallet}</td>
                                    <td className="py-4 px-6 font-mono">{tx.cost}</td>
                                    <td className="py-4 px-6 text-gray-500">{tx.timestamp}</td>
                                    <td className="py-4 px-6 text-right">
                                        <span className={`px-2 py-1 rounded-full text-xs ${tx.status === 'Success'
                                                ? 'bg-green-500/10 text-green-400'
                                                : 'bg-red-500/10 text-red-400'
                                            }`}>
                                            {tx.status}
                                        </span>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, change, trend, subtitle }: {
    title: string;
    value: string;
    change: string;
    trend: 'up' | 'down' | 'neutral';
    subtitle: string;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl bg-white/5 border border-white/10 p-5"
        >
            <div className="flex justify-between items-start mb-3">
                <span className="text-sm text-gray-400">{title}</span>
                <div className={`flex items-center gap-1 text-xs ${trend === 'up' ? 'text-green-400' :
                        trend === 'down' ? 'text-red-400' : 'text-gray-400'
                    }`}>
                    {trend === 'up' && <TrendingUp size={12} />}
                    {trend === 'down' && <TrendingDown size={12} />}
                    {change}
                </div>
            </div>
            <div className="text-2xl font-bold mb-1">{value}</div>
            <div className="text-xs text-gray-500">{subtitle}</div>
        </motion.div>
    );
}
