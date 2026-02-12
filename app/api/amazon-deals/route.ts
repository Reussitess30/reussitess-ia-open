import { NextResponse } from 'next/server'

/**
 * API Route : /api/amazon-deals
 * VERSION DEBUG - Pour identifier le problème
 */
export async function GET(request: Request) {
  console.log('🔍 API Amazon appelée')
  
  try {
    const { searchParams } = new URL(request.url)
    const keywords = searchParams.get('keywords') || 'tech'
    
    console.log('📝 Keywords:', keywords)
    console.log('🔑 AMAZON_ASSOCIATE_TAG:', process.env.AMAZON_ASSOCIATE_TAG)
    console.log('🔑 AMAZON_ACCESS_KEY:', process.env.AMAZON_ACCESS_KEY ? 'PRÉSENT' : 'MANQUANT')
    console.log('🔑 AMAZON_SECRET_KEY:', process.env.AMAZON_SECRET_KEY ? 'PRÉSENT' : 'MANQUANT')

    // Pour l'instant, TOUJOURS retourner des produits de démo
    // même si credentials présents
    const demoDeals = [
      {
        asin: 'B08N5WRWNW',
        title: 'Apple AirPods Pro (2ème génération)',
        price: 279.99,
        currency: 'EUR',
        image: 'https://m.media-amazon.com/images/I/61SUj2aKoEL._AC_SL1500_.jpg',
        features: ['Réduction active du bruit', 'Audio spatial'],
        cashback: 13999
      },
      {
        asin: 'B0BSHF7WHW',
        title: 'Samsung Galaxy S24 Ultra',
        price: 1199.99,
        currency: 'EUR',
        image: 'https://m.media-amazon.com/images/I/71WRwAq3eZL._AC_SL1500_.jpg',
        features: ['Écran 6.8" Dynamic AMOLED', 'S Pen inclus'],
        cashback: 59999
      },
      {
        asin: 'B0CX23V2ZK',
        title: 'Apple MacBook Air M3',
        price: 1299.99,
        currency: 'EUR',
        image: 'https://m.media-amazon.com/images/I/71TPda7cwUL._AC_SL1500_.jpg',
        features: ['Puce M3', '13.6" Liquid Retina'],
        cashback: 64999
      },
      {
        asin: 'B0CHX3TW5M',
        title: 'Sony WH-1000XM5',
        price: 349.99,
        currency: 'EUR',
        image: 'https://m.media-amazon.com/images/I/61vFO3TymfL._AC_SL1500_.jpg',
        features: ['Réduction bruit premium', '30h autonomie'],
        cashback: 17499
      },
      {
        asin: 'B0CDWSFJF8',
        title: 'PlayStation 5 Slim',
        price: 449.99,
        currency: 'EUR',
        image: 'https://m.media-amazon.com/images/I/51JLJbY+nIL._AC_SL1500_.jpg',
        features: ['Console nouvelle génération', '1TB SSD'],
        cashback: 22499
      },
      {
        asin: 'B0D1XD1ZV3',
        title: 'iPad Pro M4 11"',
        price: 999.99,
        currency: 'EUR',
        image: 'https://m.media-amazon.com/images/I/71yz-lYLBGL._AC_SL1500_.jpg',
        features: ['Puce M4', 'Écran OLED'],
        cashback: 49999
      }
    ]

    console.log('✅ Retour de', demoDeals.length, 'produits')

    return NextResponse.json({
      success: true,
      demo: true,
      deals: demoDeals,
      count: demoDeals.length,
      debug: {
        keywords: keywords,
        hasCredentials: !!(process.env.AMAZON_ACCESS_KEY && process.env.AMAZON_SECRET_KEY),
        timestamp: new Date().toISOString()
      }
    })

  } catch (error: any) {
    console.error('❌ ERREUR API:', error)
    
    return NextResponse.json({
      success: false,
      error: error.message,
      deals: [],
      debug: {
        errorStack: error.stack
      }
    }, { status: 500 })
  }
}
