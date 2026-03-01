import Link from 'next/link';

const actus = [
  { date: "16 Fév 2026", titre: "Lancement officiel du token REUSS sur Polygon", tag: "Blockchain", color: "#3b82f6" },
  { date: "01 Mar 2026", titre: "Birdeye : demande de mise à jour du token REUSS soumise", tag: "Listing", color: "#10b981" },
  { date: "01 Mar 2026", titre: "Whitepaper officiel v1.0 publié et disponible en téléchargement", tag: "Officiel", color: "#a78bfa" },
  { date: "Fév 2026", titre: "26 boutiques Amazon actives dans 14 pays", tag: "Commerce", color: "#f59e0b" },
  { date: "Fév 2026", titre: "200 agents IA déployés — Architecture Nexus opérationnelle", tag: "IA", color: "#00ff41" },
  { date: "Fév 2026", titre: "Pool de liquidité QuickSwap V3 REUSS/POL activé", tag: "DeFi", color: "#ec4899" },
  { date: "Fév 2026", titre: "GoMining intégré — Minage Bitcoin passif disponible", tag: "Bitcoin", color: "#f97316" },
  { date: "2026", titre: "Objectif Q1 : 1 000 holders REUSS", tag: "Roadmap", color: "#64748b" },
];

export default function Actu() {
  return (
    <div style={{ backgroundColor: '#020617', color: '#f8fafc', minHeight: '100vh', padding: '20px', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', flexWrap: 'wrap' }}>
          <Link href="/" style={{ color: '#3b82f6', textDecoration: 'none', fontSize: '0.8rem' }}>🏠 Accueil</Link>
          <span style={{ color: '#475569' }}>/</span>
          <Link href="/bibliotheque" style={{ color: '#3b82f6', textDecoration: 'none', fontSize: '0.8rem' }}>📚 Bibliothèque</Link>
          <span style={{ color: '#475569' }}>/</span>
          <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Actualités</span>
        </div>

        <header style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ color: '#3b82f6', fontSize: '1.8rem', fontWeight: '900', marginBottom: '10px' }}>
            📰 ACTUALITÉS REUSSITESS®971
          </h1>
          <p style={{ color: '#00ff41', fontWeight: 'bold', fontSize: '0.9rem' }}>
            GUADELOUPE 🇬🇵 · TERRES DE CHAMPIONS · BOUDOUM !
          </p>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '10px' }}>
            Toutes les dernières nouvelles de l'écosystème REUSSITESS®
          </p>
        </header>

        <div style={{ display: 'grid', gap: '15px' }}>
          {actus.map((actu, i) => (
            <div key={i} style={{ background: '#0f172a', border: `1px solid ${actu.color}44`, borderRadius: '12px', padding: '20px', borderLeft: `4px solid ${actu.color}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{ background: `${actu.color}22`, color: actu.color, padding: '3px 10px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 'bold' }}>
                  {actu.tag}
                </span>
                <span style={{ color: '#64748b', fontSize: '0.75rem' }}>📅 {actu.date}</span>
              </div>
              <p style={{ color: '#e2e8f0', fontSize: '0.95rem', fontWeight: '600', margin: 0 }}>{actu.titre}</p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '40px', padding: '25px', background: '#0f172a', borderRadius: '15px', border: '1px solid #1e293b' }}>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '15px' }}>Suivez toutes les actualités en temps réel</p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="https://www.tiktok.com/@reussitess" target="_blank" rel="noopener noreferrer" style={{ background: '#000', color: '#fff', padding: '8px 16px', borderRadius: '8px', border: '1px solid #ff0050', textDecoration: 'none', fontSize: '0.8rem' }}>🎵 TikTok</a>
            <a href="https://polygonscan.com/token/0xB37531727fC07c6EED4f97F852A115B428046EB2" target="_blank" rel="noopener noreferrer" style={{ background: '#3b82f6', color: '#fff', padding: '8px 16px', borderRadius: '8px', textDecoration: 'none', fontSize: '0.8rem' }}>🔗 PolygonScan</a>
            <Link href="/investir-reuss" style={{ background: '#7c3aed', color: '#fff', padding: '8px 16px', borderRadius: '8px', textDecoration: 'none', fontSize: '0.8rem' }}>💎 Token REUSS</Link>
          </div>
        </div>

        <footer style={{ textAlign: 'center', marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #1e293b' }}>
          <p style={{ color: '#00ff41', fontWeight: 'bold' }}>POSITIVITÉ À L&apos;INFINI — BOUDOUM ! 🇬🇵</p>
          <p style={{ color: '#475569', fontSize: '0.75rem' }}>© 2026 Reussitess®971 — Guadeloupe, France</p>
        </footer>

      </div>
    </div>
  );
}
