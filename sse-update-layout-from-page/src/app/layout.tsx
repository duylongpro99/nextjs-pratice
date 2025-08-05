'use client';

import { useSSE } from '@/hooks/useSSE';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { useCallback, useState } from 'react';
import './globals.css';

interface LayoutState {
    title: string;
    theme: string;
    notifications: string[];
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [layoutState, setLayoutState] = useState<LayoutState>({
        title: 'My App',
        theme: 'light',
        notifications: [],
    });

    // Handle incoming SSE messages
    const handleSSEMessage = useCallback((data: any) => {
        if (data.type === 'layout-update') {
            setLayoutState((prevState) => ({
                ...prevState,
                ...data.payload,
            }));
        }
    }, []);

    const { isConnected } = useSSE(handleSSEMessage);

    return (
        <html lang="en" data-theme={layoutState.theme}>
            <body>
                <header
                    style={{
                        padding: '1rem',
                        backgroundColor: layoutState.theme === 'dark' ? '#333' : '#f5f5f5',
                        color: layoutState.theme === 'dark' ? 'white' : 'black',
                    }}
                >
                    <h1>{layoutState.title}</h1>
                    <div>Connection: {isConnected ? '🟢 Connected' : '🔴 Disconnected'}</div>
                    {layoutState.notifications.length > 0 && (
                        <div style={{ marginTop: '0.5rem' }}>
                            {layoutState.notifications.map((notification, index) => (
                                <div
                                    key={index}
                                    style={{
                                        padding: '0.25rem 0.5rem',
                                        backgroundColor: 'orange',
                                        borderRadius: '4px',
                                        margin: '0.25rem 0',
                                    }}
                                >
                                    {notification}
                                </div>
                            ))}
                        </div>
                    )}
                </header>
                <main>{children}</main>
            </body>
        </html>
    );
}
