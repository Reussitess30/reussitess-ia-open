import Layout from "../components/Layout";
import Link from "next/link";

export default function Boutiques() {
  const translations = {
    "🇺🇸": {
      btn: "Visit the Store",
      disclaimer: "As an affiliate, I earn commissions on certain products",
    },
    "🇬🇧": {
      btn: "Visit the Store",
      disclaimer: "As an affiliate, I earn commissions on certain products",
    },
    "🇦🇺": {
      btn: "Visit the Store",
      disclaimer: "As an affiliate, I earn commissions on certain products",
    },
    "🇮🇳": {
      btn: "Visit the Store",
      disclaimer: "As an affiliate, I earn commissions on certain products",
    },
    "🇸🇬": {
      btn: "Visit the Store",
      disclaimer: "As an affiliate, I earn commissions on certain products",
    },
    "🇫🇷": {
      btn: "Visiter la Boutique",
      disclaimer:
        "En tant qu'affiliée, je gagne des commissions sur certains produits",
    },
    "🇧🇪": {
      btn: "Visiter la Boutique",
      disclaimer:
        "En tant qu'affiliée, je gagne des commissions sur certains produits",
    },
    "🇮🇹": {
      btn: "Visita il Negozio",
      disclaimer: "Come affiliata, guadagno commissioni su alcuni prodotti",
    },
    "🇪🇸": {
      btn: "Visitar la Tienda",
      disclaimer: "Como afiliada, gano comisiones en ciertos productos",
    },
    "🇩🇪": {
      btn: "Shop Besuchen",
      disclaimer: "Als Partner verdiene ich an qualifizierten Käufen",
    },
    "🇳🇱": {
      btn: "Bezoek de Winkel",
      disclaimer: "Als partner verdien ik commissie op bepaalde producten",
    },
    "🇸🇪": {
      btn: "Besök Butiken",
      disclaimer: "Som partner tjänar jag provision på vissa produkter",
    },
    "🇨🇦": {
      btn: "Visit the Store",
      disclaimer: "As an affiliate, I earn commissions on certain products",
    },
    "🇧🇷": {
      btn: "Visite a Loja",
      disclaimer: "Como afiliada, ganho comissões em certos produtos",
    },
  };

  const boutiques = [
    {
      flag: "🇺🇸",
      nom: "États-Unis",
      type: "Personnel",
      lien: "https://www.amazon.com/shop/amourguadeloupe",
    },
    {
      flag: "🇮🇹",
      nom: "Italie",
      type: "Personnel",
      lien: "https://www.amazon.it/shop/amourguadeloupe",
    },
    {
      flag: "🇫🇷",
      nom: "France",
      type: "Personnel",
      lien: "https://www.amazon.fr/shop/amourguadeloupe",
    },
    {
      flag: "🇪🇸",
      nom: "Espagne",
      type: "Personnel",
      lien: "https://www.amazon.es/shop/amourguadeloupe",
    },
    {
      flag: "🇩🇪",
      nom: "Allemagne",
      type: "Personnel",
      lien: "https://www.amazon.de/shop/amourguadeloupe",
    },
    {
      flag: "🇨🇦",
      nom: "Canada",
      type: "Personnel",
      lien: "https://www.amazon.ca/shop/amourguadeloupe",
    },
    {
      flag: "🇮🇳",
      nom: "Inde",
      type: "Personnel",
      lien: "https://www.amazon.in/shop/amourguadeloupe",
    },
    {
      flag: "🇳🇱",
      nom: "Pays-Bas",
      type: "Personnel",
      lien: "https://www.amazon.nl/shop/amourguadeloupe",
    },
    {
      flag: "🇸🇪",
      nom: "Suède",
      type: "Personnel",
      lien: "https://www.amazon.se/shop/amourguadeloupe",
    },
    {
      flag: "🇸🇬",
      nom: "Singapour",
      type: "Personnel",
      lien: "https://www.amazon.sg/shop/amourguadeloupe",
    },
    {
      flag: "🇬🇧",
      nom: "Royaume-Uni",
      type: "Personnel",
      lien: "https://www.amazon.co.uk/shop/amourguadeloupe",
    },
    {
      flag: "🇦🇺",
      nom: "Australie",
      type: "Personnel",
      lien: "https://www.amazon.com.au/shop/amourguadeloupe",
    },
    {
      flag: "🇧🇪",
      nom: "Belgique",
      type: "Personnel",
      lien: "https://www.amazon.com.be/shop/amourguadeloupe",
    },
    {
      flag: "🇧🇷",
      nom: "Brésil",
      type: "Personnel",
      lien: "https://www.amazon.com.br/shop/amourguadeloupe",
    },
    {
      flag: "🇦🇺",
      nom: "Australie",
      type: "Influenceur",
      lien: "https://www.amazon.com.au/shop/influencer-fb942837",
    },
    {
      flag: "🇺🇸",
      nom: "États-Unis",
      type: "Influenceur",
      lien: "https://www.amazon.com/shop/influencer-fb942837",
    },
    {
      flag: "🇬🇧",
      nom: "Royaume-Uni",
      type: "Influenceur",
      lien: "https://www.amazon.co.uk/shop/influencer-fb942837",
    },
    {
      flag: "🇮🇳",
      nom: "Inde",
      type: "Influenceur",
      lien: "https://www.amazon.in/shop/influencer-fb942837",
    },
    {
      flag: "🇸🇪",
      nom: "Suède",
      type: "Influenceur",
      lien: "https://www.amazon.se/shop/influencer-fb942837",
    },
    {
      flag: "🇸🇬",
      nom: "Singapour",
      type: "Influenceur",
      lien: "https://www.amazon.sg/shop/influencer-fb942837",
    },
    {
      flag: "🇧🇪",
      nom: "Belgique",
      type: "Influenceur",
      lien: "https://www.amazon.com.be/shop/influencer-fb942837",
    },
    {
      flag: "🇪🇸",
      nom: "Espagne",
      type: "Influenceur",
      lien: "https://www.amazon.es/shop/influencer-fb942837",
    },
    {
      flag: "🇩🇪",
      nom: "Allemagne",
      type: "Influenceur",
      lien: "https://www.amazon.de/shop/influencer-fb942837",
    },
    {
      flag: "🇨🇦",
      nom: "Canada",
      type: "Influenceur",
      lien: "https://www.amazon.ca/shop/influencer-fb942837",
    },
    {
      flag: "🇳🇱",
      nom: "Pays-Bas",
      type: "Influenceur",
      lien: "https://www.amazon.nl/shop/influencer-fb942837",
    },
    {
      flag: "🇮🇹",
      nom: "Italie",
      type: "Influenceur",
      lien: "https://www.amazon.it/shop/influencer-fb942837",
    },
  ];

  return (
    <Layout>
      <div
        style={{
          minHeight: "40vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "3rem 1rem",
        }}
      >
        <div style={{ textAlign: "center", color: "white" }}>
          <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🛍️</div>
          <h1
            style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: "800" }}
          >
            26 Boutiques Amazon
          </h1>
          <p style={{ fontSize: "1.2rem", marginTop: "1rem", opacity: 0.9 }}>
            14 Pays • 5 Continents
          </p>
        </div>
      </div>

      <div
        style={{
          background: "linear-gradient(180deg, #0f172a 0%, #1e293b 100%)",
          padding: "5rem 0",
        }}
      >
        <div
          style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 2rem" }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "2rem",
            }}
          >
            {boutiques.map((boutique, index) => (
              <div
                key={index}
                style={{
                  background: "rgba(255, 255, 255, 0.03)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "20px",
                  padding: "2rem",
                  transition: "all 0.3s ease",
                }}
                className="boutique-card"
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    marginBottom: "1.5rem",
                  }}
                >
                  <div style={{ fontSize: "3rem" }}>{boutique.flag}</div>
                  <div style={{ flex: 1 }}>
                    <h3
                      style={{
                        fontSize: "1.4rem",
                        fontWeight: "700",
                        color: "white",
                        marginBottom: "0.3rem",
                      }}
                    >
                      {boutique.nom}
                    </h3>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "0.3rem 0.8rem",
                        borderRadius: "20px",
                        fontSize: "0.8rem",
                        fontWeight: "600",
                        background:
                          boutique.type === "Personnel"
                            ? "linear-gradient(135deg, #3b82f6, #8b5cf6)"
                            : "linear-gradient(135deg, #10b981, #059669)",
                        color: "white",
                      }}
                    >
                      {boutique.type === "Personnel"
                        ? "👤 Personnel"
                        : "⭐ Influenceur"}
                    </span>
                  </div>
                </div>

                <a
                  href={boutique.lien}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "1rem",
                    background:
                      "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                    color: "white",
                    textAlign: "center",
                    borderRadius: "12px",
                    textDecoration: "none",
                    fontWeight: "600",
                    fontSize: "1rem",
                    transition: "all 0.3s ease",
                    marginBottom: "1rem",
                  }}
                  className="boutique-btn"
                >
                  {translations[boutique.flag]?.btn || "Visiter la Boutique"} →
                </a>

                <div
                  style={{
                    fontSize: "0.85rem",
                    color: "#94a3b8",
                    textAlign: "center",
                  }}
                >
                  #CommissionsGagnées — {translations[boutique.flag]?.disclaimer || "En tant que partenaire Amazon, je gagne des commissions sur les achats qualifiés."}
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: "4rem", textAlign: "center" }}>
            <Link
              href="/"
              style={{
                display: "inline-block",
                padding: "1rem 2.5rem",
                background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                color: "white",
                borderRadius: "50px",
                textDecoration: "none",
                fontSize: "1.1rem",
                fontWeight: "bold",
              }}
            >
              ← Retour aux Quiz
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .boutique-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.3);
        }
        .boutique-btn:hover {
          transform: scale(1.02);
          box-shadow: 0 8px 20px rgba(16, 185, 129, 0.4);
        }
      `}</style>
    </Layout>
  );
}
