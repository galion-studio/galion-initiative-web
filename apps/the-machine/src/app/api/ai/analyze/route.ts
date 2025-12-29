/**
 * The Machine - AI Analysis API
 * 
 * POST /api/ai/analyze - Analyze threat using AI
 */

import { NextRequest, NextResponse } from 'next/server';
import { analyzeThreat } from '@/lib/ai';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { description, context } = body;

    if (!description) {
      return NextResponse.json(
        { success: false, error: 'Missing description' },
        { status: 400 }
      );
    }

    // Get operator ID from middleware
    const operatorId = request.headers.get('x-operator-id') || 'unknown';

    // Analyze using AI
    const analysis = await analyzeThreat(description, context);

    // Log the AI usage (for audit trail)
    console.log(`AI analysis performed by ${operatorId}:`, {
      description: description.substring(0, 100),
      constraintsPassed: analysis.constraintCheck.passed,
    });

    return NextResponse.json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    console.error('AI analysis error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to analyze with AI',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
