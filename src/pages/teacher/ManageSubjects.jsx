// pages/teacher/ManageSubjects.jsx
import { useState, useEffect } from 'react'
import { collection, getDocs, deleteDoc, doc, query, orderBy } from 'firebase/firestore'
import { db } from '../../firebase/config'
import AppLayout from '../../layouts/AppLayout'
import PageHeader from '../../components/ui/PageHeader'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Select from '../../components/ui/Selectt'
import Toast from '../../components/ui/Toast'
import { FaBook, FaTrash, FaChevronDown, FaChevronRight } from 'react-icons/fa'

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

export default function ManageSubjects() {
  const [selectedGrade, setSelectedGrade] = useState('')
  const [subjects, setSubjects] = useState([])
  const [expandedSubjects, setExpandedSubjects] = useState({})
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)

  const loadSubjects = async (grade) => {
    if (!grade) return

    try {
      setLoading(true)
      const subjectsRef = collection(db, 'classes', grade, 'subjects')
      const subjectsQuery = query(subjectsRef, orderBy('createdAt', 'desc'))
      const snapshot = await getDocs(subjectsQuery)

      const subjectsData = await Promise.all(
        snapshot.docs.map(async (subjectDoc) => {
          const subjectData = {
            id: subjectDoc.id,
            ...subjectDoc.data(),
            chapters: []
          }

          // Load chapters
          const chaptersRef = collection(db, 'classes', grade, 'subjects', subjectDoc.id, 'chapters')
          const chaptersQuery = query(chaptersRef, orderBy('order', 'asc'))
          const chaptersSnapshot = await getDocs(chaptersQuery)

          subjectData.chapters = chaptersSnapshot.docs.map(chapterDoc => ({
            id: chapterDoc.id,
            ...chapterDoc.data()
          }))

          return subjectData
        })
      )

      setSubjects(subjectsData)
    } catch (err) {
      console.error('Erreur:', err)
      setToast({ message: 'Erreur lors du chargement', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteSubject = async (subjectId, subjectName) => {
    if (!confirm(`Supprimer la matière "${subjectName}" ?`)) return

    try {
      await deleteDoc(doc(db, 'classes', selectedGrade, 'subjects', subjectId))
      setToast({ message: 'Matière supprimée', type: 'success' })
      loadSubjects(selectedGrade)
    } catch (err) {
      console.error('Erreur:', err)
      setToast({ message: 'Erreur lors de la suppression', type: 'error' })
    }
  }

  return (
    <AppLayout>
      <PageHeader 
        title="Gérer les matières"
        subtitle="Consultez et gérez vos matières et chapitres"
      />

      <Card>
        <Card.Body>
          <div className="mb-6">
            <Select
              label="Sélectionnez une classe"
              value={selectedGrade}
              onChange={(e) => {
                setSelectedGrade(e.target.value)
                loadSubjects(e.target.value)
              }}
              options={[{ value: '', label: 'Choisir une classe...' }, ...gradeOptions]}
            />
          </div>

          {selectedGrade && (
            <div className="space-y-4">
              {loading && subjects.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Chargement...</p>
                </div>
              ) : subjects.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FaBook className="mx-auto mb-2 text-gray-400" size={32} />
                  <p>Aucune matière trouvée</p>
                </div>
              ) : (
                subjects.map((subject) => (
                  <div key={subject.id} className="border border-gray-200 rounded-lg">
                    <div className="p-4 bg-gray-50 flex items-center justify-between">
                      <div className="flex items-center">
                        <button
                          onClick={() => setExpandedSubjects(prev => ({
                            ...prev,
                            [subject.id]: !prev[subject.id]
                          }))}
                          className="mr-3 p-1 hover:bg-gray-200 rounded"
                        >
                          {expandedSubjects[subject.id] ? (
                            <FaChevronDown size={16} />
                          ) : (
                            <FaChevronRight size={16} />
                          )}
                        </button>
                        <FaBook className="mr-3 text-gray-600" size={20} />
                        <div>
                          <h3 className="font-semibold text-gray-900">{subject.name}</h3>
                          <p className="text-sm text-gray-600">
                            {subject.chapters.length} chapitre(s)
                          </p>
                        </div>
                      </div>

                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteSubject(subject.id, subject.name)}
                      >
                        <FaTrash size={14} />
                      </Button>
                    </div>

                    {expandedSubjects[subject.id] && (
                      <div className="p-4 border-t">
                        {subject.chapters.length === 0 ? (
                          <p className="text-gray-500 text-center py-4">
                            Aucun chapitre
                          </p>
                        ) : (
                          <div className="space-y-3">
                            {subject.chapters.map((chapter, index) => (
                              <div
                                key={chapter.id}
                                className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg"
                              >
                                <div className="flex items-center">
                                  <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 rounded mr-3">
                                    {chapter.order || index + 1}
                                  </span>
                                  <div>
                                    <h5 className="font-medium text-gray-900">
                                      {chapter.title}
                                    </h5>
                                    {chapter.description && (
                                      <p className="text-sm text-gray-600 mt-1">
                                        {chapter.description}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
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