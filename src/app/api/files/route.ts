import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, relative } from 'path';

const WORKSPACE = process.env.WORKSPACE_PATH || 'C:\\Users\\spaz\\clawd';

interface FileEntry {
  name: string;
  path: string;
  type: 'file' | 'directory';
  size?: number;
  modified?: string;
  children?: FileEntry[];
}

function listDir(dirPath: string, depth: number = 0): FileEntry[] {
  if (depth > 3 || !existsSync(dirPath)) return [];
  const entries = readdirSync(dirPath, { withFileTypes: true });
  return entries
    .filter(e => !e.name.startsWith('.'))
    .map(entry => {
      const fullPath = join(dirPath, entry.name);
      const relPath = relative(WORKSPACE, fullPath).replace(/\\/g, '/');
      const stat = statSync(fullPath);
      const item: FileEntry = {
        name: entry.name,
        path: relPath,
        type: entry.isDirectory() ? 'directory' : 'file',
        size: entry.isFile() ? stat.size : undefined,
        modified: stat.mtime.toISOString(),
      };
      if (entry.isDirectory() && depth < 2) {
        item.children = listDir(fullPath, depth + 1);
      }
      return item;
    });
}

export async function GET(req: NextRequest) {
  try {
    const filePath = req.nextUrl.searchParams.get('path') || '';
    const fullPath = join(WORKSPACE, filePath);

    if (!fullPath.startsWith(WORKSPACE)) {
      return NextResponse.json({ ok: false, error: 'Invalid path' }, { status: 400 });
    }

    if (!existsSync(fullPath)) {
      return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 });
    }

    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      const files = listDir(fullPath);
      return NextResponse.json({ ok: true, data: { type: 'directory', files } });
    }

    const content = readFileSync(fullPath, 'utf-8');
    return NextResponse.json({ ok: true, data: { type: 'file', content, path: filePath } });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const filePath = req.nextUrl.searchParams.get('path');
    if (!filePath) {
      return NextResponse.json({ ok: false, error: 'Path required' }, { status: 400 });
    }

    const fullPath = join(WORKSPACE, filePath);
    if (!fullPath.startsWith(WORKSPACE)) {
      return NextResponse.json({ ok: false, error: 'Invalid path' }, { status: 400 });
    }

    const body = await req.json();
    const { content } = body as { content: string };
    writeFileSync(fullPath, content, 'utf-8');
    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
