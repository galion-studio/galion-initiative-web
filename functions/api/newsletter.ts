// Cloudflare Pages Function for newsletter subscription
// This replaces the Next.js API route for Cloudflare Pages deployment

interface Env {
  RESEND_API_KEY?: string;
  NEXT_PUBLIC_NEWSLETTER_LIST_ID?: string;
  [key: string]: any;
}

export async function onRequestPost({ request, env }: { request: Request; env: Env }) {
  try {
    // Get client IP
    const ip = request.headers.get('cf-connecting-ip') || 
               request.headers.get('x-forwarded-for') || 
               'unknown';
    
    const body = await request.json();
    
    // Honeypot check
    if (body.honeypot) {
      // Silent success for bots
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
    
    // TODO: Add actual newsletter subscription logic using Resend API or Cloudflare Email Workers
    // Example with Resend:
    // const resend = new Resend(env.RESEND_API_KEY);
    // await resend.contacts.create({ ... });
    
    console.log('Newsletter subscription:', body);
    
    return new Response(
      JSON.stringify({ success: true, message: "Subscribed successfully" }),
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

