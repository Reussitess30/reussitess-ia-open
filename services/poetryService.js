/* © Reussitess®971 INPI DSO2026012614 PORINUS Rony 2026 */
const POETRY_API_BASE =
  process.env.POETRY_API_BASE ?? "https://poetrydb.org";

async function getPoemsByAuthor(author) {
  const res = await fetch(
    `${POETRY_API_BASE}/author/${encodeURIComponent(author)}`
  );
  if (!res.ok) throw new Error("Author not found");
  const data = await res.json();
  return data;
}

module.exports = { getPoemsByAuthor };
