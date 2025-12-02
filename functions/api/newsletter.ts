// Cloudflare Pages Function for newsletter subscription
// Uses Cloudflare D1 database + Queues for reliable email collection
// This is the 2025 best practice approach for Cloudflare Pages

// Cloudflare D1 Database type definition
interface D1Database {
  prepare(query: string): D1PreparedStatement;
  exec(query: string): Promise<D1ExecResult>;
}

interface D1PreparedStatement {
  bind(...values: any[]): D1PreparedStatement;
  first<T = any>(): Promise<T | null>;
  run(): Promise<D1Result>;
  all<T = any>(): Promise<{ results: T[] }>;
}

interface D1Result {
  success: boolean;
  meta: {
    changes: number;
    last_row_id: number;
    duration: number;
  };
}

interface D1ExecResult {
  count: number;
  duration: number;
}

interface Queue {
  send(message: any): Promise<void>;
}

interface Env {
  DB: D1Database; // Cloudflare D1 database binding
  NEWSLETTER_QUEUE?: Queue; // Optional: Cloudflare Queue for async processing
  [key: string]: any;
}

// Handle OPTIONS requests for CORS
export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function onRequestPost({ request, env }: { request: Request; env: Env }) {
  // Ensure we always return valid JSON, even if something goes wrong
  const errorResponse = (message: string, status: number = 500) => {
    return new Response(
      JSON.stringify({ success: false, error: message }),
      {
        status,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      }
    );
  };

  const successResponse = (message: string = "Subscribed successfully") => {
    return new Response(
      JSON.stringify({ success: true, message }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      }
    );
  };

  try {
    // Check if D1 database is available
    if (!env || !env.DB) {
      console.error('D1 database binding not found. Make sure DB is bound in Cloudflare Pages settings.');
      return errorResponse("Database not configured. Please contact support.", 500);
    }

    // Get client IP for rate limiting and analytics
    const ip = request.headers.get('cf-connecting-ip') || 
               request.headers.get('x-forwarded-for') || 
               'unknown';
    
    // Parse request body safely
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError);
      return errorResponse("Invalid request format.", 400);
    }
    
    // Honeypot check - silent success for bots
    if (body.honeypot) {
      return successResponse();
    }
    
    // Basic validation
    if (!body.email) {
      return errorResponse("Email is required", 400);
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return errorResponse("Invalid email format", 400);
    }
    
    // Normalize email (lowercase, trim)
    const email = body.email.toLowerCase().trim();
    
    // Check if email already exists in database (with retry logic)
    let existing;
    let retries = 3;
    while (retries > 0) {
      try {
        existing = await env.DB.prepare(
          'SELECT email, subscribed_at FROM newsletter_subscribers WHERE email = ?'
        ).bind(email).first();
        break; // Success, exit retry loop
      } catch (dbError) {
        retries--;
        if (retries === 0) {
          console.error('Database query error after retries:', dbError);
          // Continue anyway - we'll try to insert
        } else {
          // Wait a bit before retrying (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, 100 * (4 - retries)));
        }
      }
    }
    
    if (existing) {
      // Email already subscribed - return success (don't reveal if email exists)
      return successResponse();
    }
    
    // Insert new subscriber into D1 database (with retry logic)
    const timestamp = new Date().toISOString();
    let insertSuccess = false;
    retries = 3;
    
    while (retries > 0 && !insertSuccess) {
      try {
        const result = await env.DB.prepare(
          `INSERT INTO newsletter_subscribers (email, subscribed_at, ip_address, consent)
           VALUES (?, ?, ?, ?)`
        ).bind(
          email,
          timestamp,
          ip,
          body.consent ? 1 : 0
        ).run();
        
        if (result.success && result.meta.changes > 0) {
          insertSuccess = true;
          console.log('Newsletter subscription successful:', { email, timestamp, result });
          
          // If Queue is available, send to queue for async processing (e.g., welcome email)
          if (env.NEWSLETTER_QUEUE) {
            try {
              await env.NEWSLETTER_QUEUE.send({
                email,
                timestamp,
                ip,
                consent: body.consent,
                type: 'newsletter_subscription'
              });
              console.log('Added to newsletter queue:', email);
            } catch (queueError) {
              // Queue error is not critical - subscription is already saved
              console.warn('Queue send failed (non-critical):', queueError);
            }
          }
          
          return successResponse();
        }
      } catch (dbError) {
        retries--;
        const errorMessage = dbError instanceof Error ? dbError.message : String(dbError);
        
        // Check if it's a unique constraint error (email already exists)
        if (errorMessage.includes('UNIQUE constraint') || 
            errorMessage.includes('unique') ||
            errorMessage.includes('UNIQUE')) {
          // Email already exists, return success
          return successResponse();
        }
        
        if (retries === 0) {
          console.error('Database insert error after retries:', dbError);
          // Last resort: try to send to queue if available for later processing
          if (env.NEWSLETTER_QUEUE) {
            try {
              await env.NEWSLETTER_QUEUE.send({
                email,
                timestamp,
                ip,
                consent: body.consent,
                type: 'newsletter_subscription',
                retry: true
              });
              console.log('Added to queue for retry:', email);
              // Return success since we queued it
              return successResponse();
            } catch (queueError) {
              console.error('Queue also failed:', queueError);
            }
          }
          return errorResponse("Database error. Please try again later.", 500);
        } else {
          // Wait before retrying (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, 100 * (4 - retries)));
        }
      }
    }
    
    // If we get here, insertion failed after all retries
    return errorResponse("Unable to process subscription. Please try again later.", 500);
    
  } catch (error) {
    // Log error for debugging with more details
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : String(error);
    console.error('Newsletter subscription error:', {
      message: errorMessage,
      stack: errorStack,
      error: error
    });
    
    // Return more specific error message - always return valid JSON
    const finalMessage = errorMessage.includes('database') || errorMessage.includes('DB') 
      ? "Database error. Please try again later." 
      : "Internal server error. Please try again.";
    
    return errorResponse(finalMessage, 500);
  }
}
