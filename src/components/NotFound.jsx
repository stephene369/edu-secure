import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <box-icon name='error-404' size='120px' color='#6b7280'></box-icon>
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Page non trouvée
        </h1>
        
        <p className="text-gray-600 mb-8">
          Désolé, la page que vous recherchez n'existe pas.
        </p>
        
        <div className="space-y-4">
          <Link
            to="/welcome"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            <box-icon name='home' color='white' size='18px' class='mr-2'></box-icon>
            Retour à l'accueil
          </Link>
          
          <div>
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-500 text-sm font-medium transition-colors"
            >
              Se connecter
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}