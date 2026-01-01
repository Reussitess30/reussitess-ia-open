import React from 'react';
import Link from 'next/link';

export default function InvestirReuss() {
  return (
    <div style={{ backgroundColor: '#020617', color: '#f8fafc', minHeight: '100vh', padding: '20px', fontFamily: 'Inter, sans-serif', lineHeight: '1.8' }}>
      <main style={{ maxWidth: '900px', margin: '0 auto', background: '#0f172a', padding: '50px', borderRadius: '24px', border: '1px solid #3b82f6', boxShadow: '0 0 40px rgba(59, 130, 246, 0.2)' }}>
        
        {/* SECTIONS PRÉCÉDENTES (Résumé pour le code) */}
        <header style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ color: '#3b82f6', fontSize: '1.4rem', fontWeight: '900' }}>REUSSITESS®NEURO-X : CONFORMITÉ INTERNATIONALE</h1>
          <p>Guide Officiel - 14 Nations Partenaires</p>
        </header>

        {/* SECTION LÉGALE UNIQUE (CE QUE LES AUTRES N'ONT PAS) */}
        <section style={{ marginBottom: '50px', background: 'rgba(255, 255, 255, 0.02)', padding: '30px', borderRadius: '20px', border: '1px solid #94a3b8' }}>
          <h3 style={{ color: '#f8fafc', fontSize: '1.2rem', fontWeight: '900', marginBottom: '20px', borderBottom: '1px solid #3b82f6', pb: '10px' }}>⚖️ POURQUOI NOUS SOMMES UNIQUES JURIDIQUEMENT</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            <div>
              <h4 style={{ color: '#3b82f6', fontSize: '1rem' }}>Souveraineté Territoriale</h4>
              <p style={{ fontSize: '0.85rem' }}>Contrairement aux IA étrangères, NEURO-X respecte la souveraineté numérique des 14 nations (RGPD, Cloud Act, lois indiennes). Les données ne sortent pas de l'infrastructure sécurisée.</p>
            </div>
            <div>
              <h4 style={{ color: '#3b82f6', fontSize: '1rem' }}>Auditabilité Algorithmique</h4>
              <p style={{ fontSize: '0.85rem' }}>Nous sommes les seuls à proposer une IA dont les décisions sont auditables par les autorités régulatrices, garantissant une utilisation légale en milieu bancaire et étatique.</p>
            </div>
          </div>
        </section>

        {/* RAPPEL DES 14 PAYS */}
        <section style={{ marginBottom: '35px', textAlign: 'center' }}>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>CONFORMITÉ : FRANCE, BELGIQUE, ITALIE, ALLEMAGNE, SUÈDE, SINGAPOUR, AUSTRALIE, ESPAGNE, BRÉSIL, UK, INDE, NZ, USA, CANADA.</p>
        </section>

        <footer style={{ textAlign: 'center', marginTop: '40px' }}>
          <p style={{ color: '#00ff41', fontWeight: 'bold' }}>"Positivité à l'infini — BOUDOUM !"</p>
          <p style={{ fontSize: '0.8rem' }}>Guadeloupe : Terres De Champions</p>
          <div style={{ marginTop: '20px' }}>
            <Link href="/" style={{ color: '#3b82f6', textDecoration: 'none' }}>← RETOUR AU PORTAIL</Link>
          </div>
        </footer>
      </main>
    </div>
  );
}
