import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, Settings, BookMarked } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const location = useLocation();
  const { user, logout, isAuthenticated, isAdmin } = useAuth();

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    await logout();
    setIsUserMenuOpen(false);
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  };

  return (
    <>
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToRegister={() => {
          setShowLoginModal(false);
          setShowRegisterModal(true);
        }}
      />
      <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onSwitchToLogin={() => {
          setShowRegisterModal(false);
          setShowLoginModal(true);
        }}
      />
    <nav className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2" data-testid="navbar-logo">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-700 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">F</span>
            </div>
            <span className="text-xl font-bold text-gray-900" style={{fontFamily: 'Space Grotesk'}}>FarchoDev</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors ${
                isActive('/') ? 'text-blue-700' : 'text-gray-600 hover:text-blue-700'
              }`}
              data-testid="nav-home"
            >
              Inicio
            </Link>
            <Link 
              to="/blog" 
              className={`text-sm font-medium transition-colors ${
                isActive('/blog') ? 'text-blue-700' : 'text-gray-600 hover:text-blue-700'
              }`}
              data-testid="nav-blog"
            >
              Blog
            </Link>
            <Link 
              to="/about" 
              className={`text-sm font-medium transition-colors ${
                isActive('/about') ? 'text-blue-700' : 'text-gray-600 hover:text-blue-700'
              }`}
              data-testid="nav-about"
            >
              Acerca de
            </Link>
            
            {/* Auth Section */}
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link 
                    to="/admin" 
                    className="text-sm font-medium text-gray-600 hover:text-blue-700 transition-colors" 
                    data-testid="nav-admin"
                  >
                    Admin
                  </Link>
                )}
                
                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 focus:outline-none"
                    data-testid="user-menu-button"
                  >
                    <div className="w-9 h-9 bg-gradient-to-br from-blue-700 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {getInitials(user?.name)}
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-200 z-50">
                      <div className="px-4 py-2 border-b border-gray-200">
                        <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                      </div>
                      
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <User size={16} className="mr-2" />
                        Mi Perfil
                      </Link>
                      
                      <Link
                        to="/profile?tab=bookmarks"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <BookMarked size={16} className="mr-2" />
                        Guardados
                      </Link>
                      
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut size={16} className="mr-2" />
                        Cerrar Sesión
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="text-sm font-medium text-gray-600 hover:text-blue-700 transition-colors"
                  data-testid="nav-login"
                >
                  Iniciar Sesión
                </button>
                <button
                  onClick={() => setShowRegisterModal(true)}
                  className="btn-primary text-sm"
                  data-testid="nav-register"
                >
                  Registrarse
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            data-testid="mobile-menu-toggle"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-3" data-testid="mobile-menu">
            <Link 
              to="/" 
              className="block text-gray-600 hover:text-blue-700" 
              onClick={() => setIsMenuOpen(false)}
              data-testid="mobile-nav-home"
            >
              Inicio
            </Link>
            <Link 
              to="/blog" 
              className="block text-gray-600 hover:text-blue-700" 
              onClick={() => setIsMenuOpen(false)}
              data-testid="mobile-nav-blog"
            >
              Blog
            </Link>
            <Link 
              to="/about" 
              className="block text-gray-600 hover:text-blue-700" 
              onClick={() => setIsMenuOpen(false)}
              data-testid="mobile-nav-about"
            >
              Acerca de
            </Link>
            
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link 
                    to="/admin" 
                    className="block text-gray-600 hover:text-blue-700" 
                    onClick={() => setIsMenuOpen(false)}
                    data-testid="mobile-nav-admin"
                  >
                    Admin
                  </Link>
                )}
                <Link 
                  to="/profile" 
                  className="block text-gray-600 hover:text-blue-700" 
                  onClick={() => setIsMenuOpen(false)}
                >
                  Mi Perfil
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left text-red-600 hover:text-red-700"
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setShowLoginModal(true);
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left text-gray-600 hover:text-blue-700"
                >
                  Iniciar Sesión
                </button>
                <button
                  onClick={() => {
                    setShowRegisterModal(true);
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left text-blue-700 font-medium"
                >
                  Registrarse
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
    </>
  );
};

export default Navbar;