export default function PremiumCancel() {
  return (
    <div style={{ minHeight:'100vh', background:'#0a0a0a', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'monospace', textAlign:'center' }}>
      <div style={{ padding:'40px' }}>
        <div style={{ fontSize:'4rem' }}>😔</div>
        <h1 style={{ color:'#ff4444', fontSize:'2rem' }}>Abonnement annulé</h1>
        <p style={{ color:'#888' }}>Tu peux souscrire à tout moment.</p>
        <a href="https://reussitess.fr" style={{ color:'#00c853', textDecoration:'none', display:'block', marginTop:'20px' }}>← Retour accueil</a>
      </div>
    </div>
  )
}
