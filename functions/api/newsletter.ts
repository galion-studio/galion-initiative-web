// Cloudflare Pages Function for newsletter subscription
// Uses Cloudflare D1 database to store newsletter subscriptions

// Cloudflare D1 Database type definition
interface D1Database {
  prepare(query: string): D1PreparedStatement;
  exec(query: string): Promise<D1ExecResult>;
}

interface D1PreparedStatement {
  bind(...values: any[]): D1PreparedStatement;
  first<T = any>(): Promise<T | null>;
  run(): Promise<D1Result>;
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

interface Env {
  DB: D1Database; // Cloudflare D1 database binding
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

    // Get client IP for rate limiting
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
    
    // Normalize email (lowercase)
    const email = body.email.toLowerCase().trim();
    
    // Check if email already exists in database
    const existing = await env.DB.prepare(
      'SELECT email FROM newsletter_subscribers WHERE email = ?'
    ).bind(email).first();
    
    if (existing) {
      // Email already subscribed - return success (don't reveal if email exists)
      return successResponse();
    }
    
    // Insert new subscriber into D1 database
    const timestamp = new Date().toISOString();
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
      
      // Log successful subscription (for monitoring)
      console.log('Newsletter subscription successful:', { email, timestamp, result });
      
      return successResponse();
    } catch (dbError) {
      console.error('Database insert error:', dbError);
      // Check if it's a unique constraint error (email already exists)
      const errorMessage = dbError instanceof Error ? dbError.message : String(dbError);
      if (errorMessage.includes('UNIQUE constraint') || errorMessage.includes('unique')) {
        // Email already exists, return success
        return successResponse();
      }
      // Other database error
      return errorResponse("Database error. Please try again later.", 500);
    }
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

