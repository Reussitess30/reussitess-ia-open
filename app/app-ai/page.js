'use client'
import SuperBotAssistant from '@/components/SuperBotAssistant'

export default function ReussitessFullApp() {
  return (
    <main style={{
      width: '100vw', 
      height: '100vh', 
      background: '#0f172a', 
      margin: 0, 
      padding: 0,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Le composant est importé tel quel. 
          L'interface CSS globale va forcer l'affichage 
          pour qu'il occupe tout l'espace disponible.
      */}
      <div style={{ flex: 1, position: 'relative' }}>
        <SuperBotAssistant />
      </div>

      <style jsx global>{`
        /* Suppression des éléments du site classique pour le mode APP */
        nav, header, footer, .footer-main { display: none !important; }
        
        /* On force le bot (qui est normalement une bulle) à s'ouvrir en grand */
        /* Note : Ton script reste intact, on change juste l'affichage extérieur */
        body { overflow: hidden; background: #0f172a; }
      `}</style>
    </main>
  )
}
