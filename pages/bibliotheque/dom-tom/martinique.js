/* © Reussitess®971 INPI DSO2026012614 PORINUS Rony 2026 */
import React from "react";
import Head from "next/head";
import Link from "next/link";

const Page = () => {
  return (
    <>
      <Head>
        <title>Martinique | Bibliothèque REUSSITESS®</title>
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
        <div className="bg-gradient-to-r from-orange-600 to-orange-800 text-white py-16 px-4">
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
              <span className="text-9xl">🇲🇶</span>
              <div>
                <h1 className="text-6xl font-bold mb-2">Martinique</h1>
                <p className="text-2xl">Île aux Fleurs • Antilles</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold mb-6 text-orange-600">
              🏛️ Informations Générales
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="font-bold text-gray-700 mb-2">Capitale</p>
                <p className="text-xl">Fort-de-France</p>
              </div>
              <div>
                <p className="font-bold text-gray-700 mb-2">Population</p>
                <p className="text-xl">~370,000 habitants</p>
              </div>
              <div>
                <p className="font-bold text-gray-700 mb-2">Superficie</p>
                <p className="text-xl">1,128 km²</p>
              </div>
              <div>
                <p className="font-bold text-gray-700 mb-2">Langues</p>
                <p className="text-xl">Français, Créole martiniquais</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold mb-6 text-orange-600">
              🎭 Culture
            </h2>
            <p className="text-lg leading-relaxed">
              Île aux fleurs, berceau du zouk et de la béguine. Héritage
              littéraire d'Aimé Césaire (négritude), culture créole riche,
              traditions antillaises authentiques.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold mb-6 text-orange-600">
              🏛️ Patrimoine
            </h2>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="text-2xl">⭐</span>
                <div>
                  <h3 className="font-bold text-xl mb-1">
                    Montagne Pelée - Volcan historique 1,397m, éruption
                    dévastatrice de 1902, randonnées volcaniques
                  </h3>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">⭐</span>
                <div>
                  <h3 className="font-bold text-xl mb-1">
                    Habitation Clément - Patrimoine rhum agricole, architecture
                    coloniale créole, jardins botaniques
                  </h3>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">⭐</span>
                <div>
                  <h3 className="font-bold text-xl mb-1">
                    Bibliothèque Schœlcher - Architecture néo-byzantine unique,
                    patrimoine culturel, collections historiques
                  </h3>
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold mb-6 text-orange-600">
              💡 Savoir & Innovation
            </h2>
            <p className="text-lg leading-relaxed">
              Aimé Césaire fondateur négritude, rhum agricole AOC mondialement
              reconnu, volcanologie historique, littérature créole, botanique
              tropicale, musique zouk et béguine.
            </p>
          </div>

          <div className="bg-gradient-to-r from-orange-600 to-orange-800 rounded-2xl shadow-xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-6">
              🛍️ Découvrir les Produits
            </h2>
            <p className="text-lg mb-6">
              Explorez notre sélection de produits en lien avec Martinique
            </p>
            <a
              href="https://reussitess.fr/"
              className="bg-white text-orange-600 px-6 py-3 rounded-xl font-bold hover:scale-105 transition-all inline-block"
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
