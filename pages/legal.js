import Layout from '../components/Layout'
import Link from 'next/link'

export default function Legal() {
  return (
    <Layout>
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        padding: '4rem 2rem'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          background: 'white',
          borderRadius: '30px',
          padding: '3rem',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
        }}>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: '900',
            marginBottom: '1rem',
            color: '#1e293b'
          }}>
            Conditions Générales d'Utilisation
          </h1>
          
          <p style={{ color: '#64748b', marginBottom: '2rem' }}>
            Dernière mise à jour : 12 décembre 2024
          </p>

          <div style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#334155' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: '700', marginTop: '2rem', color: '#1e293b' }}>
              1. Objet
            </h2>
            <p>
              Les présentes Conditions Générales d'Utilisation (CGU) régissent l'utilisation du site 
              <strong> REUSSITESS®971</strong> exploité par Porinus, auto-entrepreneur basé en Guadeloupe.
            </p>

            <h2 style={{ fontSize: '2rem', fontWeight: '700', marginTop: '2rem', color: '#1e293b' }}>
              2. Services Proposés
            </h2>
            <p>REUSSITESS®971 propose les services suivants :</p>
            <ul style={{ marginLeft: '2rem' }}>
              <li>Accès à une bibliothèque culturelle francophone mondiale</li>
              <li>25 quiz éducatifs thématiques</li>
              <li>Liens affiliés Amazon vers 26 boutiques internationales</li>
              <li>Informations sur le projet IA Passport Mondial</li>
              <li>Contenus éducatifs et culturels gratuits</li>
            </ul>

            <h2 style={{ fontSize: '2rem', fontWeight: '700', marginTop: '2rem', color: '#1e293b' }}>
              3. Affiliation Amazon
            </h2>
            <p>
              REUSSITESS®971 participe au <strong>Programme Partenaires Amazon</strong>. En tant qu'Affilié Amazon, 
              nous réalisons un bénéfice sur les achats qualifiés via nos liens affiliés. 
              Cela n'entraîne aucun coût supplémentaire pour l'acheteur.
            </p>

            <h2 style={{ fontSize: '2rem', fontWeight: '700', marginTop: '2rem', color: '#1e293b' }}>
              4. Propriété Intellectuelle
            </h2>
            <p>
              Tous les contenus présents sur REUSSITESS®971 (textes, images, logos, quiz) sont protégés par 
              le droit d'auteur et appartiennent à Porinus ou à leurs auteurs respectifs.
            </p>
            <p>
              <strong>Marque déposée :</strong> REUSSITESS® et REUSSITESS®971 sont des marques protégées.
            </p>

            <h2 style={{ fontSize: '2rem', fontWeight: '700', marginTop: '2rem', color: '#1e293b' }}>
              5. Utilisation du Site
            </h2>
            <p>L'utilisateur s'engage à :</p>
            <ul style={{ marginLeft: '2rem' }}>
              <li>Utiliser le site de manière légale et respectueuse</li>
              <li>Ne pas tenter de pirater ou nuire au fonctionnement du site</li>
              <li>Respecter les droits de propriété intellectuelle</li>
              <li>Ne pas reproduire les contenus sans autorisation</li>
            </ul>

            <h2 style={{ fontSize: '2rem', fontWeight: '700', marginTop: '2rem', color: '#1e293b' }}>
              6. Données Personnelles
            </h2>
            <p>
              Consultez notre <Link href="/politique-confidentialite" style={{ color: '#667eea', fontWeight: 'bold' }}>
              Politique de Confidentialité</Link> pour en savoir plus sur la collecte et le traitement de vos données.
            </p>

            <h2 style={{ fontSize: '2rem', fontWeight: '700', marginTop: '2rem', color: '#1e293b' }}>
              7. Limitation de Responsabilité
            </h2>
            <p>
              REUSSITESS®971 met tout en œuvre pour fournir des informations exactes, mais ne peut garantir 
              l'exactitude absolue des contenus. L'utilisation du site se fait aux risques de l'utilisateur.
            </p>

            <h2 style={{ fontSize: '2rem', fontWeight: '700', marginTop: '2rem', color: '#1e293b' }}>
              8. Modification des CGU
            </h2>
            <p>
              Nous nous réservons le droit de modifier ces CGU à tout moment. Les modifications prennent 
              effet dès leur publication sur le site.
            </p>

            <h2 style={{ fontSize: '2rem', fontWeight: '700', marginTop: '2rem', color: '#1e293b' }}>
              9. Droit Applicable
            </h2>
            <p>
              Les présentes CGU sont régies par le droit français. Tout litige sera soumis aux tribunaux 
              compétents de Guadeloupe (971).
            </p>

            <h2 style={{ fontSize: '2rem', fontWeight: '700', marginTop: '2rem', color: '#1e293b' }}>
              10. Contact
            </h2>
            <p>
              Pour toute question : <Link href="/contact" style={{ color: '#667eea', fontWeight: 'bold' }}>
              Formulaire de contact</Link>
            </p>

            <div style={{ marginTop: '3rem', textAlign: 'center' }}>
              <Link href="/" style={{
                display: 'inline-block',
                padding: '1rem 2rem',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                borderRadius: '50px',
                textDecoration: 'none',
                fontWeight: 'bold'
              }}>
                ← Retour à l'accueil
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
