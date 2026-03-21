import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import SuperBotAssistant from './SuperBotAssistant'
import Image from 'next/image'

export default function Layout({ children, title = 'REUSSITESS®971' }) {
  const router = useRouter()

  const siteTitle = `${title} — Bibliothèque Mondiale · Affiliation Amazon · Quiz Francophone`
  const siteDescription = "Reussitess®971 : Bibliothèque mondiale francophone 26 pays, affiliation Amazon Afrique et diaspora, quiz éducatifs interactifs, revenus passifs Bitcoin GoMining. Guadeloupe, Sénégal, Cameroun, Martinique, France, Québec, 14 pays partenaires."
  const siteUrl = "https://reussitess.fr"
  const siteImage = `${siteUrl}/icon-512x512.webp`

  const schemaOrg = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Reussitess®971",
    "url": siteUrl,
    "logo": siteImage,
    "description": siteDescription,
    "foundingLocation": {
      "@type": "Place",
      "name": "Guadeloupe, France"
    },
    "areaServed": [
      "France", "Guadeloupe", "Martinique", "Guyane", "Réunion",
      "Sénégal", "Côte d'Ivoire", "Cameroun", "Mali", "Bénin",
      "Togo", "Congo", "Madagascar", "Haïti"
    ],
    "sameAs": [
      "https://reussitess.fr",
      "https://shop.reussitess.fr"
    ],
    "offers": [
      {
        "@type": "Offer",
        "name": "Quiz éducatifs gratuits",
        "description": "Quiz interactifs sur la culture, technologie, business, Bitcoin mining"
      },
      {
        "@type": "Offer",
        "name": "GoMining — Minage Bitcoin NFT",
        "description": "Générez des revenus passifs en Bitcoin depuis n'importe quel pays"
      }
    ]
  }

  return (
    <>
      <Head>
        {/* ===== TITRE SEO ===== */}
        <title>{siteTitle}</title>

        {/* ===== META DESCRIPTION ===== */}
        <meta name="description" content={siteDescription} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* ===== MOTS-CLÉS SEO ===== */}
        <meta name="keywords" content="bibliothèque mondiale francophone, affiliation amazon afrique, amazon nexus diaspora, quiz francophone interactif, reussitess971, guadeloupe bibliothèque, minage bitcoin guadeloupe, gomining afrique, revenus passifs diaspora, affiliation amazon guadeloupe, quiz educatif antilles, culture francophone 26 pays, investir diaspora, bitcoin martinique, amazon sénégal" />

        {/* ===== AUTEUR & ROBOTS ===== */}
        <meta name="author" content="Reussitess®971" />
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />
        <link rel="canonical" href={`${siteUrl}${router.pathname}`} />

        {/* ===== OPEN GRAPH (Facebook, WhatsApp, LinkedIn) ===== */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${siteUrl}${router.pathname}`} />
        <meta property="og:title" content={siteTitle} />
        <meta property="og:description" content={siteDescription} />
        <meta property="og:image" content={siteImage} />
        <meta property="og:locale" content="fr_FR" />
        <meta property="og:site_name" content="Reussitess®971" />

        {/* ===== TWITTER CARD ===== */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={siteTitle} />
        <meta name="twitter:description" content={siteDescription} />
        <meta name="twitter:image" content={siteImage} />

        {/* ===== SCHEMA.ORG (données structurées Google) ===== */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
        />

        {/* ===== ICÔNE ===== */}
        <link rel="icon" href="/images/logo-guadeloupe-monde.svg" />
      </Head>

      {/* BANNIÈRE AMAZON */}
      <div style={{
        background: 'linear-gradient(135deg, #ff9f43 0%, #ff6b6b 100%)',
        color: 'white',
        padding: '0.75rem 1rem',
        textAlign: 'center',
        fontSize: '0.9rem',
        fontWeight: '600',
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
      }}>
        🛍️ <strong>Programme Partenaires Amazon</strong> - En tant qu'Affilié Amazon, nous réalisons un bénéfice sur les achats qualifiés. Merci ! 🙏
      </div>

      {/* NAVBAR */}
      <nav style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        padding: '1rem 2rem',
        boxShadow: '0 2px 20px rgba(0,0,0,0.3)',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          {/* LOGO avec image */}
          <Link href="/" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            textDecoration: 'none'
          }}>
            <Image
              src="/images/logo-guadeloupe-monde.svg"
              alt="Guadeloupe au centre du monde"
              width={50}
              height={50}
              style={{ filter: 'drop-shadow(0 0 10px rgba(16, 185, 129, 0.5))' }}
            />
            <span style={{
              fontSize: '1.5rem',
              fontWeight: '900',
              background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              REUSSITESS®971
            </span>
          </Link>

          {/* MENU LINKS */}
          <div style={{
            display: 'flex',
            gap: '1.5rem',
            flexWrap: 'wrap',
            alignItems: 'center'
          }}>
            <Link href="/" style={{
              color: router.pathname === '/' ? '#10b981' : '#94a3b8',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '0.95rem'
            }}>
              Accueil
            </Link>

            <Link href="/a-propos" style={{
              color: router.pathname === '/a-propos' ? '#10b981' : '#94a3b8',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '0.95rem'
            }}>
              À propos
            </Link>

            <Link href="/analytics" style={{
              color: router.pathname === '/analytics' ? '#10b981' : '#94a3b8',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '0.95rem'
            }}>
              Analytics
            </Link>

            <Link href="/affiliation" style={{
              color: router.pathname === '/affiliation' ? '#10b981' : '#94a3b8',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '0.95rem'
            }}>
              Affiliation
            </Link>

            <Link href="/outils" style={{
              color: router.pathname === '/outils' ? '#10b981' : '#94a3b8',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '0.95rem'
            }}>
              Outils
            </Link>

            <Link href="/legal" style={{
              color: router.pathname === '/legal' ? '#10b981' : '#94a3b8',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '0.95rem'
            }}>
              Juridique
            </Link>

            <Link href="/mon-compte" style={{
              background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
              color: 'white',
              padding: '0.4rem 0.75rem',
              borderRadius: '50px',
              textDecoration: 'none',
              fontWeight: 'bold',
              fontSize: '0.78rem',
              boxShadow: '0 4px 15px rgba(124, 58, 237, 0.3)'
            }}>
              💎 Mes REUSS
            </Link>

            <Link href="/boutiques" style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              padding: '0.4rem 0.75rem',
              borderRadius: '50px',
              textDecoration: 'none',
              fontWeight: 'bold',
              fontSize: '0.78rem',
              boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
            }}
            className="btn-boutiques">
              🛍️ Boutiques
            </Link>

            <a
              href="https://shop.reussitess.fr/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                color: 'white',
                padding: '0.4rem 0.75rem',
                borderRadius: '50px',
                textDecoration: 'none',
                fontWeight: 'bold',
                fontSize: '0.78rem',
                boxShadow: '0 4px 15px rgba(245, 87, 108, 0.3)'
              }}
              className="btn-shop">
              🏪 Shop
            </a>
          </div>
        </div>
      </nav>

      {/* BARRE SECONDAIRE */}
      <div style={{ background: 'linear-gradient(135deg, #0a0f1e 0%, #111827 100%)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0.6rem 2rem' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link href="/mon-adn" style={{ background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #06b6d4 100%)', color: 'white', padding: '0.4rem 0.75rem', borderRadius: '50px', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.78rem', textAlign: 'center' }}>🧬 Mon ADN</Link>
          <Link href="/oracle-971" style={{ background: 'linear-gradient(135deg, #6d28d9 0%, #a78bfa 100%)', color: 'white', padding: '0.4rem 0.75rem', borderRadius: '50px', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.78rem', textAlign: 'center' }}>🔮 Oracle 971</Link>
          <Link href="/ma-revolution-ia" style={{ background: 'linear-gradient(135deg, #064e3b 0%, #10b981 100%)', color: 'white', padding: '0.4rem 0.75rem', borderRadius: '50px', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.78rem', textAlign: 'center' }}>🌍 Ma Révolution</Link>
        </div>
      </div>

      <main style={{ minHeight: '100vh' }}>
        {children}
      </main>

      <SuperBotAssistant />

      <style jsx>{`
        .btn-boutiques:hover, .btn-shop:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(16, 185, 129, 0.5);
        }
        a:hover {
          color: #10b981 !important;
        }
      `}</style>
    </>
  )
}
