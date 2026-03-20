"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const CONTRACT = "0xB37531727fC07c6EED4f97F852A115B428046EB2";
const RESERVE = "0xbe8777aB450937bf107090F4F5F7c4834Db079cF";
const POOL = "0x1d2e88A55CBBAB68237aa10781a5e00335Af9f9c";

export default function InvestirReuss() {
  const [tokenData, setTokenData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const res = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${CONTRACT}`)
        const data = await res.json()
        if (data.pairs && data.pairs.length > 0) {
          setTokenData(data.pairs[0])
        }
      } catch(e) {
      } finally {
        setLoading(false)
      }
    }
    fetchPrice()
    const interval = setInterval(fetchPrice, 30000)
    return () => clearInterval(interval)
  }, [])

  const socialLinks = {
    tiktok: [
      { name: "Principal", url: "https://www.tiktok.com/@reussitess" },
      { name: "Influenceur", url: "https://www.tiktok.com/@influenceurreussitess" },
      { name: "Amour Gwadloup", url: "https://www.tiktok.com/@amourguadeloupe" },
      { name: "France", url: "https://www.tiktok.com/@reussitessfrance" },
      { name: "Allemagne", url: "https://www.tiktok.com/@reussitessdeutschland" }
    ],
    networks: [
      { name: "Instagram", url: "https://instagram.com/reussitess", icon: "📸" },
      { name: "Threads", url: "https://www.threads.net/@am.our4602", icon: "🧵" },
      { name: "Snapchat", url: "https://www.snapchat.com/add/reussitess", icon: "👻" },
      { name: "Reddit", url: "https://www.reddit.com/u/Ornery-Summer-1014/s/2Kfz43iK7m", icon: "🤖" },
      { name: "Discord", url: "https://discord.com/invite/AMOUR#3318", icon: "💬" }
    ],
    facebook: [
      { name: "Perso", url: "https://www.facebook.com/rony.porinus" },
      { name: "Pro", url: "https://www.facebook.com/popo97112" },
      { name: "Groupe", url: "https://facebook.com/groups/901428214856242/" },
      { name: "SOS PC", url: "https://www.facebook.com/sospcadomicile/" }
    ]
  }

  return (
    <div style={{ backgroundColor: '#020617', color: '#f8fafc', minHeight: '100vh', padding: '15px', fontFamily: 'Inter, sans-serif' }}>
      <main style={{ maxWidth: '800px', margin: '0 auto', background: '#0f172a', padding: '30px', borderRadius: '25px', border: '2px solid #3b82f6', boxShadow: '0 0 50px rgba(59,130,246,0.3)' }}>

        {/* HEADER */}
        <header style={{ textAlign: 'center', marginBottom: '30px' }}>
          <img src="/icon-512x512.webp" alt="Reussitess®971" style={{ width: '80px', height: '80px', borderRadius: '16px', marginBottom: '1rem' }} />
          <h1 style={{ color: '#3b82f6', fontSize: '1.5rem', fontWeight: '900' }}>TOKEN REUSS — REUSSITESS®971</h1>
          <p style={{ color: '#00ff41', fontWeight: 'bold', fontSize: '0.9rem' }}>GUADELOUPE 🇬🇵 · TERRES DE CHAMPIONS · BOUDOUM !</p>
        </header>

        {/* PRIX TEMPS RÉEL */}
        <section style={{ background: 'rgba(16,185,129,0.1)', padding: '20px', borderRadius: '15px', border: '1px solid #10b981', marginBottom: '25px', textAlign: 'center' }}>
          <p style={{ color: '#6ee7b7', fontSize: '0.8rem', marginBottom: '0.5rem' }}>📊 PRIX REUSS — Temps réel (DexScreener)</p>
          {loading ? (
            <p style={{ color: '#94a3b8' }}>Chargement...</p>
          ) : tokenData ? (
            <div>
              <h2 style={{ color: '#10b981', fontSize: '2rem', fontWeight: '900', margin: '0' }}>
                ${parseFloat(tokenData.priceUsd || 0).toFixed(8)}
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                Volume 24h : ${parseFloat(tokenData.volume?.h24 || 0).toLocaleString()} · 
                Liquidité : ${parseFloat(tokenData.liquidity?.usd || 0).toLocaleString()}
              </p>
              <p style={{ color: '#64748b', fontSize: '0.7rem' }}>Mis à jour toutes les 30 secondes</p>
            </div>
          ) : (
            <div>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Données non disponibles actuellement</p>
              <a href={`https://dexscreener.com/polygon/${CONTRACT}`} target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6', fontSize: '0.8rem' }}>Voir sur DexScreener →</a>
            </div>
          )}
        </section>

        {/* DONNÉES RÉELLES DU TOKEN */}
        <section style={{ background: 'rgba(59,130,246,0.1)', padding: '20px', borderRadius: '15px', border: '1px solid #3b82f6', marginBottom: '25px' }}>
          <h3 style={{ color: '#fff', fontSize: '1rem', marginBottom: '15px' }}>🔗 Token REUSS — Données on-chain vérifiables</h3>
          <div style={{ fontSize: '0.8rem', color: '#cbd5e1', lineHeight: '2' }}>
            <p>📋 <strong>Contrat :</strong> <code style={{ color: '#00ff41', fontSize: '0.7rem' }}>{CONTRACT}</code></p>
            <p>⛓️ <strong>Réseau :</strong> Polygon (POS) — ERC-20</p>
            <p>💰 <strong>Supply :</strong> 999 999 999 REUSS (1 brûlé symboliquement)</p>
            <p>👥 <strong>Holders :</strong> 20 (phase amorçage — Février 2026)</p>
            <p>🏊 <strong>Pool :</strong> QuickSwap V3 — REUSS/POL</p>
          </div>
          <div style={{ display: 'grid', gap: '8px', marginTop: '15px' }}>
            <a href={`https://polygonscan.com/token/${CONTRACT}`} target="_blank" rel="noopener noreferrer" style={{ display: 'block', background: '#3b82f6', color: '#fff', textAlign: 'center', padding: '10px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.8rem' }}>
              🔍 VÉRIFIER LE CONTRAT SUR POLYGONSCAN →
            </a>
            <a href={`https://dexscreener.com/polygon/${CONTRACT}`} target="_blank" rel="noopener noreferrer" style={{ display: 'block', background: '#10b981', color: '#fff', textAlign: 'center', padding: '10px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.8rem' }}>
              📈 VOIR SUR DEXSCREENER →
            </a>
            <a href="/whitepaper.pdf" download style={{ display: 'block', background: 'linear-gradient(135deg, #7c3aed, #5b21b6)', color: '#fff', textAlign: 'center', padding: '10px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.8rem' }}>
              📄 TÉLÉCHARGER LE WHITEPAPER OFFICIEL →
            </a>
          </div>
        </section>

        {/* TOKENOMICS RÉELS */}
        <section style={{ background: '#000', padding: '20px', borderRadius: '15px', border: '1px solid #7c3aed', marginBottom: '25px' }}>
          <h3 style={{ color: '#a78bfa', fontSize: '1rem', marginBottom: '15px' }}>💎 Tokenomics — Distribution réelle</h3>
          <div style={{ display: 'grid', gap: '8px', fontSize: '0.85rem' }}>
            {[
              { label: 'Réserve / Treasury', value: '~978 000 000 REUSS', pct: '97.9%', color: '#3b82f6' },
              { label: 'Fondateur', value: '~26 000 000 REUSS', pct: '2.6%', color: '#10b981' },
              { label: 'Acheteurs externes', value: '~7 500 000 REUSS', pct: '0.75%', color: '#f59e0b' },
              { label: 'Burned symbolique', value: '1 REUSS', pct: '<0.01%', color: '#ef4444' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', background: '#0f172a', padding: '10px 15px', borderRadius: '8px', border: `1px solid ${item.color}22` }}>
                <span style={{ color: '#cbd5e1' }}>{item.label}</span>
                <span style={{ color: item.color, fontWeight: 'bold' }}>{item.pct}</span>
              </div>
            ))}
          </div>
        </section>

        {/* RÉSEAUX SOCIAUX */}
        <section style={{ marginBottom: '25px' }}>
          <h3 style={{ color: '#3b82f6', fontSize: '1rem', borderBottom: '1px solid #1e293b', paddingBottom: '10px', marginBottom: '15px' }}>🌍 Suivez REUSSITESS®971</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '8px', marginBottom: '15px' }}>
            {socialLinks.tiktok.map((tk, i) => (
              <a key={i} href={tk.url} target="_blank" rel="noopener noreferrer" style={{ background: '#000', padding: '10px', borderRadius: '10px', border: '1px solid #ff0050', color: '#fff', fontSize: '0.7rem', textDecoration: 'none', textAlign: 'center' }}>
                🎵 TikTok {tk.name}
              </a>
            ))}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', marginBottom: '15px' }}>
            {socialLinks.networks.map((net, i) => (
              <a key={i} href={net.url} target="_blank" rel="noopener noreferrer" style={{ background: '#1e293b', padding: '8px 12px', borderRadius: '50px', border: '1px solid #3b82f6', color: '#fff', fontSize: '0.7rem', textDecoration: 'none' }}>
                {net.icon} {net.name}
              </a>
            ))}
          </div>
          <div style={{ background: '#111827', padding: '15px', borderRadius: '15px', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px' }}>
            {socialLinks.facebook.map((fb, i) => (
              <a key={i} href={fb.url} target="_blank" rel="noopener noreferrer" style={{ color: '#60a5fa', fontSize: '0.75rem', textDecoration: 'none' }}>
                📘 {fb.name}
              </a>
            ))}
          </div>
        </section>

        {/* DISCLAIMER LÉGAL */}
        <section style={{ background: 'rgba(239,68,68,0.05)', padding: '20px', borderRadius: '15px', border: '1px solid #ef4444', marginBottom: '25px' }}>
          <h3 style={{ color: '#ef4444', fontSize: '0.9rem', marginBottom: '10px' }}>⚖️ AVERTISSEMENTS LÉGAUX OBLIGATOIRES</h3>
          <div style={{ fontSize: '0.75rem', color: '#cbd5e1', lineHeight: '1.6' }}>
            <p>Les projections financières présentées sont des objectifs et estimations à titre informatif uniquement. Elles ne constituent pas une promesse de rendement. Investir dans des cryptomonnaies comporte des risques de perte totale du capital.</p>
            <p style={{ marginTop: '8px' }}>Conformément à la directive européenne 2003/71/CE et au règlement MiCA 2023/1114, ce document ne constitue pas un prospectus d&apos;offre au public. REUSS N&apos;EST PAS un security au sens des réglementations AMF/SEC, ni une garantie de profit.</p>
            <p style={{ marginTop: '8px', color: '#94a3b8' }}>© 2026 Reussitess®971 — Guadeloupe, France | rony.porinus@gmail.com</p>
          </div>
        </section>

        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <Link href="/" style={{ background: '#1e293b', color: '#fff', padding: '8px 20px', borderRadius: '20px', border: '1px solid #3b82f6', textDecoration: 'none', fontSize: '0.8rem' }}>
            ↩ Retour à l&apos;accueil
          </Link>
        </div>

        <footer style={{ textAlign: 'center', borderTop: '1px solid #1e293b', paddingTop: '20px' }}>
          <p style={{ color: '#00ff41', fontWeight: 'bold', letterSpacing: '1px' }}>POSITIVITÉ À L&apos;INFINI — BOUDOUM ! 🇬🇵</p>
        </footer>

      </main>
    </div>
  )
}
