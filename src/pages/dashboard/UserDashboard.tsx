import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Bar } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { 
  MessageSquare, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  ArrowRight,
  TrendingUp 
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Dashboard mock data
const mockSentMessages = [
  { id: 1, phone: '+1234567890', content: 'Your verification code is 123456', status: 'delivered', timestamp: '2025-01-15T10:35:22' },
  { id: 2, phone: '+1987654321', content: 'Your order #A12345 has been shipped!', status: 'delivered', timestamp: '2025-01-14T15:21:05' },
  { id: 3, phone: '+1122334455', content: 'Your appointment is scheduled for tomorrow at 2 PM', status: 'failed', timestamp: '2025-01-14T09:45:12' },
  { id: 4, phone: '+1555555555', content: '20% off on your next purchase! Use code SAVE20', status: 'pending', timestamp: '2025-01-13T17:02:45' },
];

const mockUsageData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'SMS Sent',
      data: [250, 420, 380, 570, 620, 350],
      backgroundColor: 'rgba(51, 102, 255, 0.6)',
      borderColor: 'rgba(51, 102, 255, 1)',
      borderWidth: 1,
    },
  ],
};

const mockStatusData = {
  delivered: 1245,
  failed: 36,
  pending: 58,
};

const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-16 w-16 bg-primary-100 rounded-full mb-4"></div>
          <div className="h-4 w-48 bg-primary-100 rounded mb-2"></div>
          <div className="h-3 w-36 bg-primary-50 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome and credits section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-6 rounded-lg shadow-sm"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Welcome back, {user?.name || 'User'}</h2>
            <p className="text-gray-500 mt-1">Here's an overview of your messaging activity</p>
          </div>
          <div className="bg-primary-50 p-4 rounded-lg flex flex-col items-center md:items-start">
            <span className="text-sm text-primary-600 font-medium">Available Credits</span>
            <div className="flex items-baseline">
              <span className="text-3xl font-bold text-primary-700">{user?.credits || 0}</span>
              <Link to="/buy-credits" className="text-primary-600 hover:text-primary-700 ml-2 text-sm flex items-center">
                Buy more <ArrowRight size={14} className="ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white p-6 rounded-lg shadow-sm"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Delivered</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">{mockStatusData.delivered}</h3>
              <p className="text-success-600 text-sm flex items-center mt-1">
                <TrendingUp size={14} className="mr-1" />
                +12% from last month
              </p>
            </div>
            <div className="bg-success-100 p-3 rounded-full">
              <CheckCircle className="h-6 w-6 text-success-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white p-6 rounded-lg shadow-sm"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Failed</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">{mockStatusData.failed}</h3>
              <p className="text-error-600 text-sm flex items-center mt-1">
                <TrendingUp size={14} className="mr-1" />
                +2% from last month
              </p>
            </div>
            <div className="bg-error-100 p-3 rounded-full">
              <AlertCircle className="h-6 w-6 text-error-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white p-6 rounded-lg shadow-sm"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Pending</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">{mockStatusData.pending}</h3>
              <p className="text-gray-500 text-sm flex items-center mt-1">
                <Clock size={14} className="mr-1" />
                Being processed
              </p>
            </div>
            <div className="bg-warning-100 p-3 rounded-full">
              <Clock className="h-6 w-6 text-warning-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Chart and recent messages section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Usage chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white p-6 rounded-lg shadow-sm xl:col-span-2"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">SMS Usage</h3>
          <div className="h-64">
            <Bar 
              data={mockUsageData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top' as const,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }} 
            />
          </div>
        </motion.div>

        {/* Recent messages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white p-6 rounded-lg shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Recent Messages</h3>
            <Link 
              to="/messages" 
              className="text-sm text-primary-600 hover:text-primary-700 flex items-center"
            >
              View all <ArrowRight size={14} className="ml-1" />
            </Link>
          </div>
          <div className="space-y-3">
            {mockSentMessages.map(message => (
              <div key={message.id} className="p-3 border border-gray-100 rounded-lg">
                <div className="flex items-start justify-between">
                  <p className="font-medium text-gray-800 truncate max-w-[180px]">{message.phone}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    message.status === 'delivered' 
                      ? 'bg-success-100 text-success-700' 
                      : message.status === 'failed' 
                        ? 'bg-error-100 text-error-700'
                        : 'bg-warning-100 text-warning-700'
                  }`}>
                    {message.status}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mt-1 truncate">{message.content}</p>
                <p className="text-gray-400 text-xs mt-2">
                  {new Date(message.timestamp).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <Link
          to="/send-sms"
          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow flex items-center space-x-4"
        >
          <div className="bg-primary-100 p-3 rounded-full">
            <MessageSquare className="h-6 w-6 text-primary-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Send SMS</h3>
            <p className="text-sm text-gray-500">Compose and send new messages</p>
          </div>
        </Link>
        
        <Link
          to="/buy-credits"
          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow flex items-center space-x-4"
        >
          <div className="bg-secondary-100 p-3 rounded-full">
            <MessageSquare className="h-6 w-6 text-secondary-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Buy Credits</h3>
            <p className="text-sm text-gray-500">Get more SMS credits</p>
          </div>
        </Link>
        
        <Link
          to="/api-docs"
          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow flex items-center space-x-4"
        >
          <div className="bg-accent-100 p-3 rounded-full">
            <MessageSquare className="h-6 w-6 text-accent-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">API Access</h3>
            <p className="text-sm text-gray-500">Integrate with your applications</p>
          </div>
        </Link>
      </motion.div>
    </div>
  );
};

export default UserDashboard;