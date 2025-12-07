// pages/teacher/AddSubchapter.jsx
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

export default function AddSubchapter() {
  const { currentUser } = useAuth()

  // Sélections hiérarchiques
  const [grade, setGrade] = useState('')
  const [subjectId, setSubjectId] = useState('')
  const [chapterId, setChapterId] = useState('')

  // Données chargées
  const [subjects, setSubjects] = useState([])      // [{id, name, ...}]
  const [chapters, setChapters] = useState([])      // [{id, title, order, ...}]
  const [subchapters, setSubchapters] = useState([])// [{id, title, order, ...}]

  // UI
  const [subjectsLoading, setSubjectsLoading] = useState(false)
  const [chaptersLoading, setChaptersLoading] = useState(false)
  const [subchaptersLoading, setSubchaptersLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)

  // Formulaire
  const [form, setForm] = useState({
    title: '',
    description: '',
    duration: '',
    difficulty: 'medium',
    order: '' // proposé automatiquement
  })

  const subjectOptions = useMemo(
    () => [
      { value: '', label: 'Sélectionnez une matière' },
      ...subjects
        .slice()
        .sort((a, b) => (a.name || '').localeCompare(b.name || ''))
        .map(s => ({ value: s.id, label: s.name || '(Sans nom)' }))
    ],
    [subjects]
  )

  const chapterOptions = useMemo(
    () => [
      { value: '', label: 'Sélectionnez un chapitre' },
      ...chapters
        .slice()
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .map(c => ({ value: c.id, label: (typeof c.order === 'number' ? `[${c.order}] ` : '') + (c.title || '(Sans titre)') }))
    ],
    [chapters]
  )

  const canSubmit = Boolean(grade && subjectId && chapterId && form.title.trim())

  // Charger matières quand la classe change
  useEffect(() => {
    const loadSubjects = async () => {
      if (!grade) { setSubjects([]); return }
      try {
        setSubjectsLoading(true)
        const ref = collection(db, 'classes', grade, 'subjects')
        const snap = await getDocs(query(ref, orderBy('name', 'asc')))
        setSubjects(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      } catch (e) {
        console.error(e)
        setToast({ message: 'Erreur chargement des matières', type: 'error' })
      } finally {
        setSubjectsLoading(false)
      }
    }
    // reset descendants
    setSubjectId('')
    setChapterId('')
    setChapters([])
    setSubchapters([])
    setForm(prev => ({ ...prev, order: '' }))
    loadSubjects()
  }, [grade])

  // Charger chapitres quand la matière change
  useEffect(() => {
    const loadChapters = async () => {
      if (!grade || !subjectId) { setChapters([]); return }
      try {
        setChaptersLoading(true)
        const ref = collection(db, 'classes', grade, 'subjects', subjectId, 'chapters')
        const snap = await getDocs(query(ref, orderBy('order', 'asc')))
        setChapters(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      } catch (e) {
        console.error(e)
        setToast({ message: 'Erreur chargement des chapitres', type: 'error' })
      } finally {
        setChaptersLoading(false)
      }
    }
    setChapterId('')
    setSubchapters([])
    setForm(prev => ({ ...prev, order: '' }))
    loadChapters()
  }, [subjectId, grade])

  // Charger sous-chapitres quand le chapitre change (et proposer un order)
  useEffect(() => {
    const loadSubchapters = async () => {
      if (!grade || !subjectId || !chapterId) { setSubchapters([]); return }
      try {
        setSubchaptersLoading(true)
        const ref = collection(
          db,
          'classes', grade,
          'subjects', subjectId,
          'chapters', chapterId,
          'subchapters'
        )
        const snap = await getDocs(query(ref, orderBy('order', 'asc')))
        const list = snap.docs.map(d => ({ id: d.id, ...d.data() }))
        setSubchapters(list)

        // Proposer order = max + 1
        const maxOrder = list.length ? Math.max(...list.map(s => (typeof s.order === 'number' ? s.order : 0))) : -1
        const nextOrder = (Number.isFinite(maxOrder) ? maxOrder : -1) + 1
        setForm(prev => ({ ...prev, order: String(nextOrder) }))
      } catch (e) {
        console.error(e)
        setToast({ message: 'Erreur chargement des sous-chapitres', type: 'error' })
      } finally {
        setSubchaptersLoading(false)
      }
    }
    setForm(prev => ({ ...prev, order: '' }))
    loadSubchapters()
  }, [chapterId, grade, subjectId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!canSubmit) {
      setToast({ message: 'Veuillez remplir les champs obligatoires', type: 'error' })
      return
    }

    try {
      setSaving(true)
      const ref = collection(
        db,
        'classes', grade,
        'subjects', subjectId,
        'chapters', chapterId,
        'subchapters'
      )

      await addDoc(ref, {
        title: form.title.trim(),
        description: form.description.trim(),
        duration: form.duration ? Number(form.duration) : null,
        difficulty: form.difficulty,
        order: Number.isFinite(Number(form.order)) ? Number(form.order) : 0,
        grade,
        subjectId,
        chapterId,
        createdBy: currentUser?.uid || null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        status: 'draft'
      })

      setToast({ message: 'Sous-chapitre ajouté avec succès', type: 'success' })
      // reset soft : garder le contexte pour enchaîner
      setForm(prev => ({
        ...prev,
        title: '',
        description: '',
        duration: '',
        difficulty: 'medium',
        order: String((Number(prev.order) || 0) + 1)
      }))
    } catch (e) {
      console.error(e)
      setToast({ message: "Erreur lors de l'ajout du sous-chapitre", type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <AppLayout>
      <PageHeader
        title="Ajouter un sous-chapitre"
        subtitle="Créez un sous-chapitre dans un chapitre existant"
      />

      <Card className="w-full max-w-none">
        <Card.Body className="w-full p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Sélecteurs hiérarchiques */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Select
                label="Classe *"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                options={[{ value: '', label: 'Sélectionnez une classe' }, ...gradeOptions]}
              />

              <Select
                label={`Matière * ${subjectsLoading ? '(chargement...)' : ''}`}
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                disabled={!grade || subjectsLoading || subjects.length === 0}
                options={subjectOptions}
              />

              <Select
                label={`Chapitre * ${chaptersLoading ? '(chargement...)' : ''}`}
                value={chapterId}
                onChange={(e) => setChapterId(e.target.value)}
                disabled={!subjectId || chaptersLoading || chapters.length === 0}
                options={chapterOptions}
              />
            </div>

            {/* Titre / Description */}
            <Input
              label="Titre du sous-chapitre *"
              value={form.title}
              onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Ex : Additions de fractions"
            />
            <Textarea
              label="Description"
              value={form.description}
              onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Bref résumé du sous-chapitre..."
              rows={3}
            />

            {/* Options */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input
                label="Durée estimée (heures)"
                type="number"
                min="0"
                value={form.duration}
                onChange={(e) => setForm(prev => ({ ...prev, duration: e.target.value }))}
                placeholder="Ex : 2"
              />
              <Select
                label="Niveau de difficulté"
                value={form.difficulty}
                onChange={(e) => setForm(prev => ({ ...prev, difficulty: e.target.value }))}
                options={[
                  { value: 'easy', label: 'Facile' },
                  { value: 'medium', label: 'Moyen' },
                  { value: 'hard', label: 'Difficile' }
                ]}
              />
              <Input
                label={`Ordre d'affichage ${subchaptersLoading ? '(calcul...)' : ''}`}
                type="number"
                min="0"
                value={form.order}
                onChange={(e) => setForm(prev => ({ ...prev, order: e.target.value }))}
                placeholder="0,1,2…"
                disabled={!chapterId}
              />
            </div>

            {/* Aperçu des sous-chapitres existants */}
            {chapterId && (
              <div className="rounded-xl border border-gray-200 p-4">
                <p className="text-sm text-gray-600 mb-2">
                  {subchaptersLoading
                    ? 'Chargement des sous-chapitres…'
                    : subchapters.length === 0
                      ? 'Aucun sous-chapitre existant pour ce chapitre.'
                      : `Sous-chapitres existants (${subchapters.length}) :`}
                </p>
                {!subchaptersLoading && subchapters.length > 0 && (
                  <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                    {subchapters.map(sc => (
                      <li key={sc.id}>
                        <span className="font-medium">[{typeof sc.order === 'number' ? sc.order : '-'}]</span>{' '}
                        {sc.title || '(Sans titre)'}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <Button type="submit" loading={saving} disabled={!canSubmit}>
                Ajouter le sous-chapitre
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setGrade('')
                  setSubjectId('')
                  setChapterId('')
                  setSubjects([])
                  setChapters([])
                  setSubchapters([])
                  setForm({ title: '', description: '', duration: '', difficulty: 'medium', order: '' })
                }}
              >
                Réinitialiser
              </Button>
            </div>
          </form>
        </Card.Body>
      </Card>

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </AppLayout>
  )
}
