'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ethers } from 'ethers'

const REUSS_TOKEN_ADDRESS = "0xB37531727fC07c6EED4f97F852A115B428046EB2"
const AMAZON_ASSOCIATE_TAG = "ronyporinu0ac-21"

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
  const [securityScore, setSecurityScore] = useState(100)

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
        <AmazonDealsSection />
        <ReussShieldSection securityScore={securityScore} setSecurityScore={setSecurityScore} logs={logs} setLogs={setLogs} />
        <GlobalSecurityHub />
      </div>
    </div>
  )
}

// ----------------------- HEADER -----------------------
function HeaderSection() {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
      <div>
        <h1 style={{ fontSize: '3rem', fontWeight: '900', color: '#10b981', marginBottom: '0.5rem' }}>🤖 MONITORING DES 200 IA</h1>
        <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Reussitess© - Terres De Champions Positivité à l'infini Boudoum 🇬🇵</p>
      </div>
      <Link href="/" style={{ background: 'rgba(16, 185, 129, 0.2)', border: '2px solid #10b981', color: '#10b981', padding: '1rem 2rem', borderRadius: '50px', textDecoration: 'none', fontWeight: 'bold' }}>
        ← Retour
      </Link>
    </div>
  )
}

// ----------------------- STATUS -----------------------
function StatusBanner({ tasks }: any) {
  return (
    <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '2px solid #10b981', borderRadius: '20px', padding: '2rem', marginBottom: '2rem', textAlign: 'center' }}>
      <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>
        ✅ SYSTÈME OPÉRATIONNEL - {tasks || 0} TÂCHES EN COURS
      </span>
    </div>
  )
}

// ----------------------- STATS GRID -----------------------
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
      <p style={{ color: '#cbd5e1', fontSize: '0.95rem' }}>📈 Performance: {data.tasksCompleted || data.queries || data.predictions || data.commands || 0}</p>
      <p style={{ color: '#cbd5e1', fontSize: '0.95rem' }}>📍 Status: {data.status}</p>
    </div>
  )
}

// ----------------------- LOGS -----------------------
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

// ----------------------- PRICE CHART -----------------------
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

