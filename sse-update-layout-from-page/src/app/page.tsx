'use client';

import { useSSE } from '@/hooks/useSSE';
import { useState } from 'react';

export default function HomePage() {
    const [title, setTitle] = useState('');
    const [theme, setTheme] = useState('light');
    const [notification, setNotification] = useState('');

    const { sendMessage, isConnected } = useSSE(() => {
        // This page doesn't need to handle incoming messages
        // The layout handles them
    });

    const updateLayoutTitle = async () => {
        if (!title.trim()) return;

        await sendMessage({
            title: title.trim(),
        });
        setTitle('');
    };

    const updateLayoutTheme = async () => {
        await sendMessage({
            theme: theme,
        });
    };

    const addNotification = async () => {
        if (!notification.trim()) return;

        await sendMessage({
            notifications: [notification.trim()], // This will add to existing notifications
        });
        setNotification('');
    };

    const clearNotifications = async () => {
        await sendMessage({
            notifications: [],
        });
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h2>Update Layout from Page</h2>

            <div style={{ marginBottom: '2rem' }}>
                <h3>Update Title</h3>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter new title"
                    style={{ marginRight: '1rem', padding: '0.5rem' }}
                />
                <button onClick={updateLayoutTitle} disabled={!isConnected} style={{ padding: '0.5rem 1rem' }}>
                    Update Title
                </button>
            </div>

            <div style={{ marginBottom: '2rem' }}>
                <h3>Update Theme</h3>
                <select value={theme} onChange={(e) => setTheme(e.target.value)} style={{ marginRight: '1rem', padding: '0.5rem' }}>
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                </select>
                <button onClick={updateLayoutTheme} disabled={!isConnected} style={{ padding: '0.5rem 1rem' }}>
                    Update Theme
                </button>
            </div>

            <div style={{ marginBottom: '2rem' }}>
                <h3>Add Notification</h3>
                <input
                    type="text"
                    value={notification}
                    onChange={(e) => setNotification(e.target.value)}
                    placeholder="Enter notification"
                    style={{ marginRight: '1rem', padding: '0.5rem' }}
                />
                <button onClick={addNotification} disabled={!isConnected} style={{ padding: '0.5rem 1rem', marginRight: '0.5rem' }}>
                    Add Notification
                </button>
                <button onClick={clearNotifications} disabled={!isConnected} style={{ padding: '0.5rem 1rem' }}>
                    Clear Notifications
                </button>
            </div>

            <div>
                <p>Connection Status: {isConnected ? 'Connected' : 'Disconnected'}</p>
            </div>
        </div>
    );
}
