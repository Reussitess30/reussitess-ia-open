import Head from "next/head";
import Link from "next/link";
import Layout from "../components/Layout";

export default function GuadeloupePage() {
  return (
    <Layout>
      <Head>
        <title>Guadeloupe — Ressources Locales | REUSSITESS</title>
      </Head>

      <div style={{ padding: "2rem", maxWidth: 960, margin: "0 auto" }}>
        <h1>Guadeloupe — Ressources Locales</h1>
        <p>
          Informations pratiques pour commercialiser et expédier vers la Guadeloupe : réglementation, partenaires et
          conseils marketing adaptés.
        </p>

        <h2>Sourcing & partenaires</h2>
        <ul>
          <li>Engager artisans et labels locaux</li>
          <li>Checklist pour sourcing responsable et traçabilité</li>
        </ul>

        <p style={{ marginTop: 16 }}>
          <Link href="/hub-regional"><a>← Retour Hub Régional</a></Link>
        </p>
      </div>
    </Layout>
  );
}
