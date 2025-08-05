import { useCallback, useEffect, useRef } from 'react';

interface SSEHook {
    sendMessage: (data: any) => Promise<void>;
    isConnected: boolean;
}

export const useSSE = (onMessage: (data: any) => void) => {
    const eventSourceRef = useRef<EventSource | null>(null);
    const isConnectedRef = useRef(false);

    useEffect(() => {
        // Create SSE connection
        const eventSource = new EventSource('/api/events');
        eventSourceRef.current = eventSource;

        eventSource.onopen = () => {
            isConnectedRef.current = true;
            console.log('SSE connection opened');
        };

        eventSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                onMessage(data);
            } catch (error) {
                console.error('Error parsing SSE message:', error);
            }
        };

        eventSource.onerror = (error) => {
            console.error('SSE error:', error);
            isConnectedRef.current = false;
        };

        // Cleanup on unmount
        return () => {
            eventSource.close();
            isConnectedRef.current = false;
        };
    }, [onMessage]);

    const sendMessage = useCallback(async (data: any) => {
        try {
            const response = await fetch('/api/update-layout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Failed to send message');
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    }, []);

    return {
        sendMessage,
        isConnected: isConnectedRef.current,
    };
};
