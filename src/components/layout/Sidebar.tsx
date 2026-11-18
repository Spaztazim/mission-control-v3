'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Bug, ListChecks, Newspaper, Brain,
  Clock, MessageSquare, Fingerprint, DollarSign, Server,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface NavLink {
  href: string;
  label: string;
  icon: LucideIcon;
  desc: string;
}

const links: NavLink[] = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard, desc: 'Overview' },
  { href: '/swarm', label: 'Swarm', icon: Bug, desc: 'Sessions' },
  { href: '/tasks', label: 'Tasks', icon: ListChecks, desc: 'Pipeline' },
  { href: '/intel', label: 'Intel', icon: Newspaper, desc: 'News + Engage' },
  { href: '/memory', label: 'Memory', icon: Brain, desc: 'Files + Search' },
  { href: '/cron', label: 'Cron', icon: Clock, desc: 'Jobs + Skills' },
  { href: '/chat', label: 'Chat', icon: MessageSquare, desc: 'Comms' },
  { href: '/identity', label: 'Identity', icon: Fingerprint, desc: 'Soul + Config' },
  { href: '/money', label: 'Money', icon: DollarSign, desc: 'Cost + Usage' },
  { href: '/infra', label: 'Infra', icon: Server, desc: 'Nodes + Services' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-14 md:w-56 bg-panel border-r border-edge flex flex-col z-50">
      <div className="p-2 md:p-4 border-b border-edge">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-lg bg-primary/20 text-primary text-xs font-bold flex items-center justify-center shrink-0">
            MC
          </span>
          <div className="hidden md:block">
            <h1 className="text-primary font-bold text-lg tracking-wide glow-text">MC3</h1>
            <p className="text-muted text-xs">Moth Colony</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 py-2 overflow-y-auto">
        {links.map((link) => {
          const active = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-2 md:px-4 py-2.5 mx-1 md:mx-2 rounded-lg transition-all duration-200 text-sm ${
                active
                  ? 'bg-highlight text-primary border border-primary/20 glow-box'
                  : 'text-dim hover:text-foreground hover:bg-highlight/50'
              }`}
            >
              <Icon size={18} className="shrink-0" />
              <div className="hidden md:block">
                <div className={active ? 'text-primary font-medium' : ''}>{link.label}</div>
                <div className="text-muted text-xs">{link.desc}</div>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-2 md:p-4 border-t border-edge">
        <div className="hidden md:flex items-center gap-1.5 text-muted text-xs">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse-glow" />
          Gateway
        </div>
        <div className="md:hidden flex justify-center">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse-glow" />
        </div>
      </div>
    </aside>
  );
}
