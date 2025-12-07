import { useState, useEffect } from 'react'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { updateProfile } from 'firebase/auth'
import { db, auth } from '../firebase/config'

export const useStudentProfile = (userId) => {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Charger le profil depuis Firebase
  useEffect(() => {
    const loadProfile = async () => {
      if (!userId) {
        setLoading(false)
        return 
      }

      try {
        setLoading(true)
        setError('')
        
        const profileRef = doc(db, 'students', userId)
        const profileSnap = await getDoc(profileRef)
        
        if (profileSnap.exists()) {
          setProfile(profileSnap.data())
        } else {
          setProfile(null)
        }
      } catch (err) {
        console.error('Erreur lors du chargement du profil:', err)
        setError('Erreur lors du chargement du profil')
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [userId])

  // Sauvegarder le profil
  const saveProfile = async (profileData) => {
    if (!userId) return false

    try {
      setError('')
      
      const profileRef = doc(db, 'students', userId)
      const userRef = doc(db, 'users', userId)
      
      // Préparer les données à sauvegarder
      const profileToSave = {
        ...profileData,
        userId,
        updatedAt: new Date().toISOString()
      }

      // Sauvegarder dans la collection students
      await setDoc(profileRef, profileToSave, { merge: true })
      
      // Si la classe a changé, mettre à jour aussi dans users
      if (profileData.grade) {
        await updateDoc(userRef, {
          grade: profileData.grade,
          updatedAt: new Date().toISOString()
        })

        // Mettre à jour le profil Firebase Auth si nécessaire
        if (auth.currentUser) {
          await updateProfile(auth.currentUser, {
            displayName: `${auth.currentUser.displayName || ''} - ${profileData.grade.toUpperCase()}`
          })
        }
      }

      // Mettre à jour l'état local immédiatement
      setProfile(profileToSave)
      
      return true
    } catch (err) {
      console.error('Erreur lors de la sauvegarde:', err)
      setError('Erreur lors de la sauvegarde du profil')
      return false
    }
  }

  // Vérifier si le profil est complet
  const isProfileComplete = () => {
    if (!profile) return false
    
    const requiredFields = ['gender', 'birthDate', 'city', 'emergencyContact']
    return requiredFields.every(field => profile[field] && profile[field].trim() !== '')
  }

  return {
    profile,
    loading,
    error,
    saveProfile,
    isProfileComplete
  }
}