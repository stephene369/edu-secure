import { Link } from 'react-router-dom'
import { 
  FaUserGraduate, FaChalkboardTeacher, FaPlayCircle, 
  FaBook, FaStar, FaUsers, FaMoneyBillWave, 
  FaRocket, FaChartLine 
} from 'react-icons/fa'

export default function UserSpacesSection({ currentUser }) {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Espaces Personnalisés
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Des environnements d'apprentissage et d'enseignement conçus spécifiquement 
            pour répondre à vos besoins.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Student Space */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-4 rounded-2xl mr-6">
                <FaUserGraduate className="text-white" size={32} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Espace Élève</h3>
                <p className="text-gray-600">Apprentissage personnalisé et interactif</p>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center text-gray-700">
                <FaPlayCircle className="text-green-500 mr-4 flex-shrink-0" size={20} />
                <span>Cours vidéo de qualité premium</span>
              </div>
              <div className="flex items-center text-gray-700">
                <FaBook className="text-blue-500 mr-4 flex-shrink-0" size={20} />
                <span>Exercices pratiques et corrigés</span>
              </div>
              <div className="flex items-center text-gray-700">
                <FaStar className="text-amber-500 mr-4 flex-shrink-0" size={20} />
                <span>Suivi de progression détaillé</span>
              </div>
              <div className="flex items-center text-gray-700">
                <FaUsers className="text-purple-500 mr-4 flex-shrink-0" size={20} />
                <span>Communauté d'apprentissage active</span>
              </div>
            </div>

            {/* Zone image remplacée par un conteneur simple */}
            <div className="mb-6 bg-gray-100 h-48 rounded-2xl flex items-center justify-center shadow-inner">
              <span className="text-gray-400 font-medium">Aperçu de l’Espace Élève</span>
            </div>

            {currentUser?.userType === 'student' ? (
              <Link
                to="/student/dashboard"
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold px-6 py-3 rounded-xl transition-all duration-300 w-full text-center block"
              >
                Accéder à mon Espace Élève
              </Link>
            ) : (
              <Link
                to="/signup"
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold px-6 py-3 rounded-xl transition-all duration-300 w-full text-center block"
              >
                Devenir Élève
              </Link>
            )}
          </div>

          {/* Teacher Space */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-100 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-2xl mr-6">
                <FaChalkboardTeacher className="text-white" size={32} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Espace Enseignant</h3>
                <p className="text-gray-600">Valorisez et monétisez votre expertise</p>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center text-gray-700">
                <FaMoneyBillWave className="text-green-500 mr-4 flex-shrink-0" size={20} />
                <span>Revenus complémentaires garantis</span>
              </div>
              <div className="flex items-center text-gray-700">
                <FaUsers className="text-blue-500 mr-4 flex-shrink-0" size={20} />
                <span>Audience nationale d'étudiants</span>
              </div>
              <div className="flex items-center text-gray-700">
                <FaRocket className="text-amber-500 mr-4 flex-shrink-0" size={20} />
                <span>Outils de création simplifiés</span>
              </div>
              <div className="flex items-center text-gray-700">
                <FaChartLine className="text-purple-500 mr-4 flex-shrink-0" size={20} />
                <span>Analyses de performance détaillées</span>
              </div>
            </div>

            {/* Zone image remplacée par un conteneur simple */}
            <div className="mb-6 bg-gray-100 h-48 rounded-2xl flex items-center justify-center shadow-inner">
              <span className="text-gray-400 font-medium">Aperçu de l’Espace Enseignant</span>
            </div>

            {currentUser?.userType === 'professor' ? (
              <Link
                to="/pd"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold px-6 py-3 rounded-xl transition-all duration-300 w-full text-center block"
              >
                Accéder à mon Espace Enseignant
              </Link>
            ) : (
              <Link
                to="/signup"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold px-6 py-3 rounded-xl transition-all duration-300 w-full text-center block"
              >
                Devenir Enseignant
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
