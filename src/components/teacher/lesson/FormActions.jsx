import { FaEye, FaPlus, FaSpinner } from 'react-icons/fa'

export default function FormActions({
  isZenMode,
  showPreview,
  setShowPreview,
  adding,
  lessonForm,
  setLessonForm
}) {
  const loadDraft = () => {
    const draft = localStorage.getItem('lesson_draft')
    if (draft) {
      const parsedDraft = JSON.parse(draft)
      setLessonForm(parsedDraft)
      // Callback pour afficher le message de succès
    }
  }

  return (
    <div className="flex space-x-4 pt-4">
      {!isZenMode && (
        <button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          className="flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <FaEye className="mr-2" size={16} />
          {showPreview ? 'Masquer l\'aperçu' : 'Aperçu'}
        </button>
      )}
      
      <button
        type="button"
        onClick={loadDraft}
        className="flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
      >
        Charger brouillon
      </button>
      
      <button
        type="submit"
        disabled={adding || !lessonForm.title.trim() || !lessonForm.content.trim()}
        className="flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {adding ? (
          <>
            <FaSpinner className="animate-spin mr-2" size={16} />
            Publication...
          </>
        ) : (
          <>
            <FaPlus className="mr-2" size={16} />
            Publier le cours
          </>
        )}
      </button>
    </div>
  )
}