'use client';

import { usePathname } from 'next/navigation';
import { ThemeToggle } from './ThemeToggle';

const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/swarm': 'Swarm',
  '/tasks': 'Tasks',
  '/intel': 'Intel',
  '/memory': 'Memory',
  '/cron': 'Cron',
  '/chat': 'Chat',
  '/identity': 'Identity',
  '/money': 'Money',
  '/infra': 'Infrastructure',
};

export function Header() {
  const pathname = usePathname();
  const title = pageTitles[pathname] ?? 'Mission Control';

  return (
    <header className="sticky top-0 z-40 h-14 bg-panel/80 backdrop-blur-sm border-b border-edge flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <span className="text-muted text-sm">MC3</span>
        <span className="text-muted">/</span>
        <h2 className="text-foreground font-semibold text-lg">{title}</h2>
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
      </div>
    </header>
  );
}
