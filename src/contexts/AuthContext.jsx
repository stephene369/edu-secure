import { createContext, useContext, useState, useEffect } from 'react'
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'
import { doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore'
import { auth, db } from '../firebase/config'

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Inscription
  const signup = async (email, password, userType, additionalData) => {
    console.log('📝 Début inscription pour:', email)
    
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // Créer le document utilisateur
    const userData = {
      uid: user.uid,
      email: user.email,
      userType,
      ...additionalData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    await setDoc(doc(db, 'users', user.uid), userData)
    console.log('✅ Inscription terminée et document créé')
    
    return userCredential
  }

  // Connexion
  const login = async (email, password) => {
    console.log('🔐 Début connexion Firebase pour:', email)
    
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      console.log('✅ Connexion Firebase réussie pour:', result.user.email)
      return result
    } catch (error) {
      console.error('❌ Erreur connexion Firebase:', error.code, error.message)
      throw error
    }
  }

  // Déconnexion
  const logout = () => {
    console.log('🚪 Déconnexion')
    return signOut(auth)
  }

  // Écouter les changements d'authentification et de profil
  useEffect(() => {
    let unsubscribeUser = null

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      console.log('🔄 Changement état auth:', user ? `Connecté: ${user.email}` : 'Déconnecté')
      
      if (user) {
        try {
          // Récupérer les données utilisateur depuis Firestore
          const userDocRef = doc(db, 'users', user.uid)
          
          // Écouter les changements du document utilisateur en temps réel
          unsubscribeUser = onSnapshot(userDocRef, (doc) => {
            if (doc.exists()) {
              const userData = doc.data()
              const fullUserData = {
                uid: user.uid,
                email: user.email,
                ...userData
              }
              
              setCurrentUser(fullUserData)
            } else {
              console.log('⚠️ Document utilisateur non trouvé, données de base uniquement')
              const basicUserData = {
                uid: user.uid,
                email: user.email,
                userType: 'student' // Par défaut
              }
              setCurrentUser(basicUserData)
            }
            setLoading(false)
          }, (error) => {
            console.error('❌ Erreur écoute document utilisateur:', error)
            // En cas d'erreur, utiliser les données de base
            setCurrentUser({
              uid: user.uid,
              email: user.email,
              userType: 'student'
            })
            setLoading(false)
          })

        } catch (error) {
          console.error('❌ Erreur chargement profil:', error)
          setCurrentUser({
            uid: user.uid,
            email: user.email,
            userType: 'student'
          })
          setLoading(false)
        }
      } else {
        console.log('👤 Aucun utilisateur connecté')
        setCurrentUser(null)
        setLoading(false)
        
        // Nettoyer l'écoute du document utilisateur
        if (unsubscribeUser) {
          unsubscribeUser()
          unsubscribeUser = null
        }
      }
    })

    // Nettoyer les écouteurs
    return () => {
      console.log('🧹 Nettoyage des écouteurs auth')
      unsubscribeAuth()
      if (unsubscribeUser) {
        unsubscribeUser()
      }
    }
  }, [])

  const value = {
    currentUser,
    signup,
    login,
    logout
  }

  console.log('🔄 AuthProvider render - currentUser:', currentUser ? `${currentUser.email} (${currentUser.userType})` : 'null', 'loading:', loading)

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}