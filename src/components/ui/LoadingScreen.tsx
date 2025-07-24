import { MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

const LoadingScreen: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center"
      >
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 2, -2, 0]
          }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity,
            repeatType: "loop" 
          }}
          className="text-primary-500 mb-4"
        >
          <MessageSquare size={48} />
        </motion.div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">TextPulse</h1>
        <motion.div
          animate={{ 
            opacity: [0.5, 1, 0.5],
          }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity,
            repeatType: "loop" 
          }}
        >
          <p className="text-gray-500">Loading your messaging platform...</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoadingScreen;