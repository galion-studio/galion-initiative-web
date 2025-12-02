import { ImageResponse } from 'next/og';
 
// Force static generation for static export compatibility
// This tells Next.js to generate this image at build time
export const dynamic = 'force-static';
 
export const alt = 'The Galion Initiative - Building Safe Superintelligence';
export const size = {
  width: 1200,
  height: 630,
};
 
export const contentType = 'image/png';
 
export default async function Image() {
  // For static export, we use the SVG fallback logo
  // ImageResponse doesn't support WebP format, and the SVG looks professional
  // This ensures the OpenGraph image generates correctly during static export

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

        {/* Logo - Using SVG for static export compatibility */}
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
          {/* Geometric Logo - SVG works perfectly with ImageResponse and static export */}
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
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
