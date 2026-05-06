'use client';

import { useDevboxStore } from '@/store/devbox';

export function Navbar() {
  const { isDark, toggleTheme } = useDevboxStore();

  return (
    <header
      className="flex items-center justify-between px-4 h-12 border-b shrink-0"
      style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
    >
      {/* Logo + Name */}
      <div className="flex items-center gap-2">
        <div
          className="w-7 h-7 rounded-md flex items-center justify-center text-white font-bold text-sm"
          style={{ background: 'var(--primary)' }}
        >
          D
        </div>
        <span className="font-semibold text-sm tracking-tight" style={{ color: 'var(--foreground)' }}>
          DevBox
        </span>
        <span
          className="text-xs px-1.5 py-0.5 rounded"
          style={{ background: 'var(--surface-2)', color: 'var(--muted)' }}
        >
          developer tools
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="w-8 h-8 rounded flex items-center justify-center text-sm transition-colors hover:opacity-80"
          style={{ background: 'var(--surface-2)', color: 'var(--muted)' }}
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-label="Toggle theme"
        >
          {isDark ? '☀' : '◑'}
        </button>
      </div>
    </header>
  );
}
