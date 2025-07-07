import { 
  FaPlay, 
  FaArrowLeft, 
  FaClock, 
  FaQuestionCircle, 
  FaStar,
  FaInfoCircle 
} from 'react-icons/fa'

export default function QuizIntro({ quiz, questionsCount, onStart, onBack }) {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'facile': return 'text-green-600 bg-green-100'
      case 'moyen': return 'text-yellow-600 bg-yellow-100'
      case 'difficile': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white/60 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-8 text-center">
          <FaQuestionCircle className="mx-auto mb-4" size={48} />
          <h2 className="text-3xl font-bold mb-2">{quiz.title}</h2>
          {quiz.description && (
            <p className="text-purple-100 text-lg">{quiz.description}</p>
          )}
        </div>

        {/* Informations du quiz */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <FaQuestionCircle className="text-blue-600" size={24} />
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">Questions</h3>
              <p className="text-2xl font-bold text-blue-600">{questionsCount}</p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <FaClock className="text-green-600" size={24} />
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">Durée</h3>
              <p className="text-2xl font-bold text-green-600">{quiz.duration || 10} min</p>
            </div>

            <div className="text-center">
              <div className="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <FaStar className="text-yellow-600" size={24} />
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">Difficulté</h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(quiz.difficulty)}`}>
                {quiz.difficulty || 'Moyen'}
              </span>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 rounded-2xl p-6 mb-8">
            <div className="flex items-start">
              <FaInfoCircle className="text-blue-600 mr-3 mt-1 flex-shrink-0" size={20} />
              <div>
                <h4 className="font-semibold text-blue-900 mb-3">Instructions :</h4>
                <ul className="text-blue-800 space-y-2 text-sm">
                  <li>• Lisez attentivement chaque question avant de répondre</li>
                  <li>• Vous pouvez naviguer entre les questions avec les boutons</li>
                  <li>• Le temps est limité à {quiz.duration || 10} minutes</li>
                  <li>• Vos réponses sont sauvegardées automatiquement</li>
                  <li>• Cliquez sur "Terminer" pour soumettre votre quiz</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex space-x-4">
            <button
              onClick={onBack}
              className="flex-1 flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <FaArrowLeft className="mr-2" size={16} />
              Retour
            </button>
            
            <button
              onClick={onStart}
              className="flex-1 flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105"
            >
              <FaPlay className="mr-2" size={16} />
              Commencer le quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}