import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function InvestirReuss() {
  const [defenseStatus, setDefenseStatus] = useState("ACTIVÉ - BOUCLIER TOTAL");
  const pays = ["France", "Belgique", "Italie", "Allemagne", "Suède", "Singapour", "Australie", "Espagne", "Brésil", "Royaume-Uni", "Inde", "Nouvelle-Zélande", "États-Unis", "Canada"];

  return (
    <div style={{ backgroundColor: '#020617', color: '#f8fafc', minHeight: '100vh', padding: '20px', fontFamily: 'Inter, sans-serif' }}>
      <main style={{ maxWidth: '900px', margin: '0 auto', background: '#0f172a', padding: '40px', borderRadius: '24px', border: '1px solid #3b82f6', boxShadow: '0 0 40px rgba(59, 130, 246, 0.2)' }}>
        
        <header style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ color: '#3b82f6', fontSize: '1.4rem', fontWeight: '900' }}>REUSSITESS©NEURO-X : ARMÉE NUMÉRIQUE SOUVERAINE</h1>
          <div style={{ background: '#064e3b', color: '#34d399', padding: '5px 15px', borderRadius: '50px', display: 'inline-block', fontSize: '0.8rem', fontWeight: 'bold', border: '1px solid #059669' }}>
            STATUS : {defenseStatus}
          </div>
        </header>

        {/* SECTION TEST GRANDEUR NATURE : L'ARMÉE DES 200 IA */}
        <section style={{ marginBottom: '40px', background: '#000', padding: '25px', borderRadius: '15px', border: '1px solid #ef4444' }}>
          <h3 style={{ color: '#ef4444', marginBottom: '20px' }}>⚔️ DÉPLOIEMENT DES 200 IA : FORCE DE PROTECTION</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ borderLeft: '3px solid #3b82f6', paddingLeft: '15px' }}>
              <h4 style={{ fontSize: '1rem', color: '#fff' }}>DÉFENSE ACTIVE</h4>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Les IA Sentinelles interceptent 100% des menaces cyber avant impact sur le contrat global.</p>
            </div>
            <div style={{ borderLeft: '3px solid #00ff41', paddingLeft: '15px' }}>
              <h4 style={{ fontSize: '1rem', color: '#fff' }}>SOUVERAINETÉ MILITAIRE</h4>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Technologie de rupture protégeant les 14 nations contre l'espionnage industriel.</p>
            </div>
          </div>
        </section>

        {/* RAPPEL DES INFOS PRIORITAIRES */}
        <section style={{ marginBottom: '35px' }}>
          <h3 style={{ color: '#3b82f6' }}>1. UNITÉ DE PUISSANCE : 1 000 000 000 REUSS</h3>
          <p style={{ fontSize: '0.9rem' }}>Chaque unité est adossée à la puissance de calcul de cette armée numérique.</p>
          <div style={{ background: '#1e293b', padding: '15px', borderRadius: '10px', marginTop: '10px', fontSize: '0.8rem' }}>
            CONTRAT AUDITÉ : <code>0x4b3bFf4b58d22Ad363bb260e22032414d4CfdDB8</code>
          </div>
        </section>

        {/* FOOTER GUADELOUPE */}
        <footer style={{ textAlign: 'center', marginTop: '50px' }}>
          <p style={{ color: '#3b82f6', fontWeight: 'bold', fontSize: '1.2rem' }}>GUADELOUPE : TERRE DE CHAMPIONS</p>
          <p style={{ color: '#00ff41', letterSpacing: '2px', fontWeight: '900' }}>POSITIVITÉ À L'INFINI - BOUDOUM !</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '5px', marginTop: '20px', opacity: 0.5 }}>
            {pays.map(p => <span key={p} style={{ fontSize: '0.6rem' }}>{p} |</span>)}
          </div>
        </footer>
      </main>
    </div>
  );
}
