import { FaArrowLeft, FaQuestionCircle, FaClock, FaExclamationTriangle } from 'react-icons/fa'

export default function QuizHeader({ 
  quiz, 
  chapter, 
  subject, 
  grade, 
  timeLeft, 
  quizState, 
  onBack 
}) {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getTimeColor = () => {
    if (timeLeft > 300) return 'text-green-600' // Plus de 5 min
    if (timeLeft > 60) return 'text-yellow-600'  // Plus de 1 min
    return 'text-red-600' // Moins de 1 min
  }

  return (
    <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={onBack}
              className="flex items-center text-gray-600 hover:text-gray-800 mr-4 bg-white/60 rounded-full px-4 py-2 transition-colors"
            >
              <FaArrowLeft className="mr-2" size={16} />
              Retour
            </button>
            <div className="flex items-center">
              <FaQuestionCircle className="text-purple-600 mr-3" size={24} />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{quiz.title}</h1>
                <p className="text-gray-600">
                  {chapter.title} • {subject.name} • {grade.toUpperCase()}
                </p>
              </div>
            </div>
          </div>
          
          {/* Timer - Affiché seulement pendant le quiz */}
          {quizState === 'active' && (
            <div className="flex items-center bg-white/60 rounded-full px-6 py-3">
              <FaClock className={`mr-2 ${getTimeColor()}`} size={20} />
              <span className={`text-xl font-bold ${getTimeColor()}`}>
                {formatTime(timeLeft)}
              </span>
              {timeLeft <= 60 && (
                <FaExclamationTriangle className="ml-2 text-red-500 animate-pulse" size={16} />
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}