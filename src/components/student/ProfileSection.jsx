import { useState, useEffect } from 'react'
import { useStudentProfile } from '../../hooks/useStudentProfile'
import ProfileSetupModal from './ProfileSetupModal'
import ProfileManager from './ProfileManager'
import { 
  FaUser, 
  FaExclamationCircle, 
  FaSpinner,
  FaUserPlus,
  FaCheckCircle
} from 'react-icons/fa'
import { useAuth } from '../../contexts/AuthContext.jsx'

const ProfileSection = ({ currentUser }) => {
  const { profile, loading, error, saveProfile, isProfileComplete } = useStudentProfile(currentUser?.uid)
  const [showSetupModal, setShowSetupModal] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  // Vérifier si le profil doit être configuré
  useEffect(() => {
    if (!loading && !isProfileComplete() && !showSetupModal) {
      // Délai pour éviter l'ouverture immédiate
      const timer = setTimeout(() => {
        setShowSetupModal(true)
      }, 1000)
      
      return () => clearTimeout(timer)
    }
  }, [loading, isProfileComplete, showSetupModal])

  const handleSaveProfile = async (profileData) => {
    try {
      const success = await saveProfile(profileData)
      if (success) {
        setShowSetupModal(false)
        setShowSuccessMessage(true)
        
        // Masquer le message de succès après 3 secondes
        setTimeout(() => {
          setShowSuccessMessage(false)
        }, 3000)
        
        return true
      }
      return false
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error)
      return false
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <FaSpinner className="animate-spin mx-auto mb-4 text-blue-600" size={48} />
          <p className="text-gray-600 text-lg">Chargement de votre profil...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl flex items-center">
        <FaExclamationCircle className="mr-3 flex-shrink-0" size={20} />
        <span>{error}</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Message de succès */}
      {showSuccessMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-2xl flex items-center animate-fade-in">
          <FaCheckCircle className="mr-3 flex-shrink-0" size={20} />
          <span>Profil mis à jour avec succès !</span>
        </div>
      )}

      {/* Profil incomplet - Invitation à configurer */}
      {!isProfileComplete() && (
        <div className="bg-blue-50 border border-blue-200 rounded-3xl p-8 shadow-lg">
          <div className="text-center">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 rounded-2xl mx-auto w-fit mb-4">
              <FaUser className="text-white" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Complétez votre profil
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Pour une expérience personnalisée, nous avons besoin de quelques informations supplémentaires sur vous.
            </p>
            <button
              onClick={() => setShowSetupModal(true)}
              className="flex items-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-all mx-auto"
            >
              <FaUserPlus className="mr-2" size={18} />
              Configurer mon profil
            </button>
          </div>
        </div>
      )}

      {/* Gestionnaire de profil */}
      <ProfileManager 
        profile={profile}
        onUpdateProfile={saveProfile}
        currentUser={currentUser}
      />

      {/* Modal de configuration */}
      <ProfileSetupModal
        isOpen={showSetupModal}
        onClose={() => setShowSetupModal(false)}
        onSave={handleSaveProfile}
        initialData={profile}
      />
    </div>
  )
}

export default ProfileSection