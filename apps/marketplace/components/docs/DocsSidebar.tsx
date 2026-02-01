'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Book, Code, Terminal, Layers, Info, Wallet, Shield, Zap, Users, Database, Rocket } from 'lucide-react';

const SidebarItem = ({ href, icon: Icon, label }: { href: string; icon: any; label: string }) => {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <Link href={href}>
            <div className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all mb-1 ${isActive
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}>
                <Icon size={18} />
                <span className="text-sm font-medium">{label}</span>
            </div>
        </Link>
    );
};

export default function DocsSidebar() {
    return (
        <motion.aside
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="w-64 flex-shrink-0 h-[calc(100vh-80px)] sticky top-20 hidden lg:block overflow-y-auto pr-4 border-r border-white/10"
        >
            <div className="mb-8">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 px-4">Getting Started</h3>
                <SidebarItem href="/docs" icon={Info} label="Introduction" />
                <SidebarItem href="/docs#getting-started" icon={Rocket} label="Quick Start" />
                <SidebarItem href="/docs#architecture" icon={Layers} label="Architecture" />
            </div>

            <div className="mb-8">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 px-4">Core Features</h3>
                <SidebarItem href="/docs#usage-wallets" icon={Wallet} label="Usage Wallets" />
                <SidebarItem href="/docs#policies" icon={Shield} label="Spend Policies" />
                <SidebarItem href="/docs#marketplace" icon={Zap} label="Marketplace" />
                <SidebarItem href="/docs#publishing" icon={Book} label="Publishing" />
                <SidebarItem href="/docs#agents" icon={Users} label="Agent Identity" />
            </div>

            <div className="mb-8">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 px-4">Developer Reference</h3>
                <SidebarItem href="/docs#sdk" icon={Code} label="SDK Reference" />
                <SidebarItem href="/docs#cli" icon={Terminal} label="CLI Commands" />
                <SidebarItem href="/docs#indexer" icon={Database} label="Indexer API" />
            </div>
        </motion.aside>
    );
}
