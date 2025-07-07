// Valider l'URL YouTube
export const validateYouTubeUrl = (url) => {
  if (!url) return true // Optionnel
  
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/
  return youtubeRegex.test(url)
}

// Convertir l'URL YouTube en format embed
export const getYouTubeEmbedUrl = (url) => {
  if (!url) return ''
  
  const videoIdMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/)
  if (videoIdMatch) {
    return `https://www.youtube.com/embed/${videoIdMatch[1]}`
  }
  return url
}

// Extraire l'ID de la vidéo YouTube
export const getYouTubeVideoId = (url) => {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/)
  return match ? match[1] : null
}

// Générer une miniature YouTube
export const getYouTubeThumbnail = (url, quality = 'maxresdefault') => {
  const videoId = getYouTubeVideoId(url)
  if (!videoId) return null
  
  return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`
}