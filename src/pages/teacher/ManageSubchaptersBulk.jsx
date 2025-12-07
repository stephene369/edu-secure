// pages/teacher/ManageSubchaptersBulk.jsx
import { useEffect, useMemo, useState } from 'react'
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
  writeBatch,
  updateDoc
} from 'firebase/firestore'
import { db } from '../../firebase/config'
import AppLayout from '../../layouts/AppLayout'
import PageHeader from '../../components/ui/PageHeader'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Select from '../../components/ui/Selectt'
import Input from '../../components/ui/Input'
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

export default function ManageSubchaptersBulk() {
  // Filtres hiérarchiques
  const [grade, setGrade] = useState('')
  const [subjectId, setSubjectId] = useState('')
  const [chapterId, setChapterId] = useState('')

  // Données
  const [subjects, setSubjects] = useState([])        // [{id, name}]
  const [chapters, setChapters] = useState([])        // [{id, title, order}]
  const [subchapters, setSubchapters] = useState([])  // [{id, title, order, status, ...}]

  // UI
  const [subjectsLoading, setSubjectsLoading] = useState(false)
  const [chaptersLoading, setChaptersLoading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)

  // Recherche & tri
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('order') // 'order' | 'title'

  // Sélection multiple
  const [selected, setSelected] = useState(new Set()) // Set<id>

  // Édition rapide d'ordre : { [id]: "2" }
  const [editedOrders, setEditedOrders] = useState({})

  const subjectOptions = useMemo(() => ([
    { value: '', label: 'Toutes les matières' },
    ...subjects
      .slice()
      .sort((a, b) => (a.name || '').localeCompare(b.name || ''))
      .map(s => ({ value: s.id, label: s.name || '(Sans nom)' }))
  ]), [subjects])

  const chapterOptions = useMemo(() => ([
    { value: '', label: 'Tous les chapitres' },
    ...chapters
      .slice()
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map(c => ({ value: c.id, label: (typeof c.order === 'number' ? `[${c.order}] ` : '') + (c.title || '(Sans titre)') }))
  ]), [chapters])

  // Liste filtrée/triée côté client
  const visibleSubchapters = useMemo(() => {
    const q = search.trim().toLowerCase()
    let list = subchapters.filter(sc =>
      !q || (sc.title || '').toLowerCase().includes(q)
    )
    if (sortBy === 'title') {
      list = list.slice().sort((a, b) => (a.title || '').localeCompare(b.title || ''))
    } else {
      list = list.slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    }
    return list
  }, [subchapters, search, sortBy])

  // Charger matières quand classe change
  useEffect(() => {
    const fetchSubjects = async () => {
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
    setSelected(new Set())
    setEditedOrders({})
    fetchSubjects()
  }, [grade])

  // Charger chapitres quand matière change
  useEffect(() => {
    const fetchChapters = async () => {
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
    setSelected(new Set())
    setEditedOrders({})
    fetchChapters()
  }, [subjectId, grade])

  // Charger sous-chapitres quand les 3 filtres sont prêts
  const fetchSubchapters = async () => {
    if (!grade || !subjectId || !chapterId) {
      setSubchapters([])
      setSelected(new Set())
      setEditedOrders({})
      return
    }
    try {
      setLoading(true)
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
      setSelected(new Set())
      setEditedOrders({})
    } catch (e) {
      console.error(e)
      setToast({ message: 'Erreur chargement des sous-chapitres', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSubchapters()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapterId])

  // ----- Sélection -----
  const toggleOne = (id) => {
    setSelected(prev => {
      const copy = new Set(prev)
      if (copy.has(id)) copy.delete(id)
      else copy.add(id)
      return copy
    })
  }
  const selectAll = () => {
    setSelected(new Set(visibleSubchapters.map(sc => sc.id)))
  }
  const clearSelection = () => {
    setSelected(new Set())
  }
  const allSelected = selected.size > 0 && visibleSubchapters.every(sc => selected.has(sc.id))

  // ----- Actions en lot -----
  const handleBulkDelete = async () => {
    if (selected.size === 0) return
    if (!window.confirm(`Supprimer ${selected.size} sous-chapitre(s) ?`)) return
    try {
      setLoading(true)
      const ids = Array.from(selected)
      // Suppressions séquentielles (simple et sûr) ; si tu veux, on peut basculer en batch + Cloud Functions
      for (const id of ids) {
        const ref = doc(
          db,
          'classes', grade,
          'subjects', subjectId,
          'chapters', chapterId,
          'subchapters', id
        )
        await deleteDoc(ref)
      }
      setToast({ message: 'Sous-chapitres supprimés', type: 'success' })
      await fetchSubchapters()
    } catch (e) {
      console.error(e)
      setToast({ message: 'Erreur lors de la suppression en lot', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleBulkStatus = async (status) => {
    if (selected.size === 0) return
    try {
      setLoading(true)
      const ids = Array.from(selected)
      const batch = writeBatch(db)
      for (const id of ids) {
        const ref = doc(
          db,
          'classes', grade,
          'subjects', subjectId,
          'chapters', chapterId,
          'subchapters', id
        )
        batch.update(ref, { status })
      }
      await batch.commit()
      setToast({ message: `Statut mis à jour (${status})`, type: 'success' })
      await fetchSubchapters()
    } catch (e) {
      console.error(e)
      setToast({ message: 'Erreur mise à jour du statut', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  // ----- Sauvegarde des ordres -----
  const saveEditedOrders = async () => {
    const entries = Object.entries(editedOrders)
      .filter(([, v]) => v !== '' && !isNaN(Number(v)))
    if (entries.length === 0) return

    try {
      setLoading(true)
      const batch = writeBatch(db)
      for (const [id, val] of entries) {
        const ref = doc(
          db,
          'classes', grade,
          'subjects', subjectId,
          'chapters', chapterId,
          'subchapters', id
        )
        batch.update(ref, { order: Number(val) })
      }
      await batch.commit()
      setToast({ message: 'Ordres enregistrés', type: 'success' })
      await fetchSubchapters()
    } catch (e) {
      console.error(e)
      setToast({ message: 'Erreur enregistrement des ordres', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <AppLayout>
      <PageHeader
        title="Gerer les sous-chapitres"
        subtitle="Filtrez, supprimez, modifiez le statut et l’ordre de vos sous-chapitres"
        actions={<Button href="/teacher/add-subchapter">+ Nouveau sous-chapitre</Button>}
      />

      {/* Filtres */}
      <Card className="w-full max-w-none mb-4">
        <Card.Body className="w-full p-6">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <Select
              label="Classe"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              options={[{ value: '', label: 'Toutes les classes' }, ...gradeOptions]}
            />
            <Select
              label={`Matière ${subjectsLoading ? '(chargement...)' : ''}`}
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              disabled={!grade || subjectsLoading || subjects.length === 0}
              options={[
                { value: '', label: 'Toutes les matières' },
                ...subjectOptions
              ]}
            />
            <Select
              label={`Chapitre ${chaptersLoading ? '(chargement...)' : ''}`}
              value={chapterId}
              onChange={(e) => setChapterId(e.target.value)}
              disabled={!subjectId || chaptersLoading || chapters.length === 0}
              options={[
                { value: '', label: 'Tous les chapitres' },
                ...chapterOptions
              ]}
            />

            <Input
              label="Recherche (titre)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tapez pour filtrer…"
            />

            <Select
              label="Trier par"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              options={[
                { value: 'order', label: 'Ordre' },
                { value: 'title', label: 'Titre' }
              ]}
            />

            <div className="flex items-end">
              <Button
                onClick={fetchSubchapters}
                loading={loading}
                className="w-full"
                disabled={!grade || !subjectId || !chapterId}
              >
                Actualiser
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Actions en lot */}
      <Card className="w-full max-w-none mb-4">
        <Card.Body className="w-full p-4">
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="secondary" onClick={selectAll} disabled={visibleSubchapters.length === 0}>Tout sélectionner</Button>
            <Button variant="secondary" onClick={clearSelection} disabled={selected.size === 0}>Tout désélectionner</Button>
            <div className="h-6 w-px bg-gray-300 mx-1" />
            <Button variant="secondary" onClick={() => handleBulkStatus('published')} disabled={selected.size === 0}>Marquer “Publié”</Button>
            <Button variant="secondary" onClick={() => handleBulkStatus('draft')} disabled={selected.size === 0}>Marquer “Brouillon”</Button>
            <Button variant="secondary" onClick={() => handleBulkStatus('archived')} disabled={selected.size === 0}>Archiver</Button>
            <div className="h-6 w-px bg-gray-300 mx-1" />
            <Button variant="secondary" onClick={saveEditedOrders} disabled={Object.keys(editedOrders).length === 0}>Enregistrer les ordres</Button>
            <div className="h-6 w-px bg-gray-300 mx-1" />
            <Button variant="danger" onClick={handleBulkDelete} disabled={selected.size === 0}>Supprimer la sélection</Button>
            <span className="text-sm text-gray-500 ml-auto">
              {selected.size} sélectionné(s){allSelected ? ' (tous)' : ''}
            </span>
          </div>
        </Card.Body>
      </Card>

      {/* Liste */}
      <Card className="w-full max-w-none">
        <Card.Body className="w-full p-0">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Chargement…</p>
            </div>
          ) : (!grade || !subjectId || !chapterId) ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Sélectionnez une classe, une matière et un chapitre</p>
            </div>
          ) : visibleSubchapters.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Aucun sous-chapitre trouvé</p>
            </div>
          ) : (
            <div className="divide-y">
              {visibleSubchapters.map((sc) => (
                <div key={sc.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-start gap-4">
                    <input
                      type="checkbox"
                      className="mt-1"
                      checked={selected.has(sc.id)}
                      onChange={() => toggleOne(sc.id)}
                    />

                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <div className="flex items-center gap-2">
                          <label className="text-sm text-gray-500">Ordre</label>
                          <input
                            type="number"
                            className="w-20 border rounded px-2 py-1"
                            value={
                              sc.id in editedOrders
                                ? editedOrders[sc.id]
                                : (typeof sc.order === 'number' ? sc.order : '')
                            }
                            onChange={(e) =>
                              setEditedOrders(prev => ({ ...prev, [sc.id]: e.target.value }))
                            }
                          />
                        </div>

                        <h3 className="text-base font-semibold">
                          {sc.title || '(Sans titre)'}
                        </h3>

                        <Badge variant={getStatusColor(sc.status)}>
                          {getStatusText(sc.status)}
                        </Badge>
                        <Badge variant={getDifficultyColor(sc.difficulty)}>
                          {getDifficultyText(sc.difficulty)}
                        </Badge>
                      </div>

                      {sc.description && (
                        <p className="text-gray-600 mb-1">{sc.description}</p>
                      )}

                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        {typeof sc.duration === 'number' && <span>⏱️ {sc.duration}h</span>}
                        <span>📅 Créé le {fmtDate(sc.createdAt)}</span>
                        <a
                          href={`/teacher/edit-subchapter/${sc.id}?grade=${grade}&subject=${subjectId}&chapter=${chapterId}`}
                          className="text-blue-600 hover:underline"
                        >
                          Modifier
                        </a>
                        <button
                          className="text-red-600 hover:underline"
                          onClick={async () => {
                            if (!window.confirm('Supprimer ce sous-chapitre ?')) return
                            try {
                              setLoading(true)
                              await deleteDoc(doc(
                                db,
                                'classes', grade,
                                'subjects', subjectId,
                                'chapters', chapterId,
                                'subchapters', sc.id
                              ))
                              setToast({ message: 'Sous-chapitre supprimé', type: 'success' })
                              await fetchSubchapters()
                            } catch (e) {
                              console.error(e)
                              setToast({ message: 'Erreur lors de la suppression', type: 'error' })
                            } finally {
                              setLoading(false)
                            }
                          }}
                        >
                          Supprimer
                        </button>
                      </div>
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
