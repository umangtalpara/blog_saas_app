import React, { useEffect, useState } from 'react';
import { Plus, Search, Shield, Key, Eye, EyeOff } from 'lucide-react';
import api from '../../../shared/api/api';
import Modal from '../../../shared/components/Modal';
import { useApp } from '../../../shared/context/AppContext';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  tenantId?: string;
}

interface Tenant {
  _id: string;
  name: string;
}

const UserList: React.FC = () => {
  const { showNotification } = useApp();
  const [users, setUsers] = useState<User[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'admin',
    tenantId: ''
  });

  useEffect(() => {
    Promise.all([fetchUsers(), fetchTenants()]);
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (err: any) {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const fetchTenants = async () => {
    try {
      const response = await api.get('/tenants');
      setTenants(response.data);
    } catch (err: any) {}
  };

  const handleOpenCreate = () => {
    setEditingUser(null);
    setUserData({ name: '', email: '', password: '', role: 'admin', tenantId: '' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: User) => {
    setEditingUser(user);
    setUserData({ 
      name: user.name, 
      email: user.email, 
      password: '', 
      role: user.role, 
      tenantId: user.tenantId || '' 
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingUser) {
        // For updates, we don't send the password field
        const { password, ...updateData } = userData;
        await api.patch(`/users/${editingUser._id}`, updateData);
        showNotification('Success', 'User updated successfully', 'success');
      } else {
        await api.post('/users', userData);
        showNotification('Success', 'User created successfully', 'success');
      }
      setIsModalOpen(false);
      fetchUsers();
    } catch (err: any) {
      showNotification('Error', err.response?.data?.message || 'Action failed', 'error');
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    try {
      await api.patch(`/users/${selectedUser._id}/password`, { password: newPassword });
      setIsResetModalOpen(false);
      setNewPassword('');
      setSelectedUser(null);
      showNotification('Success', 'Password has been reset successfully.', 'success');
    } catch (err: any) {
      showNotification('Error', err.response?.data?.message || 'Failed to reset password', 'error');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search users..."
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>
        <button 
          onClick={handleOpenCreate}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} className="mr-2" />
          Add User
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap font-medium">{user.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`flex items-center px-2 py-1 text-xs font-medium rounded-full uppercase w-fit ${
                    user.role === 'super_admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {user.role === 'super_admin' && <Shield size={12} className="mr-1" />}
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full uppercase ${
                    user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm space-x-2">
                  <button 
                    onClick={() => {
                      setSelectedUser(user);
                      setIsResetModalOpen(true);
                    }}
                    className="text-yellow-600 hover:text-yellow-800 font-medium inline-flex items-center"
                    title="Reset Password"
                  >
                    <Key size={16} className="mr-1" />
                    Reset
                  </button>
                  <button 
                    onClick={() => handleOpenEdit(user)}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingUser ? "Edit User" : "Add New User"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={userData.name}
              onChange={(e) => setUserData({ ...userData, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              required
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={userData.email}
              onChange={(e) => setUserData({ ...userData, email: e.target.value })}
            />
          </div>
          {!editingUser && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                  value={userData.password}
                  onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={userData.role}
              onChange={(e) => setUserData({ ...userData, role: e.target.value })}
            >
              <option value="admin">Admin</option>
              <option value="editor">Editor</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tenant</label>
            <select
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={userData.tenantId}
              onChange={(e) => setUserData({ ...userData, tenantId: e.target.value })}
            >
              <option value="">None (Super Admin)</option>
              {tenants.map(t => (
                <option key={t._id} value={t._id}>{t.name}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              {editingUser ? "Update User" : "Create User"}
            </button>
          </div>
        </form>
      </Modal>

      <Modal 
        isOpen={isResetModalOpen} 
        onClose={() => {
          setIsResetModalOpen(false);
          setSelectedUser(null);
          setNewPassword('');
        }} 
        title={selectedUser ? `Reset Password for ${selectedUser.name}` : "Reset Password"}
      >
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <div className="relative">
              <input
                type={showResetPassword ? 'text' : 'password'}
                required
                minLength={6}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter at least 6 characters"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setShowResetPassword(!showResetPassword)}
              >
                {showResetPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={() => {
                setIsResetModalOpen(false);
                setSelectedUser(null);
                setNewPassword('');
              }}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 rounded-lg transition-colors"
            >
              Reset Password
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default UserList;
