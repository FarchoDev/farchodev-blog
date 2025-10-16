import React, { useState } from 'react';
import { X, Mail, Lock, Github, Chrome, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const LoginModal = ({ isOpen, onClose, onSwitchToRegister }) => {
  const [activeTab, setActiveTab] = useState('local');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      onClose();
      setEmail('');
      setPassword('');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleOAuthComingSoon = (provider) => {
    setError(`${provider} OAuth estará disponible próximamente`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Space Grotesk' }}>
            Iniciar Sesión
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('local')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === 'local'
                ? 'text-teal-700 border-b-2 border-teal-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Email
          </button>
          <button
            onClick={() => setActiveTab('google')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === 'google'
                ? 'text-teal-700 border-b-2 border-teal-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Google
          </button>
          <button
            onClick={() => setActiveTab('github')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === 'github'
                ? 'text-teal-700 border-b-2 border-teal-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            GitHub
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start">
              <AlertCircle className="text-red-600 mr-2 flex-shrink-0" size={20} />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Local Login Tab */}
          {activeTab === 'local' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="tu@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={onSwitchToRegister}
                  className="text-sm text-teal-700 hover:text-teal-800 font-medium"
                >
                  ¿No tienes cuenta? Regístrate
                </button>
              </div>
            </form>
          )}

          {/* Google Tab */}
          {activeTab === 'google' && (
            <div className="space-y-4">
              <button
                onClick={() => handleOAuthComingSoon('Google')}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700"
              >
                <Chrome size={20} />
                Continuar con Google
              </button>
              <p className="text-sm text-gray-500 text-center">
                OAuth de Google estará disponible próximamente
              </p>
            </div>
          )}

          {/* GitHub Tab */}
          {activeTab === 'github' && (
            <div className="space-y-4">
              <button
                onClick={() => handleOAuthComingSoon('GitHub')}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
              >
                <Github size={20} />
                Continuar con GitHub
              </button>
              <p className="text-sm text-gray-500 text-center">
                OAuth de GitHub estará disponible próximamente
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
