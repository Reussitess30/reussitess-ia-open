/* © Reussitess®971 INPI DSO2026012614 PORINUS Rony 2026 */
const NUMBERS_API_BASE =
  process.env.NUMBERS_API_BASE ?? "https://numbersapi.com";

async function getNumberFact(number) {
  const res = await fetch(`${NUMBERS_API_BASE}/${number}`);
  if (!res.ok) throw new Error("Fact not found");
  const fact = await res.text();
  return fact;
}

module.exports = { getNumberFact };
