import { useState, useEffect } from 'react'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../../../../firebase/config'
import { validateYouTubeUrl, getYouTubeEmbedUrl } from '../../../../utils/youtube'

export function useLessonForm({
  selectedGrade,
  selectedSubject,
  selectedChapter,
  selectedSubchapter,
  currentUser
}) {
  const [lessonForm, setLessonForm] = useState({
    title: '',
    content: '',
    videoUrl: ''
  })
  
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [adding, setAdding] = useState(false)

  const handleAddLesson = async (e) => {
    e.preventDefault()
    
    if (!lessonForm.title.trim()) {
      setError('Le titre du cours est obligatoire')
      return
    }
    
    if (!lessonForm.content.trim()) {
      setError('Le contenu du cours est obligatoire')
      return
    }
    
    if (!selectedGrade || !selectedSubject || !selectedChapter || !selectedSubchapter) {
      setError('Veuillez sélectionner une classe, matière, chapitre et sous-chapitre')
      return
    }
    
    if (lessonForm.videoUrl && !validateYouTubeUrl(lessonForm.videoUrl)) {
      setError('L\'URL YouTube n\'est pas valide')
      return
    }

    try {
      setAdding(true)
      setError('')
      
      const lessonsRef = collection(
        db,
        'classes', selectedGrade,
        'subjects', selectedSubject,
        'chapters', selectedChapter,
        'subchapters', selectedSubchapter,
        'lessons'
      )
      
      const lessonData = {
        title: lessonForm.title.trim(),
        content: lessonForm.content.trim(),
        videoUrl: lessonForm.videoUrl ? getYouTubeEmbedUrl(lessonForm.videoUrl.trim()) : '',
        createdBy: currentUser.uid,
        createdAt: serverTimestamp()
      }
      
      await addDoc(lessonsRef, lessonData)
      
      setSuccess('Cours ajouté avec succès !')
      setLessonForm({ title: '', content: '', videoUrl: '' })
      
    } catch (err) {
      console.error('Erreur lors de l\'ajout du cours:', err)
      setError('Erreur lors de l\'ajout du cours')
    } finally {
      setAdding(false)
    }
  }

  // Réinitialiser les messages
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError('')
        setSuccess('')
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [error, success])

  return {
    lessonForm,
    error,
    success,
    adding,
    setError,
    setSuccess,
    handleAddLesson,
    setLessonForm
  }
}