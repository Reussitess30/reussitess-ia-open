export const config = { api: { bodyParser: true } };

export default async function handler(req, res) {
  const { msg } = req.body || {};
  
  if (!process.env.GROQ_API_KEY) {
    return res.json({ error: 'GROQ_API_KEY MISSING' });
  }
  
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [{ role: 'user', content: msg || 'test 971' }]
      })
    });

    const data = await response.json();
    
    // CHECK ERREUR GROQ
    if (data.error) {
      return res.status(400).json({ error: data.error.message });
    }
    
    res.json({ 
      success: true, 
      response: data.choices[0].message.content 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
