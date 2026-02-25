import Head from 'next/head'

export default function StructuredData() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "REUSSITESS®971",
    "alternateName": "REUSSITESS® Global Nexus",
    "url": "https://reussitess.fr",
    "logo": "https://reussitess.fr/icon-512x512.png",
    "description": "Réseau mondial de 26 boutiques Amazon, Passeport de Réussite, VISA Universel donnant accès à 10,000+ bourses et 50,000+ emplois internationaux",
    "foundingDate": "2022",
    "foundingLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "GP",
        "addressRegion": "Guadeloupe",
        "postalCode": "971"
      }
    },
    "founder": {
      "@type": "Person",
      "name": "Rony Porinus",
      "nationality": "French",
      "birthPlace": "Guadeloupe"
    },
    "sameAs": [
      "https://www.tiktok.com/@reussitess",
      "https://www.amazon.fr/shop/amourguadeloupe",
      "https://www.amazon.com/shop/influencer-fb942837"
    ],
    "areaServed": ["Worldwide"],
    "slogan": "Excellence • Innovation • Succès • Positivité à l'infini",
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Service",
      "email": "contact@reussitess971.com",
      "availableLanguage": ["French", "English", "Spanish", "German", "Italian", "Portuguese", "Chinese", "Arabic"]
    }
  }

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "REUSSITESS®971",
    "url": "https://reussitess.fr",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://reussitess.fr/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  }

  const educationalSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "REUSSITESS®971",
    "url": "https://reussitess.fr",
    "logo": "https://reussitess.fr/icon-512x512.png",
    "description": "Bibliothèque mondiale de 55+ pages, 25 quiz gratuits, formations IA en 6 langues",
    "numberOfStudents": 15247,
    "areaServed": "Worldwide",
    "educationalCredentialAwarded": "Passeport de Réussite REUSSITESS®"
  }

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "VISA Universel de Réussite",
    "image": "https://reussitess.fr/icon-512x512.png",
    "description": "Accès à 10,000+ bourses internationales, 50,000+ emplois, 5,000+ mentors, 100M€+ de fonds",
    "brand": {
      "@type": "Brand",
      "name": "REUSSITESS®971"
    },
    "sku": "VISA-UNIVERSEL-001",
    "mpn": "REUSS-VISA-2024",
    "url": "https://reussitess.fr/visa-universel",
    "offers": {
      "@type": "Offer",
      "url": "https://reussitess.fr/visa-universel",
      "price": "0",
      "priceCurrency": "EUR",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "REUSSITESS®971",
        "url": "https://reussitess.fr"
      }
    }
  }

  const passeportSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Passeport de Réussite REUSSITESS®",
    "image": "https://reussitess.fr/icon-512x512.png",
    "description": "Certificat personnalisé de réussite avec plan d'action 7 jours pour champions du monde",
    "brand": {
      "@type": "Brand",
      "name": "REUSSITESS®971"
    },
    "sku": "PASSEPORT-REUSSITE-001",
    "mpn": "REUSS-PASS-2024",
    "url": "https://reussitess.fr/champions",
    "offers": {
      "@type": "Offer",
      "url": "https://reussitess.fr/champions",
      "price": "0",
      "priceCurrency": "EUR",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "REUSSITESS®971",
        "url": "https://reussitess.fr"
      }
    }
  }

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(educationalSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(passeportSchema) }}
      />
    </Head>
  )
}
