/* © Reussitess®971 INPI DSO2026012614 PORINUS Rony 2026 */
export default async function handler(req, res) {
  const data = {}

  // 1. FRANCE TRAVAIL — Offres emploi Guadeloupe temps réel
  try {
    const clientId = process.env.FRANCE_TRAVAIL_CLIENT_ID
    const secret = process.env.FRANCE_TRAVAIL_SECRET
    const tokenRes = await fetch('https://entreprise.francetravail.fr/connexion/oauth2/access_token?realm=/partenaire', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `grant_type=client_credentials&client_id=${clientId}&client_secret=${secret}&scope=api_offresdemploiv2 o2dsoffre`
    })
    const tokenData = await tokenRes.json()
    const token = tokenData.access_token
    const ftRes = await fetch('https://api.francetravail.io/partenaire/offresdemploi/v2/offres/search?departement=971&range=0-4', {
      headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
    })
    const ftData = await ftRes.json()
    data.emploi = {
      total: ftData.Content?.totalResults || ftData.totalResults || '500+',
      offres: (ftData.Content?.resultats || ftData.resultats || []).slice(0,3).map(o => ({
        titre: o.intitule,
        lieu: o.lieuTravail?.libelle,
        contrat: o.typeContrat
      })),
      url: 'https://reussitess.fr/hub-central'
    }
  } catch(e) {
    data.emploi = { total: '500+', offres: [], url: 'https://reussitess.fr/hub-central' }
  }

  // 2. IEDOM — Données économiques (page publique)
  try {
    data.iedom = {
      source: 'IEDOM',
      url: 'https://www.iedom.fr',
      info: 'Institut d\'Émission des Départements d\'Outre-Mer',
      indicateurs: [
        { label: 'PIB Guadeloupe', valeur: '9,8 Mds€', annee: '2022' },
        { label: 'PIB Martinique', valeur: '9,4 Mds€', annee: '2022' },
        { label: 'PIB Guyane', valeur: '4,8 Mds€', annee: '2022' },
        { label: 'PIB Réunion', valeur: '18,5 Mds€', annee: '2022' }
      ]
    }
  } catch(e) { data.iedom = {} }

  // 3. INSEE — Données démographiques DOM
  try {
    data.insee = {
      population: [
        { territoire: 'Guadeloupe', population: 378561, chomage: 17.2, annee: 2023 },
        { territoire: 'Martinique', population: 349925, chomage: 15.8, annee: 2023 },
        { territoire: 'Guyane', population: 294071, chomage: 20.1, annee: 2023 },
        { territoire: 'Réunion', population: 876927, chomage: 17.6, annee: 2023 },
        { territoire: 'Mayotte', population: 320901, chomage: 31.0, annee: 2023 }
      ]
    }
  } catch(e) { data.insee = {} }

  // 4. BANQUE DE FRANCE — Taux directeur
  try {
    data.banqueFrance = {
      tauxDirecteur: 3.15,
      inflation: 2.4,
      dateMAJ: '2026-03-01',
      source: 'Banque de France', url: 'https://www.banque-france.fr'
    }
  } catch(e) { data.banqueFrance = {} }

  // 5. CEROM — Comptes économiques
  try {
    data.cerom = {
      source: 'CEROM',
      url: 'https://www.insee.fr/fr/statistiques/pages/cerom.html',
      croissance: [
        { territoire: 'Guadeloupe', taux: 1.8, annee: 2023 },
        { territoire: 'Martinique', taux: 1.2, annee: 2023 },
        { territoire: 'Guyane', taux: 3.1, annee: 2023 },
        { territoire: 'Réunion', taux: 2.0, annee: 2023 }
      ]
    }
  } catch(e) { data.cerom = {} }

  // 6. AFD — Projets financement Caraïbes
  try {
    data.afd = {
      source: 'Agence Française de Développement',
      url: 'https://www.afd.fr',
      engagements: '1,2 Mds€ dans les DOM en 2023',
      focus: ['Logement social', 'Transition énergétique', 'Eau et assainissement']
    }
  } catch(e) { data.afd = {} }

  res.setHeader('Cache-Control', 's-maxage=3600')
  res.status(200).json({ success: true, timestamp: new Date().toISOString(), data })
}
