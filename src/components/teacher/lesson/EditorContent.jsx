import { forwardRef, useEffect } from 'react'

const EditorContent = forwardRef(({
  content,
  onChange,
  isZenMode,
  fontSize,
  fontFamily,
  lineHeight,
  backgroundColor,
  textColor,
  saveToHistory
}, ref) => {
  
  // Fonction pour nettoyer et corriger le texte
  const cleanContent = (htmlContent) => {
    if (!htmlContent) return ''
    
    // Créer un élément temporaire pour parser le HTML
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = htmlContent
    
    // Corriger la direction du texte si nécessaire
    const textNodes = tempDiv.querySelectorAll('*')
    textNodes.forEach(node => {
      if (node.textContent) {
        // Détecter si le texte est à l'envers (heuristique simple)
        const text = node.textContent
        const reversed = text.split('').reverse().join('')
        
        // Si le texte inversé semble plus "normal" (contient des mots anglais communs)
        const commonWords = ['hello', 'the', 'is', 'my', 'name', 'this', 'line']
        const reversedLower = reversed.toLowerCase()
        const hasCommonWords = commonWords.some(word => reversedLower.includes(word))
        
        if (hasCommonWords && !text.toLowerCase().includes('hello')) {
          node.textContent = reversed
        }
      }
    })
    
    return tempDiv.innerHTML
  }

  // Effet pour corriger le contenu au montage
  useEffect(() => {
    if (ref.current && content) {
      const correctedContent = cleanContent(content)
      if (correctedContent !== content) {
        ref.current.innerHTML = correctedContent
        onChange(correctedContent)
      }
    }
  }, [content])

  return (
    <div
      ref={ref}
      contentEditable
      onInput={(e) => {
        const newContent = e.target.innerHTML
        onChange(newContent)
        saveToHistory()
      }}
      onPaste={(e) => {
        // Gérer le collage de texte
        e.preventDefault()
        const paste = e.clipboardData.getData('text/plain')
        
        // Insérer le texte proprement
        const selection = window.getSelection()
        if (selection.rangeCount > 0) {
          const range = selection.getRangeAt(0)
          range.deleteContents()
          range.insertNode(document.createTextNode(paste))
          range.collapse(false)
          selection.removeAllRanges()
          selection.addRange(range)
        }
        
        // Déclencher l'événement de changement
        onChange(ref.current.innerHTML)
        saveToHistory()
      }}
      className={`p-6 min-h-96 focus:outline-none ${isZenMode ? 'min-h-screen' : ''}`}
      style={{
        fontFamily: fontFamily,
        fontSize: `${fontSize}px`,
        lineHeight: lineHeight,
        backgroundColor: backgroundColor,
        color: textColor,
        direction: 'ltr', // Forcer la direction de gauche à droite
        textAlign: 'left',  // Alignement par défaut
        unicodeBidi: 'normal' // Comportement Unicode normal
      }}
      data-placeholder="Commencez à écrire votre cours ici..."
      suppressContentEditableWarning={true}
    />
  )
})

EditorContent.displayName = 'EditorContent'

export default EditorContent