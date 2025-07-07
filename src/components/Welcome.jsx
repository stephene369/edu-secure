import { useAuth } from '../contexts/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import { useEffect } from 'react'
import { FaCheckCircle, FaTachometerAlt, FaSignOutAlt, FaChalkboardTeacher, FaUserGraduate } from 'react-icons/fa'

export default function Welcome() {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
    }
  }

  const getDashboardLink = () => {
    if (currentUser?.userType === 'professor') {
      return '/professor/dashboard'
    }
    return '/dashboard'
  }

  const getDashboardIcon = () => {
    if (currentUser?.userType === 'professor') {
      return <FaChalkboardTeacher className="mr-2" size={18} />
    }
    return <FaUserGraduate className="mr-2" size={18} />
  }

  const getDashboardText = () => {
    if (currentUser?.userType === 'professor') {
      return 'Dashboard Professeur'
    }
    return 'Dashboard Élève'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-blue-600 mb-4">
            EduSecure+
          </h1>
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="mb-6">
              <FaCheckCircle className="mx-auto text-green-500" size={64} />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Bienvenue !
            </h2>
            
            <div className="space-y-3 text-left">
              <p className="text-gray-600">
                <strong>Nom :</strong> {currentUser?.firstName} {currentUser?.lastName}
              </p>
              <p className="text-gray-600">
                <strong>Email :</strong> {currentUser?.email}
              </p>
              <p className="text-gray-600">
                <strong>Type :</strong> {
                  currentUser?.userType === 'student' ? 'Élève' :
                  currentUser?.userType === 'parent' ? 'Parent' :
                  currentUser?.userType === 'professor' ? 'Professeur' : 'Utilisateur'
                }
              </p>
              {currentUser?.grade && (
                <p className="text-gray-600">
                  <strong>Classe :</strong> {currentUser.grade.toUpperCase()}
                </p>
              )}
              {currentUser?.speciality && (
                <p className="text-gray-600">
                  <strong>Spécialité :</strong> {currentUser.speciality}
                </p>
              )}
            </div>

            <div className="mt-8 space-y-4">
              <Link
                to={getDashboardLink()}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
              >
                {getDashboardIcon()}
                {getDashboardText()}
              </Link>
              
              <button
                onClick={handleLogout}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
              >
                <FaSignOutAlt className="mr-2" size={18} />
                Se déconnecter
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}