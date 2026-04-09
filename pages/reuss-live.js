import { useState, useEffect } from 'react'
import Head from 'next/head'

export default function ReussLive() {
  const [data, setData] = useState(null)
  const [wallet, setWallet] = useState('')
  const [walletData, setWalletData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const CONTRACT = '0xB37531727fC07c6EED4f97F852A115B428046EB2'

  const fetchData = async () => {
    try {
      const r = await fetch('/api/reuss-dashboard')
      const d = await r.json()
      if (d.error) setError(d.error)
      else setData(d)
    } catch(e) { setError(e.message) }
    finally { setLoading(false) }
  }

  const checkWallet = async () => {
    if (!wallet.match(/^0x[a-fA-F0-9]{40}$/)) return alert('Adresse Polygon invalide !')
    try {
      const alchemyKey = await fetch('/api/reuss-dashboard').then(r => r.json()).then(d => d._key).catch(() => null)
      const r = await fetch('/api/superbot/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: wallet })
      })
      const d = await r.json()
      setWalletData(d.response)
    } catch(e) { setWalletData('Erreur: ' + e.message) }
  }

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <Head><title>REUSS Token Live — REUSSITESS®971</title></Head>
      <div style={{ background: '#0a0a0a', minHeight: '100vh', color: '#fff', fontFamily: "'Courier New', monospace", padding: '2rem' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ color: '#FFD700', fontSize: '2rem', margin: 0 }}>💎 REUSS Token — Live</h1>
          <p style={{ color: '#888', margin: '0.5rem 0' }}>Polygon Mainnet • Auto-refresh 30s</p>
          <a href={`https://polygonscan.com/token/${CONTRACT}`} target="_blank" rel="noreferrer"
            style={{ color: '#a78bfa', fontSize: '0.8rem' }}>🔍 PolygonScan</a>
        </div>

        {loading && <p style={{ textAlign: 'center', color: '#FFD700' }}>⏳ Connexion blockchain...</p>}
        {error && <p style={{ textAlign: 'center', color: '#ff4444' }}>❌ {error}</p>}

        {data && (
          <>
            {/* Token Info */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', maxWidth: '800px', margin: '0 auto 2rem' }}>
              {[
                { label: '📛 Nom', value: data.name },
                { label: '🔤 Symbole', value: '$' + data.symbol },
                { label: '📊 Décimales', value: data.decimals },
                { label: '⛓️ Réseau', value: 'Polygon' },
              ].map((item, i) => (
                <div key={i} style={{ background: '#111', border: '1px solid #FFD700', borderRadius: '12px', padding: '1rem', textAlign: 'center' }}>
                  <div style={{ color: '#888', fontSize: '0.85rem' }}>{item.label}</div>
                  <div style={{ color: '#FFD700', fontWeight: 'bold', fontSize: '1.1rem', marginTop: '0.3rem' }}>{item.value}</div>
                </div>
              ))}
            </div>

            {/* Contrat */}
            <div style={{ background: '#111', border: '1px solid #333', borderRadius: '12px', padding: '1rem', maxWidth: '800px', margin: '0 auto 2rem', textAlign: 'center' }}>
              <span style={{ color: '#888', fontSize: '0.85rem' }}>🔗 Contrat : </span>
              <span style={{ color: '#a78bfa', fontSize: '0.85rem' }}>{CONTRACT}</span>
            </div>

            {/* Transferts */}
            <div style={{ maxWidth: '800px', margin: '0 auto 2rem' }}>
              <h2 style={{ color: '#FFD700', marginBottom: '1rem' }}>📈 Derniers Transferts REUSS</h2>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ background: '#222' }}>
                      {['De', 'Vers', 'Montant', 'TX'].map(h => (
                        <th key={h} style={{ padding: '0.75rem', textAlign: 'left', color: '#FFD700', borderBottom: '1px solid #333' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.transfers.map((t, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #1a1a1a' }}>
                        <td style={{ padding: '0.75rem', color: '#a78bfa' }}>{t.from.substring(0,8)}...</td>
                        <td style={{ padding: '0.75rem', color: '#4CAF50' }}>{t.to.substring(0,8)}...</td>
                        <td style={{ padding: '0.75rem', color: '#FFD700', fontWeight: 'bold' }}>{t.value} REUSS</td>
                        <td style={{ padding: '0.75rem' }}>
                          <a href={`https://polygonscan.com/tx/${t.hash}`} target="_blank" rel="noreferrer"
                            style={{ color: '#60a5fa', textDecoration: 'none' }}>🔗 voir</a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Wallet Checker */}
        <div style={{ maxWidth: '800px', margin: '0 auto 2rem' }}>
          <h2 style={{ color: '#FFD700' }}>👛 Vérifier mon Solde REUSS</h2>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <input value={wallet} onChange={e => setWallet(e.target.value)}
              placeholder="0x... (adresse Polygon)"
              style={{ flex: 1, minWidth: '250px', padding: '0.75rem', borderRadius: '8px', background: '#222', color: '#fff', border: '1px solid #FFD700' }} />
            <button onClick={checkWallet}
              style={{ padding: '0.75rem 1.5rem', background: '#FFD700', color: '#000', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', border: 'none' }}>
              Vérifier
            </button>
          </div>
          {walletData && (
            <div style={{ background: '#111', border: '1px solid #4CAF50', borderRadius: '12px', padding: '1.5rem', marginTop: '1rem', whiteSpace: 'pre-wrap', color: '#4CAF50' }}>
              {walletData}
            </div>
          )}
        </div>

        <p style={{ textAlign: 'center', color: '#FFD700', marginTop: '3rem' }}>Boudoum ! 🇬🇵 REUSSITESS®971</p>
      </div>
    </>
  )
}
