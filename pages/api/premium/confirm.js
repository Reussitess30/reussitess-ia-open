export default async (req, res) => {
  const { orderID, userId } = req.body;
  // Stocke premium userId
  res.json({ success: true, message: 'Premium activé ! 👑' });
};
