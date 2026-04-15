import { useState } from 'react'

export default function TelegramDashboard() {
  const [data, setData] = useState(null)
  const [pwd, setPwd] = useState('')
  const [auth, setAuth] = useState(false)
  const [error, setError] = useState('')

  async function login() {
    const res = await fetch(`/api/admin/telegram-dashboard?pwd=${pwd}`)
    if (res.ok) {
      setData(await res.json())
      setAuth(true)
    } else {
      setError('❌ Mot de passe incorrect')
    }
  }

  if (!auth) return (
    <div style={{ minHeight:'100vh', background:'#0a0a0a', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'monospace' }}>
      <div style={{ background:'#111', padding:'40px', borderRadius:'12px', border:'1px solid #333', textAlign:'center', width:'300px' }}>
        <div style={{ fontSize:'2rem', marginBottom:'10px' }}>🇬🇵</div>
        <h2 style={{ color:'#fff', marginBottom:'20px' }}>Admin REUSSITESS</h2>
        <input
          type="password"
          placeholder="Mot de passe"
          value={pwd}
          onChange={e => setPwd(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && login()}
          style={{ width:'100%', padding:'10px', borderRadius:'8px', border:'1px solid #444', background:'#222', color:'#fff', marginBottom:'10px', boxSizing:'border-box' }}
        />
        <button onClick={login} style={{ width:'100%', padding:'10px', background:'#00c853', border:'none', borderRadius:'8px', color:'#fff', fontWeight:'bold', cursor:'pointer' }}>
          Connexion
        </button>
        {error && <p style={{ color:'#ff4444', marginTop:'10px' }}>{error}</p>}
      </div>
    </div>
  )

  return (
    <div style={{ minHeight:'100vh', background:'#0a0a0a', color:'#fff', fontFamily:'monospace', padding:'30px' }}>
      <h1 style={{ color:'#00c853' }}>📊 Dashboard Telegram REUSSITESS 🇬🇵</h1>
      <div style={{ display:'flex', gap:'20px', marginBottom:'30px', flexWrap:'wrap' }}>
        {[
          { label:'👥 Visiteurs total', value: data?.stats?.visitors },
          { label:'📨 Requêtes today', value: data?.stats?.requestsToday },
          { label:'📱 Users Telegram', value: data?.stats?.telegramUsers }
        ].map((s, i) => (
          <div key={i} style={{ background:'#111', border:'1px solid #333', borderRadius:'10px', padding:'20px', minWidth:'160px' }}>
            <div style={{ color:'#888', fontSize:'0.8rem' }}>{s.label}</div>
            <div style={{ fontSize:'2rem', fontWeight:'bold', color:'#00c853' }}>{s.value ?? 0}</div>
          </div>
        ))}
      </div>
      <h2>📱 Users Telegram actifs</h2>
      {data?.users?.length === 0 ? (
        <p style={{ color:'#888' }}>Aucun user encore — normal si déploiement récent</p>
      ) : (
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr style={{ background:'#111', color:'#888' }}>
              <th style={{ padding:'10px', textAlign:'left' }}>ID</th>
              <th style={{ padding:'10px', textAlign:'left' }}>Messages</th>
              <th style={{ padding:'10px', textAlign:'left' }}>Topics</th>
              <th style={{ padding:'10px', textAlign:'left' }}>Dernière activité</th>
            </tr>
          </thead>
          <tbody>
            {data?.users?.map((u, i) => (
              <tr key={i} style={{ borderBottom:'1px solid #222' }}>
                <td style={{ padding:'10px', color:'#00c853' }}>🆔 {u.id}</td>
                <td style={{ padding:'10px' }}>{u.messages}</td>
                <td style={{ padding:'10px', color:'#888' }}>{u.topics.join(', ') || '—'}</td>
                <td style={{ padding:'10px', color:'#888' }}>{u.lastSeen || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
