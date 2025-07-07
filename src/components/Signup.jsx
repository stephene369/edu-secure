import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { 
  FaUser, 
  FaEnvelope, 
  FaLock, 
  FaEye, 
  FaEyeSlash, 
  FaUserPlus,
  FaExclamationCircle,
  FaUserGraduate,
  FaUsers,
  FaChalkboardTeacher,
  FaGraduationCap
} from 'react-icons/fa'

export default function Signup() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'student',
    firstName: '',
    lastName: '',
    grade: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { signup } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.email || !formData.password || !formData.firstName || !formData.lastName) {
      return setError('Veuillez remplir tous les champs obligatoires')
    }

    if (formData.password !== formData.confirmPassword) {
      return setError('Les mots de passe ne correspondent pas')
    }

    if (formData.password.length < 6) {
      return setError('Le mot de passe doit contenir au moins 6 caractères')
    }

    try {
      setError('')
      setLoading(true)
      await signup(formData.email, formData.password, formData.userType, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        grade: formData.grade
      })
      navigate('/welcome')
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  const gradeOptions = {
    student: [
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
  }

  const getUserTypeIcon = (type) => {
    switch (type) {
      case 'student':
        return <FaUserGraduate size={24} />
      case 'parent':
        return <FaUsers size={24} />
      case 'professor':
        return <FaChalkboardTeacher size={24} />
      default:
        return <FaUser size={24} />
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-center text-blue-600 mb-2">
            EduSecure+
          </h1>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Créer un compte
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Rejoignez notre plateforme éducative
          </p>
        </div>

        {/* Formulaire */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
              <FaExclamationCircle className="mr-2" size={20} />
              {error}
            </div>
          )}

          <div className="space-y-4">
            {/* Type d'utilisateur */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Type de compte
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'student', label: 'Élève' },
                  { value: 'parent', label: 'Parent' },
                  { value: 'professor', label: 'Professeur' }
                ].map((type) => (
                  <label 
                    key={type.value} 
                    className={`flex flex-col items-center p-3 border rounded-lg cursor-pointer transition-all ${
                      formData.userType === type.value 
                        ? 'border-blue-500 bg-blue-50 text-blue-700' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="userType"
                      value={type.value}
                      checked={formData.userType === type.value}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className={`mb-1 ${
                      formData.userType === type.value ? 'text-blue-600' : 'text-gray-500'
                    }`}>
                      {getUserTypeIcon(type.value)}
                    </div>
                    <span className="text-xs font-medium">{type.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Nom et Prénom */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  Prénom *
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="text-gray-400" size={18} />
                  </div>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Prénom"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Nom *
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="text-gray-400" size={18} />
                  </div>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Nom"
                  />
                </div>
              </div>
            </div>

            {/* Classe (pour les élèves) */}
            {formData.userType === 'student' && (
              <div>
                <label htmlFor="grade" className="block text-sm font-medium text-gray-700">
                  Classe
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaGraduationCap className="text-gray-400" size={18} />
                  </div>
                  <select
                    id="grade"
                    name="grade"
                    value={formData.grade}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="">Sélectionnez votre classe</option>
                    {gradeOptions.student.map((grade) => (
                      <option key={grade.value} value={grade.value}>
                        {grade.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Adresse email *
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400" size={18} />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="votre@email.com"
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Mot de passe *
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" size={18} />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Au moins 6 caractères"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-gray-50 rounded-r-lg transition-colors"
                >
                  {showPassword ? (
                    <FaEyeSlash className="text-gray-400" size={18} />
                  ) : (
                    <FaEye className="text-gray-400" size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Confirmation mot de passe */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirmer le mot de passe *
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" size={18} />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Répétez votre mot de passe"
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-gray-50 rounded-r-lg transition-colors"
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash className="text-gray-400" size={18} />
                  ) : (
                    <FaEye className="text-gray-400" size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Indicateur de force du mot de passe */}
            {formData.password && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        formData.password.length < 6 
                          ? 'bg-red-500 w-1/3' 
                          : formData.password.length < 8 
                          ? 'bg-yellow-500 w-2/3' 
                          : 'bg-green-500 w-full'
                      }`}
                    ></div>
                  </div>
                  <span className={`text-xs font-medium ${
                    formData.password.length < 6 
                      ? 'text-red-600' 
                      : formData.password.length < 8 
                      ? 'text-yellow-600' 
                      : 'text-green-600'
                  }`}>
                    {formData.password.length < 6 ? 'Faible' : formData.password.length < 8 ? 'Moyen' : 'Fort'}
                  </span>
                </div>
                              </div>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Création...
                </div>
              ) : (
                <div className="flex items-center">
                  <FaUserPlus className="mr-2" size={18} />
                  Créer mon compte
                </div>
              )}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Déjà un compte ?{' '}
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                Se connecter
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

