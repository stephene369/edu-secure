// pages/teacher/ManageChapters.jsx
import { useState, useEffect, useMemo } from 'react'
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy
} from 'firebase/firestore'
import { db } from '../../firebase/config'
import { useAuth } from '../../contexts/AuthContext'
import AppLayout from '../../layouts/AppLayout'
import PageHeader from '../../components/ui/PageHeader'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Select from '../../components/ui/Selectt'
import Toast from '../../components/ui/Toast'
import Badge from '../../components/ui/Badge'

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

// Helpers
const getDifficultyColor = (difficulty) => {
  switch (difficulty) {
    case 'easy': return 'success'
    case 'medium': return 'warning'
    case 'hard': return 'error'
    default: return 'default'
  }
}
const getDifficultyText = (difficulty) => {
  switch (difficulty) {
    case 'easy': return 'Facile'
    case 'medium': return 'Moyen'
    case 'hard': return 'Difficile'
    default: return difficulty || '—'
  }
}
const getStatusColor = (status) => {
  switch (status) {
    case 'published': return 'success'
    case 'draft': return 'warning'
    case 'archived': return 'error'
    default: return 'default'
  }
}
const getStatusText = (status) => {
  switch (status) {
    case 'published': return 'Publié'
    case 'draft': return 'Brouillon'
    case 'archived': return 'Archivé'
    default: return status || '—'
  }
}
const fmtDate = (ts) => {
  try {
    if (!ts?.toDate) return '—'
    return ts.toDate().toLocaleDateString()
  } catch {
    return '—'
  }
}

export default function ManageChapters() {
  const { currentUser } = useAuth()

  // Filtres
  const [filters, setFilters] = useState({
    grade: '',
    subjectId: ''  // on stocke l'ID Firestore de la matière
  })

  // Données chargées
  const [subjects, setSubjects] = useState([]) // [{id, name, ...}]
  const [chapters, setChapters] = useState([])

  // États UI
  const [subjectLoading, setSubjectLoading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)

  // Options Select dynamiques
  const subjectOptions = useMemo(() => ([
    { value: '', label: 'Toutes les matières' },
    ...subjects
      .slice()
      .sort((a, b) => (a.name || '').localeCompare(b.name || ''))
      .map(s => ({ value: s.id, label: s.name || '(Sans nom)' }))
  ]), [subjects])

  // Charger les matières quand la classe change
  useEffect(() => {
    const fetchSubjects = async () => {
      if (!filters.grade) {
        setSubjects([])
        return
      }
      try {
        setSubjectLoading(true)
        const subjectsRef = collection(db, 'classes', filters.grade, 'subjects')
        const qSubjects = query(subjectsRef, orderBy('name', 'asc'))
        const snap = await getDocs(qSubjects)
        const list = snap.docs.map(d => ({ id: d.id, ...d.data() }))
        setSubjects(list)
      } catch (err) {
        console.error(err)
        setToast({ message: 'Erreur lors du chargement des matières', type: 'error' })
      } finally {
        setSubjectLoading(false)
      }
    }

    // reset du sujet et des chapitres quand la classe change
    setFilters(prev => ({ ...prev, subjectId: '' }))
    setChapters([])
    fetchSubjects()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.grade])

  // Charger les chapitres quand on a classe + matière
  const fetchChapters = async () => {
    if (!filters.grade || !filters.subjectId) {
      setChapters([])
      return
    }
    try {
      setLoading(true)
      const chaptersRef = collection(
        db,
        'classes',
        filters.grade,
        'subjects',
        filters.subjectId,
        'chapters'
      )
      // on essaie de trier par order si présent
      const qChapters = query(chaptersRef, orderBy('order', 'asc'))
      const snap = await getDocs(qChapters)
      const chaptersData = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      setChapters(chaptersData)
    } catch (err) {
      console.error('Erreur:', err)
      setToast({ message: 'Erreur lors du chargement des chapitres', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  // Recharger quand les filtres changent (classe/sujet)
  useEffect(() => {
    fetchChapters()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.subjectId])

  const handleDeleteChapter = async (chapterId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce chapitre ?')) return

    try {
      const chapterRef = doc(
        db,
        'classes',
        filters.grade,
        'subjects',
        filters.subjectId,
        'chapters',
        chapterId
      )
      await deleteDoc(chapterRef)
      setToast({ message: 'Chapitre supprimé avec succès', type: 'success' })
      fetchChapters() // Recharger la liste
    } catch (err) {
      console.error('Erreur:', err)
      setToast({ message: 'Erreur lors de la suppression', type: 'error' })
    }
  }

  return (
    <AppLayout>
      <PageHeader 
        title="Gestion des chapitres"
        subtitle="Consultez et gérez tous vos chapitres"
        actions={
          <Button href="/teacher/add-chapter">
            + Nouveau chapitre
          </Button>
        }
      />

      {/* Filtres */}
      <Card className="w-full max-w-none mb-6">
        <Card.Body className="w-full p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              label="Classe"
              value={filters.grade}
              onChange={(e) => setFilters(prev => ({ ...prev, grade: e.target.value }))}
              options={[{ value: '', label: 'Toutes les classes' }, ...gradeOptions]}
              className="w-full"
            />

            <Select
              label={`Matière ${subjectLoading ? '(chargement...)' : ''}`}
              value={filters.subjectId}
              disabled={!filters.grade || subjectLoading || subjects.length === 0}
              onChange={(e) => setFilters(prev => ({ ...prev, subjectId: e.target.value }))}
              options={subjectOptions}
              className="w-full"
            />

            <div className="flex items-end">
              <Button 
                onClick={fetchChapters}
                loading={loading}
                className="w-full"
                disabled={!filters.grade || !filters.subjectId}
              >
                Appliquer les filtres
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Liste des chapitres */}
      <Card className="w-full max-w-none">
        <Card.Body className="w-full p-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Chargement des chapitres...</p>
            </div>
          ) : (!filters.grade || !filters.subjectId) ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Veuillez sélectionner une classe et une matière</p>
            </div>
          ) : chapters.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Aucun chapitre trouvé pour ces critères</p>
            </div>
          ) : (
            <div className="space-y-4">
              {chapters.map((chapter) => (
                <div key={chapter.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">
                          {typeof chapter.order === 'number' ? `[${chapter.order}] ` : ''}{chapter.title}
                        </h3>
                        <Badge variant={getStatusColor(chapter.status)}>
                          {getStatusText(chapter.status)}
                        </Badge>
                        <Badge variant={getDifficultyColor(chapter.difficulty)}>
                          {getDifficultyText(chapter.difficulty)}
                        </Badge>
                      </div>

                      {chapter.description && (
                        <p className="text-gray-600 mb-2">{chapter.description}</p>
                      )}

                      {chapter.objectives && (
                        <p className="text-sm text-gray-500 mb-2">
                          <strong>Objectifs:</strong> {chapter.objectives}
                        </p>
                      )}

                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        {chapter.duration && <span>⏱️ {chapter.duration}h</span>}
                        <span>📅 Créé le {fmtDate(chapter.createdAt)}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <Button 
                        size="sm" 
                        variant="outline"
                        href={`/teacher/edit-chapter/${chapter.id}?grade=${filters.grade}&subject=${filters.subjectId}`}
                      >
                        Modifier
                      </Button>
                      <Button 
                        size="sm" 
                        variant="secondary"
                        onClick={() => handleDeleteChapter(chapter.id)}
                      >
                        Supprimer
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card.Body>
      </Card>

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
