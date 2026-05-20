import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import api from '../../shared/api/api';
import BlogHome from './pages/BlogHome';
import BlogPost from './pages/BlogPost';

const PublicBlogLayout: React.FC = () => {
  const [tenant, setTenant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    fetchTenantInfo();
  }, [location.pathname]);

  const fetchTenantInfo = async () => {
    try {
      let headers = {};
      // If we are in /p/:tenantSlug mode
      if (location.pathname.startsWith('/p/')) {
        const parts = location.pathname.split('/');
        const slug = parts[2];
        headers = { 'X-Tenant-Slug': slug };
      }

      const response = await api.get('/tenants/public/info', { headers });
      setTenant(response.data);
      document.title = response.data.name;
    } catch (err) {
      console.error('Failed to fetch tenant info');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  if (!tenant) return <div className="flex items-center justify-center min-h-screen text-red-500">Blog not found</div>;

  // Adjust base path for routing
  const basePath = location.pathname.startsWith('/p/') 
    ? `/p/${location.pathname.split('/')[2]}` 
    : '';

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-8 flex justify-between items-center">
          <Link to={basePath || '/'} className="text-3xl font-black text-gray-900 tracking-tight">
            {tenant.name}
          </Link>
          <nav className="flex space-x-6 text-sm font-medium text-gray-500">
            <Link to={basePath || '/'} className="hover:text-gray-900">Home</Link>
            <Link to={`${basePath}/about`} className="hover:text-gray-900">About</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <Routes>
          <Route path="/" element={<BlogHome tenant={tenant} basePath={basePath} />} />
          {/* If in /p/ mode, the slug is at the next level */}
          <Route path="/:slug" element={<BlogPost tenant={tenant} basePath={basePath} />} />
          {/* For /p/tenantSlug/blog-slug */}
          <Route path="/*" element={<BlogHome tenant={tenant} basePath={basePath} />} />
        </Routes>
      </main>

      <footer className="border-t border-gray-100 mt-24">
        <div className="max-w-5xl mx-auto px-6 py-12 text-center text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} {tenant.name}. {tenant.plan !== 'enterprise' && 'Powered by BlogERP.'}
        </div>
      </footer>
    </div>
  );
};

export default PublicBlogLayout;
