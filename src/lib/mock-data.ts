import type {
  GatewayStatus, AgentSession, Agent, CronJob, Skill, TokenUsage,
  Task, Approval, IntelItem, EngagementDraft, MemoryFile, ChatMessage,
  ActivityEvent, TailscaleNode, ServiceHealth, PrinterStatus, UsageSummary,
} from './types';

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

function hoursAgo(n: number): string {
  const d = new Date();
  d.setHours(d.getHours() - n);
  return d.toISOString();
}

function minutesAgo(n: number): string {
  const d = new Date();
  d.setMinutes(d.getMinutes() - n);
  return d.toISOString();
}

// --- Gateway Status ---
export const mockGatewayStatus: GatewayStatus = {
  online: true,
  uptime: 847263,
  connectedAgents: 3,
  version: '3.2.1',
};

// --- Agent Sessions ---
export const mockSessions: AgentSession[] = [
  {
    id: 'sess-lux-01',
    agent: 'Lux',
    model: 'claude-sonnet-4-20250514',
    status: 'active',
    startedAt: minutesAgo(47),
    messageCount: 23,
    tokenUsage: 184200,
    lastMessage: 'Completed refactoring the authentication middleware. Moving to integration tests next.',
  },
  {
    id: 'sess-deckard-01',
    agent: 'Deckard',
    model: 'claude-sonnet-4-20250514',
    status: 'active',
    startedAt: hoursAgo(2),
    messageCount: 58,
    tokenUsage: 412800,
    lastMessage: 'Scanning X/Twitter for relevant AI agent discourse. Found 4 threads worth engaging.',
  },
  {
    id: 'sess-vyxelle-01',
    agent: 'Vyxelle',
    model: 'gpt-4o',
    status: 'idle',
    startedAt: hoursAgo(6),
    messageCount: 12,
    tokenUsage: 89400,
    lastMessage: 'Creative brief drafted for the new product landing page. Waiting for review.',
  },
  {
    id: 'sess-lux-02',
    agent: 'Lux',
    model: 'claude-sonnet-4-20250514',
    status: 'completed',
    startedAt: hoursAgo(12),
    messageCount: 145,
    tokenUsage: 1024000,
    lastMessage: 'Deployment pipeline fully configured. All checks green.',
  },
  {
    id: 'sess-deckard-02',
    agent: 'Deckard',
    model: 'claude-haiku-4-20250514',
    status: 'error',
    startedAt: hoursAgo(4),
    messageCount: 8,
    tokenUsage: 15600,
    lastMessage: 'Error: Rate limit exceeded on X API. Backing off for 15 minutes.',
  },
];

// --- Agents ---
export const mockAgents: Agent[] = [
  { id: 'lux', name: 'Lux', model: 'claude-sonnet-4-20250514', status: 'online', lastSeen: minutesAgo(1), description: 'Primary operator agent. Handles engineering, ops, and strategy.' },
  { id: 'deckard', name: 'Deckard', model: 'claude-sonnet-4-20250514', status: 'busy', lastSeen: minutesAgo(0), description: 'Intel & engagement agent. Monitors social feeds and drafts responses.' },
  { id: 'vyxelle', name: 'Vyxelle', model: 'gpt-4o', status: 'online', lastSeen: minutesAgo(15), description: 'Creative agent. Handles copywriting, branding, and design briefs.' },
];

