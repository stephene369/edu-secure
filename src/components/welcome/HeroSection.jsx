import { Link } from 'react-router-dom'
import { FaRocket, FaGraduationCap, FaUserGraduate, FaArrowRight } from 'react-icons/fa'

export default function HeroSection({ currentUser, stats, getDashboardLink }) {
  return (
    <section className="bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 text-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Hero Content */}
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl mb-6 text-white">
              Apprenez aujourd'hui.
              <br />
              <span className="text-blue-400">Réussissez demain.</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Des cours scolaires validés de la 6ème à la Terminale + des simulations métier 
              professionnelles pour booster votre employabilité.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              {currentUser ? (
                <Link
                  to={getDashboardLink()}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-3"
                >
                  <span>Accéder à mon espace</span>
                  <FaArrowRight className="ml-2" size={20} />
                </Link>
              ) : (
                <>
                  <Link
                    to="/course-catalog"
                    className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-3"
                  >
                    <span>Découvrir les cours</span>
                    <FaArrowRight className="ml-2" size={20} />
                  </Link>
                  <Link
                    to="/how-it-works"
                    className="bg-transparent border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-3"
                  >
                    <span>Comment ça marche</span>
                  </Link>
                </>
              )}
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-gray-700">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Hero Visual */}
          <div className="hidden md:block">
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl p-8 shadow-2xl">
                <div className="bg-gray-800 rounded-2xl p-6 text-center">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-blue-500/20 rounded-xl p-4 text-center">
                      <FaUserGraduate className="mx-auto text-blue-400 mb-2" size={24} />
                      <p className="text-white font-semibold">Espace Élève</p>
                      <p className="text-gray-400 text-sm">Apprentissage personnalisé</p>
                    </div>
                    <div className="bg-purple-500/20 rounded-xl p-4 text-center">
                      <FaGraduationCap className="mx-auto text-purple-400 mb-2" size={24} />
                      <p className="text-white font-semibold">Espace Enseignant</p>
                      <p className="text-gray-400 text-sm">Monétisation des compétences</p>
                    </div>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4">
                    <p className="text-white font-semibold text-center">
                      Rejoignez notre communauté éducative d'excellence
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}