import { FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa'

export default function StatusMessages({ error, success }) {
  if (!error && !success) return null

  return (
    <>
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
    </>
  )
}