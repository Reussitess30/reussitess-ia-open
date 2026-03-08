import { NextResponse } from 'next/server'

const ASSOCIATE_TAG = process.env.AMAZON_ASSOCIATE_TAG || 'ronyporinu0ac-21'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const keywords = searchParams.get('keywords') || 'tech'
  const max = parseInt(searchParams.get('max') || '6')

  // Produits réels avec liens Amazon directs (prix en temps réel sur Amazon)
  const REAL_PRODUCTS: Record<string, any[]> = {
    tech: [
      { title: 'Apple AirPods Pro 2', asin: 'B0BDHWDR12', image: 'https://m.media-amazon.com/images/I/61SUj2aKoEL._AC_SL300_.jpg', features: ['Réduction active du bruit', 'Audio spatial'] },
      { title: 'Apple MacBook Air M3', asin: 'B0CX23V2ZK', image: 'https://m.media-amazon.com/images/I/71TPda7cwUL._AC_SL300_.jpg', features: ['Puce M3', '13.6" Liquid Retina'] },
      { title: 'Samsung Galaxy S24 Ultra', asin: 'B0CMDWGD2P', image: 'https://m.media-amazon.com/images/I/71WRwAq3eZL._AC_SL300_.jpg', features: ['200MP', 'S Pen inclus'] },
      { title: 'Sony WH-1000XM5', asin: 'B09XS7JWHH', image: 'https://m.media-amazon.com/images/I/61vFO3TymfL._AC_SL300_.jpg', features: ['ANC premium', '30h autonomie'] },
      { title: 'iPad Pro M4', asin: 'B0D3J9XDMQ', image: 'https://m.media-amazon.com/images/I/71yz-lYLBGL._AC_SL300_.jpg', features: ['Puce M4', 'Écran OLED'] },
      { title: 'Logitech MX Master 3S', asin: 'B09HM94SFK', image: 'https://m.media-amazon.com/images/I/61ni3t1ryQL._AC_SL300_.jpg', features: ['8000 DPI', 'Click silencieux'] },
    ],
    gaming: [
      { title: 'Xbox Series X', asin: 'B08H75RTZ8', image: 'https://m.media-amazon.com/images/I/61tFVIgRGIL._AC_SL300_.jpg', features: ['4K Gaming', '1TB SSD'] },
      { title: 'Nintendo Switch OLED', asin: 'B098RL6SBJ', image: 'https://m.media-amazon.com/images/I/61jj3KPANFL._AC_SL300_.jpg', features: ['Écran OLED 7"', 'Mode portable'] },
      { title: 'PlayStation 5 Slim', asin: 'B0CL5KNB9M', image: 'https://m.media-amazon.com/images/I/51JLJbY+nIL._AC_SL300_.jpg', features: ['Nouvelle génération', '1TB SSD'] },
      { title: 'Meta Quest 3', asin: 'B0C8VKH1ZH', image: 'https://m.media-amazon.com/images/I/61FRpKSBCYL._AC_SL300_.jpg', features: ['Mixed Reality', 'Snapdragon XR2'] },
      { title: 'Razer DeathAdder V3', asin: 'B0B9GNBHXG', image: 'https://m.media-amazon.com/images/I/51Lq7BEo7bL._AC_SL300_.jpg', features: ['30K DPI', '59g ultra léger'] },
    ],
    audio: [
      { title: 'Bose QuietComfort 45', asin: 'B098FKXT8L', image: 'https://m.media-amazon.com/images/I/61MWJQG5kVL._AC_SL300_.jpg', features: ['ANC référence', '24h autonomie'] },
      { title: 'JBL Charge 5', asin: 'B08NN6TQP5', image: 'https://m.media-amazon.com/images/I/71K7FiRrxAL._AC_SL300_.jpg', features: ['IP67', '20h autonomie'] },
      { title: 'Sony WH-1000XM5', asin: 'B09XS7JWHH', image: 'https://m.media-amazon.com/images/I/61vFO3TymfL._AC_SL300_.jpg', features: ['ANC premium', '30h'] },
      { title: 'Marshall Stanmore III', asin: 'B09MYDX9BF', image: 'https://m.media-amazon.com/images/I/61oUKCJZ-HL._AC_SL300_.jpg', features: ['Bluetooth 5.2', 'Son légendaire'] },
    ],
    smartphones: [
      { title: 'iPhone 15 Pro Max', asin: 'B0CHX2FRDL', image: 'https://m.media-amazon.com/images/I/81Os1SDaLzL._AC_SL300_.jpg', features: ['Puce A17 Pro', 'Titane grade 5'] },
      { title: 'Samsung Galaxy S24 Ultra', asin: 'B0CMDWGD2P', image: 'https://m.media-amazon.com/images/I/71WRwAq3eZL._AC_SL300_.jpg', features: ['S Pen', '200MP'] },
      { title: 'Google Pixel 8 Pro', asin: 'B0CGTJ12Z9', image: 'https://m.media-amazon.com/images/I/71p4LX6RNPL._AC_SL300_.jpg', features: ['Google AI', '50MP'] },
      { title: 'Samsung Galaxy A55', asin: 'B0CX59W2WY', image: 'https://m.media-amazon.com/images/I/71fvX5BFAVL._AC_SL300_.jpg', features: ['AMOLED 120Hz', 'IP67'] },
    ],
    default: [
      { title: 'Apple AirPods Pro 2', asin: 'B0BDHWDR12', image: 'https://m.media-amazon.com/images/I/61SUj2aKoEL._AC_SL300_.jpg', features: ['ANC', 'Audio spatial'] },
      { title: 'Sony WH-1000XM5', asin: 'B09XS7JWHH', image: 'https://m.media-amazon.com/images/I/61vFO3TymfL._AC_SL300_.jpg', features: ['ANC premium', '30h'] },
      { title: 'Samsung Galaxy S24 Ultra', asin: 'B0CMDWGD2P', image: 'https://m.media-amazon.com/images/I/71WRwAq3eZL._AC_SL300_.jpg', features: ['S Pen', '200MP'] },
    ]
  }

  // Cherche la catégorie correspondante
  const kw = keywords.toLowerCase()
  let category = 'default'
  if (kw.includes('tech') || kw.includes('ordinateur') || kw.includes('laptop')) category = 'tech'
  else if (kw.includes('gaming') || kw.includes('jeu') || kw.includes('xbox') || kw.includes('playstation')) category = 'gaming'
  else if (kw.includes('audio') || kw.includes('casque') || kw.includes('enceinte') || kw.includes('son')) category = 'audio'
  else if (kw.includes('phone') || kw.includes('smartphone') || kw.includes('iphone') || kw.includes('samsung')) category = 'smartphones'

  const products = (REAL_PRODUCTS[category] || REAL_PRODUCTS.default).slice(0, max)

  const deals = products.map(p => ({
    asin: p.asin,
    title: p.title,
    image: p.image,
    features: p.features,
    price: null, // Prix réel sur Amazon — pas de prix fictif
    affiliateLink: `https://www.amazon.fr/dp/${p.asin}?tag=${ASSOCIATE_TAG}`
  }))

  return NextResponse.json({
    deals,
    disclaimer: "Prix en temps réel sur Amazon.fr — cliquez pour voir le prix actuel",
    tag: ASSOCIATE_TAG,
    category
  })
}
