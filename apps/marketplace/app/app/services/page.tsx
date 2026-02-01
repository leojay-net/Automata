'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Search,
    Filter,
    Star,
    Zap,
    ExternalLink,
    Terminal
} from 'lucide-react';
import { SERVICES } from '@/lib/data';

export default function ServicesPage() {
    const [mounted, setMounted] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [maxPrice, setMaxPrice] = useState<number | null>(null);

    useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    // Extract unique tags from services
    const allTags = ['inference', 'generation', 'audio', 'data', 'nlp'];

    const filteredServices = SERVICES.filter(service => {
        const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            service.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesPrice = maxPrice === null || parseFloat(service.price) <= maxPrice;
        return matchesSearch && matchesPrice;
    });

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div>
                <motion.h1
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl font-bold mb-2"
                >
                    Marketplace
                </motion.h1>
                <p className="text-gray-400">Discover and consume AI services with automata</p>
            </div>

            {/* CLI Hint */}
            <div className="p-4 rounded-xl bg-black/30 border border-white/10 flex items-center gap-4">
                <Terminal className="text-gray-500" size={20} />
                <div className="flex-1">
                    <span className="text-gray-400 text-sm">CLI equivalent: </span>
                    <code className="text-green-400 font-mono text-sm">automata search "gpt" --max-price 0.1</code>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search services..."
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-blue-500 focus:outline-none"
                    />
                </div>

                <div className="flex gap-2">
                    {allTags.map(tag => (
                        <button
                            key={tag}
                            onClick={() => setSelectedTags(
                                selectedTags.includes(tag)
                                    ? selectedTags.filter(t => t !== tag)
                                    : [...selectedTags, tag]
                            )}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedTags.includes(tag)
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                                }`}
                        >
                            {tag}
                        </button>
                    ))}
                </div>

                <select
                    value={maxPrice || ''}
                    onChange={(e) => setMaxPrice(e.target.value ? parseFloat(e.target.value) : null)}
                    className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-blue-500 focus:outline-none"
                >
                    <option value="">Any Price</option>
                    <option value="0.01">≤ 0.01 APT</option>
                    <option value="0.05">≤ 0.05 APT</option>
                    <option value="0.1">≤ 0.10 APT</option>
                </select>
            </div>

            {/* Results Count */}
            <div className="text-sm text-gray-500">
                Showing {filteredServices.length} of {SERVICES.length} services
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredServices.map((service, idx) => (
                    <motion.div
                        key={service.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                    >
                        <Link href={`/service/${service.id}`}>
                            <div className="group rounded-2xl bg-white/5 border border-white/10 overflow-hidden hover:border-blue-500/30 transition-all hover:shadow-lg hover:shadow-blue-500/5">
                                {/* Header */}
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                                                {service.name}
                                            </h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className={`w-2 h-2 rounded-full ${service.status === 'Active' ? 'bg-green-500' : 'bg-yellow-500'
                                                    }`} />
                                                <span className="text-xs text-gray-500">{service.status}</span>
                                            </div>
                                        </div>
                                        <span className="px-2 py-1 rounded-md bg-white/5 text-xs text-gray-400 uppercase">
                                            {service.type}
                                        </span>
                                    </div>

                                    <p className="text-sm text-gray-400 line-clamp-2 mb-4">
                                        {service.description}
                                    </p>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1">
                                            <Star size={14} className="text-yellow-500" />
                                            <span className="text-sm text-white font-medium">{service.reputation}</span>
                                            <span className="text-xs text-gray-500">/100</span>
                                        </div>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-xl font-bold text-white">{service.price}</span>
                                            <span className="text-xs text-gray-500">APT</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="px-6 py-3 bg-black/20 border-t border-white/5 flex justify-between items-center">
                                    <code className="text-xs text-gray-500 font-mono">
                                        {service.provider.slice(0, 8)}...
                                    </code>
                                    <ExternalLink size={14} className="text-gray-600 group-hover:text-blue-400 transition-colors" />
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
