/* © Reussitess®971 INPI DSO2026012614 PORINUS Rony 2026 */
import Layout from "../../../components/Layout";

export default function NouvelleZelande() {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-8xl mb-4">🇳🇿</div>
            <h1 className="text-5xl font-bold text-blue-900 mb-4">
              Nouvelle-Zélande
            </h1>
            <div className="flex justify-center gap-8 text-lg flex-wrap">
              <div>
                <span className="font-semibold">Capitale:</span> Wellington
              </div>
              <div>
                <span className="font-semibold">Population:</span> 5.1 millions
              </div>
              <div>
                <span className="font-semibold">Langues:</span> Anglais, Maori
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-3xl font-bold text-blue-800 mb-6">
              🏛 Patrimoine UNESCO (3 sites)
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-xl">
                <h3 className="font-bold text-blue-900 mb-2">
                  🏔 Milford Sound Fjords
                </h3>
                <p className="text-gray-700">
                  Paysages glaciaires île Sud. Fiordland cascades 160m, dauphins
                  manchots, Mitre Peak 1,692m
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-xl">
                <h3 className="font-bold text-blue-900 mb-2">
                  🌋 Tongariro National Park
                </h3>
                <p className="text-gray-700">
                  Parc volcanique double patrimoine. Mont Ngauruhoe Seigneur
                  Anneaux, lacs émeraude Red Crater
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-xl">
                <h3 className="font-bold text-blue-900 mb-2">
                  🎭 Culture Maori
                </h3>
                <p className="text-gray-700">
                  Peuple autochtone 13e siècle. Haka All Blacks, tatouage moko,
                  marae sacrés, langue officielle
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-xl">
                <h3 className="font-bold text-blue-900 mb-2">🐦 Kiwi Oiseau</h3>
                <p className="text-gray-700">
                  Emblème national nocturne endémique. Symbole néo-zélandais,
                  faune unique isolée
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-3xl font-bold text-green-800 mb-6">
              🌟 Pionniers Mondiaux
            </h2>
            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-xl">
                <h3 className="font-bold text-green-900 mb-2">
                  🗳 1er Vote Femmes 1893
                </h3>
                <p className="text-gray-700">
                  Premier pays suffrage féminin universel. Kate Sheppard
                  militante, égalité genre pionnière
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-xl">
                <h3 className="font-bold text-green-900 mb-2">
                  🎬 Cinéma Weta Workshop
                </h3>
                <p className="text-gray-700">
                  Peter Jackson Wellington. Seigneur Anneaux Hobbit 17 Oscars,
                  Weta effets Avatar
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-xl">
                <h3 className="font-bold text-green-900 mb-2">
                  🏉 All Blacks Légende
                </h3>
                <p className="text-gray-700">
                  Meilleure équipe rugby 77% victoires. Haka Ka Mate
                  intimidation, 3 Coupes Monde
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-3xl font-bold text-purple-800 mb-6">
              💼 Innovation & Nature
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-purple-50 p-4 rounded-xl">
                <h3 className="font-bold text-purple-900">🥝 Agriculture</h3>
                <p className="text-gray-700">
                  Kiwi fruit agneau laitiers export qualité mondiale
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-xl">
                <h3 className="font-bold text-purple-900">
                  🪂 Sports Extrêmes
                </h3>
                <p className="text-gray-700">
                  Bungy Queenstown jetboat parapente capitale aventure
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-xl">
                <h3 className="font-bold text-purple-900">
                  🌿 Nature Préservée
                </h3>
                <p className="text-gray-700">
                  Parcs nationaux 100% Pure campagne marketing succès
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-xl">
                <h3 className="font-bold text-purple-900">🌋 Hobbiton</h3>
                <p className="text-gray-700">
                  Décors Shire préservés Matamata tourisme cinéma
                </p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <a
              href="/bibliotheque"
              className="inline-block bg-gradient-to-r from-blue-600 to-green-600 text-white px-8 py-4 rounded-xl font-bold hover:scale-105 transition text-lg shadow-xl"
            >
              ← Retour Bibliothèque
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
}
