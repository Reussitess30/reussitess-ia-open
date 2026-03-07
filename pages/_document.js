import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="fr">
      <Head>
        {/* SEO Essentiel */}
        <meta
          name="description"
          content="REUSSITESS® REUSSITESS®NEURO-X - Plateforme REUSSITESS®971 — Affiliation Amazon 14 pays, IA, Quiz, Bibliothèque mondiale. Base Guadeloupe."
        />
        <meta
          name="keywords"
          content="e-commerce, boutiques Amazon, affiliation, analytics, global, 14 pays, 26 boutiques"
        />

        {/* Open Graph */}
        <meta
          property="og:title"
          content="REUSSITESS® REUSSITESS®NEURO-X - 26 Boutiques Amazon • 14 Pays"
        />
        <meta
          property="og:description"
          content="Hub e-commerce global connectant 26 boutiques Amazon à travers 14 pays avec analytics temps réel."
        />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/og-image.jpg" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="REUSSITESS® REUSSITESS®NEURO-X" />
        <meta
          name="twitter:description"
          content="26 boutiques Amazon • 14 pays • E-commerce global"
        />

        {/* PWA */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#7c3aed" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />

        {/* Préchargement */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />

        {/* Schema.org */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "REUSSITESS® REUSSITESS®NEURO-X",
              description: "Hub e-commerce global de boutiques Amazon",
              url: "https://reussitess.fr",
              numberOfEmployees: "26",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Global",
                addressRegion: "Multiple",
                addressCountry: "Multiple",
              },
            }),
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
