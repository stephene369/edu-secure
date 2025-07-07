import { useState } from 'react'
import { 
  FaTrophy, 
  FaCheck, 
  FaTimes, 
  FaRedo, 
  FaArrowLeft,
  FaStar,
  FaChartPie,
  FaClock,
  FaEye,
  FaEyeSlash
} from 'react-icons/fa'

export default function QuizResults({ 
  quiz, 
  questions, 
  userAnswers, 
  onRetry, 
  onBack 
}) {
  const [showDetails, setShowDetails] = useState(false)

  // Calculer les résultats
  const calculateResults = () => {
    let correctAnswers = 0
    let totalAnswered = 0

    questions.forEach(question => {
      const userAnswer = userAnswers[question.id]
      if (userAnswer !== undefined && userAnswer !== '') {
        totalAnswered++
        if (userAnswer === question.correctAnswer) {
          correctAnswers++
        }
      }
    })

    const score = totalAnswered > 0 ? Math.round((correctAnswers / questions.length) * 100) : 0
    const percentage = totalAnswered > 0 ? Math.round((correctAnswers / totalAnswered) * 100) : 0

    return {
      correctAnswers,
      totalAnswered,
      totalQuestions: questions.length,
      score,
      percentage
    }
  }

  const results = calculateResults()

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBadge = (score) => {
    if (score >= 90) return { text: 'Excellent !', color: 'bg-green-500', icon: '🏆' }
    if (score >= 80) return { text: 'Très bien !', color: 'bg-blue-500', icon: '⭐' }
    if (score >= 60) return { text: 'Bien !', color: 'bg-yellow-500', icon: '👍' }
    if (score >= 40) return { text: 'Peut mieux faire', color: 'bg-orange-500', icon: '📚' }
    return { text: 'À retravailler', color: 'bg-red-500', icon: '💪' }
  }

  const badge = getScoreBadge(results.score)

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Résultats principaux */}
      <div className="bg-white/60 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
        {/* Header avec score */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-8 text-center">
          <FaTrophy className="mx-auto mb-4 text-yellow-300" size={48} />
          <h2 className="text-3xl font-bold mb-2">Quiz terminé !</h2>
          <div className="text-6xl font-bold mb-4">{results.score}%</div>
          <div className={`inline-flex items-center px-6 py-3 rounded-full text-lg font-bold ${badge.color}`}>
            <span className="mr-2">{badge.icon}</span>
            {badge.text}
          </div>
        </div>

        {/* Statistiques détaillées */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <FaCheck className="text-green-600" size={24} />
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">Correctes</h3>
              <p className="text-2xl font-bold text-green-600">{results.correctAnswers}</p>
            </div>

            <div className="text-center">
              <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <FaTimes className="text-red-600" size={24} />
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">Incorrectes</h3>
              <p className="text-2xl font-bold text-red-600">
                {results.totalAnswered - results.correctAnswers}
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <FaChartPie className="text-gray-600" size={24} />
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">Non répondues</h3>
              <p className="text-2xl font-bold text-gray-600">
                {results.totalQuestions - results.totalAnswered}
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <FaStar className="text-blue-600" size={24} />
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">Précision</h3>
              <p className="text-2xl font-bold text-blue-600">{results.percentage}%</p>
            </div>
          </div>

          {/* Barre de progression visuelle */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progression</span>
              <span>{results.correctAnswers}/{results.totalQuestions}</span>
            </div>
            <div className="bg-gray-200 rounded-full h-4">
              <div 
                className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-full h-4 transition-all duration-1000"
                style={{ width: `${results.score}%` }}
              />
            </div>
          </div>

          {/* Bouton pour voir les détails */}
          <div className="text-center mb-6">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center justify-center mx-auto px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
            >
              {showDetails ? <FaEyeSlash className="mr-2" /> : <FaEye className="mr-2" />}
              {showDetails ? 'Masquer les détails' : 'Voir les détails'}
            </button>
          </div>

          {/* Actions */}
          <div className="flex space-x-4">
            <button
              onClick={onBack}
              className="flex-1 flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <FaArrowLeft className="mr-2" size={16} />
              Retour au chapitre
            </button>
            
            <button
              onClick={onRetry}
              className="flex-1 flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all"
            >
              <FaRedo className="mr-2" size={16} />
              Refaire le quiz
            </button>
          </div>
        </div>
      </div>

      {/* Détails des réponses */}
      {showDetails && (
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="bg-gray-800 text-white p-6">
            <h3 className="text-2xl font-bold">Détail des réponses</h3>
            <p className="text-gray-300">Revoyez vos réponses question par question</p>
          </div>

          <div className="p-6 space-y-6">
            {questions.map((question, index) => {
              const userAnswer = userAnswers[question.id]
              const isCorrect = userAnswer === question.correctAnswer
              const wasAnswered = userAnswer !== undefined && userAnswer !== ''

              return (
                <div key={question.id} className={`border-2 rounded-xl p-6 ${
                  !wasAnswered ? 'border-gray-300 bg-gray-50' :
                  isCorrect ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'
                }`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3 ${
                        !wasAnswered ? 'bg-gray-400 text-white' :
                        isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                      }`}>
                        {index + 1}
                      </span>
                      <div>
                        {!wasAnswered ? (
                          <span className="text-gray-600 text-sm">Non répondu</span>
                        ) : isCorrect ? (
                          <span className="text-green-600 text-sm font-medium">✓ Correct</span>
                        ) : (
                          <span className="text-red-600 text-sm font-medium">✗ Incorrect</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <h4 className="font-semibold text-gray-800 mb-4">{question.question}</h4>

                  <div className="space-y-2">
                    {wasAnswered && (
                      <div className={`p-3 rounded-lg ${
                        isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        <span className="text-sm font-medium">Votre réponse : </span>
                        <span>{
                          question.type === 'true_false' 
                            ? (userAnswer === 'true' ? 'Vrai' : 'Faux')
                            : userAnswer
                        }</span>
                      </div>
                    )}

                    {!isCorrect && (
                      <div className="p-3 bg-green-100 text-green-800 rounded-lg">
                        <span className="text-sm font-medium">Bonne réponse : </span>
                        <span>{
                          question.type === 'true_false' 
                            ? (question.correctAnswer === 'true' ? 'Vrai' : 'Faux')
                            : question.correctAnswer
                        }</span>
                      </div>
                    )}

                    {question.explanation && (
                      <div className="p-3 bg-blue-50 text-blue-800 rounded-lg">
                        <span className="text-sm font-medium">Explication : </span>
                        <span>{question.explanation}</span>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}