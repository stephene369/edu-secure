import { useState, useEffect } from 'react'
import { 
  collection, 
  addDoc, 
  serverTimestamp,
  getDocs,
deleteDoc,
  doc
} from 'firebase/firestore'
import { db } from '../../firebase/config'
import { useAuth } from '../../contexts/AuthContext'
import { 
  FaPlus, 
  FaSpinner,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTrash,
  FaArrowLeft,
  FaQuestionCircle
} from 'react-icons/fa'

export default function AddQuestions({ 
  selectedGrade, 
  selectedSubject, 
  selectedChapter, 
  quizId, 
  quizTitle,
  subjects,
  chapters,
  onBack 
}) {
  const { currentUser } = useAuth()
  
  const [questions, setQuestions] = useState([])
  const [questionForm, setQuestionForm] = useState({
    question: '',
    type: 'multiple_choice',
    options: ['', ''],
    correctAnswer: '',
    explanation: ''
  })
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [adding, setAdding] = useState(false)

  // Charger les questions existantes
  const loadQuestions = async () => {
    try {
      setLoading(true)
      const questionsRef = collection(
        db, 
        'classes', selectedGrade, 
        'subjects', selectedSubject, 
        'chapters', selectedChapter,
        'quizzes', quizId,
        'questions'
      )
      
      const snapshot = await getDocs(questionsRef)
      const questionsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      
      setQuestions(questionsData)
    } catch (err) {
      console.error('Erreur lors du chargement des questions:', err)
      setError('Erreur lors du chargement des questions')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadQuestions()
  }, [selectedGrade, selectedSubject, selectedChapter, quizId])

  // Ajouter une option
  const addOption = () => {
    if (questionForm.options.length < 6) {
      setQuestionForm(prev => ({
        ...prev,
        options: [...prev.options, '']
      }))
    }
  }

  // Supprimer une option
  const removeOption = (index) => {
    if (questionForm.options.length > 2) {
      const newOptions = questionForm.options.filter((_, i) => i !== index)
      setQuestionForm(prev => ({
        ...prev,
        options: newOptions,
        correctAnswer: prev.correctAnswer === prev.options[index] ? '' : prev.correctAnswer
      }))
    }
  }

  // Modifier une option
  const updateOption = (index, value) => {
    const newOptions = [...questionForm.options]
    newOptions[index] = value
    setQuestionForm(prev => ({
      ...prev,
      options: newOptions
    }))
  }

  // Ajouter une question
  const handleAddQuestion = async (e) => {
    e.preventDefault()
    
    if (!questionForm.question.trim()) {
      setError('La question est obligatoire')
      return
    }
    
    if (questionForm.type === 'multiple_choice') {
      const validOptions = questionForm.options.filter(opt => opt.trim())
      if (validOptions.length < 2) {
        setError('Au moins 2 options sont requises')
        return
      }
      if (!questionForm.correctAnswer) {
        setError('Veuillez sélectionner la bonne réponse')
        return
      }
    } else if (!questionForm.correctAnswer.trim()) {
      setError('La réponse correcte est obligatoire')
      return
    }

    try {
      setAdding(true)
      setError('')
      
      const questionsRef = collection(
        db, 
        'classes', selectedGrade, 
        'subjects', selectedSubject, 
        'chapters', selectedChapter,
        'quizzes', quizId,
        'questions'
      )
      
      const questionData = {
        question: questionForm.question.trim(),
        type: questionForm.type,
        options: questionForm.type === 'multiple_choice' 
          ? questionForm.options.filter(opt => opt.trim())
          : [],
        correctAnswer: questionForm.correctAnswer.trim(),
        explanation: questionForm.explanation.trim(),
        createdBy: currentUser.uid,
        createdAt: serverTimestamp()
      }
      
      const docRef = await addDoc(questionsRef, questionData)
      
      // Ajouter à la liste locale
      setQuestions(prev => [...prev, { id: docRef.id, ...questionData }])
      
      // Réinitialiser le formulaire
      setQuestionForm({
        question: '',
        type: 'multiple_choice',
        options: ['', ''],
        correctAnswer: '',
        explanation: ''
      })
      
      setSuccess('Question ajoutée avec succès !')
      
    } catch (err) {
      console.error('Erreur lors de l\'ajout de la question:', err)
      setError('Erreur lors de l\'ajout de la question')
    } finally {
      setAdding(false)
    }
  }

  // Supprimer une question
  const handleDeleteQuestion = async (questionId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette question ?')) return
    
    try {
      await deleteDoc(doc(
        db, 
        'classes', selectedGrade, 
        'subjects', selectedSubject, 
        'chapters', selectedChapter,
        'quizzes', quizId,
        'questions', questionId
      ))
      
      setQuestions(prev => prev.filter(q => q.id !== questionId))
      setSuccess('Question supprimée')
    } catch (err) {
      console.error('Erreur lors de la suppression:', err)
      setError('Erreur lors de la suppression')
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

  const subjectName = subjects.find(s => s.id === selectedSubject)?.name || ''
  const chapterTitle = chapters.find(c => c.id === selectedChapter)?.title || ''

  return (
    <div>
      {/* Header avec retour */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-2"
          >
            <FaArrowLeft className="mr-2" size={16} />
            Retour
          </button>
          <h3 className="text-lg font-semibold text-gray-900">
            Ajouter des questions
          </h3>
          <p className="text-sm text-gray-600">
            {subjectName} • {chapterTitle} • {quizTitle}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Questions ajoutées</p>
          <p className="text-2xl font-bold text-indigo-600">{questions.length}</p>
        </div>
      </div>

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulaire d'ajout de question */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            Nouvelle question
          </h4>
          
          <form onSubmit={handleAddQuestion} className="space-y-4">
            {/* Type de question */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type de question
              </label>
              <select
                value={questionForm.type}
                onChange={(e) => setQuestionForm(prev => ({ 
                  ...prev, 
                  type: e.target.value,
                  options: e.target.value === 'multiple_choice' ? ['', ''] : [],
                  correctAnswer: ''
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="multiple_choice">Choix multiple</option>
                <option value="true_false">Vrai/Faux</option>
                <option value="short_answer">Réponse courte</option>
              </select>
            </div>

            {/* Question */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Question *
              </label>
              <textarea
                value={questionForm.question}
                onChange={(e) => setQuestionForm(prev => ({ ...prev, question: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Posez votre question ici..."
                required
              />
            </div>

            {/* Options pour choix multiple */}
            {questionForm.type === 'multiple_choice' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Options de réponse *
                </label>
                <div className="space-y-2">
                  {questionForm.options.map((option, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => updateOption(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder={`Option ${index + 1}`}
                      />
                      {questionForm.options.length > 2 && (
                        <button
                          type="button"
                          onClick={() => removeOption(index)}
                          className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <FaTrash size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                
                {questionForm.options.length < 6 && (
                  <button
                    type="button"
                    onClick={addOption}
                    className="mt-2 px-4 py-2 text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 text-sm"
                  >
                    + Ajouter une option
                  </button>
                )}
              </div>
            )}

            {/* Réponse correcte */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Réponse correcte *
              </label>
              {questionForm.type === 'multiple_choice' ? (
                <select
                  value={questionForm.correctAnswer}
                  onChange={(e) => setQuestionForm(prev => ({ ...prev, correctAnswer: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  <option value="">Sélectionner la bonne réponse</option>
                  {questionForm.options.map((option, index) => (
                    option.trim() && (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    )
                  ))}
                </select>
              ) : questionForm.type === 'true_false' ? (
                <select
                  value={questionForm.correctAnswer}
                  onChange={(e) => setQuestionForm(prev => ({ ...prev, correctAnswer: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  <option value="">Choisir...</option>
                  <option value="Vrai">Vrai</option>
                  <option value="Faux">Faux</option>
                </select>
              ) : (
                <input
                  type="text"
                  value={questionForm.correctAnswer}
                  onChange={(e) => setQuestionForm(prev => ({ ...prev, correctAnswer: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Réponse attendue"
                  required
                />
              )}
            </div>

            {/* Explication */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Explication (optionnelle)
              </label>
              <textarea
                value={questionForm.explanation}
                onChange={(e) => setQuestionForm(prev => ({ ...prev, explanation: e.target.value }))}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Expliquez pourquoi cette réponse est correcte..."
              />
            </div>

            {/* Bouton d'ajout */}
            <button
              type="submit"
              disabled={adding}
              className="w-full flex items-center justify-center px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {adding ? (
                <>
                  <FaSpinner className="animate-spin mr-2" size={16} />
                  Ajout...
                </>
              ) : (
                <>
                  <FaPlus className="mr-2" size={16} />
                  Ajouter la question
                </>
              )}
            </button>
          </form>
        </div>

        {/* Liste des questions */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            Questions du quiz ({questions.length})
          </h4>
          
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <FaSpinner className="animate-spin mr-2" size={20} />
              <span>Chargement des questions...</span>
            </div>
          ) : questions.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
              <FaQuestionCircle className="mx-auto mb-3 text-gray-400" size={32} />
              <p className="text-gray-500">Aucune question ajoutée</p>
              <p className="text-sm text-gray-400">Utilisez le formulaire pour ajouter votre première question</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {questions.map((question, index) => (
                <div key={question.id} className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="font-medium text-gray-900">
                      Question {index + 1}
                    </h5>
                    <button
                      onClick={() => handleDeleteQuestion(question.id)}
                      className="text-red-600 hover:text-red-800 p-1"
                      title="Supprimer cette question"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                  
                  <p className="text-gray-700 mb-3">{question.question}</p>
                  
                  {question.type === 'multiple_choice' && (
                    <div className="space-y-1 mb-3">
                      {question.options.map((option, optIndex) => (
                        <div
                          key={optIndex}
                          className={`text-sm px-2 py-1 rounded ${
                            option === question.correctAnswer
                              ? 'bg-green-100 text-green-800 font-medium'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {String.fromCharCode(65 + optIndex)}. {option}
                          {option === question.correctAnswer && ' ✓'}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {question.type === 'true_false' && (
                    <div className="mb-3">
                      <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded font-medium">
                        Réponse: {question.correctAnswer} ✓
                      </span>
                    </div>
                  )}
                  
                  {question.type === 'short_answer' && (
                    <div className="mb-3">
                      <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded font-medium">
                        Réponse: {question.correctAnswer} ✓
                      </span>
                    </div>
                  )}
                  
                  {question.explanation && (
                    <div className="text-sm text-gray-600 bg-blue-50 p-2 rounded">
                      <strong>Explication:</strong> {question.explanation}
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-100">
                    <span className="text-xs text-gray-500 capitalize">
                      {question.type.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-gray-400">
                      {question.createdAt?.toDate?.()?.toLocaleDateString('fr-FR') || 'Maintenant'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Actions du quiz */}
          {questions.length > 0 && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="bg-green-50 p-4 rounded-lg">
                <h5 className="font-medium text-green-900 mb-2">Quiz prêt !</h5>
                <p className="text-green-700 text-sm mb-3">
                  Votre quiz contient {questions.length} question{questions.length > 1 ? 's' : ''}. 
                  Il est maintenant disponible pour vos élèves.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={onBack}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
                  >
                    Terminer
                  </button>
                  <button
                    onClick={() => {
                      setQuestionForm({
                        question: '',
                        type: 'multiple_choice',
                        options: ['', ''],
                        correctAnswer: '',
                        explanation: ''
                      })
                    }}
                    className="px-4 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 text-sm font-medium"
                  >
                    Ajouter une autre question
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
