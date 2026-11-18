import { NextResponse } from 'next/server';
import gateway from '@/lib/gateway';

export async function GET() {
  try {
    const data = await gateway.rpc('status');
    return NextResponse.json({ ok: true, data });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ ok: false, error: msg }, { status: 502 });
  }
}
