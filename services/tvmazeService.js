/* © Reussitess®971 INPI DSO2026012614 PORINUS Rony 2026 */
const TVMAZE_API_BASE =
  process.env.TVMAZE_API_BASE ?? "https://api.tvmaze.com";

async function searchShow(query) {
  const res = await fetch(
    `${TVMAZE_API_BASE}/search/shows?q=${encodeURIComponent(query)}`
  );
  if (!res.ok) throw new Error("TV show not found");
  const data = await res.json();
  return data;
}

module.exports = { searchShow };
