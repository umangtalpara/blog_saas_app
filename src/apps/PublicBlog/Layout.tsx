import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Search, Menu, Globe } from 'lucide-react';
import api from '../../shared/api/api';
import BlogHome from './pages/BlogHome';
import BlogPost from './pages/BlogPost';

const PublicBlogLayout: React.FC = () => {
  const [tenant, setTenant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    fetchTenantInfo();
    window.addEventListener('scroll', () => setIsScrolled(window.scrollY > 20));
    return () => window.removeEventListener('scroll', () => {});
  }, [location.pathname]);

  const fetchTenantInfo = async () => {
    try {
      let headers = {};
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

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );
  
  if (!tenant) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-6 text-center">
      <Globe size={64} className="text-gray-200 mb-6" />
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Blog Not Found</h2>
      <p className="text-gray-500 max-w-xs">The blog you're looking for doesn't exist or has been moved.</p>
    </div>
  );

  const basePath = location.pathname.startsWith('/p/') 
    ? `/p/${location.pathname.split('/')[2]}` 
    : '';

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-blue-100 selection:text-blue-900">
      <header className={`sticky top-0 z-50 transition-all duration-500 border-b border-gray-100/50 ${
        isScrolled ? 'h-16 bg-white/90 backdrop-blur-xl shadow-lg shadow-gray-100/20' : 'h-24 bg-white'
      }`}>
        <div className="max-w-7xl mx-auto px-6 h-full flex justify-between items-center">
          <Link to={basePath || '/'} className="flex items-center gap-3 group">
            <div className="w-9 h-9 bg-gray-900 rounded-xl flex items-center justify-center group-hover:bg-blue-600 transition-colors">
              <span className="text-white font-black text-lg">{tenant.name.charAt(0)}</span>
            </div>
            <span className="text-xl font-black text-gray-900 tracking-tight group-hover:text-blue-600 transition-colors">
              {tenant.name}
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link to={basePath || '/'} className="text-sm font-bold text-gray-900 hover:text-blue-600 transition-colors">Articles</Link>
            <Link to={`${basePath}/about`} className="text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors">About</Link>
            <div className="h-4 w-px bg-gray-200 mx-2"></div>
            <button className="text-gray-400 hover:text-gray-900 transition-colors">
              <Search size={20} />
            </button>
          </nav>

          <button className="md:hidden text-gray-900">
            <Menu size={24} />
          </button>
        </div>
      </header>

      <main>
        <Routes>
          {location.pathname.startsWith('/p/') ? (
            <>
              <Route path="/:tenantSlug" element={<BlogHome tenant={tenant} basePath={basePath} />} />
              <Route path="/:tenantSlug/:slug" element={<BlogPost tenant={tenant} basePath={basePath} />} />
              <Route path="*" element={<BlogHome tenant={tenant} basePath={basePath} />} />
            </>
          ) : (
            <>
              <Route path="/" element={<BlogHome tenant={tenant} basePath={basePath} />} />
              <Route path="/:slug" element={<BlogPost tenant={tenant} basePath={basePath} />} />
              <Route path="*" element={<BlogHome tenant={tenant} basePath={basePath} />} />
            </>
          )}
        </Routes>
      </main>

      <footer className="bg-gray-50 border-t border-gray-100 mt-32">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16 pb-16 border-b border-gray-200/50">
            <div>
              <h3 className="text-xl font-black text-gray-900 mb-4">{tenant.name}</h3>
              <p className="text-gray-500 leading-relaxed max-w-sm">
                Sharing thoughts, insights, and stories about building great products and teams.
              </p>
            </div>
            <div className="flex md:justify-end gap-12">
              <div>
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Product</h4>
                <ul className="space-y-3 text-sm font-bold text-gray-600">
                  <li><a href="#" className="hover:text-blue-600 transition-colors">Features</a></li>
                  <li><a href="#" className="hover:text-blue-600 transition-colors">Pricing</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Legal</h4>
                <ul className="space-y-3 text-sm font-bold text-gray-600">
                  <li><a href="#" className="hover:text-blue-600 transition-colors">Privacy</a></li>
                  <li><a href="#" className="hover:text-blue-600 transition-colors">Terms</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-sm font-medium text-gray-400">
              &copy; {new Date().getFullYear()} {tenant.name}. All rights reserved.
            </div>
            {tenant.plan !== 'enterprise' && (
              <div className="text-xs font-bold text-gray-400 uppercase tracking-tight flex items-center gap-2">
                Powered by <span className="text-blue-600 font-black">BlogERP</span>
              </div>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicBlogLayout;
