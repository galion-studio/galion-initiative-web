import { ImageResponse } from 'next/og';
 
export const runtime = 'edge';
 
export const alt = 'The Galion Initiative - Building Safe Superintelligence';
export const size = {
  width: 1200,
  height: 630,
};
 
export const contentType = 'image/png';
 
export default async function Image() {
  // Attempt to load the logo (Note: In edge runtime, filesystem access is limited. 
  // We use the deployed URL or a relative fetch if possible. 
  // For robustness in this environment without complex setup, we'll use a fetch to the public URL if it were absolute, 
  // but simpler is to rely on the SVG fallback if fetch fails, or just use the SVG which is guaranteed to work and looks clean.
  // However, since we have the logo, let's try to fetch it from the project structure.)
  
  let logoData: ArrayBuffer | null = null;
  try {
      // In Next.js Edge, we can import assets or fetch them. 
      // Fetching from the public URL requires the full URL.
      // We will fallback to the geometric SVG which looks professional if image loading is complex in this specific env.
      // But let's try to use the fetch approach with import.meta.url
      logoData = await fetch(new URL('../../public/logo.webp', import.meta.url)).then((res) => res.arrayBuffer());
  } catch (e) {
      console.error('Failed to load logo for OG image', e);
  }

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0a0a0a', // neutral-950
          color: 'white',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Background Grid Pattern Simulation */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(255, 255, 255, 0.1) 2%, transparent 0%)',
            backgroundSize: '50px 50px',
            opacity: 0.2,
          }}
        />

        {/* Spotlight Effect */}
        <div
            style={{
                position: 'absolute',
                top: '-20%',
                left: '20%',
                width: '60%',
                height: '60%',
                background: 'rgba(12, 135, 232, 0.15)', // primary-500 equivalent
                filter: 'blur(100px)',
                borderRadius: '50%',
            }}
        />

        {/* Logo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '120px',
            height: '120px',
            marginBottom: '40px',
          }}
        >
             {logoData ? (
                 <img src={logoData as any} width="120" height="120" style={{ objectFit: 'contain' }} />
             ) : (
                /* Fallback Geometric Logo */
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
             )}
        </div>

        <div
          style={{
            fontSize: '64px',
            fontWeight: 800,
            textAlign: 'center',
            marginBottom: '20px',
            letterSpacing: '-0.02em',
            background: 'linear-gradient(to bottom, #ffffff 40%, #a3a3a3)',
            backgroundClip: 'text',
            color: 'transparent',
            zIndex: 10,
          }}
        >
          The Galion Initiative
        </div>

        <div
          style={{
            fontSize: '28px',
            color: '#a3a3a3', // neutral-400
            textAlign: 'center',
            maxWidth: '800px',
            lineHeight: 1.5,
            fontWeight: 400,
            zIndex: 10,
          }}
        >
          Building Safe Superintelligence for Humanity
        </div>

        {/* Bottom Bar */}
        <div
            style={{
                position: 'absolute',
                bottom: '40px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '18px',
                color: '#525252',
            }}
        >
            <span>Research</span>
            <span>•</span>
            <span>Safety</span>
            <span>•</span>
            <span>Governance</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
