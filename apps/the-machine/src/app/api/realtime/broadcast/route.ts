/**
 * Broadcast Event API Route
 * 
 * Allows backend to broadcast events to all connected operators
 * Used for system-wide notifications
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, hasPermission } from '@/lib/auth';
import { storeEvent, type RealtimeEvent } from '@/lib/realtime';

export async function POST(request: NextRequest) {
  try {
    // Require authentication (only admins can broadcast)
    const session = await requireAuth(request);
    
    const permCheck = hasPermission(session.role, 'modifySettings');
    if (!permCheck.allowed) {
      return NextResponse.json(
        { error: 'Only admins can broadcast events' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { type, level, title, message, data } = body;

    // Validate inputs
    if (!type || !title || !message) {
      return NextResponse.json(
        { error: 'Type, title, and message are required' },
        { status: 400 }
      );
    }

    // Create and store event
    const event: RealtimeEvent = {
      id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      level: level || 'info',
      timestamp: Date.now(),
      title,
      message,
      data: data || {},
    };

    storeEvent(event);

    return NextResponse.json({
      success: true,
      event,
      message: 'Event broadcasted to all connected operators',
    });

  } catch (error) {
    console.error('Broadcast error:', error);
    
    return NextResponse.json(
      {
        error: 'Failed to broadcast event',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
