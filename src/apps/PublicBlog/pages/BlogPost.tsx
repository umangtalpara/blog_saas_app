import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, Share2, MessageCircle } from 'lucide-react';
import api from '../../../shared/api/api';
import { useInteractionTracking } from '../../../shared/hooks/useInteractionTracking';
import { commentService } from '../../../shared/services/comment.service';
import CommentSection from '../components/CommentSection';

interface Blog {
  _id: string;
  title: string;
  slug: string;
  content: string;
  publishedAt: string;
  tags: string[];
  allowComments: boolean;
  totalViews: number;
  totalLikes: number;
  totalShares: number;
  totalComments: number;
  seoMeta?: {
    title: string;
    description: string;
  };
}

const BlogPost: React.FC<{ tenant: any; basePath: string }> = ({ tenant, basePath }) => {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);

  const { trackLike, trackShare } = useInteractionTracking(slug, tenant.slug);

  useEffect(() => {
    fetchBlog();
  }, [slug]);

  const fetchBlog = async () => {
    try {
      const headers = { 'X-Tenant-Slug': tenant.slug };
      const response = await api.get(`/public/blogs/${slug}`, { headers });
      setBlog(response.data);
      
      // Fetch comments if enabled
      if (response.data.allowComments) {
        const blogComments = await commentService.getBlogComments(slug!, tenant.slug);
        setComments(blogComments);
      }

      // Dynamic SEO
      if (response.data.seoMeta?.title) {
        document.title = `${response.data.seoMeta.title} | ${tenant.name}`;
      } else {
        document.title = `${response.data.title} | ${tenant.name}`;
      }
    } catch (err) {
      console.error('Failed to fetch blog post');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (isLiked) return;
    const success = await trackLike();
    if (success) {
      setIsLiked(true);
      if (blog) setBlog({ ...blog, totalLikes: (blog.totalLikes || 0) + 1 });
    }
  };

  const handleShare = async () => {
    const success = await trackShare();
    if (success) {
      if (blog) setBlog({ ...blog, totalShares: (blog.totalShares || 0) + 1 });
      // Use Web Share API if available
      if (navigator.share) {
        navigator.share({
          title: blog?.title,
          url: window.location.href
        }).catch(() => {});
      } else {
        // Fallback: Copy to clipboard
        navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );
  
  if (!blog) return <div className="text-center py-24">Post not found. <Link to={basePath || '/'} className="text-blue-600">Go back home</Link></div>;

  return (
    <article className="max-w-3xl mx-auto">
      <header className="mb-12">
        <Link to={basePath || '/'} className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-4 inline-block hover:underline">
          &larr; Back to all posts
        </Link>
        <h1 className="text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
          {blog.title}
        </h1>
        <div className="flex items-center justify-between">
          <div className="flex items-center text-gray-400 space-x-4">
            <time>
              {new Date(blog.publishedAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </time>
            <span>&bull;</span>
            <div className="flex space-x-2">
              {blog.tags?.map(tag => (
                <span key={tag} className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs uppercase font-bold">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5 text-gray-400">
              <MessageCircle size={18} />
              <span className="text-sm font-medium">{blog.totalComments || 0}</span>
            </div>
            <button 
              onClick={handleLike}
              className={`flex items-center gap-1.5 transition-colors ${isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
            >
              <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} />
              <span className="text-sm font-medium">{blog.totalLikes || 0}</span>
            </button>
            <button 
              onClick={handleShare}
              className="flex items-center gap-1.5 text-gray-400 hover:text-blue-600 transition-colors"
            >
              <Share2 size={18} />
              <span className="text-sm font-medium">{blog.totalShares || 0}</span>
            </button>
          </div>
        </div>
      </header>

      <div 
        className="prose prose-lg max-w-none text-gray-800 leading-relaxed mb-24"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />

      {blog.allowComments && (
        <CommentSection 
          blogSlug={blog.slug} 
          tenantSlug={tenant.slug} 
          initialComments={comments} 
        />
      )}
    </article>
  );
};

export default BlogPost;

