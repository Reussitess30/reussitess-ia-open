/* © Reussitess®971 INPI DSO2026012614 PORINUS Rony 2026 */
import Head from "next/head";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export default function PWAApp() {
  const router = useRouter();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Vérifie si déjà installé
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    // Écoute l'événement d'installation
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setIsInstalled(true);
      setIsInstallable(false);
    }
    setDeferredPrompt(null);
  };

  return (
    <>
      <Head>
        <title>📱 Application PWA - Reussitess® REUSSITESS®NEURO-X</title>
        <meta
          name="description"
          content="Installez l'app REUSSITESS® pour un accès hors ligne et une expérience optimale"
        />
      </Head>

      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          padding: "20px",
        }}
      >
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <button
            onClick={() => router.push("/")}
            style={{
              padding: "12px 24px",
              background: "white",
              color: "#667eea",
              border: "none",
              borderRadius: "12px",
              cursor: "pointer",
              marginBottom: "20px",
              fontWeight: "bold",
            }}
          >
            ← Retour au Hub
          </button>

          <div
            style={{
              background: "white",
              padding: "50px",
              borderRadius: "25px",
              boxShadow: "0 15px 50px rgba(0,0,0,0.2)",
            }}
          >
            <div style={{ textAlign: "center", marginBottom: "40px" }}>
              <div style={{ fontSize: "5em", marginBottom: "20px" }}>📱</div>
              <h1
                style={{
                  fontSize: "3em",
                  margin: "0 0 15px 0",
                  color: "#667eea",
                }}
              >
                Application PWA
              </h1>
              <p style={{ fontSize: "1.3em", color: "#666" }}>
                Progressive Web App - Installez pour une expérience optimale
              </p>
            </div>

            {/* Statut installation */}
            {isInstalled ? (
              <div
                style={{
                  background:
                    "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  color: "white",
                  padding: "30px",
                  borderRadius: "15px",
                  textAlign: "center",
                  marginBottom: "40px",
                }}
              >
                <div style={{ fontSize: "4em", marginBottom: "15px" }}>✅</div>
                <h2 style={{ fontSize: "2em", margin: "0 0 10px 0" }}>
                  Application installée !
                </h2>
                <p style={{ fontSize: "1.2em", margin: 0, opacity: 0.9 }}>
                  Vous pouvez maintenant utiliser REUSSITESS® hors ligne
                </p>
              </div>
            ) : isInstallable ? (
              <div
                style={{
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  padding: "30px",
                  borderRadius: "15px",
                  textAlign: "center",
                  marginBottom: "40px",
                }}
              >
                <h2 style={{ fontSize: "2em", margin: "0 0 20px 0" }}>
                  📲 Prêt à installer !
                </h2>
                <button
                  onClick={handleInstall}
                  style={{
                    padding: "15px 40px",
                    background: "white",
                    color: "#667eea",
                    border: "none",
                    borderRadius: "10px",
                    fontSize: "1.2em",
                    fontWeight: "bold",
                    cursor: "pointer",
                    boxShadow: "0 5px 20px rgba(0,0,0,0.2)",
                  }}
                >
                  Installer l'application
                </button>
              </div>
            ) : (
              <div
                style={{
                  background: "#f0f4ff",
                  padding: "30px",
                  borderRadius: "15px",
                  marginBottom: "40px",
                }}
              >
                <h2 style={{ color: "#667eea", marginBottom: "20px" }}>
                  📱 Comment installer ?
                </h2>
                <div style={{ fontSize: "1.1em", lineHeight: "2" }}>
                  <p>
                    <strong>Sur Android (Chrome) :</strong>
                  </p>
                  <ol>
                    <li>Ouvrez le menu (⋮) en haut à droite</li>
                    <li>Appuyez sur "Installer l'application"</li>
                    <li>Confirmez l'installation</li>
                  </ol>
                  <p style={{ marginTop: "20px" }}>
                    <strong>Sur iOS (Safari) :</strong>
                  </p>
                  <ol>
                    <li>Appuyez sur le bouton Partager (□↑)</li>
                    <li>
                      Faites défiler et appuyez sur "Sur l'écran d'accueil"
                    </li>
                    <li>Appuyez sur "Ajouter"</li>
                  </ol>
                </div>
              </div>
            )}

            {/* Avantages */}
            <h2
              style={{
                color: "#667eea",
                fontSize: "2em",
                marginBottom: "25px",
                textAlign: "center",
              }}
            >
              ✨ Avantages de l'app
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "25px",
                marginBottom: "40px",
              }}
            >
              {[
                {
                  icon: "📶",
                  title: "Accès hors ligne",
                  desc: "Consultez les guides sans connexion",
                },
                {
                  icon: "⚡",
                  title: "Ultra rapide",
                  desc: "Chargement instantané",
                },
                {
                  icon: "🔔",
                  title: "Notifications",
                  desc: "Alertes sur les nouveautés",
                },
                {
                  icon: "📱",
                  title: "Écran d'accueil",
                  desc: "Accès direct depuis votre téléphone",
                },
                { icon: "💾", title: "Léger", desc: "Moins de 5 Mo" },
                {
                  icon: "🔒",
                  title: "Sécurisé",
                  desc: "HTTPS et données protégées",
                },
              ].map((feature, i) => (
                <div
                  key={i}
                  style={{
                    background: "#f9fafb",
                    padding: "25px",
                    borderRadius: "15px",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: "3em", marginBottom: "10px" }}>
                    {feature.icon}
                  </div>
                  <h3
                    style={{
                      fontSize: "1.3em",
                      margin: "0 0 10px 0",
                      color: "#667eea",
                    }}
                  >
                    {feature.title}
                  </h3>
                  <p style={{ margin: 0, color: "#666" }}>{feature.desc}</p>
                </div>
              ))}
            </div>

            {/* Fonctionnalités */}
            <h2
              style={{
                color: "#667eea",
                fontSize: "2em",
                marginBottom: "25px",
              }}
            >
              🎯 Fonctionnalités disponibles
            </h2>
            <div
              style={{
                background: "#f9fafb",
                padding: "30px",
                borderRadius: "15px",
              }}
            >
              <ul style={{ fontSize: "1.1em", lineHeight: "2.5", margin: 0 }}>
                <li>✅ Accès aux 26 boutiques Amazon</li>
                <li>✅ Bibliothèque mondiale complète</li>
                <li>✅ Guides et formations</li>
                <li>✅ Outils et calculateurs</li>
                <li>✅ Section Afrique & DOM-TOM</li>
                <li>✅ Mises à jour automatiques</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
