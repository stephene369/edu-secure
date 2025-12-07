import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext.jsx'
import { useNavigate } from 'react-router-dom'
import { 
  collection, 
  getDocs, 
  query,

  orderBy,
  onSnapshot
} from 'firebase/firestore'
import { db } from '../../firebase/config'
import { 
  FaUser,
  FaSignOutAlt,
  FaGraduationCap,
  FaCalculator,
  FaBookOpen,
  FaGlobe,
  FaFlask,
  FaLanguage,
  FaPalette,
  FaMusic,
  FaRunning,
  FaLaptopCode,
  FaSpinner,
  FaExclamationTriangle,
  FaArrowRight,
  FaBook,

  FaStar,

  FaCog,
  FaSync
} from 'react-icons/fa'

// Import du nouveau composant ProfileSection
import ProfileSection from './ProfileSection'

export default function StudentDashboard() {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()
  
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [activeTab, setActiveTab] = useState('dashboard')
  const [refreshing, setRefreshing] = useState(false)

  // Mapping des icônes par matière
  const subjectIcons = {
    'mathématiques': FaCalculator,
    'français': FaBookOpen,
    'histoire': FaGlobe,
    'géographie': FaGlobe,
    'histoire-géographie': FaGlobe,
    'sciences': FaFlask,
    'svt': FaFlask,
    'physique': FaFlask,
    'physique-chimie': FaFlask,
    'anglais': FaLanguage,
    'espagnol': FaLanguage,
    'allemand': FaLanguage,
    'arts': FaPalette,
    'arts plastiques': FaPalette,
    'musique': FaMusic,
    'eps': FaRunning,
    'sport': FaRunning,
    'informatique': FaLaptopCode,
    'technologie': FaLaptopCode,
    'ses': FaGlobe,
    'philosophie': FaBook
  }

  // Couleurs par matière
  const subjectColors = {
    'mathématiques': 'from-blue-400 to-blue-600',
    'français': 'from-red-400 to-red-600',
    'histoire': 'from-amber-400 to-amber-600',
    'géographie': 'from-green-400 to-green-600',
    'histoire-géographie': 'from-amber-400 to-green-600',
    'sciences': 'from-purple-400 to-purple-600',
    'svt': 'from-green-400 to-green-600',
    'physique': 'from-indigo-400 to-indigo-600',
    'physique-chimie': 'from-indigo-400 to-purple-600',
    'anglais': 'from-pink-400 to-pink-600',
    'espagnol': 'from-orange-400 to-orange-600',
    'allemand': 'from-gray-400 to-gray-600',
    'arts': 'from-pink-400 to-purple-600',
    'arts plastiques': 'from-pink-400 to-purple-600',
    'musique': 'from-yellow-400 to-yellow-600',
    'eps': 'from-teal-400 to-teal-600',
    'sport': 'from-teal-400 to-teal-600',
    'informatique': 'from-cyan-400 to-cyan-600',
    'technologie': 'from-cyan-400 to-cyan-600',
    'ses': 'from-emerald-400 to-emerald-600',
    'philosophie': 'from-slate-400 to-slate-600'
  }

  // Options de classes pour l'affichage
  const gradeLabels = {
    'cm1': 'CM1',
    'cm2': 'CM2',
    '6eme': '6ème',
    '5eme': '5ème',
    '4eme': '4ème',
    '3eme': '3ème',
    '2nde': '2nde',
    '1ere': '1ère',
    'terminale': 'Terminale'
  }

  // Vérifier l'accès
  useEffect(() => {
    if (!currentUser) {
      navigate('/login')
      return
    }
    
    if (currentUser.userType !== 'student') {
      navigate('/welcome')
      return
    }
  }, [currentUser, navigate])


  // Charger les matières avec écoute en temps réel
  useEffect(() => {
    let unsubscribe = null

    const loadSubjects = async () => {
      if (!currentUser?.grade) {
        setError('Classe non définie pour cet élève')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError('')
        
        const subjectsRef = collection(db, 'classes', currentUser.grade, 'subjects')
        const subjectsQuery = query(subjectsRef, orderBy('name', 'asc'))

        




        // Écouter les changements en temps réel
        unsubscribe = onSnapshot(subjectsQuery, (snapshot) => {
          const subjectsData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          
          setSubjects(subjectsData)
          setLoading(false)
          setRefreshing(false)
        }, (err) => {
          console.error('Erreur lors du chargement des matières:', err)
          setError('Erreur lors du chargement des matières')
          setLoading(false)
          setRefreshing(false)
        })
        


      } catch (err) {
        console.error('Erreur lors du chargement des matières:', err)
        setError('Erreur lors du chargement des matières')

        setLoading(false)
        setRefreshing(false)
      }
    }


    if (currentUser?.grade) {
      loadSubjects()
    }

    // Nettoyer l'écouteur lors du démontage
    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }

  }, [currentUser?.grade]) // Recharger quand la classe change

  // Fonction pour rafraîchir manuellement
  const handleRefresh = () => {
    setRefreshing(true)
    // Le useEffect se chargera du rechargement automatique
  }

  // Déconnexion
  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
    }
  }

  // Obtenir l'icône d'une matière
  const getSubjectIcon = (subjectName) => {
    const name = subjectName.toLowerCase()
    for (const [key, Icon] of Object.entries(subjectIcons)) {
      if (name.includes(key)) {
        return Icon
      }
    }
    return FaBook // Icône par défaut
  }

  // Obtenir la couleur d'une matière
  const getSubjectColor = (subjectName) => {
    const name = subjectName.toLowerCase()
    for (const [key, color] of Object.entries(subjectColors)) {
      if (name.includes(key)) {
        return color
      }
    }
    return 'from-gray-400 to-gray-600' // Couleur par défaut
  }

  // Naviguer vers une matière
  const handleExploreSubject = (subject) => {
    navigate(`/student/subject/${subject.id}`, { 
      state: { 
        subject,
        grade: currentUser.grade 
      } 
    })
  }

  if (!currentUser || currentUser.userType !== 'student') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <FaExclamationTriangle className="mx-auto mb-4 text-red-500" size={48} />
          <h2 className="text-2xl font-bold text-red-600 mb-4">Accès non autorisé</h2>
          <p className="text-gray-600 mb-4">Cette page est réservée aux élèves.</p>
          <button
            onClick={() => navigate('/welcome')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-white/20 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-2xl mr-4">
                <FaGraduationCap className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  EduSecure+
                </h1>
                <p className="text-gray-600 text-sm">Espace Élève</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Indicateur de classe avec possibilité de rafraîchir */}
              <div className="flex items-center bg-white/60 rounded-full px-4 py-2">
                <FaGraduationCap className="text-blue-600 mr-2" size={16} />
                <span className="text-gray-700 font-medium">
                  {gradeLabels[currentUser?.grade] || currentUser?.grade?.toUpperCase() || 'Classe non définie'}
                </span>
                {refreshing && (
                  <FaSync className="animate-spin ml-2 text-blue-600" size={14} />
                )}
              </div>
              
              <div className="flex items-center bg-white/60 rounded-full px-4 py-2">
                <FaUser className="text-gray-600 mr-2" size={16} />
                <span className="text-gray-700 font-medium">
                  {currentUser.firstName}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full transition-colors"
              >
                <FaSignOutAlt className="mr-2" size={16} />
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation par onglets */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex space-x-1 bg-white/60 backdrop-blur-sm rounded-2xl p-1 shadow-lg border border-white/20 mb-6">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'dashboard'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
            }`}
          >
            <FaGraduationCap className="mr-2" size={18} />
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'profile'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
            }`}
          >
            <FaCog className="mr-2" size={18} />
            Profil
          </button>
        </div>
      </div>

      {/* Contenu principal */}
      <main className="max-w-7xl mx-auto px-4 pb-8">
        {activeTab === 'dashboard' && (
          <>
            {/* Section de bienvenue */}
            <div className="mb-8">
              <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/20">
                <div className="text-center">
                  <h2 className="text-4xl font-bold text-gray-800 mb-2">
                    Bonjour {currentUser.firstName} 👋
                  </h2>
                  <div className="flex items-center justify-center mb-4">
                    <FaGraduationCap className="text-blue-600 mr-2" size={20} />
                    <span className="text-xl text-gray-700 font-medium">

                      Classe : {gradeLabels[currentUser.grade] || currentUser.grade?.toUpperCase() || 'Non définie'}
                    </span>
                    {currentUser?.grade && (
                      <button
                        onClick={handleRefresh}
                        disabled={refreshing}
                        className="ml-3 p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors disabled:opacity-50"
                        title="Actualiser les matières"
                      >
                        <FaSync className={`${refreshing ? 'animate-spin' : ''}`} size={16} />
                      </button>
                    )}
                  </div>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    Bienvenue dans votre espace d'apprentissage ! Explorez vos matières, 
                    découvrez de nouveaux cours et testez vos connaissances avec nos quiz interactifs.
                  </p>
                </div>
              </div>
            </div>

            {/* Section des matières */}
            <div className="mb-8">
              <div className="flex items-center mb-6">
                <FaBook className="text-blue-600 mr-3" size={24} />
                <h3 className="text-2xl font-bold text-gray-800">Mes Matières</h3>
                <div className="ml-auto flex items-center bg-white/60 rounded-full px-4 py-2">
                  <FaStar className="text-yellow-500 mr-2" size={16} />
                  <span className="text-gray-700 font-medium">
                    {subjects.length} matière{subjects.length > 1 ? 's' : ''} disponible{subjects.length > 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              {/* Messages d'état */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl flex items-center mb-6">
                  <FaExclamationTriangle className="mr-3 flex-shrink-0" size={20} />
                  <span>{error}</span>
                  <button
                    onClick={handleRefresh}
                    className="ml-auto bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                  >
                    Réessayer
                  </button>
                </div>
              )}

              {/* Chargement */}
              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="text-center">
                    <FaSpinner className="animate-spin mx-auto mb-4 text-blue-600" size={48} />

                    <p className="text-gray-600 text-lg">
                      {refreshing ? 'Actualisation des matières...' : 'Chargement de vos matières...'}
                    </p>
                  </div>
                </div>
              ) : !currentUser?.grade ? (
                /* Classe non définie */
                <div className="text-center py-16">
                  <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-12 shadow-lg border border-white/20">
                    <FaExclamationTriangle className="mx-auto mb-6 text-orange-500" size={64} />
                    <h4 className="text-2xl font-bold text-gray-800 mb-4">
                      Classe non définie
                    </h4>
                    <p className="text-gray-600 max-w-md mx-auto mb-6">
                      Vous devez d'abord configurer votre classe dans votre profil pour voir les matières disponibles.
                    </p>
                    <button
                      onClick={() => setActiveTab('profile')}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
                    >
                      Configurer mon profil
                    </button>
                  </div>
                </div>
              ) : subjects.length === 0 ? (
                /* Aucune matière */
                <div className="text-center py-16">
                  <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-12 shadow-lg border border-white/20">
                    <FaBook className="mx-auto mb-6 text-gray-400" size={64} />
                    <h4 className="text-2xl font-bold text-gray-800 mb-4">
                      Aucune matière disponible
                    </h4>


                    <p className="text-gray-600 max-w-md mx-auto mb-6">
                      Il semble qu'aucune matière n'ait encore été créée pour votre classe ({gradeLabels[currentUser.grade] || currentUser.grade}). 
                      Contactez votre professeur pour plus d'informations.
                    </p>
                    <button
                      onClick={handleRefresh}
                      disabled={refreshing}
                      className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-medium transition-colors"
                    >
                      {refreshing ? (
                        <>
                          <FaSpinner className="animate-spin mr-2" size={16} />
                          Actualisation...
                        </>
                      ) : (
                        <>
                          <FaSync className="mr-2" size={16} />
                          Actualiser
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                /* Grille des matières */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {subjects.map((subject) => {
                    const IconComponent = getSubjectIcon(subject.name)
                    const colorClass = getSubjectColor(subject.name)
                    
                    return (
                      <div
                        key={subject.id}
                        className="group bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/20 hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer relative"
                        onClick={() => handleExploreSubject(subject)}
                      >
                        {/* Icône de la matière */}
                        <div className={`bg-gradient-to-br ${colorClass} p-4 rounded-2xl mb-4 mx-auto w-fit group-hover:scale-110 transition-transform duration-300`}>
                          <IconComponent className="text-white" size={32} />
                        </div>
                        
                        <h4 className="text-xl font-bold text-gray-800 mb-2 text-center group-hover:text-blue-600 transition-colors">
                          {subject.name}
                        </h4>
                        
                        {/* Description */}
                        {subject.description && (
                          <p className="text-gray-600 text-sm text-center mb-4 line-clamp-2">
                            {subject.description}
                          </p>
                        )}
                        
                        {/* Bouton Explorer */}
                        <div className="flex items-center justify-center">
                          <button className="flex items-center bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-2 rounded-full font-medium transition-all duration-300 group-hover:shadow-lg">
                            <span>Explorer</span>
                            <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={14} />
                          </button>
                        </div>
                        
                        {/* Badge de nouveauté (optionnel) */}
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                            Nouveau
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Section statistiques rapides */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                <div className="flex items-center">
                  <div className="bg-gradient-to-r from-green-400 to-green-600 p-3 rounded-xl mr-4">
                    <FaBook className="text-white" size={20} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{subjects.length}</p>
                    <p className="text-gray-600 text-sm">Matières disponibles</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                <div className="flex items-center">
                  <div className="bg-gradient-to-r from-blue-400 to-blue-600 p-3 rounded-xl mr-4">
                    <FaGraduationCap className="text-white" size={20} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">-</p>
                    <p className="text-gray-600 text-sm">Cours suivis</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                <div className="flex items-center">
                  <div className="bg-gradient-to-r from-purple-400 to-purple-600 p-3 rounded-xl mr-4">
                    <FaStar className="text-white" size={20} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">-</p>
                    <p className="text-gray-600 text-sm">Quiz réalisés</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Section conseils/motivation */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl p-8 text-white shadow-2xl">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-4">💡 Conseil du jour</h3>
                <p className="text-blue-100 max-w-2xl mx-auto text-lg">
                  "L'apprentissage est un voyage, pas une destination. Chaque petit pas compte ! 
                  Explorez vos matières à votre rythme et n'hésitez pas à revoir les concepts difficiles."
                </p>
              </div>
            </div>
          </>
        )}

        {/* Onglet Profil */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <ProfileSection currentUser={currentUser} />
          </div>
        )}
      </main>
    </div>
  )
}
