/* © Reussitess®971 INPI DSO2026012614 PORINUS Rony 2026 */
import Layout from "../../../components/Layout";

export default function Australie() {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-green-50 to-blue-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-8xl mb-4">🇦🇺</div>
            <h1 className="text-5xl font-bold text-yellow-900 mb-4">
              Australie
            </h1>
            <div className="flex justify-center gap-8 text-lg flex-wrap">
              <div>
                <span className="font-semibold">Capitale:</span> Canberra
              </div>
              <div>
                <span className="font-semibold">Population:</span> 26 millions
              </div>
              <div>
                <span className="font-semibold">Langue:</span> Anglais
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-3xl font-bold text-yellow-800 mb-6">
              🏛 Patrimoine UNESCO (20 sites)
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-yellow-50 p-4 rounded-xl">
                <h3 className="font-bold text-yellow-900 mb-2">
                  🐠 Grande Barrière Corail
                </h3>
                <p className="text-gray-700">
                  Plus grand récif 2,300 km Queensland. 400 coraux 1,500
                  poissons, visible espace, biodiversité exceptionnelle
                </p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-xl">
                <h3 className="font-bold text-yellow-900 mb-2">
                  🏜 Uluru Ayers Rock
                </h3>
                <p className="text-gray-700">
                  Rocher sacré 348m monolithe rouge. Site spirituel aborigène
                  30,000 ans, coucher soleil spectaculaire
                </p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-xl">
                <h3 className="font-bold text-yellow-900 mb-2">
                  🎭 Opéra Sydney
                </h3>
                <p className="text-gray-700">
                  Architecture Utzon 1973 voiles blanches. Port Harbour Bridge,
                  patrimoine mondial, 1,500 spectacles/an
                </p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-xl">
                <h3 className="font-bold text-yellow-900 mb-2">
                  🦘 Faune Unique
                </h3>
                <p className="text-gray-700">
                  Kangourous koalas wombats ornithorynques. 80% espèces
                  endémiques évolution isolée
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-3xl font-bold text-green-800 mb-6">
              🎭 Culture Aussie
            </h2>
            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-xl">
                <h3 className="font-bold text-green-900 mb-2">
                  🏄 Surf Beach Culture
                </h3>
                <p className="text-gray-700">
                  Bondi Beach Sydney icône surf. Gold Coast, lifeguards, beach
                  lifestyle BBQ outdoor
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-xl">
                <h3 className="font-bold text-green-900 mb-2">
                  🎨 Aborigènes 65,000 ans
                </h3>
                <p className="text-gray-700">
                  Plus ancienne culture vivante. Dreamtime création, dot
                  painting art, didgeridoo boomerang
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-3xl font-bold text-blue-800 mb-6">
              💼 13e Économie Mondiale
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-xl">
                <h3 className="font-bold text-blue-900">⛏ Mines Ressources</h3>
                <p className="text-gray-700">
                  1er exportateur fer charbon. Or uranium bauxite, BHP Rio Tinto
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-xl">
                <h3 className="font-bold text-blue-900">🎓 Éducation</h3>
                <p className="text-gray-700">
                  8 universités Top 100. 3e destination étudiants étrangers
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-xl">
                <h3 className="font-bold text-blue-900">🏖 Qualité Vie</h3>
                <p className="text-gray-700">
                  Melbourne Sydney villes plus vivables. Outdoor lifestyle
                  équilibre
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-xl">
                <h3 className="font-bold text-blue-900">🏉 Sport</h3>
                <p className="text-gray-700">
                  Rugby cricket champions. Tennis Open Australie, natation
                  olympique
                </p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <a
              href="/bibliotheque"
              className="inline-block bg-gradient-to-r from-yellow-600 via-green-600 to-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:scale-105 transition text-lg shadow-xl"
            >
              ← Retour Bibliothèque
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
}
