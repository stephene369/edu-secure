import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  FaDollarSign, FaVideo, FaUsers, FaCheckCircle, 
  FaChartBar, FaAward, FaArrowLeft
} from 'react-icons/fa';

// Import du Header
import Header from './Header';

export default function ForTeachers() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getDashboardLink = () => {
    if (currentUser?.userType === 'professor') {
      return '/teacher/dashboard';
    } else if (currentUser?.userType === 'recruiter') {
      return '/recruiter/dashboard';
    } else if (currentUser?.userType === 'committee') {
      return '/committee/dashboard';
    }
    return '/student/dashboard';
  };

  const getDashboardText = () => {
    if (currentUser?.userType === 'professor') {
      return 'Espace Enseignant';
    } else if (currentUser?.userType === 'recruiter') {
      return 'Espace Entreprise';
    } else if (currentUser?.userType === 'committee') {
      return 'Espace Comité';
    }
    return 'Espace Élève';
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const benefits = [
    {
      icon: FaDollarSign,
      title: 'Revenus attractifs',
      description: 'Recevez 70% du prix de vente de vos cours. Plus vos cours sont populaires, plus vous gagnez.',
      color: 'green'
    },
    {
      icon: FaVideo,
      title: 'Studio de création',
      description: 'Outils intuitifs pour créer des cours professionnels avec vidéos, quiz et TD interactifs.',
      color: 'blue'
    },
    {
      icon: FaUsers,
      title: 'Large audience',
      description: 'Accédez à des milliers d\'apprenants motivés qui cherchent à développer leurs compétences.',
      color: 'purple'
    },
    {
      icon: FaCheckCircle,
      title: 'Validation qualité',
      description: 'Notre comité pédagogique vous aide à améliorer vos cours pour garantir leur qualité.',
      color: 'orange'
    },
    {
      icon: FaChartBar,
      title: 'Analytics détaillés',
      description: 'Suivez vos ventes, l\'engagement des apprenants et optimisez vos cours en temps réel.',
      color: 'red'
    },
    {
      icon: FaAward,
      title: 'Reconnaissance',
      description: 'Gagnez en visibilité et établissez-vous comme expert dans votre domaine.',
      color: 'indigo'
    }
  ];

  const steps = [
    {
      number: 1,
      title: 'Inscrivez-vous et configurez votre profil',
      description: 'Créez votre compte enseignant en quelques minutes. Ajoutez vos qualifications, domaines d\'expertise et configurez vos informations de paiement.'
    },
    {
      number: 2,
      title: 'Créez votre cours avec notre studio',
      description: 'Utilisez nos outils intuitifs pour uploader vos vidéos, créer des quiz interactifs et des travaux dirigés. Organisez votre contenu en modules cohérents.'
    },
    {
      number: 3,
      title: 'Validation par le comité pédagogique',
      description: 'Notre comité d\'experts examine votre cours et vous fournit des retours constructifs. Une fois validé, votre cours est prêt à être publié.'
    },
    {
      number: 4,
      title: 'Publiez et commencez à générer des revenus',
      description: 'Fixez votre prix, publiez votre cours et commencez à gagner de l\'argent. Vous recevez 70% de chaque vente avec des paiements mensuels automatiques.'
    }
  ];

  const testimonials = [
    {
      name: 'Dr. Marie Dubois',
      role: 'Enseignante en Informatique',
      avatar: '/api/placeholder/100/100',
      text: '"En 6 mois, j\'ai créé 4 cours qui génèrent maintenant un revenu passif de 800 000 FCFA/mois. La plateforme est très professionnelle et le support excellent."',
      revenue: '800 000 FCFA'
    },
    {
      name: 'Prof. Jean Martin',
      role: 'Enseignant en Mathématiques',
      avatar: '/api/placeholder/100/100',
      text: '"Le comité pédagogique m\'a aidé à améliorer significativement mes cours. Mes étudiants adorent et mes revenus continuent d\'augmenter."',
      revenue: '600 000 FCFA'
    },
    {
      name: 'Sophie Laurent',
      role: 'Experte en Marketing',
      avatar: '/api/placeholder/100/100',
      text: '"J\'ai doublé mes revenus en créant des cours en ligne. La plateforme me permet de toucher des milliers d\'apprenants dans toute la francophonie."',
      revenue: '1 280 000 FCFA'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      green: { bg: 'bg-green-100', text: 'text-green-600' },
      blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
      purple: { bg: 'bg-purple-100', text: 'text-purple-600' },
      orange: { bg: 'bg-orange-100', text: 'text-orange-600' },
      red: { bg: 'bg-red-100', text: 'text-red-600' },
      indigo: { bg: 'bg-indigo-100', text: 'text-indigo-600' }
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header avec navigation */}
      <Header 
        currentUser={currentUser}
        isScrolled={isScrolled}
        getDashboardLink={getDashboardLink}
        getDashboardText={getDashboardText}
        handleLogout={handleLogout}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-12 md:py-20 pt-32">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-6">
            {/* <button
              onClick={() => navigate('/')}
              className="inline-flex items-center text-white hover:bg-white/10 px-4 py-2 rounded-xl transition-colors"
            >
              <FaArrowLeft className="mr-3" size={16} />
              Retour à l'accueil
            </button> */}
          </div>
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Transformez votre expertise en revenus
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Créez des cours de qualité, touchez des milliers d'apprenants et générez des revenus passifs
            </p>
            <button
              onClick={() => navigate('/signup')}
              className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 text-lg"
            >
              Commencer à enseigner
            </button>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Pourquoi enseigner sur EduSecure+ ?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {benefits.map((benefit, index) => {
              const colorClasses = getColorClasses(benefit.color);
              const IconComponent = benefit.icon;
              
              return (
                <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
                  <div className={`${colorClasses.bg} rounded-full w-12 h-12 flex items-center justify-center mb-4`}>
                    <IconComponent className={`h-6 w-6 ${colorClasses.text}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Comment ça marche ?
            </h2>
            <p className="text-xl text-gray-600">
              De la création à la monétisation en 4 étapes simples
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            {steps.map((step, index) => (
              <div key={index} className="flex gap-6 items-start">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold">
                    {step.number}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => navigate('/signup')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105"
            >
              Créer mon premier cours
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Structure de revenus
            </h2>
            <p className="text-xl text-gray-600">
              Une commission simple et transparente
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-8 shadow-lg border-2 border-blue-200">
              <div className="text-center mb-6">
                <div className="text-6xl font-bold text-blue-600 mb-4">70%</div>
                <p className="text-xl text-gray-600">
                  de commission sur chaque vente
                </p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center p-4 bg-white rounded-lg border border-gray-200">
                  <span className="text-gray-600">Vous fixez le prix (ou gratuit)</span>
                  <span className="font-semibold">Exemple: 20 000 FCFA</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-white rounded-lg border border-gray-200">
                  <span className="text-gray-600">Votre revenu (70%)</span>
                  <span className="text-green-600 font-semibold">14 000 FCFA</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-white rounded-lg border border-gray-200">
                  <span className="text-gray-600">Commission plateforme (30%)</span>
                  <span className="text-gray-600 font-semibold">6 000 FCFA</span>
                </div>
              </div>

              <div className="bg-blue-100 rounded-lg p-4 space-y-2">
                <p className="text-sm text-gray-700 flex items-center">
                  <FaCheckCircle className="text-blue-600 mr-3 flex-shrink-0" size={16} />
                  Pas de frais cachés
                </p>
                <p className="text-sm text-gray-700 flex items-center">
                  <FaCheckCircle className="text-blue-600 mr-3 flex-shrink-0" size={16} />
                  Paiements mensuels automatiques
                </p>
                <p className="text-sm text-gray-700 flex items-center">
                  <FaCheckCircle className="text-blue-600 mr-3 flex-shrink-0" size={16} />
                  Aucun minimum de ventes requis
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Témoignages d'enseignants
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                <div className="mb-4">
                  <div className="w-16 h-16 bg-gray-300 rounded-full mb-3 flex items-center justify-center">
                    <span className="text-gray-600 text-sm">Photo</span>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
                <p className="text-gray-600 mb-4 leading-relaxed italic">
                  {testimonial.text}
                </p>
                <div className="text-sm text-gray-500 font-medium">
                  Revenue mensuel: {testimonial.revenue}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Prêt à commencer ?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Rejoignez des centaines d'enseignants qui partagent leur expertise et génèrent des revenus
          </p>
          <button
            onClick={() => navigate('/signup')}
            className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 text-lg"
          >
            Créer mon compte enseignant
          </button>
        </div>
      </section>
    </div>
  );
}