import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function InvestirReuss() {
  const [threats, setThreats] = useState(1240);
  const [learningLevel, setLearningLevel] = useState(99.1);
  const [armyPower, setArmyPower] = useState(1000000);

  const pays = ["France", "Angleterre", "Italie", "Allemagne", "Suède", "Singapour", "Australie", "Espagne", "Brésil", "Royaume-Uni", "Inde", "Nouvelle-Zélande", "États-Unis", "Canada"];
  const contractAddress = "0xbe8777aB450937bf107090F4F5F7c4834Db079cF";
  const genesisHash = "0xbc4e93ca3b4a04c5a5fa3b2ab19050fb85aa01e24df856d3be0171f163019a16";

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

        {/* SECTION 1 : ARMÉE ET SÉCURITÉ */}
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

        {/* SECTION CONTRAT ET HASH */}
        <section style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '20px', borderRadius: '15px', border: '1px solid #3b82f6', marginBottom: '30px' }}>
          <h3 style={{ color: '#fff', fontSize: '0.9rem' }}>🛡️ UNITÉ DE PUISSANCE : 1 000 000 000 REUSS</h3>
          <p style={{ fontSize: '0.7rem', color: '#94a3b8', margin: '10px 0' }}>Hash Genèse: <code style={{color: '#00ff41'}}>{genesisHash}</code></p>
          <a href={`https://polygonscan.com/token/${contractAddress}`} target="_blank" rel="noopener noreferrer" style={{ display: 'block', background: '#3b82f6', color: '#fff', textAlign: 'center', padding: '10px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.8rem', marginBottom: '10px' }}>
            VÉRIFIER SUR LA BLOCKCHAIN →
          </a>

          {/* 📄 BOUTON WHITEPAPER — NOUVEAU */}
          <a
            href="/documents/REUSS_Whitepaper_v1.0_2026.docx"
            download
            style={{
              display: 'block',
              background: 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)',
              color: '#fff',
              textAlign: 'center',
              padding: '10px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 'bold',
              fontSize: '0.8rem',
              border: '1px solid rgba(167,139,250,0.4)',
              boxShadow: '0 0 15px rgba(124,58,237,0.3)',
            }}
          >
            📄 TÉLÉCHARGER LE WHITEPAPER OFFICIEL REUSS →
          </a>
        </section>

        {/* RUBRIQUE JURIDIQUE */}
        <section style={{ marginBottom: '30px', padding: '20px', background: '#000', borderRadius: '15px', border: '1px solid #ef4444' }}>
          <h3 style={{ color: '#ef4444', fontSize: '0.9rem', marginBottom: '10px', fontWeight: 'bold' }}>⚖️ PROTECTION JURIDIQUE & RESPONSABILITÉ</h3>
          <div style={{ fontSize: '0.75rem', color: '#cbd5e1', lineHeight: '1.5' }}>
            <p><strong>1. Nature :</strong> Infrastructure technologique expérimentale (Guadeloupe).</p>
            <p><strong>2. Non-Investissement :</strong> L'acquisition de REUSS n'est pas un produit financier régulé.</p>
            <p><strong>3. Responsabilité :</strong> Vous êtes seul responsable de vos actifs. Aucun remboursement possible.</p>
          </div>
        </section>

        {/* SECTION 2 : LA TOILE D'ARAIGNÉE MONDIALE */}
        <section style={{ marginBottom: '30px' }}>
          <h3 style={{ color: '#3b82f6', fontSize: '1rem', borderBottom: '1px solid #1e293b', paddingBottom: '10px' }}>🕸️ TOILE D'ARAIGNÉE SOCIALE (14 PAYS)</h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px', marginBottom: '20px', marginTop: '15px' }}>
            {socialLinks.tiktok.map((tk, i) => (
              <a key={i} href={tk.url} target="_blank" rel="noopener noreferrer" style={{ background: '#000', padding: '10px', borderRadius: '10px', border: '1px solid #ff0050', color: '#fff', fontSize: '0.7rem', textDecoration: 'none', textAlign: 'center' }}>
                TIKTOK {tk.name.toUpperCase()}
              </a>
            ))}
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px', justifyContent: 'center' }}>
            {socialLinks.networks.map((net, i) => (
              <a key={i} href={net.url} target="_blank" rel="noopener noreferrer" style={{ background: '#1e293b', padding: '8px 12px', borderRadius: '50px', border: '1px solid #3b82f6', color: '#fff', fontSize: '0.7rem', textDecoration: 'none' }}>
                {net.icon} {net.name}
              </a>
            ))}
          </div>

          <div style={{ background: '#111827', padding: '15px', borderRadius: '15px', display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
            {socialLinks.facebook.map((fb, i) => (
              <a key={i} href={fb.url} target="_blank" rel="noopener noreferrer" style={{ color: '#60a5fa', fontSize: '0.75rem', marginRight: '15px', textDecoration: 'none' }}>
                📘 {fb.name}
              </a>
            ))}
          </div>
        </section>

        {/* BOUTON RETOUR DISCRET */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <Link href="/" style={{ background: '#1e293b', color: '#fff', padding: '6px 15px', borderRadius: '20px', border: '1px solid #3b82f6', textDecoration: 'none', fontSize: '0.7rem' }}>
            ↩ Retour
          </Link>
        </div>

        <footer style={{ textAlign: 'center', borderTop: '1px solid #1e293b', paddingTop: '20px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '5px', marginBottom: '15px' }}>
            {pays.map(p => <span key={p} style={{ fontSize: '0.55rem', background: '#1e293b', padding: '2px 6px', borderRadius: '3px', color: '#94a3b8' }}>{p}</span>)}
          </div>
          <p style={{ color: '#00ff41', fontWeight: 'bold', letterSpacing: '1px' }}>POSITIVITÉ À L'INFINI — BOUDOUM !</p>
        </footer>
      </main>
    </div>
  );
}
