// Configuration Firebase - À compléter avec vos vraies clés
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage' // ← Assurez-vous que cette ligne existe


const firebaseConfig = {
  apiKey: "AIzaSyCFwKf0ea1fEkVgY909LePe7uHKqsYTTh8",
  authDomain: "educ-750d5.firebaseapp.com",
  databaseURL: "https://educ-750d5-default-rtdb.firebaseio.com",
  projectId: "educ-750d5",
  storageBucket: "educ-750d5.firebasestorage.app",
  messagingSenderId: "960727173667",
  appId: "1:960727173667:android:549599c65f462369baff96"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app)

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app)
export const storage = getStorage(app) // ← Assurez-vous que cette ligne existe


export default app