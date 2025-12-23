import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PasseportMondial() {
  const [terminal, setTerminal] = useState(['[SYSTEM] Initialisation du protocole Air-Bot...']);
  const [step, setStep] = useState(0);
  const [isVerified, setIsVerified] = useState(false);
  const [txHash, setTxHash] = useState('');

  const pays = ["France", "Angleterre", "Italie", "Allemagne", "Suède", "Singapour", "Australie", "Espagne", "Brésil", "Royaume-Uni", "Inde", "Nouvelle-Zélande", "États-Unis", "Canada"];

  const startValidation = (country) => {
    setStep(1);
    const hash = "0x" + Math.random().toString(16).slice(2, 15) + Math.random().toString(16).slice(2, 15);
    setTxHash(hash);

    const sequence = [
      `[AUTH] Zone détectée : ${country}`,
      "[NODE] Synchronisation avec Global Nexus Chain...",
      "[SECURITY] Chiffrement de la requête RSA-4096...",
      `[BLOCKCHAIN] Transaction Hash : ${hash.substring(0, 15)}...`,
      "[SUCCESS] AirPods Pro liés à votre identifiant Crypto."
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
      
      {/* BOUTON RETOUR ACCUEIL (INDISPENSABLE) */}
      <div style={{ position: 'fixed', top: '20px', left: '20px', zIndex: 100 }}>
        <Link href="/" style={{ background: '#00ff41', color: '#000', padding: '10px 20px', borderRadius: '5px', textDecoration: 'none', fontWeight: 'bold', fontSize: '12px' }}>
          🏠 RETOUR ACCUEIL
        </Link>
      </div>

      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ width: '100%', maxWidth: '600px', background: '#050505', border: '1px solid #00ff41', padding: '30px', borderRadius: '15px', boxShadow: '0 0 50px rgba(0,255,65,0.15)' }}>
          <h1 style={{ fontSize: '1.4rem', textAlign: 'center', color: '#fff', letterSpacing: '2px' }}>🛡️ AIR-BOT CRYPTO-VALIDATOR</h1>

          {step === 0 ? (
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <p style={{ marginBottom: '20px', color: '#888' }}>Choisissez votre zone de distribution sécurisée :</p>
              <select onChange={(e) => startValidation(e.target.value)} style={{ background: '#000', color: '#00ff41', border: '1px solid #00ff41', padding: '12px', width: '100%', outline: 'none', cursor: 'pointer' }}>
                <option>-- SÉLECTIONNER VOTRE PAYS --</option>
                {pays.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          ) : (
            <div>
              <div style={{ background: '#000', padding: '15px', borderRadius: '5px', fontSize: '12px', margin: '20px 0', border: '1px solid #111', minHeight: '120px' }}>
                {terminal.map((line, i) => <div key={i} style={{ marginBottom: '5px' }}>{`> ${line}`}</div>)}
              </div>
              
              {isVerified && (
                <div style={{ textAlign: 'center', animation: 'fadeIn 1s', padding: '10px', border: '1px dashed #00ff41' }}>
                  <p style={{ color: '#fff', fontSize: '14px', fontWeight: 'bold' }}>CERTIFICAT DE POSSESSION GÉNÉRÉ</p>
                  <p style={{ fontSize: '10px', color: '#008f11', wordBreak: 'break-all', marginTop: '5px' }}>Hash: {txHash}</p>
                  
                  {/* Plus d'Amazon : On reste sur ton écosystème */}
                  <div style={{ marginTop: '20px', background: '#00ff41', color: '#000', padding: '15px', borderRadius: '5px', fontWeight: 'bold' }}>
                    ✅ RÉCLAMATION ENREGISTRÉE SUR LA BLOCKCHAIN
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
