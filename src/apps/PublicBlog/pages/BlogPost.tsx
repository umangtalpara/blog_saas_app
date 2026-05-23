import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../../shared/api/api';

interface Blog {
  _id: string;
  title: string;
  slug: string;
  content: string;
  publishedAt: string;
  tags: string[];
  seoMeta?: {
    title: string;
    description: string;
  };
}

const BlogPost: React.FC<{ tenant: any; basePath: string }> = ({ tenant, basePath }) => {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlog();
  }, [slug]);

  const fetchBlog = async () => {
    try {
      const headers = { 'X-Tenant-Slug': tenant.slug };
      const response = await api.get(`/public/blogs/${slug}`, { headers });
      setBlog(response.data);
      
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

  if (loading) return <div>Loading post...</div>;
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
      </header>

      <div 
        className="prose prose-lg max-w-none text-gray-800 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />
    </article>
  );
};

export default BlogPost;
