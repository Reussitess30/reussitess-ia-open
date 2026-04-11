// pages/api/groq-multi.js
export default async function handler(req, res) {
  const { msg } = req.body;
  
  const [parse, rag, generate] = await Promise.all([
    fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${process.env.GROQ_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'llama3-8b-8192', messages: [{role:'user',content:`Parse intent: ${msg}`}] })
    }).then(r=>r.json()),
    // RAG redis (existant)
    redis.get(`rag:${msg.toLowerCase().slice(0,8)}`),
    fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${process.env.GROQ_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'llama3-8b-8192', messages: [{role:'user',content:`Réponse Guadeloupe 971: ${msg}`}] })
    }).then(r=>r.json())
  ]);
  
  res.json({ response: generate.choices[0].message.content });
}
