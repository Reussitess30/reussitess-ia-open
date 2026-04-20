import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

export async function GET() {
  const checks: any = {};

  try {
    const r = await fetch("https://api.groq.com/openai/v1/models", {
      headers: { Authorization: "Bearer " + process.env.GROQ_API_KEY }
    });
    checks.groq = r.ok ? "✅ OK" : "❌ DOWN";
  } catch (e: any) {
    checks.groq = "❌ " + e?.message;
  }

  try {
    const redis = Redis.fromEnv();
    await redis.ping();
    checks.redis = "✅ OK";
  } catch (e: any) {
    checks.redis = "❌ " + e?.message;
  }

  const allOk = Object.values(checks).every((v: any) => String(v).startsWith("✅"));

  return NextResponse.json(
    {
      status: allOk ? "🟢 TOUS SYSTÈMES OPÉRATIONNELS" : "🔴 DÉGRADÉ",
      timestamp: new Date().toISOString(),
      checks,
    },
    { status: allOk ? 200 : 503 }
  );
}
