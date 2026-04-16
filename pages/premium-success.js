import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export default function PremiumSuccess() {
  const router = useRouter()
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    const { subscription_id, telegramId } = router.query
    if (subscription_id) {
      fetch('/api/premium/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscriptionId: subscription_id, telegramId })
      }).then(() => setStatus('success'))
    } else {
      setStatus('success')
    }
  }, [router.query])

  return (
    <div style={{ minHeight:'100vh', background:'#0a0a0a', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'monospace', textAlign:'center' }}>
      <div style={{ padding:'40px' }}>
        <div style={{ fontSize:'4rem' }}>👑</div>
        <h1 style={{ color:'#00c853', fontSize:'2rem' }}>Bienvenue Premium !</h1>
        <p style={{ color:'#888' }}>Ton abonnement REUSSITESS est actif.</p>
        <p style={{ color:'#888' }}>Retourne sur Telegram et tape /premium</p>
        <a href="https://reussitess.fr" style={{ color:'#00c853', textDecoration:'none' }}>← Retour accueil</a>
      </div>
    </div>
  )
}
