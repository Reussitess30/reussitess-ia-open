import type { NextApiRequest, NextApiResponse } from 'next'

const ASSOCIATE_TAG = 'ronyporinu0ac-21'

// Catalogue de produits rotatifs par catégorie
const PRODUCTS: Record<string, any[]> = {
  tech: [
    { title: 'Apple AirPods Pro (2ème génération)', price: '279.99€', reuss: 13999, features: ['Réduction active du bruit', 'Audio spatial'], asin: 'B0BDHWDR12', img: '🎧' },
    { title: 'Samsung Galaxy S24 Ultra', price: '1199.99€', reuss: 59999, features: ['Écran 6.8" Dynamic AMOLED', 'S Pen inclus'], asin: 'B0CMDJ3SDP', img: '📱' },
    { title: 'Apple MacBook Air M3', price: '1299.99€', reuss: 64999, features: ['Puce M3', '13.6" Liquid Retina'], asin: 'B0CX23V2ZK', img: '💻' },
    { title: 'Sony WH-1000XM5', price: '349.99€', reuss: 17499, features: ['Réduction bruit premium', '30h autonomie'], asin: 'B09XS7JWHH', img: '🎵' },
    { title: 'PlayStation 5 Slim', price: '449.99€', reuss: 22499, features: ['Console nouvelle génération', '1TB SSD'], asin: 'B0CL5KNB9M', img: '🎮' },
    { title: 'iPad Pro M4 11"', price: '999.99€', reuss: 49999, features: ['Puce M4', 'Écran OLED'], asin: 'B0D3J5BJXP', img: '📱' },
  ],
  gaming: [
    { title: 'Xbox Series X', price: '499.99€', reuss: 24999, features: ['4K Gaming', '1TB SSD NVMe'], asin: 'B08H75RTZ8', img: '🎮' },
    { title: 'Nintendo Switch OLED', price: '349.99€', reuss: 17499, features: ['Écran OLED 7"', 'Station d'accueil améliorée'], asin: 'B098RL6SBJ', img: '🕹️' },
    { title: 'Razer DeathAdder V3', price: '89.99€', reuss: 4499, features: ['Focus Pro 30K DPI', 'Ultra léger 59g'], asin: 'B0BKVH7PFW', img: '🖱️' },
    { title: 'Logitech G Pro X Superlight 2', price: '159.99€', reuss: 7999, features: ['Sans fil 32h', 'HERO 2 25K sensor'], asin: 'B09NBMGB9M', img: '🖱️' },
    { title: 'Samsung Odyssey G7 27"', price: '449.99€', reuss: 22499, features: ['240Hz QHD', '1ms temps de réponse'], asin: 'B08F9XFT69', img: '🖥️' },
    { title: 'SteelSeries Arctis Nova Pro', price: '299.99€', reuss: 14999, features: ['Suppression bruit IA', 'Multi-system connect'], asin: 'B09ZQPPNMZ', img: '🎧' },
  ],
  audio: [
    { title: 'Bose QuietComfort 45', price: '279.99€', reuss: 13999, features: ['ANC de référence', '24h autonomie'], asin: 'B098FKXT8L', img: '🎧' },
    { title: 'JBL Charge 5', price: '179.99€', reuss: 8999, features: ['Waterproof IP67', '20h autonomie'], asin: 'B08MKPJNVV', img: '🔊' },
    { title: 'Apple HomePod mini', price: '109.99€', reuss: 5499, features: ['Son 360°', 'Siri intégré'], asin: 'B08HSTJPM3', img: '🔊' },
    { title: 'Sony SRS-XB43', price: '199.99€', reuss: 9999, features: ['Extra Bass', '24h autonomie IP67'], asin: 'B086B3R2ZT', img: '🎵' },
    { title: 'Jabra Evolve2 75', price: '349.99€', reuss: 17499, features: ['ANC pro', 'Certifié Teams/Zoom'], asin: 'B09HFWBR4M', img: '🎧' },
    { title: 'Marshall Stanmore III', price: '379.99€', reuss: 18999, features: ['Bluetooth 5.2', 'Son Marshall légendaire'], asin: 'B09NRHB8T7', img: '🔊' },
  ],
  smartphones: [
    { title: 'iPhone 15 Pro Max', price: '1479.99€', reuss: 73999, features: ['Puce A17 Pro', 'Titane grade 5'], asin: 'B0CHX2Z77M', img: '📱' },
    { title: 'Google Pixel 8 Pro', price: '1099.99€', reuss: 54999, features: ['Google AI', 'Camera 50MP'], asin: 'B0CGT22KGK', img: '📱' },
    { title: 'OnePlus 12', price: '899.99€', reuss: 44999, features: ['Snapdragon 8 Gen 3', '100W charge'], asin: 'B0CRMDQTQ5', img: '📱' },
    { title: 'Samsung Galaxy A55', price: '449.99€', reuss: 22499, features: ['AMOLED 120Hz', 'IP67'], asin: 'B0CW67HKGJ', img: '📱' },
    { title: 'Xiaomi 14 Ultra', price: '1299.99€', reuss: 64999, features: ['Leica Optics', '5000mAh 90W'], asin: 'B0CZ3JGMWR', img: '📱' },
    { title: 'Nothing Phone (2)', price: '649.99€', reuss: 32499, features: ['Glyph Interface', 'Snapdragon 8+ Gen 1'], asin: 'B0C7BBV5QJ', img: '📱' },
  ],
  tablettes: [
    { title: 'Samsung Galaxy Tab S9 Ultra', price: '1199.99€', reuss: 59999, features: ['14.6" AMOLED', 'S Pen inclus'], asin: 'B0C4MKT2QG', img: '📱' },
    { title: 'Microsoft Surface Pro 9', price: '1299.99€', reuss: 64999, features: ['Intel i5 Gen 12', 'Windows 11'], asin: 'B0BK1M9KDD', img: '💻' },
    { title: 'Amazon Fire HD 10', price: '149.99€', reuss: 7499, features: ['Écran 10.1" Full HD', 'Alexa intégré'], asin: 'B08BX7FV5L', img: '📱' },
    { title: 'Lenovo Tab P12 Pro', price: '699.99€', reuss: 34999, features: ['AMOLED 12.6"', 'Stylet inclus'], asin: 'B09MFQMQNR', img: '📱' },
    { title: 'Xiaomi Pad 6', price: '399.99€', reuss: 19999, features: ['Snapdragon 870', '144Hz'], asin: 'B0C4L5QDFW', img: '📱' },
    { title: 'Huawei MatePad Pro 13.2"', price: '999.99€', reuss: 49999, features: ['OLED 13.2"', 'M-Pencil inclus'], asin: 'B0CMJ3VG3T', img: '📱' },
  ],
  montres: [
    { title: 'Apple Watch Series 9', price: '449.99€', reuss: 22499, features: ['Puce S9', 'Double Tap'], asin: 'B0CSTJ2Y3L', img: '⌚' },
    { title: 'Samsung Galaxy Watch 6 Classic', price: '399.99€', reuss: 19999, features: ['Lunette rotative', 'ECG'], asin: 'B0C9BBBM7D', img: '⌚' },
    { title: 'Garmin Fenix 7', price: '699.99€', reuss: 34999, features: ['GPS multi-bandes', '18j autonomie'], asin: 'B09TDB1Q3B', img: '⌚' },
    { title: 'Fitbit Charge 6', price: '159.99€', reuss: 7999, features: ['Google Maps', 'ECG + SpO2'], asin: 'B0CCB6B4SZ', img: '⌚' },
    { title: 'Polar Vantage V3', price: '599.99€', reuss: 29999, features: ['AMOLED', 'GPS + ECG + EEG'], asin: 'B0CH4QFKF5', img: '⌚' },
    { title: 'Withings ScanWatch 2', price: '349.99€', reuss: 17499, features: ['Hybride médical', 'ECG + SpO2'], asin: 'B0BZ6JZKCD', img: '⌚' },
  ],
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const keywords = (req.query.keywords as string) || 'tech'
  const max = parseInt(req.query.max as string) || 6

  // Déterminer la catégorie
  let category = 'tech'
  const kw = keywords.toLowerCase()
  if (kw.includes('gaming') || kw.includes('jeu') || kw.includes('game')) category = 'gaming'
  else if (kw.includes('audio') || kw.includes('musique') || kw.includes('son')) category = 'audio'
  else if (kw.includes('smartphone') || kw.includes('téléphone') || kw.includes('phone')) category = 'smartphones'
  else if (kw.includes('tablette') || kw.includes('tablet') || kw.includes('ipad')) category = 'tablettes'
  else if (kw.includes('montre') || kw.includes('watch')) category = 'montres'
  else if (kw.includes('populaire') || kw.includes('tech')) category = 'tech'

  const pool = PRODUCTS[category] || PRODUCTS.tech

  // Rotation aléatoire — les produits changent à chaque appel
  const shuffled = pool
    .map(p => ({ ...p, _sort: Math.random() }))
    .sort((a, b) => a._sort - b._sort)
    .slice(0, max)
    .map(({ _sort, ...p }) => ({
      ...p,
      url: `https://www.amazon.fr/dp/${p.asin}?tag=${ASSOCIATE_TAG}`,
      cashbackPercent: Math.floor(Math.random() * 6) + 5, // 5-10%
    }))

  res.setHeader('Cache-Control', 'no-store, max-age=0')
  res.status(200).json({
    success: true,
    category,
    keywords,
    products: shuffled,
    totalAvailable: pool.length,
    updatedAt: new Date().toISOString(),
  })
}
