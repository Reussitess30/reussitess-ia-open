const NASA_API_KEY = process.env.NASA_API_KEY ?? "DEMO_KEY";

async function getNasaApod() {
  const res = await fetch(
    `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}`
  );
  if (!res.ok) throw new Error("NASA API failed");
  const data = await res.json();
  return data;
}

module.exports = { getNasaApod };
