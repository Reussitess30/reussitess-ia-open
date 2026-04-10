/* © Reussitess®971 INPI DSO2026012614 PORINUS Rony 2026 */
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  // Enregistrement VISA — stockage futur (DB/Supabase)
  const visa = req.body
  console.log('VISA enregistré:', visa?.numero)
  res.status(200).json({ success: true, numero: visa?.numero })
}
