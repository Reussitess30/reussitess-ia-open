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

const URL_REGEX = new RegExp('(https?://[^\\s<>"]+)', 'g')
function renderBotMessage(text) {
  // D'abord extraire les liens markdown AVANT l'échappement HTML
  const links = []
  const placeholder = text.replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, (m, txt, url) => {
    const id = '%%LINK' + links.length + '%%'
    links.push('<a href="' + url.replace('http://', 'https://') + '" target="_blank" rel="noopener noreferrer" style="color:#10b981;text-decoration:underline;">' + txt + '</a>')
    return id
  })
  // Ensuite échapper le HTML
  let result = placeholder
    .replace(/BOUDOUM/g, 'Boudoum')
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')
    .replace(/\*(.+?)\*/g,'<em>$1</em>')
    .replace(URL_REGEX, (m) => '<a href="' + m + '" target="_blank" rel="noopener noreferrer nofollow" onclick="window.open(this.href,\'_blank\');return false;" style="color:#10b981;text-decoration:underline;word-break:break-all;">' + m + '</a>')
    .replace(/\n/g,'<br/>')
  // Restaurer les liens
  links.forEach((link, i) => { result = result.replace('%%LINK' + i + '%%', link) })
  return result
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
  const [sessionId] = useState(() => 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2,9))
  const [suggestions, setSuggestions] = useState(['🌋 Séismes Antilles','🌀 Cyclones','🌤️ Météo DOM-TOM','💱 Devises XOF/XAF','⛽ Carburant DOM-TOM','📅 Calendrier scolaire','💎 Prix REUSS','🎓 Bourses francophones','💼 Emploi Caraïbes','🌴 Traduire créole','📚 Bibliothèque caribéenne','📰 Actualités Guadeloupe','💰 Calculateur Amazon','📄 Créer mon CV'])
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [activeTab, setActiveTab] = useState('chat')
  const [nexusStats, setNexusStats] = useState(null)
  const [nexusLoading, setNexusLoading] = useState(false)
  const [visitorCount, setVisitorCount] = useState(null)
  const messagesEndRef = useRef(null)
  const recognitionRef = useRef(null)

  const botPersonality = {
    name: "REUSSITESS AI", origin: "Guadeloupe 🇬🇵",
    motto: "EXCELLENCE • INNOVATION • SUCCÈS", signature: "BOUDOUM",
    expertise: ["Expert mondial IA","Blockchain Polygon","8 langues actives","Entrepreneuriat caribéen"]
  }

  const scrollToBottom = () => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }
  useEffect(() => {
    fetch('/api/suggestions')
      .then(r => r.json())
      .then(d => { if(Array.isArray(d) && d.length > 0) setSuggestions(d) })
      .catch(() => {})
  }, [])

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
    fetch('/api/visitors').then(r=>r.json()).then(d=>{ if(d.count) setVisitorCount(d.count) }).catch(()=>{})
  }, [])

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{ role: 'assistant', content: `🌍 **Salutations du monde !**\n\nJe suis **REUSSITESS AI**, votre assistant révolutionnaire né en **Guadeloupe** 🇬🇵 - Terres de Champions !\n\n✨ IA Universelle • 🌐 8 langues actives • 🔐 Blockchain • 💎 Token REUSS\n\n🎤 **NOUVEAU** — Parlez-moi ! Cliquez sur le micro et je vous réponds en audio dans votre langue !\n\nChoisissez votre langue en haut à droite, puis cliquez sur 🎤\n\n**BOUDOUM** 🎯` }])
    }
  }, [])

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      const chunks = []
      recorder.ondataavailable = e => chunks.push(e.data)
      recorder.onstop = async () => {
        stream.getTracks().forEach(t => t.stop())
        const blob = new Blob(chunks, { type: 'audio/webm' })
        const reader = new FileReader()
        reader.onload = async () => {
          const base64 = reader.result.split(',')[1]
          setIsListening(false)
          try {
            const res = await fetch('/api/superbot/whisper', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ audio: base64, langue: LANGUES[langue].code.split('-')[0] })
            })
            const data = await res.json()
            if (data.text) {
              setInput(data.text)
              setTimeout(() => submitMessage(data.text), 300)
            }
          } catch(e) { console.error('Whisper error:', e) }
        }
        reader.readAsDataURL(blob)
      }
      recognitionRef.current = recorder
      recorder.start(250)
      setIsListening(true)
      setTimeout(() => { if (recorder.state === 'recording') recorder.stop() }, 5000)
    } catch(e) {
      if (e.name === 'NotAllowedError') alert('Autorisez le microphone dans Chrome.')
    }
  }

  const _unused = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) return
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
    setSelectedImage(null)
    setImagePreview(null)
    setMessages(prev => [...prev, { role: 'user', content: userMessage + (selectedImage ? ' 📷' : '') }])
    setIsLoading(true)
    try {
      const response = await fetch('/api/superbot/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          image: selectedImage || undefined,
          imageQuestion: selectedImage ? userMessage : undefined,
          personality: botPersonality,
          context: messages,
          langue,
          datetime: {
            date: new Date().toLocaleDateString('fr-FR', {weekday:'long',year:'numeric',month:'long',day:'numeric'}),
            heure: new Date().toLocaleTimeString('fr-FR', {hour:'2-digit',minute:'2-digit'}),
            timestamp: new Date().toISOString(),
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
          }
        })
      })
      const data = await response.json()
      const botResponse = data.response || "Désolé, une erreur s'est produite. Réessayez ! 🔄"
      const botPdfAction = data.pdfAction || null
      // Streaming simulé — affichage mot par mot
      const words = botResponse.split(' ')
      let current = ''
      setMessages(prev => [...prev, { role: 'assistant', content: '', pdfAction: botPdfAction }])
      for (let i = 0; i < words.length; i++) {
        current += (i === 0 ? '' : ' ') + words[i]
        const snapshot = current
        setMessages(prev => {
          const updated = [...prev]
          updated[updated.length - 1] = { ...updated[updated.length - 1], content: snapshot }
          return updated
        })
        await new Promise(r => setTimeout(r, 18))
      }
      if (audioEnabled) speakResponse(botResponse, LANGUES[langue].voice)
      // Sauvegarder conversation
      fetch('/api/conversations', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ sessionId, messages: [...messages, { role: 'user', content: userMessage }, { role: 'assistant', content: botResponse }] }) }).catch(()=>{})
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
        fetch('https://api.coingecko.com/api/v3/simple/price?ids=polygon-ecosystem-token&vs_currencies=usd').then(r=>r.json()).catch(()=>null)
      ])
      const pair = token?.pairs?.[0]
      setNexusStats({
        siteOk: site.ok,
        price: pair?.priceUsd || 'N/A',
        change: pair?.priceChange?.h24 || 'N/A',
        volume: pair?.volume?.h24 || 'N/A',
        liquidity: pair?.liquidity?.usd || 'N/A',
        pol: matic?.['polygon-ecosystem-token']?.usd || 'N/A',
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
                <button aria-label="Activer/désactiver audio" onClick={() => { setAudioEnabled(!audioEnabled); if(!audioEnabled) stopSpeaking() }}
                  style={{background: audioEnabled?'rgba(255,255,255,0.3)':'rgba(0,0,0,0.3)', border:'none', borderRadius:'8px', padding:'0.4rem 0.6rem', cursor:'pointer', fontSize:'1rem', color:'white'}}>
                  {audioEnabled ? '🔊' : '🔇'}
                </button>
                <div style={{position:'relative'}}>
                  <button aria-label="Choisir la langue" onClick={() => setShowLangMenu(!showLangMenu)}
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
                                    <button aria-label="Rafraîchir statistiques Nexus" onClick={fetchNexusStats} style={{background:'linear-gradient(135deg,#10b981,#3b82f6)',border:'none',color:'white',padding:'0.8rem',borderRadius:'12px',cursor:'pointer',fontWeight:'bold'}}>
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
              {[['🛒','Amazon','Amazon'],['🛒','Amazon Affiliation','Amazon_Affiliation'],['🌍','Afrique','Afrique'],['⭐','Afro-Caraïbes 1','Afro_Caraibes_1'],['⭐','Afro-Caraïbes 2','Afro_Caraibes_2'],['🇩🇪','Allemagne Essentiel','Allemagne_Essentiel'],['🎌','Anime & Manga','Anime_Manga'],['🏛️','Architecture','Architecture'],['🎨','Art','Art'],['⭐','Astrologie','Astrologie'],['🔭','Astronomie','Astronomie'],['🇦🇺','Australie Essentiel','Australie_Essentiel'],['🇧🇪','Belgique Essentiel','Belgique_Essentiel'],['🛍️','Boutique Motivation','Boutique_Motivation'],['🇧🇷','Brésil Essentiel','Bresil_Essentiel'],['📈','Business','Business'],['🇨🇦','Canada Essentiel','Canada_Essentiel'],['🇬🇵','Caraïbes','Caraibes'],['🎭','Cinéma','Cinéma'],['💬','Communication','Communication'],['💎','Crypto','Crypto'],['🍽️','Cuisine Antillaise','CuisineAntillaise'],['🍽️','Cuisine Antillaise 2','Cuisine_Antillaise'],['🌍','Culture du Monde','Culture_du_Monde'],['💪','Dépassement de Soi','DepassementSoi'],['💡','Développement Soi','DeveloppementSoi'],['💡','Développement Personnel','Developpement_Personnel'],['⚖️','Droit','Droit'],['⚖️','Droit Consommateur','DroitConsommateur'],['⚖️','Droit Étrangers','DroitEtrangers'],['⚖️','Droit Famille','DroitFamille'],['📱','Droit Numérique','DroitNumerique2'],['⚖️','Droit Travail','DroitTravail'],['⚖️','Droits Citoyen','DroitsCitoyen'],['📱','Droits Numériques','DroitsNumeriques'],['🔍','Découvertes','Découvertes'],['🚀','Entrepreneuriat','Entrepreneuriat'],['🌿','Environnement','Environnement'],['🌶️','Épices du Monde','EpicesMonde'],['🇪🇸','Espagne Essentiel','Espagne_Essentiel'],['💰','Finance Personnelle','Finance_Personnelle'],['💰','Finances Personnelles','FinancesPersonnelles'],['🇫🇷','France Essentiel','France_Essentiel'],['🍴','Gastronomie','Gastronomie'],['🌍','Gastronomie Africaine','GastronomieAfricaine'],['😌','Gestion Stress','GestionStress'],['⛏️','GoMining','GoMining'],['✍️','Graphologie','Graphologie'],['🌍','Géographie','Géographie'],['📖','Histoire','Histoire'],['🌿','Huiles Essentielles','HuilesEssentielles'],['🏠','Immobilier','Immobilier'],['🇮🇳','Inde Essentiel','Inde_Essentiel'],['💡','Innovations','Innovations'],['🤖','Intelligence Artificielle','IntelligenceArtificielle'],['❤️','Intelligence Émotionnelle','IntelligenceEmotionnelle'],['🤖','IA','Intelligence_Artificielle'],['🌐','Internet','Internet'],['🇮🇹','Italie Essentiel','Italie_Essentiel'],['🧘','Jeune Detox','JeuneDetox'],['🎮','Jeux Vidéo','Jeux_Video'],['🌐','Langue','Langue'],['🏆','Leadership','Leadership'],['📚','Littérature','Litterature'],['📣','Marketing Digital','MarketingDigital'],['📣','Marketing Digital 2','Marketing_Digital'],['🔢','Maths','Maths'],['💊','Médecine','Medecine'],['🌿','Médecines Douces','MedecinesDouces'],['👗','Mode & Beauté','Mode_Beaute'],['🏛️','Monuments','Monuments'],['🎵','Musique','Musique'],['🏺','Mythologie','Mythologie'],['🔢','Numérologie','Numerologie'],['🥗','Nutrition','Nutrition'],['🇳🇱','Pays-Bas Essentiel','PaysBas_Essentiel'],['👑','Personnalités','Personnalités'],['🏛️','Philosophie','Philosophie'],['📷','Photographie','Photographie'],['🌺','Plantes Antilles','PlantesAntilles'],['🌿','Plantes Médicinales','PlantesMediacinales'],['🗳️','Politique','Politique'],['✨','Positivité','Positivité'],['🧠','Psychologie','Psychologie'],['📱','Réseaux Sociaux','Reseaux_Sociaux'],['💭','Rêves','Reves'],['❤️','Santé','Santé'],['🔬','Sciences','Sciences'],['🇸🇬','Singapour Essentiel','Singapour_Essentiel'],['🙏','Spiritualité','Spiritualite'],['🏃','Sport','Sport'],['🍜','Street Food','StreetFood'],['🇸🇪','Suède Essentiel','Suede_Essentiel'],['🔣','Symbolisme','Symbolisme'],['📱','Tech','Tech'],['🇬🇧','UK Essentiel','UK_Essentiel'],['🇺🇸','USA Essentiel','USA_Essentiel'],['🍷','Vins & Spiritueux','VinsSpiriteux'],['✈️','Voyage','Voyage']].map(([icon,cat,id]) => (
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
                  {msg.role==='assistant' ? (
                    <span dangerouslySetInnerHTML={{__html: renderBotMessage(msg.content)}} />
                  ) : msg.content}
                </div>
                {msg.role==='assistant' && msg.pdfAction && (
                  <div style={{display:'flex',gap:'0.5rem',marginTop:'0.5rem',flexWrap:'wrap'}}>
                    <button onClick={async () => {
                      try {
                        const r = await fetch('/api/generate-pdf', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({type: msg.pdfAction}) })
                        if (!r.ok) throw new Error('erreur')
                        const blob = await r.blob()
                        const url = URL.createObjectURL(blob)
                        const a = document.createElement('a')
                        a.href = url
                        a.download = msg.pdfAction+'.pdf'
                        a.click()
                        URL.revokeObjectURL(url)
                      } catch(e) { alert('Erreur génération PDF. Réessayez !') }
                    }}
                      style={{padding:'0.3rem 0.7rem',background:'rgba(16,185,129,0.2)',border:'1px solid #10b981',borderRadius:'15px',color:'#10b981',fontSize:'0.72rem',cursor:'pointer',fontWeight:'bold'}}>
                      📄 Télécharger PDF
                    </button>
                    <button aria-label="Télécharger en PDF" onClick={() => {
                        const blob = new Blob([msg.content], {type:'text/plain'})
                        const url = URL.createObjectURL(blob)
                        const a = document.createElement('a')
                        a.href = url
                        a.download = 'reussitess-ai-'+Date.now()+'.txt'
                        a.click()
                        URL.revokeObjectURL(url)
                      }} style={{background:'rgba(16,185,129,0.2)',border:'1px solid rgba(16,185,129,0.4)',color:'white',borderRadius:'8px',padding:'0.4rem 0.8rem',cursor:'pointer',fontSize:'0.75rem'}}>
                      📥 Télécharger
                    </button>
                    <button aria-label="Imprimer ce message" onClick={() => {const w=window.open('');w.document.write('<pre>'+msg.content+'</pre>');w.print();}}
                      style={{padding:'0.3rem 0.7rem',background:'rgba(16,185,129,0.2)',border:'1px solid #10b981',borderRadius:'15px',color:'#10b981',fontSize:'0.72rem',cursor:'pointer',fontWeight:'bold'}}>
                      🖨️ Imprimer
                    </button>
                  </div>
                )}
                {msg.role==='assistant' && audioEnabled && (
                  <button aria-label="Lire à voix haute" onClick={() => speakResponse(msg.content, LANGUES[langue].voice)}
                    style={{background:'none',border:'none',cursor:'pointer',fontSize:'0.75rem',color:'#10b981',padding:'0.2rem 0.5rem',marginTop:'0.2rem'}}>
                    🔊 Écouter
                  </button>
                )}
                {msg.followUp && msg.followUp.length > 0 && msg.role === 'assistant' && msg.followUp.map((q,qi) => (<button key={qi} onClick={() => submitMessage(q)} style={{display:'inline-block',margin:'0.2rem',padding:'0.3rem 0.6rem',background:'rgba(16,185,129,0.1)',border:'1px solid rgba(16,185,129,0.25)',borderRadius:'12px',color:'#10b981',fontSize:'0.7rem',cursor:'pointer'}}>💡 {q}</button>))}
              </div>
            ))}
            {messages.length === 1 && !isLoading && (
              <div style={{display:'flex',flexWrap:'wrap',gap:'0.4rem',marginTop:'0.3rem'}}>
                {suggestions.map(s => (
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
              <button aria-label="Arrêter la lecture" onClick={stopSpeaking} style={{background:'#ef4444',color:'white',border:'none',padding:'0.3rem 0.8rem',borderRadius:'10px',cursor:'pointer',fontSize:'0.8rem'}}>⏹ Stop</button>
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
              <input type="file" id="pdf-upload" accept=".pdf" style={{display:'none'}} onChange={async e => {
                const file = e.target.files[0]
                if (!file) return
                const formData = new FormData()
                formData.append('pdf', file)
                setIsLoading(true)
                try {
                  const r = await fetch('/api/read-pdf', { method: 'POST', body: formData })
                  const d = await r.json()
                  if (d.success) {
                    setInput(`Analyse ce document PDF (${d.pages} pages): ${d.text.substring(0,500)}...`)
                  }
                } catch(e) {}
                setIsLoading(false)
              }} />
              <input type="file" id="img-upload" accept="image/*" style={{display:'none'}} onChange={e => {
                const file = e.target.files[0]
                if (file) {
                  const reader = new FileReader()
                  reader.onload = () => {
                    const base64 = reader.result.split(',')[1]
                    setSelectedImage(base64)
                    setImagePreview(reader.result)
                  }
                  reader.readAsDataURL(file)
                }
              }} />
              <button type="button" onClick={() => document.getElementById('pdf-upload').click()} disabled={isLoading}
                      style={{padding:'0.4rem 0.6rem',borderRadius:'10px',border:'none',background:'rgba(55,65,81,0.8)',color:'white',cursor:'pointer',fontSize:'0.85rem',flexShrink:0,opacity:isLoading?0.5:1}}
                      title="Envoyer un PDF">
                    📄
                </button>
                <button type="button" onClick={() => document.getElementById('img-upload').click()} disabled={isLoading}
                style={{padding:'0.4rem 0.6rem',borderRadius:'10px',border:'none',background:selectedImage?'linear-gradient(135deg,#f59e0b,#d97706)':'rgba(55,65,81,0.8)',color:'white',cursor:'pointer',fontSize:'0.85rem',flexShrink:0,opacity:isLoading?0.5:1}}
                title="Envoyer une image">
                📷
              </button>
              <button type="button" onClick={isListening ? stopListening : startListening} disabled={isLoading}
                style={{padding:'0.4rem 0.6rem',borderRadius:'10px',border:'none',background:isListening?'linear-gradient(135deg,#ef4444,#dc2626)':'linear-gradient(135deg,#7c3aed,#5b21b6)',color:'white',cursor:'pointer',fontSize:'0.85rem',flexShrink:0,opacity:isLoading?0.5:1}}>
                {isListening ? '⏹' : '🎤'}
              </button>
              <input type="text" value={input} onChange={e => setInput(e.target.value)}
                placeholder={`Parlez ou écrivez en ${LANGUES[langue].label.split(' ')[1]}...`}
                disabled={isLoading || isListening}
                style={{flex:1,minWidth:0,maxWidth:'calc(100% - 130px)',padding:'0.8rem 1rem',borderRadius:'15px',border:'2px solid rgba(16,185,129,0.3)',background:'rgba(15,23,42,0.8)',color:'white',fontSize:'0.9rem',outline:'none'}} />
              <button type="submit" disabled={isLoading || !input.trim()} style={btnStyle('linear-gradient(135deg,#10b981,#059669)', isLoading || !input.trim())}>
                ➤
              </button>
            </div>
            {imagePreview && (
                <div style={{display:'flex',alignItems:'center',gap:'0.5rem',marginTop:'0.5rem',background:'rgba(245,158,11,0.1)',padding:'0.5rem',borderRadius:'10px'}}>
                  <img src={imagePreview} alt="Aperçu image à envoyer" style={{width:'40px',height:'40px',objectFit:'cover',borderRadius:'8px'}} />
                  <span style={{color:'#f59e0b',fontSize:'0.8rem'}}>Image prête à envoyer</span>
                  <button onClick={() => {setSelectedImage(null);setImagePreview(null)}} style={{marginLeft:'auto',background:'none',border:'none',color:'#ef4444',cursor:'pointer',fontSize:'1rem'}}>✕</button>
                </div>
              )}
              <p style={{color:'#475569',fontSize:'0.7rem',textAlign:'center',marginTop:'0.5rem',marginBottom:0}}>
              🎤 Micro • 📷 Image • 🔊 Audio • 🌐 8 langues • 🇬🇵 BOUDOUM
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
