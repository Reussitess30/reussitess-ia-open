/* © Reussitess®971 INPI DSO2026012614 PORINUS Rony 2026 */
import Layout from "../components/Layout";
export default function MentionsLegales() {
  return (
    <Layout>
      <section className="section bg-white">
        <div className="container">
          <h1>📜 Mentions légales et confidentialité</h1>
          <div className="card legal-section mt-8">
            <h3 style={{ color: "#764ba2", marginBottom: "12px" }}>
              Identité de l’éditeur
            </h3>
            <ul
              style={{
                fontSize: "1.05rem",
                opacity: 0.85,
                listStyle: "none",
                paddingLeft: 0,
              }}
            >
              <li>
                <strong>SIRET :</strong> 44469979700031
              </li>
              <li>
                <strong>Nom :</strong> Porinus Rony Roger
              </li>
              <li>
                <strong>Adresse :</strong> 40 résidence les Monbins, 97113
                Gourbeyre, Guadeloupe, France
              </li>
            </ul>
          </div>
          <div className="card legal-section mt-8">
            <h3 style={{ color: "#764ba2", marginBottom: "12px" }}>
              Affiliation Amazon
            </h3>
            <p style={{ fontSize: "1rem", opacity: 0.85 }}>
              Reussitess® REUSSITESS®NEURO-X participe au Programme Partenaires Amazon
              EU. En tant que Partenaire Amazon, nous réalisons un bénéfice sur
              les achats remplissant les conditions requises.
            </p>
          </div>
          <div className="text-center mt-8">
            <p className="text-sm text-gray-600">
              📝 Dernière mise à jour: {new Date().toLocaleDateString("fr-FR")}
            </p>
            <p style={{ fontWeight: "bold", marginTop: "7px" }}>
              © Reussitess30
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
