/* © Reussitess®971 INPI DSO2026012614 PORINUS Rony 2026 */
// ===== EXTENSIONS REUSSITESS AI =====
// 1. Multilingue | 2. Juridique | 3. Finance | 4. Données temps réel

// ===== 1. MULTILINGUE =====
export function detectLanguage(text) {
  const patterns = {
    en: /\b(hello|how|what|where|when|why|who|is|are|the|this|that)\b/i,
    es: /\b(hola|como|que|donde|cuando|por|para|es|los|las)\b/i,
    pt: /\b(ola|como|que|onde|quando|por|para|é|os|as)\b/i,
    ht: /\b(bonjou|koman|ki|kote|poukisa|mwen|ou|li|nou)\b/i,
    fr: /\b(bonjour|comment|quoi|où|quand|pourquoi|je|tu|il|nous)\b/i,
  }
  for (const [lang, pattern] of Object.entries(patterns)) {
    if (pattern.test(text)) return lang
  }
  return 'fr'
}

export function getSystemPromptForLanguage(lang) {
  const prompts = {
    en: "You are REUSSITESS AI, official SuperBot from Guadeloupe 🇬🇵. Reply in English. End with BOUDOUM!",
    es: "Eres REUSSITESS AI, SuperBot oficial de Guadalupe 🇬🇵. Responde en español. Termina con BOUDOUM!",
    pt: "Você é REUSSITESS AI, SuperBot oficial da Guadalupe 🇬🇵. Responda em português. Termine com BOUDOUM!",
    ht: "Ou se REUSSITESS AI, SuperBot ofisyèl Gwadloup 🇬🇵. Reponn an kreyòl ayisyen. Fini ak BOUDOUM!",
    fr: "Tu es REUSSITESS AI, SuperBot officiel de Guadeloupe 🇬🇵. Réponds en français. Finis par BOUDOUM!",
  }
  return prompts[lang] || prompts.fr
}

// ===== 2. JURIDIQUE DOM-TOM =====
export function getDroitDOMTOM(question) {
  const q = question.toLowerCase()
  
  if (q.includes('aide juridiction') || q.includes('avocat gratuit') || q.includes('aide légale')) {
    return `⚖️ **Aide Juridictionnelle DOM-TOM**

📋 **Qui peut en bénéficier ?**
• Revenus mensuels < 1 069€ (aide totale)
• Revenus mensuels < 1 603€ (aide partielle)

📍 **Comment faire ?**
• Formulaire Cerfa 15626*01
• Déposer au Tribunal Judiciaire de votre île
• Guadeloupe : TJ Pointe-à-Pitre — 0590 90 61 00
• Martinique : TJ Fort-de-France — 0596 70 61 00
• Réunion : TJ Saint-Denis — 0262 40 94 00

🔗 service-public.fr/particuliers/vosdroits/F18074
Boudoum ! 🇬🇵`
  }

  if (q.includes('logement') || q.includes('loyer') || q.includes('expulsion') || q.includes('hlm')) {
    return `🏠 **Droit au Logement DOM-TOM**

🛡️ **Vos droits :**
• DALO (Droit Au Logement Opposable)
• APL/ALS disponibles en DOM-TOM
• Protection contre expulsion (trêve hivernale)

📞 **Contacts :**
• ADIL Guadeloupe : 0590 82 90 00
• ADIL Martinique : 0596 63 36 36
• CAF Guadeloupe : 0590 21 98 00
• Préfecture : aide d'urgence logement

🔗 caf.fr | anil.org
Boudoum ! 🇬🇵`
  }

  if (q.includes('travail') || q.includes('licenciem') || q.includes('contrat') || q.includes('employeur') || q.includes('salaire')) {
    return `💼 **Droit du Travail DOM-TOM**

⚖️ **Vos droits :**
• SMIC DOM : identique métropole (1 767€ brut/mois 2024)
• Congés bonification DOM : +1 mois tous les 3 ans
• CGSS (pas URSSAF) pour cotisations sociales

📞 **Contacts :**
• Inspection du Travail Guadeloupe : 0590 41 00 10
• Inspection du Travail Martinique : 0596 66 11 60
• Prud'hommes Pointe-à-Pitre : 0590 90 61 61
• Défenseur des droits : 09 69 39 00 00

🔗 travail-emploi.gouv.fr
Boudoum ! 🇬🇵`
  }

  if (q.includes('divorce') || q.includes('garde') || q.includes('pension') || q.includes('famille')) {
    return `👨‍👩‍👧 **Droit de la Famille DOM-TOM**

⚖️ **Vos droits :**
• Médiation familiale gratuite (CAF)
• Pension alimentaire : calcul selon revenus
• Garde alternée possible
• Point Justice dans chaque DOM

📞 **Contacts :**
• CAF Guadeloupe : 0590 21 98 00
• Tribunal Judiciaire (affaires familiales)
• Médiation familiale : via CAF gratuit

🔗 justice.fr | caf.fr
Boudoum ! 🇬🇵`
  }

  return null
}

