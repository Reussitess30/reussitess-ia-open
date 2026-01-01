import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function InvestirReuss() {
  const [learningLevel, setLearningLevel] = useState(99.1);
  const pays = ["France", "Angleterre", "Italie", "Allemagne", "Suède", "Singapour", "Australie", "Espagne", "Brésil", "Royaume-Uni", "Inde", "Nouvelle-Zélande", "États-Unis", "Canada"];

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

  return (
    <div style={{ backgroundColor: '#020617', color: '#f8fafc', minHeight: '100vh', padding: '10px', fontFamily: 'Inter, sans-serif' }}>
      <main style={{ maxWidth: '600px', margin: '0 auto', background: '#0f172a', padding: '25px', borderRadius: '30px', border: '2px solid #3b82f6', boxShadow: '0 0 60px rgba(59, 130, 246, 0.4)' }}>
        
        <header style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ color: '#3b82f6', fontSize: '1.4rem', fontWeight: '900', textTransform: 'uppercase' }}>REUSSITESS© Global Spider Web</h1>
          <p style={{ color: '#00ff41', fontSize: '0.8rem', fontWeight: 'bold' }}>GUADELOUPE - TERRES DE CHAMPIONS</p>
        </header>

        {/* SECTION TIKTOK (LES 5 UNITÉS) */}
        <section style={{ marginBottom: '25px' }}>
          <h3 style={{ fontSize: '0.9rem', color: '#60a5fa', marginBottom: '10px' }}>⚔️ L'ESCADRON TIKTOK (200 IA SYNC)</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {socialLinks.tiktok.map((tk, i) => (
              <a key={i} href={tk.url} target="_blank" style={{ background: '#000', padding: '12px', borderRadius: '12px', border: '1px solid #ff0050', color: '#fff', fontSize: '0.7rem', textDecoration: 'none', textAlign: 'center', fontWeight: 'bold' }}>
                {tk.name}
              </a>
            ))}
          </div>
        </section>

        {/* SECTION MULTI-RÉSEAUX */}
        <section style={{ marginBottom: '25px' }}>
          <h3 style={{ fontSize: '0.9rem', color: '#60a5fa', marginBottom: '10px' }}>🛰️ RÉSEAU DE PROPAGANDE MONDIAL</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {socialLinks.networks.map((net, i) => (
              <a key={i} href={net.url} target="_blank" style={{ background: '#1e293b', padding: '10px 15px', borderRadius: '50px', border: '1px solid #3b82f6', color: '#fff', fontSize: '0.75rem', textDecoration: 'none' }}>
                {net.icon} {net.name}
              </a>
            ))}
          </div>
        </section>

        {/* SECTION FACEBOOK */}
        <section style={{ marginBottom: '30px' }}>
          <h3 style={{ fontSize: '0.9rem', color: '#60a5fa', marginBottom: '10px' }}>🔵 QG FACEBOOK & COMMUNAUTÉS</h3>
          {socialLinks.facebook.map((fb, i) => (
            <a key={i} href={fb.url} target="_blank" style={{ display: 'block', background: '#000', marginBottom: '8px', padding: '12px', borderRadius: '10px', border: '1px solid #1877F2', color: '#fff', fontSize: '0.8rem', textDecoration: 'none' }}>
              {fb.name} →
            </a>
          ))}
        </section>

        <footer style={{ textAlign: 'center', borderTop: '1px solid #1e293b', paddingTop: '20px' }}>
          <p style={{ color: '#3b82f6', fontWeight: 'bold' }}>POSITIVITÉ À L'INFINI - BOUDOUM !</p>
          <p style={{ fontSize: '0.6rem', color: '#475569' }}>PROTÉGÉ PAR L'ARMÉE DES 200 IA DANS LES 14 PAYS</p>
        </footer>
      </main>
    </div>
  );
}
