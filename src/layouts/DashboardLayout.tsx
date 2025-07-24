import { useState } from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  LayoutDashboard, 
  Send, 
  Clock, 
  CreditCard, 
  User, 
  Code, 
  Key, 
  Users, 
  Package, 
  FileText, 
  LogOut, 
  Menu, 
  X,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface DashboardLayoutProps {
  isAdmin?: boolean;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ isAdmin = false }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Define navigation items based on user role
  const navItems = isAdmin
    ? [
        { path: '/admin', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
        { path: '/admin/users', icon: <Users size={20} />, label: 'Manage Users' },
        { path: '/admin/packages', icon: <Package size={20} />, label: 'SMS Packages' },
        { path: '/admin/transactions', icon: <FileText size={20} />, label: 'Transactions' },
      ]
    : [
        { path: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
        { path: '/send-sms', icon: <Send size={20} />, label: 'Send SMS' },
        { path: '/messages', icon: <Clock size={20} />, label: 'Message History' },
        { path: '/buy-credits', icon: <CreditCard size={20} />, label: 'Buy Credits' },
        { path: '/profile', icon: <User size={20} />, label: 'Profile' },
        { path: '/api-docs', icon: <Code size={20} />, label: 'API Access' },
        { path: '/api-settings', icon: <Key size={20} />, label: 'API Settings' },
      ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar toggle */}
      <div className="fixed top-4 left-4 z-30 md:hidden">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-md bg-white shadow-md text-gray-700 hover:text-primary-500 transition-colors"
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar - desktop always visible, mobile conditionally */}
      <AnimatePresence>
        {(isSidebarOpen || window.innerWidth >= 768) && (
          <motion.aside
            initial={{ x: -250 }}
            animate={{ x: 0 }}
            exit={{ x: -250 }}
            transition={{ duration: 0.2 }}
            className={`fixed md:relative z-20 w-64 h-full bg-white shadow-lg md:shadow-none ${
              isSidebarOpen ? 'block' : 'hidden md:block'
            }`}
          >
            <div className="flex flex-col h-full">
              {/* Sidebar header */}
              <div className="flex items-center justify-center p-5 border-b">
                <Link to={isAdmin ? '/admin' : '/dashboard'} className="flex items-center">
                  <MessageSquare className="h-6 w-6 text-primary-500 mr-2" />
                  <span className="text-xl font-bold text-gray-800">TextPulse</span>
                </Link>
              </div>

              {/* Navigation items */}
              <nav className="flex-1 overflow-y-auto p-4">
                <ul className="space-y-2">
                  {navItems.map((item) => (
                    <li key={item.path}>
                      <NavLink
                        to={item.path}
                        onClick={() => setIsSidebarOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center p-3 rounded-lg transition-all ${
                            isActive
                              ? 'bg-primary-50 text-primary-600 font-medium'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`
                        }
                      >
                        <span className="mr-3">{item.icon}</span>
                        <span>{item.label}</span>
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* User info & logout */}
              <div className="p-4 border-t">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-primary-500 text-white flex items-center justify-center mr-2">
                      {user?.name.charAt(0) || 'U'}
                    </div>
                    <div className="text-sm">
                      <p className="font-medium text-gray-800 truncate max-w-[150px]">
                        {user?.name || 'User'}
                      </p>
                      <p className="text-gray-500 text-xs">{user?.email || 'email@example.com'}</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center p-3 rounded-lg text-gray-600 hover:bg-gray-100 transition"
                >
                  <LogOut size={18} className="mr-2" />
                  Sign Out
                </button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Overlay for mobile when sidebar is open */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-10 bg-black bg-opacity-50 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow z-10">
          <div className="flex items-center justify-between p-4">
            <h1 className="text-xl font-semibold text-gray-800">
              {isAdmin ? 'Admin Panel' : 'SMS Dashboard'}
            </h1>
            
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center space-x-2 focus:outline-none"
              >
                <div className="relative">
                  <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-primary-100 text-primary-600">
                    {user?.name.charAt(0) || 'U'}
                  </span>
                  {!isAdmin && (
                    <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs font-medium px-1.5 py-0.5 rounded-full">
                      {user?.credits || 0}
                    </span>
                  )}
                </div>
                <span className="text-sm font-medium text-gray-700 hidden sm:block">
                  {user?.name || 'User'}
                </span>
                <ChevronDown size={16} className="text-gray-500" />
              </button>
              
              {/* Dropdown menu */}
              <AnimatePresence>
                {isProfileMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20"
                  >
                    {!isAdmin && (
                      <>
                        <Link
                          to="/profile"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Your Profile
                        </Link>
                        <Link
                          to="/buy-credits"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Credits: {user?.credits || 0}
                        </Link>
                        <div className="border-t border-gray-100 my-1"></div>
                      </>
                    )}
                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        handleLogout();
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;