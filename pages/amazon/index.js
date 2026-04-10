/* © Reussitess®971 INPI DSO2026012614 PORINUS Rony 2026 */
import Head from "next/head";
import Link from "next/link";
import Layout from "../../components/Layout";

export default function VAmazon() {
  return (
    <Layout>
      <Head>
        <title>VAmazon — Booster REUSSITESS & Amazon</title>
        <meta name="description" content="Dossier VAmazon — ressources, guides et checklists pour booster vos ventes sur Amazon via REUSSITESS." />
      </Head>

      <div style={{ minHeight: "70vh", padding: "3rem 1.5rem", color: "#111827", background: "#f8fafc" }}>
        <h1 style={{ textAlign: "center", marginBottom: "1rem" }}>🚀 VAmazon — Booster REUSSITESS & Amazon</h1>
        <p style={{ textAlign: "center", color: "#374151", marginBottom: "2rem" }}>
          Dossier VAmazon : guides, checklists, templates et liens pour optimiser vos ventes sur Amazon.
        </p>

        <section style={{ maxWidth: 900, margin: "0 auto", background: "white", padding: "1.5rem", borderRadius: 8, boxShadow: "0 6px 18px rgba(2,6,23,0.08)" }}>
          <h2 style={{ color: "#0ea5a4" }}>Contenu du dossier VAmazon</h2>
          <ul style={{ lineHeight: "1.8" }}>
            <li>✅ Guide : Préparer vos fiches produits pour Amazon (SEO & images)</li>
            <li>✅ Checklist : Export / Douanes / Fulfillment</li>
            <li>✅ Templates : Description produit multilingue</li>
            <li>✅ Partenaires recommandés & outils</li>
            <li>✅ Tutoriels vidéo & webinaires</li>
          </ul>

          <p style={{ marginTop: "1rem" }}>
            Retour :
            {" "}
            <Link href="/hub-international"><a style={{ color: "#3b82f6", textDecoration: "underline" }}>Retour Hub International</a></Link>
          </p>
        </section>
      </div>
    </Layout>
  );
}
