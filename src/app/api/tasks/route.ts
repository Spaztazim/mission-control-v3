import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const WORKSPACE = process.env.WORKSPACE_PATH || 'C:\\Users\\spaz\\clawd';
const BOARD_PATH = join(WORKSPACE, 'mission-control', 'BOARD.md');
const APPROVALS_PATH = join(WORKSPACE, 'APPROVALS.md');

function parseBoard(): { tasks: Record<string, unknown>[]; raw: string } {
  if (!existsSync(BOARD_PATH)) return { tasks: [], raw: '' };
  const raw = readFileSync(BOARD_PATH, 'utf-8');
  const tasks: Record<string, unknown>[] = [];
  const lines = raw.split('\n');
  let currentStatus = 'backlog';

  for (const line of lines) {
    if (line.startsWith('## ')) {
      const heading = line.slice(3).trim().toLowerCase();
      if (heading.includes('progress')) currentStatus = 'in_progress';
      else if (heading.includes('review') || heading.includes('qa')) currentStatus = 'qa_review';
      else if (heading.includes('done')) currentStatus = 'done';
      else currentStatus = 'backlog';
    } else if (line.startsWith('- ')) {
      tasks.push({
        id: `task-${tasks.length}`,
        title: line.slice(2).replace(/\[.*?\]/g, '').trim(),
        status: currentStatus,
        tags: (line.match(/\[(.*?)\]/g) || []).map(t => t.slice(1, -1)),
        priority: 'medium',
        createdAt: new Date().toISOString(),
      });
    }
  }
  return { tasks, raw };
}

function parseApprovals(): Record<string, unknown>[] {
  if (!existsSync(APPROVALS_PATH)) return [];
  const raw = readFileSync(APPROVALS_PATH, 'utf-8');
  const approvals: Record<string, unknown>[] = [];
  const lines = raw.split('\n');

  for (const line of lines) {
    if (line.startsWith('- ')) {
      approvals.push({
        id: `approval-${approvals.length}`,
        title: line.slice(2).replace(/\[.*?\]/g, '').trim(),
        description: '',
        requestedBy: 'system',
        requestedAt: new Date().toISOString(),
        status: 'pending',
        category: 'general',
      });
    }
  }
  return approvals;
}

export async function GET() {
  try {
    const { tasks } = parseBoard();
    const approvals = parseApprovals();
    return NextResponse.json({ ok: true, data: { tasks, approvals } });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description } = body as { title: string; description?: string };
    const line = description ? `- ${title} — ${description}` : `- ${title}`;

    let content = '';
    if (existsSync(BOARD_PATH)) {
      content = readFileSync(BOARD_PATH, 'utf-8');
    }
    content += `\n${line}`;
    writeFileSync(BOARD_PATH, content, 'utf-8');

    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
