import { useAuth } from '../contexts/AuthContext.jsx'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header simple */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-blue-600">
              EduSecure+ Dashboard
            </h1>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <box-icon name='log-out' color='white' size='18px' class='mr-2'></box-icon>
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Message de bienvenue */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Bienvenue, {currentUser?.firstName || 'Utilisateur'} !
          </h2>
          <p className="text-gray-600">
            Voici votre tableau de bord EduSecure+
          </p>
        </div>

        {/* Informations utilisateur */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Mes informations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Nom complet</p>
              <p className="font-medium">
                {currentUser?.firstName} {currentUser?.lastName}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium">{currentUser?.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Type de compte</p>
              <p className="font-medium">
                {currentUser?.userType === 'student' ? 'Élève' : 
                 currentUser?.userType === 'parent' ? 'Parent' : 
                 currentUser?.userType === 'teacher' ? 'Professeur' : 'Utilisateur'}
              </p>
            </div>
            {currentUser?.grade && (
              <div>
                <p className="text-sm text-gray-600">Classe</p>
                <p className="font-medium">{currentUser.grade.toUpperCase()}</p>
              </div>
            )}
          </div>
        </div>

        {/* Cartes de fonctionnalités */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <box-icon name='book' size='48px' color='#3b82f6' class='mx-auto mb-4'></box-icon>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Mes Cours</h3>
            <p className="text-gray-600 text-sm mb-4">
              Accédez à vos cours et leçons
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
              Voir les cours
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-6 text-center">
            <box-icon name='bar-chart-alt-2' size='48px' color='#10b981' class='mx-auto mb-4'></box-icon>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Mes Notes</h3>
            <p className="text-gray-600 text-sm mb-4">
              Consultez vos résultats
            </p>
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
              Voir les notes
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-6 text-center">
            <box-icon name='video' size='48px' color='#f59e0b' class='mx-auto mb-4'></box-icon>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Vidéos</h3>
            <p className="text-gray-600 text-sm mb-4">
              Regardez les vidéos éducatives
            </p>
            <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
              Voir les vidéos
            </button>
          </div>
        </div>

        {/* Message de test */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <box-icon name='info-circle' color='#3b82f6' size='20px' class='mr-2'></box-icon>
            <p className="text-blue-800 text-sm">
              <strong>Dashboard fonctionnel !</strong> Toutes les fonctionnalités sont opérationnelles.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}