// Cloudflare Pages Function for newsletter subscription
// Uses Cloudflare D1 database to store newsletter subscriptions

interface Env {
  DB: D1Database; // Cloudflare D1 database binding
  [key: string]: any;
}

export async function onRequestPost({ request, env }: { request: Request; env: Env }) {
  try {
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
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Basic validation
    if (!body.email) {
      return new Response(
        JSON.stringify({ success: false, error: "Email is required" }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
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
          headers: { 'Content-Type': 'application/json' }
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
          headers: { 'Content-Type': 'application/json' }
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
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    // Log error for debugging
    console.error('Newsletter subscription error:', error);
    
    return new Response(
      JSON.stringify({ success: false, error: "Internal server error" }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

