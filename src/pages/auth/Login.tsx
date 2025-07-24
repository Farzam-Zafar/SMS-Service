import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

interface LoginFormData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError('');
    
    try {
      await login(data.email, data.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  // For demo purposes
  const fillDemoCredentials = () => {
    document.getElementById('email')?.setAttribute('value', 'user@example.com');
    document.getElementById('password')?.setAttribute('value', 'password123');
  };

  const fillAdminCredentials = () => {
    document.getElementById('email')?.setAttribute('value', 'admin@example.com');
    document.getElementById('password')?.setAttribute('value', 'admin123');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-8 rounded-lg shadow-lg"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Welcome Back</h2>
      
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
          <div className="flex justify-between mb-1">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <Link 
              to="/forgot-password"
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              Forgot Password?
            </Link>
          </div>
          <input
            id="password"
            type="password"
            {...register('password', { 
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters'
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
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 px-4 bg-primary-500 text-white rounded-lg font-medium transition-all ${
              isLoading 
                ? 'opacity-70 cursor-not-allowed'
                : 'hover:bg-primary-600 active:bg-primary-700'
            }`}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </div>
      </form>
      
      <div className="mt-6 text-center text-sm">
        <p className="text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
            Sign up
          </Link>
        </p>
      </div>
      
      <div className="mt-8 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 mb-2 text-center">Demo Accounts</p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={fillDemoCredentials}
            className="flex-1 py-2 px-3 text-xs border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
          >
            Use Demo User
          </button>
          <button
            type="button"
            onClick={fillAdminCredentials}
            className="flex-1 py-2 px-3 text-xs border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
          >
            Use Demo Admin
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Login;