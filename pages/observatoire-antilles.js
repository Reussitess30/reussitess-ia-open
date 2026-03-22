import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import Link from 'next/link'

export default function ObservatoireAntilles() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('population')

  useEffect(() => {
    fetch('/api/observatoire')
      .then(r => r.json())
      .then(d => { setData(d.data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const tabs = [
    { id: 'population', label: '👥 Population', icon: '👥' },
    { id: 'emploi', label: '💼 Emploi', icon: '💼' },
    { id: 'economie', label: '📊 Économie', icon: '📊' },
    { id: 'financement', label: '💰 Financement', icon: '💰' },
  ]

  return (
    <Layout>
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', padding: '2rem 1rem' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📊</div>
          <h1 style={{ color: '#fff', fontSize: 'clamp(1.8rem,5vw,3rem)', fontWeight: '900', marginBottom: '0.5rem' }}>
            OBSERVATOIRE ANTILLES
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>
            Données économiques & sociales — DOM-TOM en temps réel
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '1rem' }}>
            {['INSEE', 'IEDOM', 'CEROM', 'AFD', 'Banque de France', 'France Travail'].map(s => (
              <span key={s} style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600' }}>{s}</span>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              style={{ padding: '0.7rem 1.2rem', borderRadius: '25px', border: 'none', cursor: 'pointer', fontWeight: '700', fontSize: '0.9rem',
                background: activeTab === t.id ? 'linear-gradient(135deg,#10b981,#059669)' : 'rgba(255,255,255,0.05)',
                color: activeTab === t.id ? 'white' : '#94a3b8' }}>
              {t.label}
            </button>
          ))}
        </div>

        {loading && <div style={{ textAlign: 'center', color: '#10b981', fontSize: '1.2rem' }}>⏳ Chargement des données...</div>}

        {!loading && data && (
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>

            {/* Population & Chômage */}
            {activeTab === 'population' && (
              <div>
                <h2 style={{ color: '#e2e8f0', marginBottom: '1.5rem', textAlign: 'center' }}>👥 Population & Chômage DOM-TOM</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '1rem' }}>
                  {data.insee?.population?.map((t, i) => (
                    <div key={i} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '1.5rem' }}>
                      <h3 style={{ color: '#10b981', fontWeight: '900', marginBottom: '1rem', fontSize: '1.2rem' }}>🏝️ {t.territoire}</h3>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ color: '#94a3b8' }}>Population</span>
                        <span style={{ color: '#e2e8f0', fontWeight: '700' }}>{t.population.toLocaleString()} hab.</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ color: '#94a3b8' }}>Chômage</span>
                        <span style={{ color: t.chomage > 20 ? '#ef4444' : '#f59e0b', fontWeight: '700' }}>{t.chomage}%</span>
                      </div>
                      <div style={{ height: '8px', background: '#1e293b', borderRadius: '4px', marginTop: '0.5rem' }}>
                        <div style={{ height: '100%', width: `${t.chomage * 2}%`, background: t.chomage > 20 ? '#ef4444' : '#f59e0b', borderRadius: '4px' }} />
                      </div>
                      <p style={{ color: '#475569', fontSize: '0.75rem', marginTop: '0.5rem' }}>Source: INSEE {t.annee}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Emploi */}
            {activeTab === 'emploi' && (
              <div>
                <h2 style={{ color: '#e2e8f0', marginBottom: '1.5rem', textAlign: 'center' }}>💼 Marché du Travail Guadeloupe</h2>
                <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '2rem', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ color: '#10b981', fontWeight: '900' }}>🏛️ France Travail — Offres en cours</h3>
                    <span style={{ background: 'rgba(16,185,129,0.2)', color: '#10b981', padding: '0.4rem 0.8rem', borderRadius: '15px', fontWeight: '700' }}>
                      {data.emploi?.total || 0} offres
                    </span>
                  </div>
                  {data.emploi?.offres?.length > 0 ? data.emploi.offres.map((o, i) => (
                    <div key={i} style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', marginBottom: '0.75rem' }}>
                      <p style={{ color: '#e2e8f0', fontWeight: '600', marginBottom: '0.3rem' }}>{o.titre}</p>
                      <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{o.lieu} • {o.contrat}</p>
                    </div>
                  )) : (
                    <p style={{ color: '#94a3b8' }}>Consultez France Travail pour les offres en temps réel</p>
                  )}
                  <Link href="/hub-central" target="_blank" style={{ display: 'inline-block', marginTop: '1rem', background: 'linear-gradient(135deg,#3b82f6,#2563eb)', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '25px', textDecoration: 'none', fontWeight: '700' }}>
                    💼 Voir toutes les offres
                  </Link>
                </div>
              </div>
            )}

            {/* Économie */}
            {activeTab === 'economie' && (
              <div>
                <h2 style={{ color: '#e2e8f0', marginBottom: '1.5rem', textAlign: 'center' }}>📊 Indicateurs Économiques</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '1rem' }}>
                  {/* PIB IEDOM */}
                  <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '1.5rem' }}>
                    <h3 style={{ color: '#f59e0b', fontWeight: '900', marginBottom: '1rem' }}>🏦 PIB DOM — IEDOM</h3>
                    {data.iedom?.indicateurs?.map((ind, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{ind.label}</span>
                        <span style={{ color: '#e2e8f0', fontWeight: '700' }}>{ind.valeur}</span>
                      </div>
                    ))}
                    <a href={data.iedom?.url} target="_blank" rel="noreferrer" style={{ color: '#f59e0b', fontSize: '0.8rem' }}>→ iedom.fr</a>
                  </div>
                  {/* Croissance CEROM */}
                  <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '1.5rem' }}>
                    <h3 style={{ color: '#8b5cf6', fontWeight: '900', marginBottom: '1rem' }}>📈 Croissance — CEROM</h3>
                    {data.cerom?.croissance?.map((c, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{c.territoire}</span>
                        <span style={{ color: '#8b5cf6', fontWeight: '700' }}>+{c.taux}%</span>
                      </div>
                    ))}
                    <a href={data.cerom?.url} target="_blank" rel="noreferrer" style={{ color: '#8b5cf6', fontSize: '0.8rem' }}>→ cerom-dom.fr</a>
                  </div>
                  {/* Banque de France */}
                  <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '1.5rem' }}>
                    <h3 style={{ color: '#ec4899', fontWeight: '900', marginBottom: '1rem' }}>🏛️ Banque de France</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ color: '#94a3b8' }}>Taux directeur</span>
                      <span style={{ color: '#ec4899', fontWeight: '700' }}>{data.banqueFrance?.tauxDirecteur}%</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#94a3b8' }}>Inflation</span>
                      <span style={{ color: '#ec4899', fontWeight: '700' }}>{data.banqueFrance?.inflation}%</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Financement */}
            {activeTab === 'financement' && (
              <div>
                <h2 style={{ color: '#e2e8f0', marginBottom: '1.5rem', textAlign: 'center' }}>💰 Financement & Développement</h2>
                <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '2rem' }}>
                  <h3 style={{ color: '#10b981', fontWeight: '900', marginBottom: '1rem' }}>🌍 AFD — {data.afd?.source}</h3>
                  <p style={{ color: '#e2e8f0', marginBottom: '1rem', fontSize: '1.1rem', fontWeight: '600' }}>{data.afd?.engagements}</p>
                  <p style={{ color: '#94a3b8', marginBottom: '1rem' }}>Domaines prioritaires :</p>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {data.afd?.focus?.map((f, i) => (
                      <span key={i} style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981', padding: '0.4rem 0.8rem', borderRadius: '15px', fontSize: '0.85rem' }}>{f}</span>
                    ))}
                  </div>
                  <a href={data.afd?.url} target="_blank" rel="noreferrer" style={{ display: 'inline-block', marginTop: '1.5rem', color: '#10b981', fontWeight: '600' }}>→ afd.fr</a>
                </div>
              </div>
            )}

          </div>
        )}

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: '3rem', color: '#475569', fontSize: '0.8rem' }}>
          <p>Sources : INSEE • IEDOM • CEROM • AFD • Banque de France • France Travail</p>
          <p style={{ marginTop: '0.5rem' }}>REUSSITESS®971 — Guadeloupe 🇬🇵 Boudoum !</p>
        </div>
      </div>
    </Layout>
  )
}
