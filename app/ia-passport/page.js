'use client'
import { useState } from 'react'

export default function IAPassport() {
  const [showFortune, setShowFortune] = useState(false)
  const countries = ['🇬🇵 Guadeloupe', '🇫🇷 France', '🇧🇪 Belgique', '🇮🇹 Italie', '🇩🇪 Allemagne', '🇸🇪 Suède', '🇸🇬 Singapour', '🇦🇺 Australie', '🇪🇸 Espagne', '🇧🇷 Brésil', '🇮🇳 Inde', '🇳🇿 Nouvelle-Zélande', '🇺🇸 États-Unis', '🇨🇦 Canada']

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: 'white', fontFamily: 'monospace', padding: '2rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{ fontSize: '5rem' }}>🌍</div>
        <h1 style={{ color: '#10b981', fontSize: '3rem', fontWeight: '900' }}>IA PASSPORT</h1>
        <p style={{ letterSpacing: '2px' }}>VÉRITÉ PROUVÉE - REUSSITESS©</p>
        <p style={{ fontSize: '0.8rem', color: '#666' }}>Guadeloupe - Terres De Champions</p>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <button 
          onClick={() => setShowFortune(!showFortune)}
          style={{ background: '#f59e0b', color: '#000', padding: '1.5rem 3rem', borderRadius: '50px', fontWeight: '900', cursor: 'pointer', border: 'none', fontSize: '1.2rem' }}>
          {showFortune ? '✖ FERMER L\'AUDIT' : '🔍 VÉRIFIER LA FORTUNE (1 000 000 000 U)'}
        </button>
        
        {showFortune && (
          <div style={{ marginTop: '2rem', padding: '2rem', border: '2px solid #10b981', borderRadius: '20px', textAlign: 'left', background: 'rgba(16, 185, 129, 0.1)', maxWidth: '800px', margin: '2rem auto' }}>
            <h3 style={{ color: '#10b981' }}>📊 AUDIT RÉEL DES 200 IA</h3>
            <p>• Fortune : 1 000 000 000 REUSS détectés.</p>
            <p>• Blockchain : Polygon (78+ mouvements certifiés).</p>
            <p>• Réglementation : Conforme EU AI Act & RGPD (14 pays).</p>
            <div style={{ color: '#ff4444', border: '1px solid red', padding: '15px', marginTop: '15px', fontWeight: 'bold' }}>
              🛡️ GAZ : UTILISATION INTERDITE SANS AUTORISATION MANUELLE
            </div>
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '4rem' }}>
        {countries.map((c, i) => (
          <div key={i} style={{ padding: '10px', border: '1px solid #333', textAlign: 'center', borderRadius: '10px', background: '#111' }}>{c}</div>
        ))}
      </div>

      <footer style={{ textAlign: 'center', borderTop: '1px solid #222', paddingTop: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', color: '#10b981' }}>
          <span style={{ width: '10px', height: '10px', background: '#10b981', borderRadius: '50%', boxShadow: '0 0 10px #10b981' }}></span>
          <p>IA LOGIC : ACTIVE (SURVEILLANCE INFLUENCEUR@REUSSITESS.FR)</p>
        </div>
        <p style={{ marginTop: '1rem', fontWeight: 'bold' }}>POSITIVITÉ À L'INFINI 🎯 BOUDOUM !</p>
      </footer>
    </div>
  )
}
