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
  function drawHeader(title,sub) {
    doc.rect(0,0,595,80).fill(VERT)
    doc.fillColor('white').fontSize(22).font('Helvetica-Bold').text('REUSSITESS\u00ae971',50,18)
    doc.fontSize(10).font('Helvetica').text("Terres de Champions \u2014 Positivit\u00e9 \u00e0 l\'infini !",50,45).text('reussitess.fr',450,45)
    doc.rect(0,80,595,55).fill(BLEU)
    doc.fillColor('white').fontSize(18).font('Helvetica-Bold').text(title,50,92,{align:'center',width:495})
    if(sub) doc.fontSize(10).font('Helvetica').text(sub,50,115,{align:'center',width:495})
    doc.moveDown(6)
  }
  function drawFooter() {
    doc.rect(0,780,595,60).fill(GRIS)
    doc.fillColor('#666').fontSize(7).font('Helvetica')
      .text('REUSSITESS\u00ae971 \u2014 SIRET: 444699979700031 \u2014 reussitess.fr',50,792,{align:'center',width:495})
      .text('\u26a0\ufe0f Document informatif. Consultez un professionnel pour toute d\u00e9cision l\u00e9gale ou financi\u00e8re.',50,803,{align:'center',width:495})
      .text('G\u00e9n\u00e9r\u00e9 le '+date+' \u2014 BOUDOUM ! \ud83c\uddec\ud83c\uddf5',50,814,{align:'center',width:495})
  }
  if(type==='certificat') {
    const {prenom='Champion',pays='Guadeloupe',objectif='Excellence'}=data||{}
    drawHeader('\ud83c\udfc6 CERTIFICAT DE CHAMPION','Passeport de R\u00e9ussite REUSSITESS\u00ae971')
    doc.rect(60,155,475,3).fill(VERT)
    doc.fillColor(BLEU).fontSize(14).font('Helvetica-Bold').text('Ce certificat est d\u00e9cern\u00e9 \u00e0 :',50,175,{align:'center',width:495})
    doc.fillColor(VERT).fontSize(32).font('Helvetica-Bold').text(prenom.toUpperCase(),50,200,{align:'center',width:495})
    doc.fillColor('#333').fontSize(13).font('Helvetica').text('Repr\u00e9sentant(e) fi\u00e8rement : '+pays,50,250,{align:'center',width:495})
    doc.rect(60,275,475,3).fill(VERT)
    doc.fillColor(BLEU).fontSize(16).font('Helvetica-Bold').text(objectif,50,320,{align:'center',width:495})
    doc.fillColor('#555').fontSize(11).font('Helvetica').text("Dans le cadre de l'\u00e9cosyst\u00e8me REUSSITESS\u00ae971 \u2014 14 pays",50,360,{align:'center',width:495})
    doc.rect(60,405,475,3).fill(VERT)
    doc.fillColor('#333').fontSize(11).font('Helvetica-Bold').text('Rony Porinus',120,440)
    doc.font('Helvetica').fontSize(9).fillColor('#666').text('Fondateur REUSSITESS\u00ae971',120,456).text('Auto-entrepreneur Guadeloupe',120,468)
    doc.fillColor('#333').fontSize(9).font('Helvetica').text(date,380,456)
    doc.rect(100,510,395,45).fill(GRIS)
    doc.fillColor(VERT).fontSize(13).font('Helvetica-Bold').text('"Terres de Champions \u2014 Positivit\u00e9 \u00e0 l\'infini !"',50,524,{align:'center',width:495})
    drawFooter()
  } else if(type==='contrat') {
    const {prestataire='Prestataire',client='Client',objet='Prestation',montant='0',duree='1 mois',dateDebut=date}=data||{}
    drawHeader('\ud83d\udccb CONTRAT DE PRESTATION','\u26a0\ufe0f Document informatif \u2014 Consultez un juriste avant signature')
    const y0=160
    doc.rect(50,y0,495,30).fill('#fff3cd')
    doc.fillColor('#856404').fontSize(9).font('Helvetica').text("\u26a0\ufe0f Mod\u00e8le informatif uniquement. Valider avec un avocat avant signature.",60,y0+10,{width:475})
    doc.fillColor(BLEU).fontSize(12).font('Helvetica-Bold').text('PARTIES',50,y0+50)
    doc.fillColor('#333').fontSize(11).font('Helvetica-Bold').text('PRESTATAIRE :',50,y0+70).font('Helvetica').text(prestataire,200,y0+70)
    doc.font('Helvetica-Bold').text('CLIENT :',50,y0+90).font('Helvetica').text(client,200,y0+90)
    doc.fillColor(BLEU).fontSize(12).font('Helvetica-Bold').text('OBJET',50,y0+120)
    doc.fillColor('#333').fontSize(11).font('Helvetica').text(objet,50,y0+140,{width:495})
    doc.fillColor(BLEU).fontSize(12).font('Helvetica-Bold').text('CONDITIONS',50,y0+180)
    doc.fillColor('#333').fontSize(11).font('Helvetica').text('Montant HT : '+montant+' \u20ac',50,y0+200).text('Dur\u00e9e : '+duree,50,y0+218).text('D\u00e9but : '+dateDebut,50,y0+236)
    doc.fillColor(BLEU).fontSize(12).font('Helvetica-Bold').text('CLAUSES',50,y0+265)
    doc.fillColor('#333').fontSize(10).font('Helvetica')
      .text('\u2022 Livraison dans les d\u00e9lais convenus',50,y0+283)
      .text('\u2022 Paiement \u00e0 la livraison',50,y0+298)
      .text('\u2022 Propri\u00e9t\u00e9 intellectuelle transf\u00e9r\u00e9e apr\u00e8s paiement total',50,y0+313)
      .text('\u2022 Loi applicable : droit fran\u00e7ais \u2014 Juridiction Guadeloupe (971)',50,y0+328)
    doc.fillColor(BLEU).fontSize(12).font('Helvetica-Bold').text('SIGNATURES',50,y0+360)
    doc.fillColor('#333').fontSize(11).font('Helvetica').text('Prestataire : ____________________',50,y0+380).text('Client : ____________________',300,y0+380).text('Date : ________________',50,y0+405).text('Date : ________________',300,y0+405)
    drawFooter()
  } else if(type==='cv') {
    const {nom='Votre Nom',poste='Poste recherch\u00e9',email='email@exemple.com',telephone='+596 XXX XXX',localisation='Guadeloupe',experience='Exp\u00e9riences',formation='Formation',competences='Comp\u00e9tences',langues='Fran\u00e7ais, Cr\u00e9ole, Anglais'}=data||{}
    doc.rect(0,0,195,842).fill(BLEU).rect(195,0,400,842).fill('white')
    doc.fillColor('white').fontSize(16).font('Helvetica-Bold').text(nom,15,40,{width:165})
    doc.fontSize(10).font('Helvetica').fillColor('#a8d8ea').text(poste,15,72,{width:165})
    doc.rect(15,100,165,2).fill(VERT)
    doc.fillColor(VERT).fontSize(10).font('Helvetica-Bold').text('CONTACT',15,115)
    doc.fillColor('white').fontSize(8).font('Helvetica').text(email,15,132,{width:165}).text(telephone,15,147,{width:165}).text(localisation,15,162,{width:165})
    doc.rect(15,182,165,2).fill(VERT)
    doc.fillColor(VERT).fontSize(10).font('Helvetica-Bold').text('COMP\u00c9TENCES',15,197)
    doc.fillColor('white').fontSize(8).font('Helvetica').text(competences,15,215,{width:165})
    doc.rect(15,310,165,2).fill(VERT)
    doc.fillColor(VERT).fontSize(10).font('Helvetica-Bold').text('LANGUES',15,325)
    doc.fillColor('white').fontSize(8).font('Helvetica').text(langues,15,342,{width:165})
    doc.rect(15,400,165,2).fill(VERT)
    doc.fillColor(VERT).fontSize(8).font('Helvetica-Bold').text('REUSSITESS\u00ae971',15,415)
    doc.fillColor('#a8d8ea').fontSize(7).font('Helvetica').text('reussitess.fr \u2014 BOUDOUM !',15,430,{width:165})
    doc.fillColor(BLEU).fontSize(13).font('Helvetica-Bold').text('EXP\u00c9RIENCES PROFESSIONNELLES',210,30)
    doc.rect(210,50,370,2).fill(VERT)
    doc.fillColor('#333').fontSize(10).font('Helvetica').text(experience,210,60,{width:370})
    doc.fillColor(BLEU).fontSize(13).font('Helvetica-Bold').text('FORMATION',210,200)
    doc.rect(210,218,370,2).fill(VERT)
    doc.fillColor('#333').fontSize(10).font('Helvetica').text(formation,210,228,{width:370})
    doc.fillColor(BLEU).fontSize(13).font('Helvetica-Bold').text('OBJECTIF PROFESSIONNEL',210,360)
    doc.rect(210,378,370,2).fill(VERT)
    doc.fillColor('#333').fontSize(10).font('Helvetica').text("Contribuer activement \u00e0 une \u00e9quipe dynamique et au rayonnement carib\u00e9en.",210,388,{width:370})
  } else if(type==='business-plan') {
    const {nomProjet='Projet',secteur='Commerce',description='Description',marche='March\u00e9',revenus='Revenus',budget='0',porteur='Porteur'}=data||{}
    drawHeader('\ud83d\udcca BUSINESS PLAN SIMPLIFI\u00c9','REUSSITESS\u00ae971 \u2014 Document de synth\u00e8se')
    let y=160
    const sec=(t,c,yp)=>{
      doc.rect(50,yp,495,24).fill(BLEU)
      doc.fillColor('white').fontSize(11).font('Helvetica-Bold').text(t,60,yp+7)
      doc.fillColor('#333').fontSize(10).font('Helvetica').text(c,55,yp+32,{width:485})
      return yp+32+Math.max(38,Math.ceil(c.length/90)*13+18)
    }
    y=sec('1. PR\u00c9SENTATION','Nom : '+nomProjet+' | Porteur : '+porteur+' | Secteur : '+secteur,y)
    y=sec('2. DESCRIPTION',description,y)
    y=sec('3. MARCH\u00c9 CIBLE',marche,y)
    y=sec('4. REVENUS',revenus,y)
    y=sec('5. BUDGET','Investissement initial estim\u00e9 : '+budget+' \u20ac \u2014 ROI \u00e0 calculer selon march\u00e9',y)
    y=sec('6. PROCHAINES \u00c9TAPES','\u2022 Validation concept \u2022 Structure juridique \u2022 MVP \u2022 Communication',y)
    doc.rect(50,y+8,495,32).fill('#fff3cd')
    doc.fillColor('#856404').fontSize(8).font('Helvetica').text("\u26a0\ufe0f Estimations informatives. Consultez un expert-comptable ou la CCI avant tout investissement.",60,y+18,{width:475})
    drawFooter()
  } else {
    drawHeader('REUSSITESS\u00ae971','Document g\u00e9n\u00e9r\u00e9 par REUSSITESS\u00ae971 AI')
    doc.fillColor('#333').fontSize(12).font('Helvetica').text('Type: '+type,50,200)
    drawFooter()
  }
  doc.end()
}
