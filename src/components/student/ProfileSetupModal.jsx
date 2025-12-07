import { useState } from 'react'
import { 
  FaUser, 
  FaTimes, 
  FaArrowRight, 
  FaArrowLeft,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaHeart,
  FaCheck
} from 'react-icons/fa'

const ProfileSetupModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    gender: initialData?.gender || '',
    birthDate: initialData?.birthDate || '',
    city: initialData?.city || '',
    hasDisability: initialData?.hasDisability ?? false,
    disabilityType: initialData?.disabilityType || '',
    emergencyContact: initialData?.emergencyContact || '',
    allergies: initialData?.allergies || '',
    ...(initialData || {})
  })
  const [loading, setLoading] = useState(false)

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const success = await onSave(formData)
      if (success) {
        onClose()
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error)
    } finally {
      setLoading(false)
    }
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.gender && formData.birthDate
      case 2:
        return formData.city && formData.hasDisability !== ''
      case 3:
        return formData.emergencyContact
      default:
        return false
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <FaTimes size={20} />
          </button>
          
          <div className="text-center">
            <FaUser className="mx-auto mb-3" size={32} />
            <h2 className="text-2xl font-bold">Configuration du profil</h2>
            <p className="text-blue-100 mt-2">Étape {currentStep} sur 3</p>
          </div>
          
          {/* Progress bar */}
          <div className="mt-4 bg-white/20 rounded-full h-2">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Étape 1: Informations de base */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Parlez-nous un peu de vous
                </h3>
                <p className="text-gray-600">
                  Ces informations nous aident à personnaliser votre expérience
                </p>
              </div>

              {/* Genre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Genre *
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'male', label: 'Homme', emoji: '👨' },
                    { value: 'female', label: 'Femme', emoji: '👩' },
                    { value: 'other', label: 'Autre', emoji: '🧑' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleInputChange('gender', option.value)}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        formData.gender === option.value 
                          ? 'border-blue-500 bg-blue-50 text-blue-700' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="text-2xl mb-1">{option.emoji}</div>
                      <div className="text-sm font-medium">{option.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Date de naissance */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date de naissance *
                </label>
                <div className="relative">
                  <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => handleInputChange('birthDate', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    max={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Étape 2: Informations complémentaires */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Encore quelques infos sur vous
                </h3>
                <p className="text-gray-600">
                  Ces informations nous aident à mieux vous accompagner
                </p>
              </div>

              {/* Ville */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ville de résidence *
                </label>
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="Votre ville"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Handicap */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Situation de handicap *
                </label>
                <div className="space-y-3">
                  {[
                    { value: false, label: 'Aucun handicap', icon: '✅' },
                    { value: true, label: 'Situation de handicap', icon: '♿' }
                  ].map((option) => (
                    <button
                      key={option.value.toString()}
                      type="button"
                      onClick={() => handleInputChange('hasDisability', option.value)}
                      className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                        formData.hasDisability === option.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="text-xl mr-3">{option.icon}</span>
                        <span className="font-medium">{option.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Type de handicap si applicable */}
              {formData.hasDisability && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Précisez le type de handicap (optionnel)
                  </label>
                  <textarea
                    value={formData.disabilityType}
                    onChange={(e) => handleInputChange('disabilityType', e.target.value)}
                    placeholder="Décrivez brièvement votre situation..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  />
                </div>
              )}
            </div>
          )}

          {/* Étape 3: Contact d'urgence */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Contact d'urgence
                </h3>
                <p className="text-gray-600">
                  Informations importantes pour votre sécurité
                </p>
              </div>

              {/* Contact d'urgence */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact d'urgence *
                </label>
                <input
                  type="tel"
                  value={formData.emergencyContact}
                  onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                  placeholder="Numéro de téléphone"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Allergies */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Allergies ou conditions médicales (optionnel)
                </label>
                <div className="relative">
                  <FaHeart className="absolute left-3 top-4 text-gray-400" />
                  <textarea
                    value={formData.allergies}
                    onChange={(e) => handleInputChange('allergies', e.target.value)}
                    placeholder="Mentionnez toute allergie ou condition médicale importante..."
                    rows={3}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <FaArrowLeft className="mr-2" size={14} />
            Précédent
          </button>

          {currentStep < 3 ? (
            <button
              onClick={handleNext}
              disabled={!isStepValid()}
              className="flex items-center bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-xl transition-colors"
            >
              Suivant
              <FaArrowRight className="ml-2" size={14} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!isStepValid() || loading}
              className="flex items-center bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-xl transition-colors"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Sauvegarde...
                </>
              ) : (
                <>
                  <FaCheck className="mr-2" size={14} />
                  Terminer
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfileSetupModal
