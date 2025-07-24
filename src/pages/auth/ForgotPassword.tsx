import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface ForgotPasswordFormData {
  email: string;
}

const ForgotPassword: React.FC = () => {
  const { forgotPassword } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<ForgotPasswordFormData>();

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    setError('');
    setSuccess(false);
    
    try {
      await forgotPassword(data.email);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process request');
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
      <Link to="/login" className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700 mb-6">
        <ArrowLeft size={16} className="mr-1" />
        Back to login
      </Link>
      
      <h2 className="text-2xl font-bold text-gray-800 mb-3">Reset Password</h2>
      <p className="text-gray-600 mb-6">
        Enter your email address and we'll send you instructions to reset your password.
      </p>
      
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-error-50 text-error-700 p-3 rounded-md mb-4"
        >
          {error}
        </motion.div>
      )}
      
      {success ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-success-50 text-success-700 p-4 rounded-md mb-4"
        >
          <h3 className="font-medium mb-1">Check your email</h3>
          <p className="text-sm">
            We sent password reset instructions to your email address. Please check your inbox.
          </p>
        </motion.div>
      ) : (
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
              {isLoading ? 'Sending...' : 'Send Reset Instructions'}
            </button>
          </div>
        </form>
      )}
      
      <div className="mt-6 text-center text-sm">
        <p className="text-gray-600">
          Remember your password?{' '}
          <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default ForgotPassword;