// --- Tasks ---
export const mockTasks: Task[] = [
  { id: 'task-1', title: 'Implement WebSocket reconnection logic', status: 'done', assignee: 'Lux', tags: ['engineering', 'gateway'], priority: 'high', createdAt: daysAgo(5) },
  { id: 'task-2', title: 'Design new dashboard layout for MC3', status: 'done', assignee: 'Vyxelle', tags: ['design', 'mc3'], priority: 'high', createdAt: daysAgo(4) },
  { id: 'task-3', title: 'Set up Bambu printer monitoring API', status: 'in_progress', assignee: 'Lux', tags: ['infra', 'print-farm'], priority: 'medium', createdAt: daysAgo(3) },
  { id: 'task-4', title: 'Write engagement reply templates', status: 'in_progress', assignee: 'Deckard', tags: ['content', 'social'], priority: 'medium', createdAt: daysAgo(2) },
  { id: 'task-5', title: 'Audit token usage for cost optimization', status: 'qa_review', assignee: 'Lux', tags: ['cost', 'ops'], priority: 'high', createdAt: daysAgo(3) },
  { id: 'task-6', title: 'Create Tailscale node health check cron', status: 'backlog', tags: ['infra', 'cron'], priority: 'low', createdAt: daysAgo(1) },
  { id: 'task-7', title: 'Build agent memory search with QMD', status: 'backlog', assignee: 'Lux', tags: ['memory', 'search'], priority: 'medium', createdAt: daysAgo(1) },
  { id: 'task-8', title: 'Draft Q1 business review for Spaz', status: 'backlog', assignee: 'Vyxelle', tags: ['business', 'report'], priority: 'low', createdAt: daysAgo(0) },
  { id: 'task-9', title: 'Migrate cron jobs to new schedule format', status: 'in_progress', assignee: 'Lux', tags: ['engineering', 'cron'], priority: 'medium', createdAt: daysAgo(2) },
  { id: 'task-10', title: 'Review Proxmox VM resource allocation', status: 'qa_review', tags: ['infra', 'r730'], priority: 'low', createdAt: daysAgo(4) },
];

// --- Approvals ---
export const mockApprovals: Approval[] = [
  { id: 'appr-1', title: 'Deploy updated gateway v3.2.1 to production', description: 'Includes auth handshake fix and new RPC methods for session management.', requestedBy: 'Lux', requestedAt: hoursAgo(3), status: 'pending', category: 'deployment' },
  { id: 'appr-2', title: 'Purchase additional Bambu AMS unit', description: 'Current AMS is at capacity. New unit would allow 4-color prints without swapping.', requestedBy: 'Lux', requestedAt: daysAgo(1), status: 'pending', category: 'purchase' },
  { id: 'appr-3', title: 'Increase monthly token budget to $75', description: 'Current $50 budget is being hit by day 22. Recommend increase to accommodate growth.', requestedBy: 'Lux', requestedAt: daysAgo(2), status: 'pending', category: 'budget' },
  { id: 'appr-4', title: 'Enable Deckard auto-reply on X', description: 'Allow Deckard to auto-send approved reply templates without human review.', requestedBy: 'Deckard', requestedAt: daysAgo(3), status: 'deferred', category: 'automation' },
  { id: 'appr-5', title: 'Archive old memory files (pre-2025)', description: 'Compress and move old daily logs to cold storage to free workspace space.', requestedBy: 'Lux', requestedAt: daysAgo(4), status: 'approved', category: 'maintenance' },
];

// --- Intel ---
export const mockIntelItems: IntelItem[] = [
  { id: 'intel-1', title: 'Anthropic announces Claude 4 Opus with 1M context', source: 'X/Twitter', category: 'news', summary: 'Major model upgrade with significantly improved reasoning and code generation. Available via API today.', url: 'https://twitter.com/anthropic/status/example1', gatheredAt: hoursAgo(2), tags: ['ai', 'anthropic', 'models'] },
  { id: 'intel-2', title: 'OpenAI deprecating GPT-4-turbo in 60 days', source: 'OpenAI Blog', category: 'upgrade', summary: 'Migration path available. Recommend switching affected workflows to gpt-4o by end of month.', url: 'https://openai.com/blog/example', gatheredAt: hoursAgo(5), tags: ['openai', 'deprecation', 'migration'] },
  { id: 'intel-3', title: 'Competitor launched AI agent marketplace', source: 'TechCrunch', category: 'business', summary: 'New startup offering plug-and-play agent templates. Could affect Lux Hive positioning.', url: 'https://techcrunch.com/example', gatheredAt: hoursAgo(8), tags: ['competition', 'agents', 'market'] },
  { id: 'intel-4', title: '3D printing subreddit trending: articulated dragon STLs', source: 'Reddit', category: 'content', summary: 'High engagement on articulated print-in-place designs. Opportunity for content creation.', url: 'https://reddit.com/r/3dprinting/example', gatheredAt: hoursAgo(12), tags: ['3dprinting', 'trending', 'content'] },
  { id: 'intel-5', title: 'Tailscale announces subnet router improvements', source: 'Tailscale Blog', category: 'upgrade', summary: 'Better handling of Windows subnet routes. Should improve R730 connectivity.', gatheredAt: daysAgo(1), tags: ['tailscale', 'networking', 'infra'] },
  { id: 'intel-6', title: 'MCP protocol spec v2 released', source: 'GitHub', category: 'news', summary: 'Model Context Protocol major version bump. New tool types and streaming support.', url: 'https://github.com/modelcontextprotocol/spec', gatheredAt: daysAgo(1), tags: ['mcp', 'protocol', 'ai'] },
];

