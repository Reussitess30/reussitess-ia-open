export default async function handler(req, res) {
  try {
    const event = req.body;

    console.log("PAYPAL EVENT RECEIVED:", event?.event_type);

    // 💎 SAAS LOGIC SIMPLE & STABLE
    switch (event?.event_type) {

      case "BILLING.SUBSCRIPTION.ACTIVATED":
        console.log("🔥 PREMIUM ACTIVATED");
        // TODO: set user premium = true
        break;

      case "BILLING.SUBSCRIPTION.CANCELLED":
        console.log("⚠ PREMIUM CANCELLED");
        // TODO: set user premium = false
        break;

      case "PAYMENT.SALE.COMPLETED":
        console.log("💰 PAYMENT COMPLETED");
        break;

      default:
        console.log("ℹ EVENT IGNORED");
    }

    return res.status(200).json({ ok: true });

  } catch (err) {
    console.error("WEBHOOK ERROR:", err);
    return res.status(200).json({ ok: true });
  }
}
