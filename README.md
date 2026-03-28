# Mission Control v3

Operational command center for the Lux AI agent swarm.

## Quick Start
```bash
npm install
npm run dev
```

Dev server runs on `http://localhost:3333`.

## Environment
```bash
OPENCLAW_CONFIG_PATH=~/.openclaw/openclaw.json
WORKSPACE_PATH=~/workspace
GATEWAY_URL=ws://127.0.0.1:18789
```

## Architecture
- Next.js 15 App Router
- WebSocket bridge to OpenClaw Gateway for all real-time data
- File system reads for markdown-based state (memory, approvals, etc.)
- Tailwind CSS with dual-theme system (warm/cyber toggle)
- No database, no external auth — runs on private Tailscale network

See `AGENTS.md` for full spec.
