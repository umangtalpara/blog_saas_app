import React, { useState } from 'react';
import { 
  User as UserIcon, 
  Lock, 
  Camera, 
  Check, 
  AlertCircle,
  Shield,
  Mail,
  Smartphone,
  Eye,
  EyeOff
} from 'lucide-react';
import api from '../../../shared/api/api';
import { useApp } from '../../../shared/context/AppContext';

const Settings: React.FC = () => {
  const { showNotification } = useApp();
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Robust user retrieval
  const rawUser = localStorage.getItem('user');
  const user = JSON.parse(rawUser || '{}');
  const userId = user._id || user.id;

  const [profileData, setProfileData] = useState({
    name: user.name || '',
    email: user.email || '',
    profilePic: user.profilePic || ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      console.error('User data in localStorage:', user);
      return showNotification('Error', 'User identification missing. Please try logging in again.', 'error');
    }
    setLoading(true);
    try {
      const response = await api.patch(`/users/${userId}`, {
        name: profileData.name,
        profilePic: profileData.profilePic
      });
      
      // Merge update to prevent losing fields like _id/id
      const updatedUser = { ...user, ...response.data };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      showNotification('Success', 'Profile updated successfully', 'success');
    } catch (err: any) {
      showNotification('Error', err.response?.data?.message || 'Failed to update profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      return showNotification('Error', 'User identification missing.', 'error');
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return showNotification('Error', 'New passwords do not match', 'error');
    }
    
    setLoading(true);
    try {
      await api.patch(`/users/${userId}/password`, {
        password: passwordData.newPassword,
        currentPassword: passwordData.currentPassword
      });
      showNotification('Success', 'Password changed successfully', 'success');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      showNotification('Error', err.response?.data?.message || 'Failed to change password', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you'd upload this to S3/Cloudinary
      // For now, we'll use a local preview or placeholder
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData({ ...profileData, profilePic: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-4xl space-y-12 pb-20">
      <div>
        <h2 className="text-4xl font-black text-gray-900 mb-2">Account Settings</h2>
        <p className="text-gray-500 font-medium">Manage your personal information and security preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Profile Section */}
        <div className="md:col-span-2 space-y-8">
          <section className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
            <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3">
              <UserIcon className="text-blue-600" size={24} />
              Personal Information
            </h3>
            
            <form onSubmit={handleProfileUpdate} className="space-y-6">
              <div className="flex items-center gap-8 mb-10">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-[32px] bg-blue-50 border-4 border-white shadow-xl flex items-center justify-center overflow-hidden">
                    {profileData.profilePic ? (
                      <img src={profileData.profilePic} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-3xl font-black text-blue-600">{profileData.name.charAt(0)}</span>
                    )}
                  </div>
                  <label className="absolute -bottom-2 -right-2 p-2 bg-gray-900 text-white rounded-xl cursor-pointer hover:bg-blue-600 transition-all shadow-lg border-2 border-white">
                    <Camera size={16} />
                    <input type="file" className="hidden" accept="image/*" onChange={handleProfilePicChange} />
                  </label>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900">Profile Picture</h4>
                  <p className="text-sm text-gray-500">JPG, GIF or PNG. Max size of 2MB.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Full Name</label>
                  <input
                    type="text"
                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all font-bold text-gray-900"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Email Address</label>
                  <div className="relative">
                    <input
                      type="email"
                      disabled
                      className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-gray-400 cursor-not-allowed"
                      value={profileData.email}
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <Check className="text-green-500" size={18} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3.5 bg-gray-900 text-white rounded-2xl font-black hover:bg-blue-600 shadow-lg shadow-gray-200 transition-all active:scale-95 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </section>

          {/* Security Section */}
          <section className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
            <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3">
              <Lock className="text-red-500" size={24} />
              Security & Password
            </h3>
            
            <form onSubmit={handlePasswordChange} className="space-y-6">
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Current Password</label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    required
                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all font-bold pr-12"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">New Password</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all font-bold pr-12"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Confirm New Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all font-bold pr-12"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3.5 bg-gray-900 text-white rounded-2xl font-black hover:bg-red-600 shadow-lg shadow-gray-200 transition-all active:scale-95 disabled:opacity-50"
                >
                  {loading ? 'Updating...' : 'Change Password'}
                </button>
              </div>
            </form>
          </section>
        </div>

        {/* Info Sidebar */}
        <div className="space-y-6">
          <div className="bg-blue-600 p-8 rounded-[40px] text-white shadow-xl shadow-blue-100">
            <Shield size={32} className="mb-6 opacity-50" />
            <h4 className="text-xl font-black mb-4 tracking-tight">Security Tips</h4>
            <ul className="space-y-4 text-sm font-medium text-blue-100">
              <li className="flex gap-3">
                <div className="mt-1"><Check size={14} /></div>
                Use at least 12 characters
              </li>
              <li className="flex gap-3">
                <div className="mt-1"><Check size={14} /></div>
                Mix uppercase & lowercase
              </li>
              <li className="flex gap-3">
                <div className="mt-1"><Check size={14} /></div>
                Add symbols & numbers
              </li>
            </ul>
          </div>

          <div className="bg-gray-50 p-8 rounded-[40px] border border-gray-100">
            <AlertCircle size={32} className="mb-6 text-gray-400" />
            <h4 className="text-xl font-black text-gray-900 mb-4 tracking-tight">Need Help?</h4>
            <p className="text-sm text-gray-500 font-medium leading-relaxed mb-6">
              If you're having trouble with your account or security settings, contact our support team.
            </p>
            <button className="text-sm font-black text-blue-600 uppercase tracking-widest hover:underline">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
