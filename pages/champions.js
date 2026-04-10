/* © Reussitess®971 INPI DSO2026012614 PORINUS Rony 2026 */
"use client";

import { useState, useEffect } from "react";
import { generateCertificatPDF } from "../lib/generatePDF";
import { genererPlanAction, genererRessources } from "../lib/planAction";
import Layout from "../components/Layout";

export default function Champions() {
  const [formData, setFormData] = useState({
    prenom: "",
    pays: "",
    objectif: "",
  });
  const [showCertificat, setShowCertificat] = useState(false);
  const [certificatData, setCertificatData] = useState(null);
  const [stats, setStats] = useState({
    totalPays: 14,
    totalChampions: null,
  });
  const [showBot, setShowBot] = useState(false);

  const pays = [
    { code: "FR", nom: "France", emoji: "🇫🇷" },
    { code: "GP", nom: "Guadeloupe", emoji: "🇬🇵" },
    { code: "MQ", nom: "Martinique", emoji: "🇲🇶" },
    { code: "GF", nom: "Guyane", emoji: "🇬🇫" },
    { code: "RE", nom: "Réunion", emoji: "🇷🇪" },
    { code: "US", nom: "États-Unis", emoji: "🇺🇸" },
    { code: "CA", nom: "Canada", emoji: "🇨🇦" },
    { code: "GB", nom: "Royaume-Uni", emoji: "🇬🇧" },
    { code: "DE", nom: "Allemagne", emoji: "🇩🇪" },
    { code: "ES", nom: "Espagne", emoji: "🇪🇸" },
    { code: "IT", nom: "Italie", emoji: "🇮🇹" },
    { code: "BE", nom: "Belgique", emoji: "🇧🇪" },
    { code: "CH", nom: "Suisse", emoji: "🇨🇭" },
    { code: "BR", nom: "Brésil", emoji: "🇧🇷" },
    { code: "MA", nom: "Maroc", emoji: "🇲🇦" },
    { code: "DZ", nom: "Algérie", emoji: "🇩🇿" },
    { code: "TN", nom: "Tunisie", emoji: "🇹🇳" },
    { code: "SN", nom: "Sénégal", emoji: "🇸🇳" },
    { code: "CI", nom: "Côte d'Ivoire", emoji: "🇨🇮" },
    { code: "CM", nom: "Cameroun", emoji: "🇨🇲" },
    { code: "HT", nom: "Haïti", emoji: "🇭🇹" },
    { code: "IN", nom: "Inde", emoji: "🇮🇳" },
    { code: "AU", nom: "Australie", emoji: "🇦🇺" },
    { code: "SG", nom: "Singapour", emoji: "🇸🇬" },
    { code: "SE", nom: "Suède", emoji: "🇸🇪" },
    { code: "NL", nom: "Pays-Bas", emoji: "🇳🇱" },
  ];

  const objectifs = [
    { value: "carriere", label: "Développer ma carrière", icon: "💼" },
    { value: "business", label: "Lancer mon business", icon: "🚀" },
    { value: "etudes", label: "Réussir mes études", icon: "📚" },
    { value: "sante", label: "Améliorer ma santé", icon: "💪" },
    { value: "creativite", label: "Développer ma créativité", icon: "🎨" },
    { value: "finance", label: "Gérer mes finances", icon: "💰" },
    { value: "leadership", label: "Devenir un leader", icon: "👑" },
    { value: "innovation", label: "Innover et créer", icon: "💡" },
  ];

  const phrasesInspirantesParObjectif = {
    carriere: [
      "Votre talent est votre passeport pour l'excellence",
      "Chaque étape de votre carrière construit votre légende",
      "L'excellence professionnelle est un voyage, pas une destination",
    ],
    business: [
      "Votre vision entrepreneuriale changera le monde",
      "Les champions créent des opportunités, pas des excuses",
      "Votre business est le reflet de votre détermination",
    ],
    etudes: [
      "La connaissance est la clé de votre réussite",
      "Chaque page apprise vous rapproche de vos rêves",
      "L'excellence académique forge les champions de demain",
    ],
    sante: [
      "Votre santé est votre plus grande richesse",
      "Un corps fort abrite un esprit champion",
      "Prendre soin de soi, c'est honorer son potentiel",
    ],
    creativite: [
      "Votre créativité est votre superpouvoir unique",
      "Les artistes guadeloupéens inspirent le monde entier",
      "Créer, c'est donner vie à l'impossible",
    ],
    finance: [
      "La liberté financière commence par une décision",
      "Gérer son argent, c'est gérer son destin",
      "L'abondance commence dans l'esprit",
    ],
    leadership: [
      "Les vrais leaders inspirent, pas commandent",
      "Votre influence positive changera des vies",
      "Le leadership est un service, pas un privilège",
    ],
    innovation: [
      "Les innovateurs de Guadeloupe brillent mondialement",
      "Votre créativité peut résoudre les défis de demain",
      "Innover, c'est avoir le courage de voir différemment",
    ],
  };

  const genererPhraseUnique = (pays, objectif) => {
    const phrases =
      phrasesInspirantesParObjectif[objectif] ||
      phrasesInspirantesParObjectif.business;
    const phraseBase = phrases[Math.floor(Math.random() * phrases.length)];
    const paysObj = pays.find((p) => p.code === formData.pays);
    return `${paysObj?.emoji} De ${paysObj?.nom} vers le monde : ${phraseBase}`;
  };

  const genererNumeroPasseport = () => {
    const date = new Date();
    const year = date.getFullYear();
    const random = Math.floor(Math.random() * 99999)
      .toString()
      .padStart(5, "0");
    return `RGN-${year}-${random}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const certificat = {
      prenom: formData.prenom,
      pays: pays.find((p) => p.code === formData.pays),
      objectif: objectifs.find((o) => o.value === formData.objectif),
      phraseInspirante: genererPhraseUnique(pays, formData.objectif),
      numeroPasseport: genererNumeroPasseport(),
      date: new Date().toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    };

    setCertificatData(certificat);
    setShowCertificat(true);

    try {
      await fetch("/api/passeport/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pays: formData.pays,
          objectif: formData.objectif,
          date: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error("Erreur enregistrement:", error);
    }

    setTimeout(() => {
      setShowBot(true);
    }, 2000);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const telechargerCertificat = async () => {
    const success = await generateCertificatPDF(certificatData);
    if (success) {
      alert("✅ Certificat téléchargé avec succès !");
    } else {
      alert("❌ Erreur lors de la génération du PDF. Veuillez réessayer.");
    }
  };

  const partagerCertificat = (platform) => {
    const text = `🏆 J'ai obtenu mon Passeport de Réussite REUSSITESS®971 ! 🇬🇵\n${certificatData?.phraseInspirante}\n#REUSSITESS971 #GuadeloupeTerreDeChampions`;

    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`,
    };

    window.open(urls[platform], "_blank", "width=600,height=400");
  };

  useEffect(() => {
    fetch("/api/passeport/stats")
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.error("Erreur stats:", err));
  }, []);

  return (
    <Layout>
      <div
        style={{
          background:
            "linear-gradient(135deg, #ffd700 0%, #ffed4e 50%, #ffa500 100%)",
          padding: "4rem 2rem",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-50px",
            right: "-50px",
            width: "200px",
            height: "200px",
            background: "rgba(255, 255, 255, 0.2)",
            borderRadius: "50%",
            filter: "blur(60px)",
          }}
        />

        <h1
          style={{
            fontSize: "clamp(2rem, 6vw, 4rem)",
            fontWeight: "900",
            color: "#1e293b",
            marginBottom: "1rem",
            textTransform: "uppercase",
            letterSpacing: "2px",
            textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          🏆 Passeport de Réussite REUSSITESS®971
        </h1>

        <p
          style={{
            fontSize: "1.5rem",
            color: "#334155",
            fontWeight: "600",
            marginBottom: "0.5rem",
          }}
        >
          Rejoignez le mouvement mondial né en Guadeloupe
        </p>

        <p
          style={{
            fontSize: "1.2rem",
            color: "#475569",
            fontWeight: "500",
          }}
        >
          🇬🇵 Terre de Champions • Excellence • Innovation • Succès
        </p>
      </div>

      {!showCertificat ? (
        <div
          style={{
            maxWidth: "800px",
            margin: "4rem auto",
            padding: "0 2rem",
          }}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
              borderRadius: "30px",
              padding: "3rem",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
              border: "2px solid rgba(255, 215, 0, 0.3)",
            }}
          >
            <h2
              style={{
                fontSize: "2rem",
                fontWeight: "800",
                color: "#ffd700",
                textAlign: "center",
                marginBottom: "2rem",
              }}
            >
              ✍️ Créez votre Passeport de Réussite
            </h2>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "2rem" }}>
                <label
                  style={{
                    display: "block",
                    color: "#94a3b8",
                    fontSize: "1rem",
                    fontWeight: "600",
                    marginBottom: "0.5rem",
                  }}
                >
                  📝 Prénom / Pseudo
                </label>
                <input
                  type="text"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleChange}
                  required
                  placeholder="Votre prénom..."
                  style={{
                    width: "100%",
                    padding: "1rem",
                    fontSize: "1.1rem",
                    borderRadius: "15px",
                    border: "2px solid rgba(255, 215, 0, 0.3)",
                    background: "rgba(255, 255, 255, 0.05)",
                    color: "white",
                    outline: "none",
                  }}
                />
              </div>

              <div style={{ marginBottom: "2rem" }}>
                <label
                  style={{
                    display: "block",
                    color: "#94a3b8",
                    fontSize: "1rem",
                    fontWeight: "600",
                    marginBottom: "0.5rem",
                  }}
                >
                  🌍 Votre Pays
                </label>
                <select
                  name="pays"
                  value={formData.pays}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    padding: "1rem",
                    fontSize: "1.1rem",
                    borderRadius: "15px",
                    border: "2px solid rgba(255, 215, 0, 0.3)",
                    background: "rgba(255, 255, 255, 0.05)",
                    color: "white",
                    outline: "none",
                    cursor: "pointer",
                  }}
                >
                  <option value="">Sélectionnez votre pays...</option>
                  {pays.map((p) => (
                    <option
                      key={p.code}
                      value={p.code}
                      style={{ background: "#1e293b" }}
                    >
                      {p.emoji} {p.nom}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: "2rem" }}>
                <label
                  style={{
                    display: "block",
                    color: "#94a3b8",
                    fontSize: "1rem",
                    fontWeight: "600",
                    marginBottom: "0.5rem",
                  }}
                >
                  🎯 Votre Objectif Principal
                </label>
                <select
                  name="objectif"
                  value={formData.objectif}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    padding: "1rem",
                    fontSize: "1.1rem",
                    borderRadius: "15px",
                    border: "2px solid rgba(255, 215, 0, 0.3)",
                    background: "rgba(255, 255, 255, 0.05)",
                    color: "white",
                    outline: "none",
                    cursor: "pointer",
                  }}
                >
                  <option value="">Choisissez votre objectif...</option>
                  {objectifs.map((obj) => (
                    <option
                      key={obj.value}
                      value={obj.value}
                      style={{ background: "#1e293b" }}
                    >
                      {obj.icon} {obj.label}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                style={{
                  width: "100%",
                  padding: "1.5rem",
                  fontSize: "1.3rem",
                  fontWeight: "900",
                  background:
                    "linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)",
                  color: "#1e293b",
                  border: "none",
                  borderRadius: "50px",
                  cursor: "pointer",
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                  boxShadow: "0 10px 30px rgba(255, 215, 0, 0.4)",
                  transition: "all 0.3s ease",
                }}
              >
                ✅ Valider mon Passeport de Réussite
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div
          style={{
            maxWidth: "900px",
            margin: "4rem auto",
            padding: "0 2rem",
          }}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
              borderRadius: "20px",
              padding: "3rem",
              boxShadow: "0 30px 80px rgba(0,0,0,0.3)",
              border: "8px solid #ffd700",
              position: "relative",
              marginBottom: "3rem",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "20px",
                left: "20px",
                fontSize: "3rem",
              }}
            >
              🏆
            </div>
            <div
              style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                fontSize: "3rem",
              }}
            >
              🇬🇵
            </div>

            <div style={{ textAlign: "center" }}>
              <h2
                style={{
                  fontSize: "2.5rem",
                  fontWeight: "900",
                  color: "#1e293b",
                  marginBottom: "1rem",
                  textTransform: "uppercase",
                }}
              >
                Passeport de Réussite
              </h2>

              <div
                style={{
                  fontSize: "1.2rem",
                  color: "#ffd700",
                  fontWeight: "700",
                  marginBottom: "2rem",
                }}
              >
                REUSSITESS®971
              </div>

              <div
                style={{
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  padding: "2rem",
                  borderRadius: "15px",
                  marginBottom: "2rem",
                  color: "white",
                }}
              >
                <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>
                  {certificatData?.pays?.emoji}
                </div>
                <h3
                  style={{
                    fontSize: "2rem",
                    fontWeight: "800",
                    marginBottom: "0.5rem",
                  }}
                >
                  {certificatData?.prenom}
                </h3>
                <p style={{ fontSize: "1.1rem", opacity: 0.9 }}>
                  {certificatData?.pays?.nom}
                </p>
              </div>

              <div
                style={{
                  fontSize: "1.3rem",
                  color: "#334155",
                  fontWeight: "600",
                  marginBottom: "2rem",
                  lineHeight: "1.8",
                  fontStyle: "italic",
                }}
              >
                "{certificatData?.phraseInspirante}"
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "center",
                  marginBottom: "2rem",
                  flexWrap: "wrap",
                  gap: "1rem",
                }}
              >
                <div>
                  <div style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
                    Objectif
                  </div>
                  <div
                    style={{
                      fontSize: "1.3rem",
                      fontWeight: "700",
                      color: "#1e293b",
                    }}
                  >
                    {certificatData?.objectif?.icon}{" "}
                    {certificatData?.objectif?.label}
                  </div>
                </div>
                <div>
                  <div style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
                    N° Passeport
                  </div>
                  <div
                    style={{
                      fontSize: "1.1rem",
                      fontWeight: "700",
                      color: "#ffd700",
                    }}
                  >
                    {certificatData?.numeroPasseport}
                  </div>
                </div>
                <div>
                  <div style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
                    Date
                  </div>
                  <div
                    style={{
                      fontSize: "1.1rem",
                      fontWeight: "700",
                      color: "#1e293b",
                    }}
                  >
                    {certificatData?.date}
                  </div>
                </div>
              </div>

              <div
                style={{
                  borderTop: "3px solid #ffd700",
                  paddingTop: "1.5rem",
                  fontSize: "0.95rem",
                  color: "#64748b",
                  lineHeight: "1.6",
                }}
              >
                <strong style={{ color: "#1e293b" }}>
                  Guadeloupe Terre de Champions
                </strong>
                <br />
                REUSSITESS®971
                <br />
                <strong style={{ color: "#ffd700" }}>
                  EXCELLENCE • INNOVATION • SUCCÈS
                </strong>
                <br />✨ Positivité à l'infini ✨
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              flexWrap: "wrap",
              marginBottom: "3rem",
            }}
          >
            <button
              onClick={telechargerCertificat}
              style={{
                padding: "1rem 2rem",
                fontSize: "1.1rem",
                fontWeight: "700",
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                color: "white",
                border: "none",
                borderRadius: "50px",
                cursor: "pointer",
                boxShadow: "0 5px 15px rgba(16, 185, 129, 0.3)",
              }}
            >
              📥 Télécharger PDF
            </button>

            <button
              onClick={() => partagerCertificat("twitter")}
              style={{
                padding: "1rem 2rem",
                fontSize: "1.1rem",
                fontWeight: "700",
                background: "linear-gradient(135deg, #1da1f2 0%, #0d8bd9 100%)",
                color: "white",
                border: "none",
                borderRadius: "50px",
                cursor: "pointer",
                boxShadow: "0 5px 15px rgba(29, 161, 242, 0.3)",
              }}
            >
              🐦 Partager sur Twitter
            </button>

            <button
              onClick={() => window.print()}
              style={{
                padding: "1rem 2rem",
                fontSize: "1.1rem",
                fontWeight: "700",
                background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
                color: "white",
                border: "none",
                borderRadius: "50px",
                cursor: "pointer",
                boxShadow: "0 5px 15px rgba(99, 102, 241, 0.3)",
              }}
            >
              🖨️ Imprimer
            </button>
          </div>

          {showBot && (
            <div
              style={{
                background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                borderRadius: "20px",
                padding: "2rem",
                color: "white",
                textAlign: "center",
                marginBottom: "3rem",
              }}
            >
              <h3
                style={{
                  fontSize: "1.8rem",
                  fontWeight: "800",
                  marginBottom: "1rem",
                }}
              >
                🤖 Votre Plan d'Action Personnalisé
              </h3>
              <p style={{ fontSize: "1.2rem", marginBottom: "1.5rem" }}>
                Notre Bot Assistant va maintenant créer votre plan sur 7 ou 30
                jours
                <br />
                basé sur votre objectif :{" "}
                <strong>{certificatData?.objectif?.label}</strong>
              </p>
              <button
                onClick={() => {
                  const plan = genererPlanAction(formData.objectif, 7);
                  const ressources = genererRessources(formData.objectif);

                  let message = `🚀 VOTRE PLAN D'ACTION 7 JOURS\nObjectif: ${certificatData?.objectif?.label}\n\n`;
                  plan.forEach((etape) => {
                    message += `Jour ${etape.jour}: ${etape.titre}\n${etape.description}\n\n`;
                  });
                  message += `\n📚 RESSOURCES RECOMMANDÉES:\n`;
                  ressources.forEach((r) => {
                    if (r.lien) message += `- ${r.titre} (${r.type})\n`;
                  });

                  alert(message);
                }}
                style={{
                  padding: "1rem 2rem",
                  fontSize: "1.2rem",
                  fontWeight: "700",
                  background: "white",
                  color: "#f5576c",
                  border: "none",
                  borderRadius: "50px",
                  cursor: "pointer",
                  boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
                }}
              >
                🚀 Lancer mon Plan d'Action
              </button>
            </div>
          )}
        </div>
      )}

      <div
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          padding: "5rem 2rem",
          marginTop: "4rem",
        }}
      >
        <div
          style={{ maxWidth: "1200px", margin: "0 auto", textAlign: "center" }}
        >
          <h2
            style={{
              fontSize: "3rem",
              fontWeight: "900",
              color: "#ffd700",
              marginBottom: "2rem",
            }}
          >
            🌍 Mouvement Mondial REUSSITESS®971
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "2rem",
              marginBottom: "3rem",
            }}
          >
            <div
              style={{
                background: "rgba(255, 215, 0, 0.1)",
                padding: "2rem",
                borderRadius: "20px",
                border: "2px solid rgba(255, 215, 0, 0.3)",
              }}
            >
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🌍</div>
              <div
                style={{
                  fontSize: "2.5rem",
                  fontWeight: "900",
                  color: "#ffd700",
                }}
              >
                {stats.totalPays}
              </div>
              <div
                style={{
                  color: "#94a3b8",
                  fontSize: "1.1rem",
                  marginTop: "0.5rem",
                }}
              >
                Pays représentés
              </div>
            </div>

            <div
              style={{
                background: "rgba(255, 215, 0, 0.1)",
                padding: "2rem",
                borderRadius: "20px",
                border: "2px solid rgba(255, 215, 0, 0.3)",
              }}
            >
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🏆</div>
              <div
                style={{
                  fontSize: "2.5rem",
                  fontWeight: "900",
                  color: "#ffd700",
                }}
              >
                {stats.totalChampions ? stats.totalChampions.toLocaleString() : "En croissance 🌱"}
              </div>
              <div
                style={{
                  color: "#94a3b8",
                  fontSize: "1.1rem",
                  marginTop: "0.5rem",
                }}
              >
                Champions inscrits
              </div>
            </div>

            <div
              style={{
                background: "rgba(255, 215, 0, 0.1)",
                padding: "2rem",
                borderRadius: "20px",
                border: "2px solid rgba(255, 215, 0, 0.3)",
              }}
            >
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🇬🇵</div>
              <div
                style={{
                  fontSize: "2.5rem",
                  fontWeight: "900",
                  color: "#ffd700",
                }}
              >
                971
              </div>
              <div
                style={{
                  color: "#94a3b8",
                  fontSize: "1.1rem",
                  marginTop: "0.5rem",
                }}
              >
                Né en Guadeloupe
              </div>
            </div>
          </div>

          <p
            style={{
              fontSize: "1.3rem",
              color: "#94a3b8",
              lineHeight: "1.8",
              maxWidth: "800px",
              margin: "0 auto",
            }}
          >
            Un mouvement d'excellence et de positivité
            <br />
            qui inspire le monde entier depuis la Guadeloupe 🇬🇵
            <br />
            <strong style={{ color: "#ffd700" }}>
              Excellence • Innovation • Succès
            </strong>
          </p>
        </div>
      </div>

      <style jsx>{`
        input:focus,
        select:focus {
          border-color: #ffd700 !important;
          box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
        }

        @media print {
          button {
            display: none !important;
          }
        }
      `}</style>
    </Layout>
  );
}
