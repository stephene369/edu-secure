import { createContext, useContext, useState, useEffect } from 'react'
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db } from '../firebase/config'

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Inscription avec Firebase
  const signup = async (email, password, userType, additionalInfo) => {
    try {
      // Créer l'utilisateur avec Firebase Auth
      const { user } = await createUserWithEmailAndPassword(auth, email, password)
      
      // Sauvegarder les informations supplémentaires dans Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        userType: userType,
        firstName: additionalInfo.firstName,
        lastName: additionalInfo.lastName,
        grade: additionalInfo.grade || null,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      })

      return { user }
    } catch (error) {
      throw error
    }
  }

  // Connexion avec Firebase
  const login = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      
      // Mettre à jour la dernière connexion
      await setDoc(doc(db, 'users', result.user.uid), {
        lastLogin: new Date().toISOString()
      }, { merge: true })

      return result
    } catch (error) {
      throw error
    }
  }

  // Déconnexion
  const logout = () => {
    return signOut(auth)
  }

  // Récupérer les données utilisateur depuis Firestore
  const getUserData = async (uid) => {
    try {
      const docRef = doc(db, 'users', uid)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        return docSnap.data()
      } else {
        return null
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des données utilisateur:', error)
      return null
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Récupérer les données supplémentaires depuis Firestore
        const userData = await getUserData(user.uid)
        setCurrentUser({
          ...user,
          ...userData
        })
      } else {
        setCurrentUser(null)
      }
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value = {
    currentUser,
    signup,
    login,
    logout,
    getUserData
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}