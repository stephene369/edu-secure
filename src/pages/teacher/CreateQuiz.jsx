// pages/teacher/CreateQuiz.jsx
import { useState, useEffect } from 'react'
import { collection, getDocs, addDoc, serverTimestamp, query, orderBy } from 'firebase/firestore'
import { db } from '../../firebase/config'
import { useAuth } from '../../contexts/AuthContext'
import AppLayout from '../../layouts/AppLayout'
import PageHeader from '../../components/ui/PageHeader'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Select from '../../components/ui/Selectt'
import Input from '../../components/ui/Input'
import Textarea from '../../components/ui/Textarea'
import Toast from '../../components/ui/Toast'
import { FaBook, FaChevronRight, FaPlus, FaTrash } from 'react-icons/fa'

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

export default function CreateQuiz() {
  const { currentUser } = useAuth()
  const [selectedGrade, setSelectedGrade] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('')
  const [selectedChapter, setSelectedChapter] = useState('')
  const [subjects, setSubjects] = useState([])
  const [chapters, setChapters] = useState([])
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)

  const [quizForm, setQuizForm] = useState({
    title: '',
    description: ''
  })

  const [questions, setQuestions] = useState([
    { id: 1, question: '', options: ['', '', '', ''], correctAnswer: '', type: 'multiple_choice' }
  ])

  // Chargement des données hiérarchiques
  const loadSubjects = async (grade) => {
    if (!grade) return
    try {
      const subjectsRef = collection(db, 'classes', grade, 'subjects')
      const subjectsQuery = query(subjectsRef, orderBy('name', 'asc'))
      const snapshot = await getDocs(subjectsQuery)
      setSubjects(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    } catch (err) {
      console.error('Erreur:', err)
      setToast({ message: 'Erreur chargement matières', type: 'error' })
    }
  }

  const loadChapters = async (grade, subjectId) => {
    if (!grade || !subjectId) return
    try {
      const chaptersRef = collection(db, 'classes', grade, 'subjects', subjectId, 'chapters')
      const chaptersQuery = query(chaptersRef, orderBy('order', 'asc'))
      const snapshot = await getDocs(chaptersQuery)
      setChapters(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    } catch (err) {
      console.error('Erreur:', err)
      setToast({ message: 'Erreur chargement chapitres', type: 'error' })
    }
  }

  // Gestion des questions
  const addQuestion = () => {
    setQuestions(prev => [...prev, { 
      id: Date.now(), 
      question: '', 
      options: ['', '', '', ''], 
      correctAnswer: '', 
      type: 'multiple_choice' 
    }])
  }

  const removeQuestion = (id) => {
    if (questions.length > 1) {
      setQuestions(prev => prev.filter(q => q.id !== id))
    }
  }

  const updateQuestion = (id, field, value) => {
    setQuestions(prev => prev.map(q => 
      q.id === id ? { ...q, [field]: value } : q
    ))
  }

  const updateOption = (questionId, optionIndex, value) => {
    setQuestions(prev => prev.map(q => {
      if (q.id === questionId) {
        const newOptions = [...q.options]
        newOptions[optionIndex] = value
        return { ...q, options: newOptions }
      }
      return q
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!quizForm.title.trim() || !selectedGrade || !selectedSubject || !selectedChapter) {
      setToast({ message: 'Informations manquantes', type: 'error' })
      return
    }

    // Validation des questions
    for (const q of questions) {
      if (!q.question.trim() || !q.correctAnswer.trim()) {
        setToast({ message: 'Questions incomplètes', type: 'error' })
        return
      }
    }

    try {
      setLoading(true)
      
      // Créer le quiz
      const quizzesRef = collection(
        db, 
        'classes', selectedGrade,
        'subjects', selectedSubject,
        'chapters', selectedChapter,
        'quizzes'
      )

      const quizDoc = await addDoc(quizzesRef, {
        title: quizForm.title.trim(),
        description: quizForm.description.trim(),
        questionCount: questions.length,
        createdBy: currentUser.uid,
        createdAt: serverTimestamp()
      })

      // Ajouter les questions
      const questionsRef = collection(quizzesRef, quizDoc.id, 'questions')
      await Promise.all(
        questions.map((q, index) => 
          addDoc(questionsRef, {
            question: q.question.trim(),
            options: q.options.filter(opt => opt.trim()),
            correctAnswer: q.correctAnswer.trim(),
            type: q.type,
            order: index + 1,
            createdBy: currentUser.uid,
            createdAt: serverTimestamp()
          })
        )
      )

      setToast({ message: `Quiz créé avec ${questions.length} questions`, type: 'success' })
      setQuizForm({ title: '', description: '' })
      setQuestions([{ id: 1, question: '', options: ['', '', '', ''], correctAnswer: '', type: 'multiple_choice' }])
      
    } catch (err) {
      console.error('Erreur:', err)
      setToast({ message: 'Erreur création quiz', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <AppLayout>
      <PageHeader 
        title="Créer un quiz"
        subtitle="Évaluez vos élèves avec un nouveau quiz"
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Configuration */}
        <Card className="lg:col-span-1">
          <Card.Header>
            <h3 className="text-lg font-semibold text-gray-900">Configuration</h3>
          </Card.Header>
          <Card.Body>
            <div className="space-y-4">
              <Select
                label="Classe"
                value={selectedGrade}
                onChange={(e) => {
                  setSelectedGrade(e.target.value)
                  setSelectedSubject('')
                  setSelectedChapter('')
                  loadSubjects(e.target.value)
                }}
                options={[{ value: '', label: 'Choisir...' }, ...gradeOptions]}
              />

              <Select
                label="Matière"
                value={selectedSubject}
                onChange={(e) => {
                  setSelectedSubject(e.target.value)
                  setSelectedChapter('')
                  loadChapters(selectedGrade, e.target.value)
                }}
                disabled={!selectedGrade}
                options={[
                  { value: '', label: 'Choisir...' },
                  ...subjects.map(s => ({ value: s.id, label: s.name }))
                ]}
              />

              <Select
                label="Chapitre"
                value={selectedChapter}
                onChange={(e) => setSelectedChapter(e.target.value)}
                disabled={!selectedSubject}
                options={[
                  { value: '', label: 'Choisir...' },
                  ...chapters.map(c => ({ value: c.id, label: c.title }))
                ]}
              />
            </div>
          </Card.Body>
        </Card>

        {/* Formulaire principal */}
        <Card className="lg:col-span-3">
          <Card.Header>
            <h3 className="text-lg font-semibold text-gray-900">Détails du quiz</h3>
          </Card.Header>
          <Card.Body>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Titre du quiz *"
                value={quizForm.title}
                onChange={(e) => setQuizForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Quiz sur les verbes..."
              />

              <Textarea
                label="Description"
                value={quizForm.description}
                onChange={(e) => setQuizForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Description du quiz..."
                rows={3}
              />

              {/* Questions */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-semibold text-gray-900">Questions</h4>
                  <Button type="button" variant="secondary" onClick={addQuestion}>
                    <FaPlus className="mr-2" size={14} />
                    Ajouter question
                  </Button>
                </div>

                {questions.map((q, index) => (
                  <Card key={q.id} className="relative">
                    <Card.Body>
                      <div className="flex items-start justify-between mb-4">
                        <h5 className="font-medium text-gray-900">Question {index + 1}</h5>
                        {questions.length > 1 && (
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => removeQuestion(q.id)}
                          >
                            <FaTrash size={12} />
                          </Button>
                        )}
                      </div>

                      <Textarea
                        label="Question *"
                        value={q.question}
                        onChange={(e) => updateQuestion(q.id, 'question', e.target.value)}
                        placeholder="Posez votre question..."
                        rows={2}
                      />

                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Options de réponse
                        </label>
                        <div className="space-y-2">
                          {q.options.map((option, optIndex) => (
                            <div key={optIndex} className="flex items-center gap-2">
                              <input
                                type="radio"
                                name={`correct-${q.id}`}
                                checked={q.correctAnswer === option}
                                onChange={() => updateQuestion(q.id, 'correctAnswer', option)}
                                className="text-gray-600"
                              />
                              <Input
                                value={option}
                                onChange={(e) => updateOption(q.id, optIndex, e.target.value)}
                                placeholder={`Option ${optIndex + 1}`}
                                className="flex-1"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                ))}
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  type="submit" 
                  loading={loading}
                  disabled={!quizForm.title.trim() || !selectedChapter || questions.some(q => !q.question.trim() || !q.correctAnswer.trim())}
                >
                  Créer le quiz
                </Button>
                <Button type="button" variant="secondary">
                  Prévisualiser
                </Button>
              </div>
            </form>
          </Card.Body>
        </Card>
      </div>

      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </AppLayout>
  )
}