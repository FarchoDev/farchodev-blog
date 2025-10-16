import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Twitter, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-700 to-teal-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">F</span>
              </div>
              <span className="text-xl font-bold text-white" style={{fontFamily: 'Space Grotesk'}}>FarchoDev</span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              Blog dedicado al desarrollo de software, tecnología y las mejores prácticas en programación.
            </p>
            <div className="flex space-x-4">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-teal-400 transition-colors" data-testid="social-github">
                <Github size={20} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-teal-400 transition-colors" data-testid="social-linkedin">
                <Linkedin size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-teal-400 transition-colors" data-testid="social-twitter">
                <Twitter size={20} />
              </a>
              <a href="mailto:contact@farchodev.com" className="hover:text-teal-400 transition-colors" data-testid="social-email">
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4" style={{fontFamily: 'Space Grotesk'}}>Enlaces</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-teal-400 transition-colors" data-testid="footer-home">Inicio</Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-teal-400 transition-colors" data-testid="footer-blog">Blog</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-teal-400 transition-colors" data-testid="footer-about">Acerca de</Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-teal-400 transition-colors" data-testid="footer-admin">Admin</Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-4" style={{fontFamily: 'Space Grotesk'}}>Categorías</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/category/desarrollo-web" className="hover:text-teal-400 transition-colors">Desarrollo Web</Link>
              </li>
              <li>
                <Link to="/category/javascript" className="hover:text-teal-400 transition-colors">JavaScript</Link>
              </li>
              <li>
                <Link to="/category/backend" className="hover:text-teal-400 transition-colors">Backend</Link>
              </li>
              <li>
                <Link to="/category/devops" className="hover:text-teal-400 transition-colors">DevOps</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} FarchoDev. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;