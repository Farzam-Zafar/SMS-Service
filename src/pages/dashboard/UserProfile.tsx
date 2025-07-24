import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { 
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  Globe,
  Save,
  Shield
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface ProfileFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  website: string;
}

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const UserProfile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState('');
  
  // Form for profile
  const { 
    register: registerProfile, 
    handleSubmit: handleSubmitProfile, 
    formState: { errors: errorsProfile } 
  } = useForm<ProfileFormData>({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: '',
      company: '',
      address: '',
      website: ''
    }
  });
  
  // Form for password change
  const { 
    register: registerPassword, 
    handleSubmit: handleSubmitPassword, 
    watch: watchPassword,
    reset: resetPassword,
    formState: { errors: errorsPassword } 
  } = useForm<PasswordFormData>();
  
  const newPassword = watchPassword('newPassword');
  
  const onSubmitProfile = async (data: ProfileFormData) => {
    setIsUpdating(true);
    setUpdateSuccess(false);
    setUpdateError('');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update user data (in a real app, this would be a backend API call)
      updateUser({
        name: data.name
        // Other fields would be updated here
      });
      
      setUpdateSuccess(true);
    } catch (error) {
      setUpdateError('Failed to update profile. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };
  
  const onSubmitPassword = async (data: PasswordFormData) => {
    setIsUpdating(true);
    setUpdateSuccess(false);
    setUpdateError('');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Check if current password is correct (this is just for demo)
      if (data.currentPassword !== 'password123' && data.currentPassword !== 'admin123') {
        throw new Error('Current password is incorrect');
      }
      
      // In a real app, this would update the password in the backend
      setUpdateSuccess(true);
      resetPassword();
      
    } catch (error) {
      setUpdateError(error instanceof Error ? error.message : 'Failed to update password');
    } finally {
      setIsUpdating(false);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-6 rounded-lg shadow-sm mb-6"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Profile</h2>
        
        {/* Tabs */}
        <div className="flex border-b mb-6">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'profile'
                ? 'text-primary-600 border-b-2 border-primary-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <span className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              Profile Information
            </span>
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'security'
                ? 'text-primary-600 border-b-2 border-primary-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <span className="flex items-center">
              <Shield className="h-4 w-4 mr-2" />
              Security
            </span>
          </button>
        </div>
        
        {/* Success/Error messages */}
        {updateSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-success-50 text-success-700 p-4 rounded-md mb-6"
          >
            <p className="font-medium">
              {activeTab === 'profile' ? 'Profile updated successfully!' : 'Password changed successfully!'}
            </p>
          </motion.div>
        )}
        
        {updateError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-error-50 text-error-700 p-4 rounded-md mb-6"
          >
            <p className="font-medium">{updateError}</p>
          </motion.div>
        )}
        
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSubmitProfile(onSubmitProfile)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <User className="h-5 w-5" />
                  </div>
                  <input
                    id="name"
                    type="text"
                    {...registerProfile('name', { 
                      required: 'Name is required',
                      minLength: {
                        value: 2,
                        message: 'Name must be at least 2 characters'
                      }
                    })}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all ${
                      errorsProfile.name ? 'border-error-500' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errorsProfile.name && (
                  <p className="mt-1 text-sm text-error-600">{errorsProfile.name.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <Mail className="h-5 w-5" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    disabled
                    {...registerProfile('email')}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <Phone className="h-5 w-5" />
                  </div>
                  <input
                    id="phone"
                    type="tel"
                    {...registerProfile('phone')}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                    placeholder="+1234567890"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                  Company
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <Building className="h-5 w-5" />
                  </div>
                  <input
                    id="company"
                    type="text"
                    {...registerProfile('company')}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                    placeholder="Company name (optional)"
                  />
                </div>
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-3 text-gray-400">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <textarea
                    id="address"
                    rows={2}
                    {...registerProfile('address')}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                    placeholder="Your address (optional)"
                  />
                </div>
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                  Website
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <Globe className="h-5 w-5" />
                  </div>
                  <input
                    id="website"
                    type="url"
                    {...registerProfile('website')}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                    placeholder="https://example.com (optional)"
                  />
                </div>
              </div>
            </div>
            
            <div className="pt-4">
              <button
                type="submit"
                disabled={isUpdating}
                className={`px-6 py-2 bg-primary-500 text-white rounded-lg font-medium flex items-center transition-all ${
                  isUpdating 
                    ? 'opacity-70 cursor-not-allowed'
                    : 'hover:bg-primary-600 active:bg-primary-700'
                }`}
              >
                {isUpdating ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </span>
                )}
              </button>
            </div>
          </form>
        )}
        
        {/* Security Tab */}
        {activeTab === 'security' && (
          <form onSubmit={handleSubmitPassword(onSubmitPassword)} className="space-y-6">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Current Password
              </label>
              <input
                id="currentPassword"
                type="password"
                {...registerPassword('currentPassword', { 
                  required: 'Current password is required'
                })}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all ${
                  errorsPassword.currentPassword ? 'border-error-500' : 'border-gray-300'
                }`}
                placeholder="••••••••"
              />
              {errorsPassword.currentPassword && (
                <p className="mt-1 text-sm text-error-600">{errorsPassword.currentPassword.message}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">For demo, use "password123" or "admin123"</p>
            </div>
            
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                id="newPassword"
                type="password"
                {...registerPassword('newPassword', { 
                  required: 'New password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters'
                  },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/,
                    message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
                  }
                })}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all ${
                  errorsPassword.newPassword ? 'border-error-500' : 'border-gray-300'
                }`}
                placeholder="••••••••"
              />
              {errorsPassword.newPassword && (
                <p className="mt-1 text-sm text-error-600">{errorsPassword.newPassword.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                {...registerPassword('confirmPassword', { 
                  required: 'Please confirm your password',
                  validate: value => value === newPassword || 'Passwords do not match'
                })}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all ${
                  errorsPassword.confirmPassword ? 'border-error-500' : 'border-gray-300'
                }`}
                placeholder="••••••••"
              />
              {errorsPassword.confirmPassword && (
                <p className="mt-1 text-sm text-error-600">{errorsPassword.confirmPassword.message}</p>
              )}
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Password Requirements</h3>
              <ul className="text-xs text-gray-500 space-y-1">
                <li className="flex items-center">
                  <span className={`h-2 w-2 rounded-full mr-2 ${newPassword?.length >= 8 ? 'bg-success-500' : 'bg-gray-300'}`}></span>
                  At least 8 characters long
                </li>
                <li className="flex items-center">
                  <span className={`h-2 w-2 rounded-full mr-2 ${/[A-Z]/.test(newPassword || '') ? 'bg-success-500' : 'bg-gray-300'}`}></span>
                  At least one uppercase letter
                </li>
                <li className="flex items-center">
                  <span className={`h-2 w-2 rounded-full mr-2 ${/[a-z]/.test(newPassword || '') ? 'bg-success-500' : 'bg-gray-300'}`}></span>
                  At least one lowercase letter
                </li>
                <li className="flex items-center">
                  <span className={`h-2 w-2 rounded-full mr-2 ${/\d/.test(newPassword || '') ? 'bg-success-500' : 'bg-gray-300'}`}></span>
                  At least one number
                </li>
              </ul>
            </div>
            
            <div className="pt-4">
              <button
                type="submit"
                disabled={isUpdating}
                className={`px-6 py-2 bg-primary-500 text-white rounded-lg font-medium flex items-center transition-all ${
                  isUpdating 
                    ? 'opacity-70 cursor-not-allowed'
                    : 'hover:bg-primary-600 active:bg-primary-700'
                }`}
              >
                {isUpdating ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Shield className="h-4 w-4 mr-2" />
                    Change Password
                  </span>
                )}
              </button>
            </div>
          </form>
        )}
      </motion.div>
      
      {/* Account Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white p-6 rounded-lg shadow-sm"
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Information</h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Account Type</p>
              <p className="font-medium text-gray-800">{user?.role === 'admin' ? 'Administrator' : 'Standard'}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Member Since</p>
              <p className="font-medium text-gray-800">{new Date(user?.createdAt || new Date()).toLocaleDateString()}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Current SMS Balance</p>
              <p className="font-medium text-gray-800">{user?.credits || 0} credits</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default UserProfile;