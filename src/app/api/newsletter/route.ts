import { NextResponse } from 'next/server';
import { newsletterSchema } from '@/lib/validations';

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
    const result = newsletterSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: "Validation error", details: result.error.issues },
        { status: 400 }
      );
    }

    const { honeypot } = result.data;
    if (honeypot) {
      // Silent success for bots
      return NextResponse.json({ success: true, message: "Subscribed successfully" });
    }

    // TODO: Add actual newsletter subscription logic (e.g. Resend, Mailchimp)
    console.log('Newsletter subscription:', result.data);

    return NextResponse.json({ success: true, message: "Subscribed successfully" });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

