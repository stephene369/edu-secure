import { useState } from 'react'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from '../../../../firebase/config'

export function useLessonData() {
  const [selectedGrade, setSelectedGrade] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('')
  const [selectedChapter, setSelectedChapter] = useState('')
  const [selectedSubchapter, setSelectedSubchapter] = useState('')
  
  const [subjects, setSubjects] = useState([])
  const [chapters, setChapters] = useState([])
  const [subchapters, setSubchapters] = useState([])
  const [loading, setLoading] = useState(false)

  const loadSubjects = async (grade) => {
    if (!grade) return
    
    try {
      setLoading(true)
      const subjectsRef = collection(db, 'classes', grade, 'subjects')
      const subjectsQuery = query(subjectsRef, orderBy('createdAt', 'desc'))
      const snapshot = await getDocs(subjectsQuery)
      
      const subjectsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      
      setSubjects(subjectsData)
    } catch (err) {
      console.error('Erreur lors du chargement des matières:', err)
    } finally {
      setLoading(false)
    }
  }

  const loadChapters = async (grade, subjectId) => {
    if (!grade || !subjectId) return
    
    try {
      setLoading(true)
      const chaptersRef = collection(db, 'classes', grade, 'subjects', subjectId, 'chapters')
      const chaptersQuery = query(chaptersRef, orderBy('order', 'asc'))
      const snapshot = await getDocs(chaptersQuery)
      
      const chaptersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      
      setChapters(chaptersData)
    } catch (err) {
      console.error('Erreur lors du chargement des chapitres:', err)
    } finally {
      setLoading(false)
    }
  }

  const loadSubchapters = async (grade, subjectId, chapterId) => {
    if (!grade || !subjectId || !chapterId) return
    
    try {
      setLoading(true)
      const subchaptersRef = collection(db, 'classes', grade, 'subjects', subjectId, 'chapters', chapterId, 'subchapters')
      const subchaptersQuery = query(subchaptersRef, orderBy('order', 'asc'))
      const snapshot = await getDocs(subchaptersQuery)
      
      const subchaptersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      
      setSubchapters(subchaptersData)
    } catch (err) {
      console.error('Erreur lors du chargement des sous-chapitres:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleGradeChange = (grade) => {
    setSelectedGrade(grade)
    setSelectedSubject('')
    setSelectedChapter('')
    setSelectedSubchapter('')
    setSubjects([])
    setChapters([])
    setSubchapters([])
    if (grade) {
      loadSubjects(grade)
    }
  }

  const handleSubjectChange = (subjectId) => {
    setSelectedSubject(subjectId)
    setSelectedChapter('')
    setSelectedSubchapter('')
    setChapters([])
    setSubchapters([])
    if (subjectId) {
      loadChapters(selectedGrade, subjectId)
    }
  }

  const handleChapterChange = (chapterId) => {
    setSelectedChapter(chapterId)
    setSelectedSubchapter('')
    setSubchapters([])
    if (chapterId) {
      loadSubchapters(selectedGrade, selectedSubject, chapterId)
    }
  }

  return {
    selectedGrade,
    selectedSubject,
    selectedChapter,
    selectedSubchapter,
    subjects,
    chapters,
    subchapters,
    loading,
    handleGradeChange,
    handleSubjectChange,
    handleChapterChange,
    setSelectedSubchapter
  }
}