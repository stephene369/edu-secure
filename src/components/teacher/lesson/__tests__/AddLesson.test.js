import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import AddLesson from '../AddLesson'
import { AuthProvider } from '../../../../contexts/AuthContext'

// Mock Firebase
jest.mock('../../../../firebase/config', () => ({
  db: {},
  storage: {}
}))

const MockedAddLesson = () => (
  <BrowserRouter>
    <AuthProvider>
      <AddLesson />
    </AuthProvider>
  </BrowserRouter>
)

describe('AddLesson Component', () => {
  test('renders lesson editor', () => {
    render(<MockedAddLesson />)
    expect(screen.getByText('Éditeur de cours avancé')).toBeInTheDocument()
  })

  test('shows navigation selector', () => {
    render(<MockedAddLesson />)
    expect(screen.getByText('1. Sélectionnez la destination')).toBeInTheDocument()
  })

  test('toggles zen mode', () => {
    render(<MockedAddLesson />)
    const zenButton = screen.getByText('Mode Zen')
    fireEvent.click(zenButton)
    expect(screen.getByText('Quitter Zen')).toBeInTheDocument()
  })

  test('validates required fields', async () => {
    render(<MockedAddLesson />)
    const submitButton = screen.getByText('Publier le cours')
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Le titre du cours est obligatoire')).toBeInTheDocument()
    })
  })
})