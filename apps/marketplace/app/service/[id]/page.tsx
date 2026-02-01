'use client';

import { SERVICES } from '@/lib/data';
import { executeServiceCall } from '@/lib/sdk';
import { notFound } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, Shield, Zap, Terminal, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import WalletConnect from '@/components/ui/WalletConnect';
import { useState } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';

export default function ServicePage({ params }: { params: { id: string } }) {
    const service = SERVICES.find(s => s.id === params.id);
    const { connected, account, signAndSubmitTransaction } = useWallet();
    const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
    const [txHash, setTxHash] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    if (!service) {
        notFound();
    }

    const handlePurchase = async () => {
        if (!connected) return;
        setStatus('processing');
        setErrorMsg(null);

        const result = await executeServiceCall({
            serviceName: service.name,
            serviceProvider: service.provider,
            amount: parseFloat(service.price),
            signAndSubmitTransaction: signAndSubmitTransaction as any
        });

        if (result.success) {
            setStatus('success');
            setTxHash(result.txHash || null);
        } else {
            setStatus('error');
            setErrorMsg(result.error || 'Transaction failed');
        }
    };

    return (
        <MainLayout>
            <div className="max-w-4xl mx-auto pt-10">
                <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors">
                    <ArrowLeft size={20} className="mr-2" /> Back to Market
                </Link>

                <div className="flex justify-between items-start mb-12">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-sm font-mono border border-blue-500/30">
                                {service.type}
                            </span>
                            <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm font-mono border border-green-500/30 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                {service.status}
                            </span>
                        </div>
                        <h1 className="text-5xl font-bold text-white mb-4">{service.name}</h1>
                        <p className="text-xl text-gray-400 max-w-2xl">{service.description}</p>
                    </motion.div>

                    <div className="hidden md:block">
                        <WalletConnect />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="md:col-span-2 space-y-6"
                    >
                        <div className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                            <h2 className="text-2xl font-bold mb-6">Service Capabilities</h2>
                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <Zap className="text-yellow-400 mt-1" />
                                    <div>
                                        <h3 className="font-bold text-lg">Low Latency Inference</h3>
                                        <p className="text-gray-400">Optimized for sub-50ms response times.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <Shield className="text-blue-400 mt-1" />
                                    <div>
                                        <h3 className="font-bold text-lg">Verifiable Compute</h3>
                                        <p className="text-gray-400">Cryptographically signed responses from trusted enclaves.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <CheckCircle className="text-green-400 mt-1" />
                                    <div>
                                        <h3 className="font-bold text-lg">99.9% Uptime SLA</h3>
                                        <p className="text-gray-400">Provider stake slashed on downtime.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                            <h2 className="text-2xl font-bold mb-4">Technical Details</h2>
                            <div className="font-mono text-sm text-gray-400 space-y-2">
                                <div className="flex justify-between border-b border-white/5 pb-2">
                                    <span>Provider Address</span>
                                    <span className="text-white">{service.provider.slice(0, 10)}...{service.provider.slice(-10)}</span>
                                </div>
                                <div className="flex justify-between border-b border-white/5 pb-2">
                                    <span>Model Architecture</span>
                                    <span className="text-white">Transformer (70B Params)</span>
                                </div>
                                <div className="flex justify-between border-b border-white/5 pb-2">
                                    <span>Context Window</span>
                                    <span className="text-white">8192 Tokens</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Reputation Score</span>
                                    <span className="text-green-400 font-bold">{service.reputation}/100</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="p-6 rounded-2xl bg-gradient-to-b from-blue-900/20 to-purple-900/20 border border-white/10 backdrop-blur-md h-fit sticky top-8"
                    >
                        <h3 className="text-xl font-bold mb-6">Purchase Access</h3>

                        <div className="mb-6">
                            <span className="text-4xl font-bold text-white">{service.price}</span>
                            <span className="text-gray-400 ml-2">APT / call</span>
                        </div>

                        {!connected ? (
                            <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-200 text-sm mb-4">
                                Please connect your wallet to purchase this service.
                            </div>
                        ) : (
                            <div className="flex justify-between items-center mb-6 text-sm">
                                <span className="text-gray-400">Balance</span>
                                <span className="font-mono">12.45 APT</span>
                            </div>
                        )}

                        <button
                            onClick={handlePurchase}
                            disabled={!connected || status === 'processing' || status === 'success'}
                            className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${status === 'success' ? 'bg-green-600 hover:bg-green-700' :
                                status === 'error' ? 'bg-red-600 hover:bg-red-700' :
                                    !connected ? 'bg-gray-700 cursor-not-allowed text-gray-400' :
                                        'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20'
                                }`}
                        >
                            {status === 'processing' ? 'Confirming...' :
                                status === 'success' ? 'Access Granted ✓' :
                                    status === 'error' ? 'Try Again' :
                                        'Buy Credits'}
                        </button>

                        {status === 'success' && txHash && (
                            <a
                                href={`https://explorer.aptoslabs.com/txn/${txHash}?network=testnet`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-4 flex items-center justify-center gap-2 text-sm text-blue-400 hover:text-blue-300"
                            >
                                View Transaction <ExternalLink size={14} />
                            </a>
                        )}

                        {status === 'error' && errorMsg && (
                            <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
                                {errorMsg}
                            </div>
                        )}

                        <div className="mt-6 pt-6 border-t border-white/10">
                            <div className="text-xs text-gray-500 mb-2">CLI Equivalent:</div>
                            <code className="block p-3 rounded-lg bg-black/50 border border-white/10 text-xs text-green-400 font-mono overflow-x-auto">
                                automata call {service.name.toLowerCase().replace(/\s+/g, '-')} /generate --data '{"{}"}'
                            </code>
                        </div>
                    </motion.div>
                </div>
            </div>
        </MainLayout>
    );
}