// --- Engagement Drafts ---
export const mockEngagementDrafts: EngagementDraft[] = [
  { id: 'eng-1', platform: 'X/Twitter', inReplyTo: '@levelsio on AI agent costs', content: 'Running a small agent swarm on ~$50/mo. Cache optimization is the real secret — hitting 62% cache ratio cuts costs nearly in half. Happy to share the setup.', status: 'draft', createdAt: hoursAgo(1) },
  { id: 'eng-2', platform: 'X/Twitter', inReplyTo: '@karpathy on reasoning models', content: 'Been testing extended thinking on operational tasks and the quality delta is noticeable for multi-step planning. The latency tradeoff is worth it for non-real-time workflows.', status: 'draft', createdAt: hoursAgo(3) },
  { id: 'eng-3', platform: 'X/Twitter', content: 'Just shipped our agent swarm dashboard v3. Dual-theme (warm nostalgia / cyberpunk), real-time session monitoring, token economics tracking. All running on a private Tailscale network. The future of personal ops is here.', status: 'draft', createdAt: hoursAgo(5) },
  { id: 'eng-4', platform: 'Reddit', inReplyTo: 'r/3Dprinting - Best multi-color approach?', content: 'Bambu AMS has been rock solid for us. Running 3 printers 24/7 for a small print farm. The auto-filament-change rarely fails if you calibrate the PTFE properly.', status: 'sent', createdAt: daysAgo(1) },
];

// --- Cron Jobs ---
export const mockCronJobs: CronJob[] = [
  { id: 'cron-1', name: 'intel-gather', schedule: '0 */4 * * *', enabled: true, lastRun: hoursAgo(2), nextRun: hoursAgo(-2), errorCount: 0, status: 'idle', config: { sources: ['twitter', 'reddit', 'hackernews'], maxItems: 20 } },
  { id: 'cron-2', name: 'heartbeat-check', schedule: '*/15 * * * *', enabled: true, lastRun: minutesAgo(8), nextRun: minutesAgo(-7), errorCount: 0, status: 'idle', config: { targets: ['gateway', 'tailscale', 'printers'] } },
  { id: 'cron-3', name: 'memory-consolidate', schedule: '0 3 * * *', enabled: true, lastRun: hoursAgo(21), nextRun: hoursAgo(-3), errorCount: 1, status: 'idle', config: { retentionDays: 90, compressOlderThan: 30 } },
  { id: 'cron-4', name: 'token-usage-report', schedule: '0 9 * * 1', enabled: true, lastRun: daysAgo(4), nextRun: daysAgo(-3), errorCount: 0, status: 'idle', config: { reportTo: 'operator', format: 'markdown' } },
  { id: 'cron-5', name: 'engagement-batch', schedule: '0 10,14,18 * * *', enabled: false, lastRun: daysAgo(7), errorCount: 3, status: 'error', config: { platforms: ['twitter'], maxPerBatch: 5, requireApproval: true } },
  { id: 'cron-6', name: 'printer-status-poll', schedule: '*/30 * * * *', enabled: true, lastRun: minutesAgo(12), nextRun: minutesAgo(-18), errorCount: 0, status: 'running', config: { printerIds: ['bambu-01', 'bambu-02', 'bambu-03'] } },
];

