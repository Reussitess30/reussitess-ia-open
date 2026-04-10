/* © Reussitess®971 INPI DSO2026012614 PORINUS Rony 2026 */
import React from "react";
import Head from "next/head";
import Link from "next/link";

const Inde = () => {
  return (
    <>
      <Head>
        <title>Inde | Bibliothèque REUSSITESS®</title>
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
        <div className="bg-gradient-to-r from-orange-600 to-yellow-600 text-white py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-4 mb-6">
              <Link
                href="/"
                className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg"
              >
                🏠 Accueil
              </Link>
              <Link
                href="/bibliotheque"
                className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg"
              >
                ← Bibliothèque
              </Link>
            </div>
            <div className="flex items-center gap-6">
              <span className="text-9xl">🇮🇳</span>
              <div>
                <h1 className="text-6xl font-bold mb-2">Inde</h1>
                <p className="text-2xl">Bharat</p>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold mb-6 text-orange-600">
              🏛️ Informations
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="font-bold mb-2">Capitale</p>
                <p className="text-xl">New Delhi</p>
              </div>
              <div>
                <p className="font-bold mb-2">Population</p>
                <p className="text-xl">~1.4 milliards</p>
              </div>
              <div>
                <p className="font-bold mb-2">Superficie</p>
                <p className="text-xl">3,287,263 km²</p>
              </div>
              <div>
                <p className="font-bold mb-2">Langues</p>
                <p className="text-xl">Hindi, Anglais, 22 langues</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold mb-6 text-yellow-600">
              🎭 Culture
            </h2>
            <p className="text-lg">
              Berceau civilisations millénaires Indus, spiritualités
              (hindouisme, bouddhisme, jaïnisme), Bollywood production massive
              films, yoga méditation diffusés mondialement, cuisine épicée
              variée.
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold mb-6 text-orange-600">
              🏛️ Patrimoine
            </h2>
            <ul className="space-y-3">
              <li className="flex gap-3">
                <span className="text-2xl">🕌</span>
                <div>
                  <h3 className="font-bold text-xl">Taj Mahal UNESCO Agra</h3>
                  <p>Symbole amour éternel marbre blanc</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-2xl">🛕</span>
                <div>
                  <h3 className="font-bold text-xl">
                    Temples Khajuraho UNESCO
                  </h3>
                  <p>Sculptures érotiques tantriques raffinées</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-2xl">🕉️</span>
                <div>
                  <h3 className="font-bold text-xl">
                    Gange Fleuve Sacré Varanasi
                  </h3>
                  <p>Rituels ablutions purification ghats</p>
                </div>
              </li>
            </ul>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold mb-6 text-yellow-600">
              💡 Savoir
            </h2>
            <p className="text-lg">
              Yoga méditation ayurveda UNESCO, industrie pharmaceutique
              génériques, technologies information Bangalore Silicon Valley,
              Bollywood films, démographie jeune dynamique 1.4 milliards.
            </p>
          </div>
          <div className="bg-gradient-to-r from-orange-600 to-yellow-600 rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">🛍️ Découvrir</h2>
            <a
              href="https://reussitess.fr/"
              className="bg-white text-orange-600 px-6 py-3 rounded-xl font-bold inline-block hover:scale-105 transition"
            >
              Boutiques
            </a>
          </div>
        </div>
      </div>
    </>
  );
};
export default Inde;
