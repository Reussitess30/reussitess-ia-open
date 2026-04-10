/* © Reussitess®971 INPI DSO2026012614 PORINUS Rony 2026 */
import { useState, useEffect } from 'react'
import Head from 'next/head'

export default function ReussLive() {
  const [data, setData] = useState(null)
  const [wallet, setWallet] = useState('')
  const [walletData, setWalletData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdate, setLastUpdate] = useState(null)
  const CONTRACT = '0xB37531727fC07c6EED4f97F852A115B428046EB2'

  const fetchData = async () => {
    try {
      const r = await fetch('/api/reuss-dashboard')
      const d = await r.json()
      if (d.error) setError(d.error)
      else { setData(d); setLastUpdate(new Date().toLocaleTimeString()) }
    } catch(e) { setError(e.message) }
    finally { setLoading(false) }
  }

  const checkWallet = async () => {
    if (!wallet.match(/^0x[a-fA-F0-9]{40}$/)) return alert('Adresse Polygon invalide !')
    try {
      const alchemyKey = process.env.NEXT_PUBLIC_ALCHEMY_KEY
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

  const Card = ({ label, value, color = '#FFD700' }) => (
    <div style={{ background: '#111', border: `1px solid ${color}`, borderRadius: '12px', padding: '1rem', textAlign: 'center' }}>
      <div style={{ color: '#888', fontSize: '0.8rem', marginBottom: '0.3rem' }}>{label}</div>
      <div style={{ color, fontWeight: 'bold', fontSize: '1.1rem' }}>{value}</div>
    </div>
  )

  const maxVol = data ? Math.max(...data.history.map(h => h[1].volume), 1) : 1

  return (
    <>
      <Head><title>REUSS Token Live — REUSSITESS®971</title></Head>
      <div style={{ background: '#0a0a0a', minHeight: '100vh', color: '#fff', fontFamily: "'Courier New', monospace", padding: '1.5rem' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ color: '#FFD700', fontSize: '1.8rem', margin: 0 }}>💎 REUSS Token — Dashboard Live</h1>
          <p style={{ color: '#888', margin: '0.3rem 0', fontSize: '0.85rem' }}>
            Polygon Mainnet • {lastUpdate ? `Mis à jour: ${lastUpdate}` : 'Connexion...'} • Auto-refresh 30s
          </p>
          <a href={`https://polygonscan.com/token/${CONTRACT}`} target="_blank" rel="noreferrer"
            style={{ color: '#a78bfa', fontSize: '0.8rem' }}>🔍 Voir sur PolygonScan</a>
        </div>

        {loading && <p style={{ textAlign: 'center', color: '#FFD700', fontSize: '1.2rem' }}>⏳ Connexion blockchain Polygon...</p>}
        {error && <p style={{ textAlign: 'center', color: '#ff4444' }}>❌ Erreur: {error}</p>}

        {data && (
          <>
            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', maxWidth: '900px', margin: '0 auto 2rem' }}>
              <Card label="📛 Token" value={data.name} />
              <Card label="🔤 Symbole" value={'$' + data.symbol} />
              <Card label="💰 Prix" value={data.price ? `$${data.price}` : 'N/A'} color="#4CAF50" />
              <Card label="📊 Supply Total" value={Number(data.supplyTotal).toLocaleString()} />
              <Card label="🔄 Supply Circ." value={Number(data.supplyCirc).toLocaleString()} color="#60a5fa" />
              <Card label="👥 Adresses" value={data.uniqueAddresses + '+'} color="#f59e0b" />
            </div>

            {/* Contrat */}
            <div style={{ background: '#111', border: '1px solid #333', borderRadius: '12px', padding: '0.75rem', maxWidth: '900px', margin: '0 auto 2rem', textAlign: 'center', fontSize: '0.8rem' }}>
              🔗 <span style={{ color: '#888' }}>Contrat : </span>
              <span style={{ color: '#a78bfa' }}>{CONTRACT}</span>
            </div>

            {/* Graphique historique */}
            {data.history.length > 0 && (
              <div style={{ background: '#111', border: '1px solid #333', borderRadius: '12px', padding: '1.5rem', maxWidth: '900px', margin: '0 auto 2rem' }}>
                <h2 style={{ color: '#FFD700', margin: '0 0 1rem' }}>📉 Volume Transferts (7 derniers jours)</h2>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '100px' }}>
                  {data.history.slice(-7).map(([date, stats], i) => (
                    <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                      <div style={{ width: '100%', background: '#FFD700', borderRadius: '4px 4px 0 0', height: `${Math.max((stats.volume / maxVol) * 80, 4)}px`, opacity: 0.8 }} title={`${stats.volume.toFixed(2)} REUSS`} />
                      <div style={{ color: '#888', fontSize: '0.6rem', transform: 'rotate(-45deg)', whiteSpace: 'nowrap' }}>{date.substring(5)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Transferts */}
            <div style={{ maxWidth: '900px', margin: '0 auto 2rem' }}>
              <h2 style={{ color: '#FFD700', marginBottom: '1rem' }}>📈 20 Derniers Transferts</h2>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                  <thead>
                    <tr style={{ background: '#1a1a1a' }}>
                      {['De', 'Vers', 'Montant REUSS', 'Date', 'TX'].map(h => (
                        <th key={h} style={{ padding: '0.75rem', textAlign: 'left', color: '#FFD700', borderBottom: '1px solid #333' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.transfers.map((t, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #1a1a1a', background: i % 2 === 0 ? '#0d0d0d' : '#111' }}>
                        <td style={{ padding: '0.6rem', color: '#a78bfa' }}>{t.from.substring(0,8)}...</td>
                        <td style={{ padding: '0.6rem', color: '#4CAF50' }}>{t.to.substring(0,8)}...</td>
                        <td style={{ padding: '0.6rem', color: '#FFD700', fontWeight: 'bold' }}>{t.value}</td>
                        <td style={{ padding: '0.6rem', color: '#888', fontSize: '0.75rem' }}>{t.time ? t.time.substring(0,10) : 'N/A'}</td>
                        <td style={{ padding: '0.6rem' }}>
                          <a href={`https://polygonscan.com/tx/${t.hash}`} target="_blank" rel="noreferrer"
                            style={{ color: '#60a5fa', textDecoration: 'none' }}>🔗</a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Top Holders */}
        {data && data.topHolders && data.topHolders.length > 0 && (
          <div style={{ maxWidth: '900px', margin: '0 auto 2rem', background: '#111', border: '1px solid #f59e0b', borderRadius: '12px', padding: '1.5rem' }}>
            <h2 style={{ color: '#f59e0b', margin: '0 0 1rem' }}>🏆 Top Holders REUSS</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ background: '#1a1a1a' }}>
                  {['#', 'Adresse', 'Solde REUSS', '% Supply'].map(h => (
                    <th key={h} style={{ padding: '0.6rem', textAlign: 'left', color: '#f59e0b', borderBottom: '1px solid #333' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.topHolders.map((h, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #1a1a1a' }}>
                    <td style={{ padding: '0.6rem', color: '#f59e0b', fontWeight: 'bold' }}>#{i+1}</td>
                    <td style={{ padding: '0.6rem' }}>
                      <a href={`https://polygonscan.com/address/${h.address}`} target="_blank" rel="noreferrer"
                        style={{ color: '#a78bfa' }}>{h.address.substring(0,10)}...{h.address.slice(-6)}</a>
                    </td>
                    <td style={{ padding: '0.6rem', color: '#FFD700', fontWeight: 'bold' }}>{h.balance.toLocaleString(undefined, {maximumFractionDigits: 2})}</td>
                    <td style={{ padding: '0.6rem', color: '#4CAF50' }}>{((h.balance / 999999999) * 100).toFixed(6)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Wallet Checker */}
        <div style={{ maxWidth: '900px', margin: '0 auto 2rem', background: '#111', border: '1px solid #FFD700', borderRadius: '12px', padding: '1.5rem' }}>
          <h2 style={{ color: '#FFD700', margin: '0 0 1rem' }}>👛 Vérifier mon Solde REUSS</h2>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <input value={wallet} onChange={e => setWallet(e.target.value)}
              placeholder="0x... (votre adresse Polygon)"
              style={{ flex: 1, minWidth: '250px', padding: '0.75rem', borderRadius: '8px', background: '#222', color: '#fff', border: '1px solid #FFD700', fontFamily: 'monospace' }} />
            <button onClick={checkWallet}
              style={{ padding: '0.75rem 1.5rem', background: '#FFD700', color: '#000', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', border: 'none' }}>
              Vérifier 🔍
            </button>
          </div>
          {walletData && (
            <div style={{ background: '#0a0a0a', border: '1px solid #4CAF50', borderRadius: '8px', padding: '1rem', marginTop: '1rem', whiteSpace: 'pre-wrap', color: '#4CAF50', fontSize: '0.9rem' }}>
              {walletData}
            </div>
          )}
        </div>

        {/* Webhook info */}
        <div style={{ maxWidth: '900px', margin: '0 auto 2rem', background: '#111', border: '1px solid #a78bfa', borderRadius: '12px', padding: '1.5rem' }}>
          <h2 style={{ color: '#a78bfa', margin: '0 0 0.5rem' }}>🔔 Alertes Automatiques</h2>
          <p style={{ color: '#888', margin: 0, fontSize: '0.85rem' }}>
            Webhook actif sur <span style={{ color: '#a78bfa' }}>https://reussitess.fr/api/reuss-webhook</span><br/>
            Configure dans Alchemy Notify → Transferts REUSS {'>'} 1000 → alerte Telegram instantanée
          </p>
        </div>

        <p style={{ textAlign: 'center', color: '#FFD700', marginTop: '2rem' }}>
          Boudoum ! 🇬🇵 — <a href="/" style={{ color: '#a78bfa' }}>REUSSITESS®971</a>
        </p>
      </div>
    </>
  )
}
