import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const headers = basePath ? { 'X-Tenant-Slug': tenant.slug } : {};
      const response = await api.get('/public/blogs', { headers });
      setBlogs(response.data);
    } catch (err) {
      console.error('Failed to fetch blogs');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading posts...</div>;

  return (
    <div className="space-y-16">
      <div className="text-center max-w-2xl mx-auto mb-24">
        <h2 className="text-5xl font-extrabold text-gray-900 mb-6">{tenant.name}</h2>
        <p className="text-xl text-gray-500">Welcome to our blog. We write about interesting things.</p>
      </div>

      <div className="grid gap-12">
        {blogs.length === 0 ? (
          <p className="text-center text-gray-500 py-12">No posts published yet.</p>
        ) : (
          blogs.map((blog) => (
            <article key={blog._id} className="group cursor-pointer">
              <Link to={`${basePath}/${blog.slug}`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                  <h3 className="text-3xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {blog.title}
                  </h3>
                  <time className="text-sm text-gray-400 mt-2 md:mt-0">
                    {new Date(blog.publishedAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </time>
                </div>
                <p className="text-lg text-gray-600 line-clamp-3 leading-relaxed">
                  {blog.content.substring(0, 200)}...
                </p>
                <div className="mt-6 flex items-center text-blue-600 font-bold group-hover:translate-x-1 transition-transform inline-flex">
                  Read more <span className="ml-1">→</span>
                </div>
              </Link>
            </article>
          ))
        )}
      </div>
    </div>
  );
};

export default BlogHome;
