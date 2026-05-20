import React, { useEffect, useState } from 'react';
import { Plus, Globe, CheckCircle, XCircle, Info, RefreshCw, Trash2 } from 'lucide-react';
import api from '../../../shared/api/api';
import Modal from '../../../shared/components/Modal';
import { useApp } from '../../../shared/context/AppContext';

interface Domain {
  _id: string;
  domain: string;
  verified: boolean;
  verificationToken: string;
}

const DomainList: React.FC = () => {
  const { showNotification, showConfirm } = useApp();
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDomain, setNewDomain] = useState('');

  useEffect(() => {
    fetchDomains();
  }, []);

  const fetchDomains = async () => {
    try {
      const response = await api.get('/domains');
      setDomains(response.data);
    } catch (err: any) {
      console.error('Failed to fetch domains');
    } finally {
      setLoading(false);
    }
  };

  const handleAddDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/domains', { domain: newDomain });
      setNewDomain('');
      setIsModalOpen(false);
      showNotification('Success', 'Domain added successfully', 'success');
      fetchDomains();
    } catch (err: any) {
      showNotification('Error', err.response?.data?.message || 'Failed to add domain', 'error');
    }
  };

  const handleVerify = async (id: string) => {
    setVerifying(id);
    try {
      await api.post(`/domains/${id}/verify`);
      fetchDomains();
      showNotification('Verified', 'Domain verified successfully!', 'success');
    } catch (err: any) {
      showNotification('Verification Failed', err.response?.data?.message || 'Verification failed. Please check your DNS records.', 'error');
    } finally {
      setVerifying(null);
    }
  };

  const handleDelete = async (id: string) => {
    showConfirm({
      title: 'Remove Domain',
      message: 'Are you sure you want to remove this domain?',
      confirmText: 'Remove',
      type: 'danger',
      onConfirm: async () => {
        try {
          await api.delete(`/domains/${id}`);
          showNotification('Removed', 'Domain removed successfully', 'success');
          fetchDomains();
        } catch (err: any) {
          showNotification('Error', 'Failed to delete domain', 'error');
        }
      }
    });
  };

  if (loading) return <div>Loading domains...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold">Custom Domains</h3>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} className="mr-2" />
          Add Domain
        </button>
      </div>

      <div className="grid gap-6">
        {domains.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-xl border border-gray-200 text-gray-500">
            <Globe size={48} className="mx-auto mb-4 opacity-20" />
            <p>No custom domains added yet.</p>
          </div>
        ) : (
          domains.map((domain) => (
            <div key={domain._id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  <Globe className="text-blue-500 mr-3" size={24} />
                  <div>
                    <h4 className="text-lg font-bold">{domain.domain}</h4>
                    <div className="flex items-center mt-1">
                      {domain.verified ? (
                        <span className="flex items-center text-sm text-green-600 font-medium">
                          <CheckCircle size={14} className="mr-1" /> Verified
                        </span>
                      ) : (
                        <span className="flex items-center text-sm text-yellow-600 font-medium">
                          <XCircle size={14} className="mr-1" /> Pending Verification
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {!domain.verified && (
                    <button 
                      onClick={() => handleVerify(domain._id)}
                      disabled={verifying === domain._id}
                      className="flex items-center px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium disabled:opacity-50"
                    >
                      {verifying === domain._id ? <RefreshCw size={14} className="mr-2 animate-spin" /> : <CheckCircle size={14} className="mr-2" />}
                      Verify Now
                    </button>
                  )}
                  <button 
                    onClick={() => handleDelete(domain._id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {!domain.verified && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <div className="flex items-start">
                    <Info className="text-blue-500 mr-2 mt-0.5 shrink-0" size={16} />
                    <div className="text-sm text-blue-800 space-y-2">
                      <p className="font-semibold">Verification Required</p>
                      <p>To verify ownership, add the following TXT record to your DNS settings for <strong>{domain.domain}</strong>:</p>
                      <div className="bg-white p-2 rounded border border-blue-200 font-mono text-xs select-all">
                        Type: TXT<br />
                        Name: @ (or leave empty)<br />
                        Value: blogerp-verification={domain.verificationToken}
                      </div>
                      <p className="text-xs text-blue-600 italic">Note: DNS changes can take up to 24-48 hours to propagate, but usually happen within minutes.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Custom Domain">
        <form onSubmit={handleAddDomain} className="space-y-4">
          <p className="text-sm text-gray-600 mb-4">
            Enter the custom domain you'd like to use for your blog. You'll need to verify ownership afterwards.
          </p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Domain Name</label>
            <input
              type="text"
              required
              placeholder="e.g. blog.mydomain.com"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newDomain}
              onChange={(e) => setNewDomain(e.target.value.toLowerCase())}
            />
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
              Add Domain
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default DomainList;