// ===== 3. FINANCE AVANCÉE =====
export async function getFinanceAvancee(question) {
  const q = question.toLowerCase()

  if (q.includes('bourse') || q.includes('action') || q.includes('investir') || q.includes('trading')) {
    return `📈 **Finance & Bourse — Guide DOM-TOM**

💡 **Pour commencer :**
• PEA (Plan Épargne Actions) — disponible DOM-TOM
• Livret A : 3% garanti (plafond 22 950€)
• LDDS : 3% garanti (plafond 12 000€)
• Assurance-vie : fiscalité avantageuse après 8 ans

📊 **Plateformes recommandées :**
• Trade Republic — 0 frais, actions européennes
• Degiro — frais bas, marchés mondiaux
• Boursorama — banque + bourse française

⚠️ Investir comporte des risques. Consultez un conseiller.
Boudoum ! 🇬🇵`
  }

  if (q.includes('épargne') || q.includes('economiser') || q.includes('épargner')) {
    return `💰 **Épargne DOM-TOM — Conseils**

🏦 **Produits disponibles :**
• Livret A : 3% — sécurisé, liquide
• LDDS : 3% — développement durable
• LEP : 5% — sous conditions revenus
• PEL : 2% — pour projet immobilier
• Assurance-vie — long terme

💡 **Stratégie recommandée :**
1. 3 mois de salaire en Livret A (urgences)
2. Reste en assurance-vie ou PEA
3. Token REUSS pour diversification crypto 🔗 reussitess.fr

Boudoum ! 🇬🇵`
  }

  if (q.includes('crypto') || q.includes('bitcoin') || q.includes('ethereum') || q.includes('reuss')) {
    try {
      const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,matic-network&vs_currencies=eur,usd')
      const d = await res.json()
      return `💎 **Crypto — Prix Temps Réel**

₿ Bitcoin : ${d['bitcoin']?.eur}€ / $${d['bitcoin']?.usd}
Ξ Ethereum : ${d['ethereum']?.eur}€ / $${d['ethereum']?.usd}
⬡ Polygon : ${d['matic-network']?.eur}€ / $${d['matic-network']?.usd}

🔗 Token REUSS sur Polygon : 0xB37531727fC07c6EED4f97F852A115B428046EB2
🔗 QuickSwap : quickswap.exchange
🔗 GoMining : gomining.com/?ref=OT3GI2U

⚠️ Crypto = risque élevé. Investissez prudemment.
Boudoum ! 🇬🇵`
    } catch(e) {
      return `💎 **Crypto REUSSITESS**\n\n🔗 Token REUSS sur Polygon\n🔗 GoMining : gomining.com/?ref=OT3GI2U\n\nBoudoum ! 🇬🇵`
    }
  }

  return null
}

// ===== 4. DONNÉES TEMPS RÉEL SUPPLÉMENTAIRES =====
export async function getDonneesTempsReel(question) {
  const q = question.toLowerCase()

  // Taux de change XCD (Dollar Caraïbes)
  if (q.includes('xcd') || q.includes('dollar caraïbes') || q.includes('eastern caribbean')) {
    try {
      const res = await fetch('https://api.exchangerate-api.com/v4/latest/XCD')
      const d = await res.json()
      return `💱 **Dollar des Caraïbes Orientales (XCD)**

1 XCD = ${d.rates?.EUR?.toFixed(4)}€
1 XCD = $${d.rates?.USD?.toFixed(4)}
1 XCD = ${d.rates?.HTG?.toFixed(2)} Gourdes haïtiennes
1 XCD = ${d.rates?.JMD?.toFixed(2)} Dollars jamaïcains

🌍 Pays XCD : Antigua, Dominique, Grenade, St-Kitts, Ste-Lucie, St-Vincent
Boudoum ! 🇬🇵`
    } catch(e) { return null }
  }

  // Séismes Caraïbes temps réel
  if (q.includes('séisme') || q.includes('tremblement') || q.includes('earthquake')) {
    try {
      const res = await fetch('https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&minmagnitude=3&minlatitude=10&maxlatitude=20&minlongitude=-70&maxlongitude=-58&limit=3')
      const d = await res.json()
      const quakes = d.features?.slice(0,3).map(f => 
        `• M${f.properties.mag} — ${f.properties.place} (${new Date(f.properties.time).toLocaleDateString('fr-FR')})`
      ).join('\n')
      return `🌋 **Séismes Caraïbes — Temps Réel**\n\n${quakes || 'Aucun séisme récent'}\n\nSource: USGS\nBoudoum ! 🇬🇵`
    } catch(e) { return null }
  }

  // Cyclones actifs
  if (q.includes('cyclone') || q.includes('ouragan') || q.includes('tempête tropicale')) {
    try {
      const res = await fetch('https://www.nhc.noaa.gov/CurrentStorms.json')
      const d = await res.json()
      const storms = d.currentStorms?.length > 0 
        ? d.currentStorms.map(s => `• ${s.name} — ${s.classification}`).join('\n')
        : '✅ Aucun cyclone actif actuellement'
      return `🌀 **Cyclones Actifs — NOAA**\n\n${storms}\n\n🔗 nhc.noaa.gov\nBoudoum ! 🇬🇵`
    } catch(e) { return null }
  }

  return null
}
