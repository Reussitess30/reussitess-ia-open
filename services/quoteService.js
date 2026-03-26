const QUOTABLE_API_BASE =
  process.env.QUOTABLE_API_BASE ?? "https://api.quotable.io";

async function getRandomQuote() {
  const res = await fetch(`${QUOTABLE_API_BASE}/random`);
  if (!res.ok) throw new Error("Quote API failed");
  const data = await res.json();
  return data;
}

module.exports = { getRandomQuote };
