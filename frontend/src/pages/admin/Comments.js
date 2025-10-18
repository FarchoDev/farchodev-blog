import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axios';
import AdminLayout from '../../components/AdminLayout';
import { Check, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'sonner';

const AdminComments = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, approved

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const response = await axiosInstance.get('/admin/comments');
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const approveComment = async (id) => {
    try {
      await axiosInstance.put(`/admin/comments/${id}/approve`);
      toast.success('Comentario aprobado');
      fetchComments();
    } catch (error) {
      console.error('Error approving comment:', error);
      toast.error('Error al aprobar el comentario');
    }
  };

  const deleteComment = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este comentario?')) return;

    try {
      await axiosInstance.delete(`/admin/comments/${id}`);
      toast.success('Comentario eliminado');
      fetchComments();
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('Error al eliminar el comentario');
    }
  };

  const filteredComments = comments.filter(comment => {
    if (filter === 'pending') return !comment.approved;
    if (filter === 'approved') return comment.approved;
    return true;
  });

  const pendingCount = comments.filter(c => !c.approved).length;

  return (
    <AdminLayout>
      <div data-testid="admin-comments-page">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900" style={{fontFamily: 'Space Grotesk'}}>Comentarios</h1>
            {pendingCount > 0 && (
              <p className="text-orange-600 mt-1">{pendingCount} comentarios pendientes de aprobación</p>
            )}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-2 mb-6" data-testid="comment-filters">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all' ? 'bg-teal-700 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            data-testid="filter-all"
          >
            Todos ({comments.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'pending' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            data-testid="filter-pending"
          >
            Pendientes ({pendingCount})
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'approved' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            data-testid="filter-approved"
          >
            Aprobados ({comments.length - pendingCount})
          </button>
        </div>

        {/* Comments List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="skeleton h-32 rounded-xl" />
            ))}
          </div>
        ) : filteredComments.length > 0 ? (
          <div className="space-y-4" data-testid="comments-list">
            {filteredComments.map(comment => (
              <div 
                key={comment.id} 
                className="bg-white rounded-xl border border-gray-200 p-6"
                data-testid={`comment-${comment.id}`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center space-x-3 mb-1">
                      <span className="font-semibold text-gray-900">{comment.author_name}</span>
                      <span className="text-sm text-gray-500">{comment.author_email}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        comment.approved ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                      }`}>
                        {comment.approved ? 'Aprobado' : 'Pendiente'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      {format(new Date(comment.created_at), "d 'de' MMMM, yyyy 'a las' HH:mm", { locale: es })}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    {!comment.approved && (
                      <button
                        onClick={() => approveComment(comment.id)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        data-testid={`approve-btn-${comment.id}`}
                      >
                        <Check size={18} />
                      </button>
                    )}
                    <button
                      onClick={() => deleteComment(comment.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      data-testid={`delete-comment-btn-${comment.id}`}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <p className="text-gray-700 mb-3">{comment.content}</p>
                <p className="text-sm text-gray-500">Post ID: {comment.post_id}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <p className="text-gray-500">
              {filter === 'all' ? 'No hay comentarios aún' : `No hay comentarios ${filter === 'pending' ? 'pendientes' : 'aprobados'}`}
            </p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminComments;