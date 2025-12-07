// pages/teacher/Dashboard.jsx
import AppLayout from '../../layouts/AppLayout'
import PageHeader from '../../components/ui/PageHeader'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { FaBook, FaGraduationCap, FaQuestionCircle, FaUsers, FaChartBar, FaPlus } from 'react-icons/fa'

const stats = [
  { label: 'Matières actives', value: '12', icon: FaBook, color: 'blue' },
  { label: 'Cours publiés', value: '47', icon: FaGraduationCap, color: 'green' },
  { label: 'Quiz créés', value: '23', icon: FaQuestionCircle, color: 'purple' },
  { label: 'Élèves inscrits', value: '156', icon: FaUsers, color: 'orange' },
]

const quickActions = [
  { label: 'Nouvelle matière', href: '/teacher/add-subject', icon: FaPlus },
  { label: 'Créer un cours', href: '/teacher/add-lesson', icon: FaPlus },
  { label: 'Nouveau quiz', href: '/teacher/create-quiz', icon: FaPlus },
  { label: 'Voir statistiques', href: '/teacher/analytics', icon: FaChartBar },
]

export default function Dashboard() {
  return (
    <AppLayout>
      <PageHeader 
        title="Tableau de bord"
        subtitle="Vue d'ensemble de votre activité pédagogique"
      />

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label}>
              <Card.Body>
                <div className="flex items-center">
                  <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                    <Icon className={`text-${stat.color}-600`} size={24} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Actions rapides */}
        <Card className="lg:col-span-2">
          <Card.Header>
            <h3 className="text-lg font-semibold text-gray-900">Actions rapides</h3>
          </Card.Header>
          <Card.Body>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {quickActions.map((action) => {
                const Icon = action.icon
                return (
                  <Button
                    key={action.label}
                    variant="secondary"
                    className="justify-start h-auto py-4"
                    onClick={() => window.location.href = action.href}
                  >
                    <Icon className="mr-3 text-gray-600" size={20} />
                    <span className="text-left">
                      <div className="font-medium text-gray-900">{action.label}</div>
                    </span>
                  </Button>
                )
              })}
            </div>
          </Card.Body>
        </Card>

        {/* Activité récente */}
        <Card>
          <Card.Header>
            <h3 className="text-lg font-semibold text-gray-900">Activité récente</h3>
          </Card.Header>
          <Card.Body>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FaGraduationCap className="text-green-600" size={16} />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Nouveau cours publié</p>
                  <p className="text-xs text-gray-500">Il y a 2 heures</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FaQuestionCircle className="text-blue-600" size={16} />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Quiz créé</p>
                  <p className="text-xs text-gray-500">Il y a 1 jour</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <FaBook className="text-purple-600" size={16} />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Matière mise à jour</p>
                  <p className="text-xs text-gray-500">Il y a 2 jours</p>
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>
    </AppLayout>
  )
}