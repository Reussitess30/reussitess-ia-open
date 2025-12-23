import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PasseportMondial() {
  const [terminal, setTerminal] = useState(['[SYSTEM] Initialisation du protocole Air-Bot...']);
  const [step, setStep] = useState(0);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  const pays = ["France", "Angleterre", "Italie", "Allemagne", "Suède", "Singapour", "Australie", "Espagne", "Brésil", "Royaume-Uni", "Inde", "Nouvelle-Zélande", "États-Unis", "Canada"];

  const startValidation = (country) => {
    setSelectedCountry(country);
    setStep(1);
    const sequence = [
      `[AUTH] Pays détecté : ${country}`,
      "[CRYPTO] Connexion au noeud Reussitess-Chain...",
      "[HASH] 0x" + Math.random().toString(16).slice(2, 15) + "... OK",
      "[BLOCKCHAIN] Signature du certificat d'éligibilité...",
      "[SUCCESS] AirPods Pro déverrouillés pour cette zone."
    ];
    
    sequence.forEach((msg, i) => {
      setTimeout(() => {
        setTerminal(prev => [...prev, msg]);
        if (i === sequence.length - 1) setIsVerified(true);
      }, (i + 1) * 1200);
    });
  };

  return (
    <div style={{ backgroundColor: '#000', color: '#00ff41', minHeight: '100vh', fontFamily: 'monospace', padding: '20px', display: 'flex', flexDirection: 'column' }}>
      
      {/* BOUTON RETOUR PERMANENT */}
      <div style={{ position: 'fixed', top: '20px', left: '20px', zIndex: 100 }}>
        <Link href="/" style={{ background: '#00ff41', color: '#000', padding: '10px 20px', borderRadius: '5px', textDecoration: 'none', fontWeight: 'bold' }}>
          🏠 ACCUEIL
        </Link>
      </div>

      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ width: '100%', maxWidth: '600px', background: '#050505', border: '1px solid #00ff41', padding: '30px', borderRadius: '15px', boxShadow: '0 0 40px rgba(0,255,65,0.2)' }}>
          <h1 style={{ fontSize: '1.5rem', textAlign: 'center', color: '#fff' }}>🛡️ GLOBAL NEXUS : AIR-BOT</h1>

          {step === 0 ? (
            <div style={{ textAlign: 'center' }}>
              <p style={{ marginBottom: '20px' }}>Sélectionnez votre pays pour validation Blockchain :</p>
              <select onChange={(e) => startValidation(e.target.value)} style={{ background: '#000', color: '#00ff41', border: '1px solid #00ff41', padding: '10px', width: '100%' }}>
                <option>-- Choisir un pays --</option>
                {pays.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          ) : (
            <div>
              <div style={{ background: '#000', padding: '15px', borderRadius: '5px', fontSize: '12px', margin: '20px 0' }}>
                {terminal.map((line, i) => <div key={i} style={{ marginBottom: '5px' }}>{`> ${line}`}</div>)}
              </div>
              
              {isVerified && (
                <div style={{ textAlign: 'center', animation: 'fadeIn 1s' }}>
                  <p style={{ color: '#fff' }}>CERTIFICAT REUSSITESS® VALIDE</p>
                  <a href="https://www.reussitess.fr/airpods" target="_blank" style={{ display: 'block', background: '#00ff41', color: '#000', padding: '15px', borderRadius: '5px', fontWeight: 'bold', textDecoration: 'none', marginTop: '10px', fontSize: '1.2rem' }}>
                    🎧 RÉCLAMER MES AIRPODS
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
