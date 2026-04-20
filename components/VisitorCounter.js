/* © Reussitess®971 INPI DSO2026012614 PORINUS Rony 2026 */
"use client";

import { useState, useEffect } from "react";

export default function VisitorCounter() {
  const [visitorCount, setVisitorCount] = useState("...");

  useEffect(() => {
    fetch("/api/visitors")
      .then(r => r.json())
      .then(d => { const n = Number(d?.count); if (Number.isFinite(n)) setVisitorCount(n.toLocaleString("fr-FR")); else setVisitorCount("0") })
      .catch(() => {})
  }, []);

  return (
    <div style={{ position: "fixed", top: "70px", right: "10px", background: "rgba(0,0,0,0.6)", backdropFilter: "blur(10px)", border: "1px solid #667eea", borderRadius: "20px", padding: "4px 10px", zIndex: 998, display: "flex", alignItems: "center", gap: "5px", cursor: "default" }}>
      <span style={{ fontSize: "0.75rem" }}>👥</span>
      <span style={{ fontSize: "0.75rem", fontWeight: "700", color: "#a78bfa" }}>{visitorCount}</span>
    </div>
  );
}
