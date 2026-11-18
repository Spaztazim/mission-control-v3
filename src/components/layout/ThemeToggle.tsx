'use client';

import { useTheme } from '@/lib/theme';
import { Sun, Zap } from 'lucide-react';

export function ThemeToggle() {
  const { theme, toggleTheme, isTransitioning } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      disabled={isTransitioning}
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-edge bg-card hover:bg-highlight transition-all duration-200 text-sm disabled:opacity-50"
      aria-label="Toggle theme"
    >
      {theme === 'nostalgia' ? (
        <>
          <Sun size={14} className="text-primary" />
          <span className="hidden sm:inline text-dim">Then</span>
        </>
      ) : (
        <>
          <Zap size={14} className="text-primary" />
          <span className="hidden sm:inline text-dim">Now</span>
        </>
      )}
    </button>
  );
}
