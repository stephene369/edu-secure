import { useState, useEffect, useRef } from 'react'

export const useQuizTimer = ({ duration, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(duration * 60) // Convertir en secondes
  const [isActive, setIsActive] = useState(false)
  const [isTimeUp, setIsTimeUp] = useState(false)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsTimeUp(true)
            setIsActive(false)
            onTimeUp?.()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      clearInterval(intervalRef.current)
    }

    return () => clearInterval(intervalRef.current)
  }, [isActive, timeLeft, onTimeUp])

  const startTimer = () => {
    setIsActive(true)
    setIsTimeUp(false)
  }

  const stopTimer = () => {
    setIsActive(false)
    clearInterval(intervalRef.current)
  }

  const resetTimer = () => {
    setTimeLeft(duration * 60)
    setIsActive(false)
    setIsTimeUp(false)
    clearInterval(intervalRef.current)
  }

  // Formater le temps en MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return {
    timeLeft,
    formattedTime: formatTime(timeLeft),
    isActive,
    isTimeUp,
    startTimer,
    stopTimer,
    resetTimer
  }
}