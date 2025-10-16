import React from 'react';
import '@/App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/post/:slug" element={<PostDetail />} />
          <Route path="/category/:category" element={<Category />} />
          <Route path="/about" element={<About />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/posts" element={<AdminPosts />} />
          <Route path="/admin/posts/new" element={<AdminPostEditor />} />
          <Route path="/admin/posts/edit/:id" element={<AdminPostEditor />} />
          <Route path="/admin/categories" element={<AdminCategories />} />
          <Route path="/admin/comments" element={<AdminComments />} />
          <Route path="/admin/newsletter" element={<AdminNewsletter />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;