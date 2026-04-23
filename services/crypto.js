export async function getCryptoPaysDevise(crypto="bitcoin", devise="usd") {
  try {
    const id = crypto.toLowerCase()

    const r = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=${devise},eur,usd`
    )

    const d = await r.json()
    const p = d?.[id]

    if (!p) return "💰 Crypto introuvable 🇬🇵"

    return `💰 ${crypto.toUpperCase()}
USD: ${p.usd}
EUR: ${p.eur}
`
  } catch {
    return "💰 Crypto indisponible 🇬🇵"
  }
}
