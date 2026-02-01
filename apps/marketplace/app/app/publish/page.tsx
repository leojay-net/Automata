'use client';

import { motion } from 'framer-motion';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { useState, useEffect } from 'react';
import { publishService } from '@/lib/sdk';
import { useToast } from '@/components/ui/Toast';
import {
    Upload,
    FileJson,
    DollarSign,
    Tag,
    Globe,
    Terminal,
    CheckCircle,
    AlertCircle
} from 'lucide-react';

export default function PublishPage() {
    const { connected, account, signAndSubmitTransaction } = useWallet();
    const { success, error } = useToast();
    const [mounted, setMounted] = useState(false);
    const [publishing, setPublishing] = useState(false);
    const [published, setPublished] = useState(false);

    // Form state
    const [serviceName, setServiceName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('0.01');
    const [metadataUrl, setMetadataUrl] = useState('');
    const [tags, setTags] = useState('');

    useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    const handlePublish = async () => {
        if (!connected || !serviceName || !price) return;
        setPublishing(true);

        const result = await publishService({
            name: serviceName,
            basePrice: parseFloat(price),
            metadataUrl: metadataUrl || `https://api.automata.io/${serviceName.toLowerCase().replace(/\s+/g, '-')}`,
            signAndSubmitTransaction: signAndSubmitTransaction as any
        });

        setPublishing(false);
        if (result.success) {
            setPublished(true);
            success('Service Published', `${serviceName} is now live on the marketplace!`);
        } else {
            error('Failed to Publish', result.error || 'Transaction failed');
        }
    };

    if (published) {
        return (
            <div className="max-w-2xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="rounded-2xl bg-green-500/10 border border-green-500/20 p-12 text-center"
                >
                    <CheckCircle size={64} className="mx-auto text-green-400 mb-6" />
                    <h1 className="text-3xl font-bold mb-4">Service Published!</h1>
                    <p className="text-gray-400 mb-8">
                        Your service "{serviceName}" is now live on the marketplace.
                    </p>
                    <div className="p-4 rounded-lg bg-black/30 border border-white/10 mb-6">
                        <div className="text-xs text-gray-500 mb-2">Service Endpoint</div>
                        <code className="text-green-400 font-mono text-sm">
                            {metadataUrl || `https://api.automata.io/${serviceName.toLowerCase().replace(/\s+/g, '-')}`}
                        </code>
                    </div>
                    <button
                        onClick={() => {
                            setPublished(false);
                            setServiceName('');
                            setDescription('');
                            setPrice('0.01');
                            setMetadataUrl('');
                            setTags('');
                        }}
                        className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
                    >
                        Publish Another Service
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div>
                <motion.h1
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl font-bold mb-2"
                >
                    Publish Service
                </motion.h1>
                <p className="text-gray-400">Register your AI endpoint on the automata marketplace</p>
            </div>

            {/* CLI Hint */}
            <div className="p-4 rounded-xl bg-black/30 border border-white/10 flex items-center gap-4">
                <Terminal className="text-gray-500" size={20} />
                <div className="flex-1">
                    <span className="text-gray-400 text-sm">CLI equivalent: </span>
                    <code className="text-green-400 font-mono text-sm">automata publish ./openapi.yaml --name "My API" --price 0.01</code>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="rounded-2xl bg-white/5 border border-white/10 p-6 space-y-6">
                        <h2 className="text-lg font-bold">Service Details</h2>

                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Service Name *</label>
                            <input
                                type="text"
                                value={serviceName}
                                onChange={(e) => setServiceName(e.target.value)}
                                placeholder="e.g., GPT-4 Inference"
                                className="w-full px-4 py-3 rounded-lg bg-black/30 border border-white/10 text-white focus:border-blue-500 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Describe what your service does..."
                                rows={3}
                                className="w-full px-4 py-3 rounded-lg bg-black/30 border border-white/10 text-white focus:border-blue-500 focus:outline-none resize-none"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Price per Call (APT) *</label>
                                <div className="relative">
                                    <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                    <input
                                        type="number"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        step="0.001"
                                        min="0"
                                        className="w-full pl-10 pr-4 py-3 rounded-lg bg-black/30 border border-white/10 text-white font-mono focus:border-blue-500 focus:outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Tags</label>
                                <div className="relative">
                                    <Tag size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                    <input
                                        type="text"
                                        value={tags}
                                        onChange={(e) => setTags(e.target.value)}
                                        placeholder="ai, inference, nlp"
                                        className="w-full pl-10 pr-4 py-3 rounded-lg bg-black/30 border border-white/10 text-white focus:border-blue-500 focus:outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Metadata URL / OpenAPI Spec</label>
                            <div className="relative">
                                <Globe size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input
                                    type="text"
                                    value={metadataUrl}
                                    onChange={(e) => setMetadataUrl(e.target.value)}
                                    placeholder="https://your-api.com/openapi.json"
                                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-black/30 border border-white/10 text-white font-mono text-sm focus:border-blue-500 focus:outline-none"
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">URL to your OpenAPI spec or service metadata</p>
                        </div>
                    </div>

                    {/* Upload Area */}
                    <div className="rounded-2xl border-2 border-dashed border-white/10 p-12 text-center hover:border-blue-500/30 transition-colors cursor-pointer">
                        <FileJson size={48} className="mx-auto text-gray-600 mb-4" />
                        <p className="text-gray-400 mb-2">Drop your OpenAPI spec here</p>
                        <p className="text-xs text-gray-500">or click to browse (JSON/YAML)</p>
                    </div>
                </div>

                {/* Preview & Submit */}
                <div className="space-y-6">
                    <div className="rounded-2xl bg-white/5 border border-white/10 p-6 sticky top-24">
                        <h3 className="text-lg font-bold mb-4">Preview</h3>

                        <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-white/10 mb-4">
                            <div className="text-xl font-bold mb-1">{serviceName || 'Your Service'}</div>
                            <div className="text-sm text-gray-400 mb-3">
                                {description || 'Service description will appear here...'}
                            </div>
                            <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-bold text-white">{price || '0.00'}</span>
                                <span className="text-gray-500">APT / call</span>
                            </div>
                        </div>

                        {tags && (
                            <div className="flex flex-wrap gap-2 mb-4">
                                {tags.split(',').map((tag, i) => (
                                    <span key={i} className="px-2 py-1 rounded-md bg-white/5 text-xs text-gray-400 uppercase">
                                        {tag.trim()}
                                    </span>
                                ))}
                            </div>
                        )}

                        {!connected ? (
                            <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-200 text-sm mb-4">
                                <AlertCircle size={16} className="inline mr-2" />
                                Connect your wallet to publish
                            </div>
                        ) : (
                            <div className="p-3 rounded-lg bg-black/30 border border-white/5 mb-4">
                                <div className="text-xs text-gray-500 mb-1">Publishing as</div>
                                <code className="text-xs text-white font-mono">
                                    {account?.address.toString().slice(0, 12)}...
                                </code>
                            </div>
                        )}

                        <button
                            onClick={handlePublish}
                            disabled={!connected || !serviceName || !price || publishing}
                            className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {publishing ? 'Publishing...' : 'Publish to Marketplace'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
