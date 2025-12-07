import { Link } from 'react-router-dom'
import { FaGraduationCap, FaChalkboardTeacher } from 'react-icons/fa'

export default function CTASection({ currentUser, getDashboardLink }) {
  return (
    <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
      <div className="max-w-4xl mx-auto text-center px-4">
        <h2 className="text-3xl font-bold text-white mb-4">
          Prêt à commencer votre parcours ?
        </h2>
        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          Rejoignez des milliers d'apprenants et enseignants qui transforment l'éducation sur EduSecure+
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/course-catalog"
            className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-4 rounded-xl transition-colors text-lg flex items-center justify-center space-x-2"
          >
            <FaGraduationCap size={20} />
            <span>Explorer les cours</span>
          </Link>
          <Link 
            to="/for-teachers"
            className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-semibold px-8 py-4 rounded-xl transition-colors text-lg flex items-center justify-center space-x-2"
          >
            <FaChalkboardTeacher size={20} />
            <span>Devenir enseignant</span>
          </Link>
        </div>
      </div>
    </section>
  )
}