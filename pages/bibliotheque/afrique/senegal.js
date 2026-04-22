/* © Reussitess®971 INPI DSO2026012614 PORINUS Rony 2026 */
import React from "react";
import Head from "next/head";
import Link from "next/link";

const Page = () => {
  return (
    <>
      <Head>
        <title>Sénégal | Bibliothèque REUSSITESS®</title>
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-white">
        <div className="bg-gradient-to-r from-yellow-600 to-yellow-800 text-white py-16 px-4">
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
              <span className="text-9xl">🇸🇳</span>
              <div>
                <h1 className="text-6xl font-bold mb-2">Sénégal</h1>
                <p className="text-2xl">
                  Porte de l'Afrique • Afrique de l'Ouest
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold mb-6 text-yellow-600">
              🏛 Informations Générales
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="font-bold text-gray-700 mb-2">Capitale</p>
                <p className="text-xl">Dakar</p>
              </div>
              <div>
                <p className="font-bold text-gray-700 mb-2">Population</p>
                <p className="text-xl">~17 millions</p>
              </div>
              <div>
                <p className="font-bold text-gray-700 mb-2">Superficie</p>
                <p className="text-xl">196,722 km²</p>
              </div>
              <div>
                <p className="font-bold text-gray-700 mb-2">Langues</p>
                <p className="text-xl">Français, Wolof, Pulaar, Sérère</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold mb-6 text-yellow-600">
              🎭 Culture
            </h2>
            <p className="text-lg leading-relaxed">
              Berceau de la négritude (Léopold Sédar Senghor, premier président
              poète). Teranga (hospitalité légendaire), musique mbalax (Youssou
              N'Dour), culture wolof dominante, démocratie stable.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold mb-6 text-yellow-600">
              🏛 Patrimoine
            </h2>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="text-2xl">⭐</span>
                <div>
                  <h3 className="font-bold text-xl mb-1">
                    Île de Gorée UNESCO - Mémoire poignante de la traite
                    négrière atlantique, Maison des Esclaves
                  </h3>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">⭐</span>
                <div>
                  <h3 className="font-bold text-xl mb-1">
                    Lac Rose (Retba) - Lac salé aux eaux roses spectaculaires,
                    exploitation artisanale sel
                  </h3>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">⭐</span>
                <div>
                  <h3 className="font-bold text-xl mb-1">
                    Parc Niokolo-Koba UNESCO - Faune sauvage africaine
                    diversifiée, lions, éléphants, biodiversité
                  </h3>
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold mb-6 text-yellow-600">
              💡 Savoir & Innovation
            </h2>
            <p className="text-lg leading-relaxed">
              Littérature africaine rayonnante (Senghor, Mariama Bâ), démocratie
              stable modèle, musique mbalax mondiale, Festival International
              Jazz Saint-Louis réputé, lutte sénégalaise traditionnelle.
            </p>
          </div>

          <div className="bg-gradient-to-r from-yellow-600 to-yellow-800 rounded-2xl shadow-xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-6">
              🛍 Découvrir les Produits
            </h2>
            <p className="text-lg mb-6">
              Explorez notre sélection de produits en lien avec Sénégal
            </p>
            <a
              href="https://reussitess.fr/"
              className="bg-white text-yellow-600 px-6 py-3 rounded-xl font-bold hover:scale-105 transition-all inline-block"
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
