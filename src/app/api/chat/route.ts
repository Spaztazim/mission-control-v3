import { NextRequest, NextResponse } from 'next/server';
import gateway from '@/lib/gateway';

export async function GET(req: NextRequest) {
  try {
    const sessionId = req.nextUrl.searchParams.get('session');
    if (!sessionId) {
      const sessions = await gateway.rpc('sessions.list');
      return NextResponse.json({ ok: true, data: { sessions } });
    }
    const messages = await gateway.rpc('sessions.messages', { sessionId });
    return NextResponse.json({ ok: true, data: { messages } });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ ok: false, error: msg }, { status: 502 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId, message } = body as { sessionId: string; message: string };
    const data = await gateway.rpc('sessions.send', { sessionId, message });
    return NextResponse.json({ ok: true, data });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ ok: false, error: msg }, { status: 502 });
  }
}
