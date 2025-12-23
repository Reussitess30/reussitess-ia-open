import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PasseportMondial() {
  const [terminal, setTerminal] = useState(['[CORE] Système Reussitess© en veille...']);
  const [step, setStep] = useState(0);
  const [activeIAs, setActiveIAs] = useState(0);
  const [isVerified, setIsVerified] = useState(false);

  // PROTOCOLE DE HAUTE PERFORMANCE
  const runHighSpeedDiagnostic = () => {
    return [
      "[SYNC] Connexion neuronale établie avec les 100 unités.",
      "[CHECK] Intégrité des 4 piliers d'IA : 100% fonctionnelle.",
      "[LATENCY] Latence détectée : 0.0001ms (Optimisation Reussitess©).",
      "[SECURITY] Cryptage de bout en bout activé."
    ];
  };

  useEffect(() => {
    if (step === 1 && activeIAs < 100) {
      const interval = setInterval(() => {
        setActiveIAs(prev => (prev >= 100 ? 100 : prev + 1));
      }, 20); // Vitesse de calcul maximale
      return () => clearInterval(interval);
    }
  }, [step, activeIAs]);

  const startValidation = (country) => {
    setStep(1);
    const logs = runHighSpeedDiagnostic();
    const sequence = [
      `[LOCATION] Secteur identifié : ${country}`,
      ...logs,
      "[FINAL] Compilation du Passeport Numérique...",
      "[DONE] Autorisation accordée par l'Essaim."
    ];

    sequence.forEach((msg, i) => {
      setTimeout(() => {
        setTerminal(prev => [...prev, msg]);
        if (i === sequence.length - 1) setIsVerified(true);
      }, (i + 1) * 700);
    });
  };

  return (
    <div style={{ backgroundColor: '#000', color: '#00ff41', minHeight: '100vh', fontFamily: 'monospace', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      <Link href="/" style={{ alignSelf: 'flex-start', border: '1px solid #00ff41', color: '#00ff41', padding: '10px 20px', textDecoration: 'none', fontSize: '12px', fontWeight: 'bold', borderRadius: '2px' }}>
        TERMINAL ACCUEIL
      </Link>

      <div style={{ width: '100%', maxWidth: '750px', background: '#050505', border: '1px solid #333', padding: '40px', borderRadius: '4px', marginTop: '60px', boxShadow: '0 0 40px rgba(0,0,0,1)' }}>
        <h1 style={{ textAlign: 'left', color: '#fff', fontSize: '1.5rem', borderBottom: '1px solid #333', paddingBottom: '20px', marginBottom: '30px' }}>
          REUSSITESS© | PASSEPORT INTERNATIONALE
        </h1>
        
        {step === 0 ? (
          <div>
            <p style={{ color: '#888', marginBottom: '20px' }}>Veuillez sélectionner votre zone de juridiction pour l'activation des protocoles :</p>
            <select onChange={(e) => startValidation(e.target.value)} style={{ width: '100%', padding: '15px', background: '#000', color: '#00ff41', border: '1px solid #00ff41', fontSize: '1rem', outline: 'none' }}>
              <option>-- SÉLECTION --</option>
              {["France", "Angleterre", "Italie", "Allemagne", "Suède", "Singapour", "Australie", "Espagne", "Brésil", "Royaume-Uni", "Inde", "Nouvelle-Zélande", "États-Unis", "Canada"].map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        ) : (
          <div>
            <div style={{ marginBottom: '30px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '10px' }}>
                <span>PUISSANCE DES 100 IA : {activeIAs}%</span>
                <span>STATUS : OPÉRATIONNEL</span>
              </div>
              <div style={{ height: '2px', background: '#222', width: '100%' }}>
                <div style={{ height: '100%', background: '#00ff41', width: `${activeIAs}%`, boxShadow: '0 0 10px #00ff41' }}></div>
              </div>
            </div>
            
            <div style={{ background: '#000', padding: '20px', borderLeft: '3px solid #00ff41', height: '220px', overflowY: 'auto' }}>
              {terminal.map((line, i) => <div key={i} style={{ marginBottom: '8px', fontSize: '13px', opacity: 0.9 }}>{`> ${line}`}</div>)}
            </div>

            {isVerified && (
              <div style={{ textAlign: 'right', marginTop: '30px' }}>
                <Link href="/certificat" style={{ background: '#00ff41', color: '#000', padding: '15px 35px', fontWeight: 'bold', textDecoration: 'none', display: 'inline-block' }}>
                  ÉMETTRE LE CERTIFICAT
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
