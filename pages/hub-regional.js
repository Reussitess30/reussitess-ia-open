import Head from "next/head";
import Layout from "../components/Layout";

export default function HubRegional() {
  return (
    <Layout>
      <Head>
        <title>Hub Régional — Langue & Culture Créole | REUSSITESS</title>
        <meta name="description" content="Langue et culture créole, ressources logistiques internationales, marketing & SEO pour DOM‑TOM — Martinique, Guadeloupe, Guyane, Réunion." />
      </Head>

      <div style={{ minHeight: "100vh", padding: "3rem 1.5rem", color: "white", background: "#0b1220" }}>
        <h1 style={{ textAlign: "center", marginBottom: "1rem" }}>🌺 Hub Régional — Langue & Culture Créole</h1>
        <p style={{ textAlign: "center", color: "#cbd5e1", marginBottom: "2rem" }}>
          Ressources pour les territoires ultramarins : langue, identité culturelle, logistique, marketing & SEO.
        </p>

        <section style={{ background: "#071029", padding: "1.5rem", borderRadius: 8, marginBottom: "1.5rem" }}>
          <h2 style={{ color: "#fbbf24" }}>Langue & Culture Créole</h2>
          <p style={{ color: "#e2e8f0" }}>
            Documents, guides et contenus en créole pour valoriser l'identité locale dans vos fiches produits et campagnes.
          </p>
          <ul style={{ color: "#cbd5e1" }}>
            <li>Traductions créoles (FR ↔ CRÉOLE)</li>
            <li>Guides culturels et tonalité des messages</li>
            <li>Ressources pédagogiques et interviews locales</li>
          </ul>
        </section>

        <section style={{ background: "#071029", padding: "1.5rem", borderRadius: 8, marginBottom: "1.5rem" }}>
          <h2 style={{ color: "#34d399" }}>Logistique & Douanes</h2>
          <p style={{ color: "#e2e8f0" }}>
            Checklists, options d'expédition, et préparation FBA pour les DOM‑TOM.
          </p>
        </section>

        <section style={{ background: "#071029", padding: "1.5rem", borderRadius: 8, marginBottom: "1.5rem" }}>
          <h2 style={{ color: "#60a5fa" }}>Marketing & SEO International (DOM‑TOM)</h2>
          <p style={{ color: "#e2e8f0" }}>
            Mots‑clés locaux, fiches produits optimisées, et campagnes ciblées par territoire.
          </p>
        </section>

        <section style={{ background: "#071029", padding: "1.5rem", borderRadius: 8, marginBottom: "2rem" }}>
          <h2 style={{ color: "#f97316" }}>Opportunités & Identité Culturelle</h2>
          <p style={{ color: "#e2e8f0" }}>
            Niches produits, partenariats locaux et valorisation de l'authenticité culturelle.
          </p>
        </section>

        <div style={{ background: "#081226", padding: "1rem", borderRadius: 8 }}>
          <h3 style={{ color: "#ffd28a", marginBottom: "0.5rem" }}>Pages régionales</h3>
          <ul style={{ color: "#cbd5e1" }}>
            <li><a href="/creole" style={{ color: "#a78bfa" }}>Langue & Culture Créole — contenu dédié</a></li>
            <li><a href="/martinique" style={{ color: "#60a5fa" }}>Martinique — ressources locales</a></li>
            <li><a href="/guadeloupe" style={{ color: "#60a5fa" }}>Guadeloupe — ressources locales</a></li>
            <li><a href="/guyane" style={{ color: "#60a5fa" }}>Guyane — ressources locales</a></li>
            <li><a href="/reunion" style={{ color: "#60a5fa" }}>La Réunion — ressources locales</a></li>
          </ul>
        </div>

        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <a href="/hub-international" style={{ display: "inline-block", padding: "0.8rem 1.6rem", background: "linear-gradient(90deg,#06b6d4,#3b82f6)", color: "white", borderRadius: 999, textDecoration: "none", fontWeight: 700 }}>🔙 Retour au Hub International</a>
        </div>
      </div>
    </Layout>
  );
}
