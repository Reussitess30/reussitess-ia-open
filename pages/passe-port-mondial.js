import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PasseportMondial() {
  const [terminal, setTerminal] = useState(['[SYSTEM] Initialisation...', '[INFO] Vérification des 14 zones...']);
  const [isVerified, setIsVerified] = useState(false);

  const pays = ["France", "Angleterre", "Italie", "Allemagne", "Suède", "Singapour", "Australie", "Espagne", "Brésil", "Royaume-Uni", "Inde", "Nouvelle-Zélande", "États-Unis", "Canada"];

  useEffect(() => {
    const timer = setTimeout(() => setIsVerified(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ backgroundColor: '#000', color: '#00ff41', minHeight: '100vh', fontFamily: 'monospace', display: 'flex', flexDirection: 'column' }}>
      
      {/* BARRE DE NAVIGATION FIXE (Toujours présente pour le retour) */}
      <nav style={{ width: '100%', padding: '15px 20px', background: '#0a0a0a', borderBottom: '1px solid #00ff41', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100 }}>
        <span style={{ fontWeight: 'bold', fontSize: '14px' }}>🛡️ AIR-BOT CRYPTO-V2</span>
        <Link href="/" style={{ background: '#00ff41', color: '#000', padding: '8px 15px', borderRadius: '5px', textDecoration: 'none', fontWeight: '900', fontSize: '12px' }}>
          🏠 RETOUR ACCUEIL
        </Link>
      </nav>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ width: '100%', maxWidth: '600px', background: '#050505', border: '1px solid #333', padding: '30px', borderRadius: '15px', boxShadow: '0 0 30px rgba(0,255,65,0.1)' }}>
          
          <div style={{ marginBottom: '20px' }}>
            {terminal.map((line, i) => (
              <div key={i} style={{ marginBottom: '5px', fontSize: '13px' }}>{`> ${line}`}</div>
            ))}
          </div>

          {isVerified && (
            <div style={{ textAlign: 'center', borderTop: '1px solid #333', paddingTop: '20px' }}>
              <h2 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '20px' }}>ACCÈS CERTIFIÉ</h2>
              
              {/* Le bouton pour réclamer les AirPods */}
              <a href="https://www.reussitess.fr/airpods" style={{ background: '#00ff41', color: '#000', padding: '15px 25px', display: 'block', textDecoration: 'none', fontWeight: '900', borderRadius: '8px', fontSize: '1.1rem', marginBottom: '15px' }}>
                🎧 RÉCLAMER MES AIRPODS PRO
              </a>

              {/* Rappel du retour juste en dessous du bouton pour ceux qui hésitent */}
              <Link href="/" style={{ color: '#00ff41', fontSize: '11px', textDecoration: 'underline' }}>
                Ou retourner à la sélection des quiz
              </Link>
            </div>
          )}
        </div>
      </div>

      <div style={{ padding: '20px', textAlign: 'center', opacity: 0.3 }}>
        <p style={{ fontSize: '10px' }}>{pays.join(' | ')}</p>
      </div>
    </div>
  );
}
