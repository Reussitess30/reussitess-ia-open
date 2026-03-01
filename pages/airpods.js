import React from 'react';
import Link from 'next/link';

export default function AirPodsPage() {
  return (
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      {/* BARRE DE RETOUR QUE TU AS DEMANDÉE */}
      <nav style={{ width: '100%', padding: '15px', background: '#111', borderBottom: '1px solid #333', display: 'flex', justifyContent: 'center' }}>
        <Link href="/" style={{ background: '#00ff41', color: '#000', padding: '10px 20px', borderRadius: '50px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>
          🏠 RETOUR À L'ACCUEIL REUSSITESS
        </Link>
      </nav>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🎧 AirPods Pro - Édition Réussitess</h1>
        <p style={{ color: '#888', maxWidth: '600px', marginBottom: '2rem' }}>
          Félicitations ! Vous avez accédé à la zone de réclamation sécurisée. 
          Votre produit est prêt pour l'expédition vers l'une de nos 14 zones internationales.
        </p>

        {/* ICI LE LIEN FINAL VERS L'ACHAT */}
        <a href="https://amzn.to/az0G6w0uuYRlg" target="_blank" style={{ background: '#fff', color: '#000', padding: '20px 40px', borderRadius: '10px', textDecoration: 'none', fontWeight: '900', fontSize: '1.5rem' }}>
          VOIR SUR AMAZON 🛒
        </a>

        <div style={{ marginTop: '3rem', fontSize: '0.8rem', color: '#444' }}>
            France • Angleterre • Italie • Allemagne • Suède • Singapour • Australie • Espagne • Brésil • Royaume-Uni • Inde • Nouvelle-Zélande • États-Unis • Canada
        </div>
      </div>
    </div>
  );
}
