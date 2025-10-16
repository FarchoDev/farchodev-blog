import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import NewsletterBox from '../components/NewsletterBox';
import { Calendar, Clock, Eye, ArrowLeft, Share2, Facebook, Twitter, Linkedin, Heart, Bookmark, Edit2, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const PostDetail = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentForm, setCommentForm] = useState({
    author_name: '',
    author_email: '',
    content: ''
  });
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    fetchPost();
  }, [slug]);

  const fetchPost = async () => {
    try {
      const response = await axios.get(`${API}/posts/${slug}`);
      setPost(response.data);
      
      // Increment view count
      await axios.post(`${API}/posts/${response.data.id}/view`);
      
      // Fetch comments
      const commentsResponse = await axios.get(`${API}/posts/${response.data.id}/comments`);
      setComments(commentsResponse.data);
    } catch (error) {
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    
    if (!commentForm.author_name || !commentForm.author_email || !commentForm.content) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    setSubmittingComment(true);
    try {
      await axios.post(`${API}/comments`, {
        ...commentForm,
        post_id: post.id
      });
      toast.success('Comentario enviado. Estará visible después de la aprobación.');
      setCommentForm({ author_name: '', author_email: '', content: '' });
    } catch (error) {
      console.error('Error submitting comment:', error);
      toast.error('Error al enviar el comentario');
    } finally {
      setSubmittingComment(false);
    }
  };

  const sharePost = (platform) => {
    const url = window.location.href;
    const text = post.title;
    
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    };

    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAF9]">
        <Navbar />
        <div className="pt-24 pb-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="skeleton h-12 w-3/4 mb-4" />
            <div className="skeleton h-64 mb-8" />
            <div className="skeleton h-96" />
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[#FAFAF9]">
        <Navbar />
        <div className="pt-24 pb-16 px-4 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Artículo no encontrado</h1>
          <Link to="/blog" className="text-teal-700 hover:text-teal-800">Volver al blog</Link>
        </div>
      </div>
    );
  }

  const publishedDate = post.published_at ? new Date(post.published_at) : new Date(post.created_at);

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      <Navbar />
      
      <article className="pt-24 pb-16 px-4" data-testid="post-detail">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link to="/blog" className="inline-flex items-center text-teal-700 hover:text-teal-800 mb-8" data-testid="back-to-blog">
            <ArrowLeft size={20} className="mr-2" />
            Volver al blog
          </Link>

          {/* Post Header */}
          <div className="mb-8">
            <span className="tag" data-testid="post-category">{post.category}</span>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mt-4 mb-6" style={{fontFamily: 'Space Grotesk'}} data-testid="post-title">{post.title}</h1>
            
            <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-6">
              <span className="flex items-center" data-testid="post-date">
                <Calendar size={18} className="mr-2" />
                {format(publishedDate, "d 'de' MMMM, yyyy", { locale: es })}
              </span>
              <span className="flex items-center" data-testid="post-reading-time">
                <Clock size={18} className="mr-2" />
                {post.reading_time} min de lectura
              </span>
              <span className="flex items-center" data-testid="post-views">
                <Eye size={18} className="mr-2" />
                {post.views_count} vistas
              </span>
            </div>

            {/* Share Buttons */}
            <div className="flex items-center gap-3" data-testid="share-buttons">
              <span className="text-sm text-gray-600 flex items-center">
                <Share2 size={18} className="mr-2" />
                Compartir:
              </span>
              <button onClick={() => sharePost('facebook')} className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors" data-testid="share-facebook">
                <Facebook size={18} />
              </button>
              <button onClick={() => sharePost('twitter')} className="p-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors" data-testid="share-twitter">
                <Twitter size={18} />
              </button>
              <button onClick={() => sharePost('linkedin')} className="p-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors" data-testid="share-linkedin">
                <Linkedin size={18} />
              </button>
            </div>
          </div>

          {/* Featured Image */}
          {post.featured_image_url && (
            <img 
              src={post.featured_image_url} 
              alt={post.title}
              className="w-full h-96 object-cover rounded-2xl mb-8"
              data-testid="post-featured-image"
            />
          )}

          {/* Post Content */}
          <div className="prose max-w-none mb-12" data-testid="post-content">
            {post.content.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4 text-gray-800 leading-relaxed">{paragraph}</p>
            ))}
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mb-12" data-testid="post-tags">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags:</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <span key={index} className="tag">{tag}</span>
                ))}
              </div>
            </div>
          )}

          {/* Comments Section */}
          <div className="border-t border-gray-200 pt-12" data-testid="comments-section">
            <h3 className="text-2xl font-bold text-gray-900 mb-6" style={{fontFamily: 'Space Grotesk'}}>Comentarios ({comments.length})</h3>
            
            {/* Comment Form */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 mb-8">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Deja un comentario</h4>
              <form onSubmit={handleCommentSubmit} data-testid="comment-form">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="Tu nombre"
                    value={commentForm.author_name}
                    onChange={(e) => setCommentForm({...commentForm, author_name: e.target.value})}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    data-testid="comment-name-input"
                  />
                  <input
                    type="email"
                    placeholder="Tu email"
                    value={commentForm.author_email}
                    onChange={(e) => setCommentForm({...commentForm, author_email: e.target.value})}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    data-testid="comment-email-input"
                  />
                </div>
                <textarea
                  placeholder="Escribe tu comentario..."
                  value={commentForm.content}
                  onChange={(e) => setCommentForm({...commentForm, content: e.target.value})}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 mb-4"
                  data-testid="comment-content-input"
                />
                <button 
                  type="submit" 
                  disabled={submittingComment}
                  className="btn-primary disabled:opacity-50"
                  data-testid="comment-submit-btn"
                >
                  {submittingComment ? 'Enviando...' : 'Enviar Comentario'}
                </button>
              </form>
            </div>

            {/* Comments List */}
            <div className="space-y-6" data-testid="comments-list">
              {comments.map(comment => (
                <div key={comment.id} className="bg-white rounded-xl p-6 border border-gray-200" data-testid={`comment-${comment.id}`}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-gray-900">{comment.author_name}</span>
                    <span className="text-sm text-gray-500">
                      {format(new Date(comment.created_at), "d 'de' MMMM, yyyy", { locale: es })}
                    </span>
                  </div>
                  <p className="text-gray-700">{comment.content}</p>
                </div>
              ))}
              {comments.length === 0 && (
                <p className="text-center text-gray-500">Aún no hay comentarios. ¡Sé el primero en comentar!</p>
              )}
            </div>
          </div>
        </div>
      </article>

      {/* Newsletter */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <NewsletterBox />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PostDetail;