/* © Reussitess®971 INPI DSO2026012614 PORINUS Rony 2026 */
import Head from "next/head";
import { useRouter } from "next/router";

export default function Reglementation() {
  const router = useRouter();

  const regulations = [
    {
      title: "🇪🇺 Réglementation Européenne",
      sections: [
        {
          subtitle: "TVA et Commerce Électronique",
          items: [
            "Directive TVA e-commerce (Juillet 2021) : guichet unique OSS",
            "Seuils de franchise TVA harmonisés à 10 000€",
            "TVA à l'importation : suppression franchise 22€",
            "Responsabilité des marketplaces pour la TVA",
          ],
        },
        {
          subtitle: "Protection des Consommateurs",
          items: [
            "Directive 2011/83/UE sur les droits des consommateurs",
            "Droit de rétractation 14 jours pour ventes à distance",
            "Information précontractuelle obligatoire",
            "Garantie légale de conformité 2 ans minimum",
          ],
        },
        {
          subtitle: "Digital Services Act (DSA)",
          items: [
            "Transparence des algorithmes de recommandation",
            "Obligations de modération de contenus",
            "Protection des mineurs renforcée",
            "Application complète depuis 2024",
          ],
        },
      ],
    },
    {
      title: "🌍 Normes Internationales",
      sections: [
        {
          subtitle: "OMC - Organisation Mondiale du Commerce",
          items: [
            "Accords sur le commerce des services (AGCS)",
            "Facilitation des échanges (Accord de Bali)",
            "Commerce électronique : moratoire sur droits de douane",
            "Règlement des différends commerciaux",
          ],
        },
        {
          subtitle: "Normes ISO",
          items: [
            "ISO 10002 : Traitement des réclamations clients",
            "ISO 27001 : Sécurité de l'information",
            "ISO 9001 : Systèmes de management de la qualité",
            "ISO 14001 : Management environnemental",
          ],
        },
      ],
    },
    {
      title: "🇫🇷 Réglementation Française",
      sections: [
        {
          subtitle: "Code de la Consommation",
          items: [
            "Obligation d'information du consommateur",
            "Droit de rétractation et modalités",
            "Garanties légales : conformité et vices cachés",
            "Lutte contre les pratiques commerciales déloyales",
          ],
        },
        {
          subtitle: "Commerce Électronique",
          items: [
            "Loi pour la Confiance dans l'Économie Numérique (LCEN)",
            "Mentions légales obligatoires",
            "CGV et CGU : obligations de publication",
            "Protection des données personnelles (RGPD)",
          ],
        },
        {
          subtitle: "Fiscalité",
          items: [
            "TVA : taux normal 20%, réduit 5.5% et 2.1%",
            "Déclaration CA3 pour assujettis",
            "Régime micro-entreprise : franchise en base",
            "Obligations comptables selon régime",
          ],
        },
      ],
    },
    {
      title: "🏝 Outre-Mers (DOM-TOM)",
      sections: [
        {
          subtitle: "Spécificités Fiscales",
          items: [
            "Martinique, Guadeloupe, Guyane : TVA applicable (8.5% taux normal)",
            "Octroi de mer : taxe spécifique aux DOM",
            "Exonérations et aides au développement économique",
            "Zones franches d'activité (ZFA)",
          ],
        },
        {
          subtitle: "Réglementation Douanière",
          items: [
            "Statut de Région Ultrapériphérique (RUP) pour DOM",
            "Formalités d'importation/exportation",
            "Contrôles sanitaires et phytosanitaires spécifiques",
            "Contingents tarifaires pour certains produits",
          ],
        },
      ],
    },
  ];

  const keyDates = [
    { date: "2018", event: "Entrée en vigueur du RGPD" },
    { date: "2021", event: "Réforme TVA e-commerce UE" },
    { date: "2024", event: "Application complète DSA" },
    { date: "2025", event: "Nouvelles directives consommateurs UE" },
  ];

  const usefulLinks = [
    {
      title: "Commission Européenne - Commerce",
      description: "Réglementations et directives européennes officielles",
      tag: "🇪🇺",
    },
    {
      title: "DGCCRF",
      description:
        "Direction Générale de la Concurrence, Consommation et Répression des Fraudes",
      tag: "🇫🇷",
    },
    {
      title: "Douanes Françaises",
      description: "Formalités import/export et réglementation douanière",
      tag: "🇫🇷",
    },
    {
      title: "CNIL",
      description: "Protection des données personnelles (RGPD)",
      tag: "🇫🇷",
    },
  ];

  return (
    <>
      <Head>
        <title>⚖ Réglementation Internationale - Bibliothèque Mondiale</title>
        <meta
          name="description"
          content="Réglementations internationales, lois et normes à jour pour le commerce électronique"
        />
      </Head>

      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
          padding: "20px",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <button
            onClick={() => router.push("/bibliotheque")}
            style={{
              padding: "10px 20px",
              background: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              marginBottom: "20px",
              fontWeight: "bold",
            }}
          >
            ← Retour à la Bibliothèque
          </button>

          <div
            style={{
              background: "white",
              padding: "40px",
              borderRadius: "20px",
              boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
            }}
          >
            <h1
              style={{
                fontSize: "3em",
                marginBottom: "10px",
                color: "#7c3aed",
              }}
            >
              ⚖ Réglementation Internationale
            </h1>
            <p
              style={{ fontSize: "1.2em", color: "#666", marginBottom: "10px" }}
            >
              Lois, normes et réglementations à jour pour le commerce
              international
            </p>
            <p
              style={{
                fontSize: "0.95em",
                color: "#999",
                marginBottom: "40px",
                fontStyle: "italic",
              }}
            >
              ⚠ Information à caractère général. Consultez toujours un juriste
              pour votre situation spécifique.
            </p>

            {/* Dates clés */}
            <div
              style={{
                background: "#f5f3ff",
                padding: "25px",
                borderRadius: "15px",
                marginBottom: "40px",
              }}
            >
              <h2
                style={{
                  color: "#7c3aed",
                  marginBottom: "20px",
                  fontSize: "1.5em",
                }}
              >
                📅 Dates Clés Réglementaires
              </h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "15px",
                }}
              >
                {keyDates.map((item, i) => (
                  <div
                    key={i}
                    style={{
                      background: "white",
                      padding: "15px",
                      borderRadius: "10px",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "1.5em",
                        fontWeight: "bold",
                        color: "#8b5cf6",
                        marginBottom: "5px",
                      }}
                    >
                      {item.date}
                    </div>
                    <div style={{ fontSize: "0.9em", color: "#666" }}>
                      {item.event}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Réglementations détaillées */}
            {regulations.map((regulation, i) => (
              <div key={i} style={{ marginBottom: "30px" }}>
                <h2
                  style={{
                    color: "#7c3aed",
                    marginBottom: "20px",
                    fontSize: "2em",
                    borderBottom: "3px solid #8b5cf6",
                    paddingBottom: "10px",
                  }}
                >
                  {regulation.title}
                </h2>
                {regulation.sections.map((section, j) => (
                  <div
                    key={j}
                    style={{
                      background: "#faf5ff",
                      padding: "25px",
                      borderRadius: "12px",
                      marginBottom: "20px",
                      borderLeft: "4px solid #8b5cf6",
                    }}
                  >
                    <h3
                      style={{
                        color: "#7c3aed",
                        marginBottom: "15px",
                        fontSize: "1.3em",
                      }}
                    >
                      {section.subtitle}
                    </h3>
                    <ul style={{ lineHeight: "2", fontSize: "1.05em" }}>
                      {section.items.map((item, k) => (
                        <li key={k} style={{ marginBottom: "8px" }}>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ))}

            {/* Liens utiles */}
            <h2
              style={{
                color: "#7c3aed",
                marginTop: "50px",
                marginBottom: "25px",
                fontSize: "2em",
              }}
            >
              🔗 Liens Officiels
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "20px",
                marginBottom: "30px",
              }}
            >
              {usefulLinks.map((link, i) => (
                <div
                  key={i}
                  style={{
                    background: "#f5f3ff",
                    padding: "20px",
                    borderRadius: "12px",
                    borderTop: "3px solid #8b5cf6",
                  }}
                >
                  <div style={{ fontSize: "2em", marginBottom: "10px" }}>
                    {link.tag}
                  </div>
                  <h3 style={{ color: "#7c3aed", marginBottom: "10px" }}>
                    {link.title}
                  </h3>
                  <p style={{ fontSize: "0.95em", color: "#666" }}>
                    {link.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Avertissement */}
            <div
              style={{
                background: "#8b5cf6",
                color: "white",
                padding: "30px",
                borderRadius: "15px",
              }}
            >
              <h2 style={{ marginBottom: "15px", fontSize: "1.8em" }}>
                ⚠ Avertissement Important
              </h2>
              <p
                style={{
                  fontSize: "1.1em",
                  lineHeight: "1.7",
                  marginBottom: "15px",
                }}
              >
                Les informations présentées sur cette page sont fournies à titre
                informatif et pédagogique. Elles constituent un aperçu général
                de la réglementation applicable au commerce international et
                électronique.
              </p>
              <p style={{ fontSize: "1.05em", lineHeight: "1.7" }}>
                <strong>
                  Ces informations ne constituent pas un conseil juridique.
                </strong>{" "}
                Pour toute question spécifique à votre situation, nous vous
                recommandons fortement de consulter un avocat spécialisé en
                droit commercial international ou un conseiller juridique
                qualifié.
              </p>
              <p
                style={{
                  fontSize: "0.95em",
                  marginTop: "20px",
                  fontStyle: "italic",
                }}
              >
                💡 Les réglementations évoluent régulièrement. Cette page est
                mise à jour périodiquement, mais vérifiez toujours les textes
                officiels pour les informations les plus récentes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
