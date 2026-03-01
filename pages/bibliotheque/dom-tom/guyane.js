import React from "react";
import Head from "next/head";
import Link from "next/link";

const Guyane = () => {
  return (
    <>
      <Head>
        <title>Guyane Française | Bibliothèque REUSSITESS®</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <Link
              href="/bibliotheque"
              className="text-white/80 hover:text-white mb-4 inline-block"
            >
              ← Retour à la bibliothèque
            </Link>
            <div className="flex items-center gap-6 mb-6">
              <span className="text-9xl">🇬🇫</span>
              <div>
                <h1 className="text-6xl font-bold mb-2">Guyane Française</h1>
                <p className="text-2xl">Région d'Outre-Mer • Amérique du Sud</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contenu */}
        <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
          {/* Infos générales */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold mb-6 text-green-600">
              🏛️ Informations Générales
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="font-bold text-gray-700 mb-2">Capitale</p>
                <p className="text-xl">Cayenne</p>
              </div>
              <div>
                <p className="font-bold text-gray-700 mb-2">Population</p>
                <p className="text-xl">~300,000 habitants</p>
              </div>
              <div>
                <p className="font-bold text-gray-700 mb-2">Superficie</p>
                <p className="text-xl">83,534 km²</p>
              </div>
              <div>
                <p className="font-bold text-gray-700 mb-2">Langues</p>
                <p className="text-xl">Français, Créole guyanais</p>
              </div>
            </div>
          </div>

          {/* Culture */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold mb-6 text-blue-600">
              🎭 Culture
            </h2>
            <p className="text-lg leading-relaxed mb-4">
              La Guyane est un territoire unique où se mêlent cultures créole,
              amérindienne, bushinengue, hmong et métropolitaine. Le Carnaval de
              Cayenne est l'un des plus longs au monde.
            </p>
            <p className="text-lg leading-relaxed">
              La diversité culturelle exceptionnelle fait de la Guyane un
              véritable melting-pot où cohabitent harmonieusement de nombreuses
              communautés.
            </p>
          </div>

          {/* Patrimoine */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold mb-6 text-purple-600">
              🏛️ Patrimoine
            </h2>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="text-2xl">🚀</span>
                <div>
                  <h3 className="font-bold text-xl mb-1">
                    Centre Spatial Guyanais (Kourou)
                  </h3>
                  <p>
                    Base de lancement de l'Agence Spatiale Européenne, symbole
                    de l'aventure spatiale
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">🏝️</span>
                <div>
                  <h3 className="font-bold text-xl mb-1">Îles du Salut</h3>
                  <p>Ancien bagne français, site historique majeur</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">🌳</span>
                <div>
                  <h3 className="font-bold text-xl mb-1">Forêt Amazonienne</h3>
                  <p>95% du territoire, biodiversité exceptionnelle</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">🎉</span>
                <div>
                  <h3 className="font-bold text-xl mb-1">
                    Carnaval de Cayenne
                  </h3>
                  <p>L'un des plus longs carnavals au monde (janvier à mars)</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Savoir & Innovation */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold mb-6 text-green-600">
              💡 Savoir & Innovation
            </h2>
            <div className="space-y-4">
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-bold text-xl mb-2">🚀 Conquête Spatiale</h3>
                <p>
                  Lanceurs Ariane, Soyouz, Vega - Porte de l'Europe vers
                  l'espace
                </p>
              </div>
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-bold text-xl mb-2">🌿 Biodiversité</h3>
                <p>
                  Plus de 5,500 espèces végétales, hotspot de biodiversité
                  mondiale
                </p>
              </div>
              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="font-bold text-xl mb-2">
                  🏛️ Cultures Amérindiennes
                </h3>
                <p>
                  6 peuples amérindiens préservant leurs traditions ancestrales
                </p>
              </div>
              <div className="border-l-4 border-pink-500 pl-4">
                <h3 className="font-bold text-xl mb-2">🔬 Recherche</h3>
                <p>Institut Pasteur, recherche tropicale, médecine</p>
              </div>
            </div>
          </div>

          {/* Produits Amazon */}
          <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl shadow-xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-6">
              🛍️ Découvrir les Produits
            </h2>
            <p className="text-lg mb-6">
              Explorez notre sélection de produits en lien avec la Guyane et
              l'Outre-Mer français
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.amazon.fr/shop/amourguadeloupe"
                className="bg-white text-green-600 px-6 py-3 rounded-xl font-bold hover:scale-105 transition-all"
              >
                🇫🇷 Boutique France
              </a>
              <a
                href="https://www.amazon.com/shop/amourguadeloupe"
                className="bg-white text-blue-600 px-6 py-3 rounded-xl font-bold hover:scale-105 transition-all"
              >
                🇺🇸 Boutique USA
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Guyane;
