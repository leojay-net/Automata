'use client';

import { motion } from 'framer-motion';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { useState, useEffect } from 'react';
import {
    User,
    Wallet,
    Bell,
    Shield,
    Terminal,
    Globe,
    Copy,
    Check,
    ExternalLink
} from 'lucide-react';

export default function SettingsPage() {
    const { connected, account, disconnect } = useWallet();
    const [mounted, setMounted] = useState(false);
    const [copied, setCopied] = useState(false);
    const [activeTab, setActiveTab] = useState('account');

    // Settings state
    const [settings, setSettings] = useState({
        network: 'testnet',
        moduleId: '0x1::automata',
        indexerUrl: 'http://localhost:3001',
        notifications: {
            transactions: true,
            lowBalance: true,
            policyAlerts: true,
        }
    });

    useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    const copyAddress = () => {
        if (account?.address) {
            navigator.clipboard.writeText(account.address.toString());
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const tabs = [
        { id: 'account', label: 'Account', icon: User },
        { id: 'network', label: 'Network', icon: Globe },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'cli', label: 'CLI Config', icon: Terminal },
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <motion.h1
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl font-bold mb-2"
                >
                    Settings
                </motion.h1>
                <p className="text-gray-400">Manage your account and preferences</p>
            </div>

            <div className="flex gap-6">
                {/* Tabs */}
                <div className="w-48 space-y-1">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id
                                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <tab.icon size={18} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="flex-1 rounded-2xl bg-white/5 border border-white/10 p-6">
                    {activeTab === 'account' && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold">Account</h2>

                            {connected && account ? (
                                <div className="space-y-4">
                                    <div className="p-4 rounded-xl bg-black/30 border border-white/5">
                                        <label className="text-xs text-gray-500 uppercase tracking-wider">Wallet Address</label>
                                        <div className="flex items-center gap-2 mt-2">
                                            <code className="flex-1 font-mono text-sm text-white break-all">
                                                {account.address.toString()}
                                            </code>
                                            <button
                                                onClick={copyAddress}
                                                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                                            >
                                                {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} className="text-gray-400" />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="p-4 rounded-xl bg-black/30 border border-white/5">
                                        <label className="text-xs text-gray-500 uppercase tracking-wider">Connected Wallet</label>
                                        <div className="flex items-center gap-2 mt-2">
                                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                            <span className="text-white">Petra Wallet</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={disconnect}
                                        className="px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-colors"
                                    >
                                        Disconnect Wallet
                                    </button>
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <Wallet size={48} className="mx-auto text-gray-600 mb-4" />
                                    <p className="text-gray-400 mb-4">Connect your wallet to manage settings</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'network' && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold">Network Configuration</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Aptos Network</label>
                                    <select
                                        value={settings.network}
                                        onChange={(e) => setSettings({ ...settings, network: e.target.value })}
                                        className="w-full px-4 py-3 rounded-lg bg-black/30 border border-white/10 text-white focus:border-blue-500 focus:outline-none"
                                    >
                                        <option value="mainnet">Mainnet</option>
                                        <option value="testnet">Testnet</option>
                                        <option value="devnet">Devnet</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Module ID</label>
                                    <input
                                        type="text"
                                        value={settings.moduleId}
                                        onChange={(e) => setSettings({ ...settings, moduleId: e.target.value })}
                                        className="w-full px-4 py-3 rounded-lg bg-black/30 border border-white/10 text-white font-mono text-sm focus:border-blue-500 focus:outline-none"
                                        placeholder="0x1::automata"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">The deployed automata contract address</p>
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Indexer URL</label>
                                    <input
                                        type="text"
                                        value={settings.indexerUrl}
                                        onChange={(e) => setSettings({ ...settings, indexerUrl: e.target.value })}
                                        className="w-full px-4 py-3 rounded-lg bg-black/30 border border-white/10 text-white font-mono text-sm focus:border-blue-500 focus:outline-none"
                                        placeholder="http://localhost:3001"
                                    />
                                </div>

                                <button className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors">
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold">Notifications</h2>

                            <div className="space-y-4">
                                <ToggleSetting
                                    label="Transaction Alerts"
                                    description="Get notified when transactions are processed"
                                    checked={settings.notifications.transactions}
                                    onChange={(v) => setSettings({
                                        ...settings,
                                        notifications: { ...settings.notifications, transactions: v }
                                    })}
                                />
                                <ToggleSetting
                                    label="Low Balance Warnings"
                                    description="Alert when wallet balance drops below threshold"
                                    checked={settings.notifications.lowBalance}
                                    onChange={(v) => setSettings({
                                        ...settings,
                                        notifications: { ...settings.notifications, lowBalance: v }
                                    })}
                                />
                                <ToggleSetting
                                    label="Policy Alerts"
                                    description="Notify when spending policies are triggered"
                                    checked={settings.notifications.policyAlerts}
                                    onChange={(v) => setSettings({
                                        ...settings,
                                        notifications: { ...settings.notifications, policyAlerts: v }
                                    })}
                                />
                            </div>
                        </div>
                    )}

                    {activeTab === 'cli' && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold">CLI Configuration</h2>
                            <p className="text-gray-400">Use these environment variables with the automata CLI</p>

                            <div className="p-4 rounded-xl bg-black/50 border border-white/10 font-mono text-sm space-y-2">
                                <div className="text-gray-500"># Add to your .env or shell profile</div>
                                <div><span className="text-blue-400">export</span> Automata_PRIVATE_KEY=<span className="text-green-400">"your_private_key"</span></div>
                                <div><span className="text-blue-400">export</span> Automata_MODULE_ID=<span className="text-green-400">"{settings.moduleId}"</span></div>
                                <div><span className="text-blue-400">export</span> APTOS_NETWORK=<span className="text-green-400">"{settings.network}"</span></div>
                            </div>

                            <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                                <div className="flex items-start gap-3">
                                    <Shield className="text-yellow-400 mt-0.5" size={20} />
                                    <div>
                                        <div className="font-medium text-yellow-200">Security Note</div>
                                        <p className="text-sm text-yellow-200/70 mt-1">
                                            Never share your private key. The CLI uses your local keyfile for signing.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <a
                                href="https://github.com/automata/cli"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300"
                            >
                                View CLI Documentation <ExternalLink size={14} />
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function ToggleSetting({ label, description, checked, onChange }: {
    label: string;
    description: string;
    checked: boolean;
    onChange: (v: boolean) => void;
}) {
    return (
        <div className="flex items-center justify-between p-4 rounded-xl bg-black/30 border border-white/5">
            <div>
                <div className="font-medium text-white">{label}</div>
                <div className="text-sm text-gray-500">{description}</div>
            </div>
            <button
                onClick={() => onChange(!checked)}
                className={`w-12 h-6 rounded-full transition-colors relative ${checked ? 'bg-blue-600' : 'bg-gray-700'
                    }`}
            >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${checked ? 'left-7' : 'left-1'
                    }`} />
            </button>
        </div>
    );
}
