/* © Reussitess®971 INPI DSO2026012614 PORINUS Rony 2026 */
export async function getWikipedia(term) {
  try {
    const res = await fetch(`https://fr.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(term)}`)
    if (!res.ok) return null
    const data = await res.json()
    return data.extract || null
  } catch (e) {
    return null
  }
}
