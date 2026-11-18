export interface GatewayStatus {
  online: boolean;
  uptime: number;
  connectedAgents: number;
  version: string;
}

export interface AgentSession {
  id: string;
  agent: string;
  model: string;
  status: 'active' | 'idle' | 'completed' | 'error';
  startedAt: string;
  messageCount: number;
  tokenUsage: number;
  lastMessage?: string;
}

export interface Agent {
  id: string;
  name: string;
  model: string;
  status: 'online' | 'offline' | 'busy';
  lastSeen: string;
  description?: string;
}

export interface CronJob {
  id: string;
  name: string;
  schedule: string;
  enabled: boolean;
  lastRun?: string;
  nextRun?: string;
  errorCount: number;
  status: 'idle' | 'running' | 'error';
  config?: Record<string, unknown>;
}

export interface Skill {
  id: string;
  name: string;
  version: string;
  description: string;
  enabled: boolean;
}

export interface TokenUsage {
  date: string;
  inputTokens: number;
  outputTokens: number;
  cacheHits: number;
  cost: number;
  model: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'backlog' | 'in_progress' | 'qa_review' | 'done';
  assignee?: string;
  tags: string[];
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: string;
  createdAt: string;
}

export interface Approval {
  id: string;
  title: string;
  description: string;
  requestedBy: string;
  requestedAt: string;
  status: 'pending' | 'approved' | 'rejected' | 'deferred';
  category: string;
}

export interface IntelItem {
  id: string;
  title: string;
  source: string;
  category: 'news' | 'upgrade' | 'content' | 'business';
  summary: string;
  url?: string;
  gatheredAt: string;
  tags: string[];
}

export interface EngagementDraft {
  id: string;
  platform: string;
  inReplyTo?: string;
  content: string;
  status: 'draft' | 'sent' | 'skipped';
  createdAt: string;
}

export interface MemoryFile {
  name: string;
  path: string;
  type: 'file' | 'directory';
  size?: number;
  modified?: string;
  children?: MemoryFile[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  agent?: string;
}

export interface ActivityEvent {
  id: string;
  type: 'task_complete' | 'cron_run' | 'alert' | 'session_start' | 'session_end' | 'message';
  title: string;
  description?: string;
  timestamp: string;
  agent?: string;
}

export interface TailscaleNode {
  id: string;
  hostname: string;
  ip: string;
  status: 'online' | 'offline';
  lastSeen: string;
  os: string;
}

export interface ServiceHealth {
  name: string;
  status: 'running' | 'stopped' | 'error';
  pid?: number;
  port?: number;
  uptime?: number;
  memory?: number;
}

export interface PrinterStatus {
  id: string;
  name: string;
  model: string;
  status: 'idle' | 'printing' | 'error' | 'offline';
  progress?: number;
  currentJob?: string;
}

export interface UsageSummary {
  todaySpend: number;
  monthlySpend: number;
  monthlyBudget: number;
  cacheHitRatio: number;
  totalTokensToday: number;
  totalTokensMonth: number;
}
