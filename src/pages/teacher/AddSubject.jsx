// pages/teacher/AddSubject.jsx
import { useState } from 'react'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../../firebase/config'
import { useAuth } from '../../contexts/AuthContext'
import AppLayout from '../../layouts/AppLayout'
import PageHeader from '../../components/ui/PageHeader'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Selectt'
import Textarea from '../../components/ui/Textarea'
import Toast from '../../components/ui/Toast'

const gradeOptions = [
  { value: 'cm1', label: 'CM1' },
  { value: 'cm2', label: 'CM2' },
  { value: '6eme', label: '6ème' },
  { value: '5eme', label: '5ème' },
  { value: '4eme', label: '4ème' },
  { value: '3eme', label: '3ème' },
  { value: '2nde', label: '2nde' },
  { value: '1ere', label: '1ère' },
  { value: 'terminale', label: 'Terminale' }
]

export default function AddSubject() {
  const { currentUser } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    grade: '',
    description: ''
  })
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name.trim() || !formData.grade) {
      setToast({ message: 'Veuillez remplir tous les champs obligatoires', type: 'error' })
      return
    }

    try {
      setLoading(true)
      const subjectsRef = collection(db, 'classes', formData.grade, 'subjects')
      
      await addDoc(subjectsRef, {
        name: formData.name.trim(),
        description: formData.description.trim(),
        createdBy: currentUser.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
      
      setToast({ message: 'Matière ajoutée avec succès', type: 'success' })
      setFormData({ name: '', grade: '', description: '' })
      
    } catch (err) {
      console.error('Erreur:', err)
      setToast({ message: 'Erreur lors de l\'ajout de la matière', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <AppLayout>
      <PageHeader 
        title="Ajouter une matière"
        subtitle="Créez une nouvelle matière pour vos élèves"
      />

      <Card className="w-full max-w-none">
        <Card.Body className="w-full p-6">
          <form onSubmit={handleSubmit} className="w-full space-y-6">
            <Select
              label="Classe *"
              value={formData.grade}
              onChange={(e) => setFormData(prev => ({ ...prev, grade: e.target.value }))}
              options={[{ value: '', label: 'Sélectionnez une classe' }, ...gradeOptions]}
              className="w-full"
            />

            <Input
              label="Nom de la matière *"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Ex: Mathématiques, Français, Sciences..."
              className="w-full"
            />

            <Textarea
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Décrivez brièvement cette matière..."
              rows={3}
              className="w-full"
            />

            <div className="flex gap-3 pt-4">
              <Button 
                type="submit" 
                loading={loading}
                disabled={!formData.name.trim() || !formData.grade}
                className="flex-1"
              >
                Ajouter la matière
              </Button>
              <Button 
                type="button" 
                variant="secondary"
                onClick={() => setFormData({ name: '', grade: '', description: '' })}
                className="flex-1"
              >
                Réinitialiser
              </Button>
            </div>
          </form>
        </Card.Body>
      </Card>

      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </AppLayout>
  )
}