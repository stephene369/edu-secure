import { useState, useEffect } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { 
  collection, 
  getDocs, 
  query,
  orderBy 
} from 'firebase/firestore'
import { db } from '../../firebase/config'
import { 
  FaArrowLeft,
  FaBook,
  FaSpinner,
  FaExclamationTriangle,
  FaBookOpen,
  FaPlay,
  FaQuestionCircle,
  FaChevronRight
} from 'react-icons/fa'

export default function SubjectView() {
  const { subjectId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  
  const [chapters, setChapters] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  const subject = location.state?.subject
  const grade = location.state?.grade || currentUser?.grade

  useEffect(() => {
    if (!currentUser || currentUser.userType !== 'student') {
      navigate('/login')
      return
    }
    
    if (!subject || !grade) {
      navigate('/student/dashboard')
      return
    }
    
    loadChapters()
  }, [currentUser, subject, grade, navigate])

  const loadChapters = async () => {
    try {
      setLoading(true)
      setError('')
      
      const chaptersRef = collection(db, 'classes', grade, 'subjects', subjectId, 'chapters')
      const chaptersQuery = query(chaptersRef, orderBy('order', 'asc'))
      const snapshot = await getDocs(chaptersQuery)
      
      const chaptersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      
      setChapters(chaptersData)
      
    } catch (err) {
      console.error('Erreur lors du chargement des chapitres:', err)
      setError('Erreur lors du chargement des chapitres')
    } finally {
      setLoading(false)
    }
  }

  const handleChapterClick = (chapter) => {
    navigate(`/student/chapter/${chapter.id}`, {
      state: {
        chapter,
        subject,
        grade,
        subjectId
      }
    })
  }

  if (!subject) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <FaExclamationTriangle className="mx-auto mb-4 text-red-500" size={48} />
          <h2 className="text-2xl font-bold text-red-600 mb-4">Matière non trouvée</h2>
          <button
            onClick={() => navigate('/student/dashboard')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            Retour au tableau de bord
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/student/dashboard')}
              className="flex items-center text-gray-600 hover:text-gray-800 mr-4 bg-white/60 rounded-full px-4 py-2 transition-colors"
            >
              <FaArrowLeft className="mr-2" size={16} />
              Retour
            </button>
            <div className="flex items-center">
              <FaBook className="text-blue-600 mr-3" size={24} />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{subject.name}</h1>
                <p className="text-gray-600">Classe : {grade.toUpperCase()}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Contenu */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Description de la matière */}
        {subject.description && (
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 mb-8">
            <p className="text-gray-700 text-lg">{subject.description}</p>
          </div>
        )}

        {/* Section des chapitres */}
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <FaBookOpen className="text-blue-600 mr-3" size={24} />
            <h2 className="text-2xl font-bold text-gray-800">Chapitres</h2>
            <div className="ml-auto bg-white/60 rounded-full px-4 py-2">
              <span className="text-gray-700 font-medium">
                {chapters.length} chapitre{chapters.length > 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {/* Messages d'état */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl flex items-center mb-6">
              <FaExclamationTriangle className="mr-3 flex-shrink-0" size={20} />
              <span>{error}</span>
            </div>
          )}

          {/* Chargement */}
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <FaSpinner className="animate-spin mx-auto mb-4 text-blue-600" size={48} />
                <p className="text-gray-600 text-lg">Chargement des chapitres...</p>
              </div>
            </div>
          ) : chapters.length === 0 ? (
            /* Aucun chapitre */
            <div className="text-center py-16">
              <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-12 shadow-lg border border-white/20">
                <FaBookOpen className="mx-auto mb-6 text-gray-400" size={64} />
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  Aucun chapitre disponible
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Les chapitres de cette matière n'ont pas encore été créés par votre professeur.
                </p>
              </div>
            </div>
          ) : (
            /* Liste des chapitres */
            <div className="space-y-4">
              {chapters.map((chapter, index) => (
                <div
                  key={chapter.id}
                  className="group bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer"
                  onClick={() => handleChapterClick(chapter)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center flex-1">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg mr-4">
                        {chapter.order || index + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors">
                          {chapter.title}
                        </h3>
                        {chapter.description && (
                          <p className="text-gray-600 text-sm line-clamp-2">
                            {chapter.description}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <div className="flex items-center bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm">
                        <FaPlay className="mr-1" size={12} />
                        Cours
                      </div>
                      <div className="flex items-center bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm">
                        <FaQuestionCircle className="mr-1" size={12} />
                        Quiz
                      </div>
                      <FaChevronRight className="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" size={20} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}