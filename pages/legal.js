import Layout from '../components/Layout'

export default function LegalPage() {
  return (
    <Layout title="Mentions légales">
      <div style={{ padding: '4rem 2rem', maxWidth: '900px', margin: '0 auto', color: 'white' }}>
        <h1>Mentions légales & politique</h1>

        <h2>Éditeur du site</h2>
        <p>
          Ce site fait partie de l’écosystème REUSSITESS® GlobalNexus et présente les services,
          contenus pédagogiques et ressources e-commerce proposés au public.
        </p>

        <h2>Responsabilité</h2>
        <p>
          Les informations publiées sont fournies à titre informatif. Elles peuvent être mises à jour,
          modifiées ou retirées à tout moment pour garantir leur conformité et leur exactitude.
        </p>

        <h2>Affiliation Amazon</h2>
        <p>
          En tant que Partenaire Amazon, REUSSITESS® peut percevoir une commission sur les achats
          réalisés via les liens d’affiliation présents sur le site, sans surcoût pour l’utilisateur.
        </p>

        <h2>Données & confidentialité</h2>
        <p>
          Les données collectées via formulaires et outils d’analyse sont utilisées uniquement
          pour améliorer l’expérience utilisateur, conformément à la réglementation en vigueur.
        </p>
      </div>
    </Layout>
  )
}
