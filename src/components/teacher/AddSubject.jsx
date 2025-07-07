import { useState } from 'react'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../../firebase/config'
import { useAuth } from '../../contexts/AuthContext'
import { FaBook, FaPlus, FaSpinner, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa'

export default function AddSubject() {
  const { currentUser } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    grade: '',
    description: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  // Options de classes disponibles
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

  // Matières suggérées selon le niveau
  const subjectSuggestions = {
    cm1: ['Mathématiques', 'Français', 'Sciences', 'Histoire-Géographie', 'Anglais'],
    cm2: ['Mathématiques', 'Français', 'Sciences', 'Histoire-Géographie', 'Anglais'],
    '6eme': ['Mathématiques', 'Français', 'Histoire-Géographie', 'SVT', 'Anglais', 'Arts plastiques'],
    '5eme': ['Mathématiques', 'Français', 'Histoire-Géographie', 'SVT', 'Physique-Chimie', 'Anglais', 'Espagnol'],
    '4eme': ['Mathématiques', 'Français', 'Histoire-Géographie', 'SVT', 'Physique-Chimie', 'Anglais', 'Espagnol'],
    '3eme': ['Mathématiques', 'Français', 'Histoire-Géographie', 'SVT', 'Physique-Chimie', 'Anglais', 'Espagnol'],
    '2nde': ['Mathématiques', 'Français', 'Histoire-Géographie', 'SVT', 'Physique-Chimie', 'Anglais', 'SES'],
    '1ere': ['Mathématiques', 'Français', 'Histoire-Géographie', 'Philosophie', 'Anglais', 'Spécialités'],
    'terminale': ['Mathématiques', 'Français', 'Histoire-Géographie', 'Philosophie', 'Anglais', 'Spécialités']
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Réinitialiser les messages
    if (error) setError('')
    if (success) setSuccess('')
  }

  const handleSubjectSuggestion = (subjectName) => {
    setFormData(prev => ({
      ...prev,
      name: subjectName
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validation
    if (!formData.name.trim()) {
      setError('Le nom de la matière est obligatoire')
      return
    }
    
    if (!formData.grade) {
      setError('Veuillez sélectionner une classe')
      return
    }

    // Vérifier que l'utilisateur est bien professeur
    if (currentUser?.userType !== 'professor' && currentUser?.userType !== 'teacher') {
      setError(`type : ${currentUser?.userType}  Accès non autorisé. Seuls les professeurs peuvent ajouter des matières.`)
      return
    }

    try {
      setLoading(true)
      setError('')
      
      // Référence vers la collection subjects dans la classe sélectionnée
      const subjectsRef = collection(db, 'classes', formData.grade, 'subjects')
      
      // Données à enregistrer
      const subjectData = {
        name: formData.name.trim(),
        description: formData.description.trim() || '',
        createdBy: currentUser.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }
      
      // Ajouter la matière à Firestore
      const docRef = await addDoc(subjectsRef, subjectData)
      
      // Succès
      setSuccess(`Matière "${formData.name}" ajoutée avec succès à la classe ${formData.grade.toUpperCase()}`)
      
      // Réinitialiser le formulaire
      setFormData({
        name: '',
        grade: '',
        description: ''
      })
      
      console.log('Matière ajoutée avec ID:', docRef.id)
      
    } catch (err) {
      console.error('Erreur lors de l\'ajout de la matière:', err)
      setError('Erreur lors de l\'ajout de la matière. Veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className="bg-blue-600 text-white p-6 rounded-t-lg">
          <div className="flex items-center">
            <FaBook className="mr-3" size={24} />
            <div>
              <h2 className="text-2xl font-bold">Ajouter une matière</h2>
              <p className="text-blue-100 mt-1">
                Créez une nouvelle matière pour vos élèves
              </p>
            </div>
          </div>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Messages d'état */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
              <FaExclamationTriangle className="mr-2 flex-shrink-0" size={20} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
              <FaCheckCircle className="mr-2 flex-shrink-0" size={20} />
              <span>{success}</span>
            </div>
          )}

          {/* Sélection de la classe */}
          <div>
            <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-2">
              Classe *
            </label>
            <select
              id="grade"
              name="grade"
              value={formData.grade}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Sélectionnez une classe</option>
              {gradeOptions.map((grade) => (
                <option key={grade.value} value={grade.value}>
                  {grade.label}
                </option>
              ))}
            </select>
          </div>

          {/* Suggestions de matières */}
          {formData.grade && subjectSuggestions[formData.grade] && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Matières suggérées pour {gradeOptions.find(g => g.value === formData.grade)?.label}
              </label>
              <div className="flex flex-wrap gap-2">
                {subjectSuggestions[formData.grade].map((subject) => (
                  <button
                    key={subject}
                    type="button"
                    onClick={() => handleSubjectSuggestion(subject)}
                    className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
                  >
                    {subject}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Nom de la matière */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Nom de la matière *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Ex: Mathématiques, Français, Sciences..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Description (optionnelle) */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description (optionnelle)
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="Décrivez brièvement cette matière..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            />
          </div>

          {/* Aperçu */}
          {formData.name && formData.grade && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Aperçu :</h4>
              <p className="text-sm text-gray-600">
                <strong>Classe :</strong> {gradeOptions.find(g => g.value === formData.grade)?.label}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Matière :</strong> {formData.name}
              </p>
              {formData.description && (
                <p className="text-sm text-gray-600">
                  <strong>Description :</strong> {formData.description}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-2">
                Chemin Firestore : /classes/{formData.grade}/subjects/[auto-generated-id]
              </p>
            </div>
          )}

          {/* Boutons */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading || !formData.name.trim() || !formData.grade}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin mr-2" size={16} />
                  Ajout en cours...
                </>
              ) : (
                <>
                  <FaPlus className="mr-2" size={16} />
                  Ajouter la matière
                </>
              )}
            </button>
            
            <button
              type="button"
              onClick={() => {
                setFormData({ name: '', grade: '', description: '' })
                setError('')
                setSuccess('')
              }}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Réinitialiser
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}