"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Hive", icon: "HV", desc: "Dashboard" },
  { href: "/operator", label: "Operator", icon: "OP", desc: "H3.0 + Health" },
  { href: "/swarm", label: "Swarm", icon: "SW", desc: "Sessions + Observe" },
  { href: "/trace", label: "Trace", icon: "TR", desc: "Live File Stream" },
  { href: "/tasks", label: "Tasks", icon: "TK", desc: "Board + Approvals" },
  { href: "/pipeline", label: "Pipeline", icon: "PL", desc: "Agent Workflow" },
  { href: "/projects", label: "Projects", icon: "PR", desc: "Workflow Status" },
  { href: "/services", label: "Services", icon: "SV", desc: "Runtime Health" },
  { href: "/capture", label: "Capture", icon: "CP", desc: "Inbox" },
  { href: "/intel", label: "Intel", icon: "IN", desc: "News + Engage" },
  { href: "/alerts", label: "Alerts", icon: "AL", desc: "Rules + History" },
  { href: "/cron", label: "Config", icon: "CF", desc: "Cron + Skills" },
  { href: "/soul", label: "Identity", icon: "ID", desc: "Soul + Memory" },
  { href: "/money", label: "Monitor", icon: "MN", desc: "Cost + Security" },
  { href: "/r730", label: "R730", icon: "R7", desc: "Proxmox + Nodes" },
  { href: "/chat", label: "Chat", icon: "CH", desc: "Comms" },
];

const parentMap: Record<string, string> = {
  "/observability": "/swarm",
  "/approvals": "/tasks",
  "/skills": "/cron",
  "/memory": "/soul",
  "/security": "/money",
};

export function Sidebar() {
  const pathname = usePathname();
  const activeHref = parentMap[pathname] ?? pathname;

  return (
    <aside className="fixed left-0 top-0 h-screen w-16 md:w-56 bg-bg-secondary border-r border-border flex flex-col z-50">
      <div className="p-3 md:p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-md bg-gold/20 text-gold text-xs font-bold flex items-center justify-center">MC</span>
          <div className="hidden md:block">
            <h1 className="text-gold font-bold text-lg tracking-wide">MISSION CTRL</h1>
            <p className="text-text-muted text-xs">Lux Hive Network</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 py-2 overflow-y-auto">
        {links.map((link) => {
          const active = activeHref === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 md:px-4 py-2.5 mx-1 md:mx-2 rounded-lg transition-all text-sm ${
                active
                  ? "bg-bg-hover text-gold border border-gold/20 glow-gold"
                  : "text-text-secondary hover:text-text-primary hover:bg-bg-hover/50"
              }`}
            >
              <span className={`w-7 h-7 rounded-md text-[10px] font-bold flex items-center justify-center flex-shrink-0 ${active ? "bg-gold/20 text-gold" : "bg-bg-card text-text-muted"}`}>{link.icon}</span>
              <div className="hidden md:block">
                <div className={active ? "text-gold font-medium" : ""}>{link.label}</div>
                <div className="text-text-muted text-xs">{link.desc}</div>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-3 md:p-4 border-t border-border">
        <div className="hidden md:block text-text-muted text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green animate-pulse-glow" />
            Gateway Online
          </div>
        </div>
        <div className="md:hidden flex justify-center">
          <span className="w-2 h-2 rounded-full bg-green animate-pulse-glow" />
        </div>
      </div>
    </aside>
  );
}


