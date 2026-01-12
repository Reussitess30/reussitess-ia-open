'use client'
import { useState, useEffect } from 'react';

export default function BlockchainNotif() {
  const [notif, setNotif] = useState(null);

  const movements = [
    "🚀 NOUVEAU SWAP : 858 REUSS via Velora v5",
    "💎 TRANSFERT RÉSERVE : +12,708,649 REUSS (Quantum Vault)",
    "🔐 DÉLÉGATION SÉCURISÉE : 1,503,674 REUSS par Fondateur",
    "⚛️ POOL LIQUIDITÉ : Ajustement automatique par IA #42",
    "🌍 EXPANSION : Connexion Bridge établie via LiFi Diamond"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      const randomMsg = movements[Math.floor(Math.random() * movements.length)];
      setNotif(randomMsg);
      setTimeout(() => setNotif(null), 4000);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  if (!notif) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 9999,
      background: 'rgba(16, 185, 129, 0.95)',
      color: 'white',
      padding: '1rem 2rem',
      borderRadius: '12px',
      fontWeight: 'bold',
      boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
      border: '2px solid #fff',
      animation: 'slideInRight 0.5s ease-out'
    }}>
      {notif}
    </div>
  );
}
