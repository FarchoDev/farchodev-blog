import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const NewsletterBox = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Por favor ingresa tu email');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API}/newsletter/subscribe`, { email });
      toast.success('¡Suscripción exitosa! Gracias por unirte.');
      setEmail('');
    } catch (error) {
      console.error('Error subscribing:', error);
      toast.error('Error al suscribirse. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-700 to-blue-500 rounded-2xl p-8 text-white" data-testid="newsletter-box">
      <div className="flex items-center justify-center mb-4">
        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
          <Mail size={24} />
        </div>
      </div>
      <h3 className="text-2xl font-bold text-center mb-2" style={{fontFamily: 'Space Grotesk'}}>Suscríbete al Newsletter</h3>
      <p className="text-center text-blue-50 mb-6">Recibe las últimas actualizaciones y artículos directamente en tu inbox</p>
      
      <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3" data-testid="newsletter-form">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@email.com"
          className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
          data-testid="newsletter-email-input"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-white text-blue-700 font-semibold rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50"
          data-testid="newsletter-submit-btn"
        >
          {loading ? 'Suscribiendo...' : 'Suscribirse'}
        </button>
      </form>
    </div>
  );
};

export default NewsletterBox;