import React from 'react';
import Link from 'next/link';

export default function InvestirReuss() {
  return (
    <div style={{ backgroundColor: '#020617', color: '#f8fafc', minHeight: '100vh', padding: '20px', fontFamily: 'Inter, sans-serif', lineHeight: '1.8' }}>
      <main style={{ maxWidth: '900px', margin: '0 auto', background: '#0f172a', padding: '50px', borderRadius: '24px', border: '1px solid #3b82f6' }}>
        
        {/* TEXTE D'ORIGINE */}
        <header style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ color: '#3b82f6', fontSize: '1.4rem', fontWeight: '900' }}>REUSSITESS®NEURO-X : L'IA PRÉDICTIVE SOUVERAINE DES 14 NATIONS</h1>
          <h2 style={{ color: '#94a3b8', fontSize: '1.1rem' }}>GUIDE OPÉRATIONNEL ET CONFORMITÉ JURIDIQUE</h2>
        </header>

        <section style={{ marginBottom: '35px' }}>
          <h3 style={{ color: '#3b82f6' }}>1. QU'EST-CE QUE LE PROJET NEURO-X ?</h3>
          <p>Le projet REUSSITESS®NEURO-X est une infrastructure d'Intelligence Artificielle de troisième génération. Oracle de calcul de probabilités pour la planète entière.</p>
          <p>Il analyse en temps réel les données économiques, technologiques et sanitaires des 14 pays partenaires (France, Angleterre, Italie, Allemagne, Suède, Singapour, Australie, Espagne, Brésil, Royaume-Uni, Inde, Nouvelle-Zélande, États-Unis, Canada).</p>
        </section>

        <section style={{ marginBottom: '35px', background: '#000', padding: '20px', borderRadius: '15px', border: '1px solid #3b82f6' }}>
          <h3 style={{ color: '#3b82f6' }}>2. CONFIGURATION WALLET</h3>
          <p>Contrat Officiel :</p>
          <code style={{ color: '#60a5fa', wordBreak: 'break-all', fontSize: '1.1rem' }}>0x4b3bFf4b58d22Ad363bb260e22032414d4CfdDB8</code>
        </section>

        <section style={{ marginBottom: '35px' }}>
          <h3 style={{ color: '#3b82f6' }}>3. DÉMARCHES INVESTISSEUR</h3>
          <p>Offre totale : 1 000 000 000 unités.</p>
          <p>Éligibilité : Résider dans l'un des 14 pays autorisés.</p>
        </section>

        <footer style={{ background: '#1e293b', padding: '20px', fontSize: '0.8rem', borderRadius: '10px', marginBottom: '40px' }}>
          CADRE JURIDIQUE : Ce document ne constitue pas une offre publique de titres financiers. Projet provenant de la Guadeloupe.
        </footer>

        {/* NOUVELLES SECTIONS INTÉGRÉES SANS CONFLIT */}
        <hr style={{ border: '0', borderTop: '1px solid #3b82f6', marginBottom: '40px' }} />

        <section style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ color: '#00ff41', fontSize: '1.5rem', fontWeight: '900' }}>DÉPLOIEMENT PLANÉTAIRE</h2>
          <p style={{ color: '#fff', fontWeight: 'bold' }}>GUADELOUPE : TERRES DE CHAMPIONS</p>
          <p style={{ color: '#60a5fa', fontStyle: 'italic' }}>"Positivité à l'infini — Boudoum !"</p>
        </section>

        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          <div style={{ background: '#111827', padding: '20px', borderRadius: '15px', border: '1px solid #1e293b' }}>
            <h4 style={{ color: '#3b82f6' }}>PUISSANCE 200 IA</h4>
            <p style={{ fontSize: '0.8rem' }}>Analyse des flux financiers et cycles de croissance des 14 nations.</p>
          </div>
          <div style={{ background: '#111827', padding: '20px', borderRadius: '15px', border: '1px solid #1e293b' }}>
            <h4 style={{ color: '#3b82f6' }}>STRATÉGIE GLOBALE</h4>
            <p style={{ fontSize: '0.8rem' }}>Marquer la planète via l'innovation souveraine et la positivité.</p>
          </div>
        </section>

        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <Link href="/" style={{ color: '#94a3b8', textDecoration: 'none' }}>← RETOUR AU PORTAIL REUSSITESS©</Link>
        </div>
      </main>
    </div>
  );
}
