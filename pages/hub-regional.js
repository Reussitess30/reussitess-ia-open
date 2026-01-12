import Head from "next/head";
import Link from "next/link";
import Layout from "../components/Layout";

export default function HubRegional() {
  return (
    <Layout>
      <Head>
        <title>Hub Régional — Langue & Culture Créole | REUSSITESS</title>
        <meta
          name="description"
          content="Langue et culture creole, ressources logistiques internationales, marketing & SEO pour DOM-TOM — opportunites et identite culturelle par REUSSITESS."
        />
      </Head>

      <div style={{ minHeight: "100vh", padding: "3rem 1.5rem", color: "white", background: "#0b1220" }}>
        <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", textAlign: "center", marginBottom: "1rem" }}>
          🌺 Hub Régional — Langue & Culture Créole
        </h1>
        <p style={{ textAlign: "center", color: "#cbd5e1", marginBottom: "2rem" }}>
          Ressources pour les territoires ultramarins (Martinique, Guadeloupe, Guyane, Reunion, Mayotte): langue, identite culturelle, logistique internationale, marketing & SEO pour les marches DOM-TOM.
        </p>

        <section style={{ background: "#071029", padding: "1.5rem", borderRadius: 8, marginBottom: "1.5rem" }}>
          <h2 style={{ color: "#fbbf24" }}>Langue & Culture Creole</h2>
          <p style={{ color: "#e2e8f0" }}>
            Documents, guides et contenus en creole pour valoriser l'identite locale dans vos fiches produits, campagnes marketing et parcours clients.
          </p>
          <ul style={{ color: "#cbd5e1" }}>
            <li>
              <Link href="/hub-regional/creole"><a style={{ color: "#a78bfa", textDecoration: "underline" }}>
                Traductions creoles (FR ↔ CREOLE) pour fiches produits et descriptions marketing
              </a></Link>
            </li>
            <li>
              <Link href="/hub-regional/creole"><a style={{ color: "#a78bfa", textDecoration: "underline" }}>
                Guides culturels pour images, tonalite et visuels adaptes aux DOM-TOM
              </a></Link>
            </li>
            <li>
              <Link href="/hub-regional/creole"><a style={{ color: "#a78bfa", textDecoration: "underline" }}>
                Ressources pedagogiques: ateliers, webinars et interviews locales
              </a></Link>
            </li>
          </ul>
        </section>

        <section style={{ background: "#071029", padding: "1.5rem", borderRadius: 8, marginBottom: "1.5rem" }}>
          <h2 style={{ color: "#34d399" }}>Ressources — Logistique & Douanes</h2>
          <p style={{ color: "#e2e8f0" }}>
            Meilleures pratiques pour expedier vers/depuis les DOM-TOM: gestion des delais, regles douanieres, optimisation FBA/expedition internationale, partenaires locaux et options de fulfillment.
          </p>
          <ul style={{ color: "#cbd5e1" }}>
            <li>
              <Link href="/hub-regional/douanes"><a style={{ color: "#60a5fa", textDecoration: "underline" }}>
                Checklist douaniere et documents necessaires
              </a></Link>
            </li>
            <li>
              <Link href="/hub-regional/douanes"><a style={{ color: "#60a5fa", textDecoration: "underline" }}>
                Comparatif transporteurs et options economiques
              </a></Link>
            </li>
            <li>
              <Link href="/hub-regional/douanes"><a style={{ color: "#60a5fa", textDecoration: "underline" }}>
                Optimisation des frais et preparation pour FBA international
              </a></Link>
            </li>
          </ul>
        </section>

        <section style={{ background: "#071029", padding: "1.5rem", borderRadius: 8, marginBottom: "1.5rem" }}>
          <h2 style={{ color: "#60a5fa" }}>Marketing & SEO International (DOM-TOM)</h2>
          <p style={{ color: "#e2e8f0" }}>
            Strategies SEO & marketing ciblees pour les marches ultramarins: mots-cles locaux, schema/structured data, campagnes ads adaptees et opportunites saisonnieres.
          </p>
          <ul style={{ color: "#cbd5e1" }}>
            <li>
              <Link href="/hub-regional/marketing-seo"><a style={{ color: "#60a5fa", textDecoration: "underline" }}>
                Recherche de mots-cles locale et optimisation multi-langue
              </a></Link>
            </li>
            <li>
              <Link href="/hub-regional/marketing-seo"><a style={{ color: "#60a5fa", textDecoration: "underline" }}>
                Fiches produits optimisees pour taux de conversion local
              </a></Link>
            </li>
            <li>
              <Link href="/hub-regional/marketing-seo"><a style={{ color: "#60a5fa", textDecoration: "underline" }}>
                Campagnes publicitaires ciblees (social, SEA) par territoire
              </a></Link>
            </li>
          </ul>
        </section>

        <section style={{ background: "#071029", padding: "1.5rem", borderRadius: 8, marginBottom: "2rem" }}>
          <h2 style={{ color: "#f97316" }}>Opportunites & Identite Culturelle</h2>
          <p style={{ color: "#e2e8f0" }}>
            Identifier les niches et opportunites liees a l'identite culturelle (produits artisanaux, alimentation, beaute, tourisme local). Conseils pour co-creation avec acteurs locaux et respect des pratiques culturelles.
          </p>
          <ul style={{ color: "#cbd5e1" }}>
            <li>
              <Link href="/hub-regional/opportunites"><a style={{ color: "#f97316", textDecoration: "underline" }}>
                Etudes de marche DOM-TOM et tendances consommateurs
              </a></Link>
            </li>
            <li>
              <Link href="/hub-regional/opportunites"><a style={{ color: "#f97316", textDecoration: "underline" }}>
                Partenariats locaux et sourcing responsable
              </a></Link>
            </li>
            <li>
              <Link href="/hub-regional/opportunites"><a style={{ color: "#f97316", textDecoration: "underline" }}>
                Boite a outils pour valoriser l'authenticite culturelle
              </a></Link>
            </li>
          </ul>
        </section>

        <div style={{ background: "#081226", padding: "1rem", borderRadius: 8 }}>
          <h3 style={{ color: "#ffd28a", marginBottom: "0.5rem" }}>Pages regionales</h3>
          <ul style={{ color: "#cbd5e1", listStyle: "none", paddingLeft: 0 }}>
            <li style={{ marginBottom: "0.5rem" }}>
              <Link href="/creole"><a style={{ color: "#a78bfa", textDecoration: "underline" }}>Langue & Culture Creole — contenu dedie</a></Link>
            </li>
            <li style={{ marginBottom: "0.5rem" }}>
              <Link href="/martinique"><a style={{ color: "#60a5fa", textDecoration: "underline" }}>Martinique — ressources locales</a></Link>
            </li>
            <li style={{ marginBottom: "0.5rem" }}>
              <Link href="/guadeloupe"><a style={{ color: "#60a5fa", textDecoration: "underline" }}>Guadeloupe — ressources locales</a></Link>
            </li>
            <li style={{ marginBottom: "0.5rem" }}>
              <Link href="/guyane"><a style={{ color: "#60a5fa", textDecoration: "underline" }}>Guyane — ressources locales</a></Link>
            </li>
            <li style={{ marginBottom: "0.5rem" }}>
              <Link href="/reunion"><a style={{ color: "#60a5fa", textDecoration: "underline" }}>La Reunion — ressources locales</a></Link>
            </li>
          </ul>
        </div>

        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <Link href="/hub-international">
            <a
              style={{
                display: "inline-block",
                padding: "0.8rem 1.6rem",
                background: "linear-gradient(90deg,#06b6d4,#3b82f6)",
                color: "white",
                borderRadius: 999,
                textDecoration: "none",
                fontWeight: 700,
              }}
            >
              🔙 Retour au Hub International
            </a>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
