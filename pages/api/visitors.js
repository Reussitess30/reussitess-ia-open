import Redis from "ioredis";

const r = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

export default async function handler(req, res) {
  try {
    const count = await r.incr("reussitess_visitors");
    res.setHeader("Content-Type", "application/json");
    res.status(200).json({ success: true, count: Number(count) });
  } catch (error) {
    res.setHeader("Content-Type", "application/json");
    res.status(200).json({ success: false, count: 0 });
  }
}
