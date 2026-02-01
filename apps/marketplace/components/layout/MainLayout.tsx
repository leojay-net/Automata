'use client';

import { ReactNode } from 'react';
import dynamic from 'next/dynamic';

const Background = dynamic(() => import('../canvas/Background'), { ssr: false });

interface MainLayoutProps {
    children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
    return (
        <div className="relative min-h-screen font-sans text-white overflow-hidden">
            <Background />
            <div className="relative z-10 p-8 h-screen overflow-y-auto">
                {children}
            </div>
        </div>
    );
}
