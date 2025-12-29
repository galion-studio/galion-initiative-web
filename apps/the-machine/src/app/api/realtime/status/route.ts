/**
 * Real-Time Status API Route
 * 
 * Returns current real-time system status
 * Shows active operators and recent events
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import {
  getActiveOperators,
  getRecentEvents,
  getCriticalEvents,
} from '@/lib/realtime';

export async function GET(request: NextRequest) {
  try {
    // Require authentication
    const session = await requireAuth(request);

    // Get active operators
    const activeOperators = getActiveOperators();

    // Get recent events
    const recentEvents = getRecentEvents(20);

    // Get critical events
    const criticalEvents = getCriticalEvents();

    return NextResponse.json({
      success: true,
      realtime: {
        connected: true,
        active_operators: activeOperators.length,
        operators: activeOperators.map(op => ({
          id: op.operator_id,
          name: op.operator_name,
          role: op.operator_role,
          online_for: Math.floor((Date.now() - op.joined_at) / 1000), // seconds
        })),
      },
      events: {
        recent_count: recentEvents.length,
        critical_count: criticalEvents.length,
        recent: recentEvents.slice(0, 10),
        critical: criticalEvents.slice(0, 5),
      },
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Real-time status error:', error);
    
    return NextResponse.json(
      {
        error: 'Failed to retrieve real-time status',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
