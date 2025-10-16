import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PostCard from '../components/PostCard';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Category = () => {
  const { category } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, [category]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/posts?category=${category}`);
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      <Navbar />
      
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4" style={{fontFamily: 'Space Grotesk'}} data-testid="category-title">
              {category}
            </h1>
            <p className="text-lg text-gray-600">Todos los artículos en esta categoría</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="skeleton h-96 rounded-xl" />
              ))}
            </div>
          ) : posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 fade-in" data-testid="category-posts-grid">
              {posts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">No hay artículos en esta categoría</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Category;