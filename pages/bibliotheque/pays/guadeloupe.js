/* © Reussitess®971 INPI DSO2026012614 PORINUS Rony 2026 */
import Head from "next/head";
import { useRouter } from "next/router";

export default function Guadeloupe() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>🇬🇵 Guadeloupe - Bibliothèque Mondiale REUSSITESS®</title>
        <meta
          name="description"
          content="Fiche complète Guadeloupe : population, marché e-commerce, TVA, Amazon, histoire et ressources"
        />
      </Head>

      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
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
            <h1 style={{ fontSize: "3em", marginBottom: "10px" }}>
              🇬🇵 Guadeloupe
            </h1>
            <p
              style={{ fontSize: "1.2em", color: "#666", marginBottom: "30px" }}
            >
              Archipel - Département et région d&apos;outre-mer français -
              Caraïbes
            </p>

            {/* Statistiques clés */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "20px",
                marginBottom: "40px",
              }}
            >
              {[
                { label: "Population", value: "385K" },
                { label: "Superficie", value: "1 628 km²" },
                { label: "Chef-lieu", value: "Basse-Terre" },
                { label: "Statut", value: "DROM" },
              ].map((stat, i) => (
                <div
                  key={i}
                  style={{
                    background: "#f0f4ff",
                    padding: "20px",
                    borderRadius: "10px",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: "2em",
                      fontWeight: "bold",
                      color: "#667eea",
                    }}
                  >
                    {stat.value}
                  </div>
                  <div style={{ fontSize: "0.9em", color: "#666" }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Géographie */}
            <h2 style={{ color: "#667eea", marginTop: "40px" }}>
              🏝 Géographie
            </h2>
            <div
              style={{
                background: "#f9fafb",
                padding: "20px",
                borderRadius: "10px",
                marginBottom: "30px",
              }}
            >
              <p style={{ fontSize: "1.05em", lineHeight: "1.6" }}>
                <strong>Archipel composé de :</strong>
              </p>
              <ul
                style={{
                  lineHeight: "1.8",
                  paddingLeft: "20px",
                  fontSize: "1.05em",
                }}
              >
                <li>
                  <strong>Basse-Terre :</strong> Île volcanique, Soufrière (1
                  467m), capitale administrative
                </li>
                <li>
                  <strong>Grande-Terre :</strong> Île calcaire, Pointe-à-Pitre
                  (ville principale)
                </li>
                <li>
                  <strong>Marie-Galante :</strong> Île ronde, traditions
                  sucrières
                </li>
                <li>
                  <strong>Les Saintes :</strong> Archipel touristique
                  (Terre-de-Haut, Terre-de-Bas)
                </li>
                <li>
                  <strong>La Désirade :</strong> Petite île à l&apos;est
                </li>
                <li>
                  <strong>Saint-Barthélemy & Saint-Martin :</strong>{" "}
                  Collectivités d&apos;outre-mer distinctes depuis 2007
                </li>
              </ul>
            </div>

            {/* Économie */}
            <h2 style={{ color: "#667eea" }}>💼 Économie</h2>
            <div
              style={{
                background: "#f9fafb",
                padding: "20px",
                borderRadius: "10px",
                marginBottom: "30px",
              }}
            >
              <p
                style={{
                  marginBottom: "15px",
                  fontSize: "1.05em",
                  lineHeight: "1.6",
                }}
              >
                <strong>PIB :</strong> ~10.5 milliards d'euros
                <br />
                <strong>Secteurs principaux :</strong> Tourisme, commerce,
                agriculture (canne à sucre, banane)
                <br />
                <strong>Taux de chômage :</strong> ~22% (2024)
                <br />
                <strong>Monnaie :</strong> Euro (€)
                <br />
                <strong>Aéroports :</strong> Pointe-à-Pitre (PTP), Basse-Terre,
                Marie-Galante
              </p>
            </div>

            {/* Fiscalité & TVA */}
            <h2 style={{ color: "#667eea" }}>⚖ Fiscalité & TVA</h2>
            <div
              style={{
                background: "#f9fafb",
                padding: "20px",
                borderRadius: "10px",
                marginBottom: "30px",
              }}
            >
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #e0e0e0" }}>
                    <th style={{ padding: "10px", textAlign: "left" }}>Type</th>
                    <th style={{ padding: "10px", textAlign: "left" }}>Taux</th>
                    <th style={{ padding: "10px", textAlign: "left" }}>
                      Détails
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: "10px" }}>TVA Normale</td>
                    <td style={{ padding: "10px", fontWeight: "bold" }}>
                      8.5%
                    </td>
                    <td style={{ padding: "10px" }}>
                      Produits et services standard
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: "10px" }}>TVA Réduite</td>
                    <td style={{ padding: "10px", fontWeight: "bold" }}>
                      2.1%
                    </td>
                    <td style={{ padding: "10px" }}>
                      Presse, médicaments, spectacles
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: "10px" }}>Octroi de mer</td>
                    <td style={{ padding: "10px", fontWeight: "bold" }}>
                      Variable
                    </td>
                    <td style={{ padding: "10px" }}>
                      Taxe spécifique DOM sur marchandises
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* E-commerce & Amazon */}
            <h2 style={{ color: "#667eea" }}>🛒 E-commerce & Amazon</h2>
            <div
              style={{
                background: "#f9fafb",
                padding: "20px",
                borderRadius: "10px",
                marginBottom: "30px",
              }}
            >
              <p style={{ marginBottom: "10px" }}>
                <strong>Marketplace :</strong> Amazon.fr (avec limitations
                livraison outre-mer)
              </p>
              <p style={{ marginBottom: "10px" }}>
                <strong>Particularités :</strong>
              </p>
              <ul style={{ lineHeight: "1.8", paddingLeft: "20px" }}>
                <li>
                  Frais de port métropole-Guadeloupe souvent élevés (15-50€)
                </li>
                <li>Délais de livraison : 1-3 semaines en moyenne</li>
                <li>
                  Amazon Prime : livraison gratuite limitée, conditions
                  spéciales
                </li>
                <li>
                  Exclusions : produits volumineux, dangereux, périssables
                </li>
                <li>
                  Marketplace locale en développement (Cdiscount Outre-Mer,
                  etc.)
                </li>
                <li>Essor du click & collect et livraison locale</li>
              </ul>
            </div>

            {/* Histoire résumée */}
            <h2 style={{ color: "#667eea" }}>📖 Histoire Résumée</h2>
            <div
              style={{
                background: "#f9fafb",
                padding: "20px",
                borderRadius: "10px",
                marginBottom: "30px",
              }}
            >
              <ul style={{ lineHeight: "2", fontSize: "1.05em" }}>
                <li>
                  <strong>1493 :</strong> Découverte par Christophe Colomb (2e
                  voyage)
                </li>
                <li>
                  <strong>Avant 1635 :</strong> Peuplement par les Caraïbes
                  (Kalinagos)
                </li>
                <li>
                  <strong>1635 :</strong> Colonisation française (L'Olive et
                  Duplessis)
                </li>
                <li>
                  <strong>XVIIe-XIXe :</strong> Économie de plantation,
                  esclavage
                </li>
                <li>
                  <strong>1794 :</strong> Première abolition de l'esclavage
                  (Convention)
                </li>
                <li>
                  <strong>1802 :</strong> Rétablissement de l'esclavage par
                  Napoléon
                </li>
                <li>
                  <strong>1848 :</strong> Abolition définitive de l'esclavage
                </li>
                <li>
                  <strong>1946 :</strong> Départementalisation
                </li>
                <li>
                  <strong>Aujourd'hui :</strong> DROM et région
                  ultrapériphérique UE
                </li>
              </ul>
            </div>

            {/* Culture */}
            <h2 style={{ color: "#667eea" }}>🎭 Culture & Patrimoine</h2>
            <div
              style={{
                background: "#f9fafb",
                padding: "20px",
                borderRadius: "10px",
                marginBottom: "30px",
              }}
            >
              <p style={{ marginBottom: "10px" }}>
                <strong>Langues :</strong> Français (officiel), Créole
                guadeloupéen
              </p>
              <p style={{ marginBottom: "10px" }}>
                <strong>Carnaval :</strong> Janvier-Mars, l'un des plus réputés
                des Caraïbes
              </p>
              <p style={{ marginBottom: "15px" }}>
                <strong>Points d&apos;intérêt :</strong>
              </p>
              <ul style={{ lineHeight: "1.8", paddingLeft: "20px" }}>
                <li>
                  Parc National de la Guadeloupe (Basse-Terre) - volcan de la
                  Soufrière
                </li>
                <li>
                  Plages : Sainte-Anne, Le Gosier, Grande-Anse (Basse-Terre)
                </li>
                <li>
                  Les Saintes : baie classée parmi les plus belles du monde
                </li>
                <li>
                  Distilleries de rhum agricole (Damoiseau, Longueteau, etc.)
                </li>
                <li>Mémorial ACTe à Pointe-à-Pitre (mémoire de l'esclavage)</li>
                <li>
                  Musique : Gwo Ka (patrimoine culturel immatériel UNESCO)
                </li>
              </ul>
            </div>

            {/* Ressources officielles */}
            <h2 style={{ color: "#667eea" }}>
              🔗 Ressources Institutionnelles
            </h2>
            <div
              style={{
                background: "#f9fafb",
                padding: "20px",
                borderRadius: "10px",
              }}
            >
              <p style={{ marginBottom: "10px" }}>📄 Région Guadeloupe</p>
              <p style={{ marginBottom: "10px" }}>
                📄 Préfecture de la Guadeloupe
              </p>
              <p style={{ marginBottom: "10px" }}>📄 CCI Îles de Guadeloupe</p>
              <p style={{ marginBottom: "10px" }}>
                📄 Comité du Tourisme des Îles de Guadeloupe
              </p>
              <p>📄 Agence de Développement Économique de la Guadeloupe</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
