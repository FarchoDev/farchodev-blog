import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axios';
import AdminLayout from '../../components/AdminLayout';
import { Mail, Download, Trash2, Eye, EyeOff, UserCheck, UserX } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'sonner';

const AdminNewsletter = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [filter, setFilter] = useState('all'); // all, active, inactive

  useEffect(() => {
    fetchSubscribers();
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axiosInstance.get('/admin/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchSubscribers = async () => {
    try {
      const response = await axiosInstance.get('/admin/newsletter/subscribers');
      setSubscribers(response.data);
    } catch (error) {
      console.error('Error fetching subscribers:', error);
      toast.error('Error al cargar los suscriptores');
    } finally {
      setLoading(false);
    }
  };

  const exportSubscribers = async () => {
    try {
      const response = await axiosInstance.get('/admin/newsletter/export', {
        responseType: 'blob'
      });
      
      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `newsletter_subscribers_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success('Suscriptores exportados exitosamente');
    } catch (error) {
      console.error('Error exporting subscribers:', error);
      toast.error('Error al exportar suscriptores');
    }
  };

  const deleteSubscriber = async (email) => {
    if (!window.confirm(`¿Estás seguro de eliminar a ${email} de la lista?`)) {
      return;
    }

    try {
      await axiosInstance.delete(`/admin/newsletter/subscribers/${encodeURIComponent(email)}`);
      toast.success('Suscriptor eliminado exitosamente');
      fetchSubscribers();
      fetchStats();
    } catch (error) {
      console.error('Error deleting subscriber:', error);
      toast.error('Error al eliminar suscriptor');
    }
  };

  const toggleSubscriberStatus = async (email) => {
    try {
      const response = await axiosInstance.put(`/admin/newsletter/subscribers/${encodeURIComponent(email)}/toggle`);
      toast.success(response.data.message);
      fetchSubscribers();
      fetchStats();
    } catch (error) {
      console.error('Error toggling subscriber:', error);
      toast.error('Error al cambiar estado del suscriptor');
    }
  };

  const filteredSubscribers = subscribers.filter(sub => {
    if (filter === 'active') return sub.active;
    if (filter === 'inactive') return !sub.active;
    return true;
  });

  const activeCount = subscribers.filter(s => s.active).length;
  const inactiveCount = subscribers.length - activeCount;

  return (
    <AdminLayout>
      <div data-testid="admin-newsletter-page">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900" style={{fontFamily: 'Space Grotesk'}}>Newsletter</h1>
          <button 
            onClick={exportSubscribers}
            className="btn-secondary flex items-center"
            data-testid="export-subscribers-btn"
            disabled={subscribers.length === 0}
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
              <h2 className="text-4xl font-bold">{stats?.total_subscribers || 0}</h2>
              <p className="text-teal-50">Suscriptores Activos</p>
            </div>
          </div>
          <div className="flex gap-6 text-teal-50">
            <div>
              <span className="font-semibold">{activeCount}</span> Activos
            </div>
            <div>
              <span className="font-semibold">{inactiveCount}</span> Inactivos
            </div>
            <div>
              <span className="font-semibold">{subscribers.length}</span> Total
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        {subscribers.length > 0 && (
          <div className="flex space-x-2 mb-6" data-testid="subscriber-filters">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all' ? 'bg-teal-700 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todos ({subscribers.length})
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'active' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <UserCheck size={16} className="inline mr-1" />
              Activos ({activeCount})
            </button>
            <button
              onClick={() => setFilter('inactive')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'inactive' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <UserX size={16} className="inline mr-1" />
              Inactivos ({inactiveCount})
            </button>
          </div>
        )}

        {/* Subscribers List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="skeleton h-20 rounded-xl" />
            ))}
          </div>
        ) : filteredSubscribers.length > 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full" data-testid="subscribers-table">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Fecha de Suscripción</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Estado</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredSubscribers.map(subscriber => (
                  <tr key={subscriber.id} className="hover:bg-gray-50" data-testid={`subscriber-${subscriber.id}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <Mail size={16} className="text-gray-400 mr-2" />
                        <span className="font-medium text-gray-900">{subscriber.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {subscriber.subscribed_at 
                        ? format(new Date(subscriber.subscribed_at), "d 'de' MMMM, yyyy 'a las' HH:mm", { locale: es })
                        : 'Fecha no disponible'
                      }
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        subscriber.active 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-orange-100 text-orange-700'
                      }`}>
                        {subscriber.active ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => toggleSubscriberStatus(subscriber.email)}
                          className={`p-2 rounded-lg transition-colors ${
                            subscriber.active
                              ? 'text-orange-600 hover:bg-orange-50'
                              : 'text-green-600 hover:bg-green-50'
                          }`}
                          title={subscriber.active ? 'Desactivar' : 'Activar'}
                          data-testid={`toggle-btn-${subscriber.id}`}
                        >
                          {subscriber.active ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                        <button
                          onClick={() => deleteSubscriber(subscriber.email)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Eliminar"
                          data-testid={`delete-btn-${subscriber.id}`}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <Mail size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 mb-2">
              {filter === 'all' 
                ? 'No hay suscriptores aún' 
                : `No hay suscriptores ${filter === 'active' ? 'activos' : 'inactivos'}`
              }
            </p>
            <p className="text-sm text-gray-400">
              Los suscriptores aparecerán aquí cuando se registren desde el blog
            </p>
          </div>
        )}

        {/* Info Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 mt-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4" style={{fontFamily: 'Space Grotesk'}}>Acerca del Newsletter</h3>
          <p className="text-gray-700 mb-4">
            Los suscriptores del newsletter recibirán notificaciones sobre nuevos artículos y actualizaciones del blog.
          </p>
          <div className="space-y-2 text-sm text-gray-600">
            <p>• Los usuarios pueden suscribirse desde cualquier página del blog</p>
            <p>• Puedes activar/desactivar suscriptores sin eliminarlos</p>
            <p>• Exporta la lista en formato CSV para usar en otras plataformas</p>
            <p>• Los suscriptores inactivos no recibirán emails</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminNewsletter;