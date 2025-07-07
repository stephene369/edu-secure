import { useState } from 'react'
import { FaCheckCircle, FaCircle } from 'react-icons/fa'

export default function QuizQuestion({ 
  question, 
  questionNumber, 
  totalQuestions, 
  userAnswer, 
  onAnswerSelect 
}) {
  const [selectedAnswer, setSelectedAnswer] = useState(userAnswer || '')

  const handleAnswerChange = (answer) => {
    setSelectedAnswer(answer)
    onAnswerSelect(question.id, answer)
  }

  const renderMultipleChoice = () => (
    <div className="space-y-3">
      {question.options?.map((option, index) => (
        <button
          key={index}
          onClick={() => handleAnswerChange(option)}
          className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
            selectedAnswer === option
              ? 'border-purple-500 bg-purple-50 text-purple-700'
              : 'border-gray-200 hover:border-gray-300 bg-white'
          }`}
        >
          <div className="flex items-center">
            {selectedAnswer === option ? (
              <FaCheckCircle className="text-purple-500 mr-3 flex-shrink-0" size={20} />
            ) : (
              <FaCircle className="text-gray-400 mr-3 flex-shrink-0" size={20} />
            )}
            <span className="text-lg">{option}</span>
          </div>
        </button>
      ))}
    </div>
  )

  const renderTrueFalse = () => (
    <div className="space-y-3">
      {['true', 'false'].map((option) => (
        <button
          key={option}
          onClick={() => handleAnswerChange(option)}
          className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
            selectedAnswer === option
              ? 'border-purple-500 bg-purple-50 text-purple-700'
              : 'border-gray-200 hover:border-gray-300 bg-white'
          }`}
        >
          <div className="flex items-center">
            {selectedAnswer === option ? (
              <FaCheckCircle className="text-purple-500 mr-3 flex-shrink-0" size={20} />
            ) : (
              <FaCircle className="text-gray-400 mr-3 flex-shrink-0" size={20} />
            )}
            <span className="text-lg">{option === 'true' ? 'Vrai' : 'Faux'}</span>
          </div>
        </button>
      ))}
    </div>
  )

  const renderShortAnswer = () => (
    <div>
      <textarea
        value={selectedAnswer}
        onChange={(e) => handleAnswerChange(e.target.value)}
        placeholder="Tapez votre réponse ici..."
        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none resize-none"
        rows={4}
      />
    </div>
  )

  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
      {/* Header de la question */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="bg-white/20 px-4 py-2 rounded-full text-sm font-medium">
            Question {questionNumber} sur {totalQuestions}
          </span>
          <div className="bg-white/20 rounded-full h-2 w-32">
            <div 
              className="bg-white rounded-full h-2 transition-all duration-300"
              style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
            />
          </div>
        </div>
        <h2 className="text-2xl font-bold leading-relaxed">{question.question}</h2>
      </div>

      {/* Corps de la question */}
      <div className="p-8">
        {question.type === 'multiple_choice' && renderMultipleChoice()}
        {question.type === 'true_false' && renderTrueFalse()}
        {question.type === 'short_answer' && renderShortAnswer()}
        
        {/* Indication de réponse sélectionnée */}
        {selectedAnswer && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
            <p className="text-green-700 text-sm">
              ✓ Réponse sélectionnée : {
                question.type === 'true_false' 
                  ? (selectedAnswer === 'true' ? 'Vrai' : 'Faux')
                  : selectedAnswer.length > 50 
                    ? selectedAnswer.substring(0, 50) + '...'
                    : selectedAnswer
              }
            </p>
          </div>
        )}
      </div>
    </div>
  )
}