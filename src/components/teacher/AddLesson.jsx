import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'

import { 
  FaGraduationCap, 
  FaExpand, 
  FaCompress, 
  FaMarkdown, 
  FaEdit,
  FaEye,
  FaSave,
  FaUpload,
  FaPlus,
  FaSpinner,
  FaTimes,
  FaYoutube
} from 'react-icons/fa'
import ReactMarkdown from 'react-markdown'
import NavigationSelector from './lesson/NavigationSelector'
import LessonForm from './lesson/LessonForm'
import LessonPreview from './lesson/LessonPreview'
import StatusMessages from './lesson/StatusMessages'
import ZenModeShortcuts from './lesson/ZenModeShortcuts'
import { useLessonData } from './lesson/hooks/useLessonData'
import { useLessonForm } from './lesson/hooks/useLessonForm'

export default function AddLesson() {
  const { currentUser } = useAuth()
  const [isZenMode, setIsZenMode] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [editorMode, setEditorMode] = useState('markdown') // 'markdown' ou 'rich'

  // Hooks personnalisés pour la logique métier
  const {
    selectedGrade,
    selectedSubject,
    selectedChapter,
    selectedSubchapter,
    subjects,
    chapters,
    subchapters,
    loading,
    handleGradeChange,
    handleSubjectChange,
    handleChapterChange,
    setSelectedSubchapter
  } = useLessonData()

  const {
    lessonForm,
    error,
    success,
    adding,
    setError,
    setSuccess,
    handleAddLesson,
    setLessonForm
  } = useLessonForm({
    selectedGrade,
    selectedSubject,
    selectedChapter,
    selectedSubchapter,
    currentUser
  })

  return (
    <div className={`${isZenMode ? 'fixed inset-0 z-50 bg-white' : 'max-w-6xl mx-auto p-6'}`}>
      <div className="bg-white rounded-lg shadow-lg h-full overflow-auto">
        {/* Header */}








        <div className="bg-purple-600 text-white p-6 rounded-t-lg">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <FaGraduationCap className="mr-3" size={24} />
              <div>
                <h2 className="text-2xl font-bold">Éditeur de cours avancé</h2>
                <p className="text-purple-100 mt-1">
                  Créez un cours avec l'éditeur {editorMode === 'markdown' ? 'Markdown' : 'Riche'} 
                  {isZenMode && ' - Mode Zen'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Sélecteur de mode d'édition */}
              <div className="flex bg-purple-700 rounded-lg p-1">
                <button
                  onClick={() => setEditorMode('markdown')}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    editorMode === 'markdown'
                      ? 'bg-white text-purple-600'
                      : 'text-purple-100 hover:text-white'
                  }`}
                >
                  <FaMarkdown className="mr-2" size={16} />
                  Markdown
                </button>
                <button
                  onClick={() => setEditorMode('rich')}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    editorMode === 'rich'
                      ? 'bg-white text-purple-600'
                      : 'text-purple-100 hover:text-white'
                  }`}
                >
                  <FaEdit className="mr-2" size={16} />
                  Riche
                </button>
              </div>

              {/* Bouton Mode Zen */}
              <button
                onClick={() => setIsZenMode(!isZenMode)}
                className="flex items-center bg-purple-700 hover:bg-purple-800 px-4 py-2 rounded-lg transition-colors"
              >
                {isZenMode ? <FaCompress className="mr-2" /> : <FaExpand className="mr-2" />}
                {isZenMode ? 'Quitter Zen' : 'Mode Zen'}
              </button>
            </div>
          </div>








        </div>

        <div className="p-6">
          {/* Messages d'état */}
          <StatusMessages error={error} success={success} />

          {/* Navigation hiérarchique - Masquée en mode Zen */}
          {!isZenMode && (
            <NavigationSelector
              selectedGrade={selectedGrade}
              selectedSubject={selectedSubject}
              selectedChapter={selectedChapter}
              selectedSubchapter={selectedSubchapter}
              subjects={subjects}
              chapters={chapters}
              subchapters={subchapters}
              loading={loading}
              onGradeChange={handleGradeChange}
              onSubjectChange={handleSubjectChange}
              onChapterChange={handleChapterChange}
              onSubchapterChange={setSelectedSubchapter}
            />
          )}

          {/* Formulaire de cours */}
          {(selectedSubchapter || isZenMode) && (











            <div className="space-y-6">
              {!isZenMode && (
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  2. Créez votre cours
                </h3>
              )}








              <form onSubmit={handleAddLesson} className="space-y-6">
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











                {/* Éditeur de contenu - Mode Markdown */}
                {editorMode === 'markdown' && (
                  <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                      <div className="flex items-center">
                        <FaMarkdown className="mr-2" size={16} />
                        Contenu du cours (Markdown) *
                      </div>
                    </label>
                    
                    <div className={`grid ${showPreview ? 'grid-cols-2 gap-4' : 'grid-cols-1'}`}>
                      {/* Zone d'édition Markdown */}
                      <div>
                        <textarea
                          id="content"
                          value={lessonForm.content}
                          onChange={(e) => setLessonForm(prev => ({ ...prev, content: e.target.value }))}
                          rows={isZenMode ? 30 : 15}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-mono text-sm"
                          placeholder="## Introduction

La proportionnalité est une notion fondamentale en mathématiques...

### Définition
Deux grandeurs sont proportionnelles si...

### Exemples
- Exemple 1: ...
- Exemple 2: ...

### Formule"
                          required
                        />
                        <p className="mt-2 text-sm text-gray-500">
                          Utilisez la syntaxe Markdown pour formater votre contenu
                        </p>
                      </div>


                      {/* Aperçu Markdown en temps réel */}
                      {showPreview && (


                        <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                          <h4 className="text-sm font-medium text-gray-700 mb-3">Aperçu en temps réel</h4>
                          <div className="prose prose-sm max-w-none bg-white p-4 rounded border">
                            <ReactMarkdown
                              components={{
                                h1: ({children}) => <h1 className="text-xl font-bold text-gray-900 mt-6 mb-3">{children}</h1>,
                                h2: ({children}) => <h2 className="text-lg font-bold text-gray-900 mt-5 mb-2">{children}</h2>,
                                h3: ({children}) => <h3 className="text-base font-semibold text-gray-900 mt-4 mb-2">{children}</h3>,
                                p: ({children}) => <p className="text-gray-700 mb-3 leading-relaxed">{children}</p>,
                                ul: ({children}) => <ul className="list-disc list-inside mb-3 text-gray-700">{children}</ul>,
                                ol: ({children}) => <ol className="list-decimal list-inside mb-3 text-gray-700">{children}</ol>,
                                li: ({children}) => <li className="mb-1">{children}</li>,
                                blockquote: ({children}) => <blockquote className="border-l-4 border-purple-500 pl-4 italic text-gray-600 mb-3">{children}</blockquote>,
                                code: ({children}) => <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">{children}</code>,
                                pre: ({children}) => <pre className="bg-gray-900 text-gray-100 p-3 rounded-lg overflow-x-auto mb-3">{children}</pre>,
                                a: ({children, href}) => <a href={href} className="text-purple-600 hover:text-purple-800 underline" target="_blank" rel="noopener noreferrer">{children}</a>,
                                strong: ({children}) => <strong className="font-bold text-gray-900">{children}</strong>,
                                em: ({children}) => <em className="italic">{children}</em>
                              }}
                            >
                              {lessonForm.content || '*Commencez à écrire pour voir l\'aperçu...*'}
                            </ReactMarkdown>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Éditeur de contenu - Mode Riche */}
                {editorMode === 'rich' && (
                  <LessonForm
                    lessonForm={lessonForm}
                    setLessonForm={setLessonForm}
                    isZenMode={isZenMode}
                    showPreview={false} // Géré séparément
                    setShowPreview={() => {}} // Pas utilisé en mode riche
                    adding={adding}
                    onSubmit={() => {}} // Géré par le form parent
                    currentUser={currentUser}
                  />
                )}

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
                <div className="flex space-x-4 pt-4">
                  {/* Bouton Aperçu (seulement en mode Markdown) */}
                  {editorMode === 'markdown' && !isZenMode && (
                    <button
                      type="button"
                      onClick={() => setShowPreview(!showPreview)}
                      className="flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <FaEye className="mr-2" size={16} />
                      {showPreview ? 'Masquer l\'aperçu' : 'Aperçu côte à côte'}
                    </button>
                  )}
                  
                  {/* Bouton Sauvegarder brouillon */}
                  <button
                    type="button"
                    onClick={() => {
                      localStorage.setItem('lesson_draft', JSON.stringify({
                        ...lessonForm,
                        editorMode,
                        timestamp: new Date().toISOString()
                      }))
                      setSuccess('Brouillon sauvegardé !')
                    }}
                    className="flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <FaSave className="mr-2" size={16} />
                    Sauvegarder brouillon
                  </button>
                  
                  {/* Bouton Charger brouillon */}
                  <button
                    type="button"
                    onClick={() => {
                      const draft = localStorage.getItem('lesson_draft')
                      if (draft) {
                        const parsedDraft = JSON.parse(draft)
                        setLessonForm({
                          title: parsedDraft.title || '',
                          content: parsedDraft.content || '',
                          videoUrl: parsedDraft.videoUrl || ''
                        })
                        if (parsedDraft.editorMode) {
                          setEditorMode(parsedDraft.editorMode)
                        }

                        setSuccess(`Brouillon chargé ! (Sauvegardé le ${new Date(parsedDraft.timestamp).toLocaleString('fr-FR')})`)
                      } else {
                        setError('Aucun brouillon trouvé')
                      }
                    }}
                    className="flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >

                    <FaUpload className="mr-2" size={16} />
                    Charger brouillon
                  </button>

                  {/* Bouton Publier */}
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
























              </form>
            </div>
          )}



        </div>
      </div>
    </div>
  )
}