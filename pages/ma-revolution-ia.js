'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const questions = [
  { emoji: "✊", question: "Face à un système injuste, tu fais quoi ?", options: [
    { text: "Je prends les armes de la tech pour le briser de l'intérieur", profil: "dessalines" },
    { text: "J'écris, je parle, je conscientise les masses", profil: "cesaire" },
    { text: "Je construis une alternative qui le rend obsolète", profil: "toussaint" },
    { text: "J'analyse ses biais profonds pour mieux le déconstruire", profil: "fanon" },
    { text: "Je bâtis une économie souveraine qui s'en passe", profil: "malcolm" },
  ]},
  { emoji: "🤖", question: "L'IA va révolutionner le monde. Ton rôle c'est...", options: [
    { text: "Libérer les algorithmes des biais coloniaux", profil: "toussaint" },
    { text: "Créer des IA qui parlent nos langues et portent notre culture", profil: "cesaire" },
    { text: "Prendre le contrôle des outils avant que d'autres le fassent", profil: "dessalines" },
    { text: "Déconstruire les modèles qui nous invisibilisent", profil: "fanon" },
    { text: "Construire notre propre infrastructure numérique souveraine", profil: "malcolm" },
  ]},
  { emoji: "🌍", question: "La diaspora afro-caribéenne et l'IA, c'est...", options: [
    { text: "Notre prochaine révolution — comme Haïti en 1804 mais numérique", profil: "dessalines" },
    { text: "Un outil de négritude 2.0 — redonner voix à nos cultures", profil: "cesaire" },
    { text: "Une libération progressive — stratégie, pas confrontation", profil: "toussaint" },
    { text: "Un miroir qui révèle les injustices du monde digital", profil: "fanon" },
    { text: "Notre chemin vers l'indépendance économique totale", profil: "malcolm" },
  ]},
  { emoji: "🔥", question: "Ton héritage numérique dans 50 ans sera...", options: [
    { text: "La première IA construite entièrement par et pour la diaspora", profil: "toussaint" },
    { text: "Une bibliothèque des savoirs caribéens et africains préservés", profil: "cesaire" },
    { text: "Un système qui a mis à genoux les monopoles tech", profil: "dessalines" },
    { text: "Un cadre éthique pour des IA sans biais raciaux", profil: "fanon" },
    { text: "Un écosystème économique afro-caribéen indépendant", profil: "malcolm" },
  ]},
]

const profils = {
  toussaint: {
    emoji: "🖤", nom: "L'Esprit Toussaint", couleur: "#f59e0b",
    gradient: "linear-gradient(135deg, #92400e 0%, #f59e0b 100%)",
    titre: "Le Libérateur des Algorithmes",
    desc: "Comme Toussaint Louverture qui a libéré Haïti par la stratégie et non la force brute, tu libères les algorithmes par l'intelligence. Tu construis des ponts entre les systèmes, tu infiltres les institutions pour les transformer de l'intérieur. Ta révolution est patiente mais inévitable.",
    revolution: "Créer des IA libres de tout biais colonial — les outils de demain construits aujourd'hui",
    citation: "\"La liberté ne se donne pas — elle se code, ligne par ligne.\"",
  },
  cesaire: {
    emoji: "🌺", nom: "L'Âme Aimé Césaire", couleur: "#ec4899",
    gradient: "linear-gradient(135deg, #9d174d 0%, #ec4899 100%)",
    titre: "Le Poète de la Négritude Numérique",
    desc: "Césaire a inventé la Négritude pour redonner fierté et voix aux peuples colonisés. Toi, tu inventes la Négritude Numérique — des IA qui parlent créole, qui connaissent le Gwoka, qui valorisent les savoirs ancestraux. Tu donnes une âme caribéenne aux machines.",
    revolution: "Des IA qui parlent nos langues, connaissent nos cultures, amplifient nos voix",
    citation: "\"Ma bouche sera la bouche des malheurs qui n'ont point de bouche... et des machines qui ont oublié d'où elles viennent.\"",
  },
  dessalines: {
    emoji: "⚡", nom: "La Force Dessalines", couleur: "#ef4444",
    gradient: "linear-gradient(135deg, #7f1d1d 0%, #ef4444 100%)",
    titre: "Le Disrupteur des Systèmes Tech",
    desc: "Dessalines n'a pas négocié — il a brisé les chaînes. Toi tu ne demandes pas de place dans les systèmes tech existants — tu les brises et tu construis les tiens. Ta révolution IA est radicale, sans compromis, et historiquement nécessaire.",
    revolution: "Briser les monopoles tech et construire des alternatives afro-caribéennes souveraines",
    citation: "\"Je ne veux pas de place à leur table — je construis ma propre table.\"",
  },
  fanon: {
    emoji: "🌊", nom: "La Sagesse Fanon", couleur: "#06b6d4",
    gradient: "linear-gradient(135deg, #164e63 0%, #06b6d4 100%)",
    titre: "L'Analyste des Biais de l'IA",
    desc: "Frantz Fanon a disséqué le colonialisme avec la précision d'un chirurgien. Toi, tu disséques les biais raciaux cachés dans les algorithmes. Tu révèles comment l'IA reproduit les injustices historiques et tu proposes les remèdes. Ta révolution est intellectuelle — et c'est la plus puissante.",
    revolution: "Exposer et éliminer les biais raciaux dans les systèmes d'IA mondiaux",
    citation: "\"Les masques blancs des algorithmes cachent les visages noirs qu'ils ont appris à ignorer.\"",
  },
  malcolm: {
    emoji: "🦁", nom: "La Vision Malcolm", couleur: "#10b981",
    gradient: "linear-gradient(135deg, #064e3b 0%, #10b981 100%)",
    titre: "Le Bâtisseur de Souveraineté Tech",
    desc: "Malcolm X prônait l'auto-suffisance économique des communautés noires. Toi, tu construis l'auto-suffisance numérique de la diaspora — tes propres serveurs, tes propres données, ta propre IA. Par tous les moyens nécessaires — légaux, créatifs et brillants.",
    revolution: "Infrastructure numérique souveraine afro-caribéenne — nos données, notre futur",
    citation: "\"By any means necessary — y compris coder notre propre liberté.\"",
  },
}

