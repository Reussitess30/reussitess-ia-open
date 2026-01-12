import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PasseportMondial() {
  const [terminal, setTerminal] = useState(['[CORE] Initialisation du Noyau Reussitess©...']);
  const [step, setStep] = useState(0);
  const [activeIAs, setActiveIAs] = useState(0);
  const [isVerified, setIsVerified] = useState(false);

  const pays = ["France", "Angleterre", "Italie", "Allemagne", "Suède", "Singapour", "Australie", "Espagne", "Brésil", "Royaume-Uni", "Inde", "Nouvelle-Zélande", "États-Unis", "Canada"];

  // --- NOUVELLES FONCTIONS DE PUISSANCE ---
  const powerFunctions = [
    "[POWER] Activation du 'Neural Bridge' : Flux IA mondial unifié.",
    "[POWER] Lancement du 'Quantum Validator' : Intégrité 100% garantie.",
    "[POWER] Consensus des 100 IA : Vote de validation en cours...",
    "[POWER] Agrégation terminée : Puissance cumulée GPT/Claude/Gemini active."
  ];

  useEffect(() => {
    if (step === 1 && activeIAs < 100) {
      const interval = setInterval(() => {
        setActiveIAs(prev => (prev >= 100 ? 100 : prev + 1));
      }, 30);
      return () => clearInterval(interval);
    }
  }, [step, activeIAs]);

  const startValidation = (country) => {
    setStep(1);
    
    // On garde l'ancien système de logs et on injecte les nouvelles fonctions au milieu
    const sequence = [
      `[LOC] Zone : ${country}`,
      "[SIM] Simulation du calcul de bloc blockchain...",
      ...powerFunctions, // Injection des nouvelles puissances
      "[IA-LOG] Sécurisation du tunnel de données RSA-4096...",
      "[IA-MINT] Minage du certificat Reussitess©...",
      "[SUCCESS] Système blindé par l'unité centrale."
    ];

    sequence.forEach((msg, i) => {
      setTimeout(() => {
        setTerminal(prev => [...prev, msg]);
        if (i === sequence.length - 1) setIsVerified(true);
      }, (i + 1) * 900);
    });
  };

  return (
    <div style={{ backgroundColor: '#000', color: '#00ff41', minHeight: '100vh', fontFamily: 'monospace', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      <Link href="/" style={{ alignSelf: 'flex-start', border: '1px solid #00ff41', color: '#00ff41', padding: '10px 20px', textDecoration: 'none' }}>
        🏠 ACCUEIL
      </Link>

      <div style={{ width: '100%', maxWidth: '700px', background: '#050505', border: '1px solid #333', padding: '40px', borderRadius: '4px', marginTop: '60px', boxShadow: '0 0 40px rgba(0,0,0,1)' }}>
        <h1 style={{ textAlign: 'center', color: '#fff', fontSize: '1.4rem' }}>PASSEPORT REUSSITESS©</h1>
        
        {step === 0 ? (
          <div>
            <select onChange={(e) => startValidation(e.target.value)} style={{ width: '100%', padding: '15px', background: '#000', color: '#00ff41', border: '1px solid #00ff41' }}>
              <option>-- SÉLECTIONNEZ UN PAYS --</option>
              {pays.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        ) : (
          <div>
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span>UNITÉS ACTIVES : {activeIAs}/100</span>
                <span>STATUS : CALCUL EN COURS</span>
              </div>
              <div style={{ height: '2px', background: '#222', width: '100%', marginTop: '5px' }}>
                <div style={{ height: '100%', background: '#00ff41', width: `${activeIAs}%` }}></div>
              </div>
              {/* Grille visuelle maintenue */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(20, 1fr)', gap: '2px', marginTop: '10px' }}>
                {Array.from({ length: 100 }).map((_, i) => (
                  <div key={i} style={{ width: '4px', height: '4px', background: i < activeIAs ? '#00ff41' : '#111' }}></div>
                ))}
              </div>
            </div>
            
            <div style={{ background: '#000', padding: '20px', borderLeft: '2px solid #00ff41', height: '200px', overflowY: 'auto' }}>
              {terminal.map((line, i) => (
                <div key={i} style={{ marginBottom: '5px', fontSize: '11px', color: line.includes('[POWER]') ? '#fff' : '#00ff41' }}>
                  {`> ${line}`}
                </div>
              ))}
            </div>

            {isVerified && (
              <div style={{ textAlign: 'center', marginTop: '30px' }}>
                <Link href="/certificat" style={{ background: '#00ff41', color: '#000', padding: '15px 35px', fontWeight: 'bold', textDecoration: 'none' }}>
                  OBTENIR LE CERTIFICAT SÉCURISÉ
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
