import { useEffect, useMemo, useState } from 'react'
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  query,
  orderBy
} from 'firebase/firestore'
import { db } from '../../firebase/config'
import AppLayout from '../../layouts/AppLayout'
import PageHeader from '../../components/ui/PageHeader'
import Card from '../../components/ui/Card'
import Select from '../../components/ui/Selectt'
import Button from '../../components/ui/Button'
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

const fmtDate = (ts) => {
  try {
    if (!ts?.toDate) return '—'
    return ts.toDate().toLocaleDateString()
  } catch { return '—' }
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

export default function ManageLessons() {
  const [grade, setGrade] = useState('')
  const [subjectId, setSubjectId] = useState('')

  const [subjects, setSubjects] = useState([]) // [{id, name}]
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)

  // Structure affichée :
  // chapters = [{ id, title, order, subchapters: [{ id, title, order, lessons: [{id, title, status, createdAt, order, videoUrl}]}]}]
  const [chaptersTree, setChaptersTree] = useState([])

  const subjectOptions = useMemo(() => ([
    { value: '', label: 'Sélectionnez une matière' },
    ...subjects
      .slice()
      .sort((a, b) => (a.name || '').localeCompare(b.name || ''))
      .map(s => ({ value: s.id, label: s.name || '(Sans nom)' }))
  ]), [subjects])

  // 1) Charger les matières quand la classe change
  useEffect(() => {
    const fetchSubjects = async () => {
      if (!grade) { setSubjects([]); return }
      try {
        const ref = collection(db, 'classes', grade, 'subjects')
        const snap = await getDocs(query(ref, orderBy('name', 'asc')))
        setSubjects(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      } catch (e) {
        console.error(e)
        setToast({ message: 'Erreur lors du chargement des matières', type: 'error' })
      }
    }
    setSubjectId('')
    setChaptersTree([])
    fetchSubjects()
  }, [grade])

  // 2) Charger tout l’arbre Chapitres → Sous-chapitres → Cours
  const fetchAll = async () => {
    if (!grade || !subjectId) {
      setChaptersTree([])
      return
    }
    try {
      setLoading(true)
      // Chapitres
      const chaptersRef = collection(db, 'classes', grade, 'subjects', subjectId, 'chapters')
      const chapSnap = await getDocs(query(chaptersRef, orderBy('order', 'asc')))
      const chapters = chapSnap.docs.map(d => ({ id: d.id, ...d.data() }))

      const tree = []
      for (const ch of chapters) {
        // Sous-chapitres
        const subRef = collection(db, 'classes', grade, 'subjects', subjectId, 'chapters', ch.id, 'subchapters')
        const subSnap = await getDocs(query(subRef, orderBy('order', 'asc')))
        const subs = subSnap.docs.map(d => ({ id: d.id, ...d.data() }))

        const subWithLessons = []
        for (const sc of subs) {
          // Cours
          const lessonsRef = collection(
            db, 'classes', grade,
            'subjects', subjectId,
            'chapters', ch.id,
            'subchapters', sc.id,
            'lessons'
          )
          // On essaie d'abord par order ; si tous n'ont pas order, c’est quand même OK
          const lessSnap = await getDocs(query(lessonsRef, orderBy('order', 'asc')))
          let lessons = lessSnap.docs.map(d => ({ id: d.id, ...d.data() }))

          // Fallback tri si pas d'order : par titre
          if (!lessons.some(l => typeof l.order === 'number')) {
            lessons = lessons.sort((a, b) => (a.title || '').localeCompare(b.title || ''))
          }

          subWithLessons.push({
            id: sc.id,
            title: sc.title || '(Sous-chapitre sans titre)',
            order: typeof sc.order === 'number' ? sc.order : null,
            lessons
          })
        }

        // Fallback tri sous-chapitres si besoin
        const subsSorted = subWithLessons.sort((a, b) => {
          if (a.order == null && b.order == null) return (a.title || '').localeCompare(b.title || '')
          if (a.order == null) return 1
          if (b.order == null) return -1
          return a.order - b.order
        })

        tree.push({
          id: ch.id,
          title: ch.title || '(Chapitre sans titre)',
          order: typeof ch.order === 'number' ? ch.order : null,
          subchapters: subsSorted
        })
      }

      // Tri chapitres
      const chaptersSorted = tree.sort((a, b) => {
        if (a.order == null && b.order == null) return (a.title || '').localeCompare(b.title || '')
        if (a.order == null) return 1
        if (b.order == null) return -1
        return a.order - b.order
      })

      setChaptersTree(chaptersSorted)
    } catch (e) {
      console.error(e)
      setToast({ message: 'Erreur lors du chargement des cours', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  // 3) Recharger automatiquement quand matière change
  useEffect(() => {
    fetchAll()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subjectId])

  const handleDeleteLesson = async (chapterId, subchapterId, lessonId) => {
    if (!window.confirm('Supprimer ce cours ?')) return
    try {
      setLoading(true)
      await deleteDoc(doc(
        db,
        'classes', grade,
        'subjects', subjectId,
        'chapters', chapterId,
        'subchapters', subchapterId,
        'lessons', lessonId
      ))
      setToast({ message: 'Cours supprimé', type: 'success' })
      await fetchAll()
    } catch (e) {
      console.error(e)
      setToast({ message: 'Erreur lors de la suppression', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <AppLayout>
      <PageHeader
        title="Tous les cours"
        subtitle="Choisissez la classe et la matière pour voir tous les cours, groupés par chapitre et sous-chapitre"
        actions={<Button href="/teacher/add-lesson">+ Nouveau cours</Button>}
      />

      {/* Sélection simple */}
      <Card className="w-full max-w-none mb-4">
        <Card.Body className="w-full p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              label="Classe"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              options={[{ value: '', label: 'Sélectionnez une classe' }, ...gradeOptions]}
            />
            <Select
              label="Matière"
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              disabled={!grade || subjects.length === 0}
              options={subjectOptions}
            />
            <div className="flex items-end">
              <Button
                onClick={fetchAll}
                loading={loading}
                className="w-full"
                disabled={!grade || !subjectId}
              >
                Actualiser
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Affichage groupé */}
      <Card className="w-full max-w-none">
        <Card.Body className="w-full p-0">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Chargement…</p>
            </div>
          ) : (!grade || !subjectId) ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Sélectionnez une classe et une matière</p>
            </div>
          ) : chaptersTree.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Aucun cours trouvé</p>
            </div>
          ) : (
            <div className="divide-y">
              {chaptersTree.map((ch) => (
                <div key={ch.id} className="p-4">
                  <div className="mb-2">
                    <h2 className="text-lg font-semibold">
                      {ch.order != null ? `[${ch.order}] ` : ''}{ch.title}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {ch.subchapters.reduce((acc, sc) => acc + (sc.lessons?.length || 0), 0)} cours
                    </p>
                  </div>

                  <div className="pl-4 border-l space-y-4">
                    {ch.subchapters.map((sc) => (
                      <div key={sc.id} className="p-3 rounded-lg bg-gray-50">
                        <div className="mb-2">
                          <h3 className="font-medium">
                            {sc.order != null ? `[${sc.order}] ` : ''}{sc.title}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {sc.lessons?.length || 0} cours
                          </p>
                        </div>

                        {(!sc.lessons || sc.lessons.length === 0) ? (
                          <p className="text-sm text-gray-500">Aucun cours dans ce sous-chapitre</p>
                        ) : (
                          <ul className="space-y-2">
                            {sc.lessons.map((l) => (
                              <li key={l.id} className="flex items-center justify-between bg-white border rounded p-2">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">{l.title || '(Sans titre)'}</span>
                                    <Badge variant={getStatusColor(l.status)}>{getStatusText(l.status)}</Badge>
                                  </div>
                                  <div className="text-xs text-gray-500 mt-0.5">
                                    Créé le {fmtDate(l.createdAt)}{l.order != null ? ` • Ordre ${l.order}` : ''}
                                    {l.videoUrl ? <> • 🎬 <a className="text-blue-600 hover:underline" href={l.videoUrl} target="_blank" rel="noreferrer">Vidéo</a></> : null}
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  <a
                                    className="text-blue-600 hover:underline text-sm"
                                    href={`/teacher/edit-lesson/${l.id}?grade=${grade}&subject=${subjectId}&chapter=${ch.id}&subchapter=${sc.id}`}
                                  >
                                    Modifier
                                  </a>
                                  <button
                                    className="text-red-600 hover:underline text-sm"
                                    onClick={() => handleDeleteLesson(ch.id, sc.id, l.id)}
                                  >
                                    Supprimer
                                  </button>
                                </div>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
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
