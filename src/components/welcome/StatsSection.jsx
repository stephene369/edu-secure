export default function StatsSection() {
  return (
    <section className="py-16 bg-blue-600 text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl md:text-5xl font-bold mb-2">5,000+</div>
            <div className="text-blue-100">Élèves actifs</div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-bold mb-2">200+</div>
            <div className="text-blue-100">Cours disponibles</div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-bold mb-2">150+</div>
            <div className="text-blue-100">Enseignants qualifiés</div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-bold mb-2">95%</div>
            <div className="text-blue-100">Taux de réussite</div>
          </div>
        </div>
      </div>
    </section>
  )
}