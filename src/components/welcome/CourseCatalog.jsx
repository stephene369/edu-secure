import { useState, useEffect } from 'react';
import { Search, Filter, SlidersHorizontal, ArrowLeft } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Select from '../ui/Selectt';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { Slider } from '../ui/slider';
import { CourseCard } from '../ui/CourseCard';
import { mockCourses } from '../data/mockData';
import { useAuth } from '../../contexts/AuthContext';
import Header from './Header';

export function CourseCatalog({ navigate }) {
  const { user, currentUser, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedLevels, setSelectedLevels] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [sortBy, setSortBy] = useState('popular');
  const [isScrolled, setIsScrolled] = useState(false);

  // Gestion du scroll pour le header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const categories = Array.from(new Set(mockCourses.map(c => c.category)));
  const levels = ['Débutant', 'Intermédiaire', 'Avancé'];

  const filteredCourses = mockCourses
    .filter(course => course.status === 'published')
    .filter(course => {
      if (searchQuery && !course.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !course.description.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      if (selectedCategories.length > 0 && !selectedCategories.includes(course.category)) {
        return false;
      }
      if (selectedLevels.length > 0 && !selectedLevels.includes(course.level)) {
        return false;
      }
      if (course.price < priceRange[0] || course.price > priceRange[1]) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
          return 0; // Would use actual date in real app
        default: // popular
          return b.students - a.students;
      }
    });

  const toggleCategory = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const toggleLevel = (level) => {
    setSelectedLevels(prev =>
      prev.includes(level)
        ? prev.filter(l => l !== level)
        : [...prev, level]
    );
  };

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

  const FilterPanel = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="mb-3 font-medium text-gray-900">Catégories</h3>
        <div className="space-y-2">
          {categories.map(category => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={`cat-${category}`}
                checked={selectedCategories.includes(category)}
                onCheckedChange={() => toggleCategory(category)}
              />
              <Label htmlFor={`cat-${category}`} className="cursor-pointer text-sm text-gray-700">
                {category}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Levels */}
      <div>
        <h3 className="mb-3 font-medium text-gray-900">Niveau</h3>
        <div className="space-y-2">
          {levels.map(level => (
            <div key={level} className="flex items-center space-x-2">
              <Checkbox
                id={`level-${level}`}
                checked={selectedLevels.includes(level)}
                onCheckedChange={() => toggleLevel(level)}
              />
              <Label htmlFor={`level-${level}`} className="cursor-pointer text-sm text-gray-700">
                {level}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="mb-3 font-medium text-gray-900">Prix</h3>
        <div className="space-y-4">
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            max={100}
            step={5}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>{priceRange[0].toLocaleString()} FCFA</span>
            <span>{priceRange[1].toLocaleString()} FCFA</span>
          </div>
        </div>
      </div>

      {/* Reset */}
      <Button
        variant="outline"
        className="w-full"
        onClick={() => {
          setSelectedCategories([]);
          setSelectedLevels([]);
          setPriceRange([0, 100]);
        }}
      >
        Réinitialiser les filtres
      </Button>
    </div>
  );

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
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-16">
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
          
          <div className="max-w-3xl mx-auto text-center mt-10">
            <h1 className="text-4xl md:text-5xl font-bold my-4">
              Catalogue de Cours
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Découvrez notre collection complète de cours pour développer vos compétences
            </p>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 inline-block">
              <p className="text-2xl font-semibold">
                {filteredCourses.length} cours disponibles
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="bg-white border-b sticky top-16 z-30 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex gap-4 flex-col md:flex-row">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Rechercher un cours, un sujet, un instructeur..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 py-3"
              />
            </div>
            <div className="flex gap-2">
              <Select 
                value={sortBy} 
                onValueChange={setSortBy}
                options={[
                  { value: 'popular', label: 'Plus populaires' },
                  { value: 'rating', label: 'Mieux notés' },
                  { value: 'price-low', label: 'Prix croissant' },
                  { value: 'price-high', label: 'Prix décroissant' },
                  { value: 'newest', label: 'Plus récents' }
                ]}
                className="w-[180px]"
              />

              {/* Mobile Filter Button */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="md:hidden">
                    <Filter className="h-4 w-4 mr-2" />
                    Filtres
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px]">
                  <SheetHeader>
                    <SheetTitle>Filtres</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterPanel />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex gap-8">
            {/* Desktop Filters */}
            <aside className="hidden md:block w-64 flex-shrink-0">
              <div className="sticky top-32 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center gap-2 mb-6">
                  <SlidersHorizontal className="h-5 w-5 text-gray-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Filtres</h2>
                </div>
                <FilterPanel />
              </div>
            </aside>

            {/* Course Grid */}
            <div className="flex-1">
              {filteredCourses.length === 0 ? (
                <div className="text-center py-16">
                  <div className="max-w-md mx-auto">
                    <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Search className="h-10 w-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Aucun cours trouvé
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Aucun cours ne correspond à vos critères de recherche. Essayez de modifier vos filtres.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategories([]);
                        setSelectedLevels([]);
                        setPriceRange([0, 100]);
                      }}
                    >
                      Réinitialiser les filtres
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Résultats info */}
                  <div className="mb-6">
                    <p className="text-gray-600">
                      Affichage de <span className="font-semibold">{filteredCourses.length}</span> cours
                      {searchQuery && (
                        <span> pour "<span className="font-semibold">{searchQuery}</span>"</span>
                      )}
                    </p>
                  </div>

                  {/* Grid des cours */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses.map(course => (
                      <CourseCard
                        key={course.id}
                        course={course}
                        onClick={() => navigate('course-detail', { courseId: course.id })}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}