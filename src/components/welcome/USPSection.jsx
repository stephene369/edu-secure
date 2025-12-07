import { FaBook, FaUsers, FaBriefcase, FaArrowRight } from 'react-icons/fa'
import { Link } from 'react-router-dom'

export default function USPSection({ currentUser }) {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Pourquoi choisir EduSecure+ ?
          </h2>
          <p className="text-xl text-gray-600">
            Une plateforme équilibrée pour tous les acteurs
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Pour les Apprenants */}
          <div className="bg-white rounded-xl p-8 text-center border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaBook className="text-blue-600" size={24} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Pour les Apprenants</h3>
            <p className="text-gray-600 mb-4">
              Accédez à des cours scolaires validés et des simulations métier pour augmenter 
              vos chances d'embauche
            </p>
            <Link
              to={currentUser ? '/student/dashboard' : '/signup'}
              className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center space-x-1"
            >
              <span>Commencer à apprendre</span>
              <FaArrowRight size={14} />
            </Link>
          </div>

          {/* Pour les Enseignants */}
          <div className="bg-white rounded-xl p-8 text-center border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaUsers className="text-green-600" size={24} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Pour les Enseignants</h3>
            <p className="text-gray-600 mb-4">
              Créez et monétisez vos cours. Recevez 70% du prix de vente avec des paiements 
              automatiques mensuels
            </p>
            <Link
              to="/for-teachers"
              className="text-green-600 hover:text-green-700 font-medium inline-flex items-center space-x-1"
            >
              <span>Commencer à enseigner</span>
              <FaArrowRight size={14} />
            </Link>
          </div>

          {/* Pour les Entreprises */}
          <div className="bg-white rounded-xl p-8 text-center border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaBriefcase className="text-purple-600" size={24} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Pour les Entreprises</h3>
            <p className="text-gray-600 mb-4">
              Créez des simulations métier pour identifier et recruter les meilleurs 
              talents qualifiés
            </p>
            <Link
              to={currentUser ? '/recruiter/dashboard' : '/signup'}
              className="text-purple-600 hover:text-purple-700 font-medium inline-flex items-center space-x-1"
            >
              <span>Recruter des talents</span>
              <FaArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}