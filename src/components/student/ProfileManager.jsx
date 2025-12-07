import { useState } from 'react'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../../firebase/config'
import { 
  FaUser, 
  FaEdit, 
  FaCog, 
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaPhone,
  FaHeart,
  FaGraduationCap,
  FaSave,

  FaTimes,
  FaSpinner
} from 'react-icons/fa'

const ProfileManager = ({ profile, onUpdateProfile, currentUser }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({})
  const [loading, setLoading] = useState(false)

  const handleEdit = () => {
    setEditData(profile || {})
    setIsEditing(true)
  }

  const handleCancel = () => {
    setEditData({})
    setIsEditing(false)
  }

  const handleSave = async () => {
    setLoading(true)


    


    try {
      // Sauvegarder le profil étudiant
      const success = await onUpdateProfile(editData)
      
      if (success) {
        // Si la classe a changé, mettre à jour immédiatement dans users
        if (editData.grade && editData.grade !== currentUser?.grade) {
          const userRef = doc(db, 'users', currentUser.uid)
          await updateDoc(userRef, {
            grade: editData.grade,
            updatedAt: new Date().toISOString()
          })
        }
        
        setIsEditing(false)
        
        // Optionnel: Recharger la page si la classe a changé pour voir les nouvelles matières
        if (editData.grade && editData.grade !== currentUser?.grade) {
          setTimeout(() => {
            window.location.reload()
          }, 1000)
        }
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Non renseigné'
    return new Date(dateString).toLocaleDateString('fr-FR')
  }

  const calculateAge = (birthDate) => {
    if (!birthDate) return null
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    
    return age
  }

  const gradeLabels = {
    'cm1': 'CM1',
    'cm2': 'CM2',
    '6eme': '6ème',
    '5eme': '5ème',
    '4eme': '4ème',
    '3eme': '3ème',
    '2nde': '2nde',
    '1ere': '1ère',
    'terminale': 'Terminale'
  }

  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/20">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-2xl mr-4">
            <FaUser className="text-white" size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800">Mon Profil</h3>
            <p className="text-gray-600">Gérez vos informations personnelles</p>
          </div>
        </div>
        
        {!isEditing ? (
          <button
            onClick={handleEdit}
            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition-colors"
          >
            <FaEdit className="mr-2" size={16} />
            Modifier
          </button>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={handleCancel}

              disabled={loading}
              className="flex items-center bg-gray-500 hover:bg-gray-600 disabled:opacity-50 text-white px-4 py-2 rounded-xl transition-colors"
            >
              <FaTimes className="mr-2" size={16} />
              Annuler
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex items-center bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-4 py-2 rounded-xl transition-colors"
            >
              {loading ? (

                <FaSpinner className="animate-spin mr-2" size={16} />
              ) : (
                <FaSave className="mr-2" size={16} />
              )}

              {loading ? 'Sauvegarde...' : 'Sauvegarder'}
            </button>
          </div>
        )}
      </div>

      {/* Notification de changement de classe */}
      {isEditing && editData.grade && editData.grade !== currentUser?.grade && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
          <div className="flex items-center">
            <div className="text-yellow-600 mr-3">⚠️</div>
            <div>
              <p className="text-yellow-800 font-medium">Changement de classe détecté</p>
              <p className="text-yellow-700 text-sm">
                Les matières disponibles seront mises à jour automatiquement après la sauvegarde.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Informations de base */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Nom complet */}
        <div className="bg-white/50 rounded-2xl p-4">
          <div className="flex items-center mb-2">
            <FaUser className="text-blue-600 mr-2" size={16} />
            <span className="font-medium text-gray-700">Nom complet</span>
          </div>
          <p className="text-gray-800 font-semibold">
            {currentUser?.firstName} {currentUser?.lastName}
          </p>
        </div>

        {/* Email */}
        <div className="bg-white/50 rounded-2xl p-4">
          <div className="flex items-center mb-2">
            <FaCog className="text-blue-600 mr-2" size={16} />
            <span className="font-medium text-gray-700">Email</span>
          </div>
          <p className="text-gray-800">{currentUser?.email}</p>
        </div>

        {/* Classe */}
        <div className="bg-white/50 rounded-2xl p-4">
          <div className="flex items-center mb-2">
            <FaGraduationCap className="text-blue-600 mr-2" size={16} />
            <span className="font-medium text-gray-700">Classe</span>
            {isEditing && editData.grade !== currentUser?.grade && (
              <span className="ml-2 bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                Modifié
              </span>
            )}
          </div>
          {isEditing ? (
            <select
              value={editData.grade || currentUser?.grade || ''}
              onChange={(e) => handleInputChange('grade', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Sélectionnez votre classe</option>
              {Object.entries(gradeLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          ) : (
            <p className="text-gray-800 font-semibold">
              {gradeLabels[currentUser?.grade] || currentUser?.grade?.toUpperCase() || 'Non définie'}
            </p>
          )}
        </div>

        {/* Genre */}
        <div className="bg-white/50 rounded-2xl p-4">
          <div className="flex items-center mb-2">
            <FaUser className="text-blue-600 mr-2" size={16} />
            <span className="font-medium text-gray-700">Genre</span>
          </div>
          {isEditing ? (
            <select
              value={editData.gender || ''}
              onChange={(e) => handleInputChange('gender', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Sélectionnez</option>
              <option value="male">Homme</option>
              <option value="female">Femme</option>
              <option value="other">Autre</option>
            </select>
          ) : (
            <p className="text-gray-800">
              {profile?.gender === 'male' ? 'Homme' : 
               profile?.gender === 'female' ? 'Femme' : 
               profile?.gender === 'other' ? 'Autre' : 'Non renseigné'}
            </p>
          )}
        </div>
      </div>

      {/* Informations personnelles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Date de naissance */}
        <div className="bg-white/50 rounded-2xl p-4">
          <div className="flex items-center mb-2">
            <FaCalendarAlt className="text-blue-600 mr-2" size={16} />
            <span className="font-medium text-gray-700">Date de naissance</span>
          </div>
          {isEditing ? (
            <input
              type="date"
              value={editData.birthDate || ''}
              onChange={(e) => handleInputChange('birthDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              max={new Date().toISOString().split('T')[0]}
            />
          ) : (
            <div>
              <p className="text-gray-800">{formatDate(profile?.birthDate)}</p>
              {profile?.birthDate && (
                <p className="text-sm text-gray-600">
                  {calculateAge(profile.birthDate)} ans
                </p>
              )}
            </div>
          )}
        </div>

        {/* Ville */}
        <div className="bg-white/50 rounded-2xl p-4">
          <div className="flex items-center mb-2">
            <FaMapMarkerAlt className="text-blue-600 mr-2" size={16} />
            <span className="font-medium text-gray-700">Ville</span>
          </div>
          {isEditing ? (
            <input
              type="text"
              value={editData.city || ''}
              onChange={(e) => handleInputChange('city', e.target.value)}
              placeholder="Votre ville"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          ) : (
            <p className="text-gray-800">{profile?.city || 'Non renseignée'}</p>
          )}
        </div>
      </div>

      {/* Situation de handicap */}
      <div className="bg-white/50 rounded-2xl p-4 mb-6">
        <div className="flex items-center mb-2">
          <FaHeart className="text-blue-600 mr-2" size={16} />
          <span className="font-medium text-gray-700">Situation de handicap</span>
        </div>
        {isEditing ? (
          <div className="space-y-3">
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="hasDisability"
                  checked={editData.hasDisability === false}
                  onChange={() => handleInputChange('hasDisability', false)}
                  className="mr-2"
                />
                Aucun handicap
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="hasDisability"
                  checked={editData.hasDisability === true}
                  onChange={() => handleInputChange('hasDisability', true)}
                  className="mr-2"
                />
                Situation de handicap
              </label>
            </div>
            {editData.hasDisability && (
              <textarea
                value={editData.disabilityType || ''}
                onChange={(e) => handleInputChange('disabilityType', e.target.value)}
                placeholder="Précisez le type de handicap..."
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              />
            )}
          </div>
        ) : (
          <div>
            <p className="text-gray-800">
              {profile?.hasDisability ? 'Situation de handicap' : 'Aucun handicap'}
            </p>
            {profile?.hasDisability && profile?.disabilityType && (
              <p className="text-sm text-gray-600 mt-1">{profile.disabilityType}</p>
            )}
          </div>
        )}
      </div>

      {/* Contact d'urgence */}
      <div className="bg-white/50 rounded-2xl p-4 mb-6">
        <div className="flex items-center mb-2">
          <FaPhone className="text-blue-600 mr-2" size={16} />
          <span className="font-medium text-gray-700">Contact d'urgence</span>
        </div>
        {isEditing ? (
          <input
            type="tel"
            value={editData.emergencyContact || ''}
            onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
            placeholder="Numéro de téléphone"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        ) : (
          <p className="text-gray-800">{profile?.emergencyContact || 'Non renseigné'}</p>
        )}
      </div>

      {/* Allergies */}
      <div className="bg-white/50 rounded-2xl p-4">
        <div className="flex items-center mb-2">
          <FaHeart className="text-red-500 mr-2" size={16} />
          <span className="font-medium text-gray-700">Allergies et conditions médicales</span>
        </div>
        {isEditing ? (
          <textarea
            value={editData.allergies || ''}
            onChange={(e) => handleInputChange('allergies', e.target.value)}
            placeholder="Mentionnez toute allergie ou condition médicale importante..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          />
        ) : (
          <p className="text-gray-800">
            {profile?.allergies || 'Aucune allergie signalée'}
          </p>
        )}
      </div>
    </div>
  )
}

export default ProfileManager
