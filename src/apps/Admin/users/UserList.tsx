import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Edit2, Trash2, 
  Shield, Mail, User as UserIcon,
  CheckCircle, XCircle, MoreVertical,
  Eye, EyeOff
} from 'lucide-react';
import api from '../../../shared/api/api';
import { useApp } from '../../../shared/context/AppContext';
import Modal from '../../../shared/components/Modal';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  tenantId: string;
}

const UserList: React.FC = () => {
  const { showNotification, showConfirm } = useApp();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [currentUser, setCurrentUser] = useState<Partial<User> | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'editor'
  });

  const loggedInUser = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users');
      // The backend should ideally filter by tenantId for non-super-admins,
      // but we'll ensure it here too.
      const tenantUsers = response.data.filter((u: User) => u.tenantId === loggedInUser.tenantId);
      setUsers(tenantUsers);
    } catch (err) {
      showNotification('Error', 'Failed to fetch users', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (currentUser?._id) {
        await api.patch(`/users/${currentUser._id}`, {
          name: formData.name,
          role: formData.role
        });
        showNotification('Success', 'User updated successfully', 'success');
      } else {
        await api.post('/users', {
          ...formData,
          tenantId: loggedInUser.tenantId
        });
        showNotification('Success', 'User created successfully', 'success');
      }
      setIsModalOpen(false);
      fetchUsers();
    } catch (err: any) {
      showNotification('Error', err.response?.data?.message || 'Action failed', 'error');
    }
  };

  const handleDelete = (id: string) => {
    showConfirm({
      title: 'Delete User',
      message: 'Are you sure you want to remove this user from your team?',
      confirmText: 'Delete',
      type: 'danger',
      onConfirm: async () => {
        try {
          await api.delete(`/users/${id}`);
          showNotification('Deleted', 'User has been removed', 'success');
          fetchUsers();
        } catch (err) {
          showNotification('Error', 'Failed to delete user', 'error');
        }
      }
    });
  };

  const openModal = (user: User | null = null) => {
    if (user) {
      setCurrentUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        password: '',
        role: user.role
      });
    } else {
      setCurrentUser(null);
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'editor'
      });
    }
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-black text-gray-900 mb-2">Team Management</h2>
          <p className="text-gray-500 font-medium">Manage employees and their access levels for this tenant.</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-6 py-3.5 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-95"
        >
          <Plus size={20} />
          Add Team Member
        </button>
      </div>

      <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Member</th>
                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Role</th>
                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Access</th>
                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-8 py-12 text-center text-gray-400 font-bold italic">Loading team members...</td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-12 text-center text-gray-400 font-bold italic">No team members found.</td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 font-black text-lg">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-base font-bold text-gray-900">{user.name}</div>
                          <div className="text-sm font-medium text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        user.role === 'admin' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'
                      }`}>
                        <Shield size={10} />
                        {user.role}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${user.status === 'active' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <span className="text-sm font-bold text-gray-700 capitalize">{user.status}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-1 text-xs font-bold text-gray-400 uppercase tracking-tight">
                        <CheckCircle size={14} className="text-green-500" />
                        Full Blog Access
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openModal(user)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentUser ? 'Edit Team Member' : 'Add New Team Member'}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Full Name</label>
              <input
                type="text"
                required
                className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all font-bold"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Email Address</label>
              <input
                type="email"
                required
                disabled={!!currentUser}
                className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all font-bold disabled:opacity-50"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john@example.com"
              />
            </div>
            {!currentUser && (
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Temporary Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all font-bold pr-12"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            )}
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Access Level</label>
              <select
                className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all font-bold appearance-none"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="editor">Editor (Can create & edit blogs)</option>
                <option value="admin">Admin (Full management access)</option>
                <option value="viewer">Viewer (Read-only access)</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 px-6 py-3.5 border border-gray-100 text-gray-500 font-black rounded-2xl hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3.5 bg-gray-900 text-white font-black rounded-2xl hover:bg-blue-600 shadow-lg shadow-gray-200 transition-all"
            >
              {currentUser ? 'Save Changes' : 'Create User'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default UserList;
