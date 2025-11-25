import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Settings, Phone, Mail, User as UserIcon, Loader2, X, CheckCircle, AlertCircle, Shield, Key, Eye, EyeOff } from 'lucide-react';
import { getProfile } from '../../features/auth/authSlice';
import authService from '../../services/authService';
import adminService from '../../services/adminService';

function AdminSettings() {
  const dispatch = useDispatch();
  const { user, isLoading } = useSelector((state) => state.auth);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPasswordResetModalOpen, setIsPasswordResetModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
  });
  const [passwordResetData, setPasswordResetData] = useState({
    email: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [resettingPassword, setResettingPassword] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [passwordResetError, setPasswordResetError] = useState(null);
  const [passwordResetSuccess, setPasswordResetSuccess] = useState(false);

  useEffect(() => {
    if (!user) {
      dispatch(getProfile());
    }
  }, [user, dispatch]);

  useEffect(() => {
    if (user && user.role === 'admin') {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordResetChange = (e) => {
    const { name, value } = e.target;
    setPasswordResetData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear errors when user types
    if (passwordResetError) setPasswordResetError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      await authService.updateProfile(formData);
      await dispatch(getProfile());
      setSuccess(true);
      setTimeout(() => {
        setIsModalOpen(false);
        setSuccess(false);
      }, 1200);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordResetSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords match
    if (passwordResetData.newPassword !== passwordResetData.confirmPassword) {
      setPasswordResetError('Passwords do not match');
      return;
    }

    // Validate password length
    if (passwordResetData.newPassword.length < 6) {
      setPasswordResetError('Password must be at least 6 characters long');
      return;
    }

    setResettingPassword(true);
    setPasswordResetError(null);
    setPasswordResetSuccess(false);

    try {
      await adminService.resetUserPassword(
        passwordResetData.email,
        passwordResetData.newPassword,
        passwordResetData.confirmPassword
      );
      setPasswordResetSuccess(true);
      setTimeout(() => {
        setIsPasswordResetModalOpen(false);
        setPasswordResetData({ email: '', newPassword: '', confirmPassword: '' });
        setPasswordResetSuccess(false);
      }, 2000);
    } catch (err) {
      setPasswordResetError(err.response?.data?.message || err.message || 'Failed to reset password');
    } finally {
      setResettingPassword(false);
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="space-y-4">
        <div className="bg-white rounded-xl shadow-sm p-6 flex items-center space-x-3">
          <Loader2 className="w-5 h-5 text-red-600 animate-spin" />
          <p className="text-sm text-gray-700">Loading admin settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <Settings className="w-6 h-6 text-red-600" />
            <span>Admin Settings</span>
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage your admin profile and contact information.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: Admin Overview */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl shadow-sm p-5">
            <div className="flex items-start space-x-4 border-b border-gray-100 pb-4 mb-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                {(user.firstName || user.email || 'A').charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold text-gray-900 truncate">
                  {user.firstName ? `${user.firstName} ${user.lastName || ''}` : 'Admin User'}
                </h2>
                <p className="text-sm text-gray-500 mt-1 truncate">{user.email}</p>
                <p className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-100">
                  <Shield className="w-3 h-3 mr-1" />
                  System Admin
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs font-medium text-gray-500 mb-1 flex items-center space-x-1">
                  <UserIcon className="w-4 h-4 text-gray-400" />
                  <span>Full Name</span>
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  {user.firstName ? `${user.firstName} ${user.lastName || ''}` : 'Not set'}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs font-medium text-gray-500 mb-1 flex items-center space-x-1">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span>Email</span>
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  {user.email || 'Not set'}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs font-medium text-gray-500 mb-1 flex items-center space-x-1">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span>Phone</span>
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  {user.phoneNumber || 'Not set'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Quick actions */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-sm p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setSuccess(false);
                  setIsModalOpen(true);
                }}
                className="block w-full text-center px-4 py-2.5 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition"
              >
                Edit Profile Details
              </button>
              <button
                type="button"
                onClick={() => {
                  setPasswordResetError(null);
                  setPasswordResetSuccess(false);
                  setPasswordResetData({ email: '', newPassword: '', confirmPassword: '' });
                  setIsPasswordResetModalOpen(true);
                }}
                className="block w-full text-center px-4 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition flex items-center justify-center space-x-2"
              >
                <Key className="w-4 h-4" />
                <span>Reset User Password</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/10 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col relative">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                  <Settings className="w-5 h-5 text-red-600" />
                  <span>Edit Admin Profile</span>
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Update your name and contact information.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (!saving) {
                    setIsModalOpen(false);
                    setError(null);
                    setSuccess(false);
                  }
                }}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {/* First Name */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                  required
                />
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                  required
                />
              </div>

              {/* Email (read-only) */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
                  disabled
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                  required
                />
              </div>

              {/* Error / Success */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start space-x-2 text-xs">
                  <AlertCircle className="w-4 h-4 text-red-600 mt-0.5" />
                  <div className="text-red-800">
                    <p className="font-semibold">Error</p>
                    <p>{error}</p>
                  </div>
                </div>
              )}
              {success && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-start space-x-2 text-xs">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                  <div className="text-green-800">
                    <p className="font-semibold">Saved</p>
                    <p>Profile updated successfully.</p>
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    if (!saving) {
                      setIsModalOpen(false);
                      setError(null);
                      setSuccess(false);
                    }
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {isPasswordResetModalOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/10 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col relative">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                  <Key className="w-5 h-5 text-blue-600" />
                  <span>Reset User Password</span>
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Reset password for a user who forgot their password.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (!resettingPassword) {
                    setIsPasswordResetModalOpen(false);
                    setPasswordResetError(null);
                    setPasswordResetSuccess(false);
                    setPasswordResetData({ email: '', newPassword: '', confirmPassword: '' });
                  }
                }}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handlePasswordResetSubmit} className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {/* Email */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  User Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={passwordResetData.email}
                  onChange={handlePasswordResetChange}
                  placeholder="user@example.com"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              {/* New Password */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  New Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="newPassword"
                    value={passwordResetData.newPassword}
                    onChange={handlePasswordResetChange}
                    placeholder="Enter new password"
                    className="w-full px-3 py-2.5 pr-10 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters long</p>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Confirm New Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={passwordResetData.confirmPassword}
                    onChange={handlePasswordResetChange}
                    placeholder="Confirm new password"
                    className="w-full px-3 py-2.5 pr-10 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Error / Success */}
              {passwordResetError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start space-x-2 text-xs">
                  <AlertCircle className="w-4 h-4 text-red-600 mt-0.5" />
                  <div className="text-red-800">
                    <p className="font-semibold">Error</p>
                    <p>{passwordResetError}</p>
                  </div>
                </div>
              )}
              {passwordResetSuccess && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-start space-x-2 text-xs">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                  <div className="text-green-800">
                    <p className="font-semibold">Success</p>
                    <p>Password reset successfully for {passwordResetData.email}</p>
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    if (!resettingPassword) {
                      setIsPasswordResetModalOpen(false);
                      setPasswordResetError(null);
                      setPasswordResetSuccess(false);
                      setPasswordResetData({ email: '', newPassword: '', confirmPassword: '' });
                    }
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={resettingPassword}
                  className="inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {resettingPassword && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{resettingPassword ? 'Resetting...' : 'Reset Password'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminSettings;
