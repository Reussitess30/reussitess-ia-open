import Head from "next/head";
import Link from "next/link";
import Layout from "../components/Layout";

export default function MartiniquePage() {
  return (
    <Layout>
      <Head>
        <title>Martinique — Ressources Locales | REUSSITESS</title>
      </Head>

      <div style={{ padding: "2rem", maxWidth: 960, margin: "0 auto" }}>
        <h1>Martinique — Ressources Locales</h1>
        <p>
          Guides, partenaires et opportunités pour vendre et promouvoir des produits fabriqués ou adaptés à la
          Martinique : logistique, communication, et réglementation locale.
        </p>

        <h2>Logistique & livraison</h2>
        <ul>
          <li>Options de transport et délais moyens</li>
          <li>Conseils d'emballage (protection humidité / chaleur)</li>
          <li>Points de retrait et partenaires 3PL recommandés</li>
        </ul>

        <h2>Marketing local</h2>
        <p>Suggérer visuels de contexte local, utiliser mot‑clés et événements saisonniers pour campagne.</p>

        <p style={{ marginTop: 16 }}>
          <Link href="/hub-regional"><a>← Retour Hub Régional</a></Link>
        </p>
      </div>
    </Layout>
  );
}
