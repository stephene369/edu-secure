import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import QuestionForm from '../../components/quiz/QuestionForm';
import QuestionPreview from '../../components/quiz/QuestionPreview';
import { useQuiz } from '../../hooks/useQuiz';

const AddQuestions = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addQuestion, loading, error, success } = useQuiz();
  
  const [questions, setQuestions] = useState([]);
  const [showForm, setShowForm] = useState(true);
  
  const { selection, quizId } = location.state || {};

  useEffect(() => {
    if (!selection || !quizId) {
      navigate('/professor/create-quiz');
    }
  }, [selection, quizId, navigate]);

  const handleAddQuestion = async (questionData) => {
    try {
      await addQuestion(
        selection.class,
        selection.subject,
        selection.chapter,
        quizId,
        questionData
      );
      
      setQuestions([...questions, questionData]);
      setShowForm(false);
      
      // Réafficher le formulaire après 1 seconde
      setTimeout(() => setShowForm(true), 1000);
    } catch (err) {
      console.error('Erreur lors de l\'ajout de la question:', err);
    }
  };

  const handleDeleteQuestion = (questionId) => {
    setQuestions(questions.filter(q => q.id !== questionId));
  };

  const handleFinish = () => {
    navigate('/professor/dashboard');
  };

  if (!selection || !quizId) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Ajouter des questions
        </h1>
        <p className="text-gray-600">
          {selection.class} • {selection.subject} • {selection.chapter}
        </p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          Question ajoutée avec succès !
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulaire d'ajout */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">
            Nouvelle question
          </h2>
          
          {showForm ? (
            <QuestionForm onSubmit={handleAddQuestion} loading={loading} />
          ) : (
            <div className="text-center py-8 text-green-600">
              Question ajoutée ! ✓
            </div>
          )}
        </div>

        {/* Aperçu des questions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <QuestionPreview 
            questions={questions} 
            onDelete={handleDeleteQuestion} 
          />
          
          {questions.length > 0 && (
            <div className="mt-6 pt-4 border-t">
              <button
                onClick={handleFinish}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700"
              >
                Terminer le quiz ({questions.length} question{questions.length > 1 ? 's' : ''})
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddQuestions;