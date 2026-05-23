import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Heart, Share2, MessageCircle, 
  ArrowLeft, Calendar, Clock, 
  ChevronRight, Sparkles,
  Link as LinkIcon,
  ArrowUp, PlayCircle
} from 'lucide-react';
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
  const [relatedPosts, setRelatedPosts] = useState<Blog[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  const contentRef = useRef<HTMLDivElement>(null);
  const { trackLike, trackShare } = useInteractionTracking(slug, tenant.slug);

  useEffect(() => {
    fetchBlog();
    window.scrollTo(0, 0);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [slug]);

  const handleScroll = () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / totalHeight) * 100;
    setScrollProgress(progress);
    setShowScrollTop(window.scrollY > 1000);
  };

  const fetchBlog = async () => {
    try {
      const headers = { 'X-Tenant-Slug': tenant.slug };
      const [postRes, blogsRes] = await Promise.all([
        api.get(`/public/blogs/${slug}`, { headers }),
        api.get('/public/blogs', { headers })
      ]);
      
      setBlog(postRes.data);
      setRelatedPosts(blogsRes.data.filter((b: any) => b.slug !== slug).slice(0, 3));
      
      if (postRes.data.allowComments) {
        const blogComments = await commentService.getBlogComments(slug!, tenant.slug);
        setComments(blogComments);
      }

      document.title = postRes.data.seoMeta?.title || `${postRes.data.title} | ${tenant.name}`;
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
      if (navigator.share) {
        navigator.share({ title: blog?.title, url: window.location.href }).catch(() => {});
      } else {
        navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-40 bg-white">
      <div className="w-16 h-16 border-t-4 border-blue-600 border-solid rounded-full animate-spin" />
      <div className="mt-8 text-sm font-black text-gray-400 uppercase tracking-[0.3em] animate-pulse">Engaging Stories...</div>
    </div>
  );
  
  if (!blog) return (
    <div className="max-w-2xl mx-auto text-center py-40">
      <h2 className="text-4xl font-black text-gray-900 mb-6">Lost in space?</h2>
      <p className="text-gray-500 mb-10 text-lg">We couldn't find the article you're looking for.</p>
      <Link to={basePath || '/'} className="inline-flex items-center gap-3 px-8 py-4 bg-gray-900 text-white rounded-[20px] font-black hover:bg-blue-600 transition-all">
        <ArrowLeft size={20} />
        Back to Safety
      </Link>
    </div>
  );

  return (
    <div className="bg-[#fafafa] min-h-screen relative pb-32">
      {/* Reading Progress Bar */}
      <div className="fixed top-20 left-0 w-full h-1 z-[60] pointer-events-none">
        <div 
          className="h-full bg-blue-600 transition-all duration-150 ease-out shadow-[0_0_10px_rgba(37,99,235,0.5)]" 
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Article Hero */}
      <header className="bg-white pt-24 pb-40 border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-wrap gap-4 mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {blog.tags?.map(tag => (
              <span key={tag} className="px-5 py-2 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100/50">
                {tag}
              </span>
            ))}
            <span className="px-5 py-2 bg-gray-50 text-gray-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-gray-100/50 flex items-center gap-2">
              <Clock size={12} />
              7 Min Read
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-12 leading-[1.05] tracking-tight animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
            {blog.title}
          </h1>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pt-10 border-t border-gray-100 animate-in fade-in duration-700 delay-200">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-[24px] bg-gray-900 flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-gray-200">
                {tenant.name.charAt(0)}
              </div>
              <div>
                <div className="text-lg font-black text-gray-900">{tenant.name}</div>
                <div className="text-sm font-bold text-gray-400 uppercase tracking-tight italic">
                  Published on {new Date(blog.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={handleLike}
                className={`flex items-center gap-3 px-6 py-3 rounded-[20px] text-sm font-black transition-all ${
                  isLiked 
                    ? 'bg-red-50 text-red-600 shadow-lg shadow-red-100' 
                    : 'bg-white text-gray-500 hover:bg-red-50 hover:text-red-600 border border-gray-100'
                }`}
              >
                <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
                {blog.totalLikes || 0}
              </button>
              <button 
                onClick={handleShare}
                className="flex items-center gap-3 px-6 py-3 bg-white text-gray-500 rounded-[20px] text-sm font-black border border-gray-100 hover:bg-blue-50 hover:text-blue-600 transition-all"
              >
                <Share2 size={20} />
                Share
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 -mt-20 relative z-10 flex flex-col lg:flex-row gap-12">
        {/* Sticky Engagement Sidebar */}
        <aside className="hidden lg:block w-20 sticky top-32 h-fit">
          <div className="flex flex-col gap-4 items-center">
            <button onClick={handleLike} className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${isLiked ? 'bg-red-50 text-red-600' : 'bg-white text-gray-400 border border-gray-100 hover:border-red-200 hover:text-red-600'}`}>
              <Heart size={24} fill={isLiked ? 'currentColor' : 'none'} />
            </button>
            <div className="w-px h-8 bg-gray-200 my-2"></div>
            <button onClick={handleShare} className="w-14 h-14 rounded-2xl bg-white text-gray-400 border border-gray-100 hover:bg-blue-50 hover:text-blue-600 transition-all">
              <LinkIcon size={20} />
            </button>
          </div>
        </aside>

        {/* Content Card */}
        <div className="flex-1 max-w-4xl mx-auto lg:mx-0">
          <div className="bg-white rounded-[64px] p-8 md:p-20 shadow-2xl shadow-gray-200/40 border border-gray-100/50">
            <div 
              ref={contentRef}
              className="prose prose-2xl max-w-none text-gray-800 leading-[1.7] font-medium
                prose-headings:font-black prose-headings:tracking-tighter prose-headings:text-gray-900 prose-headings:italic
                prose-a:text-blue-600 prose-a:font-black prose-a:underline-offset-4 hover:prose-a:text-blue-700
                prose-strong:font-black prose-strong:text-gray-900
                prose-img:rounded-[48px] prose-img:shadow-2xl
                prose-blockquote:border-l-0 prose-blockquote:bg-blue-50/50 prose-blockquote:p-12 prose-blockquote:rounded-[40px] prose-blockquote:italic prose-blockquote:text-blue-900 prose-blockquote:font-black prose-blockquote:text-3xl prose-blockquote:relative
                before:prose-blockquote:content-['\201C'] before:prose-blockquote:absolute before:prose-blockquote:top-4 before:prose-blockquote:left-6 before:prose-blockquote:text-6xl before:prose-blockquote:text-blue-200
                prose-code:bg-gray-50 prose-code:p-1 prose-code:rounded-lg prose-code:text-blue-600 prose-code:before:content-none prose-code:after:content-none
              "
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />

            {/* Tags Footer */}
            <div className="mt-20 pt-12 border-t border-gray-100 flex flex-wrap gap-3">
              <span className="text-xs font-black text-gray-400 uppercase tracking-widest w-full mb-2">Tagged under</span>
              {blog.tags?.map(tag => (
                <Link key={tag} to="#" className="px-6 py-2 bg-gray-50 text-gray-500 rounded-xl text-xs font-black hover:bg-blue-600 hover:text-white transition-all">
                  #{tag}
                </Link>
              ))}
            </div>
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <section className="mt-32">
              <div className="flex items-center gap-4 mb-12">
                <Sparkles className="text-blue-600" />
                <h3 className="text-3xl font-black text-gray-900 tracking-tight">You might also like</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedPosts.map(post => (
                  <Link key={post._id} to={`${basePath}/${post.slug}`} className="group flex flex-col p-8 bg-white rounded-[40px] border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <h4 className="text-lg font-black text-gray-900 group-hover:text-blue-600 transition-colors mb-4 line-clamp-2">
                      {post.title}
                    </h4>
                    <div className="mt-auto flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      <Clock size={12} />
                      5 Min Read
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Comments Section */}
          {blog.allowComments && (
            <section className="mt-32 bg-gray-900 rounded-[64px] p-8 md:p-20 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
              <div className="relative z-10">
                <h3 className="text-4xl font-black mb-12 flex items-center gap-6">
                  Community <span className="text-blue-500 italic">Chat</span>
                  <span className="px-4 py-1 bg-white/10 rounded-2xl text-sm font-black border border-white/10">
                    {blog.totalComments || 0}
                  </span>
                </h3>
                <div className="text-gray-900">
                  <CommentSection 
                    blogSlug={blog.slug} 
                    tenantSlug={tenant.slug} 
                    initialComments={comments} 
                  />
                </div>
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Scroll to Top */}
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed bottom-10 right-10 w-16 h-16 bg-gray-900 text-white rounded-[24px] shadow-2xl flex items-center justify-center transition-all duration-500 z-50 hover:bg-blue-600 hover:-translate-y-2 ${
          showScrollTop ? 'translate-y-0 opacity-100' : 'translate-y-32 opacity-0'
        }`}
      >
        <ArrowUp size={24} />
      </button>
    </div>
  );
};

export default BlogPost;
