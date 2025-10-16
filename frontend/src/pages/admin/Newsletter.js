import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axios';
import AdminLayout from '../../components/AdminLayout';
import { Mail, Download } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const AdminNewsletter = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      // Get all newsletter subscriptions
      const response = await axiosInstance.get('/admin/stats');
      // Note: In a real implementation, you'd have a dedicated endpoint for subscribers
      // For now, we'll show stats
      setLoading(false);
    } catch (error) {
      console.error('Error fetching subscribers:', error);
      setLoading(false);
    }
  };

  const exportSubscribers = () => {
    // In a real implementation, this would generate a CSV file
    console.log('Exporting subscribers...');
  };

  return (
    <AdminLayout>
      <div data-testid="admin-newsletter-page">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900" style={{fontFamily: 'Space Grotesk'}}>Newsletter</h1>
          <button 
            onClick={exportSubscribers}
            className="btn-secondary flex items-center"
            data-testid="export-subscribers-btn"
          >
            <Download size={20} className="mr-2" />
            Exportar Suscriptores
          </button>
        </div>

        {/* Stats Card */}
        <div className="bg-gradient-to-br from-teal-700 to-teal-500 rounded-2xl p-8 text-white mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <Mail size={32} />
            </div>
            <div>
              <h2 className="text-4xl font-bold">--</h2>
              <p className="text-teal-50">Suscriptores Activos</p>
            </div>
          </div>
          <p className="text-teal-50">
            Gestiona tu lista de suscriptores y mantén informada a tu comunidad sobre nuevos artículos.
          </p>
        </div>

        {/* Info Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4" style={{fontFamily: 'Space Grotesk'}}>Acerca del Newsletter</h3>
          <p className="text-gray-700 mb-4">
            Los suscriptores del newsletter recibirán notificaciones sobre nuevos artículos y actualizaciones del blog.
          </p>
          <div className="space-y-2 text-sm text-gray-600">
            <p>• Los usuarios pueden suscribirse desde cualquier página del blog</p>
            <p>• Todos los emails son verificados automáticamente</p>
            <p>• Los suscriptores pueden darse de baja en cualquier momento</p>
          </div>
        </div>

        {/* Placeholder for future subscriber list */}
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center mt-8">
          <Mail size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 mb-2">Lista de suscriptores</p>
          <p className="text-sm text-gray-400">Los suscriptores aparecerán aquí cuando se registren</p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminNewsletter;