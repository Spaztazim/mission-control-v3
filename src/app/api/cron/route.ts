import { NextRequest, NextResponse } from 'next/server';
import gateway from '@/lib/gateway';

export async function GET() {
  try {
    const jobs = await gateway.rpc('cron.list');
    const skills = await gateway.rpc('skills.list').catch(() => []);
    return NextResponse.json({ ok: true, data: { jobs, skills } });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ ok: false, error: msg }, { status: 502 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updates } = body as Record<string, unknown>;
    const data = await gateway.rpc('cron.update', { id, ...updates });
    return NextResponse.json({ ok: true, data });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ ok: false, error: msg }, { status: 502 });
  }
}
