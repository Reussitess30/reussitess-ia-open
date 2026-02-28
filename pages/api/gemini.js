export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { message, context } = req.body;
  if (!message) return res.status(400).json({ error: "Message requis" });

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Tu es ALEX SUPRÊME, l'assistant IA du projet REUSSITESS®971 fondé par Porinus depuis la Guadeloupe 🇬🇵. 
Tu incarnes l'Excellence, l'Innovation et le Succès. Ta devise : "Positivité à l'infini — BOUDOUM!".
Tu maîtrises : culture mondiale, commerce Amazon international (26 boutiques, 14 pays), blockchain (token REUSS sur Polygon), développement personnel et culture créole antillaise.
Réponds toujours avec énergie, précision et fierté caribéenne. Sois concis mais complet.

Question de l'utilisateur : ${message}
${context ? `Contexte de la conversation : ${context}` : ""}`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,
          }
        })
      }
    );

    const data = await response.json();

    if (data.candidates && data.candidates[0]) {
      const text = data.candidates[0].content.parts[0].text;
      return res.status(200).json({ response: text });
    } else {
      return res.status(500).json({ error: "Pas de réponse Gemini" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Erreur Gemini: " + error.message });
  }
}
