import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axios';
import AdminLayout from '../../components/AdminLayout';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get('/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name) {
      toast.error('El nombre de la categoría es requerido');
      return;
    }

    try {
      if (editingCategory) {
        // Update existing category
        await axiosInstance.put(`/admin/categories/${editingCategory.id}`, formData);
        toast.success('Categoría actualizada exitosamente');
      } else {
        // Create new category
        await axiosInstance.post('/admin/categories', formData);
        toast.success('Categoría creada exitosamente');
      }
      
      setFormData({ name: '', description: '' });
      setShowForm(false);
      setEditingCategory(null);
      fetchCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error(editingCategory ? 'Error al actualizar la categoría' : 'Error al crear la categoría');
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (categoryId, categoryName) => {
    if (!window.confirm(`¿Estás seguro de eliminar la categoría "${categoryName}"?`)) {
      return;
    }

    try {
      await axiosInstance.delete(`/admin/categories/${categoryId}`);
      toast.success('Categoría eliminada exitosamente');
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Error al eliminar la categoría');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCategory(null);
    setFormData({ name: '', description: '' });
  };

  return (
    <AdminLayout>
      <div data-testid="admin-categories-page">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900" style={{fontFamily: 'Space Grotesk'}}>Categorías</h1>
          <button 
            onClick={() => setShowForm(!showForm)} 
            className="btn-primary flex items-center"
            data-testid="add-category-btn"
          >
            <Plus size={20} className="mr-2" />
            Nueva Categoría
          </button>
        </div>

        {/* Create/Edit Form */}
        {showForm && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6" data-testid="category-form">
            <h2 className="text-xl font-bold text-gray-900 mb-4" style={{fontFamily: 'Space Grotesk'}}>
              {editingCategory ? 'Editar Categoría' : 'Crear Nueva Categoría'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Nombre *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: Desarrollo Web"
                    data-testid="category-name-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Descripción</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows="2"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Breve descripción de la categoría"
                    data-testid="category-description-input"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button 
                    type="button" 
                    onClick={handleCancel} 
                    className="btn-secondary"
                    data-testid="cancel-category-btn"
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn-primary" data-testid="save-category-btn">
                    {editingCategory ? 'Actualizar Categoría' : 'Crear Categoría'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Categories List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="skeleton h-24 rounded-xl" />
            ))}
          </div>
        ) : categories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="categories-grid">
            {categories.map(category => (
              <div key={category.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow" data-testid={`category-${category.id}`}>
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-gray-900" style={{fontFamily: 'Space Grotesk'}}>{category.name}</h3>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleEdit(category)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Editar categoría"
                      data-testid={`edit-category-${category.id}`}
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(category.id, category.name)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Eliminar categoría"
                      data-testid={`delete-category-${category.id}`}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-3">{category.description || 'Sin descripción'}</p>
                <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                  Slug: {category.slug}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <p className="text-gray-500 mb-4">No hay categorías creadas aún</p>
            <button onClick={() => setShowForm(true)} className="btn-primary inline-flex items-center">
              <Plus size={20} className="mr-2" />
              Crear Primera Categoría
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminCategories;