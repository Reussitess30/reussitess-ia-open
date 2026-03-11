"use client";

import { useState, useEffect } from "react";

export default function VisitorCounter() {
  const [visitorCount, setVisitorCount] = useState(null);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await fetch("https://api.countapi.xyz/hit/reussitess.fr/visits")
        const data = await res.json()
        if (data.value) setVisitorCount(data.value)
      } catch(e) {
        setVisitorCount(null)
      }
    }
    fetchCount()
  }, []);

  if (!visitorCount) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        left: "20px",
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(10px)",
        border: "2px solid #667eea",
        borderRadius: "15px",
        padding: "15px 25px",
        boxShadow: "0 8px 32px rgba(102, 126, 234, 0.3)",
        zIndex: 999,
        display: "flex",
        alignItems: "center",
        gap: "12px",
        cursor: "default",
      }}
      className="visitor-counter"
    >
      <div style={{ fontSize: "2rem" }}>👥</div>
      <div>
        <div style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "2px" }}>
          Visiteurs
        </div>
        <div style={{ fontSize: "1.5rem", fontWeight: "800", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", lineHeight: "1" }}>
          {visitorCount.toLocaleString("fr-FR")}
        </div>
      </div>
    </div>
  );
}
