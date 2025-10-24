import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PostCard from '../components/PostCard';
import NewsletterBox from '../components/NewsletterBox';
import { ArrowRight, Code, Sparkles, Zap } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Home = () => {
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${API}/posts?limit=6`);
      const posts = response.data;
      setFeaturedPosts(posts.slice(0, 1));
      setRecentPosts(posts.slice(1, 6));
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4" data-testid="hero-section">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full mb-6">
              <Sparkles size={18} />
              <span className="text-sm font-medium">Blog de Desarrollo de Software</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6" style={{fontFamily: 'Space Grotesk'}}>
              Aprende, Crea e{' '}
              <span className="gradient-text">Innova</span>
              {' '}en el Desarrollo de Software
            </h1>
            <p className="text-base sm:text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Únete a FarchoDev para explorar las últimas tecnologías, mejores prácticas 
              y tutoriales sobre desarrollo web, backend y arquitectura de software.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/blog" className="btn-primary inline-flex items-center justify-center" data-testid="hero-explore-btn">
                Explorar Artículos
                <ArrowRight size={20} className="ml-2" />
              </Link>
              <Link to="/about" className="btn-secondary inline-flex items-center justify-center" data-testid="hero-about-btn">
                Conoce más
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-xl bg-gradient-to-br from-blue-50 to-white border border-blue-100" data-testid="feature-tutorials">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Code size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2" style={{fontFamily: 'Space Grotesk'}}>Tutoriales Prácticos</h3>
              <p className="text-gray-600">Aprende con ejemplos reales y proyectos completos paso a paso.</p>
            </div>
            <div className="text-center p-8 rounded-xl bg-gradient-to-br from-yellow-50 to-white border border-yellow-100" data-testid="feature-best-practices">
              <div className="w-16 h-16 bg-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4" style={{background: '#B89A4B'}}>
                <Zap size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2" style={{fontFamily: 'Space Grotesk'}}>Mejores Prácticas</h3>
              <p className="text-gray-600">Descubre patrones de diseño y técnicas avanzadas de desarrollo.</p>
            </div>
            <div className="text-center p-8 rounded-xl bg-gradient-to-br from-blue-50 to-white border border-blue-100" data-testid="feature-community">
              <div className="w-16 h-16 bg-blue-700 rounded-full flex items-center justify-center mx-auto mb-4" style={{background: '#0E4CB2'}}>
                <Sparkles size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2" style={{fontFamily: 'Space Grotesk'}}>Comunidad Activa</h3>
              <p className="text-gray-600">Interactúa, comenta y comparte experiencias con otros desarrolladores.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {!loading && featuredPosts.length > 0 && (
        <section className="py-16 px-4" data-testid="featured-section">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8" style={{fontFamily: 'Space Grotesk'}}>Artículo Destacado</h2>
            <PostCard post={featuredPosts[0]} featured={true} />
          </div>
        </section>
      )}

      {/* Recent Posts */}
      {!loading && recentPosts.length > 0 && (
        <section className="py-16 px-4 bg-white" data-testid="recent-posts-section">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900" style={{fontFamily: 'Space Grotesk'}}>Artículos Recientes</h2>
              <Link to="/blog" className="text-blue-700 font-medium hover:text-blue-800 flex items-center" data-testid="view-all-posts">
                Ver todos
                <ArrowRight size={20} className="ml-1" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentPosts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter Section */}
      <section className="py-16 px-4" data-testid="newsletter-section">
        <div className="max-w-3xl mx-auto">
          <NewsletterBox />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;