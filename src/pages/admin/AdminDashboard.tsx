import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Bar, Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  LineElement,
  PointElement,
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { 
  Users, 
  MessageSquare, 
  AlertCircle, 
  CreditCard, 
  TrendingUp,
  ArrowRight,
  ArrowUpRight
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

// Dashboard mock data
const mockUserData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'New Users',
      data: [22, 35, 41, 49, 62, 74],
      borderColor: 'rgba(51, 102, 255, 1)',
      backgroundColor: 'rgba(51, 102, 255, 0.5)',
    },
  ],
};

const mockMessagesData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Messages Sent',
      data: [1200, 1900, 2300, 2800, 3500, 4200],
      backgroundColor: 'rgba(0, 191, 165, 0.6)',
      borderColor: 'rgba(0, 191, 165, 1)',
      borderWidth: 1,
    },
  ],
};

const mockRevenueData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Revenue ($)',
      data: [4500, 5200, 6800, 8100, 9500, 12000],
      borderColor: 'rgba(255, 152, 0, 1)',
      backgroundColor: 'rgba(255, 152, 0, 0.1)',
      fill: true,
      tension: 0.4,
    },
  ],
};

const mockRecentUsers = [
  { id: 1, name: 'John Smith', email: 'john@example.com', credits: 250, joined: '2025-01-10' },
  { id: 2, name: 'Sarah Johnson', email: 'sarah@example.com', credits: 500, joined: '2025-01-12' },
  { id: 3, name: 'Michael Brown', email: 'michael@example.com', credits: 100, joined: '2025-01-15' },
  { id: 4, name: 'Emily Davis', email: 'emily@example.com', credits: 350, joined: '2025-01-16' },
];

const mockRecentTransactions = [
  { id: 1, user: 'John Smith', package: 'Standard', amount: 20, date: '2025-01-15' },
  { id: 2, name: 'Sarah Johnson', package: 'Premium', amount: 65, date: '2025-01-14' },
  { id: 3, name: 'Michael Brown', package: 'Basic', amount: 5, date: '2025-01-13' },
  { id: 4, name: 'Emily Davis', package: 'Standard', amount: 20, date: '2025-01-12' },
];

const AdminDashboard: React.FC = () => {
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
      {/* Welcome section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-6 rounded-lg shadow-sm"
      >
        <h2 className="text-2xl font-bold text-gray-800">Admin Dashboard</h2>
        <p className="text-gray-500 mt-1">Overview of platform performance and metrics</p>
      </motion.div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white p-6 rounded-lg shadow-sm"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Total Users</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">842</h3>
              <p className="text-success-600 text-sm flex items-center mt-1">
                <TrendingUp size={14} className="mr-1" />
                +12% from last month
              </p>
            </div>
            <div className="bg-primary-100 p-3 rounded-full">
              <Users className="h-6 w-6 text-primary-600" />
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
              <p className="text-gray-500 text-sm">Messages Sent</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">126,482</h3>
              <p className="text-success-600 text-sm flex items-center mt-1">
                <TrendingUp size={14} className="mr-1" />
                +24% from last month
              </p>
            </div>
            <div className="bg-secondary-100 p-3 rounded-full">
              <MessageSquare className="h-6 w-6 text-secondary-600" />
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
              <p className="text-gray-500 text-sm">Failed Messages</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">1,247</h3>
              <p className="text-error-600 text-sm flex items-center mt-1">
                <ArrowUpRight size={14} className="mr-1" />
                +2.5% from last month
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
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white p-6 rounded-lg shadow-sm"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Total Revenue</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">$46,284</h3>
              <p className="text-success-600 text-sm flex items-center mt-1">
                <TrendingUp size={14} className="mr-1" />
                +18% from last month
              </p>
            </div>
            <div className="bg-accent-100 p-3 rounded-full">
              <CreditCard className="h-6 w-6 text-accent-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Users chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white p-6 rounded-lg shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">New User Registrations</h3>
            <Link 
              to="/admin/users" 
              className="text-sm text-primary-600 hover:text-primary-700 flex items-center"
            >
              View all <ArrowRight size={14} className="ml-1" />
            </Link>
          </div>
          <div className="h-64">
            <Line 
              data={mockUserData} 
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

        {/* Messages chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-white p-6 rounded-lg shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Messages Sent</h3>
          </div>
          <div className="h-64">
            <Bar 
              data={mockMessagesData} 
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
      </div>

      {/* Revenue chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="bg-white p-6 rounded-lg shadow-sm"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Revenue</h3>
          <Link 
            to="/admin/transactions" 
            className="text-sm text-primary-600 hover:text-primary-700 flex items-center"
          >
            View transactions <ArrowRight size={14} className="ml-1" />
          </Link>
        </div>
        <div className="h-72">
          <Line 
            data={mockRevenueData} 
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
                  ticks: {
                    callback: function(value) {
                      return '$' + value;
                    }
                  }
                },
              },
            }} 
          />
        </div>
      </motion.div>

      {/* Recent users and transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent users */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="bg-white p-6 rounded-lg shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Recent Users</h3>
            <Link 
              to="/admin/users" 
              className="text-sm text-primary-600 hover:text-primary-700 flex items-center"
            >
              View all <ArrowRight size={14} className="ml-1" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Credits
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockRecentUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-800">
                      {user.name}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                      {user.email}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                      {user.credits}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.joined).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Recent transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="bg-white p-6 rounded-lg shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Recent Transactions</h3>
            <Link 
              to="/admin/transactions" 
              className="text-sm text-primary-600 hover:text-primary-700 flex items-center"
            >
              View all <ArrowRight size={14} className="ml-1" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Package
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockRecentTransactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-800">
                      {transaction.user}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                      {transaction.package}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                      ${transaction.amount}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;