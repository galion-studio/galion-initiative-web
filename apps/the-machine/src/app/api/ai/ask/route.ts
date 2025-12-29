/**
 * The Machine - AI Question API
 * 
 * POST /api/ai/ask - Ask The Machine a question
 */

import { NextRequest, NextResponse } from 'next/server';
import { askMachine } from '@/lib/ai';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question, context } = body;

    if (!question) {
      return NextResponse.json(
        { success: false, error: 'Missing question' },
        { status: 400 }
      );
    }

    // Get operator ID from middleware
    const operatorId = request.headers.get('x-operator-id') || 'unknown';

    // Ask AI
    const result = await askMachine(question, context);

    // Log the AI usage
    console.log(`AI question by ${operatorId}:`, {
      question: question.substring(0, 100),
      constraintsPassed: result.constraintCheck.passed,
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('AI question error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to get AI response',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
