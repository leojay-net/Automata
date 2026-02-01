'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

const data = [
    { name: '00:00', requests: 4000, latency: 240 },
    { name: '04:00', requests: 3000, latency: 139 },
    { name: '08:00', requests: 2000, latency: 980 },
    { name: '12:00', requests: 2780, latency: 390 },
    { name: '16:00', requests: 1890, latency: 480 },
    { name: '20:00', requests: 2390, latency: 380 },
    { name: '24:00', requests: 3490, latency: 430 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-neutral-900/90 border border-white/10 p-4 rounded-xl backdrop-blur-md shadow-xl text-white">
                <p className="font-mono text-sm text-gray-400 mb-2">{label}</p>
                <p className="font-bold text-blue-400">
                    Requests: {payload[0].value.toLocaleString()}
                </p>
                <p className="text-sm text-purple-400">
                    Latency: {payload[1].value}ms
                </p>
            </div>
        );
    }
    return null;
};

export default function UsageChart() {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full h-[400px] min-h-[400px] p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-xl overflow-hidden"
        >
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-xl font-bold text-white">Network Activity</h3>
                    <p className="text-sm text-gray-400">Real-time inference requests & latency</p>
                </div>
                <div className="flex gap-2">
                    <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-mono border border-blue-500/20">LIVE</span>
                    <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-mono border border-purple-500/20">24H</span>
                </div>
            </div>

            <ResponsiveContainer width="100%" height="85%">
                <AreaChart
                    data={data}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                    <defs>
                        <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#60A5FA" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#60A5FA" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#C084FC" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#C084FC" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis
                        dataKey="name"
                        stroke="#666"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        stroke="#666"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `${value / 1000}k`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                        type="monotone"
                        dataKey="requests"
                        stroke="#60A5FA"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorRequests)"
                    />
                    <Area
                        type="monotone"
                        dataKey="latency"
                        stroke="#C084FC"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorLatency)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </motion.div>
    );
}
