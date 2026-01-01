import React from 'react';
import Link from 'next/link';

export default function InvestirReuss() {
  const paysPartenaires = [
    "France", "Belgique", "Italie", "Allemagne", "Suède", 
    "Singapour", "Australie", "Espagne", "Brésil", "Royaume-Uni", 
    "Inde", "Nouvelle-Zélande", "États-Unis", "Canada"
  ];

  return (
    <div style={{ backgroundColor: '#020617', color: '#f8fafc', minHeight: '100vh', padding: '20px', fontFamily: 'Inter, sans-serif', lineHeight: '1.8' }}>
      <main style={{ maxWidth: '900px', margin: '0 auto', background: '#0f172a', padding: '50px', borderRadius: '24px', border: '1px solid #3b82f6', boxShadow: '0 0 40px rgba(59, 130, 246, 0.2)' }}>
        
        {/* 1. INFOS INITIALES */}
        <header style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ color: '#3b82f6', fontSize: '1.4rem', fontWeight: '900' }}>REUSSITESS®NEURO-X : L'IA PRÉDICTIVE SOUVERAINE DES 14 NATIONS</h1>
          <h2 style={{ color: '#94a3b8', fontSize: '1.1rem' }}>GUIDE OPÉRATIONNEL ET CONFORMITÉ JURIDIQUE</h2>
        </header>

        <section style={{ marginBottom: '35px' }}>
          <h3 style={{ color: '#3b82f6' }}>1. QU'EST-CE QUE LE PROJET NEURO-X ?</h3>
          <p>Le projet REUSSITESS®NEURO-X est une infrastructure d'Intelligence Artificielle de troisième génération. Oracle de calcul de probabilités pour la planète entière.</p>
          <p>Il analyse en temps réel les données des 14 pays partenaires pour identifier des cycles de croissance.</p>
        </section>

        <section style={{ marginBottom: '35px', background: '#000', padding: '25px', borderRadius: '15px', border: '1px solid #3b82f6' }}>
          <h3 style={{ color: '#3b82f6' }}>2. CONFIGURATION DU CONTRAT</h3>
          <p>Adresse officielle :</p>
          <div style={{ background: '#1e293b', padding: '15px', borderRadius: '10px', textAlign: 'center', border: '1px dashed #3b82f6' }}>
            <code style={{ color: '#60a5fa', fontSize: '1.1rem', fontWeight: 'bold', wordBreak: 'break-all' }}>0x4b3bFf4b58d22Ad363bb260e22032414d4CfdDB8</code>
          </div>
        </section>

        {/* 2. EXPLICATION DU MILLIARD */}
        <section style={{ marginBottom: '50px', background: 'rgba(0, 255, 65, 0.05)', padding: '30px', borderRadius: '20px', border: '1px solid #00ff41' }}>
          <h3 style={{ color: '#00ff41', fontSize: '1.3rem', fontWeight: '900', marginBottom: '20px' }}>⚡ POURQUOI 1 000 000 000 UNITÉS ?</h3>
          <p>Ce volume est le carburant des 200 IA. Il garantit la puissance de calcul sur 14 nations et protège le système contre la manipulation des cours.</p>
        </section>

        {/* 3. GÉNÉRATION DE DEVISES */}
        <section style={{ marginBottom: '50px', background: 'rgba(59, 130, 246, 0.1)', padding: '30px', borderRadius: '20px', border: '1px solid #3b82f6' }}>
          <h3 style={{ color: '#3b82f6', fontSize: '1.3rem', fontWeight: '900', marginBottom: '20px' }}>💰 GÉNÉRATION DE VALEUR ET DEVISES</h3>
          <p>Le retour sur investissement provient de l'utilisation réelle de l'IA par les institutions des 14 pays. Les redevances d'accès à l'Oracle créent une demande constante, permettant la conversion des unités en devises locales (€, $, £) via des passerelles sécurisées.</p>
        </section>

        {/* 4. SÉCURITÉ MILITAIRE */}
        <section style={{ marginBottom: '50px', background: 'linear-gradient(135deg, #0f172a 0%, #7f1d1d 100%)', padding: '30px', borderRadius: '20px', border: '2px solid #ef4444' }}>
          <h3 style={{ color: '#fff', fontSize: '1.2rem', fontWeight: '900', textAlign: 'center' }}>🛡️ PROTECTION ANTI-PIRATE MILITAIRE</h3>
          <p style={{ textAlign: 'center' }}>Cryptographie post-quantique. Serveurs Air-Gapped. Inviolable.</p>
        </section>

        {/* SIGNATURE */}
        <section style={{ textAlign: 'center', marginBottom: '40px' }}>
          <p style={{ color: '#60a5fa', fontStyle: 'italic', fontSize: '1.2rem' }}>"Positivité à l'infini — BOUDOUM !"</p>
          <p style={{ fontWeight: 'bold' }}>GUADELOUPE : TERRE DE CHAMPIONS</p>
        </section>

        <div style={{ textAlign: 'center' }}>
          <Link href="/" style={{ color: '#94a3b8', textDecoration: 'none' }}>← RETOUR</Link>
        </div>
      </main>
    </div>
  );
}
