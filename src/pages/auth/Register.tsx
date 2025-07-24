import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Register: React.FC = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { 
    register, 
    handleSubmit, 
    watch,
    formState: { errors } 
  } = useForm<RegisterFormData>();
  
  const password = watch('password');

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError('');
    
    try {
      await registerUser(data.name, data.email, data.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to register');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-8 rounded-lg shadow-lg"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Create Account</h2>
      
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-error-50 text-error-700 p-3 rounded-md mb-4"
        >
          {error}
        </motion.div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            {...register('name', { 
              required: 'Name is required',
              minLength: {
                value: 2,
                message: 'Name must be at least 2 characters'
              }
            })}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all ${
              errors.name ? 'border-error-500' : 'border-gray-300'
            }`}
            placeholder="John Doe"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-error-600">{errors.name.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            {...register('email', { 
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all ${
              errors.email ? 'border-error-500' : 'border-gray-300'
            }`}
            placeholder="your@email.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-error-600">{errors.email.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            {...register('password', { 
              required: 'Password is required',
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters'
              }
            })}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all ${
              errors.password ? 'border-error-500' : 'border-gray-300'
            }`}
            placeholder="••••••••"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-error-600">{errors.password.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            {...register('confirmPassword', { 
              required: 'Please confirm your password',
              validate: value => value === password || 'Passwords do not match'
            })}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all ${
              errors.confirmPassword ? 'border-error-500' : 'border-gray-300'
            }`}
            placeholder="••••••••"
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-error-600">{errors.confirmPassword.message}</p>
          )}
        </div>
        
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 px-4 bg-primary-500 text-white rounded-lg font-medium transition-all ${
              isLoading 
                ? 'opacity-70 cursor-not-allowed'
                : 'hover:bg-primary-600 active:bg-primary-700'
            }`}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </div>
      </form>
      
      <div className="mt-6 text-center text-sm">
        <p className="text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
            Sign in
          </Link>
        </p>
      </div>
      
      <div className="mt-6 text-xs text-gray-500 text-center">
        By creating an account, you agree to our{' '}
        <a href="#" className="text-primary-600 hover:underline">Terms of Service</a>{' '}
        and{' '}
        <a href="#" className="text-primary-600 hover:underline">Privacy Policy</a>
      </div>
    </motion.div>
  );
};

export default Register;