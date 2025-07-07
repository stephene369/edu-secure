import { useState } from 'react';
import { quizService } from '../config/firestore';

export const useQuiz = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const createQuiz = async (classId, subjectId, chapterId, quizData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const result = await quizService.createQuiz(classId, subjectId, chapterId, quizData);
      setSuccess(true);
      return result;
    } catch (err) {
      setError('Erreur lors de la création du quiz: ' + err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addQuestion = async (classId, subjectId, chapterId, quizId, questionData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      await quizService.addQuestion(classId, subjectId, chapterId, quizId, questionData);
      setSuccess(true);
    } catch (err) {
      setError('Erreur lors de l\'ajout de la question: ' + err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearMessages = () => {
    setError(null);
    setSuccess(false);
  };

  return { 
    createQuiz, 
    addQuestion, 
    loading, 
    error, 
    success, 
    clearMessages 
  };
};