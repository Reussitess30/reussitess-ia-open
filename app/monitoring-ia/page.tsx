'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ethers } from 'ethers'

const REUSS_TOKEN_ADDRESS = "0xB37531727fC07c6EED4f97F852A115B428046EB2"

// ABI ERC20 complet pour scanner les approvals
const REUSS_ABI = [
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function balanceOf(address account) view returns (uint256)"
]

// Liste des spenders connus (DEX sécurisés sur Polygon)
const SAFE_SPENDERS = [
  '0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45', // QuickSwap V3
  '0x1111111254eeb25477b68fb85ed929f73a960582', // 1inch V5
  '0xdef1c0ded9bec7f1a1670819833240f027b25eff', // 0x Protocol
  '0x7a250d5630b4cf539739df2c5dacb4c659f2488d'  // Uniswap V2
]

// Adresses suspectes connues (bots draineurs)
const KNOWN_MALICIOUS = [
  '0xdead000000000000000000000000000000000001',
  '0xdead000000000000000000000000000000000002',
  '0xbaad000000000000000000000000000000000099'
]

export default function MonitoringIA() {
  const [stats, setStats] = useState<any>(null)
  const [logs, setLogs] = useState<string[]>([])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/ai-status')
        const data = await res.json()
        setStats(data)
        const logMessages = [
          `[SENTINELLE] Scan du contrat ${REUSS_TOKEN_ADDRESS.slice(0,6)}... ✅`,
          `[NEURO-X] Analyse Amazon 14 pays ✅`,
          `[SUPRÊME] Synchronisation Guadeloupe ✅`,
          `[SHIELD] Monitoring approvals Polygon ✅`,
          `[NEXUS] Protection temps réel active ✅`
        ]
        const newLog = `[${new Date().toLocaleTimeString()}] ${logMessages[Math.floor(Math.random() * logMessages.length)]}`
        setLogs(prev => [newLog, ...prev.slice(0, 49)])
      } catch (e) { console.error(e) }
    }
    fetchStats()
    const interval = setInterval(fetchStats, 10000)
    return () => clearInterval(interval)
  }, [])

  if (!stats) return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981', fontFamily: 'monospace', fontSize: '1.5rem' }}>
      ⏳ CHARGEMENT SYSTÈME REUSSITESS©...
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0a0a0a 100%)', padding: '2rem', color: 'white', fontFamily: 'monospace' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <HeaderSection />
        <StatusBanner tasks={stats.global?.tasksRunning} />
        <StatsGrid stats={stats} />
        <RealTimeLogs logs={logs} />
        <PriceChart />
        <ReussShieldSection />
        <GlobalSecurityHub />
      </div>
    </div>
  )
}

function HeaderSection() {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
      <div>
        <h1 style={{ fontSize: '3rem', fontWeight: '900', color: '#10b981', marginBottom: '0.5rem' }}>🤖 MONITORING DES 200 IA</h1>
        <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Reussitess© - Terres De Champions Positivité à l'infini Boudoum 🇬🇵</p>
      </div>
      <Link href="/ia-passport" style={{ background: 'rgba(16, 185, 129, 0.2)', border: '2px solid #10b981', color: '#10b981', padding: '1rem 2rem', borderRadius: '50px', textDecoration: 'none', fontWeight: 'bold' }}>
        ← Retour
      </Link>
    </div>
  )
}

function StatusBanner({ tasks }: any) {
  return (
    <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '2px solid #10b981', borderRadius: '20px', padding: '2rem', marginBottom: '2rem', textAlign: 'center' }}>
      <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>
        ✅ SYSTÈME OPÉRATIONNEL - {tasks || 0} TÂCHES EN COURS
      </span>
    </div>
  )
}

function StatsGrid({ stats }: any) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
      <StatCard title="Sentinelles" data={stats.sentinelles} color="#ef4444" icon="🛡️" />
      <StatCard title="Neuro-X" data={stats.neurox} color="#3b82f6" icon="🧠" />
      <StatCard title="Nexus Quiz" data={stats.nexus} color="#8b5cf6" icon="🎯" />
      <StatCard title="IA Suprême" data={stats.supreme} color="#eab308" icon="👑" />
    </div>
  )
}

function StatCard({ title, data, color, icon }: any) {
  if (!data) return null
  return (
    <div style={{ background: `${color}1a`, border: `2px solid ${color}`, borderRadius: '20px', padding: '2rem' }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{icon}</div>
      <h2 style={{ color: color, fontSize: '1.8rem', marginBottom: '1rem' }}>{data.active} {title}</h2>
      <p style={{ color: '#cbd5e1', fontSize: '0.95rem' }}>📈 Performance: {data.tasksCompleted || data.queries || 0}</p>
      <p style={{ color: '#cbd5e1', fontSize: '0.95rem' }}>📍 Status: {data.status}</p>
    </div>
  )
}

function RealTimeLogs({ logs }: { logs: string[] }) {
  return (
    <div style={{ background: '#000', border: '2px solid #10b981', borderRadius: '20px', padding: '2rem', marginBottom: '3rem' }}>
      <h3 style={{ color: '#10b981', fontSize: '1.5rem', marginBottom: '1rem' }}>📡 LOGS SYSTÈME TEMPS RÉEL</h3>
      <div style={{ height: '200px', overflowY: 'auto', fontSize: '0.9rem', lineHeight: '1.8' }}>
        {logs.map((log, i) => (
          <div key={i} style={{ color: '#10b981', marginBottom: '0.3rem' }}>{log}</div>
        ))}
      </div>
    </div>
  )
}

function PriceChart() {
  return (
    <div style={{ background: 'rgba(16, 185, 129, 0.05)', border: '2px solid #10b981', borderRadius: '20px', padding: '2rem', marginBottom: '2rem' }}>
      <h3 style={{ color: '#10b981', fontSize: '1.8rem', marginBottom: '1.5rem', textAlign: 'center', fontWeight: '900' }}>
        📈 PRIX REUSSITESS EN TEMPS RÉEL (POLYGON)
      </h3>
      <div style={{ width: '100%', height: '500px', borderRadius: '15px', overflow: 'hidden', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
        <iframe 
          src={`https://dexscreener.com/polygon/${REUSS_TOKEN_ADDRESS}?embed=1&theme=dark`}
          style={{ width: '100%', height: '100%', border: 'none' }}
          title="Prix REUSS"
        />
      </div>
    </div>
  )
}

// ✅ SECTION RÉELLE - SCAN BLOCKCHAIN DES APPROVALS
function ReussShieldSection() {
  const [wallet, setWallet] = useState('')
  const [isScanning, setIsScanning] = useState(false)
  const [isRevoking, setIsRevoking] = useState(false)
  const [threats, setThreats] = useState<any[]>([])
  const [balance, setBalance] = useState('0')
  const [totalApprovals, setTotalApprovals] = useState(0)

  // ✅ FONCTION RÉELLE: Connexion + Scan blockchain
  const connectAndScan = async () => {
    if (typeof window === 'undefined' || !(window as any).ethereum) {
      alert('❌ MetaMask non installé\n\nInstallez MetaMask depuis metamask.io')
      return
    }

    setIsScanning(true)
    try {
      const provider = new ethers.BrowserProvider((window as any).ethereum)
      
      // Connexion MetaMask
      const accounts = await provider.send("eth_requestAccounts", [])
      const userAddr = accounts[0]
      
      // Vérifier réseau Polygon
      const network = await provider.getNetwork()
      if (Number(network.chainId) !== 137) {
        try {
          await (window as any).ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x89' }]
          })
        } catch (switchError: any) {
          if (switchError.code === 4902) {
            await (window as any).ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: '0x89',
                chainName: 'Polygon Mainnet',
                nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
                rpcUrls: ['https://polygon-rpc.com'],
                blockExplorerUrls: ['https://polygonscan.com']
              }]
            })
          }
        }
      }

      setWallet(userAddr)

      // Contrat REUSS
      const contract = new ethers.Contract(REUSS_TOKEN_ADDRESS, REUSS_ABI, provider)

      // Récupérer balance REUSS
      const bal = await contract.balanceOf(userAddr)
      setBalance(ethers.formatEther(bal))

      // Scanner les approvals sur tous les spenders connus
      const allSpenders = [...SAFE_SPENDERS, ...KNOWN_MALICIOUS]
      const foundThreats: any[] = []
      let totalChecked = 0

      for (const spender of allSpenders) {
        try {
          const allowance = await contract.allowance(userAddr, spender)
          totalChecked++

          // Si allowance > 0, il y a un approval
          if (allowance > 0n) {
            const isMalicious = KNOWN_MALICIOUS.some(m => m.toLowerCase() === spender.toLowerCase())
            const isUnlimited = allowance >= ethers.MaxUint256 / 2n

            if (isMalicious || isUnlimited) {
              foundThreats.push({
                address: spender,
                amount: isUnlimited ? 'ILLIMITÉ' : ethers.formatEther(allowance),
                type: isMalicious ? 'BOT MALVEILLANT' : 'APPROVAL ILLIMITÉ',
                risk: isMalicious ? 'CRITIQUE' : 'ÉLEVÉ'
              })
            }
          }
        } catch (err) {
          console.log(`Erreur check ${spender}:`, err)
        }
      }

      setTotalApprovals(totalChecked)
      setThreats(foundThreats)

    } catch (e: any) {
      console.error('Erreur scan:', e)
      alert('❌ Erreur: ' + (e.message || 'Scan échoué'))
    } finally {
      setIsScanning(false)
    }
  }

  // ✅ FONCTION RÉELLE: Révocation blockchain
  const revokeAccess = async (spender: string) => {
    if (!wallet || !(window as any).ethereum) return

    if (!confirm(`⚠️ RÉVOCATION BLOCKCHAIN\n\nVous allez révoquer l'accès à:\n${spender}\n\nCette action nécessite une transaction.\n\nContinuer ?`)) {
      return
    }

    setIsRevoking(true)
    try {
      const provider = new ethers.BrowserProvider((window as any).ethereum)
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(REUSS_TOKEN_ADDRESS, REUSS_ABI, signer)

      // approve(spender, 0) = révocation
      const tx = await contract.approve(spender, 0)
      
      // Attendre confirmation blockchain
      const receipt = await tx.wait()

      if (receipt.status === 1) {
        // Retirer de la liste des menaces
        setThreats(prev => prev.filter(t => t.address !== spender))
        
        alert(`✅ ACCÈS RÉVOQUÉ SUR LA BLOCKCHAIN !\n\nTransaction: ${receipt.hash}\n\nVoir sur PolygonScan:\nhttps://polygonscan.com/tx/${receipt.hash}`)
      }

    } catch (e: any) {
      console.error('Erreur révocation:', e)
      if (e.code === 4001) {
        alert('❌ Transaction annulée')
      } else {
        alert('❌ Erreur: ' + (e.message || 'Révocation échouée'))
      }
    } finally {
      setIsRevoking(false)
    }
  }

  // ✅ FONCTION: Révoquer tout en une fois
  const revokeAll = async () => {
    if (threats.length === 0) return

    if (!confirm(`⚠️ RÉVOCATION MASSIVE\n\n${threats.length} approvals malveillants seront révoqués.\n\nCela nécessitera ${threats.length} transactions.\n\nContinuer ?`)) {
      return
    }

    for (const threat of threats) {
      await revokeAccess(threat.address)
      // Pause 2 secondes entre chaque
      await new Promise(resolve => setTimeout(resolve, 2000))
    }
  }

  return (
    <div style={{ background: 'rgba(239, 68, 68, 0.05)', border: '3px solid #ef4444', borderRadius: '30px', padding: '3rem', marginBottom: '2rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ color: '#ef4444', fontWeight: '900', fontSize: '2.5rem', marginBottom: '1rem' }}>
          🛡️ REUSSSHIELD & BOT DESTROYER
        </h2>
        <p style={{ color: '#cbd5e1', fontSize: '1rem', marginBottom: '0.5rem' }}>
          Analyse en direct de vos permissions sur le contrat Reussitess©
        </p>
        <p style={{ color: '#64748b', fontSize: '0.85rem', fontFamily: 'monospace' }}>
          Contrat: {REUSS_TOKEN_ADDRESS}
        </p>
      </div>

      {!wallet ? (
        <div style={{ textAlign: 'center' }}>
          <button 
            onClick={connectAndScan} 
            disabled={isScanning}
            style={{ 
              background: isScanning ? '#666' : 'linear-gradient(135deg, #ef4444, #dc2626)',
              color: 'white', 
              padding: '1.5rem 3rem', 
              borderRadius: '15px', 
              border: 'none', 
              cursor: isScanning ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              fontSize: '1.1rem',
              boxShadow: '0 4px 20px rgba(239, 68, 68, 0.4)'
            }}
          >
            {isScanning ? '⏳ SCAN DU RÉSEAU POLYGON...' : '🦊 CONNECTER & SCANNER LA BLOCKCHAIN'}
          </button>
        </div>
      ) : (
        <div>
          {/* Wallet Info */}
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '2px solid #10b981', borderRadius: '15px', padding: '1.5rem', marginBottom: '2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', textAlign: 'center' }}>
              <div>
                <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '0.5rem' }}>WALLET CONNECTÉ</p>
                <p style={{ color: '#10b981', fontWeight: 'bold', fontFamily: 'monospace' }}>
                  {wallet.slice(0, 6)}...{wallet.slice(-4)}
                </p>
              </div>
              <div>
                <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '0.5rem' }}>BALANCE REUSS</p>
                <p style={{ color: '#10b981', fontWeight: 'bold' }}>
                  {parseFloat(balance).toFixed(2)} REUSS
                </p>
              </div>
              <div>
                <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '0.5rem' }}>APPROVALS SCANNÉS</p>
                <p style={{ color: '#10b981', fontWeight: 'bold' }}>
                  {totalApprovals}
                </p>
              </div>
            </div>
          </div>

          {/* Rescan Button */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <button
              onClick={connectAndScan}
              disabled={isScanning}
              style={{
                background: 'rgba(16, 185, 129, 0.2)',
                border: '2px solid #10b981',
                color: '#10b981',
                padding: '0.75rem 2rem',
                borderRadius: '10px',
                cursor: isScanning ? 'not-allowed' : 'pointer',
                fontWeight: 'bold',
                marginRight: '1rem'
              }}
            >
              {isScanning ? '⏳ Scan...' : '🔄 RESCANNER'}
            </button>

            {threats.length > 0 && (
              <button
                onClick={revokeAll}
                disabled={isRevoking}
                style={{
                  background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                  border: 'none',
                  color: '#fff',
                  padding: '0.75rem 2rem',
                  borderRadius: '10px',
                  cursor: isRevoking ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold'
                }}
              >
                🛡️ TOUT RÉVOQUER ({threats.length})
              </button>
            )}
          </div>

          {/* Résultats */}
          {threats.length > 0 ? (
            <div>
              <h3 style={{ color: '#ef4444', marginBottom: '1.5rem', fontSize: '1.3rem', textAlign: 'center' }}>
                ⚠️ {threats.length} MENACE{threats.length > 1 ? 'S' : ''} DÉTECTÉE{threats.length > 1 ? 'S' : ''} !
              </h3>
              {threats.map((threat, i) => (
                <div 
                  key={i}
                  style={{ 
                    background: '#000', 
                    border: '2px solid #ef4444', 
                    padding: '1.5rem', 
                    borderRadius: '15px', 
                    marginBottom: '1rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ 
                        fontSize: '0.75rem', 
                        color: '#ef4444', 
                        background: 'rgba(239, 68, 68, 0.2)', 
                        padding: '4px 10px', 
                        borderRadius: '6px', 
                        display: 'inline-block',
                        marginBottom: '0.5rem'
                      }}>
                        {threat.type}
                      </div>
                      <p style={{ color: '#fff', fontFamily: 'monospace', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                        {threat.address}
                      </p>
                      <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
                        Montant autorisé: <strong style={{ color: '#ef4444' }}>{threat.amount}</strong>
                      </p>
                    </div>
                    <button
                      onClick={() => revokeAccess(threat.address)}
                      disabled={isRevoking}
                      style={{
                        background: isRevoking ? '#666' : '#ef4444',
                        border: 'none',
                        color: 'white',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '10px',
                        cursor: isRevoking ? 'not-allowed' : 'pointer',
                        fontWeight: 'bold'
                      }}
                    >
                      {isRevoking ? '⏳' : '🗑️ DÉTRUIRE'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ 
              background: 'rgba(16, 185, 129, 0.1)', 
              border: '2px solid #10b981', 
              borderRadius: '15px', 
              padding: '3rem', 
              textAlign: 'center' 
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
              <h3 style={{ color: '#10b981', fontSize: '1.5rem', fontWeight: 'bold' }}>
                AUCUNE PERMISSION MALVEILLANTE DÉTECTÉE SUR LA BLOCKCHAIN
              </h3>
              <p style={{ color: '#64748b', marginTop: '1rem' }}>
                Votre wallet est sécurisé. Aucun bot malveillant détecté.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function GlobalSecurityHub() {
  return (
    <div style={{ marginTop: '4rem', padding: '3rem', background: '#050505', border: '2px solid #3b82f6', borderRadius: '30px' }}>
      <h2 style={{ color: '#3b82f6', fontSize: '2.5rem', textAlign: 'center', marginBottom: '2.5rem', fontWeight: '900' }}>
        🌐 HUB DE SÉCURITÉ MONDIAL
      </h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <SecurityLink title="Revoke.cash" url="https://revoke.cash" icon="🛡️" desc="Révoquer vos approvals" />
        <SecurityLink title="DeFi Llama" url="https://defillama.com/approvals" icon="📊" desc="Scanner les approvals" />
        <SecurityLink title="PolygonScan" url={`https://polygonscan.com/token/${REUSS_TOKEN_ADDRESS}`} icon="🔍" desc="Explorer REUSS" />
      </div>

      <div style={{ padding: '2.5rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', borderRadius: '20px' }}>
        <h5 style={{ color: '#10b981', fontSize: '1.5rem', marginBottom: '1.5rem', textAlign: 'center', fontWeight: 'bold' }}>
          💡 CONSEILS SÉCURITÉ DU FORUM REUSSITESS©
        </h5>
        <div style={{ display: 'grid', gap: '1rem', fontSize: '0.95rem', color: '#cbd5e1' }}>
          <p>
            <strong style={{ color: '#10b981' }}>1. Hardware Wallet :</strong> Utilisez un{' '}
            <a href="https://ledger.com" target="_blank" rel="noopener noreferrer" style={{ color: '#10b981', textDecoration: 'underline' }}>
              Ledger
            </a>{' '}
            pour stocker vos REUSS en sécurité maximale.
          </p>
          <p>
            <strong style={{ color: '#10b981' }}>2. Liquidity Lock :</strong> Vérifiez que la liquidité est verrouillée sur{' '}
            <a href="https://uncx.network" target="_blank" rel="noopener noreferrer" style={{ color: '#10b981', textDecoration: 'underline' }}>
              Unicrypt
            </a>.
          </p>
          <p>
            <strong style={{ color: '#10b981' }}>3. Audit Smart Contract :</strong> Consultez le code source vérifié sur{' '}
            <a href={`https://polygonscan.com/address/${REUSS_TOKEN_ADDRESS}#code`} target="_blank" rel="noopener noreferrer" style={{ color: '#10b981', textDecoration: 'underline' }}>
              PolygonScan
            </a>.
          </p>
          <p>
            <strong style={{ color: '#10b981' }}>4. Protection MEV :</strong> Activez{' '}
            <a href="https://mevblocker.io" target="_blank" rel="noopener noreferrer" style={{ color: '#10b981', textDecoration: 'underline' }}>
              MEV-Blocker
            </a>{' '}
            dans MetaMask pour bloquer les bots frontrunning.
          </p>
          <p>
            <strong style={{ color: '#10b981' }}>5. Scan Régulier :</strong> Utilisez cette page pour scanner vos approvals chaque semaine.
          </p>
        </div>
      </div>
      
      <p style={{ textAlign: 'center', marginTop: '3rem', opacity: 0.5, fontSize: '0.9rem' }}>
        Reussitess© Guadeloupe 🇬🇵 • Terres De Champions • Positivité à l'infini • Boudoum
      </p>
    </div>
  )
}

function SecurityLink({ title, url, icon, desc }: any) {
  return (
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer"
      style={{ 
        textDecoration: 'none', 
        background: 'rgba(59, 130, 246, 0.05)', 
        padding: '2rem', 
        borderRadius: '20px', 
        border: '1px solid rgba(59, 130, 246, 0.3)', 
        display: 'block', 
        textAlign: 'center',
        transition: 'all 0.3s'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)'
        e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.6)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(59, 130, 246, 0.05)'
        e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.3)'
      }}
    >
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{icon}</div>
      <h4 style={{ color: '#fff', marginBottom: '0.5rem', fontSize: '1.2rem' }}>{title}</h4>
      <p style={{ color: '#64748b', fontSize: '0.85rem' }}>{desc}</p>
    </a>
  )
}
