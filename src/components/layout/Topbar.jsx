// components/layout/Topbar.jsx
import { useAuth } from '../../contexts/AuthContext'
import { FaBars, FaSearch, FaBell, FaUserCircle } from 'react-icons/fa'

export default function Topbar({ onMenuToggle }) {
  const { currentUser, logout } = useAuth()

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="px-6 py-0">
        <div className="flex items-center justify-between">
          {/* Left section */}
          <div className="flex items-center">
            <button
              onClick={onMenuToggle}
              className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
            >
              <FaBars className="text-gray-600" size={18} />
            </button>
            
            <div className="flex items-center ml-4 lg:ml-0">
              <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                <span className="text-white font-semibold text-sm">E</span>
              </div>
              <span className="ml-3 text-lg font-semibold text-gray-900">
                EducSecu+
              </span>
            </div>
          </div>

          {/* Center section - Search */}
          {/* <div className="hidden md:block flex-1 max-w-lg mx-8">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Rechercher..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              />
            </div>
          </div> */}

          {/* Right section */}
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-lg hover:bg-gray-100 relative">
              <FaBell className="text-gray-600" size={18} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            
            <div className="relative group">
              <button className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100">
                <FaUserCircle className="text-gray-600" size={20} />
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-gray-900">
                    {currentUser?.firstName} {currentUser?.lastName}
                  </p>
                  <p className="text-xs text-gray-500">Professeur</p>
                </div>
              </button>
              
              {/* Dropdown menu */}
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="py-1">
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    Mon profil
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    Paramètres
                  </button>
                  <hr className="my-1" />
                  <button 
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                  >
                    Déconnexion
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}