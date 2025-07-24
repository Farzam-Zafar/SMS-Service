import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  UserPlus, 
  Edit, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  X,
  Ban,
  Check,
  AlertTriangle,
  Save
} from 'lucide-react';

// Mock user data
interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  status: 'active' | 'suspended';
  credits: number;
  messagesCount: number;
  lastActive: string;
  createdAt: string;
}

// Generate mock users
const generateMockUsers = (count: number): User[] => {
  const users: User[] = [];
  const statuses: ('active' | 'suspended')[] = ['active', 'active', 'active', 'active', 'suspended'];
  const roles: ('user' | 'admin')[] = ['user', 'user', 'user', 'user', 'admin'];
  
  for (let i = 1; i <= count; i++) {
    const now = new Date();
    const created = new Date();
    created.setDate(now.getDate() - Math.floor(Math.random() * 180)); // Up to 180 days ago
    
    const lastActive = new Date();
    lastActive.setDate(now.getDate() - Math.floor(Math.random() * 30)); // Up to 30 days ago
    
    users.push({
      id: `u${i}`,
      name: [
        'John Smith',
        'Emma Johnson',
        'Michael Brown',
        'Sarah Davis',
        'David Wilson',
        'Jennifer Martinez',
        'Robert Taylor',
        'Jessica Anderson',
        'James Thomas',
        'Lisa Jackson',
      ][Math.floor(Math.random() * 10)],
      email: `user${i}@example.com`,
      role: roles[Math.floor(Math.random() * roles.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      credits: Math.floor(Math.random() * 1000),
      messagesCount: Math.floor(Math.random() * 5000),
      lastActive: lastActive.toISOString(),
      createdAt: created.toISOString(),
    });
  }
  
  return users;
};

const ITEMS_PER_PAGE = 10;

const ManageUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<Partial<User>>({});
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [confirmDeleteUser, setConfirmDeleteUser] = useState<User | null>(null);
  
  // Load mock data
  useEffect(() => {
    const fetchUsers = async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUsers(generateMockUsers(45));
      setIsLoading(false);
    };
    
    fetchUsers();
  }, []);
  
  // Apply filters and search
  const filteredUsers = users.filter(user => {
    // Search filter
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Role filter
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    
    // Status filter
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });
  
  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };
  
  const handleRoleChange = (role: string) => {
    setSelectedRole(role);
    setCurrentPage(1);
  };
  
  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    setCurrentPage(1);
  };
  
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedRole('all');
    setSelectedStatus('all');
    setCurrentPage(1);
  };
  
  const openAddUserModal = () => {
    setModalMode('add');
    setSelectedUser(null);
    setFormData({
      name: '',
      email: '',
      role: 'user',
      status: 'active',
      credits: 0
    });
    setIsModalOpen(true);
  };
  
  const openEditUserModal = (user: User) => {
    setModalMode('edit');
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      credits: user.credits
    });
    setIsModalOpen(true);
  };
  
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'credits' ? parseInt(value) : value
    }));
  };
  
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (modalMode === 'add') {
      // Generate a new user
      const newUser: User = {
        id: `u${users.length + 1}`,
        name: formData.name || '',
        email: formData.email || '',
        role: (formData.role as 'user' | 'admin') || 'user',
        status: (formData.status as 'active' | 'suspended') || 'active',
        credits: formData.credits || 0,
        messagesCount: 0,
        lastActive: new Date().toISOString(),
        createdAt: new Date().toISOString()
      };
      
      setUsers(prev => [...prev, newUser]);
    } else if (modalMode === 'edit' && selectedUser) {
      // Update existing user
      setUsers(prev => 
        prev.map(user => 
          user.id === selectedUser.id 
            ? { 
                ...user, 
                name: formData.name || user.name,
                email: formData.email || user.email,
                role: (formData.role as 'user' | 'admin') || user.role,
                status: (formData.status as 'active' | 'suspended') || user.status,
                credits: formData.credits !== undefined ? formData.credits : user.credits
              } 
            : user
        )
      );
    }
    
    setIsModalOpen(false);
  };
  
  const confirmDelete = (user: User) => {
    setConfirmDeleteUser(user);
  };
  
  const handleDeleteUser = () => {
    if (!confirmDeleteUser) return;
    
    setUsers(prev => prev.filter(user => user.id !== confirmDeleteUser.id));
    setConfirmDeleteUser(null);
  };
  
  const toggleUserStatus = (user: User) => {
    setUsers(prev => 
      prev.map(u => 
        u.id === user.id 
          ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' } 
          : u
      )
    );
  };
  
  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-6 rounded-lg shadow-sm mb-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Manage Users</h2>
            <p className="text-gray-500 mt-1">View, edit, and manage user accounts</p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFiltersVisible(!filtersVisible)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center"
            >
              <Filter className="h-4 w-4 mr-1" />
              Filters
              {(selectedRole !== 'all' || selectedStatus !== 'all') && (
                <span className="ml-1 bg-primary-100 text-primary-600 text-xs px-1.5 py-0.5 rounded-full">
                  !
                </span>
              )}
            </button>
            
            <button
              onClick={openAddUserModal}
              className="px-3 py-2 bg-primary-500 text-white rounded-md text-sm font-medium hover:bg-primary-600 flex items-center"
            >
              <UserPlus className="h-4 w-4 mr-1" />
              Add User
            </button>
          </div>
        </div>
        
        {/* Search bar */}
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all border-gray-300"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <Search className="h-4 w-4" />
          </div>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        
        {/* Filters section */}
        {filtersVisible && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-50 p-4 rounded-lg mb-4"
          >
            <div className="flex flex-wrap justify-between items-center mb-4">
              <h3 className="text-sm font-medium text-gray-700">Filters</h3>
              <button
                onClick={clearFilters}
                className="text-xs text-primary-600 hover:text-primary-700 flex items-center"
              >
                Clear filters
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Role filter */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={selectedRole}
                  onChange={(e) => handleRoleChange(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all border-gray-300 text-sm"
                >
                  <option value="all">All Roles</option>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              
              {/* Status filter */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all border-gray-300 text-sm"
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Users table */}
        {isLoading ? (
          <div className="bg-white rounded-lg p-8">
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        ) : paginatedUsers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name / Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Credits
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedUsers.map((user) => (
                  <tr key={user.id} className={user.status === 'suspended' ? 'bg-gray-50' : ''}>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-semibold">
                          {user.name.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.role === 'admin' 
                          ? 'bg-primary-100 text-primary-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.role === 'admin' ? 'Admin' : 'User'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.status === 'active' 
                          ? 'bg-success-100 text-success-800' 
                          : 'bg-error-100 text-error-800'
                      }`}>
                        {user.status === 'active' ? 'Active' : 'Suspended'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.credits}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => toggleUserStatus(user)}
                          className={`p-1 rounded-md ${
                            user.status === 'active'
                              ? 'text-gray-400 hover:text-error-600 hover:bg-error-50'
                              : 'text-gray-400 hover:text-success-600 hover:bg-success-50'
                          }`}
                          title={user.status === 'active' ? 'Suspend User' : 'Activate User'}
                        >
                          {user.status === 'active' ? <Ban size={18} /> : <Check size={18} />}
                        </button>
                        <button
                          onClick={() => openEditUserModal(user)}
                          className="p-1 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-md"
                          title="Edit User"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => confirmDelete(user)}
                          className="p-1 text-gray-400 hover:text-error-600 hover:bg-error-50 rounded-md"
                          title="Delete User"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-10 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No users found matching your filters.</p>
            <button
              onClick={clearFilters}
              className="mt-2 text-primary-600 hover:text-primary-700"
            >
              Clear filters
            </button>
          </div>
        )}
        
        {/* Pagination */}
        {filteredUsers.length > 0 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-500">
              Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredUsers.length)} of {filteredUsers.length} users
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-md ${
                  currentPage === 1
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(page => {
                  // Always show first, last, current, and pages around current
                  return (
                    page === 1 ||
                    page === totalPages ||
                    Math.abs(page - currentPage) <= 1
                  );
                })
                .map((page, index, array) => {
                  // Add ellipsis where there are gaps
                  const showEllipsis = index > 0 && page - array[index - 1] > 1;
                  
                  return (
                    <div key={page} className="flex items-center">
                      {showEllipsis && (
                        <span className="px-2 text-gray-400">...</span>
                      )}
                      <button
                        onClick={() => handlePageChange(page)}
                        className={`h-8 w-8 flex items-center justify-center rounded-md ${
                          currentPage === page
                            ? 'bg-primary-500 text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {page}
                      </button>
                    </div>
                  );
                })}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-md ${
                  currentPage === totalPages
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </motion.div>
      
      {/* Add/Edit User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-md"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  {modalMode === 'add' ? 'Add New User' : 'Edit User'}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <form onSubmit={handleFormSubmit}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name || ''}
                      onChange={handleFormChange}
                      required
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all border-gray-300"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email || ''}
                      onChange={handleFormChange}
                      required
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all border-gray-300"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                      Role
                    </label>
                    <select
                      id="role"
                      name="role"
                      value={formData.role || 'user'}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all border-gray-300"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status || 'active'}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all border-gray-300"
                    >
                      <option value="active">Active</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="credits" className="block text-sm font-medium text-gray-700 mb-1">
                      Credits
                    </label>
                    <input
                      id="credits"
                      name="credits"
                      type="number"
                      min="0"
                      value={formData.credits || 0}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all border-gray-300"
                    />
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary-500 text-white rounded-md text-sm font-medium hover:bg-primary-600 flex items-center"
                  >
                    <Save className="h-4 w-4 mr-1" />
                    {modalMode === 'add' ? 'Create User' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {confirmDeleteUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-md"
          >
            <div className="p-6">
              <div className="flex items-start mb-4">
                <div className="flex-shrink-0 bg-error-100 rounded-full p-2">
                  <AlertTriangle className="h-6 w-6 text-error-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-900">Delete User</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Are you sure you want to delete {confirmDeleteUser.name}? This action cannot be undone.
                  </p>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setConfirmDeleteUser(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteUser}
                  className="px-4 py-2 bg-error-500 text-white rounded-md text-sm font-medium hover:bg-error-600 flex items-center"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;