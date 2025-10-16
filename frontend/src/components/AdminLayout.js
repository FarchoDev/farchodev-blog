import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, FolderOpen, MessageSquare, Mail, ArrowLeft } from 'lucide-react';

const AdminLayout = ({ children }) => {
  const location = useLocation();

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/posts', label: 'Posts', icon: FileText },
    { path: '/admin/categories', label: 'Categorías', icon: FolderOpen },
    { path: '/admin/comments', label: 'Comentarios', icon: MessageSquare },
    { path: '/admin/newsletter', label: 'Newsletter', icon: Mail },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50" data-testid="admin-layout">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-gray-900 text-white p-6">
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-700 to-teal-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">F</span>
            </div>
            <span className="text-xl font-bold" style={{fontFamily: 'Space Grotesk'}}>FarchoDev</span>
          </div>
          <p className="text-gray-400 text-sm">Panel de Administración</p>
        </div>

        <nav className="space-y-2">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'bg-teal-700 text-white'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
                data-testid={`admin-nav-${item.label.toLowerCase()}`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <Link
            to="/"
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
            data-testid="admin-back-to-site"
          >
            <ArrowLeft size={18} />
            <span>Volver al Sitio</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;