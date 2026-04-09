import { useState, useEffect } from 'react'
import Head from 'next/head'

export default function ReussLive() {
  const [data, setData] = useState(null)
  const [wallet, setWallet] = useState('')
  const [walletData, setWalletData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/superbot/chat', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'dashboard reuss' })
    }).then(r => r.json()).then(d => { setData(d.response); setLoading(false) })
    const interval = setInterval(() => {
      fetch('/api/superbot/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'dashboard reuss' })
      }).then(r => r.json()).then(d => setData(d.response))
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  const checkWallet = async () => {
    if (!wallet) return
    const r = await fetch('/api/superbot/chat', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: wallet })
    })
    const d = await r.json()
    setWalletData(d.response)
  }

  return (
    <>
      <Head><title>REUSS Token Live — REUSSITESS®971</title></Head>
      <div style={{ background: '#0a0a0a', minHeight: '100vh', color: '#fff', fontFamily: 'monospace', padding: '2rem' }}>
        <h1 style={{ color: '#FFD700', textAlign: 'center' }}>💎 REUSS Token — Dashboard Live</h1>
        <p style={{ textAlign: 'center', color: '#888' }}>Polygon Mainnet • Mise à jour toutes les 30s</p>
        <div style={{ background: '#111', border: '1px solid #FFD700', borderRadius: '12px', padding: '1.5rem', maxWidth: '700px', margin: '2rem auto', whiteSpace: 'pre-wrap' }}>
          {loading ? '⏳ Chargement données blockchain...' : data}
        </div>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <h2 style={{ color: '#FFD700' }}>👛 Vérifier mon Solde REUSS</h2>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <input value={wallet} onChange={e => setWallet(e.target.value)}
              placeholder="0x... (adresse Polygon)" 
              style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', background: '#222', color: '#fff', border: '1px solid #FFD700' }} />
            <button onClick={checkWallet}
              style={{ padding: '0.75rem 1.5rem', background: '#FFD700', color: '#000', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', border: 'none' }}>
              Vérifier
            </button>
          </div>
          {walletData && (
            <div style={{ background: '#111', border: '1px solid #4CAF50', borderRadius: '12px', padding: '1.5rem', marginTop: '1rem', whiteSpace: 'pre-wrap' }}>
              {walletData}
            </div>
          )}
        </div>
        <p style={{ textAlign: 'center', marginTop: '3rem', color: '#FFD700' }}>Boudoum ! 🇬🇵 REUSSITESS®971</p>
      </div>
    </>
  )
}
