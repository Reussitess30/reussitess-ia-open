'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const questions = [
  { id: 1, question: "Face à un défi impossible, tu fais quoi ?", emoji: "⚡", options: [
    { text: "Je fonce sans réfléchir — l'action c'est ma nature", profil: "lion" },
    { text: "Je crée une solution que personne n'a imaginée", profil: "papillon" },
    { text: "Je m'adapte, je tombe, je me relève — toujours", profil: "vague" },
    { text: "Je rassemble mon équipe et on attaque ensemble", profil: "etoile" },
    { text: "Je casse les règles du jeu pour en inventer de nouvelles", profil: "flamme" },
  ]},
  { id: 2, question: "Ton superpouvoir secret c'est...", emoji: "🌟", options: [
    { text: "Inspirer les autres juste par ma présence", profil: "lion" },
    { text: "Voir la beauté là où personne ne regarde", profil: "papillon" },
    { text: "Ne jamais abandonner, même quand tout s'effondre", profil: "vague" },
    { text: "Connecter les gens et créer des ponts entre les cultures", profil: "etoile" },
    { text: "Transformer l'impossible en réalité concrète", profil: "flamme" },
  ]},
  { id: 3, question: "La Guadeloupe te représente comment ?", emoji: "🇬🇵", options: [
    { text: "Un terrain de conquête — l'île des champions", profil: "lion" },
    { text: "Un papillon dans les Caraïbes — libre et magnifique", profil: "papillon" },
    { text: "Une île qui résiste à tous les cyclones", profil: "vague" },
    { text: "Un carrefour de civilisations et de cultures", profil: "etoile" },
    { text: "Un volcan endormi prêt à exploser de talent", profil: "flamme" },
  ]},
  { id: 4, question: "Ton mot d'ordre au quotidien ?", emoji: "🔥", options: [
    { text: "DOMINER — être le meilleur partout", profil: "lion" },
    { text: "CRÉER — laisser une trace unique", profil: "papillon" },
    { text: "PERSISTER — jamais je ne lâche", profil: "vague" },
    { text: "UNIFIER — ensemble on va plus loin", profil: "etoile" },
    { text: "DISRUPTER — changer les règles du monde", profil: "flamme" },
  ]},
  { id: 5, question: "BOUDOUM ! C'est quoi pour toi ?", emoji: "💥", options: [
    { text: "Le cri de guerre du champion qui arrive", profil: "lion" },
    { text: "L'explosion créatrice qui libère tout", profil: "papillon" },
    { text: "La résilience qui rebondit encore plus fort", profil: "vague" },
    { text: "L'énergie collective de toute la diaspora", profil: "etoile" },
    { text: "La révolution silencieuse qui change tout", profil: "flamme" },
  ]},
]

const profils = {
  lion: { emoji: "🦁", nom: "Lion des Caraïbes", couleur: "#f59e0b", gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)", desc: "Tu es un leader-né. Ta présence impose le respect, ton énergie électrise les foules. Tu ne demandes pas la permission — tu ouvres les portes. Les Caraïbes t'ont forgé dans le feu de la détermination.", force: "Leadership & Autorité naturelle", citation: "Le lion ne se retourne pas quand le chien aboie. 🦁", conseil: "Utilise ton leadership pour élever ceux qui t'entourent." },
  papillon: { emoji: "🦋", nom: "Papillon 971", couleur: "#8b5cf6", gradient: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)", desc: "Tu es un artiste de la vie. Là où les autres voient des obstacles, tu vois des oeuvres d'art. Ta créativité est ton arme secrète — elle transforme le monde en quelque chose de plus beau.", force: "Créativité & Vision unique", citation: "Le papillon ne ressemble à rien de ce qui existait avant lui. 🦋", conseil: "Partage ta créativité — elle est une ressource rare et précieuse." },
  vague: { emoji: "🌊", nom: "Vague du Pacifique", couleur: "#06b6d4", gradient: "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)", desc: "Tu es indestructible. Les cyclones t'ont appris que plier ne signifie pas céder. Tu te relèves toujours plus fort qu'avant. Ta persévérance est légendaire — elle inspire tous ceux qui croisent ta route.", force: "Résilience & Persévérance absolue", citation: "L'eau ne résiste pas — elle contourne, persiste, et finit par creuser la roche. 🌊", conseil: "Ta résilience est une école de vie pour les autres. Enseigne-la." },
  etoile: { emoji: "⭐", nom: "Étoile Francophone", couleur: "#10b981", gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)", desc: "Tu es le pont entre les mondes. Ta force est dans les connexions — tu crées des communautés, tu unifies les cultures, tu fais briller les autres. La diaspora francophone est ta famille élargie.", force: "Connexion & Intelligence collective", citation: "Seul on va plus vite, ensemble on va plus loin. ⭐", conseil: "Continue à tisser ton réseau mondial — c'est ta plus grande richesse." },
  flamme: { emoji: "🔥", nom: "Flamme BOUDOUM", couleur: "#ef4444", gradient: "linear-gradient(135deg, #ef4444 0%, #f97316 100%)", desc: "Tu es un disrupteur. Tu vois le futur avant tout le monde et tu n'as pas peur de tout changer. Les règles ? Tu les réécris. Le status quo ? Tu le brûles pour construire quelque chose de plus grand.", force: "Innovation & Disruption", citation: "BOUDOUM ! L'explosion qui illumine le chemin. 🔥", conseil: "Canalise ton énergie disruptrice pour créer du changement durable." },
}

