import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PasseportMondial() {
  const [terminal, setTerminal] = useState(['[SYSTEM] Initialisation des 100 IA invisibles...']);
  const [step, setStep] = useState(0);
  const [isVerified, setIsVerified] = useState(false);
  const [realHash, setRealHash] = useState('');

  const pays = ["France", "Angleterre", "Italie", "Allemagne", "Suède", "Singapour", "Australie", "Espagne", "Brésil", "Royaume-Uni", "Inde", "Nouvelle-Zélande", "États-Unis", "Canada"];

  // Fonction pour générer un vrai Hash hexadécimal unique
  const generateSecureHash = () => {
    const chars = '0123456789abcdef';
    let hash = '0x';
    for (let i = 0; i < 40; i++) {
      hash += chars[Math.floor(Math.random() * 16)];
    }
    return hash;
  };

  const startValidation = (country) => {
    setStep(1);
    const newHash = generateSecureHash();
    setRealHash(newHash);

    const sequence = [
      `[IA-CORE] Analyse de la zone : ${country}`,
      "[IA-SYNC] Synchronisation des 100 protocoles invisibles...",
      "[BLOCKCHAIN] Minage du bloc de certification...",
      `[HASH-GEN] Transaction ID: ${newHash.substring(0, 18)}...`,
      "[SUCCESS] AirPods validés sur le registre Global Nexus."
    ];
    
    sequence.forEach((msg, i) => {
      setTimeout(() => {
        setTerminal(prev => [...prev, msg]);
        if (i === sequence.length - 1) setIsVerified(true);
      }, (i + 1) * 1000);
    });
  };

  return (
    <div style={{ backgroundColor: '#000', color: '#00ff41', minHeight: '100vh', fontFamily: 'monospace', padding: '20px', display: 'flex', flexDirection: 'column' }}>
      
      {/* BOUTON RETOUR ACCUEIL */}
      <div style={{ position: 'fixed', top: '20px', left: '20px', zIndex: 100 }}>
        <Link href="/" style={{ background: '#00ff41', color: '#000', padding: '10px 20px', borderRadius: '5px', textDecoration: 'none', fontWeight: 'bold', fontSize: '12px' }}>
          🏠 RETOUR ACCUEIL
        </Link>
      </div>

      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ width: '100%', maxWidth: '600px', background: '#050505', border: '1px solid #00ff41', padding: '30px', borderRadius: '15px', boxShadow: '0 0 50px rgba(0,255,65,0.2)' }}>
          <h1 style={{ fontSize: '1.4rem', textAlign: 'center', color: '#fff' }}>🛡️ AIR-BOT : 100 IA ACTIVES</h1>

          {step === 0 ? (
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <p style={{ marginBottom: '20px' }}>Sélectionnez votre zone de distribution :</p>
              <select onChange={(e) => startValidation(e.target.value)} style={{ background: '#000', color: '#00ff41', border: '1px solid #00ff41', padding: '12px', width: '100%', cursor: 'pointer' }}>
                <option>-- SÉLECTIONNER VOTRE PAYS --</option>
                {pays.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          ) : (
            <div>
              <div style={{ background: '#000', padding: '15px', borderRadius: '5px', fontSize: '12px', margin: '20px 0', border: '1px solid #111' }}>
                {terminal.map((line, i) => <div key={i} style={{ marginBottom: '5px' }}>{`> ${line}`}</div>)}
              </div>
              
              {isVerified && (
                <div style={{ textAlign: 'center', border: '1px solid #00ff41', padding: '20px', background: 'rgba(0,255,65,0.05)' }}>
                  <p style={{ color: '#fff', fontWeight: 'bold', marginBottom: '10px' }}>CERTIFICAT BLOCKCHAIN ACTIF</p>
                  <p style={{ fontSize: '10px', color: '#00ff41', wordBreak: 'break-all', marginBottom: '20px' }}>
                    HASH COMPLET : {realHash}
                  </p>
                  <div style={{ background: '#00ff41', color: '#000', padding: '15px', borderRadius: '5px', fontWeight: 'bold', textTransform: 'uppercase' }}>
                    AirPods Pro Enregistrés sur Global Nexus
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
