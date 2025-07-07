import { useState } from 'react';

const QuizSelector = ({ onSelectionChange }) => {
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('');

  const handleSelectionChange = (type, value) => {
    const updates = { [type]: value };
    
    if (type === 'class') {
      setSelectedClass(value);
      setSelectedSubject('');
      setSelectedChapter('');
      updates.subject = '';
      updates.chapter = '';
    } else if (type === 'subject') {
      setSelectedSubject(value);
      setSelectedChapter('');
      updates.chapter = '';
    } else if (type === 'chapter') {
      setSelectedChapter(value);
    }

    onSelectionChange({
      class: type === 'class' ? value : selectedClass,
      subject: type === 'subject' ? value : selectedSubject,
      chapter: type === 'chapter' ? value : selectedChapter,
      ...updates
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Classe
        </label>
        <select
          value={selectedClass}
          onChange={(e) => handleSelectionChange('class', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Sélectionner une classe</option>
          <option value="6eme">6ème</option>
          <option value="5eme">5ème</option>
          <option value="4eme">4ème</option>
          <option value="3eme">3ème</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Matière
        </label>
        <select
          value={selectedSubject}
          onChange={(e) => handleSelectionChange('subject', e.target.value)}
          disabled={!selectedClass}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
        >
          <option value="">Sélectionner une matière</option>
          <option value="francais">Français</option>
          <option value="mathematiques">Mathématiques</option>
          <option value="histoire">Histoire</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Chapitre
        </label>
        <select
          value={selectedChapter}
          onChange={(e) => handleSelectionChange('chapter', e.target.value)}
          disabled={!selectedSubject}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
        >
          <option value="">Sélectionner un chapitre</option>
          <option value="chapitre1">Chapitre 1</option>
          <option value="chapitre2">Chapitre 2</option>
        </select>
      </div>
    </div>
  );
};

export default QuizSelector;