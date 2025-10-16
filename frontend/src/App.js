import React from 'react';
import '@/App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Blog from './pages/Blog';
import PostDetail from './pages/PostDetail';
import Category from './pages/Category';
import About from './pages/About';
import AdminDashboard from './pages/admin/Dashboard';
import AdminPosts from './pages/admin/Posts';
import AdminPostEditor from './pages/admin/PostEditor';
import AdminCategories from './pages/admin/Categories';
import AdminComments from './pages/admin/Comments';
import AdminNewsletter from './pages/admin/Newsletter';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/post/:slug" element={<PostDetail />} />
            <Route path="/category/:category" element={<Category />} />
            <Route path="/about" element={<About />} />
            
            {/* Admin Routes - Protected */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/posts" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminPosts />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/posts/new" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminPostEditor />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/posts/edit/:id" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminPostEditor />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/categories" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminCategories />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/comments" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminComments />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/newsletter" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminNewsletter />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;