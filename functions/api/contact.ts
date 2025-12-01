// Cloudflare Pages Function for contact form
// This replaces the Next.js API route for Cloudflare Pages deployment

interface Env {
  RESEND_API_KEY?: string;
  [key: string]: any;
}

export async function onRequestPost({ request, env }: { request: Request; env: Env }) {
  try {
    // Get client IP
    const ip = request.headers.get('cf-connecting-ip') || 
               request.headers.get('x-forwarded-for') || 
               'unknown';
    
    // Rate limiting (simplified - in production, use Cloudflare KV or Durable Objects)
    // For now, we'll skip rate limiting in the function
    
    const body = await request.json();
    
    // Basic validation
    if (!body.name || !body.email) {
      return new Response(
        JSON.stringify({ success: false, error: "Name and email are required" }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    // TODO: Add actual email sending logic using Resend API or Cloudflare Email Workers
    // Example with Resend:
    // const resend = new Resend(env.RESEND_API_KEY);
    // await resend.emails.send({ ... });
    
    console.log('Contact form submission:', body);
    
    return new Response(
      JSON.stringify({ success: true, message: "Message received. We'll be in touch." }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: "Internal server error" }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

