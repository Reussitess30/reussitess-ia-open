const COUNTRY_API_BASE =
  process.env.COUNTRY_API_BASE ?? "https://restcountries.com/v3.1";

async function getCountryInfo(name) {
  const res = await fetch(
    `${COUNTRY_API_BASE}/name/${encodeURIComponent(name)}?fullText=true`
  );
  if (!res.ok) throw new Error("Country not found");
  const data = await res.json();
  return data;
}

module.exports = { getCountryInfo };
