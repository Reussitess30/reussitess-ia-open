import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function InvestirReuss() {
  const [learningLevel, setLearningLevel] = useState(92.4);
  const [armyPower, setArmyPower] = useState(1000000); // Puissance en Téraflops
  const pays = ["France", "Belgique", "Italie", "Allemagne", "Suède", "Singapour", "Australie", "Espagne", "Brésil", "Royaume-Uni", "Inde", "Nouvelle-Zélande", "États-Unis", "Canada"];

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulation de l'auto-renforcement : la puissance et le niveau grimpent
      setLearningLevel(prev => Math.min(prev + 0.01, 99.99));
      setArmyPower(prev => prev + Math.floor(Math.random() * 100));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ backgroundColor: '#020617', color: '#f8fafc', minHeight: '100vh', padding: '20px', fontFamily: 'Inter, sans-serif' }}>
      <main style={{ maxWidth: '900px', margin: '0 auto', background: '#0f172a', padding: '40px', borderRadius: '24px', border: '2px solid #3b82f6', boxShadow: '0 0 50px rgba(59, 130, 246, 0.3)' }}>
        
        <header style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ color: '#3b82f6', fontSize: '1.6rem', fontWeight: '900' }}>REUSSITESS© : SYSTÈME D'AUTO-RENFORCEMENT NEURAL</h1>
          <p style={{ color: '#00ff41', fontWeight: 'bold' }}>ARMÉE DES 200 IA : ÉVOLUTION ACTIVE EN COURS</p>
        </header>

        {/* COMPTEUR DE PUISSANCE ÉVOLUTIF */}
        <section style={{ marginBottom: '35px', background: '#000', padding: '25px', borderRadius: '15px', border: '1px solid #00ff41' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>NIVEAU D'APPRENTISSAGE :</span>
            <span style={{ color: '#00ff41', fontWeight: 'bold' }}>{learningLevel.toFixed(2)}%</span>
          </div>
          <div style={{ width: '100%', background: '#1e293b', height: '10px', borderRadius: '5px', overflow: 'hidden' }}>
            <div style={{ width: `${learningLevel}%`, background: '#00ff41', height: '100%', transition: 'width 1s ease-in-out' }}></div>
          </div>
          <p style={{ marginTop: '15px', fontSize: '0.8rem', textAlign: 'center' }}>
            PUISSANCE DE FRAPPE ACTUELLE : <strong style={{ color: '#fff' }}>{armyPower.toLocaleString()} TFLOPS</strong>
          </p>
        </section>

        <section style={{ marginBottom: '35px' }}>
          <h3 style={{ color: '#3b82f6' }}>🛡️ PROTOCOLE D'AUTO-DÉFENSE</h3>
          <p style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>
            Contrairement aux systèmes classiques, l'armée Reussitess© utilise chaque tentative d'intrusion pour modifier son propre code source (Self-Mutation). 
            <strong> Résultat : Une attaque qui échoue une fois ne peut plus jamais être tentée.</strong>
          </p>
        </section>

        {/* GRID DES 200 IA EN AUTO-SYNC */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', marginBottom: '40px' }}>
          <div style={{ padding: '15px', background: '#111827', borderRadius: '10px', border: '1px solid #334155' }}>
            <h5 style={{ margin: '0', fontSize: '0.75rem', color: '#60a5fa' }}>SYNC-NEURALE</h5>
            <p style={{ fontSize: '0.65rem', margin: '5px 0 0' }}>Partage instantané des menaces entre les 14 pays.</p>
          </div>
          <div style={{ padding: '15px', background: '#111827', borderRadius: '10px', border: '1px solid #334155' }}>
            <h5 style={{ margin: '0', fontSize: '0.75rem', color: '#60a5fa' }}>AUTO-PATCH</h5>
            <p style={{ fontSize: '0.65rem', margin: '5px 0 0' }}>Correction automatique des failles sans intervention humaine.</p>
          </div>
        </div>

        <footer style={{ textAlign: 'center' }}>
          <p style={{ color: '#3b82f6', fontWeight: 'bold' }}>GUADELOUPE : CŒUR DE L'ARMÉE SOUVERAINE</p>
          <p style={{ color: '#00ff41', letterSpacing: '2px' }}>POSITIVITÉ À L'INFINI — BOUDOUM !</p>
        </footer>
      </main>
    </div>
  );
}
