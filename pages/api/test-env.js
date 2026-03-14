export default function handler(req, res) {
  res.json({
    ak: process.env.AMAZON_ACCESS_KEY ? process.env.AMAZON_ACCESS_KEY.substring(0,5)+'...' : 'VIDE',
    sk: process.env.AMAZON_SECRET_KEY ? 'OK' : 'VIDE',
    tag: process.env.AMAZON_ASSOCIATE_TAG || 'VIDE'
  })
}
