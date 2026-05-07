'use client';

import { useDevboxStore } from '@/store/devbox';

export function Navbar() {
  const { isDark, toggleTheme } = useDevboxStore();

  return (
    <header
      className="flex items-center shrink-0"
      style={{
        height: '40px',
        background: 'var(--bg1)',
        borderBottom: '1px solid var(--border)',
        padding: '0 16px',
        gap: '12px',
        userSelect: 'none',
      }}
    >
      {/* macOS-style traffic light dots */}
      <div className="flex items-center" style={{ gap: '7px' }}>
        <div
          style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f57', cursor: 'pointer', transition: 'opacity .15s' }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.75')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        />
        <div
          style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#febc2e', cursor: 'pointer', transition: 'opacity .15s' }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.75')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        />
        <div
          style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#28c840', cursor: 'pointer', transition: 'opacity .15s' }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.75')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        />
      </div>

      {/* Logo */}
      <div className="flex items-center" style={{ gap: '8px', marginLeft: '8px' }}>
        <div
          style={{
            width: '22px',
            height: '22px',
            background: 'var(--green)',
            borderRadius: '5px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 'var(--fs-xs)',
            fontWeight: 700,
            color: '#0a0a0a',
            flexShrink: 0,
          }}
        >
          &gt;_
        </div>
        <span style={{ fontSize: 'var(--fs-sm)', fontWeight: 700, color: 'var(--text)' }}>
          smart<span style={{ color: 'var(--green)' }}>dev</span>box
        </span>
      </div>

      <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--text3)' }}>
        Paste anything. We figure out the rest.
      </span>

      {/* Right actions */}
      <div className="flex items-center" style={{ marginLeft: 'auto', gap: '6px' }}>
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="flex items-center justify-center"
          style={{
            fontSize: 'var(--fs-xs)',
            color: 'var(--text3)',
            background: 'none',
            border: '1px solid var(--border)',
            borderRadius: '4px',
            padding: '3px 10px',
            cursor: 'pointer',
            fontFamily: 'var(--font)',
            transition: 'color .15s, border-color .15s',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text2)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--border2)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text3)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; }}
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-label="Toggle theme"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        </button>


      </div>
    </header>
  );
}