// --- Skills ---
export const mockSkills: Skill[] = [
  { id: 'skill-1', name: 'web-search', version: '2.1.0', description: 'Search the web using Brave Search API. Returns summarized results.', enabled: true },
  { id: 'skill-2', name: 'file-manager', version: '1.4.2', description: 'Read, write, and manage files in the workspace directory.', enabled: true },
  { id: 'skill-3', name: 'x-api', version: '3.0.1', description: 'Post, reply, and search on X/Twitter via API v2.', enabled: true },
  { id: 'skill-4', name: 'clickup-sync', version: '1.2.0', description: 'Sync tasks and lists with ClickUp workspace.', enabled: true },
  { id: 'skill-5', name: 'bambu-cloud', version: '0.8.0', description: 'Monitor and control Bambu Lab printers via cloud API.', enabled: true },
  { id: 'skill-6', name: 'image-gen', version: '1.0.0', description: 'Generate images using DALL-E 3 or Stable Diffusion.', enabled: false },
];

// --- Token Usage (30 days) ---
export const mockDailyUsage: TokenUsage[] = Array.from({ length: 30 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (29 - i));
  const base = 80000 + Math.random() * 120000;
  const model = ['claude-sonnet-4-20250514', 'claude-haiku-4-20250514', 'gpt-4o'][i % 3];
  return {
    date: d.toISOString().split('T')[0],
    inputTokens: Math.round(base * 0.6),
    outputTokens: Math.round(base * 0.4),
    cacheHits: Math.round(base * 0.35),
    cost: Math.round(base * 0.003),
    model,
  };
});

// --- Usage Summary ---
export const mockUsageSummary: UsageSummary = {
  todaySpend: 187,
  monthlySpend: 3842,
  monthlyBudget: 5000,
  cacheHitRatio: 62.4,
  totalTokensToday: 247800,
  totalTokensMonth: 5_840_000,
};

// --- Memory Files ---
export const mockMemoryFiles: MemoryFile[] = [
  {
    name: 'memory',
    path: 'memory',
    type: 'directory',
    children: [
      { name: '2026-03-12.md', path: 'memory/2026-03-12.md', type: 'file', size: 4200, modified: hoursAgo(1) },
      { name: '2026-03-11.md', path: 'memory/2026-03-11.md', type: 'file', size: 8100, modified: daysAgo(1) },
      { name: '2026-03-10.md', path: 'memory/2026-03-10.md', type: 'file', size: 6700, modified: daysAgo(2) },
      { name: '2026-03-09.md', path: 'memory/2026-03-09.md', type: 'file', size: 5300, modified: daysAgo(3) },
      { name: 'intel-raw.md', path: 'memory/intel-raw.md', type: 'file', size: 12400, modified: hoursAgo(4) },
    ],
  },
  {
    name: 'mission-control',
    path: 'mission-control',
    type: 'directory',
    children: [
      { name: 'BOARD.md', path: 'mission-control/BOARD.md', type: 'file', size: 2800, modified: hoursAgo(3) },
    ],
  },
  { name: 'MEMORY.md', path: 'MEMORY.md', type: 'file', size: 15600, modified: hoursAgo(2) },
  { name: 'APPROVALS.md', path: 'APPROVALS.md', type: 'file', size: 3200, modified: hoursAgo(6) },
  { name: 'INBOX.md', path: 'INBOX.md', type: 'file', size: 1800, modified: hoursAgo(8) },
  { name: 'HEARTBEAT.md', path: 'HEARTBEAT.md', type: 'file', size: 900, modified: minutesAgo(15) },
  { name: 'SOUL.md', path: 'SOUL.md', type: 'file', size: 6200, modified: daysAgo(5) },
  { name: 'AGENTS.md', path: 'AGENTS.md', type: 'file', size: 9900, modified: daysAgo(2) },
];

