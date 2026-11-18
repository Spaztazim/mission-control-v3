import { NextRequest, NextResponse } from 'next/server';
import gateway from '@/lib/gateway';

export async function GET() {
  try {
    const data = await gateway.rpc('sessions.list');
    return NextResponse.json({ ok: true, data });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ ok: false, error: msg }, { status: 502 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, sessionId, message, ...params } = body as Record<string, unknown>;

    if (action === 'send' && typeof sessionId === 'string') {
      const data = await gateway.rpc('sessions.send', { sessionId, message });
      return NextResponse.json({ ok: true, data });
    }

    if (action === 'kill' && typeof sessionId === 'string') {
      const data = await gateway.rpc('sessions.kill', { sessionId });
      return NextResponse.json({ ok: true, data });
    }

    if (action === 'spawn') {
      const data = await gateway.rpc('sessions.spawn', params);
      return NextResponse.json({ ok: true, data });
    }

    return NextResponse.json({ ok: false, error: 'Invalid action' }, { status: 400 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ ok: false, error: msg }, { status: 502 });
  }
}
