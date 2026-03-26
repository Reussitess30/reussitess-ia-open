const FDA_API_BASE =
  process.env.FDA_API_BASE ?? "https://api.fda.gov";

async function searchDrug(query) {
  const res = await fetch(
    `${FDA_API_BASE}/drug/label.json?search=brand_name:"${query}"`
  );
  if (!res.ok) throw new Error("Drug data not found");
  const data = await res.json();
  return data;
}

module.exports = { searchDrug };
