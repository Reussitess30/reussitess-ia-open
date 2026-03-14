import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="fr">
      <Head>
        {/* SEO Essentiel */}
        <meta name="description" content="REUSSITESS®971 — IA née en Guadeloupe. 200 agents Neuro-X, 26 boutiques Amazon dans 14 pays, Token REUSS sur Polygon. Météo, séismes, emploi, devises DOM-TOM en temps réel. BOUDOUM !" />
        <meta name="keywords" content="IA Guadeloupe, intelligence artificielle Caraïbes, boutiques Amazon, affiliation, Token REUSS, Polygon, DOM-TOM, Antilles, diaspora, Neuro-X, REUSSITESS" />
        <meta name="author" content="Rony Porinus — REUSSITESS®971" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://reussitess.fr" />

        {/* Open Graph */}
        <meta property="og:title" content="REUSSITESS®971 — IA née en Guadeloupe 🇬🇵" />
        <meta property="og:description" content="200 agents IA Neuro-X • 26 boutiques Amazon • 14 pays • Token REUSS sur Polygon • Météo & séismes DOM-TOM temps réel. Positivité à l'infini !" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://reussitess.fr" />
        <meta property="og:image" content="https://reussitess.fr/og-image.jpg" />
        <meta property="og:site_name" content="REUSSITESS®971" />
        <meta property="og:locale" content="fr_FR" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="REUSSITESS®971 — IA née en Guadeloupe 🇬🇵" />
        <meta name="twitter:description" content="200 agents IA • 26 boutiques Amazon • Token REUSS • DOM-TOM temps réel. BOUDOUM !" />
        <meta name="twitter:image" content="https://reussitess.fr/og-image.jpg" />

        {/* PWA */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#00a651" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="REUSSITESS" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

        {/* Préchargement */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />

        {/* Schema.org */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "REUSSITESS®971",
          "alternateName": "REUSSITESS",
          "description": "Plateforme IA née en Guadeloupe — 200 agents Neuro-X, 26 boutiques Amazon dans 14 pays, Token REUSS sur Polygon",
          "url": "https://reussitess.fr",
          "logo": "https://reussitess.fr/icon-512x512.png",
          "foundingLocation": "Guadeloupe, France",
          "founder": { "@type": "Person", "name": "Rony Porinus" },
          "sameAs": ["https://kick.com/Reussitess", "https://github.com/Reussitess30/reussitess-global-nexus"],
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Guadeloupe",
            "addressCountry": "FR"
          }
        })}} />
              {/* Schema.org JSON-LD — Produits Amazon REUSSITESS */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "REUSSITESS®971",
          "url": "https://reussitess.fr",
          "logo": "https://reussitess.fr/icon-512x512.png",
          "description": "Assistant IA caribéen né en Guadeloupe — 110+ fonctionnalités, 26 boutiques Amazon 14 pays, Token REUSS sur Polygon",
          "foundingLocation": "Guadeloupe, France",
          "sameAs": ["https://kick.com/Reussitess"],
          "offers": {
            "@type": "AggregateOffer",
            "priceCurrency": "EUR",
            "hasMerchantReturnPolicy": {
              "@type": "MerchantReturnPolicy",
              "applicableCountry": "FR",
              "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
              "merchantReturnDays": 30,
              "returnMethod": "https://schema.org/ReturnByMail",
              "returnFees": "https://schema.org/FreeReturn"
            },
            "shippingDetails": {
              "@type": "OfferShippingDetails",
              "shippingRate": {
                "@type": "MonetaryAmount",
                "value": "0",
                "currency": "EUR"
              },
              "deliveryTime": {
                "@type": "ShippingDeliveryTime",
                "handlingTime": { "@type": "QuantitativeValue", "minValue": 1, "maxValue": 3, "unitCode": "DAY" },
                "transitTime": { "@type": "QuantitativeValue", "minValue": 2, "maxValue": 7, "unitCode": "DAY" }
              },
              "shippingDestination": { "@type": "DefinedRegion", "addressCountry": "FR" }
            }
          }
        })}} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
