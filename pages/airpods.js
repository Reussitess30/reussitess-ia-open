import { useState } from 'react'
import Head from 'next/head'

export default function AirPodsPage() {
  const contractAddress = "0x4b3bFf4b58d22Ad363bb260e22032414d4CfdDB8";
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(contractAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(circle at top, #1e293b 0%, #0f172a 100%)',
      color: 'white',
      fontFamily: 'system-ui, sans-serif',
      padding: '2rem'
    }}>
      <Head>
        <title>REUSSITESS® - AirPod Edition</title>
      </Head>

      <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        {/* Badge */}
        <div style={{
          display: 'inline-block',
          padding: '0.5rem 1.5rem',
          background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '50px',
          fontWeight: 'bold',
          marginBottom: '2rem'
        }}>
          ÉDITION LIMITÉE 🎧
        </div>

        <h1 style={{ fontSize: '3.5rem', fontWeight: '900', marginBottom: '1rem' }}>
          AirPod <span style={{ color: '#667eea' }}>Pro</span> Reussitess
        </h1>
        
        <p style={{ fontSize: '1.2rem', color: '#94a3b8', marginBottom: '3rem' }}>
          L'excellence sonore combinée à la puissance de la blockchain.
        </p>

        {/* Visual Mockup */}
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '30px',
          padding: '3rem',
          border: '1px solid rgba(255,255,255,0.1)',
          marginBottom: '3rem',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
        }}>
          <div style={{ fontSize: '8rem', marginBottom: '1rem' }}>🎧</div>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>Smart Contract Authentifié</h2>
          
          <div onClick={copyToClipboard} style={{
            background: '#0f172a',
            padding: '1rem',
            borderRadius: '15px',
            border: '1px solid #667eea',
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <code style={{ color: '#667eea', fontSize: '1rem', wordBreak: 'break-all' }}>
              {contractAddress}
            </code>
            {copied && (
              <div style={{
                position: 'absolute',
                inset: 0,
                background: '#667eea',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold'
              }}>
                Copié ! ✅
              </div>
            )}
          </div>
          <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#64748b' }}>
            Clique sur l'adresse pour copier le contrat
          </p>
        </div>

        {/* Features */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '20px' }}>
            <div style={{ fontSize: '2rem' }}>💎</div>
            <h3>Premium Audio</h3>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '20px' }}>
            <div style={{ fontSize: '2rem' }}>⚡</div>
            <h3>Safe Mint</h3>
          </div>
        </div>

        <button style={{
          marginTop: '3rem',
          padding: '1.5rem 3rem',
          borderRadius: '50px',
          border: 'none',
          background: 'white',
          color: 'black',
          fontSize: '1.2rem',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}>
          Bientôt disponible
        </button>
      </div>
    </div>
  )
}