export default function MaRevolutionIA() {
  const [step, setStep] = useState('intro')
  const [currentQ, setCurrentQ] = useState(0)
  const [scores, setScores] = useState({ toussaint: 0, cesaire: 0, dessalines: 0, fanon: 0, malcolm: 0 })
  const [resultat, setResultat] = useState(null)
  const [animating, setAnimating] = useState(false)
  const [citation, setCitation] = useState(null)

  useEffect(() => {
    fetch('https://zenquotes.io/api/random')
      .then(r => r.json())
      .then(d => setCitation({ text: d[0].q, author: d[0].a }))
      .catch(() => {})
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
        setStep('result')
      } else {
        setCurrentQ(currentQ + 1)
      }
      setAnimating(false)
    }, 300)
  }

  const restart = () => { setStep('intro'); setCurrentQ(0); setScores({ toussaint: 0, cesaire: 0, dessalines: 0, fanon: 0, malcolm: 0 }); setResultat(null) }

  if (step === 'intro') return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0a00 50%, #0a1500 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ maxWidth: '600px', width: '100%', textAlign: 'center' }}>
        <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🌍</div>
        <h1 style={{ color: '#fff', fontSize: '2.5rem', fontWeight: '900', marginBottom: '0.5rem' }}>MA RÉVOLUTION IA</h1>
        <p style={{ color: '#86efac', fontSize: '1.1rem', marginBottom: '0.5rem', fontStyle: 'italic' }}>Quel révolutionnaire afro-caribéen de l'IA es-tu ?</p>
        <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '2rem' }}>4 questions • Profil révolutionnaire • Mission historique</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.75rem', marginBottom: '2rem' }}>
          {Object.values(profils).map((p) => (
            <div key={p.nom} style={{ textAlign: 'center', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', padding: '0.75rem' }}>
              <div style={{ fontSize: '2rem' }}>{p.emoji}</div>
              <div style={{ color: p.couleur, fontSize: '0.55rem', fontWeight: 'bold', marginTop: '0.25rem' }}>{p.nom.split(' ').slice(-1)[0]}</div>
            </div>
          ))}
        </div>
        <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '15px', padding: '1.25rem', marginBottom: '2rem' }}>
          <p style={{ color: '#86efac', fontSize: '0.9rem', lineHeight: '1.7', fontStyle: 'italic' }}>"Toussaint, Césaire, Dessalines, Fanon, Malcolm — ils ont changé le monde avec les outils de leur époque. L'IA est l'outil de la nôtre."</p>
        </div>
        <button onClick={() => setStep('quiz')} style={{ background: 'linear-gradient(135deg, #064e3b, #10b981)', color: 'white', border: 'none', padding: '1rem 3rem', borderRadius: '50px', fontSize: '1.2rem', fontWeight: '900', cursor: 'pointer', boxShadow: '0 0 30px rgba(16,185,129,0.4)', letterSpacing: '1px' }}>
          ✊ REJOINS LA RÉVOLUTION
        </button>
        <div style={{ marginTop: '1.5rem' }}><Link href="/" style={{ color: '#64748b', fontSize: '0.8rem', textDecoration: 'none' }}>↩ Retour</Link></div>
      </div>
    </div>
  )

  if (step === 'quiz') {
    const q = questions[currentQ]
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0a00 50%, #0a1500 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ maxWidth: '600px', width: '100%' }}>
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Question {currentQ + 1} / {questions.length}</span>
              <span style={{ color: '#86efac', fontSize: '0.85rem' }}>La révolution se précise...</span>
            </div>
            <div style={{ height: '4px', background: '#1a2a1a', borderRadius: '2px' }}>
              <div style={{ height: '100%', width: `${(currentQ / questions.length) * 100}%`, background: 'linear-gradient(90deg, #064e3b, #10b981)', borderRadius: '2px', transition: 'width 0.3s' }} />
            </div>
          </div>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>{q.emoji}</div>
            <h2 style={{ color: '#f1f5f9', fontSize: '1.3rem', fontWeight: '800', lineHeight: '1.5' }}>{q.question}</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {q.options.map((opt, i) => (
              <button key={i} onClick={() => handleAnswer(opt.profil)} disabled={animating}
                style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', color: '#e2e8f0', padding: '1rem 1.5rem', borderRadius: '15px', cursor: 'pointer', textAlign: 'left', fontSize: '0.95rem', transition: 'all 0.2s' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(16,185,129,0.25)'; e.currentTarget.style.borderColor = '#10b981' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(16,185,129,0.08)'; e.currentTarget.style.borderColor = 'rgba(16,185,129,0.2)' }}
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
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0a00 50%, #0a1500 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ maxWidth: '600px', width: '100%', textAlign: 'center' }}>
          <div style={{ background: p.gradient, borderRadius: '25px', padding: '2.5rem', marginBottom: '1.5rem', boxShadow: `0 0 60px ${p.couleur}44` }}>
            <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>{p.emoji}</div>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', letterSpacing: '3px', marginBottom: '0.5rem' }}>TA RÉVOLUTION IA</p>
            <h1 style={{ color: 'white', fontSize: '1.8rem', fontWeight: '900', marginBottom: '0.5rem' }}>{p.nom}</h1>
            <h2 style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.1rem', fontWeight: '700', marginBottom: '1.5rem' }}>{p.titre}</h2>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.95rem', lineHeight: '1.7', marginBottom: '1.5rem' }}>{p.desc}</p>
            <div style={{ background: 'rgba(0,0,0,0.25)', borderRadius: '12px', padding: '1rem', marginBottom: '1rem' }}>
              <p style={{ color: 'white', fontSize: '0.85rem', fontWeight: '700' }}>🎯 TA MISSION : {p.revolution}</p>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.85rem', fontStyle: 'italic' }}>{p.citation}</p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '15px', padding: '1.25rem', marginBottom: '1.5rem' }}>
            <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginBottom: '0.75rem' }}>LES 5 RÉVOLUTIONNAIRES</p>
            {Object.entries(scores).sort((a,b) => b[1]-a[1]).map(([k, v]) => (
              <div key={k} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <span style={{ width: '25px' }}>{profils[k].emoji}</span>
                <div style={{ flex: 1, height: '6px', background: '#1e293b', borderRadius: '3px' }}>
                  <div style={{ height: '100%', width: `${(v / questions.length) * 100}%`, background: profils[k].gradient, borderRadius: '3px', transition: 'width 1s' }} />
                </div>
                <span style={{ color: '#64748b', fontSize: '0.7rem', width: '15px' }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link href="/oracle-971" style={{ background: 'linear-gradient(135deg, #6d28d9, #a78bfa)', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '50px', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.9rem' }}>🔮 Oracle 971</Link>
            <Link href="/mon-adn" style={{ background: 'linear-gradient(135deg, #ec4899, #8b5cf6)', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '50px', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.9rem' }}>🧬 Mon ADN</Link>
            <button onClick={restart} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '50px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem' }}>🔄 Recommencer</button>
          </div>
          {citation && (
            <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '12px', padding: '1rem', marginBottom: '1rem' }}>
              <p style={{ color: '#86efac', fontSize: '0.85rem', fontStyle: 'italic' }}>"{citation.text}"</p>
              <p style={{ color: '#10b981', fontSize: '0.75rem', marginTop: '0.5rem' }}>— {citation.author}</p>
            </div>
          )}
          <p style={{ color: '#475569', fontSize: '0.75rem', marginTop: '1.5rem' }}>REUSSITESS®971 — Guadeloupe 🇬🇵 BOUDOUM !</p>
        </div>
      </div>
    )
  }

  return null
}
