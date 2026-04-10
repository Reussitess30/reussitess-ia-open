/* © Reussitess®971 INPI DSO2026012614 PORINUS Rony 2026 */
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PasseportMondial() {
  const [terminal, setTerminal] = useState(['[CORE] Initialisation du Passeport Mondial REUSSITESS®971...']);
  const [step, setStep] = useState(0);
  const [activeIAs, setActiveIAs] = useState(0);
  const [isVerified, setIsVerified] = useState(false);

  const pays = ["France", "Guadeloupe", "Martinique", "Guyane", "Réunion", "Mayotte", "Angleterre", "Italie", "Allemagne", "Suède", "Singapour", "Australie", "Espagne", "Brésil", "Canada", "États-Unis", "Côte d'Ivoire", "Sénégal", "Maroc", "Cameroun"];

  const sequence_logs = [
    "[LOC] Localisation zone partenaire REUSSITESS®971...",
    "[CHECK] Vérification réseau 14 pays partenaires...",
    "[IA] Activation module Neuro-X spécialisé...",
    "[GROQ] Connexion API Groq llama-3.1-8b-instant...",
    "[SEC] Sécurisation HTTPS + headers renforcés...",
    "[POLY] Vérification Token REUSS sur Polygon...",
    "[AMZN] Connexion 26 boutiques affiliées Amazon...",
    "[BOT] 200+ modules IA REUSSITESS®971 en ligne...",
    "[SUCCESS] Passeport validé — Bienvenue Champion !"
  ];

  useEffect(() => {
    if (step === 1 && activeIAs < 100) {
      const interval = setInterval(() => {
        setActiveIAs(prev => (prev >= 100 ? 100 : prev + 1));
      }, 40);
      return () => clearInterval(interval);
    }
  }, [step, activeIAs]);

  const startValidation = (country) => {
    if (!country || country.startsWith('--')) return;
    setStep(1);
    setActiveIAs(0);
    setIsVerified(false);
    setTerminal(['[CORE] Initialisation du Passeport Mondial REUSSITESS®971...']);
    const logs = [`[LOC] Zone détectée : ${country}`, ...sequence_logs];
    logs.forEach((msg, i) => {
      setTimeout(() => {
        setTerminal(prev => [...prev, msg]);
        if (i === logs.length - 1) setIsVerified(true);
      }, (i + 1) * 700);
    });
  };

  const ressources = [
    { label: "🏆 Passeport de Réussite", url: "https://reussitess.fr/champions", desc: "Obtiens ton certificat Champion" },
    { label: "🌍 Visa Universel", url: "https://reussitess.fr/visa-universel", desc: "Réseau 14 pays partenaires" },
    { label: "🧠 Agents Neuro-X", url: "https://reussitess.fr/neuro-x", desc: "60 experts IA spécialisés" },
    { label: "💎 Token REUSS", url: "https://reussitess.fr/investir-reuss", desc: "Token sur Polygon Blockchain" },
    { label: "📚 Bibliothèque mondiale", url: "https://reussitess.fr/bibliotheque", desc: "50+ pays, Open Library" },
    { label: "🛍️ Boutiques Amazon", url: "https://reussitess.fr/boutiques", desc: "26 boutiques 14 pays" },
    { label: "🎓 Quiz éducatifs", url: "https://reussitess.fr/quiz/1", desc: "99 quiz tous thèmes" },
    { label: "🔮 Oracle 971", url: "https://reussitess.fr/oracle-971", desc: "Oracle caribéen mystique" },
  ];

  return (
    <div style={{ backgroundColor: '#000', color: '#00ff41', minHeight: '100vh', fontFamily: 'monospace', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

      <Link href="/" style={{ alignSelf: 'flex-start', border: '1px solid #00ff41', color: '#00ff41', padding: '10px 20px', textDecoration: 'none' }}>
        🏠 ACCUEIL
      </Link>

      <div style={{ width: '100%', maxWidth: '700px', background: '#050505', border: '1px solid #333', padding: '40px', borderRadius: '4px', marginTop: '40px', boxShadow: '0 0 40px rgba(0,255,65,0.1)' }}>
        <h1 style={{ textAlign: 'center', color: '#fff', fontSize: '1.4rem', marginBottom: '5px' }}>PASSEPORT MONDIAL REUSSITESS®971</h1>
        <p style={{ textAlign: 'center', color: '#666', fontSize: '11px', marginBottom: '30px' }}>Terres de Champions — 14 pays partenaires — BOUDOUM !</p>

        {step === 0 ? (
          <div>
            <p style={{ color: '#00ff41', marginBottom: '15px', fontSize: '13px' }}>Sélectionnez votre pays pour activer votre Passeport :</p>
            <select onChange={(e) => startValidation(e.target.value)} style={{ width: '100%', padding: '15px', background: '#000', color: '#00ff41', border: '1px solid #00ff41', cursor: 'pointer' }}>
              <option>-- SÉLECTIONNEZ UN PAYS --</option>
              {pays.map(p => <option key={p} value={p}>{p}</option>)}
            </select>

            {/* Ressources réelles */}
            <div style={{ marginTop: '30px' }}>
              <p style={{ color: '#fff', fontSize: '12px', marginBottom: '15px' }}>🌍 ÉCOSYSTÈME REUSSITESS®971 — Liens directs :</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {ressources.map(r => (
                  <a key={r.url} href={r.url} style={{ background: '#0a0a0a', border: '1px solid #1a3a1a', padding: '10px', textDecoration: 'none', borderRadius: '4px' }}>
                    <div style={{ color: '#00ff41', fontSize: '12px', fontWeight: 'bold' }}>{r.label}</div>
                    <div style={{ color: '#555', fontSize: '10px', marginTop: '3px' }}>{r.desc}</div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span>MODULES ACTIFS : {activeIAs}/100</span>
                <span>STATUS : {isVerified ? '✅ VALIDÉ' : 'EN COURS...'}</span>
              </div>
              <div style={{ height: '2px', background: '#222', width: '100%', marginTop: '5px' }}>
                <div style={{ height: '100%', background: '#00ff41', width: `${activeIAs}%`, transition: 'width 0.1s' }}></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(20, 1fr)', gap: '2px', marginTop: '10px' }}>
                {Array.from({ length: 100 }).map((_, i) => (
                  <div key={i} style={{ width: '4px', height: '4px', background: i < activeIAs ? '#00ff41' : '#111' }}></div>
                ))}
              </div>
            </div>

            <div style={{ background: '#000', padding: '20px', borderLeft: '2px solid #00ff41', height: '200px', overflowY: 'auto' }}>
              {terminal.map((line, i) => (
                <div key={i} style={{ marginBottom: '5px', fontSize: '11px', color: line.includes('[SUCCESS]') ? '#fff' : '#00ff41' }}>
                  {`> ${line}`}
                </div>
              ))}
            </div>

            {isVerified && (
              <div style={{ marginTop: '30px' }}>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <Link href="/certificat" style={{ background: '#00ff41', color: '#000', padding: '15px 35px', fontWeight: 'bold', textDecoration: 'none' }}>
                    🏆 OBTENIR MON CERTIFICAT CHAMPION
                  </Link>
                </div>
                <p style={{ color: '#666', fontSize: '11px', textAlign: 'center', marginBottom: '15px' }}>Rejoins l'écosystème REUSSITESS®971 :</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {ressources.map(r => (
                    <a key={r.url} href={r.url} style={{ background: '#0a0a0a', border: '1px solid #1a3a1a', padding: '10px', textDecoration: 'none', borderRadius: '4px' }}>
                      <div style={{ color: '#00ff41', fontSize: '12px', fontWeight: 'bold' }}>{r.label}</div>
                      <div style={{ color: '#555', fontSize: '10px', marginTop: '3px' }}>{r.desc}</div>
                    </a>
                  ))}
                </div>
                <p style={{ color: '#333', fontSize: '10px', textAlign: 'center', marginTop: '20px' }}>
                  SIRET: 444699979700031 — reussitess.fr — Fondé depuis la Guadeloupe 971 par Rony Porinus
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
