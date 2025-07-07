import { useState, useEffect } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useQuizData } from './quiz/hooks/useQuizData'
import { useQuizTimer } from './quiz/hooks/useQuizTimer'
import QuizHeader from './quiz/QuizHeader'
import QuizIntro from './quiz/QuizIntro'
import QuizQuestion from './quiz/QuizQuestion'
import QuizResults from './quiz/QuizResults'
import QuizNavigation from './quiz/QuizNavigation'
import LoadingSpinner from './quiz/LoadingSpinner'
import ErrorMessage from './quiz/ErrorMessage'

export default function QuizView() {
  const { quizId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  
  const [quizState, setQuizState] = useState('intro') // 'intro', 'active', 'completed'
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)

  const quiz = location.state?.quiz
  const chapter = location.state?.chapter
  const subject = location.state?.subject
  const grade = location.state?.grade
  const subjectId = location.state?.subjectId
  const chapterId = location.state?.chapterId

  // Hooks personnalisés
  const { questions, loading, error } = useQuizData({
    grade,
    subjectId,
    chapterId,
    quizId
  })

  const { timeLeft, isTimeUp, startTimer, stopTimer } = useQuizTimer({
    duration: quiz?.duration || 10,
    onTimeUp: () => handleSubmitQuiz()
  })

  useEffect(() => {
    if (!currentUser || currentUser.userType !== 'student') {
      navigate('/login')
      return
    }
    
    if (!quiz || !chapter || !subject) {
      navigate('/student/dashboard')
      return
    }
  }, [currentUser, quiz, chapter, subject, navigate])

  const handleStartQuiz = () => {
    setQuizState('active')
    startTimer()
  }

  const handleAnswerSelect = (questionId, answer) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }))
  }

  const handleSubmitQuiz = () => {
    stopTimer()
    setQuizState('completed')
    setShowResults(true)
  }

  const handleBackToChapter = () => {
    navigate(`/student/chapter/${chapterId}`, {
      state: { chapter, subject, grade, subjectId }
    })
  }

  if (!quiz || !chapter || !subject) {
    return <ErrorMessage message="Quiz non trouvé" onBack={() => navigate('/student/dashboard')} />
  }

  if (loading) {
    return <LoadingSpinner message="Chargement du quiz..." />
  }

  if (error) {
    return <ErrorMessage message={error} onBack={handleBackToChapter} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <QuizHeader 
        quiz={quiz}
        chapter={chapter}
        subject={subject}
        grade={grade}
        timeLeft={timeLeft}
        quizState={quizState}
        onBack={handleBackToChapter}
      />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {quizState === 'intro' && (
          <QuizIntro 
            quiz={quiz}
            questionsCount={questions.length}
            onStart={handleStartQuiz}
            onBack={handleBackToChapter}
          />
        )}

        {quizState === 'active' && questions.length > 0 && (
          <>
            <QuizQuestion
              question={questions[currentQuestionIndex]}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={questions.length}
              userAnswer={userAnswers[questions[currentQuestionIndex]?.id]}
              onAnswerSelect={handleAnswerSelect}
            />
            
            <QuizNavigation
              currentIndex={currentQuestionIndex}
              totalQuestions={questions.length}
              userAnswers={userAnswers}
              questions={questions}
              onPrevious={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
              onNext={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
              onSubmit={handleSubmitQuiz}
            />
          </>
        )}

        {quizState === 'completed' && showResults && (
          <QuizResults
            quiz={quiz}
            questions={questions}
            userAnswers={userAnswers}
            onRetry={() => {
              setQuizState('intro')
              setCurrentQuestionIndex(0)
              setUserAnswers({})
              setShowResults(false)
            }}
            onBack={handleBackToChapter}
          />
        )}
      </main>
    </div>
  )
}