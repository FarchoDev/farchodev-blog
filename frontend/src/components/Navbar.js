import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, Settings, BookMarked } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';

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
            <div className="w-10 h-10 bg-gradient-to-br from-teal-700 to-teal-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">F</span>
            </div>
            <span className="text-xl font-bold text-gray-900" style={{fontFamily: 'Space Grotesk'}}>FarchoDev</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors ${
                isActive('/') ? 'text-teal-700' : 'text-gray-600 hover:text-teal-700'
              }`}
              data-testid="nav-home"
            >
              Inicio
            </Link>
            <Link 
              to="/blog" 
              className={`text-sm font-medium transition-colors ${
                isActive('/blog') ? 'text-teal-700' : 'text-gray-600 hover:text-teal-700'
              }`}
              data-testid="nav-blog"
            >
              Blog
            </Link>
            <Link 
              to="/about" 
              className={`text-sm font-medium transition-colors ${
                isActive('/about') ? 'text-teal-700' : 'text-gray-600 hover:text-teal-700'
              }`}
              data-testid="nav-about"
            >
              Acerca de
            </Link>
            <Link 
              to="/admin" 
              className="btn-primary text-sm" 
              data-testid="nav-admin"
            >
              Admin
            </Link>
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
            <Link to="/" className="block text-gray-600 hover:text-teal-700" data-testid="mobile-nav-home">
              Inicio
            </Link>
            <Link to="/blog" className="block text-gray-600 hover:text-teal-700" data-testid="mobile-nav-blog">
              Blog
            </Link>
            <Link to="/about" className="block text-gray-600 hover:text-teal-700" data-testid="mobile-nav-about">
              Acerca de
            </Link>
            <Link to="/admin" className="block text-teal-700 font-medium" data-testid="mobile-nav-admin">
              Admin
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;