export default async function handler(req, res) {
  return res.status(200).json({
    ok: false,
    error: "superbot_chat_disabled_for_build",
  });
}
