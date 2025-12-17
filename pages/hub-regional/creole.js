import Head from "next/head";
import Link from "next/link";
import Layout from "../../components/Layout";

export default function CreoleResources() {
  return (
    <Layout>
      <Head>
        <title>Traductions & Guides — Créole | REUSSITESS</title>
      </Head>

      <div style={{ padding: "2rem", maxWidth: 900, margin: "0 auto" }}>
        <h1>Traductions & Guides — Créole</h1>
        <p>
          Conseils pratiques pour traduire et localiser vos fiches produits et messages marketing au public créolophone.
        </p>

        <h2>Bonnes pratiques</h2>
        <ul>
          <li>Prioriser l'adaptation (localisation) plutôt que traduction littérale — respecter tournures et registres.</li>
          <li>Maintenir termes produit cohérents (glossaire FR ↔ CRÉOLE).</li>
          <li>Tester les textes avec locuteurs locaux pour la tonalité et la clarté.</li>
        </ul>

        <h2>Exemples rapides</h2>
        <p><strong>Titre</strong> : Utiliser une structure courte + mot‑clé local (ex : "Confiture de goyave — Fabriquée en Martinique")</p>
        <p><strong>Bullet points</strong> : 3–5 bullets clairs, bénéfices d'usage, matériaux, origine.</p>

        <h2>Ressources & ateliers</h2>
        <ul>
          <li>Ateliers : co‑création avec associations locales (programme d'exemples de scripts d'atelier).</li>
          <li>Templates : téléchargeable — modèles FR → CRÉOLE pour titre, bullets et description (à demander si tu veux le .md).</li>
        </ul>

        <p style={{ marginTop: 16 }}>
          <Link href="/hub-regional"><a>← Retour Hub Régional</a></Link>
        </p>
      </div>
    </Layout>
  );
}
