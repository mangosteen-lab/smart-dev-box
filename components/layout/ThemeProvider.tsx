'use client';

import { useEffect } from 'react';
import { useDevboxStore } from '@/store/devbox';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const isDark = useDevboxStore((s) => s.isDark);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  return <>{children}</>;
}
