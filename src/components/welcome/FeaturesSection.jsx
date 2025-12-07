// export default function FeaturesSection({ features }) {
//   return (
//     <section className="py-20 bg-white">
//       <div className="max-w-7xl mx-auto px-6">
//         <div className="text-center mb-16">
//           <h2 className="text-4xl font-bold text-gray-900 mb-4">
//             Pourquoi Choisir EduSecure+ ?
//           </h2>
//           <p className="text-xl text-gray-600 max-w-3xl mx-auto">
//             Une plateforme conçue pour répondre aux besoins spécifiques du système éducatif béninois, 
//             alliant innovation technologique et expertise pédagogique.
//           </p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
//           {features.map((feature, index) => (
//             <div key={index} className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group hover:transform hover:-translate-y-2">
//               <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform duration-300">
//                 <feature.icon className="text-white" size={24} />
//               </div>
//               <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
//               <p className="text-gray-600 leading-relaxed">{feature.description}</p>
//             </div>
//           ))}
//         </div>

//         {/* Section images supplémentaires */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-16">
//           <div className="text-center">
//             <img 
//               src="/api/placeholder/400/300" 
//               alt="Apprentissage interactif"
//               className="w-full h-48 object-cover rounded-2xl mb-4 shadow-lg"
//             />
//             <h4 className="font-bold text-gray-900 mb-2">Apprentissage Interactif</h4>
//             <p className="text-gray-600 text-sm">Quiz, exercices et évaluations en temps réel</p>
//           </div>
//           <div className="text-center">
//             <img 
//               src="/api/placeholder/400/300" 
//               alt="Support personnalisé"
//               className="w-full h-48 object-cover rounded-2xl mb-4 shadow-lg"
//             />
//             <h4 className="font-bold text-gray-900 mb-2">Support Personnalisé</h4>
//             <p className="text-gray-600 text-sm">Accompagnement individualisé pour chaque élève</p>
//           </div>
//           <div className="text-center">
//             <img 
//               src="/api/placeholder/400/300" 
//               alt="Communauté éducative"
//               className="w-full h-48 object-cover rounded-2xl mb-4 shadow-lg"
//             />
//             <h4 className="font-bold text-gray-900 mb-2">Communauté Active</h4>
//             <p className="text-gray-600 text-sm">Échanges et collaborations entre apprenants</p>
//           </div>
//         </div>
//       </div>
//     </section>
//   )
// }


export default function FeaturesSection({ features }) {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Pourquoi Choisir EduSecure+ ?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Une plateforme conçue pour répondre aux besoins spécifiques du système éducatif béninois, 
            alliant innovation technologique et expertise pédagogique.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group hover:transform hover:-translate-y-2"
            >
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Section simplifiée sans images */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-16">
          <div className="text-center p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h4 className="font-bold text-gray-900 mb-2">Apprentissage Interactif</h4>
            <p className="text-gray-600 text-sm">Quiz, exercices et évaluations en temps réel</p>
          </div>
          <div className="text-center p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h4 className="font-bold text-gray-900 mb-2">Support Personnalisé</h4>
            <p className="text-gray-600 text-sm">Accompagnement individualisé pour chaque élève</p>
          </div>
          <div className="text-center p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h4 className="font-bold text-gray-900 mb-2">Communauté Active</h4>
            <p className="text-gray-600 text-sm">Échanges et collaborations entre apprenants</p>
          </div>
        </div>
      </div>
    </section>
  )
}
