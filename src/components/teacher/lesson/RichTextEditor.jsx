import { useState, useRef } from 'react'
import EditorToolbar from './EditorToolbar'
import EditorContent from './EditorContent'
import { useEditorHistory } from './hooks/useEditorHistory'
import { useEditorCommands } from './hooks/useEditorCommands'

export default function RichTextEditor({ content, onChange, isZenMode }) {
  const editorRef = useRef(null)
  const fileInputRef = useRef(null)
  
  // États de l'éditeur
  const [fontSize, setFontSize] = useState(16)
  const [fontFamily, setFontFamily] = useState('Inter')
  const [textColor, setTextColor] = useState('#000000')
  const [backgroundColor, setBackgroundColor] = useState('#ffffff')
  const [highlightColor, setHighlightColor] = useState('#ffff00')
  const [lineHeight, setLineHeight] = useState(1.6)
  const [uploadingImage, setUploadingImage] = useState(false)

  // Hooks personnalisés
  const { history, historyIndex, saveToHistory, undo, redo } = useEditorHistory(content)
  const { execCommand, insertHTML, handleImageUpload, insertTable, insertLink } = useEditorCommands({
    editorRef,
    saveToHistory,
    setUploadingImage
  })

  const editorProps = {
    fontSize,
    setFontSize,
    fontFamily,
    setFontFamily,
    textColor,
    setTextColor,
    backgroundColor,
    setBackgroundColor,
    highlightColor,
    setHighlightColor,
    lineHeight,
    setLineHeight,
    uploadingImage,
    historyIndex,
    history,
    undo,
    redo,
    execCommand,
    insertHTML,
    handleImageUpload,
    insertTable,
    insertLink,
    fileInputRef
  }

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      <EditorToolbar {...editorProps} />
      
      <EditorContent
        ref={editorRef}
        content={content}
        onChange={onChange}
        isZenMode={isZenMode}
        fontSize={fontSize}
        fontFamily={fontFamily}
        lineHeight={lineHeight}
        backgroundColor={backgroundColor}
        textColor={textColor}
        saveToHistory={saveToHistory}
      />

      {/* Input caché pour les images */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) {
            handleImageUpload(file)
          }
        }}
        className="hidden"
      />
    </div>
  )
}