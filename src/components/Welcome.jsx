import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { 
  FaBook, FaStar, FaUsers, FaPlayCircle, FaClock,
  FaGraduationCap, FaChalkboardTeacher, FaBriefcase,
  FaRocket, FaAward, FaShieldAlt, FaMobileAlt,
  FaMoneyBillWave, FaGift, FaHandshake, FaShoppingCart,
  FaInfoCircle, FaUser, FaArrowRight
} from 'react-icons/fa'

// Composants séparés pour une meilleure organisation
import Header from './welcome/Header'
import HeroSection from './welcome/HeroSection'
import CategoriesSection from './welcome/CategoriesSection'
import FeaturedCoursesSection from './welcome/FeaturedCoursesSection'
import SimulationsSection from './welcome/SimulationsSection'
import USPSection from './welcome/USPSection'
import StatsSection from './welcome/StatsSection'
import TestimonialsSection from './welcome/TestimonialsSection'
import CTASection from './welcome/CTASection'
import CourseModal from './welcome/CourseModal'

export default function Welcome() {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Données partagées entre les composants
  const appData = {
    stats: [
      { value: '5,000+', label: 'Élèves actifs' },
      { value: '200+', label: 'Cours disponibles' },
      { value: '150+', label: 'Enseignants qualifiés' },
      { value: '95%', label: 'Taux de réussite' }
    ]
  }

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
    }
  }

  const getDashboardLink = () => {
    if (currentUser?.userType === 'professor') {
      return '/teacher/dashboard'
    } else if (currentUser?.userType === 'recruiter') {
      return '/recruiter/dashboard'
    } else if (currentUser?.userType === 'committee') {
      return '/committee/dashboard'
    }
    return '/student/dashboard'
  }

  const getDashboardText = () => {
    if (currentUser?.userType === 'professor') {
      return 'Espace Enseignant'
    } else if (currentUser?.userType === 'recruiter') {
      return 'Espace Entreprise'
    } else if (currentUser?.userType === 'committee') {
      return 'Espace Comité'
    }
    return 'Espace Élève'
  }

  const handleCourseAction = (course) => {
    if (!currentUser) {
      navigate('/login', { state: { from: 'course', courseId: course.id } })
      return
    }
    // Logique d'achat pour utilisateur connecté
    alert(`Redirection vers le paiement pour "${course.title}" - ${course.price} FCFA`)
  }

  return (
    <div className="min-h-screen bg-white">
      <Header 
        currentUser={currentUser}
        isScrolled={isScrolled}
        getDashboardLink={getDashboardLink}
        getDashboardText={getDashboardText}
        handleLogout={handleLogout}
      />

      <HeroSection 
        currentUser={currentUser}
        stats={appData.stats}
        getDashboardLink={getDashboardLink}
      />

      <CategoriesSection />

      <FeaturedCoursesSection 
        onCourseAction={handleCourseAction}
        onCourseSelect={setSelectedCourse}
      />

      <SimulationsSection />

      <USPSection currentUser={currentUser} />

      <StatsSection />

      <TestimonialsSection />

      <CTASection 
        currentUser={currentUser}
        getDashboardLink={getDashboardLink}
      />

      <CourseModal 
        course={selectedCourse}
        onClose={() => setSelectedCourse(null)}
        onCourseAction={handleCourseAction}
      />
    </div>
  )
}