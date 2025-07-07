const QuestionPreview = ({ questions, onDelete }) => {
  if (questions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Aucune question ajoutée pour le moment
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">
        Questions ajoutées ({questions.length})
      </h3>
      
      {questions.map((question, index) => (
        <div key={question.id} className="bg-gray-50 p-4 rounded-lg border">
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-medium text-gray-800">
              Question {index + 1}
            </h4>
            <button
              onClick={() => onDelete(question.id)}
              className="text-red-600 hover:text-red-800 text-sm"
            >
              Supprimer
            </button>
          </div>
          
          <p className="text-gray-700 mb-2">{question.question}</p>
          
          {question.type === 'multiple_choice' && (
            <div className="mb-2">
              <p className="text-sm text-gray-600 mb-1">Options :</p>
              <ul className="list-disc list-inside text-sm text-gray-600">
                {question.options.map((option, i) => (
                  <li key={i} className={option === question.answer ? 'text-green-600 font-medium' : ''}>
                    {option} {option === question.answer && '✓'}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {question.type !== 'multiple_choice' && (
            <p className="text-sm text-green-600 font-medium mb-2">
              Réponse : {question.answer}
            </p>
          )}
          
          {question.correction && (
            <p className="text-sm text-gray-600 italic">
              Explication : {question.correction}
            </p>
          )}
          
          <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
            {question.type === 'multiple_choice' ? 'Choix multiple' : 
             question.type === 'true_false' ? 'Vrai/Faux' : 'Réponse courte'}
          </span>
        </div>
      ))}
    </div>
  );
};

export default QuestionPreview;