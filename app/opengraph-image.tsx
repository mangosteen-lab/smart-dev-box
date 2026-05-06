import { ImageResponse } from 'next/og';

export const alt = 'SmartDevBox — Developer Toolbox';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0f1117',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'monospace',
          padding: '60px',
        }}
      >
        {/* Badge */}
        <div
          style={{
            background: '#1a1d2e',
            border: '1px solid #2a2d3e',
            borderRadius: '8px',
            padding: '8px 20px',
            color: '#7c8cf8',
            fontSize: '18px',
            marginBottom: '32px',
            letterSpacing: '0.05em',
          }}
        >
          FREE · AI-POWERED · 80+ TOOLS
        </div>

        {/* Title */}
        <div
          style={{
            color: '#ffffff',
            fontSize: '72px',
            fontWeight: 'bold',
            letterSpacing: '-0.02em',
            marginBottom: '24px',
            textAlign: 'center',
          }}
        >
          SmartDevBox
        </div>

        {/* Tagline */}
        <div
          style={{
            color: '#9ca3af',
            fontSize: '32px',
            textAlign: 'center',
            maxWidth: '800px',
          }}
        >
          Paste anything. We figure out the rest.
        </div>

        {/* Tool pills */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            marginTop: '48px',
            flexWrap: 'wrap',
            justifyContent: 'center',
            maxWidth: '900px',
          }}
        >
          {['Base64', 'JSON', 'JWT', 'XML', 'SQL', 'UUID', 'Hash', 'URL', 'Timestamp'].map(
            (tool) => (
              <div
                key={tool}
                style={{
                  background: '#1e2030',
                  border: '1px solid #313450',
                  borderRadius: '6px',
                  padding: '6px 16px',
                  color: '#e2e8f0',
                  fontSize: '20px',
                }}
              >
                {tool}
              </div>
            )
          )}
        </div>

        {/* URL */}
        <div
          style={{
            color: '#4b5563',
            fontSize: '22px',
            marginTop: '48px',
          }}
        >
          smartdevbox.com
        </div>
      </div>
    ),
    { ...size }
  );
}
