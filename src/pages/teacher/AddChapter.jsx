// pages/teacher/AddChapter.jsx
import { useEffect, useMemo, useState } from 'react'
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  query,
  orderBy
} from 'firebase/firestore'
import { db } from '../../firebase/config'
import { useAuth } from '../../contexts/AuthContext'
import AppLayout from '../../layouts/AppLayout'
import PageHeader from '../../components/ui/PageHeader'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Selectt'
import Textarea from '../../components/ui/Textarea'
import Toast from '../../components/ui/Toast'

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

export default function AddChapter() {
  const { currentUser } = useAuth()

  // ----------------- Form State -----------------
  const [formData, setFormData] = useState({
    title: '',
    grade: '',
    subjectId: '',
    subjectName: '',
    description: '',
    objectives: '',
    duration: '',
    difficulty: 'medium',
    order: '' // on propose automatiquement mais laisse modifiable
  })

  // ----------------- UI State -----------------
  const [subjects, setSubjects] = useState([]) // [{id, name, ...}]
  const [subjectsLoading, setSubjectsLoading] = useState(false)

  const [chapters, setChapters] = useState([]) // [{id, title, order, ...}]
  const [chaptersLoading, setChaptersLoading] = useState(false)

  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)

  // ----------------- Helpers -----------------
  const subjectOptions = useMemo(
    () => [
      { value: '', label: 'Sélectionnez une matière' },
      ...subjects
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(s => ({ value: s.id, label: s.name }))
    ],
    [subjects]
  )

  const canSubmit = Boolean(
    formData.title.trim() &&
    formData.grade &&
    formData.subjectId
  )

  // ----------------- Effects: Load subjects when grade changes -----------------
  useEffect(() => {
    const fetchSubjects = async () => {
      if (!formData.grade) {
        setSubjects([])
        return
      }
      try {
        setSubjectsLoading(true)
        setSubjects([])

        const subjectsRef = collection(db, 'classes', formData.grade, 'subjects')
        const qSubjects = query(subjectsRef, orderBy('name', 'asc'))
        const snap = await getDocs(qSubjects)

        const list = snap.docs.map(d => ({ id: d.id, ...d.data() }))
        setSubjects(list)
      } catch (err) {
        console.error(err)
        setToast({ message: "Erreur lors du chargement des matières", type: 'error' })
      } finally {
        setSubjectsLoading(false)
      }
    }

    // reset dependent fields
    setFormData(prev => ({
      ...prev,
      subjectId: '',
      subjectName: '',
      order: ''
    }))
    setChapters([])
    fetchSubjects()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.grade])

  // ----------------- Effects: Load chapters when subject changes -----------------
  useEffect(() => {
    const fetchChapters = async () => {
      if (!formData.grade || !formData.subjectId) {
        setChapters([])
        return
      }
      try {
        setChaptersLoading(true)
        const chaptersRef = collection(
          db,
          'classes',
          formData.grade,
          'subjects',
          formData.subjectId,
          'chapters'
        )
        const qChapters = query(chaptersRef, orderBy('order', 'asc'))
        const snap = await getDocs(qChapters)
        const list = snap.docs.map(d => ({ id: d.id, ...d.data() }))
        setChapters(list)

        // proposer un "order" automatiquement = max(order) + 1
        const maxOrder = list.length
          ? Math.max(...list.map(c => (typeof c.order === 'number' ? c.order : 0)))
          : -1
        const nextOrder = (Number.isFinite(maxOrder) ? maxOrder : -1) + 1

        setFormData(prev => ({
          ...prev,
          order: String(nextOrder) // garder en string pour <Input type="number">
        }))
      } catch (err) {
        console.error(err)
        setToast({ message: "Erreur lors du chargement des chapitres", type: 'error' })
      } finally {
        setChaptersLoading(false)
      }
    }

    // maj du subjectName selon la sélection
    const chosen = subjects.find(s => s.id === formData.subjectId)
    setFormData(prev => ({ ...prev, subjectName: chosen?.name || '' }))

    fetchChapters()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.subjectId])

  // ----------------- Submit -----------------
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!canSubmit) {
      setToast({ message: 'Veuillez remplir tous les champs obligatoires', type: 'error' })
      return
    }

    try {
      setLoading(true)

      const chaptersRef = collection(
        db,
        'classes',
        formData.grade,
        'subjects',
        formData.subjectId,
        'chapters'
      )

      const numericOrder = Number.isFinite(Number(formData.order))
        ? Number(formData.order)
        : 0

      await addDoc(chaptersRef, {
        title: formData.title.trim(),
        description: formData.description.trim(),
        objectives: formData.objectives.trim(),
        duration: formData.duration ? Number(formData.duration) : null,
        difficulty: formData.difficulty,
        order: numericOrder,
        subjectId: formData.subjectId,
        subjectName: formData.subjectName || null,
        grade: formData.grade,
        createdBy: currentUser?.uid || null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        status: 'draft'
      })

      setToast({ message: 'Chapitre ajouté avec succès', type: 'success' })

      // reset minimal (on garde grade sélectionnée pour enchaîner la création)
      setFormData(prev => ({
        ...prev,
        title: '',
        description: '',
        objectives: '',
        duration: '',
        difficulty: 'medium',
        order: String((Number(prev.order) || 0) + 1) // propose le suivant
      }))
    } catch (err) {
      console.error('Erreur:', err)
      setToast({ message: "Erreur lors de l'ajout du chapitre", type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  // ----------------- Render -----------------
  return (
    <AppLayout>
      <PageHeader 
        title="Ajouter un chapitre"
        subtitle="Créez un nouveau chapitre pour votre matière"
      />

      <Card className="w-full max-w-none">
        <Card.Body className="w-full p-6">
          <form onSubmit={handleSubmit} className="w-full space-y-6">
            {/* Grade + Subject */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label="Classe *"
                value={formData.grade}
                onChange={(e) =>
                  setFormData(prev => ({ ...prev, grade: e.target.value }))
                }
                options={[{ value: '', label: 'Sélectionnez une classe' }, ...gradeOptions]}
                className="w-full"
              />

              <Select
                label={`Matière * ${subjectsLoading ? '(chargement...)' : ''}`}
                value={formData.subjectId}
                disabled={!formData.grade || subjectsLoading || subjects.length === 0}
                onChange={(e) =>
                  setFormData(prev => ({ ...prev, subjectId: e.target.value }))
                }
                options={subjectOptions}
                className="w-full"
              />
            </div>

            <Input
              label="Titre du chapitre *"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Ex: Les fractions, La révolution française..."
              className="w-full"
            />

            <Textarea
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Décrivez brièvement ce chapitre..."
              rows={3}
              className="w-full"
            />

            <Textarea
              label="Objectifs d'apprentissage"
              value={formData.objectives}
              onChange={(e) => setFormData(prev => ({ ...prev, objectives: e.target.value }))}
              placeholder="Quels sont les objectifs pédagogiques de ce chapitre ?"
              rows={3}
              className="w-full"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input
                label="Durée estimée (heures)"
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                placeholder="Ex: 10"
                className="w-full"
                min="0"
              />

              <Select
                label="Niveau de difficulté"
                value={formData.difficulty}
                onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value }))}
                options={[
                  { value: 'easy', label: 'Facile' },
                  { value: 'medium', label: 'Moyen' },
                  { value: 'hard', label: 'Difficile' }
                ]}
                className="w-full"
              />

              <Input
                label={`Ordre d'affichage ${chaptersLoading ? '(calcul...)' : ''}`}
                type="number"
                value={formData.order}
                onChange={(e) => setFormData(prev => ({ ...prev, order: e.target.value }))}
                placeholder="Ex: 0, 1, 2…"
                className="w-full"
                min="0"
                disabled={!formData.subjectId}
              />
            </div>

            {/* Aperçu rapide des chapitres existants */}
            {formData.subjectId && (
              <div className="rounded-xl border border-gray-200 p-4">
                <p className="text-sm text-gray-600 mb-2">
                  {chaptersLoading
                    ? 'Chargement des chapitres…'
                    : chapters.length === 0
                      ? 'Aucun chapitre existant pour cette matière.'
                      : `Chapitres existants (${chapters.length}) :`}
                </p>
                {!chaptersLoading && chapters.length > 0 && (
                  <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                    {chapters.map(c => (
                      <li key={c.id}>
                        <span className="font-medium">[{typeof c.order === 'number' ? c.order : '-'}]</span>{' '}
                        {c.title || '(Sans titre)'}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button 
                type="submit" 
                loading={loading}
                disabled={!canSubmit}
                className="flex-1"
              >
                Ajouter le chapitre
              </Button>
              <Button 
                type="button" 
                variant="secondary"
                onClick={() => {
                  setFormData({
                    title: '',
                    grade: '',
                    subjectId: '',
                    subjectName: '',
                    description: '',
                    objectives: '',
                    duration: '',
                    difficulty: 'medium',
                    order: ''
                  })
                  setSubjects([])
                  setChapters([])
                }}
                className="flex-1"
              >
                Réinitialiser
              </Button>
            </div>
          </form>
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
