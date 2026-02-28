export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { message, context } = req.body;
  if (!message) return res.status(400).json({ error: "Message requis" });

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: `Tu es l'assistant IA du projet REUSSITESS®971 fondé par Porinus depuis la Guadeloupe 🇬🇵. Tu incarnes l'Excellence, l'Innovation et le Succès. Ta devise : "Positivité à l'infini — BOUDOUM!". Tu maîtrises : culture mondiale, commerce Amazon (26 boutiques, 14 pays), blockchain (token REUSS sur Polygon), développement personnel et culture créole antillaise. Réponds toujours avec énergie et fierté caribéenne.`
          },
          {
            role: "user",
            content: context ? `${context}\n\n${message}` : message
          }
        ],
        max_tokens: 1024,
        temperature: 0.7
      })
    });

    const data = await response.json();
    if (data.choices && data.choices[0]) {
      return res.status(200).json({ response: data.choices[0].message.content });
    }
    return res.status(500).json({ error: "Pas de réponse Groq" });
  } catch (error) {
    return res.status(500).json({ error: "Erreur: " + error.message });
  }
}
