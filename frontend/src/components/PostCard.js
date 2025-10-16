import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const PostCard = ({ post, featured = false }) => {
  const publishedDate = post.published_at ? new Date(post.published_at) : new Date(post.created_at);

  if (featured) {
    return (
      <Link to={`/post/${post.slug}`} data-testid={`featured-post-${post.id}`}>
        <div className="relative rounded-2xl overflow-hidden h-[500px] card-hover">
          {post.featured_image_url ? (
            <img 
              src={post.featured_image_url} 
              alt={post.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-teal-500 to-orange-400" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <span className="tag bg-orange-500 text-white mb-4">{post.category}</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{fontFamily: 'Space Grotesk'}}>{post.title}</h2>
            <p className="text-gray-200 mb-4 line-clamp-2">{post.excerpt}</p>
            <div className="flex items-center space-x-4 text-sm text-gray-300">
              <span className="flex items-center">
                <Calendar size={16} className="mr-1" />
                {format(publishedDate, "d 'de' MMMM, yyyy", { locale: es })}
              </span>
              <span className="flex items-center">
                <Clock size={16} className="mr-1" />
                {post.reading_time} min
              </span>
              <span className="flex items-center">
                <Eye size={16} className="mr-1" />
                {post.views_count} vistas
              </span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/post/${post.slug}`} data-testid={`post-card-${post.id}`}>
      <div className="bg-white rounded-xl overflow-hidden border border-gray-200 card-hover h-full">
        {post.featured_image_url ? (
          <img 
            src={post.featured_image_url} 
            alt={post.title}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-teal-500 to-orange-400" />
        )}
        <div className="p-6">
          <span className="tag">{post.category}</span>
          <h3 className="text-xl font-bold text-gray-900 mb-2 mt-2" style={{fontFamily: 'Space Grotesk'}}>{post.title}</h3>
          <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span className="flex items-center">
              <Calendar size={14} className="mr-1" />
              {format(publishedDate, "d MMM", { locale: es })}
            </span>
            <span className="flex items-center">
              <Clock size={14} className="mr-1" />
              {post.reading_time} min
            </span>
            <span className="flex items-center">
              <Eye size={14} className="mr-1" />
              {post.views_count}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PostCard;