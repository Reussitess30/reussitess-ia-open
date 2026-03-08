import PDFDocument from 'pdfkit'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { type, data } = req.body
  const doc = new PDFDocument({ margin: 50, size: 'A4' })
  const chunks = []
  doc.on('data', chunk => chunks.push(chunk))
  doc.on('end', () => {
    const pdfBuffer = Buffer.concat(chunks)
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', 'attachment; filename="reussitess-' + type + '-' + Date.now() + '.pdf"')
    res.setHeader('Content-Length', pdfBuffer.length)
    res.status(200).end(pdfBuffer)
  })

  const VERT = '#00a651'
  const BLEU = '#003087'
  const GRIS = '#f5f5f5'
  const date = new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })

  function drawHeader(title, sub) {
    doc.rect(0, 0, 595, 80).fill(VERT)
    doc.fillColor('white').fontSize(22).font('Helvetica-Bold').text('REUSSITESS(R)971', 50, 18)
    doc.fontSize(10).font('Helvetica').text('Terres de Champions - Positivite a l\'infini !', 50, 45).text('reussitess.fr', 450, 45)
    doc.rect(0, 80, 595, 55).fill(BLEU)
    doc.fillColor('white').fontSize(18).font('Helvetica-Bold').text(title, 50, 92, { align: 'center', width: 495 })
    if (sub) doc.fontSize(10).font('Helvetica').text(sub, 50, 115, { align: 'center', width: 495 })
    doc.moveDown(6)
  }

  function drawFooter() {
    doc.rect(0, 775, 595, 67).fill(GRIS)
    doc.fillColor('#666').fontSize(7).font('Helvetica')
       .text('REUSSITESS(R)971 - Auto-entrepreneur Guadeloupe - SIRET: 444699979700031 - reussitess.fr', 50, 787, { align: 'center', width: 495 })
       .text('Document informatif uniquement. Consultez un professionnel pour toute decision legale ou financiere.', 50, 800, { align: 'center', width: 495 })
       .text('Genere le ' + date + ' - Fonde depuis la Guadeloupe 971 par Rony Porinus - BOUDOUM !', 50, 813, { align: 'center', width: 495 })
  }

  if (type === 'certificat') {
    const prenom = (data && data.prenom) ? data.prenom : 'Champion'
    const pays = (data && data.pays) ? data.pays : 'Guadeloupe'
    const objectif = (data && data.objectif) ? data.objectif : 'Excellence'
    drawHeader('CERTIFICAT DE CHAMPION', 'Passeport de Reussite REUSSITESS(R)971')
    doc.rect(60, 155, 475, 4).fill(VERT)
    doc.fillColor(BLEU).fontSize(14).font('Helvetica-Bold').text('Ce certificat est decerne a :', 50, 178, { align: 'center', width: 495 })
    doc.fillColor(VERT).fontSize(34).font('Helvetica-Bold').text(prenom.toUpperCase(), 50, 205, { align: 'center', width: 495 })
    doc.fillColor('#444').fontSize(13).font('Helvetica').text('Representant(e) fierement : ' + pays, 50, 255, { align: 'center', width: 495 })
    doc.rect(60, 280, 475, 3).fill(VERT)
    doc.fillColor('#444').fontSize(12).font('Helvetica').text('Pour son engagement exceptionnel envers :', 50, 298, { align: 'center', width: 495 })
    doc.fillColor(BLEU).fontSize(17).font('Helvetica-Bold').text(objectif, 50, 322, { align: 'center', width: 495 })
    doc.fillColor('#666').fontSize(11).font('Helvetica').text('Dans le cadre de l\'ecosysteme REUSSITESS(R)971 - 14 pays partenaires', 50, 365, { align: 'center', width: 495 })
    doc.rect(60, 408, 475, 4).fill(VERT)
    doc.fillColor('#333').fontSize(11).font('Helvetica-Bold').text('Rony Porinus', 120, 440)
    doc.font('Helvetica').fontSize(9).fillColor('#666').text('Fondateur REUSSITESS(R)971', 120, 456).text('Auto-entrepreneur Guadeloupe', 120, 468)
    doc.fillColor('#333').fontSize(9).font('Helvetica').text(date, 380, 456)
    doc.rect(90, 510, 415, 50).fill(GRIS)
    doc.fillColor(VERT).fontSize(13).font('Helvetica-Bold').text('Terres de Champions - Positivite a l\'infini !', 50, 526, { align: 'center', width: 495 })
    drawFooter()

  } else if (type === 'contrat') {
    const prestataire = (data && data.prestataire) ? data.prestataire : 'Prestataire'
    const client = (data && data.client) ? data.client : 'Client'
    const objet = (data && data.objet) ? data.objet : 'Prestation de service'
    const montant = (data && data.montant) ? data.montant : '0'
    const duree = (data && data.duree) ? data.duree : '1 mois'
    const dateDebut = (data && data.dateDebut) ? data.dateDebut : date
    drawHeader('CONTRAT DE PRESTATION DE SERVICE', 'Document informatif - Consultez un juriste avant signature')
    let y = 165
    doc.rect(50, y, 495, 32).fill('#fff3cd')
    doc.fillColor('#856404').fontSize(9).font('Helvetica').text('AVERTISSEMENT : Modele informatif uniquement. Valider avec un avocat avant signature.', 60, y + 10, { width: 475 })
    y += 45
    doc.rect(50, y, 495, 24).fill(BLEU)
    doc.fillColor('white').fontSize(11).font('Helvetica-Bold').text('ARTICLE 1 - PARTIES', 60, y + 7)
    y += 32
    doc.fillColor('#333').fontSize(11).font('Helvetica-Bold').text('PRESTATAIRE :', 55, y)
    doc.font('Helvetica').text(prestataire, 210, y)
    y += 20
    doc.font('Helvetica-Bold').text('CLIENT :', 55, y)
    doc.font('Helvetica').text(client, 210, y)
    y += 30
    doc.rect(50, y, 495, 24).fill(BLEU)
    doc.fillColor('white').fontSize(11).font('Helvetica-Bold').text('ARTICLE 2 - OBJET', 60, y + 7)
    y += 32
    doc.fillColor('#333').fontSize(11).font('Helvetica').text(objet, 55, y, { width: 485 })
    y += 35
    doc.rect(50, y, 495, 24).fill(BLEU)
    doc.fillColor('white').fontSize(11).font('Helvetica-Bold').text('ARTICLE 3 - CONDITIONS', 60, y + 7)
    y += 32
    doc.fillColor('#333').fontSize(11).font('Helvetica-Bold').text('Montant HT :', 55, y)
    doc.font('Helvetica').text(montant + ' EUR', 210, y)
    y += 18
    doc.font('Helvetica-Bold').text('Duree :', 55, y)
    doc.font('Helvetica').text(duree, 210, y)
    y += 18
    doc.font('Helvetica-Bold').text('Date de debut :', 55, y)
    doc.font('Helvetica').text(dateDebut, 210, y)
    y += 35
    doc.rect(50, y, 495, 24).fill(BLEU)
    doc.fillColor('white').fontSize(11).font('Helvetica-Bold').text('ARTICLE 4 - SIGNATURES', 60, y + 7)
    y += 35
    doc.fillColor('#333').fontSize(11).font('Helvetica').text('Prestataire : _______________________', 55, y)
    doc.text('Client : _______________________', 310, y)
    y += 25
    doc.text('Date : _______________________', 55, y)
    doc.text('Date : _______________________', 310, y)
    drawFooter()

  } else if (type === 'cv') {
    const nom = (data && data.nom) ? data.nom : 'Votre Nom'
    const poste = (data && data.poste) ? data.poste : 'Poste recherche'
    const email = (data && data.email) ? data.email : 'email@exemple.com'
    const telephone = (data && data.telephone) ? data.telephone : '+596 XXX XXX'
    const localisation = (data && data.localisation) ? data.localisation : 'Guadeloupe, France'
    const experience = (data && data.experience) ? data.experience : 'Decrivez vos experiences professionnelles'
    const formation = (data && data.formation) ? data.formation : 'Votre formation'
    const competences = (data && data.competences) ? data.competences : 'Vos competences'
    const langues = (data && data.langues) ? data.langues : 'Francais, Creole, Anglais'
    doc.rect(0, 0, 195, 842).fill(BLEU)
    doc.rect(195, 0, 400, 842).fill('white')
    doc.fillColor('white').fontSize(17).font('Helvetica-Bold').text(nom, 15, 35, { width: 165 })
    doc.fontSize(10).font('Helvetica').fillColor('#a8d8ea').text(poste, 15, 70, { width: 165 })
    doc.rect(15, 100, 165, 2).fill(VERT)
    doc.fillColor(VERT).fontSize(10).font('Helvetica-Bold').text('CONTACT', 15, 112)
    doc.fillColor('white').fontSize(9).font('Helvetica').text('Email: ' + email, 15, 128, { width: 165 }).text('Tel: ' + telephone, 15, 144, { width: 165 }).text('Lieu: ' + localisation, 15, 160, { width: 165 })
    doc.rect(15, 182, 165, 2).fill(VERT)
    doc.fillColor(VERT).fontSize(10).font('Helvetica-Bold').text('COMPETENCES', 15, 194)
    doc.fillColor('white').fontSize(9).font('Helvetica').text(competences, 15, 210, { width: 165 })
    doc.rect(15, 315, 165, 2).fill(VERT)
    doc.fillColor(VERT).fontSize(10).font('Helvetica-Bold').text('LANGUES', 15, 327)
    doc.fillColor('white').fontSize(9).font('Helvetica').text(langues, 15, 343, { width: 165 })
    doc.rect(15, 405, 165, 2).fill(VERT)
    doc.fillColor(VERT).fontSize(9).font('Helvetica-Bold').text('REUSSITESS(R)971', 15, 417)
    doc.fillColor('#a8d8ea').fontSize(8).font('Helvetica').text('reussitess.fr - BOUDOUM !', 15, 432, { width: 165 })
    doc.fillColor(BLEU).fontSize(14).font('Helvetica-Bold').text('EXPERIENCES PROFESSIONNELLES', 210, 30)
    doc.rect(210, 50, 370, 2).fill(VERT)
    doc.fillColor('#333').fontSize(10).font('Helvetica').text(experience, 210, 60, { width: 370 })
    doc.fillColor(BLEU).fontSize(14).font('Helvetica-Bold').text('FORMATION', 210, 220)
    doc.rect(210, 238, 370, 2).fill(VERT)
    doc.fillColor('#333').fontSize(10).font('Helvetica').text(formation, 210, 248, { width: 370 })
    doc.fillColor(BLEU).fontSize(14).font('Helvetica-Bold').text('OBJECTIF', 210, 380)
    doc.rect(210, 398, 370, 2).fill(VERT)
    doc.fillColor('#333').fontSize(10).font('Helvetica').text('Contribuer activement a une equipe dynamique et au rayonnement caribeen.', 210, 408, { width: 370 })

  } else if (type === 'business-plan') {
    const nomProjet = (data && data.nomProjet) ? data.nomProjet : 'Mon Projet'
    const secteur = (data && data.secteur) ? data.secteur : 'Commerce'
    const description = (data && data.description) ? data.description : 'Description du projet'
    const marche = (data && data.marche) ? data.marche : 'Marche cible'
    const revenus = (data && data.revenus) ? data.revenus : 'Sources de revenus'
    const budget = (data && data.budget) ? data.budget : '0'
    const porteur = (data && data.porteur) ? data.porteur : 'Porteur du projet'
    drawHeader('BUSINESS PLAN SIMPLIFIE', 'REUSSITESS(R)971 - Document de synthese')
    let y = 160
    const sec = function(titre, contenu, yPos) {
      doc.rect(50, yPos, 495, 24).fill(BLEU)
      doc.fillColor('white').fontSize(11).font('Helvetica-Bold').text(titre, 60, yPos + 7)
      yPos += 32
      doc.fillColor('#333').fontSize(10).font('Helvetica').text(contenu, 55, yPos, { width: 485 })
      return yPos + Math.max(40, Math.ceil(contenu.length / 90) * 14 + 18)
    }
    y = sec('1. PRESENTATION', 'Nom : ' + nomProjet + ' | Porteur : ' + porteur + ' | Secteur : ' + secteur, y)
    y = sec('2. DESCRIPTION', description, y)
    y = sec('3. MARCHE CIBLE', marche, y)
    y = sec('4. REVENUS', revenus, y)
    y = sec('5. BUDGET', 'Investissement initial : ' + budget + ' EUR', y)
    y = sec('6. PROCHAINES ETAPES', '(1) Valider concept (2) Structure juridique (3) MVP (4) Communication', y)
    doc.rect(50, y + 5, 495, 35).fill('#fff3cd')
    doc.fillColor('#856404').fontSize(8).font('Helvetica').text('AVERTISSEMENT : Estimations informatives. Consultez un expert-comptable avant tout investissement.', 60, y + 14, { width: 475 })
    drawFooter()

  } else {
    drawHeader('REUSSITESS(R)971', 'Document genere par REUSSITESS(R)971 AI')
    doc.fillColor('#333').fontSize(12).font('Helvetica').text('Type : ' + type, 50, 200)
    drawFooter()
  }

  doc.end()
}
