export const config = { api: { bodyParser: true } };

export default async function handler(req, res) {
  const { msg } = req.body || {};
  
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',  // ← NOUVEAU (remplace 8b-8192)
        messages: [{ role: 'user', content: `Réponse rapide GP 971: ${msg}` }]
      })
    });
    
    const data = await response.json();
    
    if (data.error) {
      return res.status(400).json(data.error);
    }
    
    res.json({
      success: true,
      response: data.choices[0].message.content
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
