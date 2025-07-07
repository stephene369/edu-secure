// Fonction pour détecter si un texte est probablement à l'envers
export const isTextReversed = (text) => {
  const commonEnglishWords = [
    'hello', 'the', 'is', 'my', 'name', 'this', 'line', 'and', 'or', 'but',
    'with', 'have', 'from', 'they', 'know', 'want', 'been', 'good', 'much',
    'some', 'time', 'very', 'when', 'come', 'here', 'just', 'like', 'long',
    'make', 'many', 'over', 'such', 'take', 'than', 'them', 'well', 'were'
  ]
  
  const lowerText = text.toLowerCase()
  const reversedText = text.split('').reverse().join('').toLowerCase()
  
  let originalScore = 0
  let reversedScore = 0
  
  commonEnglishWords.forEach(word => {
    if (lowerText.includes(word)) originalScore++
    if (reversedText.includes(word)) reversedScore++
  })
  
  return reversedScore > originalScore
}

// Fonction pour corriger automatiquement le texte inversé
export const autoCorrectReversedText = (text) => {
  if (isTextReversed(text)) {
    return text.split('').reverse().join('')
  }
  return text
}

// Fonction pour corriger le HTML avec du texte inversé
export const correctReversedHTML = (htmlContent) => {
  if (!htmlContent) return ''
  
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = htmlContent
  
  // Parcourir tous les nœuds de texte
  const walker = document.createTreeWalker(
    tempDiv,
    NodeFilter.SHOW_TEXT,
    null,
    false
  )
  
  let node
  while (node = walker.nextNode()) {
    if (node.textContent.trim()) {
      const correctedText = autoCorrectReversedText(node.textContent)
      if (correctedText !== node.textContent) {
        node.textContent = correctedText
      }
    }
  }
  
  return tempDiv.innerHTML
}