import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axios';
import AdminLayout from '../../components/AdminLayout';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';

const AdminPostEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    featured_image_url: '',
    category: '',
    tags: '',
    published: false
  });

  useEffect(() => {
    fetchCategories();
    if (isEditMode) {
      fetchPost();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get('/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchPost = async () => {
    try {
      const response = await axiosInstance.get('/admin/posts');
      const post = response.data.find(p => p.id === id);
      
      if (post) {
        setFormData({
          title: post.title,
          content: post.content,
          excerpt: post.excerpt,
          featured_image_url: post.featured_image_url || '',
          category: post.category,
          tags: post.tags.join(', '),
          published: post.published
        });
      } else {
        toast.error('Post no encontrado');
        navigate('/admin/posts');
      }
    } catch (error) {
      console.error('Error fetching post:', error);
      toast.error('Error al cargar el post');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content || !formData.excerpt || !formData.category) {
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(t => t)
      };

      if (isEditMode) {
        await axiosInstance.put(`/admin/posts/${id}`, payload);
        toast.success('Post actualizado exitosamente');
      } else {
        await axiosInstance.post('/admin/posts', payload);
        toast.success('Post creado exitosamente');
      }
      
      navigate('/admin/posts');
    } catch (error) {
      console.error('Error saving post:', error);
      toast.error('Error al guardar el post');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="skeleton h-screen rounded-xl" />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div data-testid="admin-post-editor">
        <Link to="/admin/posts" className="inline-flex items-center text-blue-700 hover:text-blue-800 mb-6" data-testid="back-to-posts">
          <ArrowLeft size={20} className="mr-2" />
          Volver a Posts
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-8" style={{fontFamily: 'Space Grotesk'}}>
          {isEditMode ? 'Editar Post' : 'Crear Nuevo Post'}
        </h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6" data-testid="post-form">
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Título *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ingresa el título del post"
                data-testid="post-title-input"
              />
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Extracto *</label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                rows="2"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Breve descripción del post"
                data-testid="post-excerpt-input"
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Contenido *</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                rows="15"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                placeholder="Escribe el contenido del post (puedes usar Markdown)"
                data-testid="post-content-input"
              />
            </div>

            {/* Category & Featured Image */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Categoría *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  data-testid="post-category-select"
                >
                  <option value="">Selecciona una categoría</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Imagen Destacada (URL)</label>
                <input
                  type="url"
                  value={formData.featured_image_url}
                  onChange={(e) => setFormData({...formData, featured_image_url: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://ejemplo.com/imagen.jpg"
                  data-testid="post-image-input"
                />
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Tags</label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({...formData, tags: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="javascript, react, tutorial (separados por comas)"
                data-testid="post-tags-input"
              />
            </div>

            {/* Published */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="published"
                checked={formData.published}
                onChange={(e) => setFormData({...formData, published: e.target.checked})}
                className="w-5 h-5 text-blue-700 border-gray-300 rounded focus:ring-blue-500"
                data-testid="post-published-checkbox"
              />
              <label htmlFor="published" className="ml-3 text-sm font-medium text-gray-900">
                Publicar inmediatamente
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
              <Link to="/admin/posts" className="btn-secondary" data-testid="cancel-btn">
                Cancelar
              </Link>
              <button 
                type="submit" 
                disabled={saving}
                className="btn-primary flex items-center disabled:opacity-50"
                data-testid="save-post-btn"
              >
                <Save size={20} className="mr-2" />
                {saving ? 'Guardando...' : (isEditMode ? 'Actualizar Post' : 'Crear Post')}
              </button>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AdminPostEditor;