import React, { useEffect, useState } from 'react';
import { Plus, Search, CheckCircle, Clock } from 'lucide-react';
import api from '../../../shared/api/api';
import Modal from '../../../shared/components/Modal';
import { useApp } from '../../../shared/context/AppContext';

interface Tenant {
  _id: string;
  name: string;
  slug: string;
  plan: string;
  status: string;
  settings?: any;
}

const TenantList: React.FC = () => {
  const { showNotification, showConfirm } = useApp();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);
  const [tenantData, setTenantData] = useState({ name: '', slug: '', plan: 'free', status: 'pending' });

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    try {
      const response = await api.get('/tenants');
      setTenants(response.data);
    } catch (err: any) {
      setError('Failed to fetch tenants');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingTenant(null);
    setTenantData({ name: '', slug: '', plan: 'free', status: 'pending' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (tenant: Tenant) => {
    setEditingTenant(tenant);
    setTenantData({ name: tenant.name, slug: tenant.slug, plan: tenant.plan, status: tenant.status });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTenant) {
        await api.patch(`/tenants/${editingTenant._id}`, tenantData);
        showNotification('Success', 'Tenant updated successfully', 'success');
      } else {
        await api.post('/tenants', tenantData);
        showNotification('Success', 'Tenant created successfully', 'success');
      }
      setIsModalOpen(false);
      fetchTenants();
    } catch (err: any) {
      showNotification('Error', err.response?.data?.message || 'Action failed', 'error');
    }
  };

  const handleApprove = async (id: string) => {
    showConfirm({
      title: 'Approve Tenant',
      message: 'Approve this tenant request? This will activate their account.',
      confirmText: 'Approve',
      type: 'info',
      onConfirm: async () => {
        try {
          await api.patch(`/tenants/${id}/approve`);
          showNotification('Approved', 'Tenant has been activated.', 'success');
          fetchTenants();
        } catch (err: any) {
          showNotification('Error', err.response?.data?.message || 'Approval failed', 'error');
        }
      }
    });
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading tenants...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search tenants..."
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>
        <button 
          onClick={handleOpenCreate}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus size={18} className="mr-2" />
          Add Tenant
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tenant</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Plan</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Admin Info</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {tenants.map((tenant) => (
              <tr key={tenant._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">{tenant.name}</div>
                  <div className="text-xs text-gray-500">{tenant.slug}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className="px-2 py-1 text-xs font-bold bg-blue-50 text-blue-700 rounded-md uppercase">
                    {tenant.plan}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    tenant.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {tenant.status === 'pending' && <Clock size={12} className="mr-1" />}
                    {tenant.status.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {tenant.settings?.adminEmail ? (
                    <div>
                      <div className="font-medium">{tenant.settings.adminName}</div>
                      <div className="text-xs">{tenant.settings.adminEmail}</div>
                    </div>
                  ) : 'Manually Created'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                  {tenant.status === 'pending' ? (
                    <button 
                      onClick={() => handleApprove(tenant._id)}
                      className="inline-flex items-center text-green-600 hover:text-green-800 font-bold"
                    >
                      <CheckCircle size={16} className="mr-1" />
                      Approve
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleOpenEdit(tenant)}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Manage
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingTenant ? "Manage Tenant" : "Add New Tenant"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tenant Name</label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={tenantData.name}
              onChange={(e) => setTenantData({ ...tenantData, name: e.target.value })}
              placeholder="e.g. Acme Corp"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={tenantData.slug}
              onChange={(e) => setTenantData({ ...tenantData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
              placeholder="e.g. acme-corp"
            />
          </div>
          {editingTenant && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Plan</label>
                <select
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  value={tenantData.plan}
                  onChange={(e) => setTenantData({ ...tenantData, plan: e.target.value })}
                >
                  <option value="free">Free</option>
                  <option value="pro">Pro</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  value={tenantData.status}
                  onChange={(e) => setTenantData({ ...tenantData, status: e.target.value })}
                >
                  <option value="pending">Pending</option>
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </>
          )}
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
              {editingTenant ? "Save Changes" : "Create Tenant"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TenantList;
