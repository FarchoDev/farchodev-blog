import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axios';
import AdminLayout from '../../components/AdminLayout';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { toast } from 'sonner';

const AdminPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axiosInstance.get('/admin/posts');
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Error al cargar los posts');
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (id, title) => {
    if (!window.confirm(`¿Estás seguro de eliminar "${title}"?`)) return;

    try {
      await axiosInstance.delete(`/admin/posts/${id}`);
      toast.success('Post eliminado exitosamente');
      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Error al eliminar el post');
    }
  };

  return (
    <AdminLayout>
      <div data-testid="admin-posts-page">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900" style={{fontFamily: 'Space Grotesk'}}>Gestionar Posts</h1>
          <Link to="/admin/posts/new" className="btn-primary flex items-center" data-testid="create-post-btn">
            <Plus size={20} className="mr-2" />
            Nuevo Post
          </Link>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="skeleton h-24 rounded-xl" />
            ))}
          </div>
        ) : posts.length > 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full" data-testid="posts-table">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Título</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Categoría</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Estado</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Vistas</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {posts.map(post => (
                  <tr key={post.id} className="hover:bg-gray-50" data-testid={`post-row-${post.id}`}>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-900">{post.title}</p>
                        <p className="text-sm text-gray-500 line-clamp-1">{post.excerpt}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{post.category}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        post.published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {post.published ? 'Publicado' : 'Borrador'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      <span className="flex items-center">
                        <Eye size={16} className="mr-1" />
                        {post.views_count}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end space-x-2">
                        <Link
                          to={`/admin/posts/edit/${post.id}`}
                          className="p-2 text-teal-700 hover:bg-teal-50 rounded-lg transition-colors"
                          data-testid={`edit-btn-${post.id}`}
                        >
                          <Edit size={18} />
                        </Link>
                        <button
                          onClick={() => deletePost(post.id, post.title)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          data-testid={`delete-btn-${post.id}`}
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
            <p className="text-gray-500 mb-4">No hay posts creados aún</p>
            <Link to="/admin/posts/new" className="btn-primary inline-flex items-center">
              <Plus size={20} className="mr-2" />
              Crear Primer Post
            </Link>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminPosts;