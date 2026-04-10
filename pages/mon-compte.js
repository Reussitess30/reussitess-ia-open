/* © Reussitess®971 INPI DSO2026012614 PORINUS Rony 2026 */
"use client";
import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import Link from "next/link";

export default function MonCompte() {
  const [reussPoints, setReussPoints] = useState(0);
  const [quizHistory, setQuizHistory] = useState([]);
  const [userName, setUserName] = useState("");
  const [editName, setEditName] = useState(false);
  const [tempName, setTempName] = useState("");

  useEffect(() => {
    const points = parseInt(localStorage.getItem("reuss_points") || "0");
    const history = JSON.parse(localStorage.getItem("reuss_history") || "[]");
    const name = localStorage.getItem("reuss_username") || "";
    setReussPoints(points);
    setQuizHistory(history);
    setUserName(name);
  }, []);

  const saveName = () => {
    localStorage.setItem("reuss_username", tempName);
    setUserName(tempName);
    setEditName(false);
  };

  const getTier = (points) => {
    if (points >= 500000) return { name: "💎 Platinum", color: "#e879f9", min: 500000 };
    if (points >= 100000) return { name: "🥇 Gold", color: "#ffd700", min: 100000 };
    if (points >= 25000) return { name: "🥈 Silver", color: "#94a3b8", min: 25000 };
    return { name: "🥉 Bronze", color: "#cd7f32", min: 0 };
  };

  const tier = getTier(reussPoints);

  const rewards = [
    { reuss: 1000, label: "5% réduction sur nos services", icon: "🛍️", available: reussPoints >= 1000 },
    { reuss: 5000, label: "Code promo exclusif 10%", icon: "🎁", available: reussPoints >= 5000 },
    { reuss: 10000, label: "Tier Bronze — Membre actif REUSSITESS®971", icon: "⭐", available: reussPoints >= 10000 },
    { reuss: 50000, label: "Tier Silver — Accès prioritaire nouvelles fonctionnalités", icon: "🥈", available: reussPoints >= 50000 },
    { reuss: 100000, label: "Tier Gold — Statut Champion reconnu", icon: "🥇", available: reussPoints >= 100000 },
    { reuss: 500000, label: "Tier Platinum — Gouvernance DAO (en développement)", icon: "💎", available: reussPoints >= 500000 },
  ];

  return (
    <Layout title="Mon Compte REUSS — REUSSITESS®971">
      <div style={{ minHeight: "100vh", background: "linear-gradient(180deg, #0f172a 0%, #1e293b 100%)", padding: "2rem 1rem" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>

          {/* HEADER */}
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>👤</div>
            {editName ? (
              <div style={{ display: "flex", gap: "1rem", justifyContent: "center", marginBottom: "1rem" }}>
                <input
                  value={tempName}
                  onChange={e => setTempName(e.target.value)}
                  placeholder="Votre prénom..."
                  style={{ padding: "0.5rem 1rem", borderRadius: "10px", border: "2px solid #7c3aed", background: "#1e293b", color: "white", fontSize: "1rem" }}
                />
                <button onClick={saveName} style={{ background: "#10b981", color: "white", border: "none", padding: "0.5rem 1rem", borderRadius: "10px", cursor: "pointer", fontWeight: "bold" }}>✅ Sauver</button>
              </div>
            ) : (
              <div style={{ marginBottom: "1rem" }}>
                <h1 style={{ color: "white", fontSize: "1.8rem", fontWeight: "900" }}>
                  {userName || "Champion REUSSITESS®"}
                </h1>
                <button onClick={() => { setEditName(true); setTempName(userName); }} style={{ background: "transparent", color: "#7c3aed", border: "1px solid #7c3aed", padding: "0.3rem 1rem", borderRadius: "20px", cursor: "pointer", fontSize: "0.85rem" }}>✏️ Modifier mon nom</button>
              </div>
            )}
            <div style={{ color: tier.color, fontWeight: "900", fontSize: "1.3rem" }}>{tier.name}</div>
          </div>

          {/* SOLDE REUSS */}
          <div style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.3), rgba(16,185,129,0.3))", border: "2px solid #7c3aed", borderRadius: "20px", padding: "2rem", textAlign: "center", marginBottom: "2rem" }}>
            <div style={{ color: "#a78bfa", fontSize: "1rem", marginBottom: "0.5rem" }}>💎 Solde GAMMA-2</div>
            <div style={{ color: "white", fontSize: "3rem", fontWeight: "900" }}>{reussPoints.toLocaleString()} REUSS</div>
            <div style={{ color: "#6ee7b7", fontSize: "0.85rem", marginTop: "0.5rem" }}>
              ≈ {(reussPoints / 1000).toFixed(1)}€ en valeur récompense
            </div>
            <div style={{ color: "#94a3b8", fontSize: "0.75rem", marginTop: "0.5rem" }}>
              Distribution depuis Treasury REUSS à l&apos;activation du système on-chain
            </div>
          </div>

          {/* RÉCOMPENSES */}
          <div style={{ marginBottom: "2rem" }}>
            <h2 style={{ color: "white", fontWeight: "900", fontSize: "1.3rem", marginBottom: "1rem" }}>🎁 Récompenses disponibles</h2>
            <div style={{ display: "grid", gap: "1rem" }}>
              {rewards.map((r, i) => (
                <div key={i} style={{ background: r.available ? "rgba(16,185,129,0.1)" : "rgba(255,255,255,0.03)", border: `1px solid ${r.available ? "#10b981" : "rgba(255,255,255,0.1)"}`, borderRadius: "15px", padding: "1rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <span style={{ fontSize: "1.3rem", marginRight: "0.5rem" }}>{r.icon}</span>
                    <span style={{ color: r.available ? "white" : "#64748b", fontWeight: "600" }}>{r.label}</span>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ color: r.available ? "#10b981" : "#64748b", fontWeight: "900" }}>{r.reuss.toLocaleString()} REUSS</div>
                    {r.available && (
                      <a href="mailto:rony.porinus@gmail.com?subject=Récompense REUSS" style={{ color: "#a78bfa", fontSize: "0.8rem" }}>Réclamer →</a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* HISTORIQUE */}
          <div style={{ marginBottom: "2rem" }}>
            <h2 style={{ color: "white", fontWeight: "900", fontSize: "1.3rem", marginBottom: "1rem" }}>📊 Historique Quiz</h2>
            {quizHistory.length === 0 ? (
              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "15px", padding: "2rem", textAlign: "center", color: "#64748b" }}>
                Aucun quiz complété. <Link href="/" style={{ color: "#7c3aed" }}>Commencer un quiz →</Link>
              </div>
            ) : (
              <div style={{ display: "grid", gap: "0.5rem" }}>
                {quizHistory.slice(0, 10).map((h, i) => (
                  <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "0.75rem 1.5rem", display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#cbd5e1" }}>{h.quiz}</span>
                    <span style={{ color: "#10b981", fontWeight: "bold" }}>+{h.reuss.toLocaleString()} REUSS</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* LIEN QUIZ */}
          <div style={{ textAlign: "center" }}>
            <Link href="/" style={{ background: "linear-gradient(135deg, #7c3aed, #10b981)", color: "white", padding: "1rem 3rem", borderRadius: "50px", textDecoration: "none", fontWeight: "900", fontSize: "1.1rem" }}>
              🎯 Gagner plus de REUSS
            </Link>
          </div>

        </div>
      </div>
    </Layout>
  );
}
