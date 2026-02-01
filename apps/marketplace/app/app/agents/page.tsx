'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
    User,
    Star,
    Shield,
    Activity,
    Edit2,
    Copy,
    ExternalLink,
    Terminal,
    BadgeCheck,
    Zap
} from 'lucide-react';

const MOCK_AGENT = {
    address: '0x1234567890abcdef1234567890abcdef',
    name: 'My AI Agent',
    reputation: 92,
    totalCalls: 156,
    totalEarned: '3.45 APT',
    services: 3,
    createdAt: '2024-01-15',
    identity: {
        verified: true,
        level: 'Pro'
    }
};

const MOCK_SERVICES_PROVIDED = [
    { id: 's1', name: 'GPT-4 Turbo API', calls: 89, earned: '1.78 APT', status: 'Active' },
    { id: 's2', name: 'Whisper Transcription', calls: 45, earned: '0.90 APT', status: 'Active' },
    { id: 's3', name: 'Image Generation', calls: 22, earned: '0.77 APT', status: 'Paused' },
];

export default function AgentsPage() {
    const [mounted, setMounted] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [agentName, setAgentName] = useState(MOCK_AGENT.name);

    useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div>
                <motion.h1
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl font-bold mb-2"
                >
                    Agent Identity
                </motion.h1>
                <p className="text-gray-400">Manage your on-chain agent identity and reputation</p>
            </div>

            {/* CLI Hints */}
            <div className="p-4 rounded-xl bg-black/30 border border-white/10 space-y-2">
                <div className="flex items-center gap-4">
                    <Terminal className="text-gray-500" size={20} />
                    <div>
                        <span className="text-gray-400 text-sm">Register: </span>
                        <code className="text-green-400 font-mono text-sm">automata agent register --name "My Agent"</code>
                    </div>
                </div>
                <div className="flex items-center gap-4 pl-9">
                    <span className="text-gray-400 text-sm">Get Info: </span>
                    <code className="text-green-400 font-mono text-sm">automata agent info --address 0x1234...</code>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Agent Profile Card */}
                <div className="lg:col-span-2 rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
                    <div className="p-6 border-b border-white/10">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                    <User size={32} className="text-white" />
                                </div>
                                <div>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={agentName}
                                            onChange={(e) => setAgentName(e.target.value)}
                                            className="text-xl font-bold bg-transparent border-b border-blue-500 focus:outline-none text-white"
                                            onBlur={() => setIsEditing(false)}
                                            autoFocus
                                        />
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <h2 className="text-xl font-bold text-white">{agentName}</h2>
                                            <button onClick={() => setIsEditing(true)}>
                                                <Edit2 size={14} className="text-gray-500 hover:text-white" />
                                            </button>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-3 mt-1">
                                        <code className="text-xs text-gray-500 font-mono">{MOCK_AGENT.address}</code>
                                        <button className="text-gray-500 hover:text-white">
                                            <Copy size={12} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            {MOCK_AGENT.identity.verified && (
                                <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm">
                                    <BadgeCheck size={14} />
                                    Verified {MOCK_AGENT.identity.level}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div>
                            <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                                <Star size={14} />
                                Reputation
                            </div>
                            <div className="text-2xl font-bold">{MOCK_AGENT.reputation}<span className="text-sm text-gray-500">/100</span></div>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                                <Activity size={14} />
                                Total Calls
                            </div>
                            <div className="text-2xl font-bold">{MOCK_AGENT.totalCalls}</div>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                                <Zap size={14} />
                                Total Earned
                            </div>
                            <div className="text-2xl font-bold">{MOCK_AGENT.totalEarned}</div>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                                <Shield size={14} />
                                Services
                            </div>
                            <div className="text-2xl font-bold">{MOCK_AGENT.services}</div>
                        </div>
                    </div>
                </div>

                {/* Reputation Breakdown */}
                <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
                    <h3 className="font-bold mb-4">Reputation Score</h3>
                    <div className="relative mb-6">
                        <div className="w-32 h-32 mx-auto relative">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                                <circle
                                    cx="60"
                                    cy="60"
                                    r="54"
                                    fill="none"
                                    stroke="rgba(255,255,255,0.1)"
                                    strokeWidth="12"
                                />
                                <motion.circle
                                    cx="60"
                                    cy="60"
                                    r="54"
                                    fill="none"
                                    stroke="url(#repGradient)"
                                    strokeWidth="12"
                                    strokeLinecap="round"
                                    initial={{ strokeDasharray: '0 339.3' }}
                                    animate={{ strokeDasharray: `${(MOCK_AGENT.reputation / 100) * 339.3} 339.3` }}
                                    transition={{ duration: 1, delay: 0.5 }}
                                />
                                <defs>
                                    <linearGradient id="repGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#3B82F6" />
                                        <stop offset="100%" stopColor="#8B5CF6" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-3xl font-bold">{MOCK_AGENT.reputation}</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-400">Uptime</span>
                            <span className="text-green-400">99.5%</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Response Time</span>
                            <span className="text-blue-400">245ms avg</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Success Rate</span>
                            <span className="text-white">98.2%</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Services Provided */}
            <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
                <div className="p-6 border-b border-white/10 flex justify-between items-center">
                    <h2 className="text-lg font-bold">Your Services</h2>
                    <a href="/app/publish" className="text-sm text-blue-400 hover:underline">
                        + Publish New Service
                    </a>
                </div>
                <div className="divide-y divide-white/5">
                    {MOCK_SERVICES_PROVIDED.map(service => (
                        <div key={service.id} className="p-6 flex items-center justify-between hover:bg-white/5 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className={`w-3 h-3 rounded-full ${service.status === 'Active' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                                <div>
                                    <div className="font-medium text-white">{service.name}</div>
                                    <div className="text-sm text-gray-500">{service.calls} calls • {service.earned}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className={`px-2 py-1 rounded-full text-xs ${service.status === 'Active'
                                        ? 'bg-green-500/10 text-green-400'
                                        : 'bg-yellow-500/10 text-yellow-400'
                                    }`}>
                                    {service.status}
                                </span>
                                <button className="text-gray-500 hover:text-white">
                                    <ExternalLink size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Initialize Reputation CTA */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/20 p-6"
            >
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold mb-1">Boost Your Reputation</h3>
                        <p className="text-gray-400 text-sm">Initialize on-chain reputation to increase trust and visibility</p>
                        <code className="text-xs text-green-400 font-mono mt-2 block">automata agent init-reputation</code>
                    </div>
                    <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:opacity-90 transition-opacity">
                        Initialize Reputation
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
