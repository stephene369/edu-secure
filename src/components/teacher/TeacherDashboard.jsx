import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import AddSubject from './AddSubject'
import ManageSubjects from './ManageSubjects'
import AddSubchapter from './AddSubchapter'
import AddLesson from './AddLesson'
import CreateQuiz from './CreateQuiz'
import { 
  FaBook, 
  FaChalkboardTeacher, 
  FaSignOutAlt, 
  FaPlus, 
  FaCog, 
  FaGraduationCap,
  FaBookOpen,
  FaQuestionCircle
} from 'react-icons/fa'

export default function TeacherDashboard() {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('add-subject')

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
    }
  }

  // Vérifier que l'utilisateur est bien professeur
  if (currentUser?.userType !== 'professor') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Accès non autorisé</h2>
          <p className="text-gray-600 mb-4">Cette page est réservée aux professeurs.</p>
          <button
            onClick={() => navigate('/welcome')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <FaChalkboardTeacher className="text-blue-600 mr-3" size={32} />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Dashboard Professeur
                </h1>
                <p className="text-gray-600">
                  Bienvenue, {currentUser?.firstName} {currentUser?.lastName}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <FaSignOutAlt className="mr-2" size={16} />
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar Navigation */}
          <div className="w-64 bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Navigation</h3>
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('add-subject')}
                className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === 'add-subject'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <FaPlus className="mr-3" size={16} />
                Ajouter une matière
              </button>
              
              <button
                onClick={() => setActiveTab('manage-subjects')}
                className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === 'manage-subjects'
                    ? 'bg-green-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <FaCog className="mr-3" size={16} />
                Gérer les matières
              </button>

              <button
                onClick={() => setActiveTab('add-subchapter')}
                className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === 'add-subchapter'
                    ? 'bg-orange-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <FaBookOpen className="mr-3" size={16} />
                Ajouter sous-chapitre
              </button>

              <button
                onClick={() => setActiveTab('add-lesson')}
                className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === 'add-lesson'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <FaGraduationCap className="mr-3" size={16} />
                Ajouter un cours
              </button>

              <button
                onClick={() => setActiveTab('create-quiz')}
                className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === 'create-quiz'
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <FaQuestionCircle className="mr-3" size={16} />
                Créer un quiz
              </button>
            </nav>

            {/* Raccourcis rapides */}
            <div className="mt-8">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Raccourcis</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Matières créées</span>
                  <span className="font-medium">-</span>
                </div>
                                <div className="flex justify-between text-gray-600">
                  <span>Chapitres totaux</span>
                  <span className="font-medium">-</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Sous-chapitres</span>
                  <span className="font-medium">-</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Cours publiés</span>
                  <span className="font-medium">-</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Quiz créés</span>
                  <span className="font-medium">-</span>
                </div>
              </div>
            </div>

            {/* Guide rapide */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <h4 className="text-sm font-medium text-blue-900 mb-2">Guide rapide</h4>
              <ol className="text-xs text-blue-700 space-y-1">
                <li>1. Créer une matière</li>
                <li>2. Ajouter des chapitres</li>
                <li>3. Créer des sous-chapitres</li>
                <li>4. Publier des cours</li>
                <li>5. Créer des quiz</li>
              </ol>
            </div>
          </div>

          {/* Contenu principal */}
          <div className="flex-1">
            {activeTab === 'add-subject' && <AddSubject />}
            {activeTab === 'manage-subjects' && <ManageSubjects />}
            {activeTab === 'add-subchapter' && <AddSubchapter />}
            {activeTab === 'add-lesson' && <AddLesson />}
            {activeTab === 'create-quiz' && <CreateQuiz />}
          </div>
        </div>
      </div>
    </div>
  )
}

