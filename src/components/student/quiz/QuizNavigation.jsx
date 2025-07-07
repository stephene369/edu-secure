import { FaArrowLeft, FaArrowRight, FaCheck, FaFlag } from 'react-icons/fa'

export default function QuizNavigation({ 
  currentIndex, 
  totalQuestions, 
  userAnswers, 
  questions,
  onPrevious, 
  onNext, 
  onSubmit 
}) {
  const answeredCount = Object.keys(userAnswers).length
  const isLastQuestion = currentIndex === totalQuestions - 1
  const hasAnsweredCurrent = questions[currentIndex] && userAnswers[questions[currentIndex].id]

  return (
    <div className="mt-8 space-y-6">
      {/* Indicateur de progression */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-gray-600">
            Progression du quiz
          </span>
          <span className="text-sm font-bold text-purple-600">
            {answeredCount}/{totalQuestions} réponses
          </span>
        </div>
        
        {/* Barre de progression */}
        <div className="bg-gray-200 rounded-full h-3 mb-4">
          <div 
            className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-full h-3 transition-all duration-300"
            style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
          />
        </div>

        {/* Mini aperçu des questions */}
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
          {questions.map((q, index) => (
            <button
              key={q.id}
              onClick={() => {
                if (index < currentIndex) onPrevious()
                else if (index > currentIndex) onNext()
              }}
              className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                index === currentIndex
                  ? 'bg-purple-600 text-white ring-2 ring-purple-300'
                  : userAnswers[q.id]
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Boutons de navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={onPrevious}
          disabled={currentIndex === 0}
          className="flex items-center px-6 py-3 bg-white/60 text-gray-700 rounded-xl hover:bg-white/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <FaArrowLeft className="mr-2" size={16} />
          Précédent
        </button>

        <div className="flex space-x-4">
          {!isLastQuestion ? (
            <button
              onClick={onNext}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all"
            >
              Suivant
              <FaArrowRight className="ml-2" size={16} />
            </button>
          ) : (
            <button
              onClick={onSubmit}
              className="flex items-center px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-105"
            >
              <FaCheck className="mr-2" size={16} />
              Terminer le quiz
            </button>
          )}
        </div>
      </div>

      {/* Avertissement si pas toutes les questions répondues */}
      {answeredCount < totalQuestions && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-center">
            <FaFlag className="text-yellow-600 mr-3" size={16} />
            <p className="text-yellow-800 text-sm">
              <strong>{totalQuestions - answeredCount}</strong> question{totalQuestions - answeredCount > 1 ? 's' : ''} 
              {totalQuestions - answeredCount > 1 ? ' restent' : ' reste'} sans réponse.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}