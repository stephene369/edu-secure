import { useState, useEffect } from 'react'
import { 
  collection, 
  getDocs, 
  addDoc, 
  serverTimestamp,
  query,
  orderBy 
} from 'firebase/firestore'
import { db } from '../../firebase/config'
import { useAuth } from '../../contexts/AuthContext'
import { 
  FaBook, 
  FaChevronRight, 
  FaPlus, 
  FaSpinner,
  FaExclamationTriangle,
  FaCheckCircle,
  FaBookOpen
} from 'react-icons/fa'

export default function AddSubchapter() {
  const { currentUser } = useAuth()
  
  // États pour la navigation hiérarchique
  const [selectedGrade, setSelectedGrade] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('')
  const [selectedChapter, setSelectedChapter] = useState('')
  
  // Données chargées
  const [subjects, setSubjects] = useState([])
  const [chapters, setChapters] = useState([])
  
  // États du formulaire
  const [subchapterForm, setSubchapterForm] = useState({
    title: '',
    description: '',
    order: 1
  })
  
  // États de l'interface
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [adding, setAdding] = useState(false)

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
      const subjectsRef = collection(db, 'classes', grade, 'subjects')
      const subjectsQuery = query(subjectsRef, orderBy('createdAt', 'desc'))
      const snapshot = await getDocs(subjectsQuery)
      
      const subjectsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      
      setSubjects(subjectsData)
    } catch (err) {
      console.error('Erreur lors du chargement des matières:', err)
      setError('Erreur lors du chargement des matières')
    } finally {
      setLoading(false)
    }
  }

  // Charger les chapitres d'une matière
  const loadChapters = async (grade, subjectId) => {
    if (!grade || !subjectId) return
    
    try {
      setLoading(true)
      const chaptersRef = collection(db, 'classes', grade, 'subjects', subjectId, 'chapters')
      const chaptersQuery = query(chaptersRef, orderBy('order', 'asc'))
      const snapshot = await getDocs(chaptersQuery)
      
      const chaptersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      
      setChapters(chaptersData)
    } catch (err) {
      console.error('Erreur lors du chargement des chapitres:', err)
      setError('Erreur lors du chargement des chapitres')
    } finally {
      setLoading(false)
    }
  }

  // Gestionnaires de changement
  const handleGradeChange = (grade) => {
    setSelectedGrade(grade)
    setSelectedSubject('')
    setSelectedChapter('')
    setSubjects([])
    setChapters([])
    if (grade) {
      loadSubjects(grade)
    }
  }

  const handleSubjectChange = (subjectId) => {
    setSelectedSubject(subjectId)
    setSelectedChapter('')
    setChapters([])
    if (subjectId) {
      loadChapters(selectedGrade, subjectId)
    }
  }

  // Ajouter le sous-chapitre
  const handleAddSubchapter = async (e) => {
    e.preventDefault()
    
    if (!subchapterForm.title.trim()) {
      setError('Le titre du sous-chapitre est obligatoire')
      return
    }
    
    if (!selectedGrade || !selectedSubject || !selectedChapter) {
      setError('Veuillez sélectionner une classe, matière et chapitre')
      return
    }

    try {
      setAdding(true)
      setError('')
      
      const subchaptersRef = collection(
        db, 
        'classes', selectedGrade, 
        'subjects', selectedSubject, 
        'chapters', selectedChapter,
        'subchapters'
      )
      
      const subchapterData = {
        title: subchapterForm.title.trim(),
        description: subchapterForm.description.trim(),
        order: subchapterForm.order,
        createdBy: currentUser.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }
      
      await addDoc(subchaptersRef, subchapterData)
      
      setSuccess('Sous-chapitre ajouté avec succès !')
      setSubchapterForm({ title: '', description: '', order: 1 })
      
    } catch (err) {
      console.error('Erreur lors de l\'ajout du sous-chapitre:', err)
      setError('Erreur lors de l\'ajout du sous-chapitre')
    } finally {
      setAdding(false)
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

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className="bg-orange-600 text-white p-6 rounded-t-lg">
          <div className="flex items-center">
            <FaBookOpen className="mr-3" size={24} />
            <div>
              <h2 className="text-2xl font-bold">Ajouter un sous-chapitre</h2>
              <p className="text-orange-100 mt-1">
                Créez un nouveau sous-chapitre dans un chapitre existant
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

          {/* Navigation hiérarchique */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Sélectionnez la destination
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Classe */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Classe
                </label>
                <select
                  value={selectedGrade}
                  onChange={(e) => handleGradeChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Choisir...</option>
                  {gradeOptions.map((grade) => (
                    <option key={grade.value} value={grade.value}>
                      {grade.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Matière */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Matière
                </label>
                <select
                  value={selectedSubject}
                  onChange={(e) => handleSubjectChange(e.target.value)}
                  disabled={!selectedGrade || subjects.length === 0}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100"
                >
                  <option value="">Choisir...</option>
                  {subjects.map((subject) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Chapitre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chapitre
                </label>
                <select
                  value={selectedChapter}
                  onChange={(e) => setSelectedChapter(e.target.value)}
                  disabled={!selectedSubject || chapters.length === 0}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100"
                >
                  <option value="">Choisir...</option>
                  {chapters.map((chapter) => (
                    <option key={chapter.id} value={chapter.id}>
                      {chapter.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Fil d'Ariane */}
            {selectedGrade && (
              <div className="mt-4 flex items-center text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                <FaBook className="mr-2" size={14} />
                <span className="font-medium">
                  {gradeOptions.find(g => g.value === selectedGrade)?.label}
                </span>
                {selectedSubject && (
                  <>
                    <FaChevronRight className="mx-2" size={12} />
                    <span>{subjects.find(s => s.id === selectedSubject)?.name}</span>
                  </>
                )}
                {selectedChapter && (
                  <>
                    <FaChevronRight className="mx-2" size={12} />
                    <span className="text-orange-600 font-medium">
                      {chapters.find(c => c.id === selectedChapter)?.title}
                    </span>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Formulaire de sous-chapitre */}
          {selectedChapter && (
            <form onSubmit={handleAddSubchapter} className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Informations du sous-chapitre
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Titre */}
                <div className="md:col-span-2">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Titre du sous-chapitre *
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={subchapterForm.title}
                    onChange={(e) => setSubchapterForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Ex: Les propriétés des triangles"
                    required
                  />
                </div>

                {/* Ordre */}
                <div>
                  <label htmlFor="order" className="block text-sm font-medium text-gray-700 mb-2">
                    Ordre
                  </label>
                  <input
                    type="number"
                    id="order"
                    min="1"
                    value={subchapterForm.order}
                    onChange={(e) => setSubchapterForm(prev => ({ ...prev, order: parseInt(e.target.value) || 1 }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description (optionnelle)
                </label>
                <textarea
                  id="description"
                  value={subchapterForm.description}
                  onChange={(e) => setSubchapterForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Description du contenu de ce sous-chapitre..."
                />
              </div>

              {/* Bouton d'ajout */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={adding || !subchapterForm.title.trim()}
                  className="flex items-center px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {adding ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" size={16} />
                      Ajout...
                    </>
                  ) : (
                    <>
                      <FaPlus className="mr-2" size={16} />
                      Ajouter le sous-chapitre
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Message d'aide */}
          {!selectedChapter && (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <FaBookOpen className="mx-auto mb-4 text-gray-400" size={48} />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Sélectionnez un chapitre
              </h3>
              <p className="text-gray-500">
                Choisissez d'abord une classe, matière et chapitre pour ajouter un sous-chapitre.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
