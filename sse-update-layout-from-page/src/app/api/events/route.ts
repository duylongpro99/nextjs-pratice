import { connections } from '@/lib/broadcast';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
    const stream = new ReadableStream({
        start(controller) {
            // Add this connection to our set
            connections.add(controller);

            // Send initial connection message
            controller.enqueue(`data: ${JSON.stringify({ type: 'connected' })}\n\n`);

            // Handle connection cleanup
            request.signal.addEventListener('abort', () => {
                connections.delete(controller);
                try {
                    controller.close();
                } catch (e) {
                    // Connection already closed
                }
            });
        },
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            Connection: 'keep-alive',
        },
    });
}
