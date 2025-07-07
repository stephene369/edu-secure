import { validateYouTubeUrl, getYouTubeEmbedUrl } from '../../../utils/youtube'

export default function LessonPreview({ lessonForm, currentUser }) {
  return (
    <div className="mt-8 border-t pt-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Aperçu du cours
      </h3>
      
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          {/* Titre */}
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {lessonForm.title}
          </h1>
          
          {/* Métadonnées */}
          <div className="flex items-center text-sm text-gray-500 mb-6 pb-4 border-b">
            <span>Par {currentUser?.firstName} {currentUser?.lastName}</span>
            <span className="mx-2">•</span>
            <span>{new Date().toLocaleDateString('fr-FR')}</span>
          </div>
          
          {/* Vidéo YouTube */}
          {lessonForm.videoUrl && validateYouTubeUrl(lessonForm.videoUrl) && (
            <div className="mb-6">
              <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                <iframe
                  src={getYouTubeEmbedUrl(lessonForm.videoUrl)}
                  title="Vidéo du cours"
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}
          
          {/* Contenu HTML */}
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: lessonForm.content }}
          />
        </div>
      </div>
    </div>
  )
}