/* © Reussitess®971 INPI DSO2026012614 PORINUS Rony 2026 */
import Layout from "../components/Layout";
import Link from "next/link";

export default function SavoirCulture() {
  return (
    <Layout>
      <div
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          minHeight: "100vh",
          padding: "4rem 1rem",
        }}
      >
        <div
          className="container"
          style={{ maxWidth: "1200px", margin: "0 auto" }}
        >
          <Link
            href="/"
            style={{
              color: "white",
              textDecoration: "none",
              fontSize: "1.1rem",
              display: "inline-block",
              marginBottom: "2rem",
              opacity: 0.9,
            }}
          >
            ← Retour à l'accueil
          </Link>

          <div
            style={{
              background: "rgba(255, 255, 255, 0.95)",
              borderRadius: "20px",
              padding: "3rem",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }}
          >
            <h1
              style={{
                textAlign: "center",
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                fontWeight: "800",
                marginBottom: "1rem",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              📚 Savoir & Culture
            </h1>
            <p
              style={{
                textAlign: "center",
                fontSize: "1.2rem",
                color: "#64748b",
                marginBottom: "3rem",
              }}
            >
              Enrichissez vos connaissances avec nos ressources culturelles
            </p>

            {/* Ressources Culturelles */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "2rem",
                marginBottom: "3rem",
              }}
            >
              <Link
                href="/ressources/culture-guadeloupe"
                style={{
                  background:
                    "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
                  padding: "2rem",
                  borderRadius: "15px",
                  textDecoration: "none",
                  color: "white",
                  transition: "all 0.3s ease",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                }}
                className="resource-card"
              >
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🌴</div>
                <h3
                  style={{
                    fontSize: "1.5rem",
                    marginBottom: "0.5rem",
                    fontWeight: "700",
                  }}
                >
                  Culture Guadeloupéenne
                </h3>
                <p style={{ opacity: 0.9 }}>
                  Gwoka, gastronomie créole, traditions et personnalités
                </p>
              </Link>

              <Link
                href="/ressources/histoire-afrique"
                style={{
                  background:
                    "linear-gradient(135deg, #f59e0b 0%, #e11d48 100%)",
                  padding: "2rem",
                  borderRadius: "15px",
                  textDecoration: "none",
                  color: "white",
                  transition: "all 0.3s ease",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                }}
                className="resource-card"
              >
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🌍</div>
                <h3
                  style={{
                    fontSize: "1.5rem",
                    marginBottom: "0.5rem",
                    fontWeight: "700",
                  }}
                >
                  Histoire Africaine
                </h3>
                <p style={{ opacity: 0.9 }}>
                  Civilisations antiques, diaspora et figures historiques
                </p>
              </Link>

              <Link
                href="/ressources/patrimoine-martinique"
                style={{
                  background:
                    "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
                  padding: "2rem",
                  borderRadius: "15px",
                  textDecoration: "none",
                  color: "white",
                  transition: "all 0.3s ease",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                }}
                className="resource-card"
              >
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🏝️</div>
                <h3
                  style={{
                    fontSize: "1.5rem",
                    marginBottom: "0.5rem",
                    fontWeight: "700",
                  }}
                >
                  Patrimoine Martiniquais
                </h3>
                <p style={{ opacity: 0.9 }}>
                  Madinina, Aimé Césaire, rhum AOC et sites historiques
                </p>
              </Link>
            </div>

            {/* Bibliothèque Thématique */}
            <h2
              style={{
                fontSize: "2rem",
                fontWeight: "700",
                color: "#1e293b",
                marginBottom: "2rem",
                textAlign: "center",
              }}
            >
              📖 Bibliothèque Thématique
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "1.5rem",
              }}
            >
              <Link
                href="/bibliotheque/histoire"
                style={{
                  background: "#f8fafc",
                  padding: "1.5rem",
                  borderRadius: "12px",
                  textDecoration: "none",
                  color: "#1e293b",
                  border: "2px solid #e2e8f0",
                  transition: "all 0.3s ease",
                }}
              >
                <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
                  📜
                </div>
                <h4
                  style={{
                    fontSize: "1.2rem",
                    fontWeight: "600",
                    marginBottom: "0.5rem",
                  }}
                >
                  Histoire
                </h4>
                <p style={{ fontSize: "0.9rem", color: "#64748b" }}>
                  Chronologies et biographies historiques
                </p>
              </Link>

              <Link
                href="/bibliotheque/outils"
                style={{
                  background: "#f8fafc",
                  padding: "1.5rem",
                  borderRadius: "12px",
                  textDecoration: "none",
                  color: "#1e293b",
                  border: "2px solid #e2e8f0",
                  transition: "all 0.3s ease",
                }}
              >
                <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
                  🧮
                </div>
                <h4
                  style={{
                    fontSize: "1.2rem",
                    fontWeight: "600",
                    marginBottom: "0.5rem",
                  }}
                >
                  Outils
                </h4>
                <p style={{ fontSize: "0.9rem", color: "#64748b" }}>
                  Calculateurs TVA et commissions
                </p>
              </Link>

              <Link
                href="/bibliotheque/reglementation"
                style={{
                  background: "#f8fafc",
                  padding: "1.5rem",
                  borderRadius: "12px",
                  textDecoration: "none",
                  color: "#1e293b",
                  border: "2px solid #e2e8f0",
                  transition: "all 0.3s ease",
                }}
              >
                <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
                  ⚖️
                </div>
                <h4
                  style={{
                    fontSize: "1.2rem",
                    fontWeight: "600",
                    marginBottom: "0.5rem",
                  }}
                >
                  Réglementation
                </h4>
                <p style={{ fontSize: "0.9rem", color: "#64748b" }}>
                  Normes UE, OMC et droit français
                </p>
              </Link>

              <Link
                href="/bibliotheque/prof"
                style={{
                  background: "#f8fafc",
                  padding: "1.5rem",
                  borderRadius: "12px",
                  textDecoration: "none",
                  color: "#1e293b",
                  border: "2px solid #e2e8f0",
                  transition: "all 0.3s ease",
                }}
              >
                <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
                  👨‍🏫
                </div>
                <h4
                  style={{
                    fontSize: "1.2rem",
                    fontWeight: "600",
                    marginBottom: "0.5rem",
                  }}
                >
                  Profs
                </h4>
                <p style={{ fontSize: "0.9rem", color: "#64748b" }}>
                  Ressources pédagogiques
                </p>
              </Link>

              <Link
                href="/bibliotheque/actu"
                style={{
                  background: "#f8fafc",
                  padding: "1.5rem",
                  borderRadius: "12px",
                  textDecoration: "none",
                  color: "#1e293b",
                  border: "2px solid #e2e8f0",
                  transition: "all 0.3s ease",
                }}
              >
                <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
                  📰
                </div>
                <h4
                  style={{
                    fontSize: "1.2rem",
                    fontWeight: "600",
                    marginBottom: "0.5rem",
                  }}
                >
                  Actualités
                </h4>
                <p style={{ fontSize: "0.9rem", color: "#64748b" }}>
                  Tendances e-commerce 2025
                </p>
              </Link>
            </div>

            {/* CTA */}
            <div
              style={{
                marginTop: "3rem",
                textAlign: "center",
                padding: "2rem",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                borderRadius: "15px",
              }}
            >
              <h3
                style={{
                  color: "white",
                  fontSize: "1.5rem",
                  marginBottom: "1rem",
                }}
              >
                🎓 Continuez Votre Apprentissage
              </h3>
              <Link
                href="/bibliotheque"
                style={{
                  background: "white",
                  color: "#667eea",
                  padding: "1rem 2rem",
                  borderRadius: "50px",
                  textDecoration: "none",
                  fontWeight: "600",
                  display: "inline-block",
                }}
              >
                Accéder à la Bibliothèque Complète →
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .resource-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </Layout>
  );
}
