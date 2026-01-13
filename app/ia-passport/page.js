'use client'
import { useState } from 'react'

export default function IAPassport() {
  const [showFortune, setShowFortune] = useState(false)
  const countries = ['🇬🇵 Guadeloupe', '🇫🇷 France', '🇧🇪 Belgique', '🇮🇹 Italie', '🇩🇪 Allemagne', '🇸🇪 Suède', '🇸🇬 Singapour', '🇦🇺 Australie', '🇪🇸 Espagne', '🇧🇷 Brésil', '🇮🇳 Inde', '🇳🇿 Nouvelle-Zélande', '🇺🇸 États-Unis', '🇨🇦 Canada']

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: 'white', fontFamily: 'monospace', padding: '2rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ color: '#10b981', fontSize: '3rem', fontWeight: '900' }}>IA PASSPORT</h1>
        <p>VÉRITÉ PROUVÉE - REUSSITESS©</p>
        <p style={{ color: '#10b981' }}>GUADELOUPE : TERRES DE CHAMPIONS 🇬🇵</p>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <button 
          onClick={() => setShowFortune(!showFortune)}
          style={{ background: '#f59e0b', color: '#000', padding: '1.5rem 3rem', borderRadius: '50px', fontWeight: '900', cursor: 'pointer', border: 'none', fontSize: '1.2rem' }}>
          {showFortune ? '✖ FERMER L\'AUDIT' : '🔍 SOLDE RÉEL : 1 000 000 000 REUSS (1 000 000 000 U)'}
        </button>
        
        {showFortune && (
          <div style={{ marginTop: '2rem', padding: '2rem', border: '2px solid #10b981', borderRadius: '20px', textAlign: 'left', background: 'rgba(16, 185, 129, 0.1)', maxWidth: '800px', margin: '2rem auto' }}>
            <h3 style={{ color: '#10b981' }}>📊 AUDIT RÉEL DES 200 IA</h3>
            <p>• Fortune : 1 000 000 000 REUSS certifiés.</p>
            <p>• Contrat : 0xB37531727fC07c6EED4f97F852A115B428046EB2</p>
            <div style={{ color: '#ff4444', border: '1px solid red', padding: '15px', marginTop: '15px', fontWeight: 'bold' }}>
              🛡️ GAZ : UTILISATION INTERDITE SANS AUTORISATION MANUELLE
            </div>
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
        {countries.map((c, i) => (
          <div key={i} style={{ padding: '10px', border: '1px solid #333', textAlign: 'center', borderRadius: '10px', background: '#111' }}>{c}</div>
        ))}
      </div>
    </div>
  )
}
