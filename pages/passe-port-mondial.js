import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PasseportMondial() {
  const [terminal, setTerminal] = useState(['[SYSTEM] Initialisation du protocole de sécurité...', '[INFO] Vérification des 14 zones internationales...']);
  const [isVerified, setIsVerified] = useState(false);

  const pays = ["France", "Angleterre", "Italie", "Allemagne", "Suède", "Singapour", "Australie", "Espagne", "Brésil", "Royaume-Uni", "Inde", "Nouvelle-Zélande", "États-Unis", "Canada"];

  useEffect(() => {
    const sequence = [
      "[CRYPTO] Génération de la clé RSA-4096...",
      "[AUTH] Validation du certificat mondial...",
      "[SCAN] Recherche de l'utilisateur dans les 14 pays...",
      "[OK] Zone confirmée. Accès sécurisé AirPods débloqué."
    ];
    
    sequence.forEach((msg, i) => {
      setTimeout(() => {
        setTerminal(prev => [...prev, msg]);
        if (i === sequence.length - 1) setIsVerified(true);
      }, (i + 1) * 1500);
    });
  }, []);

  return (
    <div style={{ backgroundColor: '#000', color: '#00ff41', padding: '40px', minHeight: '100vh', fontFamily: 'monospace', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      {/* BOUTON RETOUR ACCUEIL */}
      <div style={{ alignSelf: 'flex-start', marginBottom: '20px' }}>
        <Link href="/" style={{ color: '#00ff41', textDecoration: 'none', border: '1px solid #00ff41', padding: '8px 15px', borderRadius: '5px', fontSize: '12px' }}>
          &lt; REUSSITESS_ACCUEIL
        </Link>
      </div>

      <h1 style={{ borderBottom: '2px solid #00ff41', paddingBottom: '10px', textAlign: 'center' }}>🛂 AIR-BOT CRYPTO-SÉCURITÉ</h1>
      
      <div style={{ width: '100%', maxWidth: '700px', background: '#050505', border: '1px solid #333', padding: '20px', borderRadius: '10px', boxShadow: '0 0 20px rgba(0,255,65,0.1)', margin: '20px 0' }}>
        {terminal.map((line, i) => (
          <div key={i} style={{ marginBottom: '8px' }}>
            <span style={{ color: '#008f11' }}>[REUSSITESS-OS]</span> {line}
          </div>
        ))}
        {isVerified && (
          <div style={{ marginTop: '30px', textAlign: 'center', border: '2px dashed #00ff41', padding: '20px', animation: 'blink 1s infinite' }}>
            <h2 style={{ color: '#fff' }}>🛡️ ACCÈS AIRPODS CERTIFIÉ</h2>
            <a href="https://www.reussitess.fr/airpods" style={{ background: '#00ff41', color: '#000', padding: '15px 30px', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.2rem', display: 'inline-block', marginTop: '10px', borderRadius: '5px' }}>
               🎧 RÉCLAMER MES AIRPODS PRO
            </a>
          </div>
        )}
      </div>

      <div style={{ marginTop: 'auto', textAlign: 'center' }}>
        <h3 style={{ color: '#444' }}>ZONES DE CONFORMITÉ INTERNATIONALES</h3>
        <p style={{ color: '#222', maxWidth: '600px' }}>{pays.join(' • ')}</p>
      </div>

      <style jsx>{`
        @keyframes blink {
          0% { opacity: 1; }
          50% { opacity: 0.7; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
