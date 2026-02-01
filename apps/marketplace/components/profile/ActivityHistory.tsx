'use client';

import { MOCK_ACTIVITY } from '@/lib/data';
import { motion } from 'framer-motion';
import { Activity, Clock, AlertCircle, CheckCircle } from 'lucide-react';

export default function ActivityHistory() {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Activity className="text-purple-400" /> Recent Activity
            </h2>

            <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-white/5 text-gray-400 font-mono text-xs uppercase">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Service</th>
                                <th className="px-6 py-4 font-semibold">Wallet</th>
                                <th className="px-6 py-4 font-semibold">Cost</th>
                                <th className="px-6 py-4 font-semibold">Time</th>
                                <th className="px-6 py-4 font-semibold text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {MOCK_ACTIVITY.map((tx, idx) => (
                                <motion.tr
                                    key={tx.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="hover:bg-white/5 transition-colors"
                                >
                                    <td className="px-6 py-4 font-medium text-white">{tx.service}</td>
                                    <td className="px-6 py-4 text-gray-400 font-mono text-xs">{tx.wallet}</td>
                                    <td className="px-6 py-4 text-gray-300 font-mono">{tx.cost}</td>
                                    <td className="px-6 py-4 text-gray-500 flex items-center gap-2">
                                        <Clock size={14} /> {tx.timestamp}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${tx.status === 'Success'
                                                ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                                : 'bg-red-500/10 text-red-400 border-red-500/20'
                                            }`}>
                                            {tx.status === 'Success' ? <CheckCircle size={10} /> : <AlertCircle size={10} />}
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
