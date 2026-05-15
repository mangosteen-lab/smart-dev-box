import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Page Not Found',
  description: 'The page you are looking for does not exist. Go back to SmartDevBox — the free browser-based developer toolbox.',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem 2rem',
        textAlign: 'center',
        fontFamily: 'var(--font)',
        gap: '1.5rem',
      }}
    >
      <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--text4)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
        404
      </p>
      <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 700, color: 'var(--text)', margin: 0 }}>
        Page not found
      </h1>
      <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--text3)', maxWidth: '40ch', margin: 0 }}>
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'var(--green)',
          color: '#0a0a0a',
          fontWeight: 700,
          fontSize: 'var(--fs-sm)',
          fontFamily: 'var(--font)',
          textDecoration: 'none',
          padding: '0.625rem 1.5rem',
          borderRadius: '6px',
          marginTop: '0.5rem',
        }}
      >
        ← Back to SmartDevBox
      </Link>
    </div>
  );
}
