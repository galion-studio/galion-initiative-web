/**
 * Real-Time Events API Route
 * 
 * Server-Sent Events (SSE) endpoint for real-time updates
 * Streams events to connected operators
 */

import { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/auth';
import {
  getRecentEvents,
  registerOperatorPresence,
  removeOperatorPresence,
  updateOperatorPresence,
  storeEvent,
} from '@/lib/realtime';

export async function GET(request: NextRequest) {
  try {
    // Require authentication
    const session = await requireAuth(request);

    // Register operator presence
    registerOperatorPresence(
      session.operatorId,
      session.operatorName,
      session.role
    );

    // Create SSE response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        // Send initial connection message
        const data = `data: ${JSON.stringify({
          type: 'connected',
          message: 'Connected to THE_MACHINE real-time feed',
          operator: session.operatorName,
        })}\n\n`;
        controller.enqueue(encoder.encode(data));

        // Send recent events
        const recentEvents = getRecentEvents(20);
        for (const event of recentEvents) {
          const eventData = `data: ${JSON.stringify(event)}\n\n`;
          controller.enqueue(encoder.encode(eventData));
        }

        // Keep connection alive with heartbeat
        const heartbeatInterval = setInterval(() => {
          try {
            // Update operator presence
            updateOperatorPresence(session.operatorId);
            
            // Send heartbeat
            const heartbeat = `data: ${JSON.stringify({
              type: 'heartbeat',
              timestamp: Date.now(),
            })}\n\n`;
            controller.enqueue(encoder.encode(heartbeat));
          } catch (error) {
            clearInterval(heartbeatInterval);
          }
        }, 30000); // Every 30 seconds

        // Clean up on disconnect
        request.signal.addEventListener('abort', () => {
          clearInterval(heartbeatInterval);
          removeOperatorPresence(session.operatorId);
          controller.close();
        });
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('Real-time events error:', error);
    
    return new Response(
      JSON.stringify({
        error: 'Failed to establish real-time connection',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
