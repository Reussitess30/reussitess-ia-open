/* © Reussitess®971 INPI DSO2026012614 PORINUS Rony 2026 */
import Head from "next/head";
import { useRouter } from "next/router";

export default function PolitiqueConfidentialite() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Politique de Confidentialité - Reussitess® REUSSITESS®NEURO-X</title>
        <meta
          name="description"
          content="Politique de confidentialité et protection des données personnelles - Conforme RGPD"
        />
      </Head>
      <div style={{ padding: "50px", maxWidth: "1200px", margin: "0 auto" }}>
        <button
          onClick={() => router.push("/")}
          style={{
            padding: "10px 20px",
            background: "#667eea",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            marginBottom: "30px",
          }}
        >
          ← Retour au Hub
        </button>

        <h1 style={{ color: "#667eea", marginBottom: "20px" }}>
          🔒 Politique de Confidentialité
        </h1>

        <div
          style={{
            background: "white",
            padding: "30px",
            borderRadius: "15px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
            lineHeight: "1.8",
          }}
        >
          <p>
            <em>
              Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}
            </em>
          </p>

          <section style={{ marginTop: "30px" }}>
            <h2 style={{ color: "#667eea", marginBottom: "15px" }}>
              1. Introduction
            </h2>
            <p>
              REUSSITESS® REUSSITESS®NEURO-X s'engage à protéger la confidentialité de
              ses utilisateurs. Cette politique de confidentialité décrit
              comment nous collectons, utilisons et protégeons vos informations
              personnelles conformément au Règlement Général sur la Protection
              des Données (RGPD).
            </p>
          </section>

          <section style={{ marginTop: "30px" }}>
            <h2 style={{ color: "#667eea", marginBottom: "15px" }}>
              2. Responsable du Traitement
            </h2>
            <p>
              <strong>REUSSITESS® REUSSITESS®NEURO-X</strong>
              <br />
              <strong>Porinus Rony Roger</strong>
              <br />
              SIRET: 444699979700031
              <br />
              Auto-entrepreneur EI
              <br />
              Contact : influenceur@reussitess.fr
            </p>
          </section>

          <section style={{ marginTop: "30px" }}>
            <h2 style={{ color: "#667eea", marginBottom: "15px" }}>
              3. Données Collectées
            </h2>
            <p>Notre site web collecte les types de données suivants :</p>
            <ul style={{ marginLeft: "20px", marginTop: "10px" }}>
              <li>
                <strong>Données de navigation :</strong> Adresse IP, type de
                navigateur, pages visitées, durée de visite
              </li>
              <li>
                <strong>Cookies :</strong> Pour améliorer l'expérience
                utilisateur et mesurer l'audience
              </li>
              <li>
                <strong>Données de contact :</strong> Si vous nous contactez
                volontairement (nom, email)
              </li>
            </ul>
          </section>

          <section style={{ marginTop: "30px" }}>
            <h2 style={{ color: "#667eea", marginBottom: "15px" }}>
              4. Finalité du Traitement
            </h2>
            <p>Nous utilisons vos données pour :</p>
            <ul style={{ marginLeft: "20px", marginTop: "10px" }}>
              <li>Améliorer l'expérience utilisateur du site</li>
              <li>Analyser le trafic et les statistiques de visite</li>
              <li>Répondre à vos demandes de contact</li>
              <li>Respecter nos obligations légales</li>
            </ul>
          </section>

          <section style={{ marginTop: "30px" }}>
            <h2 style={{ color: "#667eea", marginBottom: "15px" }}>
              5. Partage des Données
            </h2>
            <p>
              Nous ne vendons pas vos données personnelles. Vos informations
              peuvent être partagées avec :
            </p>
            <ul style={{ marginLeft: "20px", marginTop: "10px" }}>
              <li>
                <strong>Amazon :</strong> Lorsque vous cliquez sur nos liens
                d'affiliation (conformément à leur politique de confidentialité)
              </li>
              <li>
                <strong>Hébergeur :</strong> Vercel (pour l'hébergement du site)
              </li>
              <li>
                <strong>Outils d'analyse :</strong> Pour les statistiques de
                trafic anonymisées
              </li>
            </ul>
          </section>

          <section style={{ marginTop: "30px" }}>
            <h2 style={{ color: "#667eea", marginBottom: "15px" }}>
              6. Cookies
            </h2>
            <p>
              Notre site utilise des cookies pour améliorer votre expérience.
              Vous pouvez désactiver les cookies dans les paramètres de votre
              navigateur, mais cela peut affecter certaines fonctionnalités du
              site.
            </p>
          </section>

          <section style={{ marginTop: "30px" }}>
            <h2 style={{ color: "#667eea", marginBottom: "15px" }}>
              7. Vos Droits (RGPD)
            </h2>
            <p>Conformément au RGPD, vous disposez des droits suivants :</p>
            <ul style={{ marginLeft: "20px", marginTop: "10px" }}>
              <li>
                <strong>Droit d'accès :</strong> Obtenir une copie de vos
                données personnelles
              </li>
              <li>
                <strong>Droit de rectification :</strong> Corriger des données
                inexactes
              </li>
              <li>
                <strong>Droit à l'effacement :</strong> Demander la suppression
                de vos données
              </li>
              <li>
                <strong>Droit à la limitation :</strong> Limiter le traitement
                de vos données
              </li>
              <li>
                <strong>Droit à la portabilité :</strong> Recevoir vos données
                dans un format structuré
              </li>
              <li>
                <strong>Droit d'opposition :</strong> Vous opposer au traitement
                de vos données
              </li>
            </ul>
            <p style={{ marginTop: "15px" }}>
              Pour exercer ces droits, contactez-nous via notre page de contact.
            </p>
          </section>

          <section style={{ marginTop: "30px" }}>
            <h2 style={{ color: "#667eea", marginBottom: "15px" }}>
              8. Sécurité des Données
            </h2>
            <p>
              Nous mettons en œuvre des mesures de sécurité techniques et
              organisationnelles appropriées pour protéger vos données contre
              tout accès non autorisé, modification, divulgation ou destruction.
            </p>
            <ul style={{ marginLeft: "20px", marginTop: "10px" }}>
              <li>Connexion HTTPS sécurisée</li>
              <li>Headers de sécurité HTTP</li>
              <li>Hébergement sécurisé (Vercel)</li>
              <li>Aucun stockage de données sensibles</li>
            </ul>
          </section>

          <section style={{ marginTop: "30px" }}>
            <h2 style={{ color: "#667eea", marginBottom: "15px" }}>
              9. Conservation des Données
            </h2>
            <p>
              Nous conservons vos données uniquement le temps nécessaire aux
              finalités pour lesquelles elles ont été collectées, ou
              conformément aux obligations légales.
            </p>
          </section>

          <section style={{ marginTop: "30px" }}>
            <h2 style={{ color: "#667eea", marginBottom: "15px" }}>
              10. Liens Externes
            </h2>
            <p>
              Notre site contient des liens vers des sites externes (notamment
              Amazon). Nous ne sommes pas responsables des pratiques de
              confidentialité de ces sites tiers. Nous vous encourageons à
              consulter leurs politiques de confidentialité respectives.
            </p>
          </section>

          <section style={{ marginTop: "30px" }}>
            <h2 style={{ color: "#667eea", marginBottom: "15px" }}>
              11. Programme d'Affiliation Amazon
            </h2>
            <div
              style={{
                padding: "20px",
                background: "#fef3c7",
                borderRadius: "10px",
                marginTop: "15px",
              }}
            >
              <p>
                <strong>⚠ Déclaration d'Affiliation :</strong>
                <br />
                REUSSITESS® REUSSITESS®NEURO-X participe au Programme Partenaires
                d'Amazon, un programme d'affiliation conçu pour permettre aux
                sites de percevoir une rémunération par la création de liens
                vers Amazon.fr, Amazon.com et autres sites Amazon à travers le
                monde.
                <br />
                <br />
                Lorsque vous cliquez sur un lien d'affiliation Amazon et
                effectuez un achat, nous pouvons recevoir une commission sans
                frais supplémentaires pour vous. Ces commissions nous aident à
                maintenir et améliorer ce service gratuit.
              </p>
            </div>
          </section>

          <section style={{ marginTop: "30px" }}>
            <h2 style={{ color: "#667eea", marginBottom: "15px" }}>
              12. Modifications de cette Politique
            </h2>
            <p>
              Nous nous réservons le droit de modifier cette politique de
              confidentialité à tout moment. Toute modification sera publiée sur
              cette page avec une date de mise à jour révisée.
            </p>
          </section>

          <section style={{ marginTop: "30px" }}>
            <h2 style={{ color: "#667eea", marginBottom: "15px" }}>
              13. Contact
            </h2>
            <p>
              Pour toute question concernant cette politique de confidentialité
              ou pour exercer vos droits, veuillez nous contacter via notre{" "}
              <a
                href="/contact"
                style={{ color: "#667eea", textDecoration: "underline" }}
              >
                page de contact
              </a>
              .
            </p>
          </section>

          <div
            style={{
              marginTop: "40px",
              padding: "20px",
              background: "#e0e7ff",
              borderRadius: "10px",
            }}
          >
            <h3 style={{ color: "#667eea" }}>📧 Réclamations</h3>
            <p>
              Si vous estimez que vos droits ne sont pas respectés, vous avez le
              droit de déposer une réclamation auprès de la Commission Nationale
              de l'Informatique et des Libertés (CNIL) en France ou de
              l'autorité de protection des données de votre pays.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
