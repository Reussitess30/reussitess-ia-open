import Head from "next/head";
import Link from "next/link";
import Layout from "../components/Layout";

export default function GuyanePage() {
  return (
    <Layout>
      <Head>
        <title>Guyane — Ressources Locales | REUSSITESS</title>
      </Head>

      <div style={{ padding: "2rem", maxWidth: 960, margin: "0 auto" }}>
        <h1>Guyane — Ressources Locales</h1>
        <p>
          Spécificités du marché guyanais, logistique, exigences sanitaires et opportunités pour produits locaux et
          importés.
        </p>

        <h2>Réglementation</h2>
        <p>Attention aux certificats sanitaires et aux contraintes particulières selon la catégorie de produit.</p>

        <p style={{ marginTop: 16 }}>
          <Link href="/hub-regional"><a>← Retour Hub Régional</a></Link>
        </p>
      </div>
    </Layout>
  );
}
