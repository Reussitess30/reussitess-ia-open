import React from 'react';
import Link from 'next/link';

export default function InvestirReuss() {
  const pays = ["France", "Belgique", "Italie", "Allemagne", "Suède", "Singapour", "Australie", "Espagne", "Brésil", "Royaume-Uni", "Inde", "Nouvelle-Zélande", "États-Unis", "Canada"];
  const contractAddress = "0x4b3bFf4b58d22Ad363bb260e22032414d4CfdDB8";

  return (
    <div style={{ backgroundColor: '#020617', color: '#f8fafc', minHeight: '100vh', padding: '20px', fontFamily: 'Inter, sans-serif' }}>
      <main style={{ maxWidth: '900px', margin: '0 auto', background: '#0f172a', padding: '40px', borderRadius: '24px', border: '1px solid #3b82f6', boxShadow: '0 0 40px rgba(59, 130, 246, 0.2)' }}>
        
        <header style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ color: '#3b82f6', fontSize: '1.4rem', fontWeight: '900' }}>REUSSITESS©NEURO-X : AUTHENTICITÉ ET VÉRIFICATION RÉELLE</h1>
          <p style={{ color: '#94a3b8' }}>Données certifiées pour les 14 Nations Partenaires</p>
        </header>

        {/* SECTION VÉRIFICATION RÉELLE (PREUVE BLOCKCHAIN) */}
        <section style={{ marginBottom: '40px', background: '#000', padding: '25px', borderRadius: '15px', border: '1px solid #3b82f6' }}>
          <h3 style={{ color: '#3b82f6', marginBottom: '15px' }}>🔍 AUDIT ET TRANSPARENCE DU CONTRAT</h3>
          <p style={{ fontSize: '0.9rem', marginBottom: '20px' }}>
            La transparence réelle impose une vérification directe sur la blockchain. Aucun document n'est plus fiable que le code immuable.
          </p>
          <div style={{ background: '#1e293b', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '10px' }}>ADRESSE DU CONTRAT RÉEL :</p>
            <code style={{ color: '#60a5fa', fontSize: '1rem', fontWeight: 'bold', wordBreak: 'break-all' }}>{contractAddress}</code>
            <div style={{ marginTop: '20px' }}>
              <a 
                href={`https://polygonscan.com/token/${contractAddress}`} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ background: '#3b82f6', color: '#fff', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.9rem' }}
              >
                VÉRIFIER SUR L'EXPLORATEUR (RÉEL)
              </a>
            </div>
          </div>
        </section>

        {/* GLOSSAIRE JURIDIQUE RÉEL */}
        <section style={{ marginBottom: '40px', background: 'rgba(255, 255, 255, 0.03)', padding: '25px', borderRadius: '15px' }}>
          <h3 style={{ color: '#00ff41', marginBottom: '15px' }}>⚖️ CADRE LÉGAL ACTUEL</h3>
          <p style={{ fontSize: '0.9rem' }}>
            <strong>• Conformité GAFI/FATF :</strong> Surveillance des flux financiers contre le blanchiment. <br/>
            <strong>• IA Act & RGPD :</strong> Protection des données et explicabilité des décisions de l'IA pour les 14 pays (France, Belgique, etc.).
          </p>
        </section>

        {/* LISTE OFFICIELLE DES 14 PAYS */}
        <section style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px', fontSize: '0.7rem' }}>
            {pays.map(p => <span key={p} style={{ background: '#1e293b', padding: '5px 10px', borderRadius: '5px', border: '1px solid #334155' }}>{p.toUpperCase()}</span>)}
          </div>
        </section>

        <footer style={{ textAlign: 'center' }}>
          <p style={{ color: '#3b82f6', fontWeight: 'bold' }}>GUADELOUPE "TERRES DE CHAMPIONS" - BOUDOUM !</p>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '5px' }}>Positivité à l'infini</p>
          <div style={{ marginTop: '30px' }}>
            <Link href="/" style={{ color: '#94a3b8', textDecoration: 'none', border: '1px solid #334155', padding: '10px 25px', borderRadius: '50px' }}>← RETOUR AU PORTAIL</Link>
          </div>
        </footer>

      </main>
    </div>
  );
}
