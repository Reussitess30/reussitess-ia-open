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
    res.setHeader('Content-Disposition', `attachment; filename="reussitess-${type}-${Date.now()}.pdf"`)
    res.setHeader('Content-Length', pdfBuffer.length)
    res.status(200).end(pdfBuffer)
  })
  const VERT = '#00a651', BLEU = '#003087', GRIS = '#f5f5f5'
  const date = new Date().toLocaleDateString('fr-FR',{day:'2-digit',month:'long',year:'numeric'})

  function drawHeader(title, sub) {
    doc.rect(0,0,595,80).fill(VERT)
    doc.fillColor('white').fontSize(22).font('Helvetica-Bold').text('REUSSITESS(R)971',50,18)
    doc.fontSize(10).font('Helvetica').text("Terres de Champions - Positivite a l'infini !",50,45).text('reussitess.fr',450,45)
    doc.rect(0,80,595,55).fill(BLEU)
    doc.fillColor('white').fontSize(18).font('Helvetica-Bold').text(title,50,92,{align:'center',width:495})
    if(sub) doc.fontSize(10).font('Helvetica').text(sub,50,115,{align:'center',width:495})
    doc.moveDown(6)
  }

  function drawFooter() {
    doc.rect(0,780,595,60).fill(GRIS)
    doc.fillColor('#666').fontSize(7).font('Helvetica')
      .text('REUSSITESS(R)971 - SIRET: 444699979700031 - reussitess.fr',50,792,{align:'center',width:495})
      .text('AVERTISSEMENT: Document informatif. Consultez un professionnel pour toute decision legale ou financiere.',50,803,{align:'center',width:495})
      .text('Genere le '+date+' - BOUDOUM ! Guadeloupe 971',50,814,{align:'center',width:495})
  }

  if (type === 'certificat') {
    const {prenom='Champion',pays='Guadeloupe',objectif='Excellence'} = data||{}
    drawHeader('CERTIFICAT DE CHAMPION','Passeport de Reussite REUSSITESS(R)971')
    doc.rect(60,155,475,3).fill(VERT)
    doc.fillColor(BLEU).fontSize(14).font('Helvetica-Bold').text('Ce certificat est decerne a :',50,175,{align:'center',width:495})
    doc.fillColor(VERT).fontSize(32).font('Helvetica-Bold').text(prenom.toUpperCase(),50,200,{align:'center',width:495})
    doc.fillColor('#333').fontSize(13).font('Helvetica').text('Representant(e) fierement : '+pays,50,250,{align:'center',width:495})
    doc.rect(60,275,475,3).fill(VERT)
    doc.fillColor(BLEU).fontSize(16).font('Helvetica-Bold').text(objectif,50,320,{align:'center',width:495})
    doc.fillColor('#555').fontSize(11).font('Helvetica').text("Dans le cadre de l'ecosysteme REUSSITESS(R)971 - 14 pays partenaires",50,360,{align:'center',width:495})
    doc.rect(60,405,475,3).fill(VERT)
    doc.fillColor('#333').fontSize(11).font('Helvetica-Bold').text('Rony Porinus',120,440)
    doc.font('Helvetica').fontSize(9).fillColor('#666').text('Fondateur REUSSITESS(R)971',120,456).text('Auto-entrepreneur Guadeloupe',120,468)
    doc.fillColor('#333').fontSize(9).font('Helvetica').text(date,380,456)
    doc.rect(100,510,395,45).fill(GRIS)
    doc.fillColor(VERT).fontSize(13).font("Helvetica-Bold").text("\"Terres de Champions - Positivite a l\x27infini !\"",50,524,{align:"center",width:495})
    drawFooter()
  }
  else if (type === 'contrat') {
    const {prestataire='Prestataire',client='Client',objet='Prestation',montant='0',duree='1 mois',dateDebut=date} = data||{}
    drawHeader('CONTRAT DE PRESTATION DE SERVICE','AVERTISSEMENT: Document informatif - Consultez un juriste avant signature')
    const y0=160
    doc.rect(50,y0,495,30).fill('#fff3cd')
    doc.fillColor('#856404').fontSize(9).font('Helvetica').text("AVERTISSEMENT: Modele informatif uniquement. Valider avec un avocat avant signature.",60,y0+10,{width:475})
    doc.fillColor(BLEU).fontSize(12).font('Helvetica-Bold').text('PARTIES',50,y0+50)
    doc.fillColor('#333').fontSize(11).font('Helvetica-Bold').text('PRESTATAIRE :',50,y0+70).font('Helvetica').text(prestataire,200,y0+70)
    doc.font('Helvetica-Bold').text('CLIENT :',50,y0+90).font('Helvetica').text(client,200,y0+90)
    doc.fillColor(BLEU).fontSize(12).font('Helvetica-Bold').text('OBJET DE LA PRESTATION',50,y0+120)
    doc.fillColor('#333').fontSize(11).font('Helvetica').text(objet,50,y0+140,{width:495})
    doc.fillColor(BLEU).fontSize(12).font('Helvetica-Bold').text('CONDITIONS FINANCIERES',50,y0+180)
    doc.fillColor('#333').fontSize(11).font('Helvetica')
      .text('Montant HT : '+montant+' EUR',50,y0+200)
      .text('Duree : '+duree,50,y0+218)
      .text('Debut : '+dateDebut,50,y0+236)
    doc.fillColor(BLEU).fontSize(12).font('Helvetica-Bold').text('CLAUSES GENERALES',50,y0+265)
    doc.fillColor('#333').fontSize(10).font('Helvetica')
      .text('- Livraison dans les delais convenus',50,y0+283)
      .text('- Paiement a la livraison sauf accord contraire',50,y0+298)
      .text('- Propriete intellectuelle transferee apres paiement total',50,y0+313)
      .text('- Loi applicable : droit francais - Juridiction Guadeloupe (971)',50,y0+328)
    doc.fillColor(BLEU).fontSize(12).font('Helvetica-Bold').text('SIGNATURES',50,y0+360)
    doc.fillColor('#333').fontSize(11).font('Helvetica')
      .text('Prestataire : ____________________',50,y0+380)
      .text('Client : ____________________',300,y0+380)
      .text('Date : ________________',50,y0+405)
      .text('Date : ________________',300,y0+405)
    drawFooter()
  }
  else if (type === 'cv') {
    const {nom='Votre Nom',poste='Poste recherche',email='email@exemple.com',telephone='+596 XXX XXX',localisation='Guadeloupe',experience='Experiences professionnelles',formation='Formation',competences='Competences',langues='Francais, Creole, Anglais'} = data||{}
    doc.rect(0,0,195,842).fill(BLEU)
    doc.rect(195,0,400,842).fill('white')
    doc.fillColor('white').fontSize(16).font('Helvetica-Bold').text(nom,15,40,{width:165})
    doc.fontSize(10).font('Helvetica').fillColor('#a8d8ea').text(poste,15,72,{width:165})
    doc.rect(15,100,165,2).fill(VERT)
    doc.fillColor(VERT).fontSize(10).font('Helvetica-Bold').text('CONTACT',15,115)
    doc.fillColor('white').fontSize(8).font('Helvetica')
      .text(email,15,132,{width:165})
      .text(telephone,15,147,{width:165})
      .text(localisation,15,162,{width:165})
    doc.rect(15,182,165,2).fill(VERT)
    doc.fillColor(VERT).fontSize(10).font('Helvetica-Bold').text('COMPETENCES',15,197)
    doc.fillColor('white').fontSize(8).font('Helvetica').text(competences,15,215,{width:165})
    doc.rect(15,310,165,2).fill(VERT)
    doc.fillColor(VERT).fontSize(10).font('Helvetica-Bold').text('LANGUES',15,325)
    doc.fillColor('white').fontSize(8).font('Helvetica').text(langues,15,342,{width:165})
    doc.rect(15,400,165,2).fill(VERT)
    doc.fillColor(VERT).fontSize(8).font('Helvetica-Bold').text('REUSSITESS(R)971',15,415)
    doc.fillColor('#a8d8ea').fontSize(7).font('Helvetica').text('reussitess.fr - BOUDOUM !',15,430,{width:165})
    doc.fillColor(BLEU).fontSize(13).font('Helvetica-Bold').text('EXPERIENCES PROFESSIONNELLES',210,30)
    doc.rect(210,50,370,2).fill(VERT)
    doc.fillColor('#333').fontSize(10).font('Helvetica').text(experience,210,60,{width:370})
    doc.fillColor(BLEU).fontSize(13).font('Helvetica-Bold').text('FORMATION',210,200)
    doc.rect(210,218,370,2).fill(VERT)
    doc.fillColor('#333').fontSize(10).font('Helvetica').text(formation,210,228,{width:370})
    doc.fillColor(BLEU).fontSize(13).font('Helvetica-Bold').text('OBJECTIF PROFESSIONNEL',210,360)
    doc.rect(210,378,370,2).fill(VERT)
    doc.fillColor('#333').fontSize(10).font('Helvetica').text("Contribuer activement a une equipe dynamique et au rayonnement caribeen.",210,388,{width:370})
  }
  else if (type === 'business-plan') {
    const {nomProjet='Projet',secteur='Commerce',description='Description',marche='Marche',revenus='Revenus',budget='0',porteur='Porteur'} = data||{}
    drawHeader('BUSINESS PLAN SIMPLIFIE','REUSSITESS(R)971 - Document de synthese')
    let y=160
    const sec=(t,c,yp)=>{
      doc.rect(50,yp,495,24).fill(BLEU)
      doc.fillColor('white').fontSize(11).font('Helvetica-Bold').text(t,60,yp+7)
      doc.fillColor('#333').fontSize(10).font('Helvetica').text(c,55,yp+32,{width:485})
      return yp+32+Math.max(38,Math.ceil(c.length/90)*13+18)
    }
    y=sec('1. PRESENTATION','Nom : '+nomProjet+' | Porteur : '+porteur+' | Secteur : '+secteur,y)
    y=sec('2. DESCRIPTION',description,y)
    y=sec('3. MARCHE CIBLE',marche,y)
    y=sec('4. MODELE DE REVENUS',revenus,y)
    y=sec('5. BUDGET','Investissement initial : '+budget+' EUR - ROI a calculer selon marche',y)
    y=sec('6. PROCHAINES ETAPES','- Validation concept - Structure juridique - MVP - Communication',y)
    doc.rect(50,y+8,495,32).fill('#fff3cd')
    doc.fillColor('#856404').fontSize(8).font('Helvetica').text("AVERTISSEMENT: Estimations informatives. Consultez un expert-comptable ou CCI avant investissement.",60,y+18,{width:475})
    drawFooter()
  }
  else {
    drawHeader('REUSSITESS(R)971','Document genere par REUSSITESS(R)971 AI')
    doc.fillColor('#333').fontSize(12).font('Helvetica').text('Type: '+type,50,200)
    drawFooter()
  }
  doc.end()
}
