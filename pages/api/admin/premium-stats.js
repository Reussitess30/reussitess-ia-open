export default async function handler(req, res) {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({ ok: false, error: "Method not allowed" });
    }

    const { Redis } = await import("@upstash/redis");
    const redis = Redis.fromEnv();

    const keys = await redis.keys("premium:*");

    return res.status(200).json({
      ok: true,
      totalKeys: keys.length,
      status: "LIVE",
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    return res.status(200).json({
      ok: false,
      totalKeys: 0,
      error: error.message
    });
  }
}
