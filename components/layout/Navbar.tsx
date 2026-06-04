'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useDevboxStore } from '@/store/devbox';

const FEATURE_LINKS = [
  { href: '/features/tools',          label: 'All Tools',           desc: '97+ built-in tools' },
  { href: '/tools',                   label: 'Tool Guides',         desc: 'Articles for every tool' },
  { href: '/recipes',                 label: 'Recipes',             desc: 'Workflow guides' },
  { href: '/features/auto-detection', label: 'Auto Detection',      desc: 'Paste → instant result' },
  { href: '/features/smart-extract',  label: 'Smart Extract',       desc: 'Pull emails, URLs, numbers' },
  { href: '/features/compare',        label: 'Compare / Diff',      desc: 'Side-by-side text diff' },
  { href: '/features/plugins',        label: 'Plugin System',       desc: 'Add your own tools' },
  { href: '/features/privacy',        label: 'Privacy & Security',  desc: '100% client-side' },
];

export function Navbar() {
  const { isDark, toggleTheme, toggleMobileSidebar, toggleSidebar, sidebarOpen, toggleCommandPalette } = useDevboxStore();
  const [featuresOpen, setFeaturesOpen] = useState(false);
  const featuresRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (featuresRef.current && !featuresRef.current.contains(e.target as Node)) {
        setFeaturesOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

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
      <span className="hidden lg:inline" style={{ fontSize: 'var(--fs-xs)', color: 'var(--text3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0 }}>
        Paste anything. We figure out the rest.
      </span>

      {/* Features dropdown — desktop only */}
      <div ref={featuresRef} className="hidden md:block nav-features-wrap">
        <button
          className="nav-features-btn"
          onClick={() => setFeaturesOpen(o => !o)}
          aria-haspopup="true"
          aria-expanded={featuresOpen}
        >
          Features
          <svg
            width="10" height="10" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
            style={{ transition: 'transform .15s', transform: featuresOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
          >
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>

        <div
          className="nav-features-dropdown"
          role="menu"
          aria-hidden={!featuresOpen}
          style={{ display: featuresOpen ? undefined : 'none' }}
        >
          {FEATURE_LINKS.map(({ href, label, desc }) => (
            <Link
              key={href}
              href={href}
              role="menuitem"
              className="nav-features-item"
              tabIndex={featuresOpen ? undefined : -1}
              onClick={() => setFeaturesOpen(false)}
            >
              <span className="nav-features-item-label">{label}</span>
              <span className="nav-features-item-desc">{desc}</span>
            </Link>
          ))}
        </div>
      </div>
      {/* Always-visible search trigger */}
      <button
        data-testid="command-palette-trigger"
        className="hidden md:flex search-trigger"
        onClick={toggleCommandPalette}
        title="Search tools (⌘K)"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <span style={{ flex: 1, textAlign: 'left' }}>Search tools…</span>
        <kbd className="kbd-hint">⌘K</kbd>
      </button>

      {/* 100% Client-side trust badge */}
      <span className="hidden lg:inline-flex trust-badge">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
        100% client-side
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
        {/* GitHub link */}
        <a
          href="https://github.com/mangosteen-lab/smart-dev-box"
          target="_blank"
          rel="noopener noreferrer"
          title="View on GitHub"
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
            transition: 'color .15s, border-color .15s',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text2)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--border2)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text3)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
          </svg>
        </a>
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
