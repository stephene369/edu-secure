// pages/teacher/AddLesson.jsx
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
import { FaBook, FaChevronRight } from 'react-icons/fa'

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

export default function AddLesson() {
  const { currentUser } = useAuth()
  const [selectedGrade, setSelectedGrade] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('')
  const [selectedChapter, setSelectedChapter] = useState('')
  const [selectedSubchapter, setSelectedSubchapter] = useState('')
  const [subjects, setSubjects] = useState([])
  const [chapters, setChapters] = useState([])
  const [subchapters, setSubchapters] = useState([])
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)

  const [lessonForm, setLessonForm] = useState({
    title: '',
    content: '',
    videoUrl: ''
  })

  // Charger les matières
  const loadSubjects = async (grade) => {
    if (!grade) return
    try {
      setLoading(true)
      const subjectsRef = collection(db, 'classes', grade, 'subjects')
      const subjectsQuery = query(subjectsRef, orderBy('name', 'asc'))
      const snapshot = await getDocs(subjectsQuery)
      setSubjects(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    } catch (err) {
      console.error('Erreur:', err)
      setToast({ message: 'Erreur chargement matières', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  // Charger les chapitres
  const loadChapters = async (grade, subjectId) => {
    if (!grade || !subjectId) return
    try {
      setLoading(true)
      const chaptersRef = collection(db, 'classes', grade, 'subjects', subjectId, 'chapters')
      const chaptersQuery = query(chaptersRef, orderBy('order', 'asc'))
      const snapshot = await getDocs(chaptersQuery)
      setChapters(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    } catch (err) {
      console.error('Erreur:', err)
      setToast({ message: 'Erreur chargement chapitres', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  // Charger les sous-chapitres
  const loadSubchapters = async (grade, subjectId, chapterId) => {
    if (!grade || !subjectId || !chapterId) return
    try {
      setLoading(true)
      const subchaptersRef = collection(db, 'classes', grade, 'subjects', subjectId, 'chapters', chapterId, 'subchapters')
      const subchaptersQuery = query(subchaptersRef, orderBy('order', 'asc'))
      const snapshot = await getDocs(subchaptersQuery)
      setSubchapters(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    } catch (err) {
      console.error('Erreur:', err)
      setToast({ message: 'Erreur chargement sous-chapitres', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!lessonForm.title.trim() || !lessonForm.content.trim()) {
      setToast({ message: 'Titre et contenu sont obligatoires', type: 'error' })
      return
    }

    if (!selectedGrade || !selectedSubject || !selectedChapter || !selectedSubchapter) {
      setToast({ message: 'Veuillez sélectionner la destination', type: 'error' })
      return
    }

    try {
      setLoading(true)
      const lessonsRef = collection(
        db, 
        'classes', selectedGrade,
        'subjects', selectedSubject,
        'chapters', selectedChapter,
        'subchapters', selectedSubchapter,
        'lessons'
      )

      await addDoc(lessonsRef, {
        title: lessonForm.title.trim(),
        content: lessonForm.content.trim(),
        videoUrl: lessonForm.videoUrl.trim(),
        createdBy: currentUser.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })

      setToast({ message: 'Cours publié avec succès', type: 'success' })
      setLessonForm({ title: '', content: '', videoUrl: '' })
      
    } catch (err) {
      console.error('Erreur:', err)
      setToast({ message: 'Erreur publication cours', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <AppLayout>
      <PageHeader 
        title="Créer un cours"
        subtitle="Rédigez et publiez un nouveau cours"
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation hiérarchique */}
        <Card className="lg:col-span-1">
          <Card.Header>
            <h3 className="text-lg font-semibold text-gray-900">Destination</h3>
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
                  setSelectedSubchapter('')
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
                  setSelectedSubchapter('')
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
                onChange={(e) => {
                  setSelectedChapter(e.target.value)
                  setSelectedSubchapter('')
                  loadSubchapters(selectedGrade, selectedSubject, e.target.value)
                }}
                disabled={!selectedSubject}
                options={[
                  { value: '', label: 'Choisir...' },
                  ...chapters.map(c => ({ value: c.id, label: c.title }))
                ]}
              />

              <Select
                label="Sous-chapitre"
                value={selectedSubchapter}
                onChange={(e) => setSelectedSubchapter(e.target.value)}
                disabled={!selectedChapter}
                options={[
                  { value: '', label: 'Choisir...' },
                  ...subchapters.map(sc => ({ value: sc.id, label: sc.title }))
                ]}
              />

              {/* Fil d'Ariane */}
              {selectedGrade && (
                <div className="p-3 bg-gray-50 rounded-lg text-sm">
                  <div className="flex items-center text-gray-600">
                    <FaBook className="mr-2" size={14} />
                    <span>{gradeOptions.find(g => g.value === selectedGrade)?.label}</span>
                    {selectedSubject && (
                      <>
                        <FaChevronRight className="mx-2" size={12} />
                        <span>{subjects.find(s => s.id === selectedSubject)?.name}</span>
                      </>
                    )}
                    {selectedChapter && (
                      <>
                        <FaChevronRight className="mx-2" size={12} />
                        <span className="font-medium">{chapters.find(c => c.id === selectedChapter)?.title}</span>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </Card.Body>
        </Card>

        {/* Formulaire de cours */}
        <Card className="lg:col-span-3">
          <Card.Header>
            <h3 className="text-lg font-semibold text-gray-900">Contenu du cours</h3>
          </Card.Header>
          <Card.Body>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Titre du cours *"
                value={lessonForm.title}
                onChange={(e) => setLessonForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Introduction aux fractions..."
              />

              <Textarea
                label="Contenu du cours *"
                value={lessonForm.content}
                onChange={(e) => setLessonForm(prev => ({ ...prev, content: e.target.value }))}
                placeholder="## Introduction&#10;Votre contenu en markdown..."
                rows={12}
              />

              <Input
                label="Lien vidéo (optionnel)"
                value={lessonForm.videoUrl}
                onChange={(e) => setLessonForm(prev => ({ ...prev, videoUrl: e.target.value }))}
                placeholder="https://youtube.com/..."
                type="url"
              />

              <div className="flex gap-3 pt-4">
                <Button 
                  type="submit" 
                  loading={loading}
                  disabled={!lessonForm.title.trim() || !lessonForm.content.trim() || !selectedSubchapter}
                >
                  Publier le cours
                </Button>
                <Button type="button" variant="secondary">
                  Sauvegarder brouillon
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