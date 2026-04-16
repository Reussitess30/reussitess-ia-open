export default async function handler(req, res) {
  const { userId, plan, amount, eSoleau } = req.body;
  
  if (userId === "rony.porinus@gmail.com") {
    // PREMIER TESTEUR 👑
    await redis.set(`premium:${userId}`, "true", "EX", 315360000); // 10 ans
    res.json({
      status: "✅ PREMIUM ACTIVÉ 👑",
      userId, plan, amount,
      expires: "2036-04-07",
      eSoleau,
      message: "1er testeur Reussitess Premium !"
    });
  } else {
    res.status(403).json({ error: "Premium requis" });
  }
}
