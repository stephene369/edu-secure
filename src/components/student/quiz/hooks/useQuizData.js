import { useState, useEffect } from 'react'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from '../../../../firebase/config'

export const useQuizData = ({ grade, subjectId, chapterId, quizId }) => {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!grade || !subjectId || !chapterId || !quizId) return

    const loadQuestions = async () => {
      try {
        setLoading(true)
        setError('')
        
        const questionsRef = collection(
          db,
          'classes', grade,
          'subjects', subjectId,
          'chapters', chapterId,
          'quizzes', quizId,
          'questions'
        )
        
        const questionsQuery = query(questionsRef, orderBy('createdAt', 'asc'))
        const snapshot = await getDocs(questionsQuery)
        
        const questionsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        
        setQuestions(questionsData)
        
      } catch (err) {
        console.error('Erreur lors du chargement des questions:', err)
        setError('Erreur lors du chargement des questions du quiz')
      } finally {
        setLoading(false)
      }
    }

    loadQuestions()
  }, [grade, subjectId, chapterId, quizId])

  return { questions, loading, error }
}