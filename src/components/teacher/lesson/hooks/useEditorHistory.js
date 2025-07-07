import { useState, useEffect } from 'react'

export function useEditorHistory(content) {
  const [history, setHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)

  const saveToHistory = () => {
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(content)
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      return history[historyIndex - 1]
    }
    return content
  }

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
      return history[historyIndex + 1]
    }
    return content
  }

  // Initialiser l'historique
  useEffect(() => {
    if (history.length === 0) {
      setHistory([content])
      setHistoryIndex(0)
    }
  }, [])

  return {
    history,
    historyIndex,
    saveToHistory,
    undo,
    redo
  }
}