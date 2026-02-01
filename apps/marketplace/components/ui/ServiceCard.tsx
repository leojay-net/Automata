'use client';

import { motion } from 'framer-motion';

interface ServiceCardProps {
    name: string;
    description: string;
    price: string;
    provider: string;
    reputation: number;
    onClick: () => void;
}

export default function ServiceCard({ name, description, price, provider, reputation, onClick }: ServiceCardProps) {
    return (
        <motion.div
            whileHover={{ scale: 1.05, rotate: 1 }}
            whileTap={{ scale: 0.95 }}
            className="group relative flex flex-col justify-between p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-xl hover:shadow-2xl hover:border-white/20 transition-all cursor-pointer"
            onClick={onClick}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />

            <div className="relative">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                        {name}
                    </h3>
                    <div className="px-2 py-1 rounded-full bg-white/10 text-xs font-mono text-blue-200">
                        R: {reputation}
                    </div>
                </div>

                <p className="text-sm text-gray-400 mb-6 line-clamp-2">
                    {description}
                </p>

                <div className="flex justify-between items-end mt-auto">
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-500 font-mono">PROVIDER</span>
                        <span className="text-sm font-mono truncate w-24">{provider.slice(0, 6)}...{provider.slice(-4)}</span>
                    </div>

                    <div className="text-right">
                        <span className="text-2xl font-bold text-white">{price}</span>
                        <span className="text-xs text-gray-400 ml-1">APT</span>
                    </div>
                </div>
            </div>

            {/* Hover Glint Effect */}
            <div className="absolute top-0 left-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 pointer-events-none" />
        </motion.div>
    );
}
