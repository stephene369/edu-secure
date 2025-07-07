import { collection, doc, addDoc, setDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';

export const quizService = {
  // Créer un quiz
  async createQuiz(classId, subjectId, chapterId, quizData) {
    const quizRef = collection(db, `classes/${classId}/subjects/${subjectId}/chapters/${chapterId}/quizzes`);
    return await addDoc(quizRef, {
      ...quizData,
      createdAt: new Date()
    });
  },

  // Ajouter une question
  async addQuestion(classId, subjectId, chapterId, quizId, questionData) {
    const questionRef = doc(db, `classes/${classId}/subjects/${subjectId}/chapters/${chapterId}/quizzes/${quizId}/questions`, questionData.id);
    return await setDoc(questionRef, questionData);
  },

  // Récupérer les questions d'un quiz
  async getQuizQuestions(classId, subjectId, chapterId, quizId) {
    const questionsRef = collection(db, `classes/${classId}/subjects/${subjectId}/chapters/${chapterId}/quizzes/${quizId}/questions`);
    const snapshot = await getDocs(questionsRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
};