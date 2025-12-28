"use client";
import React, { useState, useEffect } from 'react'; // CHANGED: Added useEffect
import { PencilIcon, CheckIcon } from '@heroicons/react/24/outline';

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<'menu' | 'profile' | 'change-password' | 'logout' | 'delete-account'>('menu');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // State for change password form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordErrors, setPasswordErrors] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Profile form states
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    membershipStatus: 'free' as 'free' | 'premium',
    userType: 'Patient',
    title: 'Mr.',
    fullName: 'Janaya Ransiluni',
    email: 'janaya@example.com',
    mobileNumber: '+94 77 123 4567',
    nicPassport: '123456789V'
  });
  
  const [formData, setFormData] = useState(userData);

  // CHANGED: Added useEffect to fetch user data
  useEffect(() => {
    if (activeSection === 'profile') {
      const fetchUserData = async () => {
        try {
          const response = await fetch('/api/me');
          const data = await response.json();
          setUserData(data);
          setFormData(data);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };
      fetchUserData();
    }
  }, [activeSection]);

  // CHANGED: Updated handleChangePassword to use API
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset errors
    setPasswordErrors({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });

    let hasError = false;
    const newErrors = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };

    if (!currentPassword) {
      newErrors.currentPassword = 'Current password is required';
      hasError = true;
    }

    if (!newPassword) {
      newErrors.newPassword = 'New password is required';
      hasError = true;
    } else if (newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters long';
      hasError = true;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirm password is required';
      hasError = true;
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      hasError = true;
    }

    if (hasError) {
      setPasswordErrors(newErrors);
      return;
    }

    try {
      const response = await fetch('/api/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword,
          newPassword
        })
      });

      const result = await response.json();

      if (response.ok) {
        alert('Password changed successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setActiveSection('menu');
      } else {
        alert(result.error || 'Failed to change password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Failed to change password');
    }
  };

  // CHANGED: Updated handleDeleteAccount to use API
  const handleDeleteAccount = async () => {
    try {
      const response = await fetch('/api/me', {
        method: 'DELETE'
      });
      
      if (response.ok) {
        alert('Your account has been deleted successfully.');
        // Redirect to home or login page
        // router.push('/');
      } else {
        alert('Failed to delete account');
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Failed to delete account');
    }
  };

  // CHANGED: Updated handleSaveClick to use API
  const handleSaveClick = async () => {
    try {
      const response = await fetch('/api/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const result = await response.json();
        setUserData(formData);
        setIsEditing(false);
        alert('Profile updated successfully!');
      } else {
        alert('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  const handleEditClick = () => {
    setFormData(userData);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setFormData(userData);
  };

  const handleFormChange = (field: keyof typeof userData, value: string) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  // Main Settings Menu (NO CHANGES)
  if (activeSection === 'menu') {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1 text-sm md:text-base">Manage your account settings</p>
        </div>

        {/* Settings Menu Options */}
        <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
          <button
            onClick={() => setActiveSection('profile')}
            className="w-full text-left px-6 py-4 hover:bg-gray-50 flex items-center justify-between"
          >
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-blue-600 font-semibold">👤</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">My Profile</h3>
                <p className="text-sm text-gray-500">View and edit your profile information</p>
              </div>
            </div>
            <span className="text-gray-400">→</span>
          </button>

          <button
            onClick={() => setActiveSection('change-password')}
            className="w-full text-left px-6 py-4 hover:bg-gray-50 flex items-center justify-between"
          >
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-green-600 font-semibold">🔒</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Change password</h3>
                <p className="text-sm text-gray-500">Update your password</p>
              </div>
            </div>
            <span className="text-gray-400">→</span>
          </button>

          <button
            onClick={() => {
              console.log('Logging out...');
              alert('You have been logged out');
            }}
            className="w-full text-left px-6 py-4 hover:bg-gray-50 flex items-center justify-between"
          >
            <div className="flex items-center">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-yellow-600 font-semibold">🚪</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Logout</h3>
                <p className="text-sm text-gray-500">Sign out from your account</p>
              </div>
            </div>
            <span className="text-gray-400">→</span>
          </button>

          <button
            onClick={() => setActiveSection('delete-account')}
            className="w-full text-left px-6 py-4 hover:bg-red-50 flex items-center justify-between"
          >
            <div className="flex items-center">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-red-600 font-semibold">🗑️</span>
              </div>
              <div>
                <h3 className="font-medium text-red-900">Delete Account</h3>
                <p className="text-sm text-red-500">Permanently delete your account</p>
              </div>
            </div>
            <span className="text-red-400">→</span>
          </button>
        </div>

        {/* Back button */}
        <div className="mt-6">
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            ← Back
          </button>
        </div>
      </div>
    );
  }

  // Change Password Section
  if (activeSection === 'change-password') {
    return (
      <div>
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <button
              onClick={() => setActiveSection('menu')}
              className="mr-3 text-gray-500 hover:text-gray-700"
            >
              ←
            </button>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Change Password</h1>
          </div>
          <p className="text-gray-600 mt-1 text-sm md:text-base pl-9">Update your account password</p>
        </div>

        <div className="max-w-md mx-auto">
          <form onSubmit={handleChangePassword} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current password *
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md ${
                  passwordErrors.currentPassword ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Enter current password"
              />
              {passwordErrors.currentPassword && (
                <p className="mt-1 text-sm text-red-600">{passwordErrors.currentPassword}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New password *
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md ${
                  passwordErrors.newPassword ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Enter new password"
              />
              {passwordErrors.newPassword && (
                <p className="mt-1 text-sm text-red-600">{passwordErrors.newPassword}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">Password must be at least 8 characters long</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm new password *
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md ${
                  passwordErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Confirm new password"
              />
              {passwordErrors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{passwordErrors.confirmPassword}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Change Password
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Delete Account Section
  if (activeSection === 'delete-account') {
    return (
      <div>
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <button
              onClick={() => setActiveSection('menu')}
              className="mr-3 text-gray-500 hover:text-gray-700"
            >
              ←
            </button>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Delete Account</h1>
          </div>
          <p className="text-gray-600 mt-1 text-sm md:text-base pl-9">Permanently delete your account</p>
        </div>

        {/* Delete Account Warning */}
        <div className="max-w-md mx-auto bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
              <span className="text-red-600 text-xl">⚠️</span>
            </div>
            <h3 className="text-lg font-semibold text-red-900">Warning: This action cannot be undone</h3>
          </div>
          <p className="text-red-700 mb-4">
            Deleting your account will permanently remove all your data including:
          </p>
          <ul className="text-red-700 list-disc pl-5 mb-4 space-y-1">
            <li>All appointment records</li>
            <li>Health records and medical history</li>
            <li>Payment information</li>
            <li>Personal profile data</li>
          </ul>
          <p className="text-red-700 font-medium">
            Are you sure you want to proceed?
          </p>
        </div>

        {/* Delete Account Confirmation */}
        <div className="max-w-md mx-auto">
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-2">You're going to delete your "Account"</h3>
            <p className="text-gray-600 mb-6">This action is permanent and cannot be reversed.</p>
            
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveSection('menu')}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                No, keep it
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Yes, Delete!
              </button>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md mx-4">
              <h3 className="text-xl font-bold text-red-900 mb-4">Confirm Deletion</h3>
              <p className="text-gray-700 mb-6">
                Are you absolutely sure you want to delete your account? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Yes, Delete Account
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // My Profile Section
  if (activeSection === 'profile') {
    return (
      <div>
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <button
              onClick={() => setActiveSection('menu')}
              className="mr-3 text-gray-500 hover:text-gray-700"
            >
              ←
            </button>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Profile</h1>
          </div>
          <p className="text-gray-600 mt-1 text-sm md:text-base pl-9">View and edit your profile information</p>
        </div>
        
        {/* Profile Form */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            {/* Membership Status */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Membership status
              </label>
              <div className="flex space-x-4">
                <button
                  onClick={() => handleFormChange('membershipStatus', 'free')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    formData.membershipStatus === 'free'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Free Member
                </button>
                <button
                  onClick={() => handleFormChange('membershipStatus', 'premium')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    formData.membershipStatus === 'premium'
                      ? 'bg-yellow-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Premium Member
                </button>
              </div>
            </div>
            
            {/* User Type & Title */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  User Type
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.userType}
                    onChange={(e) => handleFormChange('userType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{userData.userType}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                {isEditing ? (
                  <select
                    value={formData.title}
                    onChange={(e) => handleFormChange('title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Mr.">Mr.</option>
                    <option value="Mrs.">Mrs.</option>
                    <option value="Ms.">Ms.</option>
                    <option value="Dr.">Dr.</option>
                    <option value="Prof.">Prof.</option>
                  </select>
                ) : (
                  <p className="text-gray-900">{userData.title}</p>
                )}
              </div>
            </div>
            
            {/* Full Name */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleFormChange('fullName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <p className="text-gray-900">{userData.fullName}</p>
              )}
            </div>
            
            {/* Email & Mobile Number */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleFormChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{userData.email}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={formData.mobileNumber}
                    onChange={(e) => handleFormChange('mobileNumber', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{userData.mobileNumber}</p>
                )}
              </div>
            </div>
            
            {/* NIC / Passport */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                NIC / Passport
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.nicPassport}
                  onChange={(e) => handleFormChange('nicPassport', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <p className="text-gray-900">{userData.nicPassport}</p>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              {isEditing ? (
                <>
                  <button
                    onClick={handleCancelEdit}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveClick}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center"
                  >
                    <CheckIcon className="w-5 h-5 mr-2" />
                    Save Changes
                  </button>
                </>
              ) : (
                <button
                  onClick={handleEditClick}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center"
                >
                  <PencilIcon className="w-5 h-5 mr-2" />
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}