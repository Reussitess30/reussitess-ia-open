/* © Reussitess®971 INPI DSO2026012614 PORINUS Rony 2026 */
const DICTIONARY_API_BASE =
  process.env.DICTIONARY_API_BASE ?? "https://api.dictionaryapi.dev";

async function getDefinition(word) {
  const url = `${DICTIONARY_API_BASE}/api/v2/entries/en/${encodeURIComponent(
    word
  )}`;
  const res = await fetch(url);
  if (!res.ok) {
    const error = await res.text();
    throw new Error(`[${res.status}] ${error}`);
  }
  const data = await res.json();
  return data;
}

async function getFirstDefinition(word) {
  const entries = await getDefinition(word);
  const entry = entries[0];
  const meaning = entry.meanings[0];
  return {
    word: entry.word,
    partOfSpeech: meaning.partOfSpeech,
    definition: meaning.definitions[0].definition,
    example: meaning.definitions[0].example,
  };
}

module.exports = { getDefinition, getFirstDefinition };
