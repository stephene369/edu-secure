import { useState, useEffect } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext.jsx'
import { 
  collection, 
  getDocs, 
  query,
  orderBy 
} from 'firebase/firestore'
import { db } from '../../firebase/config'
import ReactMarkdown from 'react-markdown'
import { 
  FaArrowLeft,
  FaBook,
  FaSpinner,
  FaExclamationTriangle,
  FaPlay,
  FaClock,
  FaUser,
  FaCalendarAlt,
  FaYoutube,
  FaExpand,
  FaCompress,
  FaBookOpen
} from 'react-icons/fa'

export default function SubchapterView() {
  const { subchapterId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  
  const [lessons, setLessons] = useState([])
  const [selectedLesson, setSelectedLesson] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isFullscreen, setIsFullscreen] = useState(false)
  
  const subchapter = location.state?.subchapter
  const chapter = location.state?.chapter
  const subject = location.state?.subject
  const grade = location.state?.grade
  const subjectId = location.state?.subjectId
  const chapterId = location.state?.chapterId

  useEffect(() => {
    if (!currentUser || currentUser.userType !== 'student') {
      navigate('/login')
      return
    }
    
    if (!subchapter || !chapter || !subject || !grade || !subjectId || !chapterId) {
      navigate('/student/dashboard')
      return
    }
    
    loadLessons()
  }, [currentUser, subchapter, chapter, subject, grade, subjectId, chapterId, navigate])

  const loadLessons = async () => {
    try {
      setLoading(true)
      setError('')
      
      const lessonsRef = collection(
        db, 
        'classes', grade, 
        'subjects', subjectId, 
        'chapters', chapterId,
        'subchapters', subchapterId,
        'lessons'
      )
      const lessonsQuery = query(lessonsRef, orderBy('createdAt', 'desc'))
      const snapshot = await getDocs(lessonsQuery)
      
      const lessonsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      
      setLessons(lessonsData)
      
      // Sélectionner automatiquement la première leçon
      if (lessonsData.length > 0) {
        setSelectedLesson(lessonsData[0])
      }
      
    } catch (err) {
      console.error('Erreur lors du chargement des cours:', err)
      setError('Erreur lors du chargement des cours')
    } finally {
      setLoading(false)
    }
  }

  const extractYouTubeId = (url) => {
    if (!url) return null
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
    return match ? match[1] : null
  }

  if (!subchapter || !chapter || !subject) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <FaExclamationTriangle className="mx-auto mb-4 text-red-500" size={48} />
          <h2 className="text-2xl font-bold text-red-600 mb-4">Sous-chapitre non trouvé</h2>
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
    <div className={`min-h-screen ${isFullscreen ? 'fixed inset-0 z-50 bg-white' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'}`}>
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => navigate(`/student/chapter/${chapterId}`, {
                  state: { chapter, subject, grade, subjectId }
                })}
                className="flex items-center text-gray-600 hover:text-gray-800 mr-4 bg-white/60 rounded-full px-4 py-2 transition-colors"
              >
                <FaArrowLeft className="mr-2" size={16} />
                Retour
              </button>
              <div className="flex items-center">
                <FaBookOpen className="text-blue-600 mr-3" size={24} />
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">{subchapter.title}</h1>
                  <p className="text-gray-600">
                    {chapter.title} • {subject.name} • {grade.toUpperCase()}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Bouton plein écran */}
            {selectedLesson && (
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                {isFullscreen ? <FaCompress className="mr-2" /> : <FaExpand className="mr-2" />}
                {isFullscreen ? 'Quitter' : 'Plein écran'}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Contenu */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Description du sous-chapitre */}
        {subchapter.description && !isFullscreen && (
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 mb-8">
            <p className="text-gray-700 text-lg">{subchapter.description}</p>
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
              <p className="text-gray-600 text-lg">Chargement des cours...</p>
            </div>
          </div>
        ) : lessons.length === 0 ? (
          /* Aucun cours */
          <div className="text-center py-16">
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-12 shadow-lg border border-white/20">
              <FaBook className="mx-auto mb-6 text-gray-400" size={64} />
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Aucun cours disponible
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Les cours de ce sous-chapitre n'ont pas encore été créés par votre professeur.
              </p>
            </div>
          </div>
        ) : (
          /* Interface avec cours */
          <div className={`grid ${isFullscreen ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-4'} gap-8`}>
            {/* Liste des cours (sidebar en mode normal) */}
            {!isFullscreen && (
              <div className="lg:col-span-1">
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 sticky top-8">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">
                    Cours disponibles ({lessons.length})
                  </h3>
                  
                  <div className="space-y-3">
                    {lessons.map((lesson, index) => (
                      <button
                        key={lesson.id}
                        onClick={() => setSelectedLesson(lesson)}
                        className={`w-full text-left p-4 rounded-lg transition-all duration-200 ${
                          selectedLesson?.id === lesson.id
                            ? 'bg-blue-600 text-white shadow-lg'
                            : 'bg-white/60 hover:bg-white/80 text-gray-800'
                        }`}
                      >
                        <div className="flex items-center mb-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3 ${
                            selectedLesson?.id === lesson.id
                              ? 'bg-white/20 text-white'
                              : 'bg-blue-100 text-blue-600'
                          }`}>
                            {index + 1}
                          </div>
                          <FaPlay className={`${
                            selectedLesson?.id === lesson.id ? 'text-white' : 'text-blue-600'
                          }`} size={14} />
                        </div>
                        <h4 className="font-medium text-sm line-clamp-2">
                          {lesson.title}
                        </h4>
                        <div className="flex items-center mt-2 text-xs opacity-75">
                          <FaClock className="mr-1" size={10} />
                          <span>15 min</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Contenu du cours sélectionné */}
            <div className={isFullscreen ? 'col-span-1' : 'lg:col-span-3'}>
              {selectedLesson ? (
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
                  {/* Header du cours */}
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
                    <h2 className="text-2xl font-bold mb-2">{selectedLesson.title}</h2>
                    <div className="flex items-center space-x-4 text-blue-100">
                      <div className="flex items-center">
                        <FaUser className="mr-2" size={14} />
                        <span>Professeur</span>
                      </div>
                      <div className="flex items-center">
                        <FaCalendarAlt className="mr-2" size={14} />
                        <span>
                          {selectedLesson.createdAt?.toDate?.()?.toLocaleDateString('fr-FR') || 'Date inconnue'}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <FaClock className="mr-2" size={14} />
                        <span>15 min de lecture</span>
                      </div>
                    </div>
                  </div>

                  {/* Vidéo YouTube si disponible */}
                  {selectedLesson.videoUrl && extractYouTubeId(selectedLesson.videoUrl) && (
                    <div className="p-6 bg-gray-900">
                      <div className="flex items-center mb-4">
                        <FaYoutube className="text-red-500 mr-2" size={20} />
                        <h3 className="text-white font-medium">Vidéo explicative</h3>
                      </div>
                      <div className="relative aspect-video rounded-lg overflow-hidden">
                        <iframe
                          src={`https://www.youtube.com/embed/${extractYouTubeId(selectedLesson.videoUrl)}`}
                          title="Vidéo du cours"
                          className="absolute inset-0 w-full h-full"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    </div>
                  )}

                  {/* Contenu du cours */}
                  <div className="p-6">
                    <div className="prose prose-lg max-w-none">
                      <ReactMarkdown
                        components={{
                          h1: ({children}) => <h1 className="text-3xl font-bold text-gray-900 mt-8 mb-4 border-b-2 border-blue-200 pb-2">{children}</h1>,
                          h2: ({children}) => <h2 className="text-2xl font-bold text-gray-900 mt-6 mb-3">{children}</h2>,
                          h3: ({children}) => <h3 className="text-xl font-semibold text-gray-900 mt-5 mb-2">{children}</h3>,
                          p: ({children}) => <p className="text-gray-700 mb-4 leading-relaxed text-lg">{children}</p>,
                          ul: ({children}) => <ul className="list-disc list-inside mb-4 text-gray-700 space-y-2">{children}</ul>,
                          ol: ({children}) => <ol className="list-decimal list-inside mb-4 text-gray-700 space-y-2">{children}</ol>,
                          li: ({children}) => <li className="mb-1">{children}</li>,
                          blockquote: ({children}) => (
                            <blockquote className="border-l-4 border-blue-500 bg-blue-50 pl-6 py-4 italic text-gray-700 mb-4 rounded-r-lg">
                              {children}
                            </blockquote>
                          ),
                          code: ({children}) => <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-red-600">{children}</code>,
                          pre: ({children}) => <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4">{children}</pre>,
                          a: ({children, href}) => (
                            <a href={href} className="text-blue-600 hover:text-blue-800 underline font-medium" target="_blank" rel="noopener noreferrer">
                              {children}
                            </a>
                          ),
                          strong: ({children}) => <strong className="font-bold text-gray-900">{children}</strong>,
                          em: ({children}) => <em className="italic text-gray-700">{children}</em>,
                          table: ({children}) => (
                            <div className="overflow-x-auto mb-4">
                              <table className="min-w-full border border-gray-300 rounded-lg">
                                {children}
                              </table>
                            </div>
                          ),
                          th: ({children}) => <th className="border border-gray-300 px-4 py-2 bg-gray-100 font-semibold text-left">{children}</th>,
                          td: ({children}) => <td className="border border-gray-300 px-4 py-2">{children}</td>
                        }}
                      >
                        {selectedLesson.content || '*Contenu du cours en cours de chargement...*'}
                      </ReactMarkdown>
                    </div>
                  </div>

                  {/* Navigation entre les cours */}
                  <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
                    <button
                      onClick={() => {
                        const currentIndex = lessons.findIndex(l => l.id === selectedLesson.id)
                        if (currentIndex > 0) {
                          setSelectedLesson(lessons[currentIndex - 1])
                        }
                      }}
                      disabled={lessons.findIndex(l => l.id === selectedLesson.id) === 0}
                      className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <FaArrowLeft className="mr-2" size={14} />
                      Cours précédent
                    </button>

                    <div className="text-sm text-gray-600">
                      Cours {lessons.findIndex(l => l.id === selectedLesson.id) + 1} sur {lessons.length}
                    </div>

                    <button
                      onClick={() => {
                        const currentIndex = lessons.findIndex(l => l.id === selectedLesson.id)
                        if (currentIndex < lessons.length - 1) {
                          setSelectedLesson(lessons[currentIndex + 1])
                        }
                      }}
                      disabled={lessons.findIndex(l => l.id === selectedLesson.id) === lessons.length - 1}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Cours suivant
                      <FaArrowLeft className="ml-2 rotate-180" size={14} />
                    </button>
                  </div>
                </div>
              ) : (
                /* Aucun cours sélectionné */
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-12 shadow-lg border border-white/20 text-center">
                  <FaBook className="mx-auto mb-4 text-gray-400" size={48} />
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Sélectionnez un cours
                  </h3>
                  <p className="text-gray-600">
                    Choisissez un cours dans la liste pour commencer votre apprentissage.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
