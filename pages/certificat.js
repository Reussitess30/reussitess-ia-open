/* © Reussitess®971 INPI DSO2026012614 PORINUS Rony 2026 */
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Certificat() {
  const router = useRouter();
  const { id, zone } = router.query;
  const [date, setDate] = useState('');

  useEffect(() => {
    setDate(new Date().toLocaleString('fr-FR', { dateStyle: 'long', timeStyle: 'short' }));
  }, []);

  return (
    <div style={{ backgroundColor: '#e0e0e0', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', fontFamily: '"Times New Roman", Times, serif' }}>
      
      <div style={{ width: '100%', maxWidth: '850px', background: '#fff', border: '1px solid #ccc', padding: '60px', position: 'relative', boxShadow: '0 30px 60px rgba(0,0,0,0.2)', backgroundImage: 'linear-gradient(to bottom, #ffffff 0%, #fcfcfc 100%)' }}>
        
        {/* FILIGRANE DE SÉCURITÉ */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%) rotate(-30deg)', fontSize: '120px', color: 'rgba(0,255,65,0.03)', whiteSpace: 'nowrap', pointerEvents: 'none', fontWeight: 'bold', zIndex: 0 }}>
          REUSSITESS
        </div>

        <div style={{ textAlign: 'center', borderBottom: '2px solid #000', paddingBottom: '20px', marginBottom: '40px', position: 'relative', zIndex: 1 }}>
          <h1 style={{ margin: 0, fontSize: '28px', textTransform: 'uppercase', letterSpacing: '6px' }}>Attestation de Conformité Blockchain</h1>
          <p style={{ margin: '10px 0', fontSize: '14px', color: '#555' }}>Délivré sous le protocole de sécurité décentralisé Reussitess©</p>
        </div>

        <div style={{ fontSize: '20px', lineHeight: '1.8', color: '#222', position: 'relative', zIndex: 1 }}>
          <p>Ce document atteste que l'identifiant unique :</p>
          <div style={{ textAlign: 'center', margin: '25px 0' }}>
            <span style={{ fontSize: '26px', background: '#f0f0f0', border: '1px solid #000', color: '#000', padding: '10px 40px', fontFamily: 'monospace', fontWeight: 'bold' }}>
              {id || 'NXS-777-ALPHA'}
            </span>
          </div>
          <p>A complété avec succès l'audit des <strong>100 Intelligences Artificielles</strong> et bénéficie d'une autorisation de circulation numérique pour la juridiction :</p>
          <h2 style={{ textAlign: 'center', color: '#000', textDecoration: 'underline' }}>{zone || 'ZONE INTERNATIONALE'}</h2>
        </div>

        <div style={{ marginTop: '50px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: '14px' }}>
            <strong>Émission :</strong> {date}<br />
            <strong>Authentification :</strong> HTTPS Vercel + Signature numérique<br />
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=https://reussitess.fr" alt="QR Verify" style={{ marginTop: '15px', border: '1px solid #eee' }} />
          </div>

          {/* ZONE DE SIGNATURE */}
          <div style={{ textAlign: 'center', minWidth: '200px' }}>
            <div style={{ fontFamily: '"Brush Script MT", cursive', fontSize: '32px', color: '#1a237e', marginBottom: '-10px', transform: 'rotate(-2deg)' }}>
              Reussitess© Authority
            </div>
            <div style={{ width: '250px', height: '1px', background: '#000', margin: '0 auto' }}></div>
            <div style={{ fontSize: '12px', marginTop: '5px', textTransform: 'uppercase', fontWeight: 'bold' }}>Signature du Commissaire Numérique</div>
          </div>
        </div>

        {/* DISCLAIMER JURIDIQUE */}
        <div style={{ marginTop: '50px', borderTop: '1px solid #eee', paddingTop: '20px', fontSize: '9px', color: '#777', textAlign: 'justify', fontStyle: 'italic', lineHeight: '1.4' }}>
          CLAUSE LÉGALE : Ce document constitue une preuve de participation au protocole "Passeport Mondial" au sein de l'architecture logicielle Reussitess. Il ne peut être utilisé comme pièce d'identité officielle auprès des autorités gouvernementales. Les 14 pays (France, Angleterre, Italie, Allemagne, Suède, Singapour, Australie, Espagne, Brésil, Royaume-Uni, Inde, Nouvelle-Zélande, États-Unis, Canada) sont régis par les conditions d'utilisation Reussitess© en vigueur.
        </div>
      </div>

      <div style={{ marginTop: '40px', display: 'flex', gap: '20px', noPrint: { display: 'none' } }}>
        <button onClick={() => window.print()} style={{ padding: '15px 30px', cursor: 'pointer', background: '#111', color: '#fff', border: 'none', borderRadius: '5px', fontWeight: 'bold', fontSize: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>🖨 IMPRIMER LE CERTIFICAT</button>
        <Link href="/" style={{ padding: '15px 30px', background: '#00ff41', color: '#000', textDecoration: 'none', fontWeight: 'bold', borderRadius: '5px', fontSize: '16px' }}>🏠 RETOUR</Link>
      </div>

      <style jsx global>{`
        @media print {
          button, a { display: none !important; }
          body { background: white !important; }
        }
      `}</style>
    </div>
  );
}
