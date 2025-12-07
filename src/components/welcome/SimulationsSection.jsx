import { FaClock, FaUsers, FaArrowRight } from 'react-icons/fa'
import { Link } from 'react-router-dom'

export default function SimulationsSection() {
  const featuredSimulations = [
    {
      id: 1,
      title: 'Simulation Gestion de Projet Agile',
      company: 'Tech Solutions SARL',
      sector: 'Management',
      duration: '2 semaines',
      participants: 45,
      thumbnail: '/api/placeholder/400/300'
    },
    {
      id: 2,
      title: 'Analyse de Données Marketing',
      company: 'Data Analytics Bénin',
      sector: 'Data Science',
      duration: '3 semaines',
      participants: 32,
      thumbnail: '/api/placeholder/400/300'
    },
    {
      id: 3,
      title: 'Développement Web Fullstack',
      company: 'WebTech Africa',
      sector: 'Développement',
      duration: '4 semaines',
      participants: 67,
      thumbnail: '/api/placeholder/400/300'
    }
  ]

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="bg-blue-600 text-white text-sm px-3 py-1 rounded-full font-medium mb-4 inline-block">
            Nouveau
          </span>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Simulations Métier Professionnelles
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Mettez en pratique vos compétences avec des projets réels créés par des entreprises. 
            Boostez votre employabilité.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {featuredSimulations.map((sim) => (
            <div 
              key={sim.id}
              className="bg-white rounded-xl overflow-hidden hover:shadow-xl transition-shadow cursor-pointer border border-gray-200"
              onClick={() => window.location.href = `/simulation-detail/${sim.id}`}
            >
              <div className="relative aspect-video overflow-hidden bg-gray-100">
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  Simulation
                </div>
                <div className="absolute top-2 left-2">
                  <span className="bg-black/70 text-white text-sm px-2 py-1 rounded-full">
                    {sim.sector}
                  </span>
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium">C</span>
                  </div>
                  <span className="text-sm text-gray-600">{sim.company}</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2">
                  {sim.title}
                </h3>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <FaClock size={14} />
                    <span>{sim.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaUsers size={14} />
                    <span>{sim.participants} participants</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            to="/simulation-hub"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors inline-flex items-center space-x-2"
          >
            <span>Découvrir toutes les simulations</span>
            <FaArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  )
}