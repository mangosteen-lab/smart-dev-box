'use client';

import { useDevboxStore } from '@/store/devbox';

export function Navbar() {
  const { isDark, toggleTheme, toggleMobileSidebar, toggleSidebar, sidebarOpen } = useDevboxStore();

  return (
    <header
      className="flex items-center shrink-0"
      style={{
        height: '44px',
        background: 'var(--bg1)',
        borderBottom: '1px solid var(--border)',
        padding: '0 12px',
        gap: '10px',
        userSelect: 'none',
      }}
    >
      {/* Hamburger — mobile only */}
      <button
        className="flex md:hidden items-center justify-center"
        onClick={toggleMobileSidebar}
        aria-label="Open tool menu"
        style={{
          width: '36px',
          height: '36px',
          background: 'none',
          border: '1px solid var(--border)',
          borderRadius: '4px',
          cursor: 'pointer',
          color: 'var(--text3)',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="6" x2="21" y2="6"/>
          <line x1="3" y1="12" x2="21" y2="12"/>
          <line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>

      {/* macOS-style traffic light dots — desktop only */}
      <div className="hidden md:flex items-center" style={{ gap: '7px' }}>
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
      <div className="flex items-center" style={{ gap: '8px', marginLeft: '4px' }}>
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

      {/* Tagline — hidden on mobile */}
      <span className="hidden md:inline" style={{ fontSize: 'var(--fs-xs)', color: 'var(--text3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0 }}>
        Paste anything. We figure out the rest.
      </span>

      {/* Tools toggle — desktop only */}
      <button
        onClick={toggleSidebar}
        className="hidden md:flex items-center justify-center"
        title={sidebarOpen ? 'Hide tools' : 'Show tools'}
        aria-label="Toggle tools sidebar"
        style={{
          height: '28px',
          padding: '0 10px',
          fontSize: 'var(--fs-xs)',
          color: sidebarOpen ? 'var(--green)' : 'var(--text3)',
          background: sidebarOpen ? 'var(--green-bg)' : 'none',
          border: `1px solid ${sidebarOpen ? 'var(--green)' : 'var(--border)'}`,
          borderRadius: '4px',
          cursor: 'pointer',
          fontFamily: 'var(--font)',
          gap: '6px',
          transition: 'color .15s, border-color .15s, background .15s',
          whiteSpace: 'nowrap',
          flexShrink: 0,
        }}
        onMouseEnter={e => { if (!sidebarOpen) { (e.currentTarget as HTMLElement).style.color = 'var(--text2)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--border2)'; } }}
        onMouseLeave={e => { if (!sidebarOpen) { (e.currentTarget as HTMLElement).style.color = 'var(--text3)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; } }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/>
        </svg>
        Tools
      </button>

      {/* Right actions */}
      <div className="flex items-center" style={{ marginLeft: 'auto', gap: '6px' }}>
        {/* Contact / report issue */}
        <a
          href="mailto:support@smartdevbox.com"
          title="Contact us or report an issue"
          className="flex items-center justify-center"
          style={{
            height: '36px',
            padding: '0 10px',
            fontSize: 'var(--fs-xs)',
            color: 'var(--text3)',
            background: 'none',
            border: '1px solid var(--border)',
            borderRadius: '4px',
            cursor: 'pointer',
            fontFamily: 'var(--font)',
            textDecoration: 'none',
            gap: '6px',
            transition: 'color .15s, border-color .15s',
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text2)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--border2)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text3)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
          <span className="hidden md:inline">Contact</span>
        </a>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="flex items-center justify-center"
          style={{
            width: '36px',
            height: '36px',
            fontSize: 'var(--fs-xs)',
            color: 'var(--text3)',
            background: 'none',
            border: '1px solid var(--border)',
            borderRadius: '4px',
            cursor: 'pointer',
            fontFamily: 'var(--font)',
            transition: 'color .15s, border-color .15s',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text2)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--border2)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text3)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; }}
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-label="Toggle theme"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        </button>
      </div>
    </header>
  );
}
