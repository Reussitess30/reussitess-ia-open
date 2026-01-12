import Head from "next/head";
import Link from "next/link";
import Layout from "../components/Layout";

export default function CreolePage() {
  return (
    <Layout>
      <Head>
        <title>Langue & Culture Créole — REUSSITESS</title>
      </Head>

      <div style={{ padding: "2rem", maxWidth: 960, margin: "0 auto" }}>
        <h1>Langue & Culture Créole</h1>
        <p>
          Ressources et bonnes pratiques pour valoriser la langue et la culture créole dans vos fiches produits,
          vos visuels et vos campagnes marketing destinées aux marchés DOM‑TOM.
        </p>

        <h2>Ce que vous trouverez ici</h2>
        <ul>
          <li>Exemples de titres et bullets localisés en créole</li>
          <li>Glossaire FR ↔ CRÉOLE pour termes produits</li>
          <li>Recommandations de tonalité et visuels</li>
          <li>Ateliers et protocole de validation locale</li>
        </ul>

        <h2>Modèles rapides</h2>
        <p><strong>Titre :</strong> court + mot‑clé + origine (ex. "Confiture de goyave — Fabriquée en Martinique")</p>
        <p><strong>Bullets :</strong> 3–5 points clairs : bénéfice, matière/origine, mode d'emploi, dimensions.</p>

        <p style={{ marginTop: 16 }}>
          <Link href="/hub-regional"><a>← Retour Hub Régional</a></Link>
        </p>
      </div>
    </Layout>
  );
}
