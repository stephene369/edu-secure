import { useState, useEffect } from 'react'
import { 
  collection, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  doc, 
  updateDoc,
  serverTimestamp,
  query,
  orderBy 
} from 'firebase/firestore'
import { db } from '../../firebase/config'
import { useAuth } from '../../contexts/AuthContext'
import { 
  FaBook, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaChevronDown, 
  FaChevronRight,
  FaSpinner,
  FaExclamationTriangle,
  FaCheckCircle,
  FaBookOpen,
  FaSearch
} from 'react-icons/fa'

export default function ManageSubjects() {
  const { currentUser } = useAuth()
  const [selectedGrade, setSelectedGrade] = useState('')
  const [subjects, setSubjects] = useState([])
  const [expandedSubjects, setExpandedSubjects] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  // États pour l'ajout de chapitre
  const [showAddChapter, setShowAddChapter] = useState(null)
  const [chapterForm, setChapterForm] = useState({
    title: '',
    description: '',
    order: 1
  })
  const [addingChapter, setAddingChapter] = useState(false)

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
      setError('')
      
      const subjectsRef = collection(db, 'classes', grade, 'subjects')
      const subjectsQuery = query(subjectsRef, orderBy('createdAt', 'desc'))
      const snapshot = await getDocs(subjectsQuery)
      
      const subjectsData = []
      
      for (const subjectDoc of snapshot.docs) {
        const subjectData = {
          id: subjectDoc.id,
          ...subjectDoc.data(),
          chapters: []
        }
        
        // Charger les chapitres de chaque matière
        const chaptersRef = collection(db, 'classes', grade, 'subjects', subjectDoc.id, 'chapters')
        const chaptersQuery = query(chaptersRef, orderBy('order', 'asc'))
        const chaptersSnapshot = await getDocs(chaptersQuery)
        
        subjectData.chapters = chaptersSnapshot.docs.map(chapterDoc => ({
          id: chapterDoc.id,
          ...chapterDoc.data()
        }))
        
        subjectsData.push(subjectData)
      }
      
      setSubjects(subjectsData)
    } catch (err) {
      console.error('Erreur lors du chargement des matières:', err)
      setError('Erreur lors du chargement des matières')
    } finally {
      setLoading(false)
    }
  }

  // Gérer le changement de classe
  const handleGradeChange = (grade) => {
    setSelectedGrade(grade)
    setSubjects([])
    setExpandedSubjects({})
    if (grade) {
      loadSubjects(grade)
    }
  }

  // Basculer l'expansion d'une matière
  const toggleSubjectExpansion = (subjectId) => {
    setExpandedSubjects(prev => ({
      ...prev,
      [subjectId]: !prev[subjectId]
    }))
  }

  // Ajouter un chapitre
  const handleAddChapter = async (subjectId) => {
    if (!chapterForm.title.trim()) {
      setError('Le titre du chapitre est obligatoire')
      return
    }

    try {
      setAddingChapter(true)
      setError('')
      
      const chaptersRef = collection(db, 'classes', selectedGrade, 'subjects', subjectId, 'chapters')
      
      const chapterData = {
        title: chapterForm.title.trim(),
        description: chapterForm.description.trim(),
        order: chapterForm.order,
        createdBy: currentUser.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }
      
      await addDoc(chaptersRef, chapterData)
      
      setSuccess('Chapitre ajouté avec succès')
      setChapterForm({ title: '', description: '', order: 1 })
      setShowAddChapter(null)
      
      // Recharger les matières pour voir le nouveau chapitre
      loadSubjects(selectedGrade)
      
    } catch (err) {
      console.error('Erreur lors de l\'ajout du chapitre:', err)
      setError('Erreur lors de l\'ajout du chapitre')
    } finally {
      setAddingChapter(false)
    }
  }

  // Supprimer une matière
  const handleDeleteSubject = async (subjectId, subjectName) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer la matière "${subjectName}" ? Cette action est irréversible.`)) {
      return
    }

    try {
      setLoading(true)
      await deleteDoc(doc(db, 'classes', selectedGrade, 'subjects', subjectId))
      setSuccess(`Matière "${subjectName}" supprimée avec succès`)
      loadSubjects(selectedGrade)
    } catch (err) {
      console.error('Erreur lors de la suppression:', err)
      setError('Erreur lors de la suppression de la matière')
    } finally {
      setLoading(false)
    }
  }

  // Supprimer un chapitre
  const handleDeleteChapter = async (subjectId, chapterId, chapterTitle) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer le chapitre "${chapterTitle}" ?`)) {
      return
    }

    try {
      await deleteDoc(doc(db, 'classes', selectedGrade, 'subjects', subjectId, 'chapters', chapterId))
      setSuccess(`Chapitre "${chapterTitle}" supprimé avec succès`)
      loadSubjects(selectedGrade)
    } catch (err) {
      console.error('Erreur lors de la suppression du chapitre:', err)
      setError('Erreur lors de la suppression du chapitre')
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className="bg-green-600 text-white p-6 rounded-t-lg">
          <div className="flex items-center">
            <FaBookOpen className="mr-3" size={24} />
            <div>
              <h2 className="text-2xl font-bold">Gérer les matières</h2>
              <p className="text-green-100 mt-1">
                Consultez et gérez vos matières et chapitres
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

          {/* Sélecteur de classe */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sélectionnez une classe
            </label>
            <div className="flex items-center space-x-4">
              <select
                value={selectedGrade}
                onChange={(e) => handleGradeChange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Choisir une classe...</option>
                {gradeOptions.map((grade) => (
                  <option key={grade.value} value={grade.value}>
                    {grade.label}
                  </option>
                ))}
              </select>
              
              {selectedGrade && (
                <button
                  onClick={() => loadSubjects(selectedGrade)}
                  disabled={loading}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {loading ? (
                    <FaSpinner className="animate-spin mr-2" size={16} />
                  ) : (
                    <FaSearch className="mr-2" size={16} />
                  )}
                  Actualiser
                </button>
              )}
            </div>
          </div>

          {/* Liste des matières */}
          {selectedGrade && (
            <div className="space-y-4">
              {loading && subjects.length === 0 ? (
                <div className="text-center py-8">
                  <FaSpinner className="animate-spin mx-auto mb-4 text-gray-400" size={32} />
                  <p className="text-gray-500">Chargement des matières...</p>
                </div>
              ) : subjects.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <FaBook className="mx-auto mb-4 text-gray-400" size={48} />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Aucune matière trouvée
                  </h3>
                  <p className="text-gray-500">
                    Aucune matière n'a été créée pour la classe {gradeOptions.find(g => g.value === selectedGrade)?.label}.
                  </p>
                </div>
              ) : (
                subjects.map((subject) => (
                  <div key={subject.id} className="border border-gray-200 rounded-lg">
                    {/* En-tête de la matière */}
                    <div className="p-4 bg-gray-50 flex items-center justify-between">
                      <div className="flex items-center">
                        <button
                          onClick={() => toggleSubjectExpansion(subject.id)}
                          className="mr-3 p-1 hover:bg-gray-200 rounded"
                        >
                          {expandedSubjects[subject.id] ? (
                            <FaChevronDown size={16} />
                          ) : (
                            <FaChevronRight size={16} />
                          )}
                        </button>
                        <FaBook className="mr-3 text-blue-600" size={20} />
                        <div>
                          <h3 className="font-semibold text-gray-900">{subject.name}</h3>
                          {subject.description && (
                            <p className="text-sm text-gray-600">{subject.description}</p>
                          )}
                          <p className="text-xs text-gray-500">
                            {subject.chapters.length} chapitre(s)
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setShowAddChapter(subject.id)}
                          className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                        >
                          <FaPlus className="mr-1" size={12} />
                          Chapitre
                        </button>
                        <button
                          onClick={() => handleDeleteSubject(subject.id, subject.name)}
                          className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                        >
                          <FaTrash size={12} />
                        </button>
                      </div>
                    </div>

                    {/* Formulaire d'ajout de chapitre */}
                    {showAddChapter === subject.id && (
                      <div className="p-4 bg-blue-50 border-t">
                        <h4 className="font-medium text-gray-900 mb-3">
                          Ajouter un chapitre à "{subject.name}"
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="md:col-span-2">
                            <input
                              type="text"
                              placeholder="Titre du chapitre"
                              value={chapterForm.title}
                              onChange={(e) => setChapterForm(prev => ({ ...prev, title: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <input
                              type="number"
                              placeholder="Ordre"
                              min="1"
                              value={chapterForm.order}
                              onChange={(e) => setChapterForm(prev => ({ ...prev, order: parseInt(e.target.value) || 1 }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                        <div className="mt-3">
                          <textarea
                            placeholder="Description du chapitre (optionnelle)"
                            value={chapterForm.description}
                            onChange={(e) => setChapterForm(prev => ({ ...prev, description: e.target.value }))}
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                          />
                        </div>
                        <div className="mt-4 flex space-x-3">
                          <button
                            onClick={() => handleAddChapter(subject.id)}
                            disabled={addingChapter || !chapterForm.title.trim()}
                            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                          >
                            {addingChapter ? (
                              <>
                                <FaSpinner className="animate-spin mr-2" size={14} />
                                Ajout...
                              </>
                            ) : (
                              <>
                                <FaPlus className="mr-2" size={14} />
                                Ajouter
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => {
                              setShowAddChapter(null)
                              setChapterForm({ title: '', description: '', order: 1 })
                              setError('')
                            }}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
                          >
                            Annuler
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Liste des chapitres */}
                    {expandedSubjects[subject.id] && (
                      <div className="p-4 border-t">
                        {subject.chapters.length === 0 ? (
                          <div className="text-center py-6 text-gray-500">
                            <FaBookOpen className="mx-auto mb-2" size={24} />
                            <p>Aucun chapitre dans cette matière</p>
                            <button
                              onClick={() => setShowAddChapter(subject.id)}
                              className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
                            >
                              Ajouter le premier chapitre
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <h4 className="font-medium text-gray-900 mb-3">
                              Chapitres ({subject.chapters.length})
                            </h4>
                            {subject.chapters.map((chapter, index) => (
                              <div
                                key={chapter.id}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                              >
                                <div className="flex items-center">
                                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded mr-3">
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
                                    <p className="text-xs text-gray-500 mt-1">
                                      Créé le {chapter.createdAt?.toDate?.()?.toLocaleDateString() || 'Date inconnue'}
                                    </p>
                                  </div>
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() => {
                                      // TODO: Implémenter l'édition de chapitre
                                      alert('Fonctionnalité d\'édition à venir')
                                    }}
                                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                                    title="Modifier le chapitre"
                                  >
                                    <FaEdit size={14} />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteChapter(subject.id, chapter.id, chapter.title)}
                                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded"
                                    title="Supprimer le chapitre"
                                  >
                                    <FaTrash size={14} />
                                  </button>
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

          {/* Statistiques */}
          {selectedGrade && subjects.length > 0 && (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <FaBook className="text-blue-600 mr-3" size={24} />
                  <div>
                    <p className="text-sm text-blue-600 font-medium">Matières</p>
                    <p className="text-2xl font-bold text-blue-800">{subjects.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <FaBookOpen className="text-green-600 mr-3" size={24} />
                  <div>
                    <p className="text-sm text-green-600 font-medium">Chapitres</p>
                    <p className="text-2xl font-bold text-green-800">
                      {subjects.reduce((total, subject) => total + subject.chapters.length, 0)}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <FaChevronRight className="text-purple-600 mr-3" size={24} />
                  <div>
                    <p className="text-sm text-purple-600 font-medium">Classe</p>
                    <p className="text-2xl font-bold text-purple-800">
                      {gradeOptions.find(g => g.value === selectedGrade)?.label}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}