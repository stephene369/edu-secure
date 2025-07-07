import { 
  FaBold, FaItalic, FaUnderline, FaStrikethrough, FaSubscript, FaSuperscript,
  FaAlignLeft, FaAlignCenter, FaAlignRight, FaAlignJustify,
  FaListUl, FaListOl, FaIndent, FaOutdent,
  FaLink, FaImage, FaTable, FaQuoteLeft, FaCode,
  FaCopy, FaCut, FaPaste, FaEraser, FaSave,
  FaUndo, FaRedo, FaSpinner, FaFont, FaTextHeight, FaPalette, FaHighlighter,
  FaExchangeAlt, // Pour le bouton d'inversion de texte
  FaTextWidth
} from 'react-icons/fa'

const fontOptions = [
  { value: 'Inter', label: 'Inter' },
  { value: 'Arial', label: 'Arial' },
  { value: 'Georgia', label: 'Georgia' },
  { value: 'Times New Roman', label: 'Times New Roman' },
  { value: 'Helvetica', label: 'Helvetica' },
  { value: 'Verdana', label: 'Verdana' },
  { value: 'Courier New', label: 'Courier New' },
  { value: 'Comic Sans MS', label: 'Comic Sans MS' }
]

const colorPalette = [
  '#000000', '#333333', '#666666', '#999999', '#cccccc', '#ffffff',
  '#ff0000', '#ff6600', '#ffcc00', '#00ff00', '#0066ff', '#6600ff',
  '#ff0066', '#ff3366', '#ff6699', '#66ff99', '#6699ff', '#9966ff'
]

