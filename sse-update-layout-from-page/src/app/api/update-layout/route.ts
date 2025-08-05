import { broadcastToClients } from '@/lib/broadcast';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Broadcast the update to all connected clients
        broadcastToClients({
            type: 'layout-update',
            payload: body,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to process update' }, { status: 500 });
    }
}
