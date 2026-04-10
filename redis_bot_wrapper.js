/* © Reussitess®971 INPI DSO2026012614 PORINUS Rony 2026 */
const { createClient } = require("redis");

const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://127.0.0.1:6379"
});

redisClient.on("error", (err) => console.error("Redis Client Error", err));

redisClient.connect().then(async () => {
  console.log("✅ Redis connected!");
  
  // Maintenant on charge ton bot
  try {
    require("./reussitess_start.js");
  } catch (error) {
    console.error("Bot error:", error.message);
    // On continue malgré l'erreur du bot pour voir Redis fonctionner
  }
}).catch(err => console.error("Redis connection failed:", err));
