import { FaSpinner } from 'react-icons/fa'

export default function LoadingSpinner({ message = "Chargement..." }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center">
      <div className="text-center">
        <FaSpinner className="animate-spin mx-auto mb-4 text-purple-600" size={48} />
        <p className="text-gray-600 text-lg">{message}</p>
      </div>
    </div>
  )
}