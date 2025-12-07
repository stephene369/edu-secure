import { 
  FaFlask, FaCalculator, FaGlobe, FaAtom, 
  FaStar, FaPlayCircle, FaClock, FaBook, 
  FaGraduationCap, FaUser, FaShoppingCart, 
  FaInfoCircle 
} from 'react-icons/fa'

export default function CoursesSection({ onCourseAction, onCourseSelect }) {
  const featuredCourses = [
    {
      id: 1,
      subject: 'Sciences de la Vie et de la Terre',
      title: 'Biologie Cellulaire Avancée',
      professor: 'Dr. BALOICHA Isidore',
      school: 'CEG AGBOKOU',
      location: 'Porto-Novo',
      price: 3500,
      duration: '4h20',
      level: 'Terminale S',
      rating: 4.9,
      students: 287,
      lessons: 15,
      icon: FaFlask,
      color: 'from-green-500 to-emerald-600',
      badge: 'Populaire',
      description: 'Masterclass complète sur la biologie cellulaire avec expériences virtuelles et analyses microscopiques. Parfait pour la préparation aux examens nationaux.',
      objectives: [
        'Comprendre les structures cellulaires',
        'Maîtriser les processus biologiques',
        'Préparation aux épreuves pratiques'
      ]
    },
    {
      id: 2,
      subject: 'Mathématiques',
      title: 'Algèbre Linéaire et Matrices',
      professor: 'Prof. BALOGOUN Marie',
      school: 'Lycée des Jeunes Filles',
      location: 'Natitingou',
      price: 3200,
      duration: '5h15',
      level: 'Classes Préparatoires',
      rating: 4.8,
      students: 194,
      lessons: 18,
      icon: FaCalculator,
      color: 'from-blue-500 to-cyan-600',
      badge: 'Nouveau',
      description: 'Cours approfondi sur les espaces vectoriels, applications linéaires et calcul matriciel. Méthodologie rigoureuse adaptée au supérieur.',
      objectives: [
        'Résolution de systèmes linéaires',
        'Diagonalisation des matrices',
        'Applications géométriques'
      ]
    },
    {
      id: 3,
      subject: 'Histoire-Géographie',
      title: 'Géopolitique Africaine Contemporaine',
      professor: 'Prof. AKPOVI Jean-Claude',
      school: 'Lycée Mathieu Bouké',
      location: 'Parakou',
      price: 2800,
      duration: '3h45',
      level: 'Terminale',
      rating: 4.7,
      students: 156,
      lessons: 12,
      icon: FaGlobe,
      color: 'from-amber-500 to-orange-600',
      description: 'Analyse des enjeux géopolitiques modernes en Afrique avec études de cas et cartographies interactives.',
      objectives: [
        'Comprendre les relations internationales',
        'Analyser les conflits régionaux',
        'Maîtriser la cartographie'
      ]
    },
    {
      id: 4,
      subject: 'Physique-Chimie',
      title: 'Mécanique Quantique Fondamentale',
      professor: 'Prof. KOUDJO Mathias',
      school: 'Lycée Technique',
      location: 'Lokossa',
      price: 3800,
      duration: '6h30',
      level: 'Université',
      rating: 4.9,
      students: 89,
      lessons: 22,
      icon: FaAtom,
      color: 'from-purple-500 to-indigo-600',
      badge: 'Avancé',
      description: 'Introduction rigoureuse aux principes de la mécanique quantique avec démonstrations mathématiques et simulations.',
      objectives: [
        'Fonctions d\'onde et équation de Schrödinger',
        'Principes d\'incertitude',
        'Applications modernes'
      ]
    }
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Cours à la Une
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez nos cours les plus populaires, créés par des enseignants experts 
            de renommée nationale.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-8">
          {featuredCourses.map((course) => {
            const IconComponent = course.icon
            
            return (
              <div
                key={course.id}
                className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden group"
              >
                {/* Zone image remplacée par un conteneur sobre */}
                <div className="relative bg-gray-100 h-48 flex items-center justify-center">
                  <span className="text-gray-400 font-medium">Aperçu du cours</span>
                  <div className="absolute top-4 left-4">
                    <span className="inline-block bg-blue-100 text-blue-700 text-sm font-medium px-3 py-1 rounded-full">
                      {course.subject}
                    </span>
                    {course.badge && (
                      <span className="inline-block bg-green-100 text-green-700 text-sm font-medium px-3 py-1 rounded-full ml-2">
                        {course.badge}
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className={`bg-gradient-to-br ${course.color} p-3 rounded-2xl shadow-lg`}>
                        <IconComponent className="text-white" size={28} />
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center text-amber-500 mb-1">
                        <FaStar size={16} />
                        <span className="ml-1 font-semibold text-gray-700">{course.rating}</span>
                      </div>
                      <p className="text-sm text-gray-500">{course.students} étudiants</p>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {course.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {course.description}
                  </p>

                  <div className="space-y-3 mb-6">
                    {course.objectives.slice(0, 2).map((objective, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-600">
                        <FaPlayCircle className="text-green-500 mr-3 flex-shrink-0" size={14} />
                        {objective}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <FaClock className="mr-2" size={14} />
                        {course.duration}
                      </div>
                      <div className="flex items-center">
                        <FaBook className="mr-2" size={14} />
                        {course.lessons} leçons
                      </div>
                      <div className="flex items-center">
                        <FaGraduationCap className="mr-2" size={14} />
                        {course.level}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-3xl font-bold text-green-600">{course.price.toLocaleString()} FCFA</p>
                      <p className="text-sm text-gray-500">Accès permanent</p>
                    </div>
                    
                    <button
                      onClick={() => onCourseAction(course)}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 shadow-lg"
                    >
                      <FaShoppingCart size={16} />
                      <span>Commencer</span>
                    </button>
                  </div>
                </div>

                {/* Infos Professeur - sans image */}
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <FaUser className="text-gray-400" size={18} />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{course.professor}</p>
                        <p className="text-sm text-gray-600">{course.school}, {course.location}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => onCourseSelect(course)}
                      className="text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-2"
                    >
                      <FaInfoCircle size={16} />
                      <span>Détails</span>
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="text-center mt-12">
          <button className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl">
            <FaBook size={18} />
            <span>Explorer Tous les Cours</span>
          </button>
        </div>
      </div>
    </section>
  )
}
