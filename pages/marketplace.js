import { useState } from 'react'
import Layout from '../components/Layout'
import Link from 'next/link'

const PRODUITS = [
  { id: 1, nom: "Rhum Agricole Guadeloupe", vendeur: "Distillerie Bologne", pays: "Guadeloupe 🇬🇵", prix: "35€", categorie: "Spiritueux", emoji: "🥃", desc: "Rhum agricole AOC Guadeloupe, vieilli 3 ans en fût de chêne.", contact: "www.amazon.fr/s?k=rhum+guadeloupe&tag=fb942837-21" },
  { id: 2, nom: "Madras Traditionnel", vendeur: "Atelier Créole", pays: "Martinique 🇲🇶", prix: "45€", categorie: "Artisanat", emoji: "🧣", desc: "Tissu madras authentique, couleurs traditionnelles antillaises.", contact: "www.amazon.fr/s?k=madras+antilles&tag=fb942837-21" },
  { id: 3, nom: "Épices Créoles Bio", vendeur: "Jardin des Antilles", pays: "Guadeloupe 🇬🇵", prix: "18€", categorie: "Cuisine", emoji: "🌶️", desc: "Mélange d'épices créoles bio — bois d'inde, piment, colombo.", contact: "www.amazon.fr/s?k=epices+creoles&tag=fb942837-21" },
  { id: 4, nom: "Sculpture Bois Tropical", vendeur: "Artiste Créole", pays: "Guyane 🇬🇫", prix: "120€", categorie: "Art", emoji: "🗿", desc: "Sculpture en bois de lettré de Guyane, faite à la main.", contact: "contact@reussitess.fr" },
  { id: 5, nom: "Musique Gwoka CD", vendeur: "Studio 971", pays: "Guadeloupe 🇬🇵", prix: "15€", categorie: "Musique", emoji: "🎵", desc: "Album Gwoka traditionnel, patrimoine UNESCO, 12 titres.", contact: "studio971.fr" },
  { id: 6, nom: "Vanille Bourbon Réunion", vendeur: "Plantatation Réunion", pays: "Réunion 🇷🇪", prix: "28€", categorie: "Cuisine", emoji: "🌿", desc: "Vanille Bourbon de la Réunion, qualité premium, 10 gousses.", contact: "vanille-reunion.fr" },
  { id: 7, nom: "Huile Monoï Tahiti", vendeur: "Beauté Polynésie", pays: "Polynésie 🌺", prix: "22€", categorie: "Beauté", emoji: "🌺", desc: "Huile de monoï traditionnelle, macération de tiaré authentique.", contact: "www.amazon.fr/s?k=huile+monoi+tahiti&tag=fb942837-21" },
  { id: 8, nom: "Formation Business Digital", vendeur: "REUSSITESS Academy", pays: "Guadeloupe 🇬🇵", prix: "Gratuit", categorie: "Formation", emoji: "💼", desc: "Formation complète entrepreneuriat digital caribéen.", contact: "reussitess.fr/academie" },
]

const CATEGORIES = ['Tous', 'Artisanat', 'Cuisine', 'Art', 'Musique', 'Beauté', 'Spiritueux', 'Formation']

export default function Marketplace() {
  const [filtre, setFiltre] = useState('Tous')
  const [selected, setSelected] = useState(null)

  const produits = PRODUITS.filter(p => filtre === 'Tous' || p.categorie === filtre)

  return (
    <Layout>
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a, #1e293b)', padding: '2rem 1rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>🛒</div>
          <h1 style={{ color: '#fff', fontSize: 'clamp(1.8rem,5vw,3rem)', fontWeight: '900' }}>MARKETPLACE CARIBÉEN</h1>
          <p style={{ color: '#94a3b8' }}>Produits locaux afro-caribéens — Artisanat • Cuisine • Art • Culture</p>
          <p style={{ color: '#f59e0b', fontSize: '0.85rem', marginTop: '0.3rem' }}>🌴 Vendeurs locaux DOM-TOM • Économie solidaire caribéenne</p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setFiltre(c)}
              style={{ padding: '0.4rem 1rem', borderRadius: '20px', border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600',
                background: filtre === c ? 'linear-gradient(135deg,#f59e0b,#d97706)' : 'rgba(255,255,255,0.05)',
                color: filtre === c ? 'white' : '#94a3b8' }}>
              {c}
            </button>
          ))}
        </div>

        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '1rem' }}>
          {produits.map(p => (
            <div key={p.id} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '16px', padding: '1.5rem', cursor: 'pointer' }}
              onClick={() => setSelected(selected?.id === p.id ? null : p)}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{p.emoji}</div>
              <h3 style={{ color: '#e2e8f0', fontWeight: '700', marginBottom: '0.3rem' }}>{p.nom}</h3>
              <p style={{ color: '#f59e0b', fontSize: '0.8rem', marginBottom: '0.5rem' }}>{p.vendeur} • {p.pays}</p>
              <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginBottom: '1rem', lineHeight: '1.5' }}>{p.desc}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#10b981', fontWeight: '900', fontSize: '1.1rem' }}>{p.prix}</span>
                <span style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b', padding: '0.2rem 0.6rem', borderRadius: '8px', fontSize: '0.7rem' }}>{p.categorie}</span>
              </div>
              {selected?.id === p.id && (
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                  <a href={`https://${p.contact}`} target="_blank" rel="noreferrer"
                    style={{ display: 'block', textAlign: 'center', padding: '0.7rem', background: 'linear-gradient(135deg,#f59e0b,#d97706)', color: 'white', borderRadius: '10px', textDecoration: 'none', fontWeight: '700', fontSize: '0.85rem' }}>
                    🛒 Contacter le vendeur
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ maxWidth: '600px', margin: '3rem auto 0', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '20px', padding: '2rem', textAlign: 'center' }}>
          <h3 style={{ color: '#f59e0b', marginBottom: '0.5rem' }}>🏪 Tu vends des produits caribéens ?</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1rem' }}>Rejoins le marketplace REUSSITESS — visibilité mondiale, communauté engagée.</p>
          <a href="mailto:contact@reussitess.fr?subject=Référencement Marketplace"
            style={{ display: 'inline-block', padding: '0.7rem 1.5rem', background: 'linear-gradient(135deg,#f59e0b,#d97706)', color: 'white', borderRadius: '15px', textDecoration: 'none', fontWeight: '700' }}>
            📧 Rejoindre le Marketplace
          </a>
        </div>

        <div style={{ textAlign: 'center', marginTop: '2rem', color: '#475569', fontSize: '0.8rem' }}>
          <p>REUSSITESS®971 — Guadeloupe 🇬🇵 Boudoum !</p>
          <Link href="/" style={{ color: '#10b981', textDecoration: 'none' }}>← Retour</Link>
        </div>
      </div>
    </Layout>
  )
}
