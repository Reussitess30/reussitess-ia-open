export function extractTelegramUser(body) {
  return (
    body?.message?.from?.id ||
    body?.callback_query?.from?.id ||
    body?.from?.id ||
    null
  )
}