export default function MonADN() {
  const [step, setStep] = useState('intro')
  const [currentQ, setCurrentQ] = useState(0)
  const [scores, setScores] = useState({ lion: 0, papillon: 0, vague: 0, etoile: 0, flamme: 0 })
  const [resultat, setResultat] = useState(null)
  const [animating, setAnimating] = useState(false)
  const [savedProfil, setSavedProfil] = useState(null)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('reussitess_adn')
      if (saved) setSavedProfil(JSON.parse(saved))
    } catch(e) {}
  }, [])

  const handleAnswer = (profil) => {
    if (animating) return
    setAnimating(true)
    const newScores = { ...scores, [profil]: scores[profil] + 1 }
    setScores(newScores)
    setTimeout(() => {
      if (currentQ + 1 >= questions.length) {
        const winner = Object.entries(newScores).reduce((a, b) => a[1] > b[1] ? a : b)[0]
        setResultat(winner)
        try {
          const profilData = { profil: winner, date: new Date().toLocaleDateString('fr-FR') }
          localStorage.setItem('reussitess_adn', JSON.stringify(profilData))
          setSavedProfil(profilData)
        } catch(e) {}
        setStep('result')
      } else {
        setCurrentQ(currentQ + 1)
      }
      setAnimating(false)
    }, 300)
  }

  const restart = () => {
    setStep('intro')
    setCurrentQ(0)
    setScores({ lion: 0, papillon: 0, vague: 0, etoile: 0, flamme: 0 })
    setResultat(null)
  }

  if (step === 'intro') return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #020617 0%, #0f172a 50%, #1e1b4b 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ maxWidth: '600px', width: '100%', textAlign: 'center' }}>
        <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🧬</div>
        <h1 style={{ color: '#fff', fontSize: '2.5rem', fontWeight: '900', marginBottom: '0.5rem' }}>MON ADN REUSSITESS®</h1>
        <p style={{ color: '#a78bfa', fontSize: '1.1rem', marginBottom: '0.5rem', fontStyle: 'italic' }}>Découvre ton profil de champion caribéen</p>
        <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '2rem' }}>5 questions • 2 minutes • Résultat unique</p>
        {savedProfil && (
          <div style={{ background: 'rgba(124,58,237,0.2)', border: '1px solid #7c3aed', borderRadius: '15px', padding: '1rem', marginBottom: '1.5rem' }}>
            <p style={{ color: '#c4b5fd', fontSize: '0.9rem' }}>Ton dernier profil : <strong>{profils[savedProfil.profil]?.emoji} {profils[savedProfil.profil]?.nom}</strong> — {savedProfil.date}</p>
          </div>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
          {Object.values(profils).map((p) => (
            <div key={p.nom} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem' }}>{p.emoji}</div>
              <div style={{ color: p.couleur, fontSize: '0.6rem', fontWeight: 'bold' }}>{p.nom.split(' ')[0]}</div>
            </div>
          ))}
        </div>
        <button onClick={() => setStep('quiz')} style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899)', color: 'white', border: 'none', padding: '1rem 3rem', borderRadius: '50px', fontSize: '1.2rem', fontWeight: '900', cursor: 'pointer', boxShadow: '0 0 30px rgba(124,58,237,0.5)', letterSpacing: '1px' }}>
          💥 RÉVÈLE TON ADN
        </button>
        <div style={{ marginTop: '1.5rem' }}>
          <Link href="/" style={{ color: '#64748b', fontSize: '0.8rem', textDecoration: 'none' }}>↩ Retour</Link>
        </div>
      </div>
    </div>
  )

  if (step === 'quiz') {
    const q = questions[currentQ]
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #020617 0%, #0f172a 50%, #1e1b4b 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ maxWidth: '600px', width: '100%' }}>
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Question {currentQ + 1} / {questions.length}</span>
              <span style={{ color: '#a78bfa', fontSize: '0.85rem' }}>{Math.round((currentQ / questions.length) * 100)}% complété</span>
            </div>
            <div style={{ height: '6px', background: '#1e293b', borderRadius: '3px' }}>
              <div style={{ height: '100%', width: `${(currentQ / questions.length) * 100}%`, background: 'linear-gradient(90deg, #7c3aed, #ec4899)', borderRadius: '3px', transition: 'width 0.3s' }} />
            </div>
          </div>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{q.emoji}</div>
            <h2 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: '800' }}>{q.question}</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {q.options.map((opt, i) => (
              <button key={i} onClick={() => handleAnswer(opt.profil)} disabled={animating}
                style={{ background: 'rgba(255,255,255,0.05)', border: '2px solid rgba(255,255,255,0.1)', color: 'white', padding: '1rem 1.5rem', borderRadius: '15px', cursor: 'pointer', textAlign: 'left', fontSize: '0.95rem', transition: 'all 0.2s', fontWeight: '500' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(124,58,237,0.3)'; e.currentTarget.style.borderColor = '#7c3aed' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
              >{opt.text}</button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (step === 'result' && resultat) {
    const p = profils[resultat]
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #020617 0%, #0f172a 50%, #1e1b4b 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ maxWidth: '600px', width: '100%', textAlign: 'center' }}>
          <div style={{ background: p.gradient, borderRadius: '25px', padding: '2.5rem', marginBottom: '1.5rem', boxShadow: `0 0 60px ${p.couleur}66` }}>
            <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>{p.emoji}</div>
            <h1 style={{ color: 'white', fontSize: '2rem', fontWeight: '900', marginBottom: '0.5rem' }}>TON ADN REUSSITESS®</h1>
            <h2 style={{ color: 'white', fontSize: '1.5rem', fontWeight: '800', marginBottom: '1rem' }}>{p.nom}</h2>
            <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1rem', lineHeight: '1.6', marginBottom: '1rem' }}>{p.desc}</p>
            <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '10px', padding: '0.75rem', marginBottom: '1rem' }}>
              <span style={{ color: 'white', fontWeight: 'bold', fontSize: '0.9rem' }}>⚡ Force principale : {p.force}</span>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', fontStyle: 'italic' }}>{p.citation}</p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${p.couleur}44`, borderRadius: '15px', padding: '1.25rem', marginBottom: '1.5rem' }}>
            <p style={{ color: '#e2e8f0', fontSize: '0.95rem' }}>💡 <strong>Conseil BOUDOUM :</strong> {p.conseil}</p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '15px', padding: '1.25rem', marginBottom: '1.5rem' }}>
            <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginBottom: '0.75rem' }}>TON PROFIL COMPLET</p>
            {Object.entries(scores).sort((a,b) => b[1]-a[1]).map(([k, v]) => (
              <div key={k} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <span style={{ width: '30px', textAlign: 'center' }}>{profils[k].emoji}</span>
                <div style={{ flex: 1, height: '8px', background: '#1e293b', borderRadius: '4px' }}>
                  <div style={{ height: '100%', width: `${(v / questions.length) * 100}%`, background: profils[k].gradient, borderRadius: '4px', transition: 'width 1s' }} />
                </div>
                <span style={{ color: '#94a3b8', fontSize: '0.75rem', width: '20px' }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link href="/quiz" style={{ background: p.gradient, color: 'white', padding: '0.75rem 1.5rem', borderRadius: '50px', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.9rem' }}>🎓 Quiz</Link>
            <Link href="/mon-compte" style={{ background: 'rgba(124,58,237,0.3)', border: '1px solid #7c3aed', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '50px', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.9rem' }}>💎 Mes REUSS</Link>
            <button onClick={restart} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '50px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem' }}>🔄 Recommencer</button>
          </div>
          <p style={{ color: '#475569', fontSize: '0.75rem', marginTop: '1.5rem' }}>REUSSITESS®971 — Guadeloupe 🇬🇵 BOUDOUM !</p>
        </div>
      </div>
    )
  }

  return null
}
