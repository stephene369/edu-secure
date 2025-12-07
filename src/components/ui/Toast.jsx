// components/ui/Toast.jsx
import React from 'react'
import { FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaTimes } from 'react-icons/fa'

const variants = {
  success: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-800',
    icon: FaCheckCircle,
  },
  error: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-800',
    icon: FaExclamationTriangle,
  },
  warning: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    text: 'text-yellow-800',
    icon: FaExclamationTriangle,
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-800',
    icon: FaInfoCircle,
  },
}

export default function Toast({ 
  message, 
  type = 'info', 
  onClose,
  autoClose = true,
  duration = 5000 
}) {
  const { bg, border, text, icon: Icon } = variants[type]

  React.useEffect(() => {
    if (autoClose && onClose) {
      const timer = setTimeout(onClose, duration)
      return () => clearTimeout(timer)
    }
  }, [autoClose, duration, onClose])

  return (
    <div className={`fixed top-4 right-4 z-50 ${bg} ${border} border rounded-lg shadow-lg p-4 max-w-sm`}>
      <div className="flex items-start">
        <Icon className={`flex-shrink-0 mt-0.5 ${text}`} size={20} />
        <div className="ml-3 flex-1">
          <p className={`text-sm font-medium ${text}`}>
            {message}
          </p>
        </div>
        <button
          onClick={onClose}
          className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-600"
        >
          <FaTimes size={16} />
        </button>
      </div>
    </div>
  )
}