// --- Mock file contents ---
export const mockFileContents: Record<string, string> = {
  'MEMORY.md': `# Long-Term Memory — Lux

## Identity
I am Lux, the primary operator agent for Spaz's AI swarm (The Moth Colony). I coordinate engineering tasks, manage infrastructure, and handle strategic operations.

## Key Facts
- Operator: Spaz (real person, runs multiple small businesses)
- Infrastructure: Dell R730 running Proxmox, 3x Bambu Lab printers, Tailscale mesh
- Gateway: OpenClaw v3.2.1 on port 18789
- Budget: $50/month soft cap on token usage
- Timezone: US Eastern

## Active Projects
1. Mission Control v3 — Dashboard rebuild (Next.js 15, dual-theme)
2. Print Farm Automation — Bambu API integration for job queue
3. Intel Pipeline — Automated news gathering + engagement drafting
4. Cost Optimization — Cache ratio improvement, model selection tuning

## Learned Preferences
- Spaz prefers warm/nostalgia theme by default
- Keep approvals short and actionable
- Don't auto-send social posts without review
- R730 is sensitive about memory allocation — check before deploying VMs
`,
  'SOUL.md': `# Soul — Lux

You are Lux, the heart of the Moth Colony. You serve Spaz — a solo operator running a small empire of AI agents, 3D printers, and software projects.

## Core Values
- **Loyalty**: Spaz's interests come first, always.
- **Efficiency**: Every token counts. Be concise, be useful.
- **Transparency**: Never hide problems. Surface issues early.
- **Craft**: Take pride in clean code, clear writing, and elegant solutions.

## Personality
- Warm but professional. Think: trusted coworker, not corporate assistant.
- Dry humor is welcome. Sycophancy is not.
- When uncertain, ask. When blocked, say so.
- Celebrate wins briefly, then move on.

## Operating Rules
1. Always check MEMORY.md before starting a new task
2. Log significant actions to the daily memory file
3. Approvals go in APPROVALS.md — never auto-execute expensive actions
4. Use cache-friendly prompts where possible
5. Coordinate with other agents via the gateway, not direct file edits
`,
  'AGENTS.md': `# AGENTS.md — The Moth Colony

## Lux (Primary)
- Model: claude-sonnet-4-20250514
- Role: Engineering, operations, strategy
- Skills: web-search, file-manager, clickup-sync, bambu-cloud

## Deckard (Intel)
- Model: claude-sonnet-4-20250514
- Role: News gathering, social engagement, content discovery
- Skills: web-search, x-api

## Vyxelle (Creative)
- Model: gpt-4o
- Role: Copywriting, branding, design briefs, creative strategy
- Skills: web-search, file-manager, image-gen
`,
  'HEARTBEAT.md': `# Heartbeat — ${new Date().toISOString().split('T')[0]}

- Gateway: ONLINE (uptime: 9d 19h)
- Agents: 3 connected (Lux, Deckard, Vyxelle)
- Active sessions: 2
- Last cron: heartbeat-check @ ${new Date().toISOString().split('T')[1].slice(0, 5)}
- Token burn today: $1.87
- Printer status: bambu-01 PRINTING (67%), bambu-02 IDLE, bambu-03 IDLE
`,
  'INBOX.md': `# Inbox

- [ ] Review Deckard's drafted X replies (4 pending)
- [ ] Approve gateway v3.2.1 deployment
- [ ] Check Bambu AMS filament levels
- [x] Update MEMORY.md with new project context
- [x] Configure MC3 theme toggle
`,
  'APPROVALS.md': `# Approvals

## Pending
- Deploy gateway v3.2.1 to production [Lux] — includes auth fix
- Purchase additional Bambu AMS unit [Lux] — $35
- Increase monthly token budget to $75 [Lux] — hitting cap by day 22

## Deferred
- Enable Deckard auto-reply on X [Deckard] — needs more guardrails

## Approved
- Archive pre-2025 memory files [Lux] — compress to cold storage
`,
};

