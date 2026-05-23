import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, User, Calendar, Sparkles, TrendingUp } from 'lucide-react';
import api from '../../../shared/api/api';

interface Blog {
  _id: string;
  title: string;
  slug: string;
  content: string;
  publishedAt: string;
  tags: string[];
}

const BlogHome: React.FC<{ tenant: any; basePath: string }> = ({ tenant, basePath }) => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const headers = { 'X-Tenant-Slug': tenant.slug };
      const response = await api.get('/public/blogs', { headers });
      setBlogs(response.data);
    } catch (err) {
      console.error('Failed to fetch blogs');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="max-w-6xl mx-auto px-6 py-24 space-y-12">
      <div className="h-20 bg-gray-100 rounded-[40px] animate-pulse w-2/3 mx-auto"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="h-96 bg-gray-50 rounded-[40px] animate-pulse"></div>
        ))}
      </div>
    </div>
  );

  const featuredPost = blogs[0];
  const trendingPosts = blogs.slice(1, 4);
  const recentPosts = blogs.slice(1);

  return (
    <div className="pb-32 bg-[#fafafa]">
      {/* Dynamic Hero Section */}
      <section className="relative min-h-[80vh] flex items-center pt-20 pb-32 overflow-hidden bg-white">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-50/50 skew-x-[-12deg] translate-x-32 z-0"></div>
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl z-0"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="animate-in fade-in slide-in-from-left-8 duration-1000">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-2xl text-[10px] font-black uppercase tracking-widest mb-10 border border-blue-100/50">
                <Sparkles size={14} />
                Editor's Choice
              </div>
              
              {featuredPost ? (
                <>
                  <h1 className="text-6xl md:text-8xl font-black text-gray-900 mb-8 leading-[1.05] tracking-tight">
                    {featuredPost.title.split(' ').map((word, i) => (
                      <span key={i} className={i % 4 === 3 ? 'text-blue-600' : ''}>{word} </span>
                    ))}
                  </h1>
                  <p className="text-xl md:text-2xl text-gray-500 mb-12 leading-relaxed max-w-xl font-medium">
                    {featuredPost.content.replace(/<[^>]*>?/gm, '').substring(0, 180)}...
                  </p>
                  <div className="flex flex-wrap gap-6">
                    <Link 
                      to={`${basePath}/${featuredPost.slug}`}
                      className="inline-flex items-center gap-3 px-10 py-5 bg-gray-900 text-white rounded-[24px] font-black hover:bg-blue-600 hover:shadow-2xl hover:shadow-blue-200 transition-all duration-300 active:scale-95 group"
                    >
                      Read Article
                      <ArrowRight size={22} className="group-hover:translate-x-2 transition-transform" />
                    </Link>
                    <div className="flex -space-x-3">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="w-14 h-14 rounded-2xl border-4 border-white bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-400">
                          {String.fromCharCode(64 + i)}
                        </div>
                      ))}
                      <div className="w-14 h-14 rounded-2xl border-4 border-white bg-blue-600 flex items-center justify-center text-xs font-bold text-white">
                        +12
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <h1 className="text-7xl font-black text-gray-900 mb-8 tracking-tighter">Welcome to {tenant.name}</h1>
              )}
            </div>

            <div className="hidden lg:block relative animate-in fade-in zoom-in-95 duration-1000 delay-200">
              <div className="aspect-[4/5] bg-gray-100 rounded-[64px] overflow-hidden shadow-2xl relative group">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-transparent"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 bg-white/20 backdrop-blur-md rounded-[40px] flex items-center justify-center border border-white/30 shadow-2xl group-hover:scale-110 transition-transform duration-500">
                    <Sparkles size={48} className="text-white" />
                  </div>
                </div>
                {/* Decorative floating elements */}
                <div className="absolute top-12 -right-8 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-24 -left-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Section */}
      <section className="max-w-7xl mx-auto px-6 py-32">
        <div className="flex items-center justify-between mb-16">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center text-blue-600">
              <TrendingUp size={24} />
            </div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Trending Now</h2>
          </div>
          <div className="h-px flex-1 bg-gray-100 mx-10 hidden md:block"></div>
          <Link to="#" className="text-sm font-black text-blue-600 uppercase tracking-widest hover:underline">View Rankings</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trendingPosts.map((post, index) => (
            <Link 
              key={post._id} 
              to={`${basePath}/${post.slug}`}
              className="group flex gap-6 items-start p-6 rounded-[32px] hover:bg-white hover:shadow-xl hover:shadow-blue-50 transition-all duration-300"
            >
              <div className="text-5xl font-black text-gray-100 group-hover:text-blue-50 transition-colors">0{index + 1}</div>
              <div>
                <h3 className="text-lg font-black text-gray-900 mb-2 leading-snug group-hover:text-blue-600 transition-colors">
                  {post.title}
                </h3>
                <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                  <Calendar size={12} />
                  {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* All Stories Grid */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-24">
          <h2 className="text-5xl font-black text-gray-900 mb-6 tracking-tight italic">All Stories</h2>
          <p className="text-lg text-gray-500 font-medium max-w-2xl mx-auto">Explore our full collection of thoughts, tutorials, and insights across various topics.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {recentPosts.length === 0 ? (
            <div className="col-span-full py-40 text-center bg-white rounded-[64px] border border-dashed border-gray-200">
              <p className="text-2xl font-black text-gray-300">Quiet for now... stories are brewing.</p>
            </div>
          ) : (
            recentPosts.map((blog) => (
              <article 
                key={blog._id} 
                className="group relative flex flex-col h-full bg-white rounded-[48px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-blue-100 hover:-translate-y-2 transition-all duration-500"
                onMouseEnter={() => setHoveredId(blog._id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div className="p-10 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-8">
                    <div className="flex flex-wrap gap-2">
                      {blog.tags?.slice(0, 1).map(tag => (
                        <span key={tag} className="px-4 py-1.5 bg-gray-50 text-gray-500 rounded-xl text-[10px] font-black uppercase tracking-widest group-hover:bg-blue-600 group-hover:text-white transition-all">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="p-2.5 bg-gray-50 rounded-xl text-gray-400 group-hover:text-blue-600 transition-colors">
                      <Sparkles size={16} />
                    </div>
                  </div>
                  
                  <Link to={`${basePath}/${blog.slug}`} className="flex-1">
                    <h3 className="text-3xl font-black text-gray-900 group-hover:text-blue-600 transition-colors leading-tight mb-6">
                      {blog.title}
                    </h3>
                    <p className="text-gray-500 leading-relaxed mb-10 line-clamp-4 font-medium italic">
                      {blog.content.replace(/<[^>]*>?/gm, '').substring(0, 160)}...
                    </p>
                  </Link>

                  <div className="mt-auto pt-8 border-t border-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 font-bold text-xs group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                        {tenant.name.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-gray-900 uppercase tracking-tighter">{tenant.name}</span>
                        <time className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          {new Date(blog.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </time>
                      </div>
                    </div>
                    <Link 
                      to={`${basePath}/${blog.slug}`}
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                        hoveredId === blog._id ? 'bg-blue-600 text-white translate-x-1' : 'bg-gray-50 text-gray-400'
                      }`}
                    >
                      <ArrowRight size={20} />
                    </Link>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </section>

      {/* Modern Newsletter Section */}
      <section className="max-w-7xl mx-auto px-6 mt-40">
        <div className="bg-gray-900 rounded-[80px] p-16 md:p-32 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/10 skew-x-[-20deg] translate-x-1/2"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px]"></div>
          
          <div className="relative z-10 grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter leading-none">The Weekly <span className="text-blue-500 italic">Digest</span></h2>
              <p className="text-blue-100/60 text-xl mb-12 font-medium leading-relaxed max-w-md">Join 12,000+ creators and engineers receiving our curated insights every Monday.</p>
              
              <form className="flex flex-col sm:flex-row gap-4" onSubmit={(e) => e.preventDefault()}>
                <input 
                  type="email" 
                  placeholder="name@company.com" 
                  className="flex-1 px-10 py-6 bg-white/5 border border-white/10 rounded-[32px] text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white/10 transition-all backdrop-blur-xl"
                />
                <button className="px-10 py-6 bg-blue-600 text-white rounded-[32px] font-black hover:bg-blue-700 hover:shadow-2xl hover:shadow-blue-500/40 transition-all active:scale-95">
                  Subscribe
                </button>
              </form>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mt-6 ml-4">No spam. Ever. Unsubscribe anytime.</p>
            </div>
            
            <div className="hidden lg:grid grid-cols-2 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="aspect-square bg-white/5 border border-white/10 rounded-[40px] flex items-center justify-center backdrop-blur-sm group hover:bg-white/10 transition-colors">
                  <Sparkles size={32} className="text-white/20 group-hover:text-blue-500 transition-colors" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogHome;
