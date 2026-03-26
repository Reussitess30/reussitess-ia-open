const WEATHER_API_BASE =
  process.env.WEATHER_API_BASE ?? "https://wttr.in";

async function getWeather(location) {
  const res = await fetch(
    `${WEATHER_API_BASE}/${encodeURIComponent(location)}?format=3`
  );
  if (!res.ok) throw new Error("Weather unavailable");
  const text = await res.text();
  return text;
}

module.exports = { getWeather };
