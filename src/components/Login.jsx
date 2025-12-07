import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'


import { useAuth } from '../contexts/AuthContext'
import { 
  MdError, 
  MdEmail, 
  MdLock, 
  MdVisibility, 
  MdVisibilityOff, 
  MdLogin 
} from 'react-icons/md'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    console.log('🚀 Début de la connexion')
    
    if (!email || !password) {
      return setError('Veuillez remplir tous les champs')
    }

    try {
      setError('')
      setLoading(true)


      
      console.log('📧 Tentative de connexion avec:', email)
      
      // Attendre la connexion
      const result = await login(email, password)
      console.log('✅ Connexion réussie:', result.user.email)
      
      // Redirection immédiate vers Welcome
      console.log('🔄 Redirection vers /welcome')
      navigate('/welcome', { replace: true })
      
    } catch (error) {

      console.error('❌ Erreur de connexion:', error)
      
      // Messages d'erreur plus spécifiques
      let errorMessage = 'Erreur de connexion'
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'Aucun compte trouvé avec cet email'
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Mot de passe incorrect'
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Format d\'email invalide'
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Trop de tentatives. Réessayez plus tard'
      } else {
        errorMessage = error.message || 'Email ou mot de passe incorrect'
      }
      
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
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
            Connexion
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Accédez à votre espace d'apprentissage
          </p>
        </div>

        {/* Formulaire */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
              <MdError className="mr-2" size={20} color="#dc2626" />
              {error}
            </div>
          )}

          <div className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Adresse email
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MdEmail size={20} color="#6b7280" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="votre@email.com"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Mot de passe
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MdLock size={20} color="#6b7280" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none relative block w-full pl-10 pr-10 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Votre mot de passe"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}

                  disabled={loading}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-gray-50 rounded-r-lg transition-colors disabled:opacity-50"
                >
                  {showPassword ? (
                    <MdVisibilityOff size={20} color="#6b7280" />
                  ) : (
                    <MdVisibility size={20} color="#6b7280" />
                  )}
                </button>
              </div>
            </div>
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

                  Connexion en cours...
                </div>
              ) : (
                <div className="flex items-center">
                  <MdLogin size={18} className="mr-2" color="white" />
                  Se connecter
                </div>
              )}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Pas encore de compte ?{' '}
              <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                Créer un compte
              </Link>
            </p>
          </div>


          {/* Compte de test pour développement */}

        </form>
      </div>
    </div>
  )
}