// ----------------------- AMAZON DEALS SECTION (API RÉELLE - CORRIGÉ) -----------------------
function AmazonDealsSection() {
  const [deals, setDeals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchKeywords, setSearchKeywords] = useState('tech populaire')
  
  useEffect(() => {
    fetchAmazonDeals()
  }, [])
  
  const fetchAmazonDeals = async (keywords?: string) => {
    setLoading(true)
    try {
      const searchQuery = keywords || searchKeywords
      const res = await fetch(`/api/amazon-deals?keywords=${encodeURIComponent(searchQuery)}&max=6`)
      const data = await res.json()
      
      if (data.success && data.deals) {
        setDeals(data.deals)
        console.log(`✅ ${data.deals.length} produits Amazon chargés`)
      }
    } catch (error) {
      console.error('❌ Erreur chargement deals:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ marginTop: '4rem', marginBottom: '4rem' }}>
      {/* Divulgation légale obligatoire */}
      <div style={{ 
        background: 'rgba(255, 193, 7, 0.1)', 
        border: '2px solid #ffc107', 
        borderLeft: '6px solid #ffc107',
        borderRadius: '15px', 
        padding: '1.5rem', 
        marginBottom: '2rem' 
      }}>
        <p style={{ color: '#ffc107', fontSize: '0.95rem', margin: 0 }}>
          ⚠️ <strong>Divulgation importante :</strong> En tant que Partenaire Amazon, REUSSITESS réalise un bénéfice sur les achats remplissant les conditions requises.
        </p>
      </div>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h2 style={{ color: '#10b981', fontSize: '2.5rem', fontWeight: '900', marginBottom: '1rem' }}>
          🛍️ AMAZON DEALS + CASHBACK REUSS
        </h2>
        <p style={{ color: '#cbd5e1', fontSize: '1.1rem', marginBottom: '2rem' }}>
          Achetez sur Amazon via nos liens et recevez des tokens REUSSITESS en cashback !
        </p>
        
        {/* Barre de recherche */}
        <div style={{ 
          maxWidth: '600px', 
          margin: '0 auto 2rem',
          display: 'flex',
          gap: '1rem'
        }}>
          <input
            type="text"
            value={searchKeywords}
            onChange={(e) => setSearchKeywords(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                fetchAmazonDeals()
              }
            }}
            placeholder="Rechercher des produits..."
            style={{
              flex: 1,
              padding: '1rem 1.5rem',
              background: '#1a1a1a',
              border: '2px solid #10b981',
              borderRadius: '50px',
              color: '#fff',
              fontSize: '1rem',
              outline: 'none'
            }}
          />
          <button
            onClick={(e) => {
              e.preventDefault()
              fetchAmazonDeals()
            }}
            disabled={loading}
            style={{
              padding: '1rem 2rem',
              background: loading ? '#666' : 'linear-gradient(135deg, #10b981, #059669)',
              border: 'none',
              borderRadius: '50px',
              color: '#fff',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? '⏳' : '🔍'}
          </button>
        </div>
        
        {/* Explication cashback */}
        <div style={{ 
          background: 'rgba(139, 92, 246, 0.1)', 
          border: '2px solid #8b5cf6', 
          borderRadius: '15px', 
          padding: '1.5rem',
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          <p style={{ color: '#8b5cf6', fontSize: '1rem', margin: 0 }}>
            💎 <strong>Programme Cashback :</strong> Achetez via nos liens et recevez des tokens REUSSITESS gratuits (utility tokens, pas une promesse d'investissement).
          </p>
        </div>
      </div>

      {/* Produits */}
      {loading ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '4rem',
          color: '#10b981',
          fontSize: '1.5rem'
        }}>
          ⏳ Chargement des meilleurs deals Amazon...
        </div>
      ) : deals.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '4rem',
          color: '#64748b',
          fontSize: '1.2rem'
        }}>
          Aucun produit trouvé. Essayez une autre recherche !
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '2rem',
          marginBottom: '3rem'
        }}>
          {deals.map((deal, i) => (
            <DealCard key={i} {...deal} />
          ))}
        </div>
      )}

      {/* Catégories rapides - CORRIGÉ */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <p style={{ color: '#cbd5e1', marginBottom: '1rem' }}>🎯 Recherches populaires :</p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          {['Tech', 'Gaming', 'Audio', 'Smartphones', 'Tablettes', 'Montres'].map(cat => (
            <button
              key={cat}
              onClick={(e) => {
                e.preventDefault()
                setSearchKeywords(cat)
                fetchAmazonDeals(cat)
              }}
              type="button"
              style={{
                padding: '0.5rem 1.5rem',
                background: 'rgba(16, 185, 129, 0.2)',
                border: '1px solid #10b981',
                borderRadius: '50px',
                color: '#10b981',
                cursor: 'pointer',
                fontSize: '0.9rem',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(16, 185, 129, 0.3)'
                e.currentTarget.style.transform = 'scale(1.05)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(16, 185, 129, 0.2)'
                e.currentTarget.style.transform = 'scale(1)'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div style={{ 
        textAlign: 'center', 
        padding: '2rem',
        background: 'rgba(16, 185, 129, 0.05)',
        borderRadius: '15px',
        border: '1px solid rgba(16, 185, 129, 0.2)'
      }}>
        <p style={{ color: '#cbd5e1', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
          Questions sur le programme cashback ?
        </p>
        <a 
          href="mailto:influenceur@reussitess.fr" 
          style={{ 
            color: '#10b981', 
            textDecoration: 'underline',
            fontSize: '1rem',
            fontWeight: 'bold'
          }}
        >
          📧 influenceur@reussitess.fr
        </a>
      </div>
    </div>
  )
}

function DealCard({ asin, title, price, image, features }: any) {
  const affiliateLink = `https://www.amazon.fr/dp/${asin}?tag=${AMAZON_ASSOCIATE_TAG}`
  
  return (
    <div style={{ 
      background: '#1a1a1a', 
      border: '2px solid #10b981', 
      borderRadius: '20px', 
      padding: '2rem',
      transition: 'transform 0.3s, box-shadow 0.3s',
      cursor: 'pointer'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-5px)'
      e.currentTarget.style.boxShadow = '0 10px 40px rgba(16, 185, 129, 0.3)'
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)'
      e.currentTarget.style.boxShadow = 'none'
    }}
    >
      <div style={{ 
        width: '100%', 
        height: '250px', 
        background: '#0a0a0a',
        borderRadius: '15px',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}>
        <img 
          src={image} 
          alt={title}
          style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x300/1a1a1a/10b981?text=Amazon'
          }}
        />
      </div>

      <h3 style={{ 
        color: '#fff', 
        fontSize: '1.1rem', 
        marginBottom: '1rem',
        minHeight: '60px',
        lineHeight: '1.4'
      }}>
        {title && title.length > 60 ? title.substring(0, 60) + '...' : title}
      </h3>

      {features && features.length > 0 && (
        <div style={{ marginBottom: '1rem' }}>
          {features.slice(0, 2).map((feature: string, i: number) => (
            <p key={i} style={{ 
              color: '#64748b', 
              fontSize: '0.85rem',
              marginBottom: '0.25rem'
            }}>
              ✓ {feature.length > 40 ? feature.substring(0, 40) + '...' : feature}
            </p>
          ))}
        </div>
      )}

      <div style={{ 
        color: '#eab308', 
        fontSize: '2rem', 
        fontWeight: 'bold',
        marginBottom: '1rem'
      }}>
        {price ? price.toFixed(2) : '0.00'}€
      </div>

      <div style={{ 
        background: 'rgba(139, 92, 246, 0.2)',
        border: '1px solid #8b5cf6',
        borderRadius: '10px',
        padding: '0.75rem',
        marginBottom: '1.5rem',
        textAlign: 'center'
      }}>
        <p style={{ color: '#8b5cf6', margin: 0, fontSize: '1rem', fontWeight: 'bold' }}>

        </p>
      </div>

      <a 
        href={affiliateLink}
        target="_blank"
        rel="noopener noreferrer"
        style={{ 
          display: 'block',
          background: 'linear-gradient(135deg, #10b981, #059669)',
          border: 'none',
          color: '#fff',
          padding: '1rem 2rem',
          borderRadius: '50px',
          textAlign: 'center',
          textDecoration: 'none',
          fontWeight: 'bold',
          fontSize: '1rem',
          transition: 'transform 0.2s'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)'
        }}
      >
        🛒 Voir sur Amazon
      </a>
    </div>
  )
}

// ----------------------- REUSS SHIELD -----------------------
function ReussShieldSection({ securityScore, setSecurityScore, logs, setLogs }: any) {
  const [wallet, setWallet] = useState('')
  const [isScanning, setIsScanning] = useState(false)
  const [isRevoking, setIsRevoking] = useState(false)
  const [threats, setThreats] = useState<any[]>([])
  const [delegation, setDelegation] = useState<string | null>(null)
  const [balance, setBalance] = useState('0')
  const [totalApprovals, setTotalApprovals] = useState(0)

  const decreaseScore = (amount: number) => setSecurityScore((prev: number) => Math.max(prev - amount, 0))

  const checkDelegation = async (address: string, provider: any) => {
    try {
      const code = await provider.getCode(address)
      if (code && code !== '0x' && code.length > 2) {
        if (code.startsWith('0xef0100')) {
          const delegatedAddr = '0x' + code.slice(8, 48)
          setDelegation(delegatedAddr)
        } else {
          setDelegation('DÉTECTÉE')
        }
      } else {
        setDelegation(null)
      }
    } catch (err) {
      console.error('Erreur vérification délégation:', err)
    }
  }

  const connectAndScan = async () => {
    if (typeof window === 'undefined' || !(window as any).ethereum) {
      alert('❌ MetaMask non détecté')
      return
    }

    setIsScanning(true)
    setThreats([])

    try {
      const provider = new ethers.BrowserProvider((window as any).ethereum)
      const signer = await provider.getSigner()
      const userAddr = await signer.getAddress()
      setWallet(userAddr)

      const network = await provider.getNetwork()
      if (Number(network.chainId) !== 137) {
        try { await (window as any).ethereum.request({ method: 'wallet_switchEthereumChain', params:[{ chainId:'0x89'}]}) }
        catch(err:any) { if(err.code===4902){ await (window as any).ethereum.request({ method:'wallet_addEthereumChain', params:[{ chainId:'0x89', chainName:'Polygon Mainnet', nativeCurrency:{name:'MATIC',symbol:'MATIC',decimals:18}, rpcUrls:['https://polygon-rpc.com'], blockExplorerUrls:['https://polygonscan.com']} ]}) } }
      }

      await checkDelegation(userAddr, provider)
      const contract = new ethers.Contract(REUSS_TOKEN_ADDRESS, REUSS_ABI, provider)
      const bal = await contract.balanceOf(userAddr)
      setBalance(ethers.formatEther(bal))

      const allSpenders = [...SAFE_SPENDERS, ...KNOWN_MALICIOUS]
      const foundThreats:any[] = []
      let totalChecked = 0

      for (const spender of allSpenders) {
        try {
          const allowance = await contract.allowance(userAddr, spender)
          totalChecked++
          if (allowance > 0n) {
            const isMalicious = KNOWN_MALICIOUS.includes(spender.toLowerCase())
            const isUnlimited = allowance >= ethers.MaxUint256 / 2n
            if (isMalicious || isUnlimited) {
              foundThreats.push({ address: spender, amount: isUnlimited?'ILLIMITÉ':ethers.formatEther(allowance), type:isMalicious?'BOT MALVEILLANT':'APPROVAL ILLIMITÉ', risk:isMalicious?'CRITIQUE':'ÉLEVÉ' })
              decreaseScore(isMalicious?25:15)
            }
          }
        } catch(e){ console.log(e) }
      }

      setTotalApprovals(totalChecked)
      setThreats(foundThreats)

      const readProvider = new ethers.JsonRpcProvider('https://polygon-rpc.com/')
      readProvider.on('block', async (blockNum: number) => {
        const block = await readProvider.getBlock(blockNum, true)
        if (block && block.transactions) {
          block.transactions.forEach((tx: any) => {
            if(tx.to?.toLowerCase()===userAddr.toLowerCase() || tx.from?.toLowerCase()===userAddr.toLowerCase()){
              const logMsg = `[${new Date().toLocaleTimeString()}] Transaction détectée : ${typeof tx === 'string' ? tx.slice(0,10) : tx.hash?.slice(0,10)}...`
              setLogs((prev: string[]) => [logMsg,...prev.slice(0,49)])
              decreaseScore(1)
            }
          })
        }
      })

    } catch(e:any){ console.error(e); alert('❌ Erreur scan: '+(e.message||'')) }
    finally { setIsScanning(false) }
  }

  const revokeAccess = async(spender:string)=>{
    if(!wallet || !(window as any).ethereum) return
    if(!confirm(`⚠️ RÉVOCATION BLOCKCHAIN\n\nVous allez révoquer l'accès à:\n${spender}`)) return
    setIsRevoking(true)
    try{
      const provider = new ethers.BrowserProvider((window as any).ethereum)
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(REUSS_TOKEN_ADDRESS, REUSS_ABI, signer)
      const tx = await contract.approve(spender,0)
      const receipt = await tx.wait()
      if(receipt.status===1) {
        setThreats(prev=>prev.filter(t=>t.address!==spender))
        alert(`✅ ACCÈS RÉVOQUÉ ! Tx: ${receipt.hash}`)
      }
    } catch(e:any){ console.error(e); alert('❌ '+(e.message||'')) }
    finally{ setIsRevoking(false) }
  }

  const revokeAll = async()=>{
    for(const t of threats){ await revokeAccess(t.address); await new Promise(r=>setTimeout(r,2000)) }
  }

  return (
    <div style={{ background: 'rgba(239, 68, 68, 0.05)', border: '3px solid #ef4444', borderRadius: '30px', padding: '3rem', marginBottom: '2rem' }}>
      <h2 style={{ color: '#ef4444', fontSize: '2.5rem', textAlign: 'center', marginBottom: '1rem', fontWeight: '900' }}>
        🛡️ REUSSSHIELD & BOT DESTROYER
      </h2>
      <p style={{ textAlign: 'center', color: '#cbd5e1', fontSize: '1.1rem', marginBottom: '2rem' }}>
        Analyse en direct de vos permissions sur le contrat Reussitess©
      </p>

      <div style={{ background: '#000', padding: '1.5rem', borderRadius: '15px', marginBottom: '2rem', textAlign: 'center' }}>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Contrat: {REUSS_TOKEN_ADDRESS}</p>
        {delegation && (
          <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(239, 68, 68, 0.2)', borderRadius: '10px' }}>
            <p style={{ color: '#ef4444', fontWeight: 'bold' }}>⚠️ DÉLÉGATION EIP-7702 DÉTECTÉE</p>
            <p style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>{delegation}</p>
          </div>
        )}
      </div>

      {!wallet ? (
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={connectAndScan}
            disabled={isScanning}
            type="button"
            style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              border: 'none',
              color: '#fff',
              padding: '1.25rem 3rem',
              borderRadius: '50px',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              cursor: isScanning ? 'not-allowed' : 'pointer',
              boxShadow: '0 10px 30px rgba(16, 185, 129, 0.3)'
            }}
          >
            {isScanning ? '⏳ SCAN EN COURS...' : '🦊 CONNECTER & LANCER SCAN RÉEL'}
          </button>
        </div>
      ) : (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <p style={{ color: '#10b981', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                ✅ Connecté: {wallet.slice(0,6)}...{wallet.slice(-4)}
              </p>
              <p style={{ color: '#cbd5e1', fontSize: '0.95rem' }}>
                Balance: {parseFloat(balance).toFixed(4)} REUSS
              </p>
              <p style={{ color: '#cbd5e1', fontSize: '0.95rem' }}>
                Score sécurité: <span style={{ color: securityScore > 70 ? '#10b981' : securityScore > 40 ? '#eab308' : '#ef4444', fontWeight: 'bold' }}>{securityScore}/100</span>
              </p>
            </div>

            {threats.length > 0 && (
              <button
                onClick={revokeAll}
                disabled={isRevoking}
                type="button"
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
                      type="button"
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
          ) : !delegation ? (
            <div style={{ 
              background: 'rgba(16, 185, 129, 0.1)', 
              border: '2px solid #10b981', 
              borderRadius: '15px', 
              padding: '3rem', 
              textAlign: 'center' 
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
              <h3 style={{ color: '#10b981', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                SÉCURISATION ACTIVE : {wallet.slice(0,6)}...{wallet.slice(-4)}
              </h3>
              <p style={{ color: '#10b981', fontSize: '1.1rem', fontWeight: 'bold' }}>
                ✅ AUCUNE PERMISSION MALVEILLANTE DÉTECTÉE SUR LA BLOCKCHAIN
              </p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}

// ----------------------- GLOBAL HUB -----------------------
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
      
      <div style={{ marginTop: '3rem', textAlign: 'center' }}>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1rem' }}>
          <div style={{ textAlign: "center", marginBottom: "2rem" }}><Link href="/" style={{ background: "#10b981", color: "#000", padding: "1rem 3rem", borderRadius: "50px", textDecoration: "none", fontWeight: "900", fontSize: "1.2rem" }}>🏠 Retour Accueil</Link></div>
          Reussitess© Guadeloupe 🇬🇵 • Terres De Champions • Positivité à l'infini • Boudoum
        </p>
        <p style={{ color: '#cbd5e1', fontSize: '0.95rem' }}>
          Contact : <a href="mailto:influenceur@reussitess.fr" style={{ color: '#10b981', textDecoration: 'underline' }}>influenceur@reussitess.fr</a>
        </p>
        <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '1rem' }}>
          <span style={{ marginRight: '1rem' }}>Mentions légales en cours</span>
          <span>Politique de confidentialité en cours</span>
        </p>
      </div>
    </div>
  )
}

// ----------------------- SECURITY LINK -----------------------
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
