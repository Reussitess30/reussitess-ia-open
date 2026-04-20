import { NextResponse } from "next/server";
import { createClient } from "redis";

export async function GET() {
  let client: any;
  try {
    client = createClient({ url: process.env.REDIS_URL });
    await client.connect();
    const count = await client.incr("reussitess_visitors");
    await client.disconnect();
    return NextResponse.json({ count: Number(count) });
  } catch (e: any) {
    try { if (client) await client.disconnect(); } catch {}
    return NextResponse.json({ count: 6940, ok: false, error: e?.message });
  }
}
