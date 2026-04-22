/* © Reussitess®971 INPI DSO2026012614 PORINUS Rony 2026 */
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const visa = req.body
  
  const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>VISA UNIVERSEL</title>
<style>
  body { font-family: Arial, sans-serif; background: #0f172a; color: white; padding: 2rem; margin: 0; }
  .visa { border: 3px solid #10b981; border-radius: 20px; padding: 2rem; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1e293b, #0f172a); }
  h1 { color: #10b981; text-align: center; font-size: 1.8rem; margin-bottom: 0.5rem; }
  h2 { color: #f59e0b; text-align: center; font-size: 1.2rem; margin-top: 0; }
  .numero { color: #f59e0b; text-align: center; font-size: 1.1rem; font-weight: bold; margin: 1rem 0; padding: 0.5rem; border: 1px solid #f59e0b; border-radius: 10px; }
  .field { margin: 0.5rem 0; padding: 0.7rem 1rem; background: rgba(16,185,129,0.1); border-radius: 8px; border-left: 3px solid #10b981; }
  .footer { text-align: center; margin-top: 2rem; color: #10b981; border-top: 1px solid rgba(16,185,129,0.3); padding-top: 1rem; }
  .flag { font-size: 2rem; }
</style></head>
<body><div class="visa">
  <div style="text-align:center"><span class="flag">🌍</span></div>
  <h1>VISA UNIVERSEL DE RÉUSSITE</h1>
  <h2>REUSSITESS®971</h2>
  <div class="numero">N° ${visa.numero}</div>
  <div class="field">👤 <b>Nom :</b> ${visa.prenom} ${visa.nom}</div>
  <div class="field">📧 <b>Email :</b> ${visa.email}</div>
  <div class="field">🌍 <b>Pays :</b> ${visa.pays}</div>
  <div class="field">🏙 <b>Ville :</b> ${visa.ville || 'Non précisé'}</div>
  <div class="field">💼 <b>Domaine :</b> ${visa.domaine?.label || visa.domaine}</div>
  <div class="field">📈 <b>Niveau :</b> ${visa.niveau?.label || visa.niveau}</div>
  <div class="field">🎯 <b>Besoin :</b> ${visa.besoin?.label || visa.besoin}</div>
  <div class="footer">
    <p>🇬🇵 Guadeloupe — Terres de Champions</p>
    <p>REUSSITESS®971 — Positivité à l'infini — <b>BOUDOUM !</b></p>
  </div>
</div></body></html>`

  res.setHeader('Content-Type', 'text/html')
  res.status(200).send(html)
}
