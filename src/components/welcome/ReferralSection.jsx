import { FaGift, FaUsers, FaHandshake, FaChartLine } from 'react-icons/fa'

export default function ReferralSection({ currentUser }) {
  const referralLevels = [
    {
      referrals: "1-5",
      commission: "30%",
      color: "from-green-500 to-emerald-600",
      description: "Commission réduite à 30% au lieu de 50%"
    },
    {
      referrals: "6-15", 
      commission: "25%",
      color: "from-blue-500 to-cyan-600",
      description: "Commission réduite à 25% pour vos cours"
    },
    {
      referrals: "16+",
      commission: "20%", 
      color: "from-purple-500 to-indigo-600",
      description: "Taux préférentiel de 20% seulement"
    }
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-amber-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-amber-100 text-amber-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <FaGift size={14} />
            <span>Programme de Parrainage Enseignant</span>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Réduisez Votre Commission jusqu'à 20%
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Parrainez d'autres enseignants et bénéficiez de commissions réduites sur vos ventes de cours. 
            Plus vous parrainez, plus votre taux de commission baisse !
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {referralLevels.map((level, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-amber-200 text-center">
              <div className={`bg-gradient-to-br ${level.color} p-4 rounded-2xl w-20 h-20 mx-auto mb-4 flex items-center justify-center`}>
                <FaUsers className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{level.commission}</h3>
              <p className="text-lg font-semibold text-amber-600 mb-2">Commission</p>
              <p className="text-gray-600 mb-3">{level.referrals} enseignants parrainés</p>
              <p className="text-sm text-gray-500">{level.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Comment ça marche ?</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="bg-amber-100 p-2 rounded-lg flex-shrink-0">
                    <FaHandshake className="text-amber-600" size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Obtenez votre code</h4>
                    <p className="text-gray-600 text-sm">
                      Recevez un code de parrainage unique dans votre espace enseignant
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-amber-100 p-2 rounded-lg flex-shrink-0">
                    <FaUsers className="text-amber-600" size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Parrainez des collègues</h4>
                    <p className="text-gray-600 text-sm">
                      Partagez votre code avec d'autres enseignants qui souhaitent rejoindre la plateforme
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-amber-100 p-2 rounded-lg flex-shrink-0">
                    <FaChartLine className="text-amber-600" size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Bénéficiez de réductions</h4>
                    <p className="text-gray-600 text-sm">
                      Votre commission baisse progressivement à chaque nouvel enseignant parrainé
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-6 text-white">
              <div className="text-center">
                <FaGift className="mx-auto mb-4" size={48} />
                <h4 className="text-xl font-bold mb-2">Exemple concret</h4>
                <p className="text-amber-100 mb-4">
                  Avec 10 enseignants parrainés, vous passez de 50% à 25% de commission
                </p>
                <div className="bg-white/20 rounded-xl p-4">
                  <p className="font-semibold">Sur un cours à 3,000 FCFA :</p>
                  <p className="text-2xl font-bold mt-2">+750 FCFA de revenus supplémentaires</p>
                </div>
              </div>
            </div>
          </div>

          {currentUser?.userType === 'professor' ? (
            <div className="text-center mt-8">
              <button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl">
                Accéder à mon code de parrainage
              </button>
            </div>
          ) : (
            <div className="text-center mt-8">
              <p className="text-gray-600 mb-4">Vous êtes enseignant ? Rejoignez-nous et profitez de ce programme !</p>
              <button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl">
                Devenir Enseignant sur EduSecure+
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}