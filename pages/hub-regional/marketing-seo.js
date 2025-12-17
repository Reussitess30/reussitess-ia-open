import Head from "next/head";
import Link from "next/link";
import Layout from "../../components/Layout";

export default function MarketingSEO() {
  return (
    <Layout>
      <Head>
        <title>Marketing & SEO — DOM‑TOM | REUSSITESS</title>
      </Head>

      <div style={{ padding: "2rem", maxWidth: 900, margin: "0 auto" }}>
        <h1>Marketing & SEO pour DOM‑TOM</h1>

        <h2>Recherche de mots‑clés locaux</h2>
        <p>Commence par : recherches locales (Google Trends, Amazon search terms), variantes créoles et orthographiques.</p>

        <h2>Fiche produit optimisée</h2>
        <ul>
          <li>Titre : inclure mot‑clé principal + origine (ex. "Produit — Fabriqué en Guadeloupe").</li>
          <li>Bullets : bénéfices + informations pratiques (poids, dimensions, conseils d'utilisation locale).</li>
          <li>Images : montrer usage local / ambiances culturelles pour améliorer la conversion.</li>
        </ul>

        <h2>Campagnes publicitaires locales</h2>
        <p>Segmenter par territoire, tester créas avec visuels locaux et messages en langue adaptée.</p>

        <p style={{ marginTop: 16 }}>
          <Link href="/hub-regional"><a>← Retour Hub Régional</a></Link>
        </p>
      </div>
    </Layout>
  );
}
