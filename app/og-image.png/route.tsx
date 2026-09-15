import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          backgroundColor: '#09090B',
          padding: '80px',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Glow */}
        <div
          style={{
            position: 'absolute',
            top: '-10%',
            right: '-10%',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            backgroundColor: 'rgba(16, 185, 129, 0.12)',
            filter: 'blur(100px)',
          }}
        />

        {/* Brand Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: '#18181B',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                width: '24px',
                height: '24px',
                border: '2px solid #10B981',
                transform: 'rotate(45deg)',
              }}
            />
          </div>
          <span style={{ fontSize: '32px', fontWeight: 800, color: '#FFFFFF' }}>
            Naagmani
          </span>
          <div
            style={{
              fontSize: '14px',
              fontWeight: 700,
              fontFamily: 'monospace',
              color: '#10B981',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              padding: '6px 12px',
              borderRadius: '999px',
              border: '1px solid rgba(16, 185, 129, 0.25)',
            }}
          >
            DOCS v1.0.0
          </div>
        </div>

        {/* Title & Subtitle */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '900px' }}>
          <h1
            style={{
              fontSize: '56px',
              fontWeight: 900,
              color: '#FFFFFF',
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              margin: 0,
            }}
          >
            The AI Runtime for your applications.
          </h1>
          <p
            style={{
              fontSize: '24px',
              color: '#A1A1AA',
              lineHeight: 1.4,
              margin: 0,
            }}
          >
            Unified AI Gateway • BYOK Security • Smart Routing • Polyglot HDK Plugins • Real-Time FinOps
          </p>
        </div>

        {/* Footer info */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            borderTop: '1px solid #27272A',
            paddingTop: '24px',
          }}
        >
          <span style={{ fontSize: '18px', color: '#71717A', fontFamily: 'monospace' }}>
            docs.naagmani.app
          </span>
          <span style={{ fontSize: '18px', color: '#10B981', fontWeight: 600 }}>
            OpenAI-Compatible AI Infrastructure
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
