import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, FileText, ExternalLink, Edit2, Trash2, Calendar, User } from 'lucide-react';
import api from '../../../shared/api/api';
import { useApp } from '../../../shared/context/AppContext';

interface Blog {
  _id: string;
  title: string;
  slug: string;
  status: string;
  content: string;
  publishedAt?: string;
  authorId?: {
    name: string;
  };
}

const BlogList: React.FC = () => {
  const { showNotification, showConfirm } = useApp();
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tenantSlug, setTenantSlug] = useState('');

  useEffect(() => {
    fetchBlogs();
    fetchTenantSlug();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await api.get('/blogs');
      setBlogs(response.data);
    } catch (err: any) {
      setError('Failed to fetch blogs');
    } finally {
      setLoading(false);
    }
  };

  const fetchTenantSlug = async () => {
    try {
      const response = await api.get('/auth/profile');
      setTenantSlug(response.data.tenantId?.slug || '');
    } catch (err) {
      console.error('Failed to fetch tenant info');
    }
  };

  const handleCreateBlog = () => {
    navigate('/admin/blogs/create');
  };

  const handleEdit = (id: string) => {
    navigate(`/admin/blogs/edit/${id}`);
  };

  const handleDelete = async (id: string) => {
    showConfirm({
      title: 'Delete Blog Post',
      message: 'Are you sure you want to delete this blog post? This action cannot be undone.',
      confirmText: 'Delete',
      type: 'danger',
      onConfirm: async () => {
        try {
          await api.delete(`/blogs/${id}`);
          showNotification('Deleted', 'Blog post has been removed.', 'success');
          fetchBlogs();
        } catch (err: any) {
          showNotification('Error', err.response?.data?.message || 'Failed to delete blog', 'error');
        }
      }
    });
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      <p className="text-gray-500">Loading your stories...</p>
    </div>
  );

  if (error) return (
    <div className="p-8 text-center text-red-500 bg-red-50 rounded-xl border border-red-100 mx-auto max-w-md">
      <p className="font-semibold">{error}</p>
      <button onClick={fetchBlogs} className="mt-4 text-sm text-red-600 hover:underline">Try again</button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search stories..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition-all shadow-sm"
          />
        </div>
        <button 
          onClick={handleCreateBlog}
          className="flex items-center px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-md shadow-blue-100 font-medium active:scale-95"
        >
          <Plus size={18} className="mr-2" />
          Write a Story
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {blogs.length === 0 ? (
          <div className="col-span-full bg-white border border-gray-100 rounded-3xl p-16 text-center shadow-sm">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText size={40} className="text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">You haven't written any stories yet</h3>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto">Start sharing your thoughts with the world. Create your first blog post now.</p>
            <button 
              onClick={handleCreateBlog}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-medium"
            >
              Start Writing
            </button>
          </div>
        ) : (
          blogs.map((blog) => (
            <div key={blog._id} className="group bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider ${
                    blog.status === 'published' 
                      ? 'bg-green-100 text-green-700' 
                      : blog.status === 'scheduled'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {blog.status}
                  </span>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {blog.status === 'published' && tenantSlug && (
                      <a 
                        href={`/p/${tenantSlug}/${blog.slug}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                        title="View Public Link"
                      >
                        <ExternalLink size={16} />
                      </a>
                    )}
                    <button 
                      onClick={() => handleEdit(blog._id)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit Post"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(blog._id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Post"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors cursor-pointer" onClick={() => handleEdit(blog._id)}>
                  {blog.title}
                </h3>
                <p className="text-gray-500 text-sm line-clamp-3 mb-6 leading-relaxed">
                  {blog.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                </p>

                <div className="flex items-center gap-4 text-xs text-gray-400 border-t border-gray-50 pt-4 mt-auto">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} />
                    {blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString() : 'Draft'}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <User size={14} />
                    {blog.authorId?.name || 'You'}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BlogList;
