/* © Reussitess®971 INPI DSO2026012614 PORINUS Rony 2026 */
import React from "react";
import Head from "next/head";
import Link from "next/link";

const Page = () => {
  return (
    <>
      <Head>
        <title>Saint-Barthélemy | Bibliothèque REUSSITESS®</title>
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-white">
        <div className="bg-gradient-to-r from-rose-600 to-rose-800 text-white py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-4 mb-6">
              <Link
                href="/"
                className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition"
              >
                🏠 Accueil
              </Link>
              <Link
                href="/bibliotheque"
                className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition"
              >
                ← Bibliothèque
              </Link>
            </div>
            <div className="flex items-center gap-6 mb-6">
              <span className="text-9xl">🇧🇱</span>
              <div>
                <h1 className="text-6xl font-bold mb-2">Saint-Barthélemy</h1>
                <p className="text-2xl">St-Barth • Perle des Antilles</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold mb-6 text-rose-600">
              🏛️ Informations Générales
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="font-bold text-gray-700 mb-2">Capitale</p>
                <p className="text-xl">Gustavia</p>
              </div>
              <div>
                <p className="font-bold text-gray-700 mb-2">Population</p>
                <p className="text-xl">~10,000 habitants</p>
              </div>
              <div>
                <p className="font-bold text-gray-700 mb-2">Superficie</p>
                <p className="text-xl">25 km²</p>
              </div>
              <div>
                <p className="font-bold text-gray-700 mb-2">Langues</p>
                <p className="text-xl">Français</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold mb-6 text-rose-600">
              🎭 Culture
            </h2>
            <p className="text-lg leading-relaxed">
              Perle des Antilles au charme discret raffiné. Héritage suédois
              unique (1784-1878), luxe élégant préservé, traditions locales
              vivaces, identité forte préservée jalousement.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold mb-6 text-rose-600">
              🏛️ Patrimoine
            </h2>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="text-2xl">⭐</span>
                <div>
                  <h3 className="font-bold text-xl mb-1">
                    Architecture coloniale suédoise - Gustavia port franc,
                    bâtiments historiques rouges caractéristiques
                  </h3>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">⭐</span>
                <div>
                  <h3 className="font-bold text-xl mb-1">
                    Forts historiques Oscar, Karl, Gustav - Vestiges
                    fortifications suédoises, points vue panoramiques
                  </h3>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">⭐</span>
                <div>
                  <h3 className="font-bold text-xl mb-1">
                    Patrimoine maritime voile - Régate internationale
                    Saint-Barth, tradition nautique ancrée, yachting prestige
                  </h3>
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold mb-6 text-rose-600">
              💡 Savoir & Innovation
            </h2>
            <p className="text-lg leading-relaxed">
              Nautisme de prestige international, gastronomie française raffinée
              étoilée, préservation environnementale stricte (interdiction
              constructions hautes), histoire suédoise coloniale unique
              Caraïbes.
            </p>
          </div>

          <div className="bg-gradient-to-r from-rose-600 to-rose-800 rounded-2xl shadow-xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-6">
              🛍️ Découvrir les Produits
            </h2>
            <p className="text-lg mb-6">
              Explorez notre sélection de produits en lien avec Saint-Barthélemy
            </p>
            <a
              href="https://reussitess.fr/"
              className="bg-white text-rose-600 px-6 py-3 rounded-xl font-bold hover:scale-105 transition-all inline-block"
            >
              Voir les boutiques
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
