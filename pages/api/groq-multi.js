export const config = { api: { bodyParser: true } };

export default async function handler(req, res) {
  const { msg } = req.body || {};
  
  // DEBUG COMPLET
  const debug = {
    hasKey: !!process.env.GROQ_API_KEY,
    keyPreview: process.env.GROQ_API_KEY ? process.env.GROQ_API_KEY.slice(0,10)+'...' : 'MISSING',
    msgReceived: msg,
    timestamp: new Date().toISOString()
  };
  
  if (!process.env.GROQ_API_KEY) {
    return res.json({ error: 'GROQ_API_KEY MISSING', debug });
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
    res.json({ success: true, data: data.choices[0].message.content, debug });
  } catch (error) {
    res.status(500).json({ error: error.message, debug });
  }
}
