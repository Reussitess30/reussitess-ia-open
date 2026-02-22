import { NextResponse } from 'next/server'

const ASSOCIATE_TAG = process.env.AMAZON_ASSOCIATE_TAG || 'ronyporinu0ac-21'
const AMAZON_BE = 'https://www.amazon.com.be'
const beLink = (title: string) => `${AMAZON_BE}/s?k=${encodeURIComponent(title)}&tag=${ASSOCIATE_TAG}`

const ALL_PRODUCTS: Record<string, any[]> = {
  tech: [
    { title: 'Apple AirPods Pro 2', price: 279.99, image: 'https://m.media-amazon.com/images/I/61SUj2aKoEL._AC_SL1500_.jpg', features: ['Réduction active du bruit', 'Audio spatial'], cashback: 13999 },
    { title: 'Apple MacBook Air M3', price: 1299.99, image: 'https://m.media-amazon.com/images/I/71TPda7cwUL._AC_SL1500_.jpg', features: ['Puce M3', '13.6" Liquid Retina'], cashback: 64999 },
    { title: 'Samsung Galaxy S24 Ultra', price: 1199.99, image: 'https://m.media-amazon.com/images/I/71WRwAq3eZL._AC_SL1500_.jpg', features: ['Écran 6.8" Dynamic AMOLED', 'S Pen inclus'], cashback: 59999 },
    { title: 'Sony WH-1000XM5', price: 349.99, image: 'https://m.media-amazon.com/images/I/61vFO3TymfL._AC_SL1500_.jpg', features: ['Réduction bruit premium', '30h autonomie'], cashback: 17499 },
    { title: 'PlayStation 5 Slim', price: 449.99, image: 'https://m.media-amazon.com/images/I/51JLJbY+nIL._AC_SL1500_.jpg', features: ['Console nouvelle génération', '1TB SSD'], cashback: 22499 },
    { title: 'iPad Pro M4 11 pouces', price: 999.99, image: 'https://m.media-amazon.com/images/I/71yz-lYLBGL._AC_SL1500_.jpg', features: ['Puce M4', 'Écran OLED'], cashback: 49999 },
    { title: 'Logitech MX Master 3S', price: 109.99, image: 'https://m.media-amazon.com/images/I/61ni3t1ryQL._AC_SL1500_.jpg', features: ['8000 DPI', 'Silence Click'], cashback: 5499 },
    { title: 'Apple iPhone 15 Pro Max', price: 1479.99, image: 'https://m.media-amazon.com/images/I/81Os1SDaLzL._AC_SL1500_.jpg', features: ['Puce A17 Pro', 'Titane grade 5'], cashback: 73999 },
  ],
  gaming: [
    { title: 'Xbox Series X', price: 499.99, image: 'https://m.media-amazon.com/images/I/61tFVIgRGIL._AC_SL1500_.jpg', features: ['4K Gaming', '1TB SSD NVMe'], cashback: 24999 },
    { title: 'Nintendo Switch OLED', price: 349.99, image: 'https://m.media-amazon.com/images/I/61jj3KPANFL._AC_SL1500_.jpg', features: ['Écran OLED 7"', 'Station améliorée'], cashback: 17499 },
    { title: 'PlayStation 5 Slim', price: 449.99, image: 'https://m.media-amazon.com/images/I/51JLJbY+nIL._AC_SL1500_.jpg', features: ['Console nouvelle génération', '1TB SSD'], cashback: 22499 },
    { title: 'Meta Quest 3', price: 549.99, image: 'https://m.media-amazon.com/images/I/61FRpKSBCYL._AC_SL1500_.jpg', features: ['Mixed Reality', 'Snapdragon XR2 Gen 2'], cashback: 27499 },
    { title: 'Razer DeathAdder V3', price: 89.99, image: 'https://m.media-amazon.com/images/I/51Lq7BEo7bL._AC_SL1500_.jpg', features: ['Focus Pro 30K DPI', 'Ultra léger 59g'], cashback: 4499 },
    { title: 'SteelSeries Arctis Nova Pro', price: 299.99, image: 'https://m.media-amazon.com/images/I/71oiILdJiHL._AC_SL1500_.jpg', features: ['ANC IA', 'Multi-system connect'], cashback: 14999 },
    { title: 'Logitech G Pro X Superlight 2', price: 159.99, image: 'https://m.media-amazon.com/images/I/51KiGRbLYkL._AC_SL1500_.jpg', features: ['Sans fil 32h', 'HERO 2 25K sensor'], cashback: 7999 },
    { title: 'ASUS ROG Ally portable gaming', price: 699.99, image: 'https://m.media-amazon.com/images/I/61UrPSAX0PL._AC_SL1500_.jpg', features: ['Ryzen Z1 Extreme', '7" FHD 120Hz'], cashback: 34999 },
  ],
  audio: [
    { title: 'Bose QuietComfort 45', price: 279.99, image: 'https://m.media-amazon.com/images/I/61MWJQG5kVL._AC_SL1500_.jpg', features: ['ANC de référence', '24h autonomie'], cashback: 13999 },
    { title: 'JBL Charge 5', price: 179.99, image: 'https://m.media-amazon.com/images/I/71K7FiRrxAL._AC_SL1500_.jpg', features: ['Waterproof IP67', '20h autonomie'], cashback: 8999 },
    { title: 'Sony WH-1000XM5', price: 349.99, image: 'https://m.media-amazon.com/images/I/61vFO3TymfL._AC_SL1500_.jpg', features: ['Réduction bruit premium', '30h autonomie'], cashback: 17499 },
    { title: 'Sonos Era 300', price: 449.99, image: 'https://m.media-amazon.com/images/I/71S3tQHqjQL._AC_SL1500_.jpg', features: ['Dolby Atmos', 'Spatial Audio'], cashback: 22499 },
    { title: 'Marshall Stanmore III', price: 379.99, image: 'https://m.media-amazon.com/images/I/61oUKCJZ-HL._AC_SL1500_.jpg', features: ['Bluetooth 5.2', 'Son légendaire'], cashback: 18999 },
    { title: 'Apple AirPods Pro 2', price: 279.99, image: 'https://m.media-amazon.com/images/I/61SUj2aKoEL._AC_SL1500_.jpg', features: ['ANC adaptatif', 'Audio spatial'], cashback: 13999 },
    { title: 'Sony SRS-XB43', price: 199.99, image: 'https://m.media-amazon.com/images/I/71bIzMzFPVL._AC_SL1500_.jpg', features: ['Extra Bass', '24h IP67'], cashback: 9999 },
    { title: 'Jabra Evolve2 75', price: 349.99, image: 'https://m.media-amazon.com/images/I/61xz3tOqPJL._AC_SL1500_.jpg', features: ['ANC pro', 'Certifié Teams'], cashback: 17499 },
  ],
  smartphones: [
    { title: 'iPhone 15 Pro Max', price: 1479.99, image: 'https://m.media-amazon.com/images/I/81Os1SDaLzL._AC_SL1500_.jpg', features: ['Puce A17 Pro', 'Titane grade 5'], cashback: 73999 },
    { title: 'Samsung Galaxy S24 Ultra', price: 1199.99, image: 'https://m.media-amazon.com/images/I/71WRwAq3eZL._AC_SL1500_.jpg', features: ['S Pen inclus', '200MP camera'], cashback: 59999 },
    { title: 'Google Pixel 8 Pro', price: 1099.99, image: 'https://m.media-amazon.com/images/I/71p4LX6RNPL._AC_SL1500_.jpg', features: ['Google AI', 'Camera 50MP'], cashback: 54999 },
    { title: 'OnePlus 12', price: 899.99, image: 'https://m.media-amazon.com/images/I/61h3vMKAHQL._AC_SL1500_.jpg', features: ['Snapdragon 8 Gen 3', '100W charge'], cashback: 44999 },
    { title: 'Samsung Galaxy A55', price: 449.99, image: 'https://m.media-amazon.com/images/I/71fvX5BFAVL._AC_SL1500_.jpg', features: ['AMOLED 120Hz', 'IP67'], cashback: 22499 },
    { title: 'Nothing Phone 2', price: 649.99, image: 'https://m.media-amazon.com/images/I/71mYfXDtQHL._AC_SL1500_.jpg', features: ['Glyph Interface', 'Snapdragon 8+'], cashback: 32499 },
    { title: 'Xiaomi 14 Ultra', price: 1299.99, image: 'https://m.media-amazon.com/images/I/61O-VmWLrUL._AC_SL1500_.jpg', features: ['Leica Optics', '90W charge'], cashback: 64999 },
    { title: 'Samsung Galaxy Z Flip 5', price: 999.99, image: 'https://m.media-amazon.com/images/I/71G2PZXQF7L._AC_SL1500_.jpg', features: ['Pliable compact', 'Flex Window'], cashback: 49999 },
  ],
  tablettes: [
    { title: 'Samsung Galaxy Tab S9 Ultra', price: 1199.99, image: 'https://m.media-amazon.com/images/I/81OAqFaSBFL._AC_SL1500_.jpg', features: ['14.6" AMOLED', 'S Pen inclus'], cashback: 59999 },
    { title: 'iPad Pro M4 11 pouces', price: 999.99, image: 'https://m.media-amazon.com/images/I/71yz-lYLBGL._AC_SL1500_.jpg', features: ['Puce M4', 'Écran OLED'], cashback: 49999 },
    { title: 'Microsoft Surface Pro 9', price: 1299.99, image: 'https://m.media-amazon.com/images/I/61rDqq1QKDL._AC_SL1500_.jpg', features: ['Intel i5 Gen 12', 'Windows 11'], cashback: 64999 },
    { title: 'Amazon Fire HD 10', price: 149.99, image: 'https://m.media-amazon.com/images/I/71C1mRQhNFL._AC_SL1500_.jpg', features: ['10.1" Full HD', 'Alexa intégré'], cashback: 7499 },
    { title: 'Xiaomi Pad 6', price: 399.99, image: 'https://m.media-amazon.com/images/I/61lZGBTAuXL._AC_SL1500_.jpg', features: ['Snapdragon 870', '144Hz'], cashback: 19999 },
    { title: 'Lenovo Tab P12 Pro', price: 699.99, image: 'https://m.media-amazon.com/images/I/71tSV0XGKBL._AC_SL1500_.jpg', features: ['AMOLED 12.6"', 'Stylet inclus'], cashback: 34999 },
  ],
  montres: [
    { title: 'Apple Watch Series 9', price: 449.99, image: 'https://m.media-amazon.com/images/I/71FMfUfJsFL._AC_SL1500_.jpg', features: ['Puce S9', 'Double Tap'], cashback: 22499 },
    { title: 'Samsung Galaxy Watch 6 Classic', price: 399.99, image: 'https://m.media-amazon.com/images/I/61VJ0PVMIZL._AC_SL1500_.jpg', features: ['Lunette rotative', 'ECG'], cashback: 19999 },
    { title: 'Garmin Fenix 7', price: 699.99, image: 'https://m.media-amazon.com/images/I/71GJrNVAlRL._AC_SL1500_.jpg', features: ['GPS multi-bandes', '18j autonomie'], cashback: 34999 },
    { title: 'Fitbit Charge 6', price: 159.99, image: 'https://m.media-amazon.com/images/I/61f5AsW0qCL._AC_SL1500_.jpg', features: ['Google Maps', 'ECG + SpO2'], cashback: 7999 },
    { title: 'Withings ScanWatch 2', price: 349.99, image: 'https://m.media-amazon.com/images/I/61TK2t2AvVL._AC_SL1500_.jpg', features: ['Hybride médical', 'ECG + SpO2'], cashback: 17499 },
    { title: 'Polar Vantage V3', price: 599.99, image: 'https://m.media-amazon.com/images/I/71YDmfVRjWL._AC_SL1500_.jpg', features: ['AMOLED', 'GPS + ECG'], cashback: 29999 },
  ],
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const keywords = searchParams.get('keywords') || 'tech populaire'
  const max = parseInt(searchParams.get('max') || '6')

  const kw = keywords.toLowerCase()
  let category = 'tech'
  if (kw.includes('gaming') || kw.includes('jeu')) category = 'gaming'
  else if (kw.includes('audio') || kw.includes('musique') || kw.includes('son')) category = 'audio'
  else if (kw.includes('smartphone') || kw.includes('téléphone')) category = 'smartphones'
  else if (kw.includes('tablette') || kw.includes('tablet') || kw.includes('ipad')) category = 'tablettes'
  else if (kw.includes('montre') || kw.includes('watch')) category = 'montres'

  const pool = ALL_PRODUCTS[category] || ALL_PRODUCTS.tech
  const shuffled = [...pool]
    .sort(() => Math.random() - 0.5)
    .slice(0, max)
    .map(p => ({ ...p, url: beLink(p.title) }))

  return NextResponse.json({
    success: true,
    category,
    deals: shuffled,
    count: shuffled.length,
    updatedAt: new Date().toISOString(),
  }, { headers: { 'Cache-Control': 'no-store, max-age=0' } })
}
