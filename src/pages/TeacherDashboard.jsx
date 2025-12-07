// pages/TeacherDashboard.jsx
import AppLayout from '../layouts/AppLayout'
import PageHeader from '../components/ui/PageHeader'

export default function TeacherDashboard() {
  return (
    <AppLayout>
      <PageHeader 
        title="Tableau de bord" 
        subtitle="Vue d'ensemble de votre activité"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Cartes de statistiques */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Matières actives</h3>
          <p className="text-3xl font-bold text-gray-900">12</p>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Cours publiés</h3>
          <p className="text-3xl font-bold text-gray-900">47</p>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Quiz créés</h3>
          <p className="text-3xl font-bold text-gray-900">23</p>
        </div>
      </div>
    </AppLayout>
  )
}   