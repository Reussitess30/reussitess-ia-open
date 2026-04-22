/* © Reussitess®971 INPI DSO2026012614 PORINUS Rony 2026 */
import { useState } from 'react';
import Link from 'next/link';

const TAUX_COMMISSION = { standard: 4, premium: 6, luxe: 8 };
const TAUX_CASHBACK_REUSS = { bronze: 3, silver: 8, gold: 15, platinum: 20 };

export default function CalculateurAmazon() {
  const [montant, setMontant] = useState('');
  const [categorie, setCategorie] = useState('standard');
  const [tier, setTier] = useState('bronze');
  const [resultat, setResultat] = useState(null);

  const calculer = () => {
    const m = parseFloat(montant);
    if (!m || m <= 0) return;
    const commission = (m * TAUX_COMMISSION[categorie]) / 100;
    const cashbackReuss = (commission * TAUX_CASHBACK_REUSS[tier]) / 100;
    const reussGagnes = Math.floor(cashbackReuss * 10000);
    setResultat({ commission, cashbackReuss, reussGagnes });
  };

  return (
    <div style={{ backgroundColor: '#020617', color: '#f8fafc', minHeight: '100vh', padding: '20px', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
          <Link href="/" style={{ color: '#3b82f6', textDecoration: 'none', fontSize: '0.8rem' }}>🏠 Accueil</Link>
          <span style={{ color: '#475569' }}>/</span>
          <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Calculateur Amazon</span>
        </div>

        <header style={{ textAlign: 'center', marginBottom: '35px' }}>
          <h1 style={{ color: '#f59e0b', fontSize: '1.8rem', fontWeight: '900', marginBottom: '10px' }}>
            🛍 CALCULATEUR AMAZON × REUSS
          </h1>
          <p style={{ color: '#00ff41', fontWeight: 'bold', fontSize: '0.9rem' }}>
            GUADELOUPE 🇬🇵 · TERRES DE CHAMPIONS · BOUDOUM !
          </p>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '10px' }}>
            Estimez vos commissions Amazon et vos récompenses REUSS (Vecteur GAMMA-1)
          </p>
        </header>

        <div style={{ background: '#0f172a', border: '1px solid #f59e0b44', borderRadius: '15px', padding: '25px', marginBottom: '25px' }}>
          <h3 style={{ color: '#f59e0b', marginBottom: '20px', fontSize: '1rem' }}>💰 Simulateur de revenus</h3>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: '#94a3b8', fontSize: '0.85rem', display: 'block', marginBottom: '8px' }}>Montant de la vente (€)</label>
            <input
              type="number"
              value={montant}
              onChange={e => setMontant(e.target.value)}
              placeholder="Ex: 100"
              style={{ width: '100%', padding: '12px', background: '#1e293b', border: '1px solid #3b82f6', borderRadius: '8px', color: '#fff', fontSize: '1rem', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: '#94a3b8', fontSize: '0.85rem', display: 'block', marginBottom: '8px' }}>Catégorie produit</label>
            <select
              value={categorie}
              onChange={e => setCategorie(e.target.value)}
              style={{ width: '100%', padding: '12px', background: '#1e293b', border: '1px solid #3b82f6', borderRadius: '8px', color: '#fff', fontSize: '0.9rem' }}
            >
              <option value="standard">Standard (4%)</option>
              <option value="premium">Premium (6%)</option>
              <option value="luxe">Luxe / High-ticket (8%)</option>
            </select>
          </div>

          <div style={{ marginBottom: '25px' }}>
            <label style={{ color: '#94a3b8', fontSize: '0.85rem', display: 'block', marginBottom: '8px' }}>Votre tier REUSS</label>
            <select
              value={tier}
              onChange={e => setTier(e.target.value)}
              style={{ width: '100%', padding: '12px', background: '#1e293b', border: '1px solid #a78bfa', borderRadius: '8px', color: '#fff', fontSize: '0.9rem' }}
            >
              <option value="bronze">🥉 Bronze — Cashback 3%</option>
              <option value="silver">🥈 Silver — Cashback 8%</option>
              <option value="gold">🥇 Gold — Cashback 15%</option>
              <option value="platinum">💎 Platinum — Cashback 20%</option>
            </select>
          </div>

          <button
            onClick={calculer}
            style={{ width: '100%', padding: '15px', background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#000', fontWeight: '900', fontSize: '1rem', borderRadius: '10px', border: 'none', cursor: 'pointer' }}
          >
            🚀 CALCULER MES RÉCOMPENSES
          </button>
        </div>

        {resultat && (
          <div style={{ background: '#0f172a', border: '1px solid #10b981', borderRadius: '15px', padding: '25px', marginBottom: '25px' }}>
            <h3 style={{ color: '#10b981', marginBottom: '20px', fontSize: '1rem' }}>✅ Résultats</h3>
            <div style={{ display: 'grid', gap: '12px' }}>
              {[
                { label: '💶 Commission Amazon générée', value: `${resultat.commission.toFixed(2)} €`, color: '#f59e0b' },
                { label: '💸 Cashback REUSS (GAMMA-1)', value: `${resultat.cashbackReuss.toFixed(4)} €`, color: '#10b981' },
                { label: '🪙 Tokens REUSS estimés', value: `~${resultat.reussGagnes.toLocaleString()} REUSS`, color: '#a78bfa' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', background: '#1e293b', padding: '15px', borderRadius: '10px' }}>
                  <span style={{ color: '#cbd5e1', fontSize: '0.85rem' }}>{item.label}</span>
                  <span style={{ color: item.color, fontWeight: '900', fontSize: '1rem' }}>{item.value}</span>
                </div>
              ))}
            </div>
            <p style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '15px', textAlign: 'center' }}>
              * Estimation basée sur les taux GAMMA-1 du Whitepaper officiel REUSS v1.0
            </p>
          </div>
        )}

        <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '15px', padding: '20px', marginBottom: '25px' }}>
          <h3 style={{ color: '#3b82f6', fontSize: '0.95rem', marginBottom: '15px' }}>🛍 Nos 26 boutiques Amazon — 14 pays</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
            {[
              { flag: '🇺🇸', name: 'USA', url: 'https://amazon.com/shop/amourguadeloupe' },
              { flag: '🇫🇷', name: 'France', url: 'https://amazon.fr/shop/amourguadeloupe' },
              { flag: '🇩🇪', name: 'Germany', url: 'https://amazon.de/shop/amourguadeloupe' },
              { flag: '🇮🇹', name: 'Italy', url: 'https://amazon.it/shop/amourguadeloupe' },
              { flag: '🇪🇸', name: 'Spain', url: 'https://amazon.es/shop/amourguadeloupe' },
              { flag: '🇨🇦', name: 'Canada', url: 'https://amazon.ca/shop/amourguadeloupe' },
              { flag: '🇬🇧', name: 'UK', url: 'https://amazon.co.uk/shop/amourguadeloupe' },
              { flag: '🇦🇺', name: 'Australia', url: 'https://amzlink.to/az05kTTrYJ06L' },
              { flag: '🇧🇪', name: 'Belgium', url: 'https://amazon.com.be/shop/influencer-fb942837' },
              { flag: '🇮🇳', name: 'India', url: 'https://amazon.in/shop/amourguadeloupe' },
              { flag: '🇳🇱', name: 'Netherlands', url: 'https://amazon.nl/shop/amourguadeloupe' },
              { flag: '🇸🇪', name: 'Sweden', url: 'https://amazon.se/shop/amourguadeloupe' },
              { flag: '🇸🇬', name: 'Singapore', url: 'https://amazon.sg/shop/amourguadeloupe' },
              { flag: '🇧🇷', name: 'Brazil', url: 'https://amzlink.to/az0ymmoCLHvyA' },
            ].map((pays, i) => (
              <a key={i} href={pays.url} target="_blank" rel="noopener noreferrer"
                style={{ background: '#1e293b', padding: '10px', borderRadius: '8px', border: '1px solid #334155', color: '#fff', textDecoration: 'none', textAlign: 'center', fontSize: '0.8rem' }}>
                {pays.flag} {pays.name}
              </a>
            ))}
          </div>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <Link href="/investir-reuss" style={{ background: 'linear-gradient(135deg, #7c3aed, #5b21b6)', color: '#fff', padding: '12px 25px', borderRadius: '10px', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.85rem' }}>
            💎 Acheter des tokens REUSS →
          </Link>
        </div>

        <footer style={{ textAlign: 'center', paddingTop: '20px', borderTop: '1px solid #1e293b' }}>
          <p style={{ color: '#00ff41', fontWeight: 'bold' }}>POSITIVITÉ À L&apos;INFINI — BOUDOUM ! 🇬🇵</p>
          <p style={{ color: '#475569', fontSize: '0.75rem' }}>© 2026 Reussitess®971 — Guadeloupe, France</p>
        </footer>

      </div>
    </div>
  );
}
