import { Outlet } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex flex-col md:flex-row">
      {/* Branding Section - Left side on desktop, top on mobile */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-primary-600 text-white md:w-2/5 lg:w-1/3 flex flex-col items-center justify-center p-8 md:p-12"
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center mb-6"
        >
          <MessageSquare size={48} className="mr-2" />
          <h1 className="text-3xl md:text-4xl font-bold">TextPulse</h1>
        </motion.div>
        <p className="text-lg md:text-xl text-center mb-8">
          Your all-in-one SMS solution for businesses and developers
        </p>
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="bg-white/10 p-4 rounded-lg backdrop-blur-sm"
          >
            <h2 className="font-semibold mb-2">Powerful API</h2>
            <p className="text-sm text-white/80">
              Integrate SMS functionality directly into your applications with our simple API
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="bg-white/10 p-4 rounded-lg backdrop-blur-sm"
          >
            <h2 className="font-semibold mb-2">Scalable Solutions</h2>
            <p className="text-sm text-white/80">
              From startups to enterprises, our platform grows with your needs
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="bg-white/10 p-4 rounded-lg backdrop-blur-sm"
          >
            <h2 className="font-semibold mb-2">Global Reach</h2>
            <p className="text-sm text-white/80">
              Send messages to customers worldwide with our reliable delivery network
            </p>
          </motion.div>
        </div>
      </motion.div>
      
      {/* Auth Form Section - Right side on desktop, bottom on mobile */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex-1 flex items-center justify-center p-6 md:p-12"
      >
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </motion.div>
    </div>
  );
};

export default AuthLayout;