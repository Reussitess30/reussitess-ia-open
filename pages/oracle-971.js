'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

const questions = [
  { emoji: "🌙", question: "Quelle est ta plus grande ambition dans le monde numérique ?", options: [
    { text: "Créer une entreprise tech qui rayonne depuis la Caraïbe", theme: "creation" },
    { text: "Libérer ma communauté grâce à l'IA et au savoir", theme: "liberation" },
    { text: "Accumuler la richesse et la transmettre aux miens", theme: "richesse" },
    { text: "Laisser une œuvre qui traverse les siècles", theme: "heritage" },
  ]},
  { emoji: "🔥", question: "Quel obstacle te bloque en ce moment ?", options: [
    { text: "Le manque de ressources et de financement", theme: "ressources" },
    { text: "Le doute et la peur de l'échec", theme: "doute" },
    { text: "L'isolement — personne ne comprend ma vision", theme: "isolement" },
    { text: "Le temps — j'ai trop de projets à la fois", theme: "temps" },
  ]},
  { emoji: "⭐", question: "Quelle énergie caribéenne te guide ?", options: [
    { text: "Le Gwoka — le rythme ancestral qui libère l'âme", theme: "gwoka" },
    { text: "Le Quimbois — la sagesse cachée qui révèle les chemins", theme: "quimbois" },
    { text: "Le Carnaval — l'explosion créatrice qui renverse tout", theme: "carnaval" },
    { text: "La Mer — la patience infinie qui forge les îles", theme: "mer" },
  ]},
]

const prophecies = {
  creation_doute_gwoka: { titre: "L'Étoile du Créateur Libéré", prophétie: "Les ancêtres voient en toi un bâtisseur que le doute n'a pas encore libéré. Le Gwoka te dit : frappe le tambour même sans savoir la chanson — le rythme viendra. Lance ton projet imparfait. La Caraïbe a besoin de ta création.", action1: "Lance une version simple de ton projet cette semaine", action2: "Rejoins une communauté tech caribéenne", action3: "Pose 1 question à un entrepreneur que tu admires" },
  liberation_isolement_quimbois: { titre: "Le Messager des Peuples Connectés", prophétie: "Le Quimbois révèle que ton isolement est une illusion — ta vision est tellement en avance que les autres ne la voient pas encore. Continue. La diaspora de 300 millions d'âmes attend ton signal.", action1: "Documente ta vision dans un post sur les réseaux", action2: "Cherche 3 personnes qui partagent ta mission", action3: "Crée un contenu qui explique ton pourquoi profond" },
  richesse_ressources_carnaval: { titre: "La Flamme du Conquérant Carnavalesque", prophétie: "Le Carnaval enseigne que les masques cachent des rois. Tes ressources limitées sont ton déguisement — dessous se cache un empire. Renverse le char du carnaval numérique.", action1: "Identifie 1 source de revenus passifs cette semaine", action2: "Postule au Chèque TIC ou à une aide régionale", action3: "Monétise une compétence que tu donnes gratuitement" },
  heritage_temps_mer: { titre: "L'Architecte des Civilisations Numériques", prophétie: "La Mer t'enseigne la patience des bâtisseurs de civilisations. Tu construis quelque chose qui durera 100 ans — accorde-toi le temps que cela demande. Priorise. Une vague à la fois.", action1: "Choisis TON projet le plus important — abandonne le reste temporairement", action2: "Crée un système qui fonctionne sans toi", action3: "Pense à l'héritage que tu veux laisser dans 20 ans" },
}

const defaultProphecy = { titre: "L'Élu de la Révolution Numérique Caribéenne", prophétie: "Les esprits de la Caraïbe voient en toi une force rare — celle qui unit la sagesse ancestrale à l'intelligence artificielle du futur. Tu portes en toi l'âme de Toussaint, la plume de Césaire et le code de demain. Avance.", action1: "Médite sur ta mission profonde pendant 5 minutes", action2: "Écris les 3 valeurs qui guident ton projet", action3: "Partage ta vision avec quelqu'un de confiance aujourd'hui" }

export default function Oracle971() {
  const [step, setStep] = useState('intro')
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState([])
  const [prophecy, setProphecy] = useState(null)
  const [animating, setAnimating] = useState(false)
  const [particles, setParticles] = useState([])
  const [citation, setCitation] = useState(null)

  useEffect(() => {
    fetch('https://zenquotes.io/api/random')
      .then(r => r.json())
      .then(d => setCitation({ text: d[0].q, author: d[0].a }))
      .catch(() => {})
  }, [])

  useEffect(() => {
    setParticles(Array.from({length: 20}, (_, i) => ({
      id: i, x: Math.random() * 100, y: Math.random() * 100,
      size: Math.random() * 3 + 1, delay: Math.random() * 3
    })))
  }, [])

  const handleAnswer = (theme) => {
    if (animating) return
    setAnimating(true)
    const newAnswers = [...answers, theme]
    setAnswers(newAnswers)
    setTimeout(() => {
      if (currentQ + 1 >= questions.length) {
        const key = newAnswers.join('_')
        setProphecy(prophecies[key] || defaultProphecy)
        setStep('result')
      } else {
        setCurrentQ(currentQ + 1)
      }
      setAnimating(false)
    }, 400)
  }

  const restart = () => { setStep('intro'); setCurrentQ(0); setAnswers([]); setProphecy(null) }

  if (step === 'intro') return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0a0015 0%, #1a0030 50%, #0d0025 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', position: 'relative', overflow: 'hidden' }}>
      {particles.map(p => <div key={p.id} style={{ position: 'absolute', left: `${p.x}%`, top: `${p.y}%`, width: `${p.size}px`, height: `${p.size}px`, background: '#a78bfa', borderRadius: '50%', opacity: 0.6, animation: `pulse ${2 + p.delay}s infinite` }} />)}
      <div style={{ maxWidth: '600px', width: '100%', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: '6rem', marginBottom: '0.5rem', filter: 'drop-shadow(0 0 20px #a78bfa)' }}>🔮</div>
        <h1 style={{ color: '#fff', fontSize: '2.8rem', fontWeight: '900', marginBottom: '0.5rem', textShadow: '0 0 30px #a78bfa' }}>ORACLE 971</h1>
        <p style={{ color: '#a78bfa', fontSize: '1.1rem', marginBottom: '0.5rem', fontStyle: 'italic' }}>La sagesse du Quimbois rencontre l'Intelligence Artificielle</p>
        <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '2.5rem' }}>3 questions • Prophétie personnalisée • Plan d'action caribéen</p>
        <div style={{ background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.3)', borderRadius: '20px', padding: '1.5rem', marginBottom: '2rem' }}>
          <p style={{ color: '#c4b5fd', fontSize: '0.95rem', lineHeight: '1.7', fontStyle: 'italic' }}>"Entre les ancêtres qui ont forgé nos îles et l'IA qui forge le futur, il existe un chemin tracé pour toi. L'Oracle 971 te le révèle."</p>
        </div>
        <button onClick={() => setStep('quiz')} style={{ background: 'linear-gradient(135deg, #6d28d9, #a78bfa)', color: 'white', border: 'none', padding: '1rem 3rem', borderRadius: '50px', fontSize: '1.2rem', fontWeight: '900', cursor: 'pointer', boxShadow: '0 0 40px rgba(109,40,217,0.6)', letterSpacing: '1px' }}>
          🔮 CONSULTER L'ORACLE
        </button>
        <div style={{ marginTop: '1.5rem' }}><Link href="/" style={{ color: '#64748b', fontSize: '0.8rem', textDecoration: 'none' }}>↩ Retour</Link></div>
      </div>
    </div>
  )

  if (step === 'quiz') {
    const q = questions[currentQ]
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0a0015 0%, #1a0030 50%, #0d0025 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ maxWidth: '600px', width: '100%' }}>
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Vision {currentQ + 1} / {questions.length}</span>
              <span style={{ color: '#a78bfa', fontSize: '0.85rem' }}>L'Oracle écoute...</span>
            </div>
            <div style={{ height: '4px', background: '#1e0040', borderRadius: '2px' }}>
              <div style={{ height: '100%', width: `${((currentQ) / questions.length) * 100}%`, background: 'linear-gradient(90deg, #6d28d9, #a78bfa)', borderRadius: '2px', transition: 'width 0.4s', boxShadow: '0 0 10px #a78bfa' }} />
            </div>
          </div>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem', filter: 'drop-shadow(0 0 15px #a78bfa)' }}>{q.emoji}</div>
            <h2 style={{ color: '#e2e8f0', fontSize: '1.3rem', fontWeight: '700', lineHeight: '1.5' }}>{q.question}</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {q.options.map((opt, i) => (
              <button key={i} onClick={() => handleAnswer(opt.theme)} disabled={animating}
                style={{ background: 'rgba(109,40,217,0.15)', border: '1px solid rgba(167,139,250,0.2)', color: '#e2e8f0', padding: '1rem 1.5rem', borderRadius: '15px', cursor: 'pointer', textAlign: 'left', fontSize: '0.95rem', transition: 'all 0.2s' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(109,40,217,0.4)'; e.currentTarget.style.borderColor = '#a78bfa'; e.currentTarget.style.boxShadow = '0 0 20px rgba(167,139,250,0.3)' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(109,40,217,0.15)'; e.currentTarget.style.borderColor = 'rgba(167,139,250,0.2)'; e.currentTarget.style.boxShadow = 'none' }}
              >{opt.text}</button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (step === 'result' && prophecy) return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0a0015 0%, #1a0030 50%, #0d0025 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ maxWidth: '600px', width: '100%', textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem', filter: 'drop-shadow(0 0 20px #a78bfa)' }}>🔮</div>
        <div style={{ background: 'linear-gradient(135deg, #1a0030, #2d0060)', border: '1px solid rgba(167,139,250,0.4)', borderRadius: '25px', padding: '2.5rem', marginBottom: '1.5rem', boxShadow: '0 0 60px rgba(109,40,217,0.4)' }}>
          <h2 style={{ color: '#a78bfa', fontSize: '0.9rem', fontWeight: '700', letterSpacing: '3px', marginBottom: '1rem' }}>L'ORACLE A PARLÉ</h2>
          <h1 style={{ color: '#fff', fontSize: '1.6rem', fontWeight: '900', marginBottom: '1.5rem', textShadow: '0 0 20px #a78bfa' }}>{prophecy.titre}</h1>
          <p style={{ color: '#c4b5fd', fontSize: '1rem', lineHeight: '1.8', fontStyle: 'italic', marginBottom: '1.5rem' }}>"{prophecy.prophétie}"</p>
          <div style={{ borderTop: '1px solid rgba(167,139,250,0.2)', paddingTop: '1.5rem' }}>
            <p style={{ color: '#a78bfa', fontSize: '0.8rem', fontWeight: '700', letterSpacing: '2px', marginBottom: '1rem' }}>TON PLAN D'ACTION CARIBÉEN</p>
            {[prophecy.action1, prophecy.action2, prophecy.action3].map((a, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.75rem', textAlign: 'left' }}>
                <span style={{ color: '#a78bfa', fontWeight: '900', fontSize: '1.2rem', minWidth: '25px' }}>{i + 1}.</span>
                <span style={{ color: '#e2e8f0', fontSize: '0.9rem', lineHeight: '1.5' }}>{a}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link href="/bibliotheque" style={{ background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '50px', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.85rem' }}>📚 Bibliothèque</Link>
          <Link href="/hub-central" style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '50px', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.85rem' }}>💼 Emploi</Link>
          <Link href="/boutiques" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '50px', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.85rem' }}>🛍️ Boutiques</Link>
          <Link href="/investir-reuss" style={{ background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '50px', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.85rem' }}>💎 Token REUSS</Link>
          <Link href="/champions" style={{ background: 'linear-gradient(135deg, #ec4899, #8b5cf6)', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '50px', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.85rem' }}>🏆 Champions</Link>
          <Link href="/bibliotheque" style={{ background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '50px', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.85rem' }}>📚 Bibliothèque</Link>
          <Link href="/boutiques" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '50px', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.85rem' }}>🛍️ Boutiques</Link>
          <Link href="/champions" style={{ background: 'linear-gradient(135deg, #ec4899, #8b5cf6)', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '50px', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.85rem' }}>🏆 Champions</Link>
          <button onClick={restart} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '50px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem' }}>🔄 Reconsulter</button>
        </div>
        {citation && (
          <div style={{ background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.2)', borderRadius: '12px', padding: '1rem', marginBottom: '1rem' }}>
            <p style={{ color: '#c4b5fd', fontSize: '0.85rem', fontStyle: 'italic' }}>"{citation.text}"</p>
            <p style={{ color: '#7c3aed', fontSize: '0.75rem', marginTop: '0.5rem' }}>— {citation.author}</p>
          </div>
        )}
        <p style={{ color: '#475569', fontSize: '0.75rem', marginTop: '1.5rem' }}>REUSSITESS®971 — Guadeloupe 🇬🇵 Boudoum !</p>
      </div>
    </div>
  )

  return null
}
