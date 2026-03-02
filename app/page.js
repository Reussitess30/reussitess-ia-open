'use client'
import SuperBotAssistant from '@/components/SuperBotAssistant'

export default function Home() {
  return (
    <main style={{ backgroundColor: '#0f172a', minHeight: '100vh', width: '100%', position: 'relative' }}>
      <div style={{ color: 'white', textAlign: 'center', paddingTop: '20vh', fontFamily: 'sans-serif' }}>
        <h1 style={{ fontSize: '2rem' }}>REUSSITESS AI 🇬🇵</h1>
        <p>Innovation • Excellence • Succès</p>
      </div>
      <SuperBotAssistant />
    </main>
  )
}
