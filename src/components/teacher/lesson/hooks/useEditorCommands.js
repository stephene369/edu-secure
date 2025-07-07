import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from '../../../../firebase/config'

export function useEditorCommands({ editorRef, saveToHistory, setUploadingImage }) {
  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value)
    saveToHistory()
  }

  const insertText = (text) => {
    const editor = editorRef.current
    if (editor) {
      const selection = window.getSelection()
      const range = selection.getRangeAt(0)
      range.deleteContents()
      range.insertNode(document.createTextNode(text))
      range.collapse(false)
      selection.removeAllRanges()
      selection.addRange(range)
      saveToHistory()
    }
  }

  const insertHTML = (html) => {
    const editor = editorRef.current
    if (editor) {
      const selection = window.getSelection()
      const range = selection.getRangeAt(0)
      range.deleteContents()
      const div = document.createElement('div')
      div.innerHTML = html
      const fragment = document.createDocumentFragment()
      while (div.firstChild) {
        fragment.appendChild(div.firstChild)
      }
      range.insertNode(fragment)
      range.collapse(false)
      selection.removeAllRanges()
      selection.addRange(range)
      saveToHistory()
    }
  }

  const handleImageUpload = async (file) => {
    if (!file) return

    try {
      setUploadingImage(true)
      const imageRef = ref(storage, `lessons/${Date.now()}_${file.name}`)
      const snapshot = await uploadBytes(imageRef, file)
      const downloadURL = await getDownloadURL(snapshot.ref)

      insertHTML(`<img src="${downloadURL}" alt="Image du cours" style="max-width: 100%; height: auto; margin: 10px 0;" />`)

    } catch (err) {
      console.error('Erreur lors de l\'upload:', err)
      throw new Error('Erreur lors de l\'upload de l\'image')
    } finally {
      setUploadingImage(false)
    }
  }

  const insertTable = () => {
    const rows = prompt('Nombre de lignes:', '3')
    const cols = prompt('Nombre de colonnes:', '3')

    if (rows && cols) {
      let tableHTML = '<table style="border-collapse: collapse; width: 100%; margin: 10px 0;">'

      for (let i = 0; i < parseInt(rows); i++) {
        tableHTML += '<tr>'
        for (let j = 0; j < parseInt(cols); j++) {
          tableHTML += '<td style="border: 1px solid #ddd; padding: 8px;">Cellule</td>'
        }
        tableHTML += '</tr>'
      }

      tableHTML += '</table>'
      insertHTML(tableHTML)
    }
  }

  const insertLink = () => {
    const url = prompt('URL du lien:')
    const text = prompt('Texte du lien:')

    if (url && text) {
      insertHTML(`<a href="${url}" target="_blank" style="color: #0066cc; text-decoration: underline;">${text}</a>`)
    }
  }

  return {
    execCommand,
    insertText,
    insertHTML,
    handleImageUpload,
    insertTable,
    insertLink
  }
}