import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QuizSelector from '../../components/quiz/QuizSelector';
import QuizForm from '../../components/quiz/QuizForm';
import { useQuiz } from '../../hooks/useQuiz';

const CreateQuiz = () => {
  const [selection, setSelection] = useState({});
  const [showForm, setShowForm] = useState(false);
  const { createQuiz, loading, error, success } = useQuiz();
  const navigate = useNavigate();

  const handleSelectionChange = (newSelection) => {
    setSelection(newSelection);
    setShowForm(newSelection.class && newSelection.subject && newSelection.chapter);
  };

  const handleQuizSubmit = async (quizData) => {
    try {
      const result = await createQuiz(
        selection.class,
        selection.subject,
        selection.chapter,
        {
          ...quizData,
          createdBy: 'current_user_uid' // À remplacer par l'UID réel
        }
      );
      
      // Rediriger vers la page d'ajout de questions
      navigate(`/professor/quiz/${result.id}/questions`, {
        state: { selection, quizId: result.id }
      });
    } catch (err) {
      console.error('Erreur lors de la création du quiz:', err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Créer un nouveau quiz
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          Quiz créé avec succès !
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">1. Sélectionner le chapitre</h2>
        <QuizSelector onSelectionChange={handleSelectionChange} />

        {showForm && (
          <div className="mt-8 pt-8 border-t">
            <h2 className="text-xl font-semibold mb-4">2. Informations du quiz</h2>
            <QuizForm onSubmit={handleQuizSubmit} loading={loading} />
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateQuiz;