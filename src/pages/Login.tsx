import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../shared/api/api';
import Modal from '../shared/components/Modal';
import { useApp } from '../shared/context/AppContext';

const Login: React.FC = () => {
  const { showNotification } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [requestData, setRequestData] = useState({ name: '', slug: '', adminName: '', adminEmail: '' });
  
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', { email, password });
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      if (response.data.user.role === 'super_admin') {
        navigate('/super-admin');
      } else if (response.data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/editor');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
      showNotification('Login Failed', err.response?.data?.message || 'Please check your credentials.', 'error');
    }
  };

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/tenants/request', requestData);
      setIsRequestModalOpen(false);
      showNotification(
        'Request Submitted', 
        'Your access request has been sent successfully. We will review it soon.', 
        'success',
        () => window.location.reload()
      );
    } catch (err: any) {
      showNotification('Request Failed', err.response?.data?.message || 'Something went wrong.', 'error');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="p-8 bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">BlogERP</h2>
          <p className="text-gray-500 mt-2">Sign in to manage your blog</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm font-medium rounded-lg border border-red-100 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-700">Email Address</label>
            <input
              type="email"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@company.com"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-700">Password</label>
            <input
              type="password"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-3 font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95"
          >
            Sign In
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-gray-500 text-sm">
            Don't have an account?{' '}
            <button 
              onClick={() => {
                setIsRequestModalOpen(true);
              }}
              className="text-blue-600 font-bold hover:underline"
            >
              Request Access
            </button>
          </p>
        </div>
      </div>

      <Modal 
        isOpen={isRequestModalOpen} 
        onClose={() => setIsRequestModalOpen(false)} 
        title="Request SaaS Access"
      >
        <form onSubmit={handleRequestSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Org Name</label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={requestData.name}
                onChange={(e) => setRequestData({ ...requestData, name: e.target.value })}
                placeholder="Acme Corp"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={requestData.slug}
                onChange={(e) => setRequestData({ ...requestData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                placeholder="acme-corp"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Admin Name</label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={requestData.adminName}
              onChange={(e) => setRequestData({ ...requestData, adminName: e.target.value })}
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Admin Email</label>
            <input
              type="email"
              required
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={requestData.adminEmail}
              onChange={(e) => setRequestData({ ...requestData, adminEmail: e.target.value })}
              placeholder="john@example.com"
            />
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={() => setIsRequestModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              Submit Request
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Login;
