import { useState, useEffect } from 'react';
import { Search, Building2, Briefcase, ArrowLeft } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Select from '../ui/Selectt';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { SimulationCard } from './SimulationCard.jsx';
import { mockSimulations } from '../data/mockData';
import { useAuth } from '../../contexts/AuthContext.jsx';
import Header from './Header';

export function SimulationHub({ navigate }) {
  const { user, currentUser, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [isScrolled, setIsScrolled] = useState(false);

  // Gestion du scroll pour le header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const sectors = Array.from(new Set(mockSimulations.map(s => s.sector)));

  const filteredSimulations = mockSimulations
    .filter(simulation => {
      if (searchQuery && !simulation.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !simulation.description.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      if (selectedSector !== 'all' && simulation.sector !== selectedSector) {
        return false;
      }
      if (selectedDifficulty !== 'all' && simulation.difficulty !== selectedDifficulty) {
        return false;
      }
      return true;
    });

  // Fonctions pour le Header
  const getDashboardLink = () => {
    if (!currentUser) return '/';
    switch (currentUser.role) {
      case 'student':
        return 'student-dashboard';
      case 'teacher':
        return 'teacher-dashboard';
      case 'admin':
        return 'admin-dashboard';
      default:
        return '/';
    }
  };

  const getDashboardText = () => {
    if (!currentUser) return 'Dashboard';
    switch (currentUser.role) {
      case 'student':
        return 'Mon Dashboard';
      case 'teacher':
        return 'Espace Formateur';
      case 'admin':
        return 'Administration';
      default:
        return 'Dashboard';
    }
  };

  const handleLogout = () => {
    logout();
    navigate('login');
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
      <section className="bg-gradient-to-br from-purple-600 to-purple-800 text-white py-16 pt-32">
        <div className="container mx-auto px-4">
          {currentUser && currentUser.role === 'student' && (
            <div className="mb-6">
              <Button
                variant="ghost"
                onClick={() => navigate('student-dashboard')}
                className="text-white hover:bg-white/10 border-white/20"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour au Dashboard
              </Button>
            </div>
          )}
          
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="mb-4 text-white text-3xl md:text-4xl font-bold">
              Hub des Simulations Métier
            </h1>
            <p className="text-xl text-purple-100 mb-8">
              Mettez en pratique vos compétences avec des simulations créées par de vraies entreprises
            </p>
            
            {/* Search */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Rechercher une simulation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 bg-white"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white border-b sticky top-16 z-30 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex gap-4 flex-wrap">
            <Select 
              value={selectedSector} 
              onValueChange={setSelectedSector}
              options={[
                { value: 'all', label: 'Tous les secteurs' },
                ...sectors.map(sector => ({ value: sector, label: sector }))
              ]}
              className="w-[200px]"
            />

            <Select 
              value={selectedDifficulty} 
              onValueChange={setSelectedDifficulty}
              options={[
                { value: 'all', label: 'Tous niveaux' },
                { value: 'Débutant', label: 'Débutant' },
                { value: 'Intermédiaire', label: 'Intermédiaire' },
                { value: 'Avancé', label: 'Avancé' }
              ]}
              className="w-[200px]"
            />

            {(selectedSector !== 'all' || selectedDifficulty !== 'all' || searchQuery) && (
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedSector('all');
                  setSelectedDifficulty('all');
                  setSearchQuery('');
                }}
              >
                Réinitialiser
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto text-center">
            <div>
              <div className="text-3xl text-purple-600 mb-1">{mockSimulations.length}</div>
              <p className="text-sm text-gray-600">Simulations</p>
            </div>
            <div>
              <div className="text-3xl text-purple-600 mb-1">{sectors.length}</div>
              <p className="text-sm text-gray-600">Secteurs</p>
            </div>
            <div>
              <div className="text-3xl text-purple-600 mb-1">25+</div>
              <p className="text-sm text-gray-600">Entreprises</p>
            </div>
            <div>
              <div className="text-3xl text-purple-600 mb-1">5K+</div>
              <p className="text-sm text-gray-600">Participants</p>
            </div>
          </div>
        </div>
      </section>

      {/* Simulations Grid */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="all" className="mb-8">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
              <TabsTrigger value="all">Toutes</TabsTrigger>
              <TabsTrigger value="popular">Populaires</TabsTrigger>
              <TabsTrigger value="new">Nouvelles</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              {filteredSimulations.length === 0 ? (
                <div className="text-center py-12">
                  <div className="max-w-md mx-auto">
                    <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Search className="h-10 w-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Aucune simulation trouvée
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Aucune simulation ne correspond à vos critères de recherche. Essayez de modifier vos filtres.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedSector('all');
                        setSelectedDifficulty('all');
                        setSearchQuery('');
                      }}
                    >
                      Réinitialiser les filtres
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <p className="text-gray-600">
                      Affichage de <span className="font-semibold">{filteredSimulations.length}</span> simulation{filteredSimulations.length > 1 ? 's' : ''}
                      {searchQuery && (
                        <span> pour "<span className="font-semibold">{searchQuery}</span>"</span>
                      )}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredSimulations.map(simulation => (
                      <SimulationCard
                        key={simulation.id}
                        simulation={simulation}
                        onClick={() => navigate('simulation-detail', { simulationId: simulation.id })}
                      />
                    ))}
                  </div>
                </>
              )}
            </TabsContent>

            <TabsContent value="popular">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...filteredSimulations]
                  .sort((a, b) => b.participants - a.participants)
                  .map(simulation => (
                    <SimulationCard
                      key={simulation.id}
                      simulation={simulation}
                      onClick={() => navigate('simulation-detail', { simulationId: simulation.id })}
                    />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="new">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSimulations.map(simulation => (
                  <SimulationCard
                    key={simulation.id}
                    simulation={simulation}
                    onClick={() => navigate('simulation-detail', { simulationId: simulation.id })}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-br from-purple-600 to-purple-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-white text-2xl md:text-3xl font-bold">
            Vous êtes une entreprise ?
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Créez vos propres simulations métier et identifiez les meilleurs talents
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            onClick={() => window.location.href = 'mailto:contact@educsecu.com'}
          >
            Contactez-nous : contact@educsecu.com
          </Button>
        </div>
      </section>
    </div>
  );
}