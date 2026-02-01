import React from 'react';
import { WalletProvider } from './providers';
import "./globals.css";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className="bg-neutral-950 text-white antialiased selection:bg-blue-500/30" suppressHydrationWarning>
                <WalletProvider>
                    {children}
                </WalletProvider>
            </body>
        </html>
    );
}

