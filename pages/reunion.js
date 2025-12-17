import Head from "next/head";
import Link from "next/link";
import Layout from "../components/Layout";

export default function ReunionPage() {
  return (
    <Layout>
      <Head>
        <title>La Réunion — Ressources Locales | REUSSITESS</title>
      </Head>

      <div style={{ padding: "2rem", maxWidth: 960, margin: "0 auto" }}>
        <h1>La Réunion — Ressources Locales</h1>
        <p>
          Conseils pour vendre en ligne à La Réunion : logistique, packaging, attentes consommateurs et opportunités
          locales.
        </p>

        <h2>Conseils pratiques</h2>
        <ul>
          <li>Adapter images et storytelling au public local</li>
          <li>Utiliser transports avec expérience DOM‑TOM et options de groupage</li>
        </ul>

        <p style={{ marginTop: 16 }}>
          <Link href="/hub-regional"><a>← Retour Hub Régional</a></Link>
        </p>
      </div>
    </Layout>
  );
}
