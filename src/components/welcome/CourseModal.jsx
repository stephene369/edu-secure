import { FaPlayCircle, FaShoppingCart, FaShieldAlt, FaUser, FaGraduationCap, FaMapMarkerAlt } from 'react-icons/fa'

export default function CourseModal({ course, onClose, onCourseAction }) {
  if (!course) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center space-x-6">
            <div className={`bg-gradient-to-br ${course.color} p-4 rounded-2xl shadow-lg`}>
              <course.icon className="text-white" size={32} />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-gray-900">{course.title}</h3>
              <div className="flex items-center space-x-4 mt-2">
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                  {course.subject}
                </span>
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                  {course.level}
                </span>
                {course.badge && (
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                    {course.badge}
                  </span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors"
          >
            ×
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h4 className="text-xl font-bold text-gray-900 mb-4">Description du Cours</h4>
              <p className="text-gray-600 leading-relaxed">{course.description}</p>
            </div>

            <div>
              <h4 className="text-xl font-bold text-gray-900 mb-4">Objectifs d'Apprentissage</h4>
              <div className="space-y-3">
                {course.objectives.map((objective, index) => (
                  <div key={index} className="flex items-center text-gray-700">
                    <FaPlayCircle className="text-green-500 mr-4 flex-shrink-0" size={16} />
                    {objective}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6">
              <h4 className="text-xl font-bold text-gray-900 mb-4">Votre Professeur</h4>
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-2xl">
                  <FaUser className="text-white" size={24} />
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-900">{course.professor}</p>
                  <p className="text-gray-600">{course.school}</p>
                  <p className="text-gray-500 text-sm flex items-center">
                    <FaMapMarkerAlt className="mr-1" size={12} />
                    {course.location}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
              <div className="text-center mb-6">
                <p className="text-4xl font-bold text-green-600">{course.price.toLocaleString()} FCFA</p>
                <p className="text-gray-600">Accès permanent au cours</p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Durée totale</span>
                  <span className="font-semibold">{course.duration}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Nombre de leçons</span>
                  <span className="font-semibold">{course.lessons}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Niveau</span>
                  <span className="font-semibold">{course.level}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Étudiants inscrits</span>
                  <span className="font-semibold">{course.students}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Note moyenne</span>
                  <span className="font-semibold text-amber-600">{course.rating}/5</span>
                </div>
              </div>

              <button
                onClick={() => onCourseAction(course)}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-3"
              >
                <FaShoppingCart size={20} />
                <span>Acquérir ce Cours</span>
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-500 flex items-center justify-center space-x-2">
                <FaShieldAlt className="text-green-500" size={16} />
                <span>Garantie de satisfaction 30 jours</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}