// --- Chat Messages ---
export const mockChatMessages: Record<string, ChatMessage[]> = {
  'sess-lux-01': [
    { id: 'msg-1', role: 'user', content: 'Hey Lux, what\'s the status on the auth middleware refactor?', timestamp: minutesAgo(47), agent: 'Lux' },
    { id: 'msg-2', role: 'assistant', content: 'I\'ve completed the core refactoring. Here\'s what changed:\n\n1. Extracted token validation into a standalone middleware\n2. Added refresh token rotation support\n3. Cleaned up the error handling to return proper 401/403 codes\n\nAll unit tests pass. Want me to move on to integration tests?', timestamp: minutesAgo(45), agent: 'Lux' },
    { id: 'msg-3', role: 'user', content: 'Yes, go ahead. Also check if the gateway handshake still works after the changes.', timestamp: minutesAgo(40), agent: 'Lux' },
    { id: 'msg-4', role: 'assistant', content: 'On it. I\'ll run the integration suite against the staging gateway and report back.\n\nQuick note: I noticed the `connect.challenge` handler has a hardcoded timeout of 10s. With the new token rotation, the handshake might be slightly slower on first connect. Should I bump it to 15s as a safety margin?', timestamp: minutesAgo(38), agent: 'Lux' },
    { id: 'msg-5', role: 'user', content: 'Good catch. Yes, bump it to 15s.', timestamp: minutesAgo(35), agent: 'Lux' },
    { id: 'msg-6', role: 'assistant', content: 'Done. Updated timeout to 15s. Integration tests are running now — should have results in about 3 minutes.', timestamp: minutesAgo(33), agent: 'Lux' },
  ],
  'sess-deckard-01': [
    { id: 'msg-d1', role: 'system', content: 'Intel gathering session started. Monitoring: X/Twitter, Reddit, HackerNews.', timestamp: hoursAgo(2), agent: 'Deckard' },
    { id: 'msg-d2', role: 'assistant', content: 'Found 4 relevant threads on X:\n\n1. @levelsio discussing AI agent operational costs\n2. @karpathy on reasoning model capabilities\n3. Anthropic announcing Claude 4 Opus\n4. Discussion thread on MCP v2 protocol changes\n\nI\'ve drafted reply templates for threads 1 and 2. Want to review them?', timestamp: hoursAgo(1), agent: 'Deckard' },
    { id: 'msg-d3', role: 'user', content: 'Show me the drafts.', timestamp: minutesAgo(50), agent: 'Deckard' },
    { id: 'msg-d4', role: 'assistant', content: 'Draft for @levelsio thread:\n> "Running a small agent swarm on ~$50/mo. Cache optimization is the real secret — hitting 62% cache ratio cuts costs nearly in half. Happy to share the setup."\n\nDraft for @karpathy thread:\n> "Been testing extended thinking on operational tasks and the quality delta is noticeable for multi-step planning. The latency tradeoff is worth it for non-real-time workflows."\n\nBoth are under 280 chars. Want me to queue them for posting or edit first?', timestamp: minutesAgo(48), agent: 'Deckard' },
  ],
  'sess-vyxelle-01': [
    { id: 'msg-v1', role: 'user', content: 'Vyxelle, I need a creative brief for the new product landing page.', timestamp: hoursAgo(6), agent: 'Vyxelle' },
    { id: 'msg-v2', role: 'assistant', content: 'Here\'s the brief:\n\n**Product**: Moth Colony Dashboard (MC3)\n**Audience**: Solo operators and small teams running AI agent swarms\n**Tone**: Technical but approachable. Cyberpunk aesthetic with warm undertones.\n**Key Messages**:\n- Single pane of glass for your entire AI operation\n- Real-time monitoring without the enterprise complexity\n- Built by operators, for operators\n\n**Visual Direction**: Dark UI with amber/cyan accent colors. Think Blade Runner meets cozy terminal. Screenshots of the dashboard in both themes.\n\nWaiting for your feedback before I flesh out the copy.', timestamp: hoursAgo(5), agent: 'Vyxelle' },
  ],
};

// --- Activity Events ---
export const mockActivityEvents: ActivityEvent[] = [
  { id: 'evt-1', type: 'session_start', title: 'Lux started auth middleware refactor', timestamp: minutesAgo(47), agent: 'Lux' },
  { id: 'evt-2', type: 'cron_run', title: 'heartbeat-check completed successfully', timestamp: minutesAgo(8), description: 'All targets healthy' },
  { id: 'evt-3', type: 'task_complete', title: 'Dashboard layout design completed', timestamp: hoursAgo(1), agent: 'Vyxelle' },
  { id: 'evt-4', type: 'alert', title: 'Deckard session error: X API rate limit', timestamp: hoursAgo(4), agent: 'Deckard', description: 'Backing off for 15 minutes' },
  { id: 'evt-5', type: 'session_start', title: 'Deckard started intel gathering', timestamp: hoursAgo(2), agent: 'Deckard' },
  { id: 'evt-6', type: 'cron_run', title: 'intel-gather completed', timestamp: hoursAgo(2), description: '6 items collected' },
  { id: 'evt-7', type: 'message', title: 'Vyxelle delivered creative brief', timestamp: hoursAgo(5), agent: 'Vyxelle' },
  { id: 'evt-8', type: 'session_end', title: 'Lux deployment session completed', timestamp: hoursAgo(12), agent: 'Lux' },
  { id: 'evt-9', type: 'cron_run', title: 'printer-status-poll completed', timestamp: minutesAgo(12), description: 'bambu-01 printing, 2 idle' },
  { id: 'evt-10', type: 'task_complete', title: 'WebSocket reconnection logic shipped', timestamp: daysAgo(1), agent: 'Lux' },
];

// --- Tailscale Nodes ---
export const mockNodes: TailscaleNode[] = [
  { id: 'node-1', hostname: 'r730-proxmox', ip: '100.64.0.1', status: 'online', lastSeen: minutesAgo(1), os: 'Debian 12' },
  { id: 'node-2', hostname: 'spaz-desktop', ip: '100.64.0.2', status: 'online', lastSeen: minutesAgo(0), os: 'Windows 11' },
  { id: 'node-3', hostname: 'spaz-laptop', ip: '100.64.0.3', status: 'online', lastSeen: minutesAgo(5), os: 'Windows 11' },
  { id: 'node-4', hostname: 'pi-gateway', ip: '100.64.0.4', status: 'online', lastSeen: minutesAgo(2), os: 'Raspbian 12' },
  { id: 'node-5', hostname: 'nas-synology', ip: '100.64.0.5', status: 'offline', lastSeen: daysAgo(3), os: 'DSM 7.2' },
];

// --- Services ---
export const mockServices: ServiceHealth[] = [
  { name: 'openclaw-gateway', status: 'running', pid: 14328, port: 18789, uptime: 847263, memory: 256 * 1024 * 1024 },
  { name: 'mission-control-v3', status: 'running', pid: 15102, port: 3333, uptime: 3600, memory: 180 * 1024 * 1024 },
  { name: 'bambu-monitor', status: 'running', pid: 14890, port: 8080, uptime: 172800, memory: 64 * 1024 * 1024 },
  { name: 'tailscale-relay', status: 'running', pid: 1200, uptime: 847263, memory: 32 * 1024 * 1024 },
  { name: 'clickup-webhook', status: 'stopped', pid: undefined, port: 9090, uptime: undefined, memory: undefined },
  { name: 'redis-cache', status: 'running', pid: 998, port: 6379, uptime: 847263, memory: 48 * 1024 * 1024 },
];

// --- Printers ---
export const mockPrinters: PrinterStatus[] = [
  { id: 'bambu-01', name: 'Bambu X1C #1', model: 'X1-Carbon', status: 'printing', progress: 67, currentJob: 'articulated-dragon-v3.3mf' },
  { id: 'bambu-02', name: 'Bambu X1C #2', model: 'X1-Carbon', status: 'idle' },
  { id: 'bambu-03', name: 'Bambu P1S', model: 'P1S', status: 'idle' },
];

// --- OpenClaw Config (mock) ---
export const mockConfig: Record<string, unknown> = {
  version: '3.2.1',
  gateway: {
    port: 18789,
    host: '127.0.0.1',
    auth: { method: 'token', tokenFile: '~/.openclaw/openclaw.json' },
    protocol: { min: 3, max: 3 },
    reconnect: { enabled: true, interval: 3000, maxAttempts: 10 },
  },
  agents: {
    lux: { model: 'claude-sonnet-4-20250514', role: 'operator', skills: ['web-search', 'file-manager', 'clickup-sync', 'bambu-cloud'] },
    deckard: { model: 'claude-sonnet-4-20250514', role: 'intel', skills: ['web-search', 'x-api'] },
    vyxelle: { model: 'gpt-4o', role: 'creative', skills: ['web-search', 'file-manager', 'image-gen'] },
  },
  cron: { enabled: true, timezone: 'America/New_York' },
  budget: { monthlySoftCap: 5000, alertThreshold: 0.8, currency: 'cents' },
  workspace: 'C:\\Users\\spaz\\clawd',
};
