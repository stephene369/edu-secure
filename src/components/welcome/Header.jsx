import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaGraduationCap, FaUser, FaShoppingCart, FaBars, FaTimes } from 'react-icons/fa';

export default function Header({ currentUser, isScrolled, getDashboardLink, getDashboardText, handleLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const NavLinks = () => (
    <>
      <Link
        to="/"
        className={`${
          isActive('/') ? 'text-blue-600 font-semibold' : 'text-gray-700'
        } hover:text-blue-600 transition-colors px-3 py-2 rounded-lg hover:bg-blue-50`}
        onClick={() => setMobileMenuOpen(false)}
      >
        Accueil
      </Link>
      <Link
        to="/how-it-works"
        className={`${
          isActive('/how-it-works') ? 'text-blue-600 font-semibold' : 'text-gray-700'
        } hover:text-blue-600 transition-colors px-3 py-2 rounded-lg hover:bg-blue-50`}
        onClick={() => setMobileMenuOpen(false)}
      >
        Comment ça marche
      </Link>
      <Link
        to="/for-teachers"
        className={`${
          isActive('/for-teachers') ? 'text-blue-600 font-semibold' : 'text-gray-700'
        } hover:text-blue-600 transition-colors px-3 py-2 rounded-lg hover:bg-blue-50`}
        onClick={() => setMobileMenuOpen(false)}
      >
        Pour les enseignants
      </Link>
      <Link
        to="/course-catalog"
        className={`${
          isActive('/course-catalog') ? 'text-blue-600 font-semibold' : 'text-gray-700'
        } hover:text-blue-600 transition-colors px-3 py-2 rounded-lg hover:bg-blue-50`}
        onClick={() => setMobileMenuOpen(false)}
      >
        Catalogue
      </Link>
      <Link
        to="/simulation-hub"
        className={`${
          isActive('/simulation-hub') ? 'text-blue-600 font-semibold' : 'text-gray-700'
        } hover:text-blue-600 transition-colors px-3 py-2 rounded-lg hover:bg-blue-50`}
        onClick={() => setMobileMenuOpen(false)}
      >
        Simulations
      </Link>
    </>
  );

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200' 
        // : 'bg-transparent'
        : 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200' 

    }`}>
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-2xl shadow-lg">
              <FaGraduationCap className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                EduSecure+
              </h1>
              <p className="text-gray-600 text-sm font-medium">Excellence Éducative Numérique</p>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            <NavLinks />
          </nav>

          {/* User Menu & Actions */}
          <div className="flex items-center space-x-4">
            {/* Cart Icon - Only for students */}
            {currentUser?.userType === 'student' && (
              <Link
                to="/cart"
                className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <FaShoppingCart size={20} />
                {/* Cart badge would go here */}
                {/* <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  3
                </span> */}
              </Link>
            )}

            {currentUser ? (
              <>
                {/* User Info */}
                <div className="hidden md:flex items-center bg-white/80 rounded-xl px-4 py-2 border border-gray-200">
                  <FaUser className="text-gray-600 mr-3" size={16} />
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-800">
                      {currentUser.firstName} {currentUser.lastName}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {currentUser.userType === 'professor' ? 'Enseignant' : 
                       currentUser.userType === 'student' ? 'Élève' : 
                       currentUser.userType === 'recruiter' ? 'Recruteur' : 
                       'Utilisateur'}
                    </p>
                  </div>
                </div>
                
                {/* Dashboard Button */}
                <Link
                  to={getDashboardLink()}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-2"
                >
                  <FaGraduationCap size={18} />
                  <span>{getDashboardText()}</span>
                </Link>
                
                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-4 py-3 rounded-xl transition-colors flex items-center space-x-2"
                >
                  <FaUser size={16} />
                  <span>Déconnexion</span>
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-blue-600 hover:text-blue-700 font-semibold px-6 py-3 rounded-xl transition-colors"
                >
                  Connexion
                </Link>
                <Link
                  to="/signup"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Créer un compte
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 bg-white rounded-xl shadow-lg border border-gray-200 p-4">
            <nav className="flex flex-col space-y-2">
              <NavLinks />
              
              {/* Mobile Auth Section */}
              {!currentUser && (
                <>
                  <div className="h-px bg-gray-200 my-2"></div>
                  <Link
                    to="/login"
                    className="text-blue-600 hover:text-blue-700 font-semibold px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Connexion
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-3 py-2 rounded-lg transition-all duration-300 text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Créer un compte
                  </Link>
                </>
              )}
              
              {currentUser && (
                <>
                  <div className="h-px bg-gray-200 my-2"></div>
                  <div className="px-3 py-2 text-sm text-gray-600">
                    Connecté en tant que <strong>{currentUser.firstName} {currentUser.lastName}</strong>
                  </div>
                  <Link
                    to={getDashboardLink()}
                    className="text-blue-600 hover:text-blue-700 font-semibold px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Mon Tableau de Bord
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-red-600 hover:text-red-700 font-semibold px-3 py-2 rounded-lg hover:bg-red-50 transition-colors text-left"
                  >
                    Se Déconnecter
                  </button>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}