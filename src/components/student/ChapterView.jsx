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
  FaBookOpen,
  FaSpinner,
  FaExclamationTriangle,
  FaPlay,
  FaQuestionCircle,
  FaChevronRight,
  FaGraduationCap,
  FaBook,
  FaClock,
  FaStar
} from 'react-icons/fa'

export default function ChapterView() {
  const { chapterId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  
  const [subchapters, setSubchapters] = useState([])
  const [quizzes, setQuizzes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  const chapter = location.state?.chapter
  const subject = location.state?.subject
  const grade = location.state?.grade
  const subjectId = location.state?.subjectId

  useEffect(() => {
    if (!currentUser || currentUser.userType !== 'student') {
      navigate('/login')
      return
    }
    
    if (!chapter || !subject || !grade || !subjectId) {
      navigate('/student/dashboard')
      return
    }
    
    loadChapterContent()
  }, [currentUser, chapter, subject, grade, subjectId, navigate])

  const loadChapterContent = async () => {
    try {
      setLoading(true)
      setError('')
      
      // Charger les sous-chapitres
      const subchaptersRef = collection(db, 'classes', grade, 'subjects', subjectId, 'chapters', chapterId, 'subchapters')
      const subchaptersQuery = query(subchaptersRef, orderBy('order', 'asc'))
      const subchaptersSnapshot = await getDocs(subchaptersQuery)
      
      const subchaptersData = subchaptersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      
      setSubchapters(subchaptersData)
      
      // Charger les quiz du chapitre
      const quizzesRef = collection(db, 'classes', grade, 'subjects', subjectId, 'chapters', chapterId, 'quizzes')
      const quizzesQuery = query(quizzesRef, orderBy('createdAt', 'desc'))
      const quizzesSnapshot = await getDocs(quizzesQuery)
      
      const quizzesData = quizzesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      
      setQuizzes(quizzesData)
      
    } catch (err) {
      console.error('Erreur lors du chargement du contenu:', err)
      setError('Erreur lors du chargement du contenu du chapitre')
    } finally {
      setLoading(false)
    }
  }

  const handleSubchapterClick = (subchapter) => {
    navigate(`/student/subchapter/${subchapter.id}`, {
      state: {
        subchapter,
        chapter,
        subject,
        grade,
        subjectId,
        chapterId
      }
    })
  }

  const handleQuizClick = (quiz) => {
    navigate(`/student/quiz/${quiz.id}`, {
      state: {
        quiz,
        chapter,
        subject,
        grade,
        subjectId,
        chapterId
      }
    })
  }

  if (!chapter || !subject) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <FaExclamationTriangle className="mx-auto mb-4 text-red-500" size={48} />
          <h2 className="text-2xl font-bold text-red-600 mb-4">Chapitre non trouvé</h2>
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
              onClick={() => navigate(`/student/subject/${subjectId}`, {
                state: { subject, grade }
              })}
              className="flex items-center text-gray-600 hover:text-gray-800 mr-4 bg-white/60 rounded-full px-4 py-2 transition-colors"
            >
              <FaArrowLeft className="mr-2" size={16} />
              Retour
            </button>
            <div className="flex items-center">
              <FaBookOpen className="text-blue-600 mr-3" size={24} />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{chapter.title}</h1>
                <p className="text-gray-600">{subject.name} • Classe : {grade.toUpperCase()}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Contenu */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Description du chapitre */}
        {chapter.description && (
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 mb-8">
            <p className="text-gray-700 text-lg">{chapter.description}</p>
          </div>
        )}

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
              <p className="text-gray-600 text-lg">Chargement du contenu...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Section Sous-chapitres */}
            <div>
              <div className="flex items-center mb-6">
                <FaGraduationCap className="text-blue-600 mr-3" size={24} />
                <h2 className="text-2xl font-bold text-gray-800">Cours</h2>
                <div className="ml-auto bg-white/60 rounded-full px-4 py-2">
                  <span className="text-gray-700 font-medium">
                    {subchapters.length} cours
                  </span>
                </div>
              </div>

              {subchapters.length === 0 ? (
                <div className="text-center py-12">
                  <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
                    <FaBook className="mx-auto mb-4 text-gray-400" size={48} />
                    <h3 className="text-lg font-bold text-gray-800 mb-2">
                      Aucun cours disponible
                    </h3>
                    <p className="text-gray-600">
                      Les cours de ce chapitre n'ont pas encore été créés.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {subchapters.map((subchapter, index) => (
                    <div
                      key={subchapter.id}
                      className="group bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer"
                      onClick={() => handleSubchapterClick(subchapter)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center flex-1">
                          <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold mr-4">
                            {subchapter.order || index + 1}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors">
                              {subchapter.title}
                            </h3>
                            {subchapter.description && (
                              <p className="text-gray-600 text-sm line-clamp-2">
                                {subchapter.description}
                              </p>
                            )}
                            <div className="flex items-center mt-2 text-xs text-gray-500">
                              <FaClock className="mr-1" size={12} />
                              <span>Durée estimée: 15 min</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          <div className="flex items-center bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm">
                            <FaPlay className="mr-1" size={12} />
                            Commencer
                          </div>
                          <FaChevronRight className="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" size={16} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Section Quiz */}
            <div>
              <div className="flex items-center mb-6">
                <FaQuestionCircle className="text-purple-600 mr-3" size={24} />
                <h2 className="text-2xl font-bold text-gray-800">Quiz</h2>
                <div className="ml-auto bg-white/60 rounded-full px-4 py-2">
                  <span className="text-gray-700 font-medium">
                    {quizzes.length} quiz
                  </span>
                </div>
              </div>

              {quizzes.length === 0 ? (
                <div className="text-center py-12">
                  <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
                    <FaQuestionCircle className="mx-auto mb-4 text-gray-400" size={48} />
                    <h3 className="text-lg font-bold text-gray-800 mb-2">
                      Aucun quiz disponible
                    </h3>
                    <p className="text-gray-600">
                      Les quiz de ce chapitre n'ont pas encore été créés.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {quizzes.map((quiz, index) => (
                    <div
                      key={quiz.id}
                      className="group bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer"
                      onClick={() => handleQuizClick(quiz)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center flex-1">
                          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold mr-4">
                            Q{index + 1}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-800 mb-1 group-hover:text-purple-600 transition-colors">
                              {quiz.title}
                            </h3>
                            {quiz.description && (
                              <p className="text-gray-600 text-sm line-clamp-2">
                                {quiz.description}
                              </p>
                            )}
                            <div className="flex items-center mt-2 text-xs text-gray-500">
                              <FaClock className="mr-1" size={12} />
                              <span>Durée: {quiz.duration || 10} min</span>
                              <span className="mx-2">•</span>
                              <FaStar className="mr-1" size={12} />
                              <span>{quiz.difficulty || 'Moyen'}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          <div className="flex items-center bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm">
                            <FaQuestionCircle className="mr-1" size={12} />
                            Commencer
                          </div>
                          <FaChevronRight className="text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" size={16} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Section de progression (optionnelle) */}
        <div className="mt-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">Votre progression</h3>
              <p className="text-blue-100">
                Continuez à explorer ce chapitre pour maîtriser tous les concepts !
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">0%</div>
              <div className="text-blue-100 text-sm">Complété</div>
            </div>
          </div>
          <div className="mt-4 bg-white/20 rounded-full h-2">
            <div className="bg-white rounded-full h-2 w-0 transition-all duration-300"></div>
          </div>
        </div>
      </main>
    </div>
  )
}
