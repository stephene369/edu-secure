import { useState, useEffect } from 'react'
import { 
  collection, 
  getDocs, 
  addDoc, 
  serverTimestamp,
  query,
  orderBy 
} from 'firebase/firestore'
import { db } from '../../firebase/config'
import { useAuth } from '../../contexts/AuthContext'
import { 
  FaQuestionCircle,    // Icône principale du quiz
  FaChevronRight,      // Navigation/flèches
  FaPlus,              // Ajouter question/quiz
  FaSpinner,           // Chargement
  FaExclamationTriangle, // Erreurs
  FaCheckCircle,       // Succès
  FaBook,              // Livre/matière
  FaTrash,             // Supprimer question
  FaSave,              // Sauvegarder
  FaEye,               // Aperçu
  FaEdit,              // Éditer
  FaClock,             // Durée
  FaStar,              // Difficulté
  FaCheck,             // Validation
  FaTimes,             // Fermer/annuler
  FaArrowUp,           // Réorganiser questions
  FaArrowDown,         // Réorganiser questions
  FaCopy,              // Dupliquer question
  FaRandom             // Mélanger questions
} from 'react-icons/fa'
import AddQuestions from './AddQuestions'

export default function CreateQuiz() {
  const { currentUser } = useAuth()
  
  // États pour la navigation hiérarchique
  const [selectedGrade, setSelectedGrade] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('')
  const [selectedChapter, setSelectedChapter] = useState('')
  
  // Données chargées
  const [subjects, setSubjects] = useState([])
  const [chapters, setChapters] = useState([])
  
  // États du formulaire
  const [quizForm, setQuizForm] = useState({
    title: '',
    description: ''
  })
  
  // États de l'interface
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [creating, setCreating] = useState(false)
  const [currentQuizId, setCurrentQuizId] = useState(null)
  const [step, setStep] = useState(1) // 1: création quiz, 2: ajout questions

  // Options de classes
  const gradeOptions = [
    { value: 'cm1', label: 'CM1' },
    { value: 'cm2', label: 'CM2' },
    { value: '6eme', label: '6ème' },
    { value: '5eme', label: '5ème' },
    { value: '4eme', label: '4ème' },
    { value: '3eme', label: '3ème' },
    { value: '2nde', label: '2nde' },
    { value: '1ere', label: '1ère' },
    { value: 'terminale', label: 'Terminale' }
  ]

  // Charger les matières d'une classe
  const loadSubjects = async (grade) => {
    if (!grade) return
    
    try {
      setLoading(true)
      const subjectsRef = collection(db, 'classes', grade, 'subjects')
      const subjectsQuery = query(subjectsRef, orderBy('createdAt', 'desc'))
      const snapshot = await getDocs(subjectsQuery)
      
      const subjectsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      
      setSubjects(subjectsData)
    } catch (err) {
      console.error('Erreur lors du chargement des matières:', err)
      setError('Erreur lors du chargement des matières')
    } finally {
      setLoading(false)
    }
  }

  // Charger les chapitres d'une matière
  const loadChapters = async (grade, subjectId) => {
    if (!grade || !subjectId) return
    
    try {
      setLoading(true)
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

  // Gestionnaires de changement
  const handleGradeChange = (grade) => {
    setSelectedGrade(grade)
    setSelectedSubject('')
    setSelectedChapter('')
    setSubjects([])
    setChapters([])
    if (grade) {
      loadSubjects(grade)
    }
  }

  const handleSubjectChange = (subjectId) => {
    setSelectedSubject(subjectId)
    setSelectedChapter('')
    setChapters([])
    if (subjectId) {
      loadChapters(selectedGrade, subjectId)
    }
  }

  // Créer le quiz
  const handleCreateQuiz = async (e) => {
    e.preventDefault()
    
    if (!quizForm.title.trim()) {
      setError('Le titre du quiz est obligatoire')
      return
    }
    
    if (!selectedGrade || !selectedSubject || !selectedChapter) {
      setError('Veuillez sélectionner une classe, matière et chapitre')
      return
    }

    try {
      setCreating(true)
      setError('')
      
      const quizzesRef = collection(
        db, 
        'classes', selectedGrade, 
        'subjects', selectedSubject, 
        'chapters', selectedChapter,
        'quizzes'
      )
      
      const quizData = {
        title: quizForm.title.trim(),
        description: quizForm.description.trim(),
        createdBy: currentUser.uid,
        createdAt: serverTimestamp()
      }
      
      const docRef = await addDoc(quizzesRef, quizData)
      
      setCurrentQuizId(docRef.id)
      setSuccess('Quiz créé avec succès ! Vous pouvez maintenant ajouter des questions.')
      setStep(2)
      
    } catch (err) {
      console.error('Erreur lors de la création du quiz:', err)
      setError('Erreur lors de la création du quiz')
    } finally {
      setCreating(false)
    }
  }

  // Réinitialiser les messages
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError('')
        setSuccess('')
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [error, success])

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className="bg-indigo-600 text-white p-6 rounded-t-lg">
          <div className="flex items-center">
            <FaQuestionCircle className="mr-3" size={24} />
            <div>
              <h2 className="text-2xl font-bold">
                {step === 1 ? 'Créer un nouveau quiz' : 'Ajouter des questions'}
              </h2>
              <p className="text-indigo-100 mt-1">
                {step === 1 
                  ? 'Créez un quiz pour évaluer vos élèves sur un chapitre'
                  : 'Ajoutez des questions à votre quiz'
                }
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Messages d'état */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center mb-6">
              <FaExclamationTriangle className="mr-2 flex-shrink-0" size={20} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center mb-6">
              <FaCheckCircle className="mr-2 flex-shrink-0" size={20} />
              <span>{success}</span>
            </div>
          )}

          {step === 1 && (
            <>
              {/* Navigation hiérarchique */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  1. Sélectionnez le chapitre
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Classe */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Classe
                    </label>
                    <select
                      value={selectedGrade}
                      onChange={(e) => handleGradeChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Choisir...</option>
                      {gradeOptions.map((grade) => (
                        <option key={grade.value} value={grade.value}>
                          {grade.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Matière */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Matière
                    </label>
                    <select
                      value={selectedSubject}
                      onChange={(e) => handleSubjectChange(e.target.value)}
                      disabled={!selectedGrade || subjects.length === 0}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
                    >
                      <option value="">Choisir...</option>
                      {subjects.map((subject) => (
                        <option key={subject.id} value={subject.id}>
                          {subject.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Chapitre */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Chapitre
                    </label>
                    <select
                      value={selectedChapter}
                      onChange={(e) => setSelectedChapter(e.target.value)}
                      disabled={!selectedSubject || chapters.length === 0}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
                    >
                      <option value="">Choisir...</option>
                      {chapters.map((chapter) => (
                        <option key={chapter.id} value={chapter.id}>
                          {chapter.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Fil d'Ariane */}
                {selectedGrade && (
                  <div className="mt-4 flex items-center text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    <FaBook className="mr-2" size={14} />
                    <span className="font-medium">
                      {gradeOptions.find(g => g.value === selectedGrade)?.label}
                    </span>
                    {selectedSubject && (
                      <>
                        <FaChevronRight className="mx-2" size={12} />
                        <span>{subjects.find(s => s.id === selectedSubject)?.name}</span>
                      </>
                    )}
                    {selectedChapter && (
                      <>
                        <FaChevronRight className="mx-2" size={12} />
                        <span className="text-indigo-600 font-medium">
                          {chapters.find(c => c.id === selectedChapter)?.title}
                        </span>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Formulaire de quiz */}
              {selectedChapter && (
                <form onSubmit={handleCreateQuiz} className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    2. Informations du quiz
                  </h3>

                  {/* Titre */}
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                      Titre du quiz *
                    </label>
                    <input
                      type="text"
                      id="title"
                      value={quizForm.title}
                      onChange={(e) => setQuizForm(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Ex: Quiz - Les auxiliaires"
                      required
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      id="description"
                      value={quizForm.description}
                      onChange={(e) => setQuizForm(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Validez vos connaissances sur les auxiliaires..."
                    />
                  </div>

                  {/* Bouton de création */}
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={creating || !quizForm.title.trim()}
                      className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"                    >
                      {creating ? (
                        <>
                          <FaSpinner className="animate-spin mr-2" size={16} />
                          Création...
                        </>
                      ) : (
                        <>
                          <FaPlus className="mr-2" size={16} />
                          Créer le quiz
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* Message d'aide */}
              {!selectedChapter && (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <FaQuestionCircle className="mx-auto mb-4 text-gray-400" size={48} />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Sélectionnez un chapitre
                  </h3>
                  <p className="text-gray-500">
                    Choisissez d'abord une classe, matière et chapitre pour créer votre quiz.
                  </p>
                </div>
              )}
            </>
          )}

          {/* Étape 2: Ajout des questions */}
          {step === 2 && currentQuizId && (
            <AddQuestions 
              selectedGrade={selectedGrade}
              selectedSubject={selectedSubject}
              selectedChapter={selectedChapter}
              quizId={currentQuizId}
              quizTitle={quizForm.title}
              subjects={subjects}
              chapters={chapters}
              onBack={() => setStep(1)}
            />
          )}
        </div>
      </div>
    </div>
  )
}
