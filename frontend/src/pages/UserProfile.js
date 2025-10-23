import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Button } from '../components/ui/button';
import { 
  User, 
  Bookmark, 
  MessageSquare, 
  Activity, 
  Mail, 
  Globe, 
  Github, 
  Linkedin,
  Twitter,
  Heart,
  Calendar,
  Edit2,
  Save,
  X
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const UserProfile = () => {
  const { user, isAuthenticated } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'info';
  
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [activity, setActivity] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    bio: '',
    website: '',
    github: '',
    linkedin: '',
    twitter: ''
  });

  useEffect(() => {
    if (isAuthenticated) {
      fetchProfile();
      fetchActivity();
      if (activeTab === 'bookmarks') {
        fetchBookmarks();
      }
    }
  }, [isAuthenticated, activeTab]);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${API}/users/profile`, {
        withCredentials: true
      });
      setProfile(response.data);
      setProfileForm({
        bio: response.data.bio || '',
        website: response.data.website_url || '',
        github: response.data.github_url || '',
        linkedin: response.data.linkedin_url || '',
        twitter: response.data.twitter_url || ''
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Error al cargar el perfil');
    }
  };

  const fetchActivity = async () => {
    try {
      const response = await axios.get(`${API}/users/activity`, {
        withCredentials: true
      });
      setActivity(response.data);
    } catch (error) {
      console.error('Error fetching activity:', error);
      toast.error('Error al cargar la actividad');
    } finally {
      setLoading(false);
    }
  };

  const fetchBookmarks = async () => {
    try {
      const response = await axios.get(`${API}/bookmarks`, {
        withCredentials: true
      });
      setBookmarks(response.data);
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
      toast.error('Error al cargar guardados');
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    
    try {
      // Build update object with only non-empty fields
      const updateData = {};
      
      if (profileForm.bio !== undefined && profileForm.bio !== null) {
        updateData.bio = profileForm.bio;
      }
      if (profileForm.website) {
        updateData.website_url = profileForm.website;
      }
      if (profileForm.github) {
        updateData.github_url = profileForm.github;
      }
      if (profileForm.linkedin) {
        updateData.linkedin_url = profileForm.linkedin;
      }
      if (profileForm.twitter) {
        updateData.twitter_url = profileForm.twitter;
      }
      
      const response = await axios.put(`${API}/users/profile`, 
        updateData,
        { withCredentials: true }
      );
      
      setProfile(response.data);
      setIsEditingProfile(false);
      toast.success('Perfil actualizado exitosamente');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Error al actualizar el perfil');
    }
  };

  const removeBookmark = async (postId) => {
    try {
      await axios.delete(`${API}/bookmarks/${postId}`, {
        withCredentials: true
      });
      setBookmarks(bookmarks.filter(b => b.id !== postId));
      toast.success('Post removido de guardados');
    } catch (error) {
      console.error('Error removing bookmark:', error);
      toast.error('Error al remover bookmark');
    }
  };

  const handleTabChange = (value) => {
    setSearchParams({ tab: value });
    if (value === 'bookmarks' && bookmarks.length === 0) {
      fetchBookmarks();
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FAFAF9]">
        <Navbar />
        <div className="pt-24 pb-16 px-4 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Acceso Denegado</h1>
          <p className="text-gray-600 mb-6">Debes iniciar sesión para ver tu perfil</p>
          <Link to="/" className="text-teal-700 hover:text-teal-800 font-semibold">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAF9]">
        <Navbar />
        <div className="pt-24 pb-16 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="skeleton h-12 w-64 mb-8" />
            <div className="skeleton h-96" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      <Navbar />
      
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Profile Header */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200 mb-8">
            <div className="flex items-start gap-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-teal-500 to-teal-700 text-white flex items-center justify-center text-3xl font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2" style={{fontFamily: 'Space Grotesk'}}>
                  {user?.name}
                </h1>
                <p className="text-gray-600 flex items-center gap-2 mb-4">
                  <Mail size={16} />
                  {user?.email}
                </p>
                <div className="flex flex-wrap gap-4">
                  {activity && (
                    <>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Heart size={16} />
                        <span><span className="font-semibold text-gray-900">{activity.total_likes}</span> likes</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Bookmark size={16} />
                        <span><span className="font-semibold text-gray-900">{activity.total_bookmarks}</span> guardados</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MessageSquare size={16} />
                        <span><span className="font-semibold text-gray-900">{activity.total_comments}</span> comentarios</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="info" className="flex items-center gap-2">
                <User size={18} />
                <span className="hidden sm:inline">Información</span>
              </TabsTrigger>
              <TabsTrigger value="bookmarks" className="flex items-center gap-2">
                <Bookmark size={18} />
                <span className="hidden sm:inline">Guardados</span>
              </TabsTrigger>
              <TabsTrigger value="comments" className="flex items-center gap-2">
                <MessageSquare size={18} />
                <span className="hidden sm:inline">Comentarios</span>
              </TabsTrigger>
              <TabsTrigger value="activity" className="flex items-center gap-2">
                <Activity size={18} />
                <span className="hidden sm:inline">Actividad</span>
              </TabsTrigger>
            </TabsList>

            {/* Info Tab */}
            <TabsContent value="info">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Información Personal</CardTitle>
                      <CardDescription>Actualiza tu perfil y redes sociales</CardDescription>
                    </div>
                    {!isEditingProfile && (
                      <Button 
                        onClick={() => setIsEditingProfile(true)}
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <Edit2 size={16} />
                        Editar
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {isEditingProfile ? (
                    <form onSubmit={handleProfileUpdate} className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Biografía
                        </label>
                        <Textarea
                          value={profileForm.bio}
                          onChange={(e) => setProfileForm({...profileForm, bio: e.target.value})}
                          placeholder="Cuéntanos sobre ti..."
                          rows={4}
                          className="w-full"
                        />
                      </div>

                      <div className="space-y-4">
                        <h3 className="font-semibold text-gray-900">Redes Sociales</h3>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <Globe size={16} />
                            Website
                          </label>
                          <Input
                            type="url"
                            value={profileForm.website}
                            onChange={(e) => setProfileForm({...profileForm, website: e.target.value})}
                            placeholder="https://tuwebsite.com"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <Github size={16} />
                            GitHub
                          </label>
                          <Input
                            type="text"
                            value={profileForm.github}
                            onChange={(e) => setProfileForm({...profileForm, github: e.target.value})}
                            placeholder="username"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <Linkedin size={16} />
                            LinkedIn
                          </label>
                          <Input
                            type="text"
                            value={profileForm.linkedin}
                            onChange={(e) => setProfileForm({...profileForm, linkedin: e.target.value})}
                            placeholder="username"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <Twitter size={16} />
                            Twitter
                          </label>
                          <Input
                            type="text"
                            value={profileForm.twitter}
                            onChange={(e) => setProfileForm({...profileForm, twitter: e.target.value})}
                            placeholder="@username"
                          />
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Button type="submit" className="flex items-center gap-2">
                          <Save size={16} />
                          Guardar Cambios
                        </Button>
                        <Button 
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setIsEditingProfile(false);
                            setProfileForm({
                              bio: profile?.bio || '',
                              website: profile?.website_url || '',
                              github: profile?.github_url || '',
                              linkedin: profile?.linkedin_url || '',
                              twitter: profile?.twitter_url || ''
                            });
                          }}
                          className="flex items-center gap-2"
                        >
                          <X size={16} />
                          Cancelar
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Biografía</h3>
                        <p className="text-gray-700">
                          {profile?.bio || 'No has agregado una biografía aún.'}
                        </p>
                      </div>

                      {(profile?.website_url || profile?.github_url || profile?.linkedin_url || profile?.twitter_url) && (
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-3">Redes Sociales</h3>
                          <div className="flex flex-wrap gap-3">
                            {profile.website_url && (
                              <a 
                                href={profile.website_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                              >
                                <Globe size={18} />
                                Website
                              </a>
                            )}
                            {profile.github_url && (
                              <a 
                                href={profile.github_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                              >
                                <Github size={18} />
                                GitHub
                              </a>
                            )}
                            {profile.linkedin_url && (
                              <a 
                                href={profile.linkedin_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                              >
                                <Linkedin size={18} />
                                LinkedIn
                              </a>
                            )}
                            {profile.twitter_url && (
                              <a 
                                href={profile.twitter_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                              >
                                <Twitter size={18} />
                                Twitter
                              </a>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Bookmarks Tab */}
            <TabsContent value="bookmarks">
              <Card>
                <CardHeader>
                  <CardTitle>Posts Guardados</CardTitle>
                  <CardDescription>Tus artículos guardados para leer después</CardDescription>
                </CardHeader>
                <CardContent>
                  {bookmarks.length === 0 ? (
                    <div className="text-center py-12">
                      <Bookmark size={48} className="mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600">No tienes posts guardados aún</p>
                      <Link to="/blog" className="text-teal-700 hover:text-teal-800 font-semibold mt-4 inline-block">
                        Explorar artículos
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {bookmarks.map(post => (
                        <div 
                          key={post.id} 
                          className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:border-teal-300 transition-all"
                        >
                          {post.featured_image_url && (
                            <img 
                              src={post.featured_image_url} 
                              alt={post.title}
                              className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <Link 
                              to={`/post/${post.slug}`}
                              className="text-lg font-semibold text-gray-900 hover:text-teal-700 block mb-2"
                            >
                              {post.title}
                            </Link>
                            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                              {post.excerpt}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <Calendar size={14} />
                                {format(new Date(post.created_at), "d 'de' MMM, yyyy", { locale: es })}
                              </span>
                              <span className="tag">{post.category}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => removeBookmark(post.id)}
                            className="flex-shrink-0 p-2 text-gray-600 hover:text-red-600 transition-colors"
                            title="Remover de guardados"
                          >
                            <X size={20} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Comments Tab */}
            <TabsContent value="comments">
              <Card>
                <CardHeader>
                  <CardTitle>Mis Comentarios</CardTitle>
                  <CardDescription>Todos los comentarios que has escrito</CardDescription>
                </CardHeader>
                <CardContent>
                  {activity?.recent_comments && activity.recent_comments.length > 0 ? (
                    <div className="space-y-4">
                      {activity.recent_comments.map(comment => (
                        <div 
                          key={comment.id} 
                          className={`p-4 border rounded-lg transition-all ${
                            comment.post_exists 
                              ? 'border-gray-200 hover:border-teal-300 cursor-pointer' 
                              : 'border-gray-300 bg-gray-50'
                          }`}
                          onClick={() => {
                            if (comment.post_exists && comment.post_slug) {
                              window.location.href = `/post/${comment.post_slug}`;
                            }
                          }}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              {comment.post_exists ? (
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-sm font-semibold text-gray-900">
                                    {comment.post_title}
                                  </span>
                                  {!comment.post_published && (
                                    <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                                      No publicado
                                    </span>
                                  )}
                                </div>
                              ) : (
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-sm font-semibold text-gray-500">
                                    {comment.post_title}
                                  </span>
                                  <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full flex items-center gap-1">
                                    <X size={12} />
                                    Eliminado
                                  </span>
                                </div>
                              )}
                              <p className="text-xs text-gray-500">
                                {format(new Date(comment.created_at), "d 'de' MMMM, yyyy 'a las' HH:mm", { locale: es })}
                                {comment.updated_at && comment.updated_at !== comment.created_at && ' (editado)'}
                              </p>
                            </div>
                            {comment.post_exists && comment.post_slug && (
                              <span className="text-teal-600 text-sm font-medium">
                                Ver post →
                              </span>
                            )}
                          </div>
                          <p className="text-gray-700 bg-white p-3 rounded-lg border border-gray-100">
                            "{comment.content}"
                          </p>
                          {!comment.post_exists && (
                            <p className="text-xs text-gray-500 mt-2 italic">
                              El post al que pertenece este comentario ha sido eliminado
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <MessageSquare size={48} className="mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600">No has escrito comentarios aún</p>
                      <Link to="/blog" className="text-teal-700 hover:text-teal-800 font-semibold mt-4 inline-block">
                        Explorar artículos
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Likes Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart size={20} className="text-red-500" />
                      Posts con Like
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {activity?.recent_likes && activity.recent_likes.length > 0 ? (
                      <div className="space-y-3">
                        {activity.recent_likes.map(like => (
                          <Link
                            key={like.id}
                            to={`/post/${like.post_slug}`}
                            className="block p-3 border border-gray-200 rounded-lg hover:border-red-300 transition-all"
                          >
                            <h4 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                              {like.post_title}
                            </h4>
                            <p className="text-xs text-gray-500">
                              {format(new Date(like.created_at), "d 'de' MMM", { locale: es })}
                            </p>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 text-center py-8">
                        No has dado like a ningún post
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Recent Bookmarks Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bookmark size={20} className="text-teal-600" />
                      Guardados Recientes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {activity?.recent_bookmarks && activity.recent_bookmarks.length > 0 ? (
                      <div className="space-y-3">
                        {activity.recent_bookmarks.map(bookmark => (
                          <Link
                            key={bookmark.id}
                            to={`/post/${bookmark.post_slug}`}
                            className="block p-3 border border-gray-200 rounded-lg hover:border-teal-300 transition-all"
                          >
                            <h4 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                              {bookmark.post_title}
                            </h4>
                            <p className="text-xs text-gray-500">
                              {format(new Date(bookmark.created_at), "d 'de' MMM", { locale: es })}
                            </p>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 text-center py-8">
                        No tienes posts guardados
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UserProfile;
