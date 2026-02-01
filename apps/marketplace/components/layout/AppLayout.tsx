'use client';

import { ReactNode, createContext, useContext, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import {
    LayoutDashboard,
    Wallet,
    FileText,
    Settings,
    BarChart3,
    Plus,
    Shield,
    Users,
    Zap,
    ChevronLeft,
    ChevronRight,
    Terminal,
    Book,
    Monitor
} from 'lucide-react';
import WalletConnect from '../ui/WalletConnect';

const Background = dynamic(() => import('../canvas/Background'), { ssr: false });

interface SidebarContextType {
    collapsed: boolean;
    setCollapsed: (v: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType>({ collapsed: false, setCollapsed: () => { } });

interface NavItemProps {
    href: string;
    icon: React.ElementType;
    label: string;
    badge?: number;
}

function NavItem({ href, icon: Icon, label, badge }: NavItemProps) {
    const pathname = usePathname();
    const { collapsed } = useContext(SidebarContext);
    const isActive = pathname === href || (href !== '/app' && pathname.startsWith(href));

    return (
        <Link href={href}>
            <div className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group relative
                ${isActive
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                }
            `}>
                <Icon size={20} className={isActive ? 'text-blue-400' : 'text-gray-500 group-hover:text-white'} />
                {!collapsed && (
                    <>
                        <span className="text-sm font-medium flex-1">{label}</span>
                        {badge !== undefined && badge > 0 && (
                            <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-xs font-mono">
                                {badge}
                            </span>
                        )}
                    </>
                )}
                {collapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-neutral-800 rounded text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none z-50 border border-white/10">
                        {label}
                    </div>
                )}
            </div>
        </Link>
    );
}

function NavSection({ title, children }: { title: string; children: ReactNode }) {
    const { collapsed } = useContext(SidebarContext);

    return (
        <div className="mb-6">
            {!collapsed && (
                <div className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2 px-3">
                    {title}
                </div>
            )}
            <div className="space-y-1">
                {children}
            </div>
        </div>
    );
}

export default function AppLayout({ children }: { children: ReactNode }) {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <SidebarContext.Provider value={{ collapsed, setCollapsed }}>
            <div className="relative min-h-screen font-sans text-white overflow-hidden flex">
                <Background />

                {/* Sidebar */}
                <motion.aside
                    initial={false}
                    animate={{ width: collapsed ? 72 : 260 }}
                    className="relative z-20 h-screen flex flex-col bg-neutral-900/80 backdrop-blur-xl border-r border-white/5"
                >
                    {/* Logo */}
                    <div className="p-4 border-b border-white/5">
                        <Link href="/app" className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-lg">
                                x4
                            </div>
                            {!collapsed && (
                                <div>
                                    <div className="font-bold text-white">automata</div>
                                    <div className="text-xs text-gray-500">Protocol</div>
                                </div>
                            )}
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-3 overflow-y-auto">
                        <NavSection title="Overview">
                            <NavItem href="/app" icon={LayoutDashboard} label="Dashboard" />
                            <NavItem href="/app/analytics" icon={BarChart3} label="Analytics" />
                        </NavSection>

                        <NavSection title="Wallets">
                            <NavItem href="/app/wallets" icon={Wallet} label="Usage Wallets" badge={2} />
                            <NavItem href="/app/policies" icon={Shield} label="Policies" />
                        </NavSection>

                        <NavSection title="Services">
                            <NavItem href="/app/services" icon={Zap} label="Marketplace" />
                            <NavItem href="/app/publish" icon={Plus} label="Publish" />
                        </NavSection>

                        <NavSection title="Identity">
                            <NavItem href="/app/agents" icon={Users} label="My Agents" />
                        </NavSection>

                        <NavSection title="Resources">
                            <NavItem href="/app/docs" icon={Book} label="Documentation" />
                            <NavItem href="/app/cli" icon={Terminal} label="CLI Reference" />
                        </NavSection>
                    </nav>

                    {/* Collapse Toggle */}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-neutral-800 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-neutral-700 transition-all"
                    >
                        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                    </button>

                    {/* Settings Footer */}
                    <div className="p-3 border-t border-white/5">
                        <NavItem href="/app/settings" icon={Settings} label="Settings" />
                    </div>
                </motion.aside>

                {/* Main Content */}
                <main className="flex-1 relative z-10 h-screen overflow-y-auto">
                    {/* Top Bar */}
                    <header className="sticky top-0 z-30 px-6 py-4 bg-neutral-950/50 backdrop-blur-xl border-b border-white/5 flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            {/* Breadcrumbs or search could go here */}
                        </div>
                        <WalletConnect />
                    </header>

                    {/* Page Content */}
                    <div className="p-6">
                        {children}
                    </div>
                </main>
            </div>
        </SidebarContext.Provider>
    );
}
