import { useState } from 'react';

const QuestionForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    question: '',
    options: ['', ''],
    answer: '',
    correction: '',
    type: 'multiple_choice'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.question.trim()) return;
    if (formData.options.some(opt => !opt.trim())) return;
    if (!formData.answer.trim()) return;

    onSubmit({
      ...formData,
      id: Date.now().toString() // ID temporaire
    });

    // Reset form
    setFormData({
      question: '',
      options: ['', ''],
      answer: '',
      correction: '',
      type: 'multiple_choice'
    });
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  const addOption = () => {
    if (formData.options.length < 6) {
      setFormData({
        ...formData,
        options: [...formData.options, '']
      });
    }
  };

  const removeOption = (index) => {
    if (formData.options.length > 2) {
      const newOptions = formData.options.filter((_, i) => i !== index);
      setFormData({ ...formData, options: newOptions });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Type de question */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Type de question
        </label>
        <select
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="multiple_choice">Choix multiple</option>
          <option value="true_false">Vrai/Faux</option>
          <option value="short_answer">Réponse courte</option>
        </select>
      </div>

      {/* Question */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Intitulé de la question *
        </label>
        <textarea
          value={formData.question}
          onChange={(e) => setFormData({ ...formData, question: e.target.value })}
          placeholder="Quel auxiliaire utilise-t-on avec le verbe 'aller' ?"
          rows="3"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      {/* Options (pour choix multiple et vrai/faux) */}
      {(formData.type === 'multiple_choice' || formData.type === 'true_false') && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Options de réponse *
          </label>
          <div className="space-y-2">
            {formData.options.map((option, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
                {formData.options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeOption(index)}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
          
          {formData.options.length < 6 && (
            <button
              type="button"
              onClick={addOption}
              className="mt-2 px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50"
            >
              + Ajouter une option
            </button>
          )}
        </div>
      )}

      {/* Réponse correcte */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Réponse correcte *
        </label>
        {formData.type === 'multiple_choice' ? (
          <select
            value={formData.answer}
            onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Sélectionner la bonne réponse</option>
            {formData.options.map((option, index) => (
              option.trim() && (
                <option key={index} value={option}>
                  {option}
                </option>
              )
            ))}
          </select>
        ) : (
          <input
            type="text"
            value={formData.answer}
            onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
            placeholder="Réponse correcte"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        )}
      </div>

      {/* Explication */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Explication (facultatif)
        </label>
        <textarea
          value={formData.correction}
          onChange={(e) => setFormData({ ...formData, correction: e.target.value })}
          placeholder="Le verbe 'aller' se conjugue avec l'auxiliaire 'être'."
          rows="2"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50"
      >
        {loading ? 'Ajout...' : 'Ajouter la question'}
      </button>
    </form>
  );
};

export default QuestionForm;