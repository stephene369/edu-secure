import { FaYoutube } from 'react-icons/fa'
import RichTextEditor from './RichTextEditor'
import FormActions from './FormActions'

export default function LessonForm({
  lessonForm,
  setLessonForm,
  isZenMode,
  showPreview,
  setShowPreview,
  adding,
  onSubmit,
  currentUser
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {!isZenMode && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          2. Créez votre cours
        </h3>
      )}

      {/* Titre du cours */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          Titre du cours *
        </label>
        <input
          type="text"
          id="title"
          value={lessonForm.title}
          onChange={(e) => setLessonForm(prev => ({ ...prev, title: e.target.value }))}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          placeholder="Ex: Introduction à la proportionnalité"
          required
        />
      </div>

      {/* Éditeur de texte riche */}
      <RichTextEditor
        content={lessonForm.content}
        onChange={(content) => setLessonForm(prev => ({ ...prev, content }))}
        isZenMode={isZenMode}
      />

      {/* URL Vidéo YouTube */}
      {!isZenMode && (
        <div>
          <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center">
              <FaYoutube className="mr-2 text-red-600" size={16} />
              Lien vidéo YouTube (optionnel)
            </div>
          </label>
          <input
            type="url"
            id="videoUrl"
            value={lessonForm.videoUrl}
            onChange={(e) => setLessonForm(prev => ({ ...prev, videoUrl: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            placeholder="https://www.youtube.com/watch?v=..."
          />
        </div>
      )}

      {/* Boutons d'action */}
      <FormActions
        isZenMode={isZenMode}
        showPreview={showPreview}
        setShowPreview={setShowPreview}
        adding={adding}
        lessonForm={lessonForm}
        setLessonForm={setLessonForm}
      />
    </form>
  )
}