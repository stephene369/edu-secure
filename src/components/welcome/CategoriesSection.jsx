import { Link } from 'react-router-dom'

export default function CategoriesSection() {
  const categories = [
    { name: 'Mathématiques', icon: '📐', color: 'bg-blue-100 text-blue-700' },
    { name: 'Français', icon: '📚', color: 'bg-purple-100 text-purple-700' },
    { name: 'Sciences', icon: '🔬', color: 'bg-green-100 text-green-700' },
    { name: 'Langues', icon: '🌍', color: 'bg-yellow-100 text-yellow-700' },
    { name: 'Histoire-Géo', icon: '🗺️', color: 'bg-red-100 text-red-700' },
    { name: 'Philosophie', icon: '💭', color: 'bg-indigo-100 text-indigo-700' },
  ]

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-center text-3xl font-bold text-gray-900 mb-8">
          Explorez par catégorie
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <div 
              key={category.name} 
              className="bg-white rounded-xl hover:shadow-lg transition-shadow cursor-pointer p-4 text-center border border-gray-200"
              onClick={() => window.location.href = '/course-catalog'}
            >
              <div className={`text-4xl mb-2 ${category.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto`}>
                {category.icon}
              </div>
              <h3 className="text-sm font-medium text-gray-900">{category.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}