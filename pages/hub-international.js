import Head from "next/head";
import Link from "next/link";

export default function HubInternational() {
  return (
    <>
      <Head>
        <title>Hub International REUSSITESS & Amazon</title>
        <meta
          name="description"
          content="Hub International REUSSITESS & Amazon : accès direct à des ressources légales, pédagogiques, signées Guadeloupe, Terres de champions."
        />
      </Head>

      <div
        style={{
          minHeight: "100vh",
          background:
            "radial-gradient(circle at top, #667eea 0%, #764ba2 100%)",
          color: "white",
          padding: "2rem",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h1
            style={{
              textAlign: "center",
              fontSize: "clamp(2.5rem, 6vw, 4rem)",
              fontWeight: "900",
              marginBottom: "2rem",
            }}
          >
            🚀 Hub International REUSSITESS
          </h1>

          {/* Bouton Booster */}
          <div style={{ textAlign: "center", margin: "2rem 0" }}>
            <Link
              href="https://example.com/hub-reussitess" // Remplace par l'URL cible définitive
              style={{
                display: "inline-block",
                padding: "1rem 2.5rem",
                background:
                  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                borderRadius: "50px",
                textDecoration: "none",
                fontSize: "1.1rem",
                fontWeight: "bold",
                boxShadow: "0 10px 30px rgba(102, 126, 234, 0.5)",
                transition: "all 0.3s ease",
              }}
            >
              🚀 Booster REUSSITESS & Amazon
            </Link>
          </div>

          {/* Section des vraies boutiques (exemple) */}
          <div style={{ marginTop: "2rem" }}>
            <p style={{ textAlign: "center" }}>
              Découvrez les boutiques internationales ci-dessous.
            </p>
            {/* Grille boutiques */}
          </div>
        </div>
      </div>
    </>
  );
}
