import { NextResponse } from "next/server"

export function GET() {
  return NextResponse.json({
    ok: true,
    groq: Boolean(
      process.env.GROQ_API_KEY ||
      process.env.GROQ_API_KEY_2 ||
      process.env.GROQ_API_KEY_3
    ),
    redis: Boolean(process.env.REDIS_URL),
  })
}
