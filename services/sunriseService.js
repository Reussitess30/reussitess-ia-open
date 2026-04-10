/* © Reussitess®971 INPI DSO2026012614 PORINUS Rony 2026 */
const SUNRISE_API_BASE =
  process.env.SUNRISE_API_BASE ?? "https://api.sunrisesunset.io/v1";

async function getSunrise(lat, lng) {
  const res = await fetch(
    `${SUNRISE_API_BASE}/sunrise?lat=${lat}&lng=${lng}`
  );
  if (!res.ok) throw new Error("Sunrise data unavailable");
  const data = await res.json();
  return data;
}

module.exports = { getSunrise };
