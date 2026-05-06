'use client';

import { useDevboxStore } from '@/store/devbox';

export function Navbar() {
  const { isDark, toggleTheme } = useDevboxStore();

  return (
    <header
      className="flex items-center justify-between px-5 shrink-0"
      style={{
        height: '60px',
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      {/* Logo + Name */}
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold shrink-0"
          style={{
            background: 'var(--gradient-brand)',
            boxShadow: '0 2px 10px var(--primary-glow)',
            fontSize: '16px',
          }}
        >
          D
        </div>
        <div className="flex items-center gap-2.5">
          <span
            className="font-bold tracking-tight"
            style={{ color: 'var(--foreground)', fontSize: '17px' }}
          >
            DevBox
          </span>
          <span
            className="px-2.5 py-1 rounded-full font-medium"
            style={{
              background: 'var(--primary-muted)',
              color: 'var(--primary)',
              border: '1px solid rgba(99,102,241,0.2)',
              fontSize: '12px',
            }}
          >
            developer tools
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="w-9 h-9 rounded-lg flex items-center justify-center transition-all hover:scale-105"
          style={{
            background: 'var(--surface-2)',
            color: 'var(--muted)',
            border: '1px solid var(--border)',
            fontSize: '16px',
          }}
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-label="Toggle theme"
        >
          {isDark ? '☀' : '◑'}
        </button>
      </div>
    </header>
  );
}
