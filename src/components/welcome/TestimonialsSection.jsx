import { FaStar } from 'react-icons/fa'

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Sophie M.',
      role: 'Élève de Terminale C',
      avatar: '/api/placeholder/100/100',
      text: 'Les cours de maths m\'ont vraiment aidée à préparer mon bac. Les explications sont claires et les exercices bien corrigés. J\'ai obtenu 18/20 !',
      rating: 5,
    },
    {
      name: 'Jean-Paul D.',
      role: 'Enseignant de Physique',
      avatar: '/api/placeholder/100/100',
      text: 'Plateforme excellente pour partager mes cours. L\'interface de création est intuitive et je génère des revenus supplémentaires chaque mois.',
      rating: 5,
    },
    {
      name: 'Marie K.',
      role: 'Diplômée',
      avatar: '/api/placeholder/100/100',
      text: 'Les simulations métier m\'ont permis de décrocher un stage dans une grande entreprise. Elles sont vraiment professionnelles et réalistes !',
      rating: 5,
    },
  ]

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-center text-3xl font-bold text-gray-900 mb-12">
          Ce que disent nos utilisateurs
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <FaStar key={i} className="text-yellow-400" size={20} />
                ))}
              </div>
              <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 text-sm">Photo</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}