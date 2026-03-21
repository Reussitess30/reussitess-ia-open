export default async function handler(req, res) {
  try {
    const response = await fetch('https://zenquotes.io/api/random')
    const data = await response.json()
    res.status(200).json({ text: data[0].q, author: data[0].a })
  } catch {
    res.status(200).json({ text: "La réussite appartient à ceux qui osent.", author: "REUSSITESS®971" })
  }
}
