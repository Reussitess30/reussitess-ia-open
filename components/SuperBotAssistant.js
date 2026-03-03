'use client'
import { useState, useEffect, useRef } from 'react'

const LANGUES = {
  'fr': { label: '🇫🇷 Français', voice: 'fr-FR', code: 'fr-FR' },
  'en': { label: '🇺🇸 English', voice: 'en-US', code: 'en-US' },
  'es': { label: '🇪🇸 Español', voice: 'es-ES', code: 'es-ES' },
  'de': { label: '🇩🇪 Deutsch', voice: 'de-DE', code: 'de-DE' },
  'pt': { label: '🇧🇷 Português', voice: 'pt-BR', code: 'pt-BR' },
  'it': { label: '🇮🇹 Italiano', voice: 'it-IT', code: 'it-IT' },
  'nl': { label: '🇳🇱 Nederlands', voice: 'nl-NL', code: 'nl-NL' },
  'sv': { label: '🇸🇪 Svenska', voice: 'sv-SE', code: 'sv-SE' },
}

export default function SuperBotAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [langue, setLangue] = useState('fr')
  const [showLangMenu, setShowLangMenu] = useState(false)
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [activeTab, setActiveTab] = useState('chat')
  const [nexusStats, setNexusStats] = useState(null)
  const [nexusLoading, setNexusLoading] = useState(false)
  const [visitorCount, setVisitorCount] = useState(null)
  const messagesEndRef = useRef(null)
  const recognitionRef = useRef(null)

  const botPersonality = {
    name: "REUSSITESS AI", origin: "Guadeloupe 🇬🇵",
    motto: "EXCELLENCE • INNOVATION • SUCCÈS", signature: "BOUDOUM",
    expertise: ["Expert mondial IA","Blockchain Polygon","195 langues","Entrepreneuriat caribéen"]
  }

  const scrollToBottom = () => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }
  useEffect(() => { scrollToBottom() }, [messages])

  useEffect(() => {
    if (messages.length > 1) {
      try { localStorage.setItem('reussitess_chat_v2', JSON.stringify(messages.slice(-10))) } catch(e) {}
    }
  }, [messages])

  useEffect(() => {
    try {
      const saved = localStorage.getItem('reussitess_chat_v2')
      if (saved) { const p = JSON.parse(saved); if (p && p.length > 0) setMessages(p) }
    } catch(e) {}
  }, [])

  useEffect(() => {
    try {
      const v = parseInt(localStorage.getItem('reussitess_visits') || '0') + 1
      localStorage.setItem('reussitess_visits', String(v))
      setVisitorCount(v)
    } catch(e) {}
  }, [])

  useEffect(() => {
    if (messages.length > 1) {
      try { localStorage.setItem('reussitess_chat_v2', JSON.stringify(messages.slice(-10))) } catch(e) {}
    }
  }, [messages])

  useEffect(() => {
    try {
      const saved = localStorage.getItem('reussitess_chat_v2')
      if (saved) { const p = JSON.parse(saved); if (p && p.length > 0) setMessages(p) }
    } catch(e) {}
  }, [])

  useEffect(() => {
    try {
      const v = parseInt(localStorage.getItem('reussitess_visits') || '0') + 1
      localStorage.setItem('reussitess_visits', String(v))
      setVisitorCount(v)
    } catch(e) {}
  }, [])

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{ role: 'assistant', content: `🌍 **Salutations du monde !**\n\nJe suis **REUSSITESS AI**, votre assistant révolutionnaire né en **Guadeloupe** 🇬🇵 - Terres de Champions !\n\n✨ IA Universelle • 🌐 195 langues • 🔐 Blockchain • 💎 Tokens REUSS\n\n🎤 **NOUVEAU** — Parlez-moi ! Cliquez sur le micro et je vous réponds en audio dans votre langue !\n\nChoisissez votre langue en haut à droite, puis cliquez sur 🎤\n\n**BOUDOUM** 🎯` }])
    }
  }, [])

  const startListening = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) { alert('Utilisez Chrome pour la reconnaissance vocale.'); return }
    const recognition = new SR()
    recognitionRef.current = recognition
    recognition.lang = LANGUES[langue].code
    recognition.interimResults = false
    recognition.maxAlternatives = 1
    recognition.continuous = false
    recognition.onstart = () => setIsListening(true)
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      setInput(transcript)
      setIsListening(false)
      setTimeout(() => submitMessage(transcript), 300)
    }
    recognition.onerror = (event) => {
      setIsListening(false)
      if (event.error === 'not-allowed') alert('Autorisez le microphone dans votre navigateur.')
    }
    recognition.onend = () => setIsListening(false)
    recognition.start()
  }

  const stopListening = () => { if (recognitionRef.current) { recognitionRef.current.stop(); setIsListening(false) } }

  const speakResponse = (text, langCode) => {
    if (!audioEnabled || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    // Correction de la durée : passage de 500 à 4000 caractères pour lire tout le texte
    const cleanText = text.replace(/\[([^\]]+)\]\([^)]+\)/g,'$1').replace(/https?:\/\/\S+/g,'').replace(/[\u{1F300}-\u{1F9FF}]/gu,'').replace(/\*\*/g,'').replace(/\*/g,'').replace(/#{1,3}/g,'').substring(0, 4000)
    if (!cleanText.trim()) return
    const utterance = new SpeechSynthesisUtterance(cleanText)
    utterance.lang = langCode || LANGUES[langue].voice
    utterance.rate = 1.0; utterance.pitch = 1.0; utterance.volume = 0.9
    const setVoice = () => {
      const voices = window.speechSynthesis.getVoices()
      const tl = (langCode || LANGUES[langue].voice).substring(0,2)
      const best = voices.find(v => v.lang.startsWith(tl) && (v.name.includes('Google') || v.name.includes('Microsoft'))) || voices.find(v => v.lang.startsWith(tl))
      if (best) utterance.voice = best
    }
    window.speechSynthesis.getVoices().length > 0 ? setVoice() : (window.speechSynthesis.onvoiceschanged = setVoice)
    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)
    window.speechSynthesis.speak(utterance)
  }

  const stopSpeaking = () => { if ('speechSynthesis' in window) { window.speechSynthesis.cancel(); setIsSpeaking(false) } }

  const submitMessage = async (msgText) => {
    const userMessage = (msgText || input).trim()
    if (!userMessage || isLoading) return
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setIsLoading(true)
    try {
      const response = await fetch('/api/superbot/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, personality: botPersonality, context: messages, langue })
      })
      const data = await response.json()
      const botResponse = data.response || "Désolé, une erreur s'est produite. Réessayez ! 🔄"
      setMessages(prev => [...prev, { role: 'assistant', content: botResponse }])
      if (audioEnabled) speakResponse(botResponse, LANGUES[langue].voice)
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: "⚠️ Connexion temporairement indisponible. Réessayez dans un instant. 💪" }])
    } finally { setIsLoading(false) }
  }


  const fetchNexusStats = async () => {
    setNexusLoading(true)
    try {
      const [site, token, matic] = await Promise.all([
        fetch('https://reussitess-global-nexus-jfgk.vercel.app').then(r => ({ok:r.ok})).catch(()=>({ok:false})),
        fetch('https://api.dexscreener.com/latest/dex/tokens/0xB37531727fC07c6EED4f97F852A115B428046EB2').then(r=>r.json()).catch(()=>null),
        fetch('https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=usd').then(r=>r.json()).catch(()=>null)
      ])
      const pair = token?.pairs?.[0]
      setNexusStats({
        siteOk: site.ok,
        price: pair?.priceUsd || 'N/A',
        change: pair?.priceChange?.h24 || 'N/A',
        volume: pair?.volume?.h24 || 'N/A',
        liquidity: pair?.liquidity?.usd || 'N/A',
        pol: matic?.['matic-network']?.usd || 'N/A',
        time: new Date().toLocaleTimeString('fr-FR')
      })
    } catch(e) {}
    setNexusLoading(false)
  }

  const handleSubmit = (e) => { e.preventDefault(); submitMessage(input) }

  const btnStyle = (bg, disabled) => ({
    padding: '0.8rem', borderRadius: '15px', border: 'none',
    background: bg, color: 'white', cursor: disabled ? 'not-allowed' : 'pointer',
    fontSize: '1.2rem', opacity: disabled ? 0.5 : 1, flexShrink: 0
  })

  return (
    <>
      <div onClick={() => setIsOpen(!isOpen)} className="bot-button" style={{
        position:'fixed', bottom:'2rem', right:'2rem', width:'70px', height:'70px',
        borderRadius:'50%', background:'linear-gradient(135deg,#10b981,#3b82f6)',
        display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer',
        boxShadow:'0 10px 40px rgba(16,185,129,0.5)', zIndex:9999, transition:'all 0.3s', animation:'pulse 2s infinite'
      }}>
        <span style={{fontSize:'2rem'}}>{isOpen ? '✕' : '🤖'}</span>
      </div>

      {isOpen && (
        <div style={{
          position:'fixed', bottom:'6rem', right:'2rem', width:'400px',
          maxWidth:'calc(100vw - 4rem)', height:'620px', maxHeight:'calc(100vh - 10rem)',
          background:'linear-gradient(135deg,#0f172a,#1e293b)', borderRadius:'20px',
          boxShadow:'0 20px 60px rgba(0,0,0,0.5)', display:'flex', flexDirection:'column',
          zIndex:9998, border:'2px solid rgba(16,185,129,0.3)', overflow:'hidden'
        }}>

          {/* HEADER */}
          <div style={{ background:'linear-gradient(135deg,#10b981,#3b82f6)', padding:'1rem 1.5rem', color:'white' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'0.8rem' }}>
                <span style={{fontSize:'2rem'}}>🤖</span>
                <div>
                  <h3 style={{margin:0,fontSize:'1.1rem',fontWeight:'bold'}}>REUSSITESS AI</h3>
                  <p style={{margin:0,fontSize:'0.75rem',opacity:0.9}}>🇬🇵 Expert IA Mondial • Guadeloupe</p>
                </div>
              </div>
              <div style={{display:'flex',gap:'0.5rem',alignItems:'center'}}>
                <button onClick={() => { setAudioEnabled(!audioEnabled); if(!audioEnabled) stopSpeaking() }}
                  style={{background: audioEnabled?'rgba(255,255,255,0.3)':'rgba(0,0,0,0.3)', border:'none', borderRadius:'8px', padding:'0.4rem 0.6rem', cursor:'pointer', fontSize:'1rem', color:'white'}}>
                  {audioEnabled ? '🔊' : '🔇'}
                </button>
                <div style={{position:'relative'}}>
                  <button onClick={() => setShowLangMenu(!showLangMenu)}
                    style={{background:'rgba(255,255,255,0.2)', border:'none', borderRadius:'8px', padding:'0.4rem 0.6rem', cursor:'pointer', fontSize:'0.8rem', color:'white', fontWeight:'bold'}}>
                    {LANGUES[langue].label.split(' ')[0]} ▾
                  </button>
                  {showLangMenu && (
                    <div style={{position:'absolute',top:'110%',right:0,background:'#1e293b',border:'1px solid rgba(16,185,129,0.3)',borderRadius:'10px',overflow:'hidden',zIndex:10000,minWidth:'150px'}}>
                      {Object.entries(LANGUES).map(([code, lang]) => (
                        <div key={code} onClick={() => {setLangue(code);setShowLangMenu(false)}}
                          style={{padding:'0.6rem 1rem',cursor:'pointer',fontSize:'0.85rem',color: langue===code?'#10b981':'#e2e8f0',background: langue===code?'rgba(16,185,129,0.1)':'transparent',fontWeight: langue===code?'bold':'normal'}}>
                          {lang.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>


          {/* ONGLETS */}
          <div style={{display:'flex',borderBottom:'1px solid rgba(255,255,255,0.1)'}}>
            {[['chat','💬 Chat'],['nexus','🌐 Nexus'],['amazon','🛍️ Amazon'],['token','💎 Token'],['quiz','📚 Quiz']].map(([tab,label]) => (
              <button key={tab} onClick={() => { setActiveTab(tab); if(tab==='nexus') fetchNexusStats() }}
                style={{flex:1,padding:'0.6rem',border:'none',background: activeTab===tab?'rgba(16,185,129,0.2)':'transparent',color: activeTab===tab?'#10b981':'#64748b',fontSize:'0.7rem',cursor:'pointer',fontWeight: activeTab===tab?'bold':'normal',borderBottom: activeTab===tab?'2px solid #10b981':'2px solid transparent'}}>
                {label}
              </button>
            ))}
          </div>

          {/* CONTENU TABS */}
          {activeTab === 'nexus' && (
            <div style={{flex:1,overflowY:'auto',padding:'1rem'}}>
              {nexusLoading ? (
                <div style={{textAlign:'center',color:'#10b981',padding:'2rem'}}>⏳ Chargement des données live...</div>
              ) : nexusStats ? (
                <div style={{display:'flex',flexDirection:'column',gap:'0.8rem'}}>
                  <div style={{background:'rgba(16,185,129,0.1)',border:'1px solid rgba(16,185,129,0.3)',borderRadius:'12px',padding:'1rem'}}>
                    <p style={{color:'#10b981',fontWeight:'bold',margin:'0 0 0.5rem'}}>🌐 Site Web</p>
                    <p style={{color: nexusStats.siteOk?'#10b981':'#ef4444',margin:0}}>{nexusStats.siteOk?'✅ EN LIGNE':'❌ HORS LIGNE'}</p>
                    <p style={{color:'#64748b',fontSize:'0.75rem',margin:'0.3rem 0 0'}}>Mis à jour à {nexusStats.time}</p>
                  </div>
                  <div style={{background:'rgba(168,85,247,0.1)',border:'1px solid rgba(168,85,247,0.3)',borderRadius:'12px',padding:'1rem'}}>
                    <p style={{color:'#a855f7',fontWeight:'bold',margin:'0 0 0.5rem'}}>💎 Token REUSS</p>
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.5rem'}}>
                      {[['Prix','$'+nexusStats.price],['Var 24h',nexusStats.change+'%'],['Volume','$'+nexusStats.volume],['Liquidité','$'+nexusStats.liquidity]].map(([k,v]) => (
                        <div key={k} style={{background:'rgba(0,0,0,0.2)',padding:'0.5rem',borderRadius:'8px'}}>
                          <p style={{color:'#94a3b8',fontSize:'0.7rem',margin:0}}>{k}</p>
                          <p style={{color:'white',fontWeight:'bold',fontSize:'0.85rem',margin:0}}>{v}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{background:'rgba(59,130,246,0.1)',border:'1px solid rgba(59,130,246,0.3)',borderRadius:'12px',padding:'1rem'}}>
                    <p style={{color:'#3b82f6',fontWeight:'bold',margin:'0 0 0.5rem'}}>🔷 POL (Polygon)</p>
                    <p style={{color:'white',fontWeight:'bold',margin:0}}>${nexusStats.pol}</p>
                  </div>
                  <div style={{background:'rgba(245,158,11,0.1)',border:'1px solid rgba(245,158,11,0.3)',borderRadius:'12px',padding:'1rem'}}>
                    <p style={{color:'#f59e0b',fontWeight:'bold',margin:'0 0 0.5rem'}}>🏗️ Écosystème</p>
                    {[['🛍️ Boutiques Amazon','26 actives • 14 pays'],['🤖 Agents IA','200 déployés'],['📚 Quiz','100+ thèmes'],['🇬🇵 Base','Guadeloupe 971']].map(([k,v]) => (
                      <div key={k} style={{display:'flex',justifyContent:'space-between',padding:'0.3rem 0',borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
                        <span style={{color:'#94a3b8',fontSize:'0.8rem'}}>{k}</span>
                        <span style={{color:'white',fontSize:'0.8rem',fontWeight:'bold'}}>{v}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.5rem'}}>
                    <div style={{background:'rgba(16,185,129,0.1)',border:'1px solid rgba(16,185,129,0.3)',borderRadius:'10px',padding:'0.7rem',textAlign:'center'}}>
                      <p style={{color:'#94a3b8',fontSize:'0.7rem',margin:0}}>👥 Mes visites</p>
                      <p style={{color:'white',fontWeight:'bold',fontSize:'1.1rem',margin:'0.2rem 0 0'}}>{visitorCount || '...'}</p>
                    </div>
                    <div style={{background:'rgba(168,85,247,0.1)',border:'1px solid rgba(168,85,247,0.3)',borderRadius:'10px',padding:'0.7rem',textAlign:'center'}}>
                      <p style={{color:'#94a3b8',fontSize:'0.7rem',margin:0}}>📚 Quiz actifs</p>
                      <p style={{color:'white',fontWeight:'bold',fontSize:'1.1rem',margin:'0.2rem 0 0'}}>99</p>
                    </div>
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.5rem'}}>
                    <div style={{background:'rgba(16,185,129,0.1)',border:'1px solid rgba(16,185,129,0.3)',borderRadius:'10px',padding:'0.7rem',textAlign:'center'}}>
                      <p style={{color:'#94a3b8',fontSize:'0.7rem',margin:0}}>👥 Mes visites</p>
                      <p style={{color:'white',fontWeight:'bold',fontSize:'1.1rem',margin:'0.2rem 0 0'}}>{visitorCount || '...'}</p>
                    </div>
                    <div style={{background:'rgba(168,85,247,0.1)',border:'1px solid rgba(168,85,247,0.3)',borderRadius:'10px',padding:'0.7rem',textAlign:'center'}}>
                      <p style={{color:'#94a3b8',fontSize:'0.7rem',margin:0}}>📚 Quiz actifs</p>
                      <p style={{color:'white',fontWeight:'bold',fontSize:'1.1rem',margin:'0.2rem 0 0'}}>99</p>
                    </div>
                  </div>
                  <button onClick={fetchNexusStats} style={{background:'linear-gradient(135deg,#10b981,#3b82f6)',border:'none',color:'white',padding:'0.8rem',borderRadius:'12px',cursor:'pointer',fontWeight:'bold'}}>
                    🔄 Actualiser les données
                  </button>
                </div>
              ) : (
                <div style={{textAlign:'center',padding:'2rem'}}>
                  <p style={{color:'#94a3b8'}}>Cliquez pour charger les données live</p>
                  <button onClick={fetchNexusStats} style={{background:'#10b981',border:'none',color:'white',padding:'0.8rem 1.5rem',borderRadius:'12px',cursor:'pointer',fontWeight:'bold',marginTop:'1rem'}}>
                    🚀 Charger NEXUS
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'amazon' && (
            <div style={{flex:1,overflowY:'auto',padding:'1rem'}}>
              <p style={{color:'#f59e0b',fontWeight:'bold',marginBottom:'1rem'}}>🛍️ 26 Boutiques • 14 Pays</p>
              {[['🇺🇸','USA','https://amazon.com/shop/amourguadeloupe'],['🇫🇷','France','https://amazon.fr/shop/amourguadeloupe'],['🇩🇪','Allemagne','https://amazon.de/shop/amourguadeloupe'],['🇬🇧','UK','https://amazon.co.uk/shop/amourguadeloupe'],['🇨🇦','Canada','https://amazon.ca/shop/amourguadeloupe'],['🇮🇹','Italie','https://amazon.it/shop/amourguadeloupe'],['🇪🇸','Espagne','https://amazon.es/shop/amourguadeloupe'],['🇦🇺','Australie','https://amzlink.to/az05kTTrYJ06L'],['🇧🇪','Belgique','https://amazon.com.be/shop/influencer-fb942837'],['🇮🇳','Inde','https://amazon.in/shop/amourguadeloupe'],['🇸🇬','Singapour','https://amazon.sg/shop/amourguadeloupe'],['🇸🇪','Suède','https://amazon.se/shop/amourguadeloupe'],['🇳🇱','Pays-Bas','https://amazon.nl/shop/amourguadeloupe'],['🇧🇷','Brésil','https://amzlink.to/az0ymmoCLHvyA']].map(([flag,name,url]) => (
                <a key={name} href={url} target="_blank" rel="noopener noreferrer" style={{display:'flex',alignItems:'center',gap:'0.8rem',padding:'0.7rem',background:'rgba(245,158,11,0.1)',border:'1px solid rgba(245,158,11,0.2)',borderRadius:'10px',marginBottom:'0.5rem',textDecoration:'none',color:'white'}}>
                  <span style={{fontSize:'1.5rem'}}>{flag}</span>
                  <div>
                    <p style={{margin:0,fontWeight:'bold',fontSize:'0.85rem'}}>{name}</p>
                    <p style={{margin:0,fontSize:'0.65rem',color:'#94a3b8'}}>{url.replace('https://','').substring(0,35)}...</p>
                  </div>
                  <span style={{marginLeft:'auto',color:'#f59e0b'}}>→</span>
                </a>
              ))}

              <p style={{color:'#3b82f6',fontWeight:'bold',marginTop:'1rem',marginBottom:'0.5rem'}}>⭐ Boutiques Influenceur fb942837 (12)</p>
              {[['🇺🇸','USA','https://amzlink.to/az0G6w0uuYRlg'],['🇩🇪','Allemagne','https://amzlink.to/az0PuGdrA0kgh'],['🇬🇧','UK','https://amzlink.to/az0VutIAPP8MY'],['🇨🇦','Canada','https://amzlink.to/az0YFa3j2fsnv'],['🇮🇹','Italie','https://amzlink.to/az0yC7BiDQmPg'],['🇪🇸','Espagne','https://amzlink.to/az0DKsP6Zr5IL'],['🇦🇺','Australie','https://amzlink.to/az0on91nKaQvh'],['🇧🇪','Belgique','https://amzlink.to/az08ZB76xWpGm'],['🇮🇳','Inde','https://amzlink.to/az0Qry9pNlCkw'],['🇸🇬','Singapour','https://amzlink.to/az05gMuq73i99'],['🇸🇪','Suède','https://amzlink.to/az0Q5qEXfyqk5'],['🇳🇱','Pays-Bas','https://amzlink.to/az0v9jdbSf7Km']].map(([flag,name,url]) => (
                <a key={'i-'+name} href={url} target="_blank" rel="noopener noreferrer" style={{display:'flex',alignItems:'center',gap:'0.8rem',padding:'0.7rem',background:'rgba(59,130,246,0.1)',border:'1px solid rgba(59,130,246,0.2)',borderRadius:'10px',marginBottom:'0.5rem',textDecoration:'none',color:'white'}}>
                  <span style={{fontSize:'1.5rem'}}>{flag}</span>
                  <div>
                    <p style={{margin:0,fontWeight:'bold',fontSize:'0.85rem'}}>{name} <span style={{fontSize:'0.65rem',color:'#3b82f6'}}>• Influenceur</span></p>
                    <p style={{margin:0,fontSize:'0.65rem',color:'#94a3b8'}}>{url.replace('https://','').substring(0,35)}...</p>
                  </div>
                  <span style={{marginLeft:'auto',color:'#3b82f6'}}>→</span>
                </a>
              ))}
            </div>
          )}

          {activeTab === 'quiz' && (
            <div style={{flex:1,overflowY:'auto',padding:'1rem'}}>
              <p style={{color:'#10b981',fontWeight:'bold',marginBottom:'0.3rem'}}>📚 99 Quiz • Learn-to-Earn REUSS</p>
              <p style={{color:'#64748b',fontSize:'0.75rem',marginBottom:'0.8rem'}}>Cliquez une catégorie → le bot lance le quiz !</p>
              {[['🛒','Amazon & Affiliation','Amazon_Affiliation'],['💎','Crypto & Blockchain','Crypto'],['🤖','IA & Tech','IntelligenceArtificielle'],['🇬🇵','Caraïbes & Antilles','Caraibes'],['📈','Business','Business'],['🌍','Géographie','Géographie'],['🍽️','Cuisine Antillaise','CuisineAntillaise'],['📖','Histoire','Histoire'],['🏃','Sport & Santé','Sport'],['🎭','Cinéma','Cinéma'],['⚖️','Droit','Droit'],['🌿','Sciences','Sciences'],['💡','Développement Soi','DeveloppementSoi'],['🌐','Voyage','Voyage'],['📱','Tech','Tech'],['🧠','Psychologie','Psychologie'],['💰','Finance Personnelle','Finance_Personnelle'],['🎵','Musique','Musique'],['🏛️','Philosophie','Philosophie'],['🌺','Afrique','Afrique'],['⭐','Afro-Caraïbes','Afro_Caraibes_1'],['🎮','Jeux Vidéo','Jeux_Video'],['🌿','Plantes Antilles','PlantesAntilles'],['🏆','Champions','Entrepreneuriat']].map(([icon,cat,id]) => (
                <a key={cat} href={'/quiz/'+id} target="_blank" rel="noopener noreferrer"
                  style={{display:'flex',alignItems:'center',gap:'0.5rem',width:'100%',padding:'0.65rem 0.8rem',background:'rgba(16,185,129,0.08)',border:'1px solid rgba(16,185,129,0.2)',borderRadius:'10px',marginBottom:'0.4rem',cursor:'pointer',color:'white',fontSize:'0.82rem',fontWeight:'bold',textDecoration:'none'}}>
                  <span>{icon}</span><span style={{flex:1,textAlign:'left'}}>{cat}</span><span style={{color:'#10b981'}}>▶</span>
                </a>
              ))}
              <div style={{marginTop:'0.8rem',padding:'0.8rem',background:'rgba(168,85,247,0.1)',border:'1px solid rgba(168,85,247,0.2)',borderRadius:'10px'}}>
                <p style={{color:'#a855f7',fontWeight:'bold',margin:'0 0 0.3rem',fontSize:'0.8rem'}}>🎯 Vecteur BETA-2 — Learn-to-Earn</p>
                <p style={{color:'#94a3b8',fontSize:'0.72rem',margin:0}}>Répondez correctement → Gagnez des REUSS 💎</p>
              </div>
            </div>
          )}

          {activeTab === 'quiz' && (
            <div style={{flex:1,overflowY:'auto',padding:'1rem'}}>
              <p style={{color:'#10b981',fontWeight:'bold',marginBottom:'0.3rem'}}>📚 99 Quiz • Learn-to-Earn REUSS</p>
              <p style={{color:'#64748b',fontSize:'0.75rem',marginBottom:'0.8rem'}}>Cliquez une catégorie → le bot lance le quiz !</p>
              {[['🛒','Amazon & Affiliation','Amazon_Affiliation'],['💎','Crypto & Blockchain','Crypto'],['🤖','IA & Tech','IntelligenceArtificielle'],['🇬🇵','Caraïbes & Antilles','Caraibes'],['📈','Business','Business'],['🌍','Géographie','Géographie'],['🍽️','Cuisine Antillaise','CuisineAntillaise'],['📖','Histoire','Histoire'],['🏃','Sport & Santé','Sport'],['🎭','Cinéma','Cinéma'],['⚖️','Droit','Droit'],['🌿','Sciences','Sciences'],['💡','Développement Soi','DeveloppementSoi'],['🌐','Voyage','Voyage'],['📱','Tech','Tech'],['🧠','Psychologie','Psychologie'],['💰','Finance Personnelle','Finance_Personnelle'],['🎵','Musique','Musique'],['🏛️','Philosophie','Philosophie'],['🌺','Afrique','Afrique'],['⭐','Afro-Caraïbes','Afro_Caraibes_1'],['🎮','Jeux Vidéo','Jeux_Video'],['🌿','Plantes Antilles','PlantesAntilles'],['🏆','Champions','Entrepreneuriat']].map(([icon,cat,id]) => (
                <a key={cat} href={'/quiz/'+id} target="_blank" rel="noopener noreferrer"
                  style={{display:'flex',alignItems:'center',gap:'0.5rem',width:'100%',padding:'0.65rem 0.8rem',background:'rgba(16,185,129,0.08)',border:'1px solid rgba(16,185,129,0.2)',borderRadius:'10px',marginBottom:'0.4rem',cursor:'pointer',color:'white',fontSize:'0.82rem',fontWeight:'bold',textDecoration:'none'}}>
                  <span>{icon}</span><span style={{flex:1,textAlign:'left'}}>{cat}</span><span style={{color:'#10b981'}}>▶</span>
                </a>
              ))}
              <div style={{marginTop:'0.8rem',padding:'0.8rem',background:'rgba(168,85,247,0.1)',border:'1px solid rgba(168,85,247,0.2)',borderRadius:'10px'}}>
                <p style={{color:'#a855f7',fontWeight:'bold',margin:'0 0 0.3rem',fontSize:'0.8rem'}}>🎯 Vecteur BETA-2 — Learn-to-Earn</p>
                <p style={{color:'#94a3b8',fontSize:'0.72rem',margin:0}}>Répondez correctement → Gagnez des REUSS 💎</p>
              </div>
            </div>
          )}

          {activeTab === 'menu' && (
            <div style={{flex:1,overflowY:'auto',padding:'1rem'}}>
              <p style={{color:'#f59e0b',fontWeight:'bold',marginBottom:'0.3rem'}}>🗺️ Navigation REUSSITESS®971</p>
              <p style={{color:'#64748b',fontSize:'0.75rem',marginBottom:'0.8rem'}}>Toutes les sections de l'écosystème</p>

              <p style={{color:'#10b981',fontSize:'0.75rem',fontWeight:'bold',marginBottom:'0.4rem'}}>💼 BUSINESS</p>
              {[['🛍️','Boutiques Amazon','/boutiques'],['💎','Investir REUSS','/investir-reuss'],['📊','Affiliation','/affiliation'],['🚀','Booster Amazon','/booster-reussitess-amazon']].map(([icon,label,url]) => (
                <a key={label} href={url} target="_blank" rel="noopener noreferrer"
                  style={{display:'flex',alignItems:'center',gap:'0.6rem',padding:'0.6rem 0.8rem',background:'rgba(16,185,129,0.08)',border:'1px solid rgba(16,185,129,0.2)',borderRadius:'10px',marginBottom:'0.35rem',textDecoration:'none',color:'white',fontSize:'0.82rem',fontWeight:'bold'}}>
                  <span>{icon}</span><span style={{flex:1}}>{label}</span><span style={{color:'#10b981'}}>→</span>
                </a>
              ))}

              <p style={{color:'#a855f7',fontSize:'0.75rem',fontWeight:'bold',marginBottom:'0.4rem',marginTop:'0.8rem'}}>🤖 INTELLIGENCE ARTIFICIELLE</p>
              {[['🤖','Neuro-X IA','/neuro-x'],['🔮','Oracle 971','/oracle-971'],['🧠','Ma Révolution IA','/ma-revolution-ia'],['📡','Agents Dashboard','/agents-dashboard']].map(([icon,label,url]) => (
                <a key={label} href={url} target="_blank" rel="noopener noreferrer"
                  style={{display:'flex',alignItems:'center',gap:'0.6rem',padding:'0.6rem 0.8rem',background:'rgba(168,85,247,0.08)',border:'1px solid rgba(168,85,247,0.2)',borderRadius:'10px',marginBottom:'0.35rem',textDecoration:'none',color:'white',fontSize:'0.82rem',fontWeight:'bold'}}>
                  <span>{icon}</span><span style={{flex:1}}>{label}</span><span style={{color:'#a855f7'}}>→</span>
                </a>
              ))}

              <p style={{color:'#3b82f6',fontSize:'0.75rem',fontWeight:'bold',marginBottom:'0.4rem',marginTop:'0.8rem'}}>🌍 ÉCOSYSTÈME MONDIAL</p>
              {[['🏆','Champions','/champions'],['🌐','Hub Central','/hub-central'],['🌍','Hub International','/hub-international'],['🛂','Passe-Port Mondial','/passe-port-mondial'],['🌐','Visa Universel','/visa-universel']].map(([icon,label,url]) => (
                <a key={label} href={url} target="_blank" rel="noopener noreferrer"
                  style={{display:'flex',alignItems:'center',gap:'0.6rem',padding:'0.6rem 0.8rem',background:'rgba(59,130,246,0.08)',border:'1px solid rgba(59,130,246,0.2)',borderRadius:'10px',marginBottom:'0.35rem',textDecoration:'none',color:'white',fontSize:'0.82rem',fontWeight:'bold'}}>
                  <span>{icon}</span><span style={{flex:1}}>{label}</span><span style={{color:'#3b82f6'}}>→</span>
                </a>
              ))}

              <p style={{color:'#f59e0b',fontSize:'0.75rem',fontWeight:'bold',marginBottom:'0.4rem',marginTop:'0.8rem'}}>📚 SAVOIR & CULTURE</p>
              {[['📚','Bibliothèque','/bibliotheque'],['🎓','Quiz Learn-to-Earn','/quiz'],['💡','Astuces','/astuces'],['🌺','Guadeloupe 971','/guadeloupe'],['📖','Savoir & Culture','/savoir-culture']].map(([icon,label,url]) => (
                <a key={label} href={url} target="_blank" rel="noopener noreferrer"
                  style={{display:'flex',alignItems:'center',gap:'0.6rem',padding:'0.6rem 0.8rem',background:'rgba(245,158,11,0.08)',border:'1px solid rgba(245,158,11,0.2)',borderRadius:'10px',marginBottom:'0.35rem',textDecoration:'none',color:'white',fontSize:'0.82rem',fontWeight:'bold'}}>
                  <span>{icon}</span><span style={{flex:1}}>{label}</span><span style={{color:'#f59e0b'}}>→</span>
                </a>
              ))}

              <p style={{color:'#94a3b8',fontSize:'0.75rem',fontWeight:'bold',marginBottom:'0.4rem',marginTop:'0.8rem'}}>⚙️ OUTILS & LÉGAL</p>
              {[['🔧','Outils & Calculateurs','/outils'],['📜','Mentions Légales','/mentions-legales'],['🔒','Confidentialité','/politique-confidentialite'],['📞','Contact','/contact'],['🏅','À Propos','/a-propos']].map(([icon,label,url]) => (
                <a key={label} href={url} target="_blank" rel="noopener noreferrer"
                  style={{display:'flex',alignItems:'center',gap:'0.6rem',padding:'0.6rem 0.8rem',background:'rgba(148,163,184,0.08)',border:'1px solid rgba(148,163,184,0.2)',borderRadius:'10px',marginBottom:'0.35rem',textDecoration:'none',color:'white',fontSize:'0.82rem',fontWeight:'bold'}}>
                  <span>{icon}</span><span style={{flex:1}}>{label}</span><span style={{color:'#94a3b8'}}>→</span>
                </a>
              ))}
            </div>
          )}

          {activeTab === 'token' && (
            <div style={{flex:1,overflowY:'auto',padding:'1rem'}}>
              <p style={{color:'#a855f7',fontWeight:'bold',marginBottom:'1rem'}}>💎 Token REUSS — Données Officielles</p>
              {[['📋 Contrat','0xB37531...46EB2'],['🌐 Réseau','Polygon (MATIC)'],['💰 Supply','999,999,999 REUSS'],['🔥 Brûlés','1 REUSS symbolique'],['📊 DEX','QuickSwap V3'],['⚡ Vecteur 1','ALPHA-1 : Staking'],['🎓 Vecteur 2','BETA-2 : Quiz L2E'],['🛍️ Vecteur 3','GAMMA-1 : Amazon CB'],['🏛️ Vecteur 4','DELTA-4 : Gouvernance']].map(([k,v]) => (
                <div key={k} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'0.7rem',background:'rgba(168,85,247,0.08)',border:'1px solid rgba(168,85,247,0.2)',borderRadius:'10px',marginBottom:'0.5rem'}}>
                  <span style={{color:'#94a3b8',fontSize:'0.8rem'}}>{k}</span>
                  <span style={{color:'white',fontSize:'0.8rem',fontWeight:'bold'}}>{v}</span>
                </div>
              ))}
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.5rem',marginTop:'0.5rem'}}>
                {[['🔍 PolygonScan','https://polygonscan.com/token/0xB37531727fC07c6EED4f97F852A115B428046EB2'],['📈 DexScreener','https://dexscreener.com/polygon/0x1d2e88A55CBBAB68237aa10781a5e00335Af9f9c'],['🦅 Birdeye','https://birdeye.so/token/0xB37531727fC07c6EED4f97F852A115B428046EB2'],['💱 QuickSwap','https://quickswap.exchange']].map(([label,url]) => (
                  <a key={label} href={url} target="_blank" rel="noopener noreferrer" style={{padding:'0.7rem',background:'rgba(168,85,247,0.15)',border:'1px solid rgba(168,85,247,0.3)',borderRadius:'10px',textDecoration:'none',color:'#a855f7',textAlign:'center',fontSize:'0.8rem',fontWeight:'bold'}}>
                    {label}
                  </a>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'chat' && <>
          {/* MESSAGES */}
          <div style={{flex:1,overflowY:'auto',padding:'1.5rem',display:'flex',flexDirection:'column',gap:'1rem'}}>
            {messages.map((msg, idx) => (
              <div key={idx} style={{alignSelf: msg.role==='user'?'flex-end':'flex-start', maxWidth:'85%'}}>
                <div style={{
                  background: msg.role==='user'?'linear-gradient(135deg,#3b82f6,#8b5cf6)':'rgba(16,185,129,0.15)',
                  color:'white', padding:'1rem 1.5rem',
                  borderRadius: msg.role==='user'?'20px 20px 5px 20px':'20px 20px 20px 5px',
                  fontSize:'0.95rem', lineHeight:'1.6',
                  border: msg.role==='assistant'?'1px solid rgba(16,185,129,0.3)':'none',
                  whiteSpace:'pre-wrap'
                }}>
                  {msg.content}
                </div>
                {msg.role==='assistant' && audioEnabled && (
                  <button onClick={() => speakResponse(msg.content, LANGUES[langue].voice)}
                    style={{background:'none',border:'none',cursor:'pointer',fontSize:'0.75rem',color:'#10b981',padding:'0.2rem 0.5rem',marginTop:'0.2rem'}}>
                    🔊 Écouter
                  </button>
                )}
              </div>
            ))}
            {messages.length === 1 && !isLoading && (
              <div style={{display:'flex',flexWrap:'wrap',gap:'0.4rem',marginTop:'0.3rem'}}>
                {['💎 Token REUSS','🛍️ Boutiques','🤖 Agents IA','📊 Stats Nexus','📚 Lancer Quiz','🇬🇵 Guadeloupe'].map(s => (
                  <button key={s} onClick={() => submitMessage(s)}
                    style={{padding:'0.4rem 0.7rem',background:'rgba(16,185,129,0.15)',border:'1px solid rgba(16,185,129,0.3)',borderRadius:'20px',color:'#10b981',fontSize:'0.72rem',cursor:'pointer',fontWeight:'bold',whiteSpace:'nowrap'}}>
                    {s}
                  </button>
                ))}
              </div>
            )}
            {messages.length === 1 && !isLoading && (
              <div style={{display:'flex',flexWrap:'wrap',gap:'0.4rem',marginTop:'0.3rem'}}>
                {['💎 Token REUSS','🛍️ Boutiques','🤖 Agents IA','📊 Stats Nexus','📚 Lancer Quiz','🇬🇵 Guadeloupe'].map(s => (
                  <button key={s} onClick={() => submitMessage(s)}
                    style={{padding:'0.4rem 0.7rem',background:'rgba(16,185,129,0.15)',border:'1px solid rgba(16,185,129,0.3)',borderRadius:'20px',color:'#10b981',fontSize:'0.72rem',cursor:'pointer',fontWeight:'bold',whiteSpace:'nowrap'}}>
                    {s}
                  </button>
                ))}
              </div>
            )}
            {isLoading && (
              <div style={{alignSelf:'flex-start',background:'rgba(16,185,129,0.15)',padding:'1rem 1.5rem',borderRadius:'20px 20px 20px 5px',border:'1px solid rgba(16,185,129,0.3)'}}>
                <span style={{color:'#10b981'}}>● ● ●</span> Réflexion en cours...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* BARRE AUDIO */}
          {isSpeaking && (
            <div style={{padding:'0.5rem 1.5rem',background:'rgba(16,185,129,0.2)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <span style={{color:'#10b981',fontSize:'0.85rem'}}>🔊 Audio... ({LANGUES[langue].label})</span>
              <button onClick={stopSpeaking} style={{background:'#ef4444',color:'white',border:'none',padding:'0.3rem 0.8rem',borderRadius:'10px',cursor:'pointer',fontSize:'0.8rem'}}>⏹ Stop</button>
            </div>
          )}

          {/* BARRE MICRO */}
          {isListening && (
            <div style={{padding:'0.5rem 1.5rem',background:'rgba(239,68,68,0.2)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <span style={{color:'#ef4444',fontSize:'0.85rem',animation:'blink 1s infinite'}}>🎤 Parlez maintenant...</span>
              <button onClick={stopListening} style={{background:'#ef4444',color:'white',border:'none',padding:'0.3rem 0.8rem',borderRadius:'10px',cursor:'pointer',fontSize:'0.8rem'}}>⏹ Stop</button>
            </div>
          )}

          {/* INPUT */}
          <form onSubmit={handleSubmit} style={{padding:'1rem 1.5rem',borderTop:'1px solid rgba(255,255,255,0.1)'}}>
            <div style={{display:'flex',gap:'0.5rem',alignItems:'center'}}>
              <button type="button" onClick={isListening ? stopListening : startListening} disabled={isLoading}
                style={btnStyle(isListening?'linear-gradient(135deg,#ef4444,#dc2626)':'linear-gradient(135deg,#7c3aed,#5b21b6)', isLoading)}>
                {isListening ? '⏹' : '🎤'}
              </button>
              <input type="text" value={input} onChange={e => setInput(e.target.value)}
                placeholder={`Parlez ou écrivez en ${LANGUES[langue].label.split(' ')[1]}...`}
                disabled={isLoading || isListening}
                style={{flex:1,padding:'0.8rem 1rem',borderRadius:'15px',border:'2px solid rgba(16,185,129,0.3)',background:'rgba(15,23,42,0.8)',color:'white',fontSize:'0.9rem',outline:'none'}} />
              <button type="submit" disabled={isLoading || !input.trim()} style={btnStyle('linear-gradient(135deg,#10b981,#059669)', isLoading || !input.trim())}>
                ➤
              </button>
            </div>
            <p style={{color:'#475569',fontSize:'0.7rem',textAlign:'center',marginTop:'0.5rem',marginBottom:0}}>
              🎤 Micro • 🔊 Audio • 🌐 8 langues • 🇬🇵 BOUDOUM
            </p>
          </form>
          </> }
        </div>
      )}

      <style jsx>{`
        @keyframes pulse { 0%,100%{transform:scale(1);box-shadow:0 10px 40px rgba(16,185,129,0.5)} 50%{transform:scale(1.05);box-shadow:0 15px 50px rgba(16,185,129,0.7)} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.5} }
        .bot-button:hover { transform:scale(1.1); box-shadow:0 15px 50px rgba(16,185,129,0.7); }
        input:focus { border-color:#10b981 !important; }
      `}</style>
    </>
  )
}
