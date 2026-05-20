import React from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, Globe, Settings, LogOut, CreditCard } from 'lucide-react';
import { useApp } from '../../shared/context/AppContext';
import BlogList from './blogs/BlogList';
import DomainList from './domains/DomainList';
import BillingDashboard from './billing/BillingDashboard';

const AdminDashboard: React.FC = () => {
  const { showConfirm } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    showConfirm({
      title: 'Logout',
      message: 'Are you sure you want to logout?',
      confirmText: 'Logout',
      type: 'danger',
      onConfirm: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        navigate('/login');
      }
    });
  };

  const navItems = [
    { path: '/admin', icon: <LayoutDashboard size={20} />, label: 'Dashboard', end: true },
    { path: '/admin/blogs', icon: <FileText size={20} />, label: 'Blogs' },
    { path: '/admin/domains', icon: <Globe size={20} />, label: 'Domains' },
    { path: '/admin/billing', icon: <CreditCard size={20} />, label: 'Billing' },
    { path: '/admin/settings', icon: <Settings size={20} />, label: 'Settings' },
  ];

  const isActive = (path: string, end: boolean = false) => {
    if (end) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900">
      <aside className="w-64 bg-white border-r border-gray-200">
        <div className="p-6">
          <h1 className="text-xl font-bold text-blue-600">BlogERP Admin</h1>
        </div>
        <nav className="mt-2 px-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive(item.path, item.end)
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200 bg-white">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut size={20} className="mr-3" />
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-gray-200 px-8 py-4">
          <h2 className="text-lg font-semibold">
            {navItems.find(i => isActive(i.path, i.end))?.label || 'Tenant Admin'}
          </h2>
        </header>
        <div className="p-8">
          <Routes>
            <Route path="/" element={<div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-2xl font-bold mb-4">Tenant Dashboard</h3>
              <p className="text-gray-600">Manage your blogs and settings here.</p>
            </div>} />
            <Route path="/blogs" element={<BlogList />} />
            <Route path="/domains" element={<DomainList />} />
            <Route path="/billing" element={<BillingDashboard />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