export default function EditorToolbar({
  fontSize, setFontSize, fontFamily, setFontFamily,
  textColor, setTextColor, backgroundColor, setBackgroundColor,
  highlightColor, setHighlightColor, lineHeight, setLineHeight,
  uploadingImage, historyIndex, history, undo, redo,
  execCommand, insertHTML, handleImageUpload, insertTable, insertLink,
  fileInputRef
}) {
  return (
    <>
      {/* Toolbar principale */}
      <div className="bg-gray-50 p-3 border-b border-gray-300">
        <div className="flex flex-wrap gap-2">
          {/* Historique */}
          <div className="flex border-r border-gray-300 pr-2 mr-2">
            <button
              type="button"
              onClick={undo}
              disabled={historyIndex <= 0}
              className="p-2 hover:bg-gray-200 rounded disabled:opacity-50"
              title="Annuler"
            >
              <FaUndo size={14} />
            </button>
            <button
              type="button"
              onClick={redo}
              disabled={historyIndex >= history.length - 1}
              className="p-2 hover:bg-gray-200 rounded disabled:opacity-50"
              title="Refaire"
            >
              <FaRedo size={14} />
            </button>
          </div>

          {/* Formatage de base */}
          <div className="flex border-r border-gray-300 pr-2 mr-2">
            <button
              type="button"
              onClick={() => execCommand('bold')}
              className="p-2 hover:bg-gray-200 rounded"
              title="Gras"
            >
              <FaBold size={14} />
            </button>
            <button
              type="button"
              onClick={() => execCommand('italic')}
              className="p-2 hover:bg-gray-200 rounded"
              title="Italique"
            >
              <FaItalic size={14} />
            </button>
            <button
              type="button"
              onClick={() => execCommand('underline')}
              className="p-2 hover:bg-gray-200 rounded"
              title="Souligné"
            >
              <FaUnderline size={14} />
            </button>
            <button
              type="button"
              onClick={() => execCommand('strikeThrough')}
              className="p-2 hover:bg-gray-200 rounded"
              title="Barré"
            >
              <FaStrikethrough size={14} />
            </button>
            <button
              type="button"
              onClick={() => execCommand('subscript')}
              className="p-2 hover:bg-gray-200 rounded"
              title="Indice"
            >
              <FaSubscript size={14} />
            </button>
            <button
              type="button"
              onClick={() => execCommand('superscript')}
              className="p-2 hover:bg-gray-200 rounded"
              title="Exposant"
            >
              <FaSuperscript size={14} />
            </button>
          </div>

          {/* Alignement */}
          <div className="flex border-r border-gray-300 pr-2 mr-2">
            <button
              type="button"
              onClick={() => execCommand('justifyLeft')}
              className="p-2 hover:bg-gray-200 rounded"
              title="Aligner à gauche"
            >
              <FaAlignLeft size={14} />
            </button>
            <button
              type="button"
              onClick={() => execCommand('justifyCenter')}
              className="p-2 hover:bg-gray-200 rounded"
              title="Centrer"
            >
              <FaAlignCenter size={14} />
            </button>
            <button
              type="button"
              onClick={() => execCommand('justifyRight')}
              className="p-2 hover:bg-gray-200 rounded"
              title="Aligner à droite"
            >
              <FaAlignRight size={14} />
            </button>
            <button
              type="button"
              onClick={() => execCommand('justifyFull')}
              className="p-2 hover:bg-gray-200 rounded"
              title="Justifier"
            >
              <FaAlignJustify size={14} />
            </button>
          </div>

          {/* Listes */}
          <div className="flex border-r border-gray-300 pr-2 mr-2">
            <button
              type="button"
              onClick={() => execCommand('insertUnorderedList')}
              className="p-2 hover:bg-gray-200 rounded"
              title="Liste à puces"
            >
              <FaListUl size={14} />
            </button>
            <button
              type="button"
              onClick={() => execCommand('insertOrderedList')}
              className="p-2 hover:bg-gray-200 rounded"
              title="Liste numérotée"
            >
              <FaListOl size={14} />
            </button>
            <button
              type="button"
              onClick={() => execCommand('indent')}
              className="p-2 hover:bg-gray-200 rounded"
              title="Indenter"
            >
              <FaIndent size={14} />
            </button>
            <button
              type="button"
              onClick={() => execCommand('outdent')}
              className="p-2 hover:bg-gray-200 rounded"
              title="Désindenter"
            >
              <FaOutdent size={14} />
            </button>
          </div>

          {/* Insertion */}
          <div className="flex border-r border-gray-300 pr-2 mr-2">
            <button
              type="button"
              onClick={insertLink}
              className="p-2 hover:bg-gray-200 rounded"
              title="Insérer un lien"
            >
              <FaLink size={14} />
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 hover:bg-gray-200 rounded"
              title="Insérer une image"
              disabled={uploadingImage}
            >
              {uploadingImage ? <FaSpinner className="animate-spin" size={14} /> : <FaImage size={14} />}
            </button>
            <button
              type="button"
              onClick={insertTable}
              className="p-2 hover:bg-gray-200 rounded"
              title="Insérer un tableau"
            >
              <FaTable size={14} />
            </button>
            <button
              type="button"
              onClick={() => insertHTML('<blockquote style="border-left: 4px solid #ddd; padding-left: 16px; margin: 16px 0; font-style: italic;">Citation</blockquote>')}
              className="p-2 hover:bg-gray-200 rounded"
              title="Citation"
            >
              <FaQuoteLeft size={14} />
            </button>
            <button
              type="button"
              onClick={() => insertHTML('<code style="background-color: #f4f4f4; padding: 2px 4px; border-radius: 3px; font-family: monospace;">code</code>')}
              className="p-2 hover:bg-gray-200 rounded"
              title="Code inline"
            >
              <FaCode size={14} />
            </button>
          </div>

          {/* Presse-papiers */}
          <div className="flex border-r border-gray-300 pr-2 mr-2">
            <button
              type="button"
              onClick={() => execCommand('copy')}
              className="p-2 hover:bg-gray-200 rounded"
              title="Copier"
            >
              <FaCopy size={14} />
            </button>
            <button
              type="button"
              onClick={() => execCommand('cut')}
              className="p-2 hover:bg-gray-200 rounded"
              title="Couper"
            >
              <FaCut size={14} />
            </button>
            <button
              type="button"
              onClick={() => execCommand('paste')}
              className="p-2 hover:bg-gray-200 rounded"
              title="Coller"
            >
              <FaPaste size={14} />
            </button>
            <button
              type="button"
              onClick={() => execCommand('removeFormat')}
              className="p-2 hover:bg-gray-200 rounded"
              title="Supprimer le formatage"
            >
              <FaEraser size={14} />
            </button>
          </div>

          {/* Sauvegarde */}
          <button
            type="button"
            onClick={() => {
              localStorage.setItem('lesson_draft', JSON.stringify({ content }))
              // Callback pour afficher le message de succès
            }}
            className="p-2 hover:bg-gray-200 rounded"
            title="Sauvegarder le brouillon"
          >
            <FaSave size={14} />
          </button>
        </div>
      </div>

      {/* Toolbar secondaire - Options de style */}
      <div className="bg-gray-50 p-3 border-b border-gray-300">
        <div className="flex flex-wrap gap-4 items-center">
          {/* Police */}
          <div className="flex items-center gap-2">
            <FaFont size={14} />
            <select
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value)}
              className="px-2 py-1 border border-gray-300 rounded text-sm"
            >
              {fontOptions.map(font => (
                <option key={font.value} value={font.value}>
                  {font.label}
                </option>
              ))}
            </select>
          </div>

          {/* Taille de police */}
          <div className="flex items-center gap-2">
            <FaTextHeight size={14} />
            <input
              type="range"
              min="12"
              max="32"
              value={fontSize}
              onChange={(e) => setFontSize(e.target.value)}
              className="w-20"
            />
            <span className="text-sm w-8">{fontSize}px</span>
          </div>

          {/* Hauteur de ligne */}
          <div className="flex items-center gap-2">
            <span className="text-sm">Interligne:</span>
            <input
              type="range"
              min="1"
              max="3"
              step="0.1"
              value={lineHeight}
              onChange={(e) => setLineHeight(e.target.value)}
              className="w-20"
            />
            <span className="text-sm w-8">{lineHeight}</span>
          </div>

          {/* Couleur du texte */}
          <div className="flex items-center gap-2">
            <FaPalette size={14} />
            <input
              type="color"
              value={textColor}
              onChange={(e) => {
                setTextColor(e.target.value)
                execCommand('foreColor', e.target.value)
              }}
              className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
              title="Couleur du texte"
            />
          </div>

          {/* Couleur de surbrillance */}
          <div className="flex items-center gap-2">
            <FaHighlighter size={14} />
            <input
              type="color"
              value={highlightColor}
              onChange={(e) => {
                setHighlightColor(e.target.value)
                execCommand('hiliteColor', e.target.value)
              }}
              className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
              title="Couleur de surbrillance"
            />
          </div>

          {/* Couleur de fond */}
          <div className="flex items-center gap-2">
            <span className="text-sm">Fond:</span>
            <input
              type="color"
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
              className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
              title="Couleur de fond"
            />
          </div>
        </div>

        {/* Palette de couleurs prédéfinies */}
        <div className="mt-3 flex flex-wrap gap-1">
          <span className="text-sm text-gray-600 mr-2">Couleurs rapides:</span>
          {colorPalette.map((color, index) => (
            <button
              key={index}
              type="button"
              onClick={() => execCommand('foreColor', color)}
              className="w-6 h-6 border border-gray-300 rounded cursor-pointer hover:scale-110 transition-transform"
              style={{ backgroundColor: color }}
              title={`Couleur ${color}`}
            />
          ))}
        </div>
      </div>
    </>
  )
}
