/* © Reussitess®971 INPI DSO2026012614 PORINUS Rony 2026 */
const ART_API_BASE =
  process.env.ART_API_BASE ?? "https://api.artic.edu/api/v1";

async function getArtwork(id) {
  const res = await fetch(`${ART_API_BASE}/artworks/${id}`);
  if (!res.ok) throw new Error("Artwork not found");
  const data = await res.json();
  return data;
}

module.exports = { getArtwork };
