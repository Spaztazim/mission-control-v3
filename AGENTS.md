# AGENTS.md — Mission Control v3

## What This Is
Mission Control is the operational command center for an AI agent swarm called "The Moth Colony." It's a single-pane-of-glass dashboard that monitors agents, tasks, infrastructure, and business metrics for a small business operator running multiple companies.

Think: a cyberpunk version of Grafana meets Linear meets a personal AI command center.

## Tech Stack
- **Framework:** Next.js 15 (App Router, Server Components where possible)
- **Styling:** Tailwind CSS v4 + CSS custom properties for theming
- **State:** React Server Components for data, client components only when interactive
- **Real-time:** WebSocket connection to OpenClaw Gateway (ws://127.0.0.1:18789)
- **Charts:** Recharts or lightweight alternative
- **Icons:** Lucide React
- **Animation:** Framer Motion (sparingly — for page transitions and micro-interactions)
- **TypeScript:** Strict mode, no `any`

## Design System

### Dual Theme (Toggle)
The app has two themes toggled by a switch in the header:

**Warm / Nostalgia Mode (default dark):**
- Background: `#0a0f05` (deep forest black)
- Primary: `#f5a623` (warm amber/gold)
- Secondary: `#e8d5a3` (parchment)
- Accent: `#7bc67e` (soft green)
- Text: `#f0e6c8` (warm cream)
- Muted: `#a09070`
- Font: Georgia, Palatino, serif
- Vibe: Calm, warm, like a porch lantern at night

**Cyber / Reality Mode:**
- Background: `#030308` (void black)
- Primary: `#00f5ff` (electric cyan)
- Secondary: `#ff0090` (hot pink)
- Accent: `#ffaa00` (warning amber)
- Text: `#e0f0ff` (cool white)
- Muted: `#4080a0`
- Font: 'Courier New', monospace
- Scanline overlay (subtle CSS repeating-gradient)
- Vibe: Blade Runner terminal, cyberpunk 2077

### Component Style
- Cards with subtle borders (`border-border`), no heavy shadows
- Rounded corners: `rounded-lg` (8px)
- Spacing: generous, breathable — not cramped
- Status indicators: colored dots with pulse animation for live
- Hover states: subtle glow matching primary color
- Transitions: 200-300ms ease, nothing jarring
- Mobile-first responsive (sidebar collapses to icons)

### Layout
- Fixed sidebar (left, 56px collapsed / 224px expanded)
- Top header bar with: breadcrumb, theme toggle, gateway status dot, agent switcher
- Main content area with max-width 1400px, padding 24px
- Cards in CSS Grid layouts (auto-fill, minmax patterns)

## Architecture

### Gateway WebSocket Bridge (`lib/gateway.ts`)
Single WebSocket connection to OpenClaw Gateway at `ws://127.0.0.1:18789`.
Protocol: JSON-RPC style with challenge/auth handshake.
- Sends `connect` request with auth token (read from `~/.openclaw/openclaw.json`)
- All data fetched via `rpc(method, params)` calls
- Auto-reconnect on disconnect
- Expose as singleton, used by API routes (server-side)

Key RPC methods available:
- `status` — gateway health, uptime, connected agents
- `sessions.list` — active agent sessions
- `sessions.send` — send message to a session
- `cron.list` / `cron.update` — manage scheduled jobs
- `config.get` / `config.patch` — read/write OpenClaw config
- `skills.list` — installed skills
- `usage` — token usage stats

### API Routes (`app/api/`)
Thin server-side wrappers around the gateway bridge. Each returns JSON.
Keep them focused — one concern per route.

### File Operations
Some features read/write markdown files from the workspace (`$WORKSPACE_PATH/`):
- `MEMORY.md`, `APPROVALS.md`, `INBOX.md`, `HEARTBEAT.md`
- `memory/*.md` (daily logs)
- `mission-control/BOARD.md`
These use `fs` in API routes. Never expose fs to client components.

### Real-time Updates
For live data (agent sessions, alerts), use WebSocket event subscriptions.
Gateway pushes events for session changes, new messages, etc.
Client components connect via a React context provider that manages the WS lifecycle.

## Pages

### 1. Dashboard (`/`)
The home screen. At-a-glance status of everything.
- **System Status Bar:** Gateway status, agent count, active sessions, uptime
- **Token Burn Card:** Today's spend, monthly spend, budget gauge, cache hit ratio
- **Agent Grid:** Cards for each agent (Lux, Deckard, Vyxelle) — status, last message, model
- **Active Tasks:** Top 5 from ClickUp pipeline (fetched via API)
- **Recent Activity Feed:** Last 10 events (task completions, cron runs, alerts)
- **Quick Actions:** Buttons for common ops (spawn moth, run cron, check inbox)

### 2. Swarm (`/swarm`)
Monitor and control the moth colony.
- **Session List:** All active sessions with agent, model, duration, message count
- **Session Detail (expandable):** Last N messages, send message input, kill button
- **Spawn Panel:** Form to spawn new moth (task, model, label)
- **Stats:** Total sessions, tokens by session, model distribution pie chart

### 3. Tasks (`/tasks`)
ClickUp integration + approvals.
- **Pipeline Board:** Kanban columns (Backlog ? In Progress ? QA Review ? Done)
- **Task Cards:** Title, assignee, tags, priority, due date
- **Approvals Sub-tab:** Items from APPROVALS.md with Approve/Reject/Defer buttons
- **Create Task:** Quick form (title, description, list, tags)

### 4. Intel (`/intel`)
News and engagement pipeline.
- **Raw Feed:** Latest gathered items from `memory/intel-raw.md`
- **Analyzed:** Categorized items with tags (news/upgrade/content/business)
- **Engagement Queue:** Drafted X replies with Send/Edit/Skip buttons
- **Filters:** By category, date, source

### 5. Memory (`/memory`)
Browse and search the agent's memory.
- **File Browser:** Tree view of `memory/` directory
- **File Viewer/Editor:** Read and edit markdown files
- **Search:** Full-text search across memory files (QMD integration)
- **MEMORY.md:** Dedicated editor for long-term memory with save

### 6. Cron (`/cron`)
Scheduled job management.
- **Job List:** All cron jobs with schedule, status, last run, error count
- **Job Detail:** Full config, recent execution log, enable/disable toggle
- **Create/Edit:** Form for new cron jobs
- **Skills List:** Installed OpenClaw skills with metadata

### 7. Chat (`/chat`)
Talk to agents directly from the browser.
- **Agent Selector:** Pick which agent to talk to
- **Message Thread:** Scrollable chat with markdown rendering
- **Input:** Text area with send, supports shift+enter for newlines
- **Session Picker:** Switch between active sessions

### 8. Identity (`/identity`)
Agent soul and configuration.
- **SOUL.md Editor:** Live edit with preview
- **AGENTS.md Editor:** Same
- **Config Viewer:** Current OpenClaw config (read-only, key sections)
- **Agent Roster:** All configured agents with their models, status

### 9. Money (`/money`)
Token economics and cost tracking.
- **Usage Chart:** Daily token usage over 30 days (line chart)
- **Model Breakdown:** Tokens by model (bar chart)
- **Budget Gauge:** Monthly spend vs soft budget
- **Cache Stats:** Hit ratio, savings estimate
- **Cost Projections:** Estimated monthly at current rate

### 10. Infrastructure (`/infra`)
Server and node monitoring.
- **Node List:** Tailscale nodes with status, IP, last seen
- **Proxmox Panel:** R730 VM/container status (if reachable)
- **Service Health:** PM2 processes, ports, uptime
- **Print Farm:** Bambu printer status cards

## File Structure
```
src/
  app/
    layout.tsx          # Root layout with ThemeProvider, Sidebar, Header
    page.tsx            # Dashboard
    swarm/page.tsx
    tasks/page.tsx
    intel/page.tsx
    memory/page.tsx
    cron/page.tsx
    chat/page.tsx
    identity/page.tsx
    money/page.tsx
    infra/page.tsx
    api/
      status/route.ts
      sessions/route.ts
      cron/route.ts
      tasks/route.ts
      files/route.ts
      usage/route.ts
      chat/route.ts
      config/route.ts
  components/
    layout/
      Sidebar.tsx
      Header.tsx
      ThemeToggle.tsx
    ui/
      Card.tsx
      Badge.tsx
      Button.tsx
      StatusDot.tsx
      Chart.tsx
      Modal.tsx
      Editor.tsx
    dashboard/
      SystemStatus.tsx
      TokenBurn.tsx
      AgentGrid.tsx
      ActivityFeed.tsx
    swarm/
      SessionList.tsx
      SessionDetail.tsx
      SpawnPanel.tsx
    tasks/
      PipelineBoard.tsx
      TaskCard.tsx
      ApprovalsPanel.tsx
    intel/
      IntelFeed.tsx
      EngagementQueue.tsx
    memory/
      FileBrowser.tsx
      FileEditor.tsx
    cron/
      CronJobList.tsx
      CronJobDetail.tsx
    chat/
      ChatThread.tsx
      MessageInput.tsx
    money/
      UsageChart.tsx
      BudgetGauge.tsx
  lib/
    gateway.ts          # WebSocket bridge singleton
    theme.tsx           # ThemeContext + ThemeProvider
    themes.ts           # Theme definitions
    utils.ts            # Formatters, helpers
    types.ts            # Shared TypeScript types
  styles/
    globals.css         # Tailwind + CSS custom properties + theme vars
```

## Quality Bar
- No `any` types
- All API routes handle errors gracefully (try/catch, meaningful error responses)
- Loading states for all async data (skeleton screens, not spinners)
- Empty states for lists (not just blank)
- Responsive: works on 375px mobile through 2560px ultrawide
- Accessible: proper aria labels, keyboard nav, focus states
- Performance: no unnecessary re-renders, memoize expensive computations

## Reference
The previous version (MC2) lives at `$WORKSPACE_PATH/mission-control-v2\`.
Its `src/lib/gateway-ws.ts` has the working WebSocket bridge implementation.
Its API routes in `src/app/api/` show the RPC patterns that work.
Use MC2 as reference for what works, but build MC3 from scratch with better architecture.

## Don't
- Don't use a UI component library (shadcn, MUI, etc.) — build components from scratch with Tailwind
- Don't add a database — all state comes from the gateway or filesystem
- Don't over-engineer auth — this runs on a private Tailscale network
- Don't use `getServerSideProps` — this is App Router, use Server Components and API routes
- Don't hardcode file paths — use env vars or config for workspace path
