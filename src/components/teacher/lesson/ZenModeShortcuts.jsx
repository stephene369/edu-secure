export default function ZenModeShortcuts() {
  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-75 text-white p-4 rounded-lg text-sm">
      <h4 className="font-semibold mb-2">Raccourcis clavier</h4>
      <div className="space-y-1">
        <div><kbd className="bg-gray-600 px-1 rounded">Ctrl+B</kbd> Gras</div>
        <div><kbd className="bg-gray-600 px-1 rounded">Ctrl+I</kbd> Italique</div>
        <div><kbd className="bg-gray-600 px-1 rounded">Ctrl+U</kbd> Souligné</div>
        <div><kbd className="bg-gray-600 px-1 rounded">Ctrl+Z</kbd> Annuler</div>
        <div><kbd className="bg-gray-600 px-1 rounded">Ctrl+Y</kbd> Refaire</div>
        <div><kbd className="bg-gray-600 px-1 rounded">Ctrl+S</kbd> Sauvegarder</div>
        <div><kbd className="bg-gray-600 px-1 rounded">Esc</kbd> Quitter Zen</div>
      </div>
    </div>
  )
}