import React from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  MessageSquare, 
  Globe, 
  CreditCard,
  LogOut,
  Settings as SettingsIcon,
  Bell,
  Users
} from 'lucide-react';
import { useApp } from '../../shared/context/AppContext';
import Analytics from './Analytics';
import BlogList from './blogs/BlogList';
import CommentList from './comments/CommentList';
import DomainList from './domains/DomainList';
import BillingDashboard from './billing/BillingDashboard';
import UserList from './users/UserList';
import SettingsPage from './settings/Settings';

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
    { path: '/admin', icon: <LayoutDashboard size={20} />, label: 'Analytics', end: true },
    { path: '/admin/blogs', icon: <FileText size={20} />, label: 'Blogs' },
    { path: '/admin/comments', icon: <MessageSquare size={20} />, label: 'Comments' },
    { path: '/admin/users', icon: <Users size={20} />, label: 'Users' },
    { path: '/admin/domains', icon: <Globe size={20} />, label: 'Domains' },
    { path: '/admin/billing', icon: <CreditCard size={20} />, label: 'Billing' },
    { path: '/admin/settings', icon: <SettingsIcon size={20} />, label: 'Settings' },
  ];

  const isActive = (path: string, end: boolean = false) => {
    if (end) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-gray-100 flex flex-col shadow-sm">
        <div className="p-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
              <span className="text-white font-black text-xl">B</span>
            </div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">BlogERP</h1>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-4 mb-4">Main Menu</div>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3.5 text-sm font-bold rounded-2xl transition-all duration-200 group ${
                isActive(item.path, item.end)
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-100'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <span className={`mr-3 transition-colors ${
                isActive(item.path, item.end) ? 'text-white' : 'text-gray-400 group-hover:text-blue-600'
              }`}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 mt-auto">
          <div className="bg-gray-50 p-4 rounded-3xl border border-gray-100 mb-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-blue-600 font-bold">
                AD
              </div>
              <div>
                <div className="text-sm font-bold text-gray-900">Admin Panel</div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Active Plan: Pro</div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center w-full px-4 py-2 text-xs font-black text-red-500 hover:bg-red-50 rounded-xl transition-colors border border-transparent hover:border-red-100"
            >
              <LogOut size={16} className="mr-2" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 px-8 flex items-center justify-between sticky top-0 z-10">
          <h2 className="text-xl font-black text-gray-900">
            {navItems.find(i => isActive(i.path, i.end))?.label || 'Dashboard'}
          </h2>
          
          <div className="flex items-center gap-4">
            <button className="p-2.5 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <button 
              onClick={() => navigate('/admin/settings')}
              className="p-2.5 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all"
            >
              <SettingsIcon size={20} />
            </button>
            <div className="h-8 w-px bg-gray-100 mx-2"></div>
            <div className="flex items-center gap-3 pl-2">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-bold text-gray-900 leading-none mb-1">Admin User</div>
                <div className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Site Owner</div>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-100"></div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto bg-gray-50/50">
          <div className="max-w-7xl mx-auto p-8">
            <Routes>
              <Route path="/" element={<Analytics />} />
              <Route path="/blogs" element={<BlogList />} />
              <Route path="/comments" element={<CommentList />} />
              <Route path="/users" element={<UserList />} />
              <Route path="/domains" element={<DomainList />} />
              <Route path="/billing" element={<BillingDashboard />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
