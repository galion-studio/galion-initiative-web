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
  try {
    // Check if D1 database is available
    if (!env.DB) {
      console.error('D1 database binding not found. Make sure DB is bound in Cloudflare Pages settings.');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Database not configured. Please contact support." 
        }),
        { 
          status: 500,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      );
    }

    // Get client IP for rate limiting
    const ip = request.headers.get('cf-connecting-ip') || 
               request.headers.get('x-forwarded-for') || 
               'unknown';
    
    const body = await request.json();
    
    // Honeypot check - silent success for bots
    if (body.honeypot) {
      return new Response(
        JSON.stringify({ success: true, message: "Subscribed successfully" }),
        { 
          status: 200,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      );
    }
    
    // Basic validation
    if (!body.email) {
      return new Response(
        JSON.stringify({ success: false, error: "Email is required" }),
        { 
          status: 400,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      );
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid email format" }),
        { 
          status: 400,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      );
    }
    
    // Normalize email (lowercase)
    const email = body.email.toLowerCase().trim();
    
    // Check if email already exists in database
    const existing = await env.DB.prepare(
      'SELECT email FROM newsletter_subscribers WHERE email = ?'
    ).bind(email).first();
    
    if (existing) {
      // Email already subscribed - return success (don't reveal if email exists)
      return new Response(
        JSON.stringify({ success: true, message: "Subscribed successfully" }),
        { 
          status: 200,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      );
    }
    
    // Insert new subscriber into D1 database
    const timestamp = new Date().toISOString();
    await env.DB.prepare(
      `INSERT INTO newsletter_subscribers (email, subscribed_at, ip_address, consent)
       VALUES (?, ?, ?, ?)`
    ).bind(
      email,
      timestamp,
      ip,
      body.consent ? 1 : 0
    ).run();
    
    // Log successful subscription (for monitoring)
    console.log('Newsletter subscription successful:', { email, timestamp });
    
    return new Response(
      JSON.stringify({ success: true, message: "Subscribed successfully" }),
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
  } catch (error) {
    // Log error for debugging with more details
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : String(error);
    console.error('Newsletter subscription error:', {
      message: errorMessage,
      stack: errorStack,
      error: error
    });
    
    // Return more specific error message
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: errorMessage.includes('database') || errorMessage.includes('DB') 
          ? "Database error. Please try again later." 
          : "Internal server error. Please try again."
      }),
      { 
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    );
  }
}

