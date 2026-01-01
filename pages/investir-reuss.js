import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function InvestirReuss() {
  const [threats, setThreats] = useState(1240);
  const [learningLevel, setLearningLevel] = useState(99.1);
  const [armyPower, setArmyPower] = useState(1000000);
  
  const pays = ["France", "Belgique", "Italie", "Allemagne", "Suède", "Singapour", "Australie", "Espagne", "Brésil", "Royaume-Uni", "Inde", "Nouvelle-Zélande", "États-Unis", "Canada"];
  const contractAddress = "0x4b3bFf4b58d22Ad363bb260e22032414d4CfdDB8";

  const socialLinks = {
    tiktok: [
      { name: "Principal", url: "https://www.tiktok.com/@reussitess" },
      { name: "Influenceur", url: "https://www.tiktok.com/@influenceurreussitess" },
      { name: "Amour Gwadloup", url: "https://www.tiktok.com/@amourguadeloupe" },
      { name: "France", url: "https://www.tiktok.com/@reussitessfrance" },
      { name: "Allemagne", url: "https://www.tiktok.com/@reussitessdeutschland" }
    ],
    networks: [
      { name: "Instagram", url: "https://instagram.com/reussitess", icon: "📸" },
      { name: "Threads", url: "https://www.threads.net/@am.our4602", icon: "🧵" },
      { name: "Snapchat", url: "https://www.snapchat.com/add/reussitess", icon: "👻" },
      { name: "Reddit", url: "https://www.reddit.com/u/Ornery-Summer-1014/s/2Kfz43iK7m", icon: "🤖" },
      { name: "Discord", url: "https://discord.com/invite/AMOUR#3318", icon: "💬" }
    ],
    facebook: [
      { name: "Perso", url: "https://www.facebook.com/rony.porinus" },
      { name: "Pro", url: "https://www.facebook.com/popo97112" },
      { name: "Groupe", url: "https://facebook.com/groups/901428214856242/" },
      { name: "SOS PC", url: "https://www.facebook.com/sospcadomicile/" }
    ]
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setThreats(prev => prev + Math.floor(Math.random() * 3));
      setLearningLevel(prev => Math.min(prev + 0.001, 99.99));
      setArmyPower(prev => prev + Math.floor(Math.random() * 50));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ backgroundColor: '#020617', color: '#f8fafc', minHeight: '100vh', padding: '15px', fontFamily: 'Inter, sans-serif' }}>
      <main style={{ maxWidth: '800px', margin: '0 auto', background: '#0f172a', padding: '30px', borderRadius: '25px', border: '2px solid #3b82f6', boxShadow: '0 0 50px rgba(59, 130, 246, 0.3)' }}>
        
        <header style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ color: '#3b82f6', fontSize: '1.5rem', fontWeight: '900' }}>REUSSITESS© NEURO-X : CENTRE DE COMMANDEMENT</h1>
          <p style={{ color: '#00ff41', fontWeight: 'bold', fontSize: '0.9rem' }}>GUADELOUPE - TERRES DE CHAMPIONS - BOUDOUM !</p>
        </header>

        {/* SECTION 1 : ARMÉE ET SÉCURITÉ (Ce qu'il y avait avant) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '25px' }}>
          <div style={{ background: '#000', padding: '15px', borderRadius: '15px', border: '1px solid #ef4444' }}>
            <p style={{ fontSize: '0.7rem', color: '#94a3b8' }}>MENACES NEUTRALISÉES</p>
            <h2 style={{ color: '#ef4444', margin: '0' }}>{threats}</h2>
          </div>
          <div style={{ background: '#000', padding: '15px', borderRadius: '15px', border: '1px solid #00ff41' }}>
            <p style={{ fontSize: '0.7rem', color: '#94a3b8' }}>AUTO-APPRENTISSAGE</p>
            <h2 style={{ color: '#00ff41', margin: '0' }}>{learningLevel.toFixed(2)}%</h2>
          </div>
        </div>

        {/* SECTION CONTRAT (Ce qu'il y avait avant) */}
        <section style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '20px', borderRadius: '15px', border: '1px solid #3b82f6', marginBottom: '30px' }}>
          <h3 style={{ color: '#fff', fontSize: '0.9rem' }}>🛡️ UNITÉ DE PUISSANCE : 1 000 000 000 REUSS</h3>
          <code style={{ color: '#60a5fa', fontSize: '0.75rem', wordBreak: 'break-all' }}>{contractAddress}</code>
        </section>

        {/* SECTION 2 : LA TOILE D'ARAIGNÉE MONDIALE (Ajout) */}
        <section style={{ marginBottom: '30px' }}>
          <h3 style={{ color: '#3b82f6', fontSize: '1rem', borderBottom: '1px solid #1e293b', paddingBottom: '10px' }}>🕸️ TOILE D'ARAIGNÉE SOCIALE (14 PAYS)</h3>
          
          <p style={{ fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '15px' }}>Escadron TikTok & Réseaux de Propagande Positive :</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px', marginBottom: '20px' }}>
            {socialLinks.tiktok.map((tk, i) => (
              <a key={i} href={tk.url} target="_blank" rel="noopener noreferrer" style={{ background: '#000', padding: '10px', borderRadius: '10px', border: '1px solid #ff0050', color: '#fff', fontSize: '0.7rem', textDecoration: 'none', textAlign: 'center' }}>
                TIKTOK {tk.name.toUpperCase()}
              </a>
            ))}
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
            {socialLinks.networks.map((net, i) => (
              <a key={i} href={net.url} target="_blank" rel="noopener noreferrer" style={{ background: '#1e293b', padding: '8px 12px', borderRadius: '50px', border: '1px solid #3b82f6', color: '#fff', fontSize: '0.7rem', textDecoration: 'none' }}>
                {net.icon} {net.name}
              </a>
            ))}
          </div>

          <div style={{ background: '#111827', padding: '15px', borderRadius: '15px' }}>
            {socialLinks.facebook.map((fb, i) => (
              <a key={i} href={fb.url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', color: '#60a5fa', fontSize: '0.75rem', marginRight: '15px', textDecoration: 'none' }}>
                📘 {fb.name}
              </a>
            ))}
          </div>
        </section>

        <footer style={{ textAlign: 'center', borderTop: '1px solid #1e293b', paddingTop: '20px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '5px', marginBottom: '15px' }}>
            {pays.map(p => <span key={p} style={{ fontSize: '0.55rem', background: '#1e293b', padding: '2px 6px', borderRadius: '3px', color: '#94a3b8' }}>{p}</span>)}
          </div>
          <p style={{ color: '#00ff41', fontWeight: 'bold', letterSpacing: '1px' }}>POSITIVITÉ À L'INFINI — BOUDOUM !</p>
          <Link href="/" style={{ color: '#475569', fontSize: '0.7rem', textDecoration: 'none', marginTop: '10px', display: 'block' }}>← RETOUR AU PORTAIL</Link>
        </footer>
      </main>
    </div>
  );
}
