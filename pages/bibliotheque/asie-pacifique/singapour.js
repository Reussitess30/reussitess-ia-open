/* © Reussitess®971 INPI DSO2026012614 PORINUS Rony 2026 */
import Layout from "../../../components/Layout";

export default function Singapour() {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-8xl mb-4">🇸🇬</div>
            <h1 className="text-5xl font-bold text-red-900 mb-4">Singapour</h1>
            <div className="flex justify-center gap-8 text-lg flex-wrap">
              <div>
                <span className="font-semibold">Capitale:</span> Singapour
              </div>
              <div>
                <span className="font-semibold">Population:</span> 5.9 millions
              </div>
              <div>
                <span className="font-semibold">Langues:</span> Anglais,
                Mandarin, Malais
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-3xl font-bold text-red-800 mb-6">
              🏙️ Cité-État Futuriste
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-red-50 p-4 rounded-xl">
                <h3 className="font-bold text-red-900 mb-2">
                  🌳 Gardens by the Bay
                </h3>
                <p className="text-gray-700">
                  Supertrees géants 50m technologie verte. Jardins futuristes
                  biodiversité, Cloud Forest cascade 35m, iconique mondial
                </p>
              </div>
              <div className="bg-red-50 p-4 rounded-xl">
                <h3 className="font-bold text-red-900 mb-2">
                  🏨 Marina Bay Sands
                </h3>
                <p className="text-gray-700">
                  Hôtel casino toit infini. Piscine plus haute monde 57e étage
                  150m, architecture Moshe Safdie, skyline emblématique
                </p>
              </div>
              <div className="bg-red-50 p-4 rounded-xl">
                <h3 className="font-bold text-red-900 mb-2">
                  🏛️ Changi Airport
                </h3>
                <p className="text-gray-700">
                  Meilleur aéroport monde 12 années. Jewel cascade Rain Vortex
                  40m, forêt tropicale shopping
                </p>
              </div>
              <div className="bg-red-50 p-4 rounded-xl">
                <h3 className="font-bold text-red-900 mb-2">
                  🦁 Merlion Symbole
                </h3>
                <p className="text-gray-700">
                  Statue lion poisson emblème national. Marina Bay légende,
                  icône touristique reconnaissable
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-3xl font-bold text-green-800 mb-6">
              💼 Hub Mondial
            </h2>
            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-xl">
                <h3 className="font-bold text-green-900 mb-2">
                  💰 3e Centre Financier
                </h3>
                <p className="text-gray-700">
                  Après Londres New York place boursière Asie. Banques
                  multinationales, fiscalité attractive
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-xl">
                <h3 className="font-bold text-green-900 mb-2">
                  🚢 Port 1er Mondial
                </h3>
                <p className="text-gray-700">
                  Container transhipment stratégique détroit Malacca. 37M EVP,
                  hub logistique Asie
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-xl">
                <h3 className="font-bold text-green-900 mb-2">
                  🎓 Éducation N°1
                </h3>
                <p className="text-gray-700">
                  PISA classement mondial premier. NUS NTU Top 15, système
                  modèle efficacité
                </p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <a
              href="/bibliotheque"
              className="inline-block bg-gradient-to-r from-red-600 to-white text-gray-900 px-8 py-4 rounded-xl font-bold hover:scale-105 transition text-lg shadow-xl border-2 border-red-600"
            >
              ← Retour Bibliothèque
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
}
