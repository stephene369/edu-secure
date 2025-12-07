import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { 
  FaBook, FaUsers, FaBriefcase, FaShieldAlt, 
  FaCheck, FaArrowLeft
} from 'react-icons/fa';

// Import du Header
import Header from './Header';

export default function HowItWorks() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('teacher');
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

  const tabs = [
    { id: 'teacher', label: 'Enseignant', icon: FaUsers, color: 'blue' },
    { id: 'student', label: 'Apprenant', icon: FaBook, color: 'green' },
    { id: 'recruiter', label: 'Recruteur', icon: FaBriefcase, color: 'purple' },
    { id: 'committee', label: 'Comité', icon: FaShieldAlt, color: 'orange' }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: {
        bg: 'bg-blue-600',
        lightBg: 'bg-blue-100',
        text: 'text-blue-600',
        border: 'border-blue-600'
      },
      green: {
        bg: 'bg-green-600',
        lightBg: 'bg-green-100',
        text: 'text-green-600',
        border: 'border-green-600'
      },
      purple: {
        bg: 'bg-purple-600',
        lightBg: 'bg-purple-100',
        text: 'text-purple-600',
        border: 'border-purple-600'
      },
      orange: {
        bg: 'bg-orange-600',
        lightBg: 'bg-orange-100',
        text: 'text-orange-600',
        border: 'border-orange-600'
      }
    };
    return colors[color] || colors.blue;
  };

  const TabContent = ({ tabId, color }) => {
    const colorClasses = getColorClasses(color);
    const currentTab = tabs.find(t => t.id === tabId);
    const IconComponent = currentTab?.icon || FaUsers;
    
    const contents = {
      teacher: {
        title: 'Parcours Enseignant',
        subtitle: 'Créez, monétisez et partagez votre expertise',
        steps: [
          {
            number: 1,
            title: 'Inscription et Onboarding',
            description: 'Créez votre compte enseignant en quelques minutes. Complétez votre profil avec vos qualifications, domaines d\'expertise et expérience pédagogique.',
            features: [
              'Vérification des qualifications',
              'Configuration du profil',
              'Paramétrage des paiements'
            ]
          },
          {
            number: 2,
            title: 'Création de Cours',
            description: 'Utilisez notre studio intuitif pour créer des cours complets avec vidéos, quiz interactifs et travaux dirigés.',
            features: [
              'Upload de vidéos HD',
              'Éditeur de quiz et exercices',
              'Ressources téléchargeables (PDF, fichiers)'
            ]
          },
          {
            number: 3,
            title: 'Validation Pédagogique',
            description: 'Votre cours est examiné par notre comité pédagogique pour garantir sa qualité. Vous recevez des retours constructifs pour l\'améliorer.',
            features: [
              'Évaluation de la qualité pédagogique',
              'Feedback détaillé',
              'Approbation en 5-7 jours'
            ]
          },
          {
            number: 4,
            title: 'Publication et Monétisation',
            description: 'Une fois validé, votre cours est publié sur la plateforme. Fixez votre prix et commencez à générer des revenus. Vous recevez 70% du prix de vente.',
            features: [
              'Vous fixez votre prix',
              '70% de commission sur chaque vente',
              'Paiements mensuels automatiques'
            ]
          },
          {
            number: 5,
            title: 'Suivi et Analytics',
            description: 'Accédez à votre tableau de bord pour suivre vos ventes, consulter les analytics de vos cours et interagir avec vos apprenants.',
            features: [
              'Dashboard détaillé',
              'Statistiques d\'engagement',
              'Messagerie avec les apprenants'
            ]
          }
        ],
        buttonText: 'S\'inscrire ou se connecter',
        buttonAction: () => navigate('/signup')
      },
      student: {
        title: 'Parcours Apprenant',
        subtitle: 'Apprenez, pratiquez et boostez votre employabilité',
        steps: [
          {
            number: 1,
            title: 'Exploration du Catalogue',
            description: 'Parcourez notre catalogue de cours validés par des experts. Filtrez par niveau, matière, format et prix pour trouver ce qui vous convient.'
          },
          {
            number: 2,
            title: 'Inscription aux Cours',
            description: 'Achetez les cours qui vous intéressent ou accédez aux cours gratuits. Profitez d\'un aperçu vidéo avant de vous engager.'
          },
          {
            number: 3,
            title: 'Apprentissage Actif',
            description: 'Suivez les vidéos, complétez les quiz et réalisez les travaux dirigés à votre rythme. Accès illimité à vie.'
          },
          {
            number: 4,
            title: 'Simulations Métier',
            description: 'Accédez aux simulations créées par des entreprises réelles. Mettez en pratique vos compétences dans des scénarios professionnels.'
          },
          {
            number: 5,
            title: 'Certificats et Badges',
            description: 'Complétez les cours et simulations pour obtenir des certificats et badges. Valorisez votre profil auprès des recruteurs.'
          }
        ],
        buttonText: 'S\'inscrire ou se connecter',
        buttonAction: () => navigate('/signup')
      },
      recruiter: {
        title: 'Parcours Recruteur',
        subtitle: 'Créez des simulations et identifiez les meilleurs talents',
        steps: [
          {
            number: 1,
            title: 'Inscription Entreprise',
            description: 'Créez votre compte entreprise et configurez votre page de marque employeur sur la plateforme.'
          },
          {
            number: 2,
            title: 'Création de Simulations',
            description: 'Créez des simulations métier réalistes basées sur vos besoins réels. Définissez les tâches, ressources et critères d\'évaluation.'
          },
          {
            number: 3,
            title: 'Diffusion',
            description: 'Publiez vos simulations pour que les apprenants puissent les découvrir et les compléter. Gratuit pour les candidats.'
          },
          {
            number: 4,
            title: 'Suivi des Candidats',
            description: 'Consultez les résultats des candidats qui complètent vos simulations. Identifiez les talents qui performent le mieux.'
          },
          {
            number: 5,
            title: 'Rapports et Analytics',
            description: 'Accédez à des rapports détaillés sur les performances des candidats. Exportez les données pour votre processus de recrutement.'
          }
        ],
        buttonText: 'S\'inscrire ou se connecter',
        buttonAction: () => navigate('/signup')
      },
      committee: {
        title: 'Comité Pédagogique',
        subtitle: 'Garantissez la qualité des cours sur la plateforme',
        steps: [
          {
            number: 1,
            title: 'Sélection et Formation',
            description: 'Les membres du comité sont sélectionnés parmi des enseignants expérimentés et formés aux critères de qualité pédagogique.'
          },
          {
            number: 2,
            title: 'Révision des Cours',
            description: 'Évaluez les cours soumis selon des critères stricts : clarté, pertinence, qualité pédagogique, exactitude du contenu.'
          },
          {
            number: 3,
            title: 'Feedback Constructif',
            description: 'Fournissez des retours détaillés aux enseignants pour les aider à améliorer leurs cours avant publication.'
          },
          {
            number: 4,
            title: 'Validation ou Rejet',
            description: 'Approuvez les cours qui respectent les standards de qualité ou demandez des modifications si nécessaire.'
          },
          {
            number: 5,
            title: 'Suivi Continu',
            description: 'Surveillez la qualité des cours publiés et les retours des apprenants pour maintenir des standards élevés.'
          }
        ],
        buttonText: 'S\'inscrire ou se connecter',
        buttonAction: () => navigate('/signup')
      }
    };

    const content = contents[tabId];

    return (
      <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200">
        <div className="flex items-center gap-4 mb-8">
          <div className={`${colorClasses.bg} rounded-full p-4`}>
            <IconComponent className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{content.title}</h2>
            <p className="text-gray-600">{content.subtitle}</p>
          </div>
        </div>

        <div className="space-y-8">
          {content.steps.map((step, index) => (
            <div key={index} className="flex gap-6">
              <div className="flex-shrink-0">
                <div className={`w-12 h-12 rounded-full ${colorClasses.lightBg} ${colorClasses.text} flex items-center justify-center font-semibold text-lg`}>
                  {step.number}
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">{step.description}</p>
                
                {step.features && (
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    {step.features.map((feature, featureIndex) => (
                      <p key={featureIndex} className="text-sm text-gray-700 flex items-center">
                        <FaCheck className={`${colorClasses.text} mr-3 flex-shrink-0`} size={14} />
                        {feature}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={content.buttonAction}
            className={`w-full bg-gradient-to-r ${colorClasses.bg === 'bg-blue-600' ? 'from-blue-600 to-blue-700' : 
                       colorClasses.bg === 'bg-green-600' ? 'from-green-600 to-green-700' :
                       colorClasses.bg === 'bg-purple-600' ? 'from-purple-600 to-purple-700' :
                       'from-orange-600 to-orange-700'} hover:opacity-90 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105`}
          >
            {content.buttonText}
          </button>
        </div>
      </div>
    );
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

      {/* Contenu principal */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-12 md:py-16 pt-32">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-6">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center text-white hover:bg-white/10 px-4 py-2 rounded-xl transition-colors"
            >
              <FaArrowLeft className="mr-3" size={16} />
              Retour à l'accueil
            </button>
          </div>
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Comment fonctionne EduSecure+ ?
            </h1>
            <p className="text-xl text-blue-100">
              Découvrez les parcours adaptés à chaque acteur de notre écosystème éducatif
            </p>
          </div>
        </div>
      </section>

      {/* Section des onglets */}
      <section className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4">
          {/* Navigation par onglets */}
          <div className="flex flex-wrap gap-2 md:gap-4 justify-center mb-8">
            {tabs.map((tab) => {
              const colorClasses = getColorClasses(tab.color);
              const isActive = activeTab === tab.id;
              const IconComponent = tab.icon;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    isActive 
                      ? `${colorClasses.bg} text-white shadow-lg` 
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  <IconComponent className="mr-3" size={18} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Contenu de l'onglet actif */}
          <TabContent tabId={activeTab} color={tabs.find(t => t.id === activeTab)?.color || 'blue'} />
        </div>
      </section>
    </div>
  );
}