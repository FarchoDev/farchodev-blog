import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import NewsletterBox from '../components/NewsletterBox';
import { Code, Rocket, Heart, Users } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      <Navbar />
      
      <div className="pt-24 pb-16 px-4" data-testid="about-page">
        <div className="max-w-4xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-16">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-700 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-white font-bold text-5xl">F</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4" style={{fontFamily: 'Space Grotesk'}}>Sobre FarchoDev</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Un espacio dedicado a compartir conocimiento sobre desarrollo de software, 
              mejores prácticas y experiencias en el mundo de la tecnología.
            </p>
          </div>

          {/* Mission */}
          <div className="bg-white rounded-2xl p-8 mb-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4" style={{fontFamily: 'Space Grotesk'}}>Nuestra Misión</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              En FarchoDev, creemos que el conocimiento debe ser compartido. Nuestro objetivo es crear 
              contenido de calidad que ayude a desarrolladores de todos los niveles a mejorar sus habilidades 
              y mantenerse actualizados con las últimas tendencias en tecnología.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Desde tutoriales prácticos hasta análisis profundos de arquitectura de software, 
              buscamos proporcionar recursos valiosos para la comunidad de desarrollo.
            </p>
          </div>

          {/* Values */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl border border-blue-100">
              <div className="w-12 h-12 bg-blue-700 rounded-lg flex items-center justify-center mb-4">
                <Code size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2" style={{fontFamily: 'Space Grotesk'}}>Calidad Técnica</h3>
              <p className="text-gray-700">Contenido verificado y actualizado con las mejores prácticas de la industria.</p>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-white p-6 rounded-xl border border-orange-100">
              <div className="w-12 h-12 bg-#B89A4B rounded-lg flex items-center justify-center mb-4">
                <Rocket size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2" style={{fontFamily: 'Space Grotesk'}}>Innovación</h3>
              <p className="text-gray-700">Exploramos y compartimos las tecnologías y herramientas más recientes.</p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl border border-blue-100">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                <Users size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2" style={{fontFamily: 'Space Grotesk'}}>Comunidad</h3>
              <p className="text-gray-700">Fomentamos el aprendizaje colaborativo y el intercambio de experiencias.</p>
            </div>

            <div className="bg-gradient-to-br from-pink-50 to-white p-6 rounded-xl border border-pink-100">
              <div className="w-12 h-12 bg-pink-600 rounded-lg flex items-center justify-center mb-4">
                <Heart size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2" style={{fontFamily: 'Space Grotesk'}}>Pasión</h3>
              <p className="text-gray-700">Amor por el código y entusiasmo por enseñar y compartir.</p>
            </div>
          </div>

          {/* Topics */}
          <div className="bg-white rounded-2xl p-8 mb-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6" style={{fontFamily: 'Space Grotesk'}}>Temas que Cubrimos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-700 rounded-full" />
                <span className="text-gray-700">Desarrollo Web (Frontend & Backend)</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-700 rounded-full" />
                <span className="text-gray-700">JavaScript & TypeScript</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-700 rounded-full" />
                <span className="text-gray-700">React, Vue, Angular</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-700 rounded-full" />
                <span className="text-gray-700">Node.js, Python, Go</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-700 rounded-full" />
                <span className="text-gray-700">Arquitectura de Software</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-700 rounded-full" />
                <span className="text-gray-700">DevOps & Cloud</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-700 rounded-full" />
                <span className="text-gray-700">Bases de Datos</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-700 rounded-full" />
                <span className="text-gray-700">Mejores Prácticas & Patrones</span>
              </div>
            </div>
          </div>

          {/* Newsletter CTA */}
          <NewsletterBox />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;