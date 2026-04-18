/* © Reussitess®971 INPI DSO2026012614 PORINUS Rony 2026 */
'use client'
import { useRouter } from 'next/navigation'
export default function NotFound() {
  const router = useRouter()
  return (
    <div style={{ backgroundColor: '#000', color: '#00ff41', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'monospace', textAlign: 'center' }}>
      <div>
        <div style={{ fontSize: '6rem', fontWeight: '900', textShadow: '0 0 30px rgba(0,255,65,0.5)' }}>404</div>
        <div style={{ fontSize: '0.85rem', marginBottom: '2rem' }}>&gt; CHEMIN_INTROUVABLE_</div>
        <button onClick={() => router.push('/')} style={{ border: '1px solid #00ff41', background: 'transparent', color: '#00ff41', padding: '0.75rem 2rem', cursor: 'pointer', fontFamily: 'monospace', fontSize: '0.85rem' }}>
          &gt; RETOUR_NEXUS.exe
        </button>
        <div style={{ marginTop: '2rem', fontSize: '0.6rem', color: '#002208' }}>REUSSITESS®971 — BOUDOUM 🥁</div>
      </div>
    </div>
  )
}
