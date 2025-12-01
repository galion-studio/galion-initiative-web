import { NextResponse } from 'next/server';
import { joinTeamSchema } from '@/lib/validations';

const rateLimitMap = new Map<string, number[]>();

function isRateLimited(ip: string) {
  const now = Date.now();
  const windowStart = now - 10 * 60 * 1000; // 10 minutes
  const timestamps = rateLimitMap.get(ip) || [];
  
  const validTimestamps = timestamps.filter(t => t > windowStart);
  
  if (validTimestamps.length >= 3) {
    return true;
  }
  
  validTimestamps.push(now);
  rateLimitMap.set(ip, validTimestamps);
  return false;
}

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { success: false, error: "Rate limit exceeded" },
        { status: 429 }
      );
    }

    const body = await request.json();
    const result = joinTeamSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: "Validation error", details: result.error.issues },
        { status: 400 }
      );
    }

    // TODO: Add actual email sending logic (e.g. Resend)
    console.log('Contact form submission:', result.data);

    return NextResponse.json({ success: true, message: "Message received. We'll be in touch." });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

