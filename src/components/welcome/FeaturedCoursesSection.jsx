import { FaStar, FaArrowRight, FaShoppingCart, FaInfoCircle, FaUser } from 'react-icons/fa'
import { Link } from 'react-router-dom'

export default function FeaturedCoursesSection({ onCourseAction, onCourseSelect }) {
  const featuredCourses = [
    {
      id: 1,
      title: 'Biologie Cellulaire Avancée',
      instructor: 'Dr. BALOICHA Isidore',
      category: 'Sciences',
      grade: 'Terminale S',
      price: 3500,
      rating: 4.9,
      students: 287,
      thumbnail: '/api/placeholder/400/300',
      description: 'Masterclass complète sur la biologie cellulaire avec expériences virtuelles.'
    },
    {
      id: 2,
      title: 'Algèbre Linéaire et Matrices',
      instructor: 'Prof. BALOGOUN Marie',
      category: 'Mathématiques',
      grade: 'Classes Préparatoires',
      price: 3200,
      rating: 4.8,
      students: 194,
      thumbnail: '/api/placeholder/400/300',
      description: 'Cours approfondi sur les espaces vectoriels et calcul matriciel.'
    },
    {
      id: 3,
      title: 'Géopolitique Africaine',
      instructor: 'Prof. AKPOVI Jean-Claude',
      category: 'Histoire-Géo',
      grade: 'Terminale',
      price: 2800,
      rating: 4.7,
      students: 156,
      thumbnail: '/api/placeholder/400/300',
      description: 'Analyse des enjeux géopolitiques modernes en Afrique.'
    },
    {
      id: 4,
      title: 'Mécanique Quantique',
      instructor: 'Prof. KOUDJO Mathias',
      category: 'Physique',
      grade: 'Université',
      price: 3800,
      rating: 4.9,
      students: 89,
      thumbnail: '/api/placeholder/400/300',
      description: 'Introduction rigoureuse aux principes de la mécanique quantique.'
    }
  ]

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Cours les plus populaires</h2>
            <p className="text-gray-600">Rejoignez des milliers d'élèves qui réussissent</p>
          </div>
          <Link
            to="/course-catalog"
            className="bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-xl font-medium transition-colors flex items-center space-x-2"
          >
            <span>Voir tout</span>
            <FaArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredCourses.map((course) => (
            <div 
              key={course.id} 
              className="bg-white rounded-xl overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group border border-gray-200"
              onClick={() => onCourseSelect(course)}
            >
              <div className="relative aspect-video overflow-hidden bg-gray-100">
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  Aperçu du cours
                </div>
                <div className="absolute top-2 right-2">
                  <span className="bg-white text-gray-900 text-sm px-2 py-1 rounded-full font-medium">
                    {course.grade}
                  </span>
                </div>
              </div>
              
              <div className="p-4">
                <span className="bg-gray-100 text-gray-700 text-sm px-2 py-1 rounded-full mb-2 inline-block">
                  {course.category}
                </span>
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {course.title}
                </h3>
                <p className="text-sm text-gray-600 mb-3">{course.instructor}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <FaStar className="text-yellow-400" size={16} />
                    <span className="text-sm font-medium">{course.rating}</span>
                    <span className="text-sm text-gray-500">({course.students})</span>
                  </div>
                  <div className="text-lg font-bold text-blue-600">
                    {course.price === 0 ? 'Gratuit' : `${course.price.toLocaleString()} FCFA`}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}