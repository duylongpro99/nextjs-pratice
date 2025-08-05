// Store for active connections
export const connections = new Set<ReadableStreamDefaultController>();

// Function to broadcast messages to all connected clients
export function broadcastToClients(data: any) {
    const message = `data: ${JSON.stringify(data)}\n\n`;

    connections.forEach((controller) => {
        try {
            controller.enqueue(message);
        } catch (error) {
            // Remove broken connections
            connections.delete(controller);
        }
    });
}
