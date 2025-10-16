import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../../components/AdminLayout';
import { FileText, MessageSquare, Mail, Eye, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, postsRes] = await Promise.all([
        axios.get(`${API}/admin/stats`),
        axios.get(`${API}/admin/posts`)
      ]);
      setStats(statsRes.data);
      setRecentPosts(postsRes.data.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div data-testid="admin-dashboard">
        <h1 className="text-3xl font-bold text-gray-900 mb-8" style={{fontFamily: 'Space Grotesk'}}>Dashboard</h1>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="skeleton h-32 rounded-xl" />
            ))}
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 border border-gray-200" data-testid="stat-total-posts">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                    <FileText size={24} className="text-teal-700" />
                  </div>
                  <span className="text-sm text-gray-500">Total</span>
                </div>
                <h3 className="text-3xl font-bold text-gray-900">{stats.total_posts}</h3>
                <p className="text-sm text-gray-600 mt-1">Posts</p>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200" data-testid="stat-pending-comments">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <MessageSquare size={24} className="text-orange-500" />
                  </div>
                  <span className="text-sm text-gray-500">Pendientes</span>
                </div>
                <h3 className="text-3xl font-bold text-gray-900">{stats.pending_comments}</h3>
                <p className="text-sm text-gray-600 mt-1">Comentarios</p>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200" data-testid="stat-subscribers">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Mail size={24} className="text-blue-600" />
                  </div>
                  <span className="text-sm text-gray-500">Activos</span>
                </div>
                <h3 className="text-3xl font-bold text-gray-900">{stats.total_subscribers}</h3>
                <p className="text-sm text-gray-600 mt-1">Suscriptores</p>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200" data-testid="stat-total-views">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Eye size={24} className="text-purple-600" />
                  </div>
                  <span className="text-sm text-gray-500">Total</span>
                </div>
                <h3 className="text-3xl font-bold text-gray-900">{stats.total_views}</h3>
                <p className="text-sm text-gray-600 mt-1">Vistas</p>
              </div>
            </div>

            {/* Recent Posts */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900" style={{fontFamily: 'Space Grotesk'}}>Posts Recientes</h2>
                <Link to="/admin/posts" className="text-teal-700 hover:text-teal-800 font-medium" data-testid="view-all-posts-link">
                  Ver todos
                </Link>
              </div>
              <div className="space-y-4">
                {recentPosts.map(post => (
                  <div key={post.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg" data-testid={`recent-post-${post.id}`}>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{post.title}</h3>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          post.published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {post.published ? 'Publicado' : 'Borrador'}
                        </span>
                        <span>{post.category}</span>
                        <span className="flex items-center">
                          <Eye size={14} className="mr-1" />
                          {post.views_count}
                        </span>
                      </div>
                    </div>
                    <Link 
                      to={`/admin/posts/edit/${post.id}`}
                      className="btn-primary text-sm px-4 py-2"
                      data-testid={`edit-post-${post.id}`}
                    >
                      Editar
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;