import { FaExclamationTriangle, FaArrowLeft } from 'react-icons/fa'

export default function ErrorMessage({ message, onBack }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-8">
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20">
          <FaExclamationTriangle className="mx-auto mb-4 text-red-500" size={48} />
          <h2 className="text-2xl font-bold text-red-600 mb-4">Erreur</h2>
          <p className="text-gray-600 mb-6">{message}</p>
          <button
            onClick={onBack}
            className="flex items-center justify-center w-full px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            <FaArrowLeft className="mr-2" size={16} />
            Retour
          </button>
        </div>
      </div>
    </div>
  )
}