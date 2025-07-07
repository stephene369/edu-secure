import { FaBook, FaChevronRight } from 'react-icons/fa'

const gradeOptions = [
  { value: 'cm1', label: 'CM1' },
  { value: 'cm2', label: 'CM2' },
  { value: '6eme', label: '6ème' },
  { value: '5eme', label: '5ème' },
  { value: '4eme', label: '4ème' },
  { value: '3eme', label: '3ème' },
  { value: '2nde', label: '2nde' },
  { value: '1ere', label: '1ère' },
  { value: 'terminale', label: 'Terminale' }
]

export default function NavigationSelector({
  selectedGrade,
  selectedSubject,
  selectedChapter,
  selectedSubchapter,
  subjects,
  chapters,
  subchapters,
  loading,
  onGradeChange,
  onSubjectChange,
  onChapterChange,
  onSubchapterChange
}) {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        1. Sélectionnez la destination
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Classe */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Classe
          </label>
          <select
            value={selectedGrade}
            onChange={(e) => onGradeChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Choisir...</option>
            {gradeOptions.map((grade) => (
              <option key={grade.value} value={grade.value}>
                {grade.label}
              </option>
            ))}
          </select>
        </div>

        {/* Matière */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Matière
          </label>
          <select
            value={selectedSubject}
            onChange={(e) => onSubjectChange(e.target.value)}
            disabled={!selectedGrade || subjects.length === 0}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
          >
            <option value="">Choisir...</option>
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
        </div>

        {/* Chapitre */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chapitre
          </label>
          <select
            value={selectedChapter}
            onChange={(e) => onChapterChange(e.target.value)}
            disabled={!selectedSubject || chapters.length === 0}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
          >
            <option value="">Choisir...</option>
            {chapters.map((chapter) => (
              <option key={chapter.id} value={chapter.id}>
                {chapter.title}
              </option>
            ))}
          </select>
        </div>

        {/* Sous-chapitre */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sous-chapitre
          </label>
          <select
            value={selectedSubchapter}
            onChange={(e) => onSubchapterChange(e.target.value)}
            disabled={!selectedChapter || subchapters.length === 0}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
          >
            <option value="">Choisir...</option>
            {subchapters.map((subchapter) => (
              <option key={subchapter.id} value={subchapter.id}>
                {subchapter.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Fil d'Ariane */}
      {selectedGrade && (
        <div className="mt-4 flex items-center text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
          <FaBook className="mr-2" size={14} />
          <span className="font-medium">
            {gradeOptions.find(g => g.value === selectedGrade)?.label}
          </span>
          {selectedSubject && (
            <>
              <FaChevronRight className="mx-2" size={12} />
              <span>{subjects.find(s => s.id === selectedSubject)?.name}</span>
            </>
          )}
          {selectedChapter && (
            <>
              <FaChevronRight className="mx-2" size={12} />
              <span>{chapters.find(c => c.id === selectedChapter)?.title}</span>
            </>
          )}
          {selectedSubchapter && (
            <>
              <FaChevronRight className="mx-2" size={12} />
              <span className="text-purple-600 font-medium">
                {subchapters.find(sc => sc.id === selectedSubchapter)?.title}
              </span>
            </>
          )}
        </div>
      )}
    </div>
  )
}