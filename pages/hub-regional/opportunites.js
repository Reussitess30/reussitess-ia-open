import Head from "next/head";
import Link from "next/link";
import Layout from "../../components/Layout";

export default function Opportunites() {
  return (
    <Layout>
      <Head>
        <title>Opportunités & Identité Culturelle — REUSSITESS</title>
      </Head>

      <div style={{ padding: "2rem", maxWidth: 900, margin: "0 auto" }}>
        <h1>Opportunités & Identité Culturelle</h1>

        <h2>Études de marché rapides</h2>
        <p>Identifier niches : artisanat local, produits alimentaires typiques, cosmétiques naturels locaux.</p>

        <h2>Partenariats locaux</h2>
        <p>Co‑création : impliquer artisans et labels locaux, mettre en avant traçabilité et responsabilité.</p>

        <h2>Boîte à outils</h2>
        <ul>
          <li>Checklist pour sourcing responsable.</li>
          <li>Modèle de contrat simple pour partenariats locaux.</li>
          <li>Template A+ / Enhanced Brand Content adapté au storytelling local.</li>
        </ul>

        <p style={{ marginTop: 16 }}>
          <Link href="/hub-regional"><a>← Retour Hub Régional</a></Link>
        </p>
      </div>
    </Layout>
  );
}
