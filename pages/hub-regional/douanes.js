import Head from "next/head";
import Link from "next/link";
import Layout from "../../components/Layout";

export default function Douanes() {
  return (
    <Layout>
      <Head>
        <title>Douanes & Logistique — REUSSITESS</title>
      </Head>

      <div style={{ padding: "2rem", maxWidth: 960, margin: "0 auto" }}>
        <h1>Douanes & Logistique — Checklist complète</h1>

        <p>Guide pratique pour expédier vers et depuis les DOM-TOM (Martinique, Guadeloupe, Guyane, Reunion, Mayotte).</p>

        <h2>Documents essentiels</h2>
        <ul>
          <li><strong>Facture commerciale</strong>: valeur, description claire des marchandises, conditions de vente (Incoterm).</li>
          <li><strong>Declaration d'export / declaration d'origine</strong>: code pays, preuve d'origine si necessaire.</li>
          <li><strong>Certificats</strong>: sanitaire, phytosanitaire, conformite produit selon categorie.</li>
          <li><strong>Documents transport</strong>: lettre de transport aerien / connaissement, manifeste logistique.</li>
        </ul>

        <h2>Etapes pre-expedition</h2>
        <ol>
          <li>Verifier la classification tarifaire (HS code) et restrictions pour le territoire cible.</li>
          <li>Calculer droits et taxes estimes et prevoir marge pour le dedouanement.</li>
          <li>Verifier exigences d'etiquetage (langue, mentions legales locales, composition).</li>
          <li>Choisir emballage adapte a l'acheminement (proteger contre humidite).</li>
          <li>Preparer documentation electronique si necessaire pour transporteurs / douanes.</li>
        </ol>

        <h2>Transporteurs et options</h2>
        <p>Comparer offres: couts, delais, assurance, et experience DOM-TOM. Options: fret groupe, full container/pallet, FBA vs cross-border.</p>

        <h2>Checklist rapide avant envoi</h2>
        <ul>
          <li>HS code verifie</li>
          <li>Facture commerciale complete</li>
          <li>Certificats requis identifiés</li>
          <li>Etiquetage & notices en langue requise</li>
          <li>Transporteur contacte & creneaux confirmes</li>
          <li>Assurance marchandise (si applicable)</li>
        </ul>

        <h2>Scenarios pratiques</h2>
        <p><strong>Petit e-shop</strong>: privilegier solutions groupees / prestataires locaux pour stockage et preparation des commandes.</p>
        <p><strong>Marque avec volume</strong>: negocier palettes / conteneurs et externaliser le fulfillment (FBA local ou 3PL).</p>

        <p style={{ marginTop: 16 }}>
          <Link href="/hub-regional"><a>← Retour Hub Regional</a></Link>
        </p>
      </div>
    </Layout>
  );
}
