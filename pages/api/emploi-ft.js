/* © Reussitess®971 INPI DSO2026012614 PORINUS Rony 2026 */

async function getFranceTravailToken() {
  const clientId = process.env.FRANCE_TRAVAIL_CLIENT_ID
  const secret = process.env.FRANCE_TRAVAIL_SECRET
  const res = await fetch('https://entreprise.francetravail.fr/connexion/oauth2/access_token?realm=%2Fpartenaire', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=client_credentials&client_id=${clientId}&client_secret=${secret}&scope=api_offresdemploiv2`
  })
  const d = await res.json()
  return d.access_token
}

export default async function handler(req, res) {
  const { keywords = '', departement = '971', range = '0-9' } = req.query
  try {
    const token = await getFranceTravailToken()
    if (!token) return res.status(500).json({ error: 'Token France Travail indisponible' })

    const params = new URLSearchParams({ motsCles: keywords, departement, range, sort: '1' })

    const r = await fetch(`https://api.francetravail.io/partenaire/offresdemploi/v2/offres/search?${params}`, {
      headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
    })
    const data = await r.json()

    if (!data.resultats?.length) {
      return res.status(200).json({
        offres: [],
        message: `Aucune offre trouvée pour "${keywords}" en ${departement}`,
        liens: {
          francetravail: `https://candidat.francetravail.fr/offres/recherche?motsCles=${encodeURIComponent(keywords)}&departement=${departement}`,
          indeed: `https://fr.indeed.com/offres-emploi?q=${encodeURIComponent(keywords)}&l=Guadeloupe`,
          caribbeanjobs: 'https://www.caribbeanjobs.com'
        }
      })
    }

    const offres = data.resultats.slice(0, 5).map(o => ({
      titre: o.intitule,
      entreprise: o.entreprise?.nom || 'Non précisé',
      lieu: o.lieuTravail?.libelle || departement,
      contrat: o.typeContrat,
      salaire: o.salaire?.libelle || 'Non précisé',
      lien: `https://candidat.francetravail.fr/offres/recherche/detail/${o.id}`,
      date: o.dateCreation?.substring(0, 10)
    }))

    return res.status(200).json({ total: data.totalElements || offres.length, offres, departement, keywords })
  } catch(e) {
    return res.status(500).json({ error: e.message })
  }
}
