"use client";

export default function ShareButtons() {
  const shareUrl = "https://www.reussitess.fr/investir-reuss";
  const shareText = "REUSSITESS®NEURO-X : L'IA prédictive qui révolutionne les 14 nations. Rejoignez le futur.";

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    alert("Lien copié dans le presse-papier !");
  };

  const socialButtons = [
    { name: "WhatsApp", color: "#25D366", url: `https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}` },
    { name: "Telegram", color: "#0088cc", url: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}` },
    { name: "LinkedIn", color: "#0077b5", url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}` },
    { name: "Facebook", color: "#1877f2", url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}` },
    { name: "X / Twitter", color: "#000000", url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}` }
  ];

  return (
    <div style={{ marginTop: "2.5rem", padding: "1.5rem", background: "rgba(255,255,255,0.02)", borderRadius: "20px", border: "1px solid #1e293b" }}>
      <p style={{ textAlign: "center", fontSize: "0.75rem", color: "#94a3b8", marginBottom: "1rem", fontWeight: "bold" }}>PROPAGER LE PROJET DANS LES 14 PAYS :</p>
      
      <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
        {socialButtons.map((btn) => (
          <a key={btn.name} href={btn.url} target="_blank" rel="noopener noreferrer" 
             style={{ background: btn.color, color: "white", padding: "8px 15px", borderRadius: "8px", textDecoration: "none", fontSize: "0.7rem", fontWeight: "bold", transition: "transform 0.2s" }}>
            {btn.name}
          </a>
        ))}
      </div>

      <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap", marginTop: "10px" }}>
        {/* TikTok & Instagram (Lien vers application) */}
        <button onClick={() => alert("Ouvrez TikTok/Instagram et collez le lien dans votre Bio ou Story : " + shareUrl)} 
                style={{ background: "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)", color: "white", border: "none", padding: "8px 15px", borderRadius: "8px", cursor: "pointer", fontSize: "0.7rem", fontWeight: "bold" }}>
          Instagram / TikTok
        </button>
        <button onClick={copyLink} style={{ background: "#334155", color: "white", border: "none", padding: "8px 15px", borderRadius: "8px", cursor: "pointer", fontSize: "0.7rem", fontWeight: "bold" }}>
          Copier le lien direct
        </button>
      </div>
      
      <p style={{ textAlign: "center", fontSize: "0.6rem", color: "#64748b", marginTop: "1rem" }}>
        Cible : France, Belgique, Canada, USA, Allemagne, Italie, Suède, Singapour, Australie, Espagne, Brésil, Inde, NZ, UK.
      </p>
    </div>
  );
}
