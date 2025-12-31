"use client";
import Link from "next/link";

export default function Investir() {
  return (
    <div style={{ minHeight: "100vh", padding: "2rem", background: "#020617", color: "white", fontFamily: "sans-serif", display: "flex", flexDirection: "column", alignItems: "center" }}>
      
      <div style={{ maxWidth: "950px", width: "100%", background: "#0f172a", padding: "3rem", borderRadius: "30px", border: "1px solid #334155", boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}>
        
        <header style={{ textAlign: "center", marginBottom: "3rem", borderBottom: "1px solid #1e293b", paddingBottom: "2rem" }}>
          <h1 style={{ fontSize: "1.4rem", color: "#00ff41", fontWeight: "900", letterSpacing: "1px", margin: 0 }}>
            REUSSITESS®NEURO-X : L'IA PRÉDICTIVE SOUVERAINE DES 14 NATIONS
          </h1>
          <p style={{ color: "#ffd700", fontSize: "0.9rem", marginTop: "10px", fontWeight: "bold" }}>GUIDE OPÉRATIONNEL ET CONFORMITÉ JURIDIQUE</p>
        </header>

        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ color: "#00ff41", fontSize: "1.2rem", marginBottom: "1rem" }}>1. QU'EST-CE QUE LE PROJET NEURO-X ?</h2>
          <p style={{ lineHeight: "1.7", color: "#cbd5e1", textAlign: "justify" }}>
            Le projet <strong>REUSSITESS®NEURO-X</strong> est une infrastructure d'Intelligence Artificielle de troisième génération. Contrairement aux IA génératives classiques, NEURO-X fonctionne comme un <strong>Oracle de calcul de probabilités</strong>. 
            <br /><br />
            Il analyse en temps réel les données économiques, technologiques et sanitaires des 14 pays partenaires (France, Belgique, Canada, USA, etc.) pour identifier des cycles de croissance avant qu'ils ne deviennent publics. Le token REUSS est l'unique unité de compte permettant d'alimenter la puissance de calcul nécessaire à ces analyses.
          </p>
        </section>

        <section style={{ marginBottom: "3rem", background: "rgba(0,0,0,0.2)", padding: "2rem", borderRadius: "20px" }}>
          <h2 style={{ color: "#ffd700", fontSize: "1.2rem", marginBottom: "1rem" }}>2. COMMENT CONFIGURER VOTRE WALLET (Procédure Universelle)</h2>
          <p style={{ fontSize: "0.9rem", color: "#94a3b8", marginBottom: "1.5rem" }}>
            Pour détenir vos jetons REUSS sur n'importe quel portefeuille (MetaMask, TrustWallet, etc.), suivez ces étapes :
          </p>
          <ol style={{ lineHeight: "2", color: "#e2e8f0" }}>
            <li>Ouvrez votre application Wallet (Extension ou Mobile).</li>
            <li>Cliquez sur <strong>"Importer des jetons"</strong> ou <strong>"Ajouter un actif personnalisé"</strong>.</li>
            <li>Copiez et collez l'adresse officielle du contrat ci-dessous :</li>
          </ol>
          <div style={{ background: "#000", padding: "1rem", borderRadius: "10px", textAlign: "center", border: "1px solid #00ff41", margin: "1rem 0" }}>
            <code style={{ fontSize: "1rem", color: "#00ff41", fontWeight: "bold", wordBreak: "break-all" }}>0x4b3bFf4b58d22Ad363bb260e22032414d4CfdDB8</code>
          </div>
          <p style={{ fontSize: "0.8rem", color: "#64748b" }}>* Le symbole (REUSS) et les décimales (18) s'afficheront automatiquement.</p>
        </section>

        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ color: "#00ff41", fontSize: "1.2rem", marginBottom: "1rem" }}>3. DÉMARCHES POUR L'INVESTISSEUR</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
            <div style={{ borderLeft: "3px solid #00ff41", paddingLeft: "1rem" }}>
              <h4 style={{ margin: "0 0 10px 0" }}>Étape A : Éligibilité</h4>
              <p style={{ fontSize: "0.85rem", color: "#94a3b8" }}>Résider dans l'un des 14 pays autorisés et disposer d'un portefeuille compatible EVM (Ethereum/Polygon/BSC).</p>
            </div>
            <div style={{ borderLeft: "3px solid #00ff41", paddingLeft: "1rem" }}>
              <h4 style={{ margin: "0 0 10px 0" }}>Étape B : Acquisition</h4>
              <p style={{ fontSize: "0.85rem", color: "#94a3b8" }}>Les jetons sont distribués selon le calendrier de l'offre totale (1 000 000 000 unités).</p>
            </div>
          </div>
        </section>

        <footer style={{ borderTop: "1px solid #334155", paddingTop: "2rem", fontSize: "0.8rem", color: "#64748b", textAlign: "justify" }}>
          <p><strong>CADRE JURIDIQUE :</strong> Ce document ne constitue pas une offre publique de titres financiers. Le token REUSS est un jeton utilitaire. Conformément aux directives MiCA, les utilisateurs doivent s'assurer que leur juridiction autorise la détention d'actifs numériques. Le projet REUSSITESS®NEURO-X décline toute responsabilité en cas d'erreur de saisie lors de l'importation manuelle du contrat.</p>
          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <Link href="/" style={{ color: "#00ff41", textDecoration: "none", fontWeight: "bold" }}>← RETOUR AU PORTAIL REUSSITESS©</Link>
          </div>
        </footer>

      </div>
    </div>
  );
}
