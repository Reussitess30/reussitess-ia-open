export function extractUserContext(req) {
  return {
    userId:
      req?.body?.message?.from?.id ||
      req?.body?.from?.id ||
      req?.body?.userId ||
      null,

    message: req?.body?.message || req?.body?.text || "",

    isTelegram: !!req?.body?.message?.from?.id
  }
}
