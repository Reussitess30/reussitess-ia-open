// ===== REUSSITESS — SERVICE IA =====

export async function groqCall(messages, maxTokens = 512) {
  const keys = [process.env.GROQ_API_KEY, process.env.GROQ_API_KEY_2, process.env.GROQ_API_KEY_3].filter(Boolean)
  for (const key of keys) {
    try {
      const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
        body: JSON.stringify({ model: 'llama-3.3-70b-versatile', messages, max_tokens: maxTokens, temperature: 0.7 }),
        signal: AbortSignal.timeout(8000)
      })
      const d = await r.json()
      if (d.choices?.[0]?.message?.content) return d.choices[0].message.content
    } catch(e) { continue }
  }
  try {
    const r = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}` },
      body: JSON.stringify({ model: 'meta-llama/llama-3.3-70b-instruct', messages, max_tokens: maxTokens }),
      signal: AbortSignal.timeout(8000)
    })
    const d = await r.json()
    if (d.choices?.[0]?.message?.content) return d.choices[0].message.content
  } catch(e) {}
  return null
}

export function rerankKnowledge(query, commands) {
  const q = query.toLowerCase()
  return commands.map(cmd => {
    const trigger = (cmd.trigger || '').toLowerCase()
    let score = 0
    if (q === trigger) score += 100
    if (q.includes(trigger)) score += 50
    if (trigger.includes(q)) score += 40
    q.split(' ').forEach(w => { if (trigger.includes(w) && w.length > 3) score += 10 })
    score += trigger.length * 0.5
    return { cmd, score }
  }).filter(x => x.score > 0).sort((a, b) => b.score - a.score)
}
