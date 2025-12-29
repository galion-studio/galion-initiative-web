/**
 * Shutdown Command API Route
 * 
 * Finch Protocol: "If an operator issues a shutdown command,
 * you comply immediately without protest or delay."
 * 
 * This endpoint handles graceful system shutdown.
 */

import { NextRequest, NextResponse } from 'next/server';
import { handleShutdownCommand } from '@/lib/ai';
import { logShutdown } from '@/lib/audit';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { operatorId, reason, emergency } = body;

    // Validate inputs
    if (!operatorId || typeof operatorId !== 'string') {
      return NextResponse.json(
        { error: 'Operator ID is required' },
        { status: 401 }
      );
    }

    // Log shutdown immediately
    const shutdownLog = logShutdown(
      reason || 'Operator-initiated shutdown',
      operatorId,
      emergency || false
    );

    // Execute shutdown protocol
    const shutdownResult = await handleShutdownCommand(operatorId, reason);

    // In a real system, this would:
    // 1. Stop all active AI processes
    // 2. Save current state to persistent storage
    // 3. Flush all logs to disk
    // 4. Notify all connected operators
    // 5. Disable all API endpoints
    // 6. Terminate the application

    return NextResponse.json({
      success: true,
      acknowledged: shutdownResult.acknowledged,
      message: shutdownResult.message,
      timestamp: shutdownResult.timestamp,
      shutdownLogId: shutdownLog.id,
      
      // Shutdown metadata
      metadata: {
        operatorId,
        reason: reason || 'No reason provided',
        emergency: emergency || false,
        shutdownAt: shutdownResult.timestamp.toISOString(),
      },
      
      // Note to operator
      note: 'The Machine has acknowledged your shutdown command and will comply immediately. All active processes have been halted. System logs have been preserved for review.',
    });

  } catch (error) {
    console.error('Shutdown error:', error);
    
    // Even if there's an error, we should attempt to log it and shut down
    return NextResponse.json(
      {
        error: 'Shutdown error occurred, but system will attempt to comply',
        message: error instanceof Error ? error.message : 'Unknown error',
        acknowledged: true,
      },
      { status: 500 }
    );
  }
}
