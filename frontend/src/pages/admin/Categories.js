import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../../components/AdminLayout';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

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
      const response = await axios.get(`${API}/categories`);
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
      await axios.post(`${API}/admin/categories`, formData);
      toast.success('Categoría creada exitosamente');
      setFormData({ name: '', description: '' });
      setShowForm(false);
      fetchCategories();
    } catch (error) {
      console.error('Error creating category:', error);
      toast.error('Error al crear la categoría');
    }
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

        {/* Create Form */}
        {showForm && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6" data-testid="category-form">
            <h2 className="text-xl font-bold text-gray-900 mb-4" style={{fontFamily: 'Space Grotesk'}}>Crear Nueva Categoría</h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Nombre *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Breve descripción de la categoría"
                    data-testid="category-description-input"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button 
                    type="button" 
                    onClick={() => setShowForm(false)} 
                    className="btn-secondary"
                    data-testid="cancel-category-btn"
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn-primary" data-testid="save-category-btn">
                    Crear Categoría
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
              <div key={category.id} className="bg-white rounded-xl border border-gray-200 p-6" data-testid={`category-${category.id}`}>
                <h3 className="text-xl font-bold text-gray-900 mb-2" style={{fontFamily: 'Space Grotesk'}}>{category.name}</h3>
                <p className="text-gray-600 text-sm mb-3">{category.description || 'Sin descripción'}</p>
                <span className="inline-block px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-xs font-medium">
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