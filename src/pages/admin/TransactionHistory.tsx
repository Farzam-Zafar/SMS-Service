import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight,
  Calendar,
  X,
  Download,
  Eye,
  CheckCircle
} from 'lucide-react';

// Mock transaction data
interface Transaction {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  packageName: string;
  amount: number;
  credits: number;
  status: 'completed' | 'refunded' | 'failed';
  paymentMethod: 'credit_card' | 'paypal';
  date: string;
}

// Generate mock transactions
const generateMockTransactions = (count: number): Transaction[] => {
  const transactions: Transaction[] = [];
  const statuses: ('completed' | 'refunded' | 'failed')[] = ['completed', 'completed', 'completed', 'completed', 'refunded', 'failed'];
  const paymentMethods: ('credit_card' | 'paypal')[] = ['credit_card', 'credit_card', 'credit_card', 'paypal'];
  const packages = [
    { name: 'Basic', amount: 5, credits: 100 },
    { name: 'Standard', amount: 20, credits: 500 },
    { name: 'Premium', amount: 65, credits: 2000 }
  ];
  
  const users = [
    { id: 'u1', name: 'John Smith', email: 'john@example.com' },
    { id: 'u2', name: 'Sarah Johnson', email: 'sarah@example.com' },
    { id: 'u3', name: 'Michael Brown', email: 'michael@example.com' },
    { id: 'u4', name: 'Emily Davis', email: 'emily@example.com' },
    { id: 'u5', name: 'David Wilson', email: 'david@example.com' },
    { id: 'u6', name: 'Jennifer Martinez', email: 'jennifer@example.com' }
  ];
  
  for (let i = 1; i <= count; i++) {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 90)); // Up to 90 days ago
    
    const user = users[Math.floor(Math.random() * users.length)];
    const pkg = packages[Math.floor(Math.random() * packages.length)];
    
    transactions.push({
      id: `txn_${i}`,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      packageName: pkg.name,
      amount: pkg.amount,
      credits: pkg.credits,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
      date: date.toISOString(),
    });
  }
  
  // Sort by date (newest first)
  return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

const ITEMS_PER_PAGE = 10;

const TransactionHistory: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [dateRange, setDateRange] = useState<{start?: string; end?: string}>({});
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [viewTransaction, setViewTransaction] = useState<Transaction | null>(null);
  
  // Load mock data
  useEffect(() => {
    const fetchTransactions = async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTransactions(generateMockTransactions(85));
      setIsLoading(false);
    };
    
    fetchTransactions();
  }, []);
  
  // Apply filters and search
  const filteredTransactions = transactions.filter(transaction => {
    // Search filter
    const matchesSearch = 
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      transaction.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.packageName.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter
    const matchesStatus = selectedStatus === 'all' || transaction.status === selectedStatus;
    
    // Date range filter
    let matchesDateRange = true;
    if (dateRange.start) {
      matchesDateRange = matchesDateRange && new Date(transaction.date) >= new Date(dateRange.start);
    }
    if (dateRange.end) {
      matchesDateRange = matchesDateRange && new Date(transaction.date) <= new Date(dateRange.end);
    }
    
    return matchesSearch && matchesStatus && matchesDateRange;
  });
  
  // Calculate total revenue from filtered transactions
  const totalRevenue = filteredTransactions
    .filter(t => t.status === 'completed')
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  
  // Calculate total credits sold from filtered transactions
  const totalCreditsSold = filteredTransactions
    .filter(t => t.status === 'completed')
    .reduce((sum, transaction) => sum + transaction.credits, 0);
  
  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);
  const paginatedTransactions = filteredTransactions.slice(
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
  
  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    setCurrentPage(1);
  };
  
  const handleDateRangeChange = (type: 'start' | 'end', value: string) => {
    setDateRange(prev => ({ ...prev, [type]: value }));
    setCurrentPage(1);
  };
  
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedStatus('all');
    setDateRange({});
    setCurrentPage(1);
  };
  
  // Download transactions as CSV
  const downloadCSV = () => {
    // Create CSV content
    const csvContent = [
      ['Transaction ID', 'User', 'Email', 'Package', 'Amount', 'Credits', 'Status', 'Payment Method', 'Date'],
      ...filteredTransactions.map(txn => [
        txn.id,
        txn.userName,
        txn.userEmail,
        txn.packageName,
        `$${txn.amount.toFixed(2)}`,
        txn.credits.toString(),
        txn.status,
        txn.paymentMethod === 'credit_card' ? 'Credit Card' : 'PayPal',
        new Date(txn.date).toLocaleString()
      ])
    ].map(row => row.join(',')).join('\n');
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `transactions-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
            <h2 className="text-2xl font-bold text-gray-800">Transaction History</h2>
            <p className="text-gray-500 mt-1">Review all purchases and payment activity</p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFiltersVisible(!filtersVisible)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center"
            >
              <Filter className="h-4 w-4 mr-1" />
              Filters
              {(selectedStatus !== 'all' || Object.keys(dateRange).length > 0) && (
                <span className="ml-1 bg-primary-100 text-primary-600 text-xs px-1.5 py-0.5 rounded-full">
                  !
                </span>
              )}
            </button>
            
            <button
              onClick={downloadCSV}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center"
            >
              <Download className="h-4 w-4 mr-1" />
              Export
            </button>
          </div>
        </div>
        
        {/* Stats overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-primary-50 rounded-lg p-4">
            <p className="text-primary-700 text-sm font-medium">Total Revenue (filtered)</p>
            <p className="text-2xl font-bold text-gray-800">${totalRevenue.toFixed(2)}</p>
          </div>
          <div className="bg-secondary-50 rounded-lg p-4">
            <p className="text-secondary-700 text-sm font-medium">Total Credits Sold (filtered)</p>
            <p className="text-2xl font-bold text-gray-800">{totalCreditsSold.toLocaleString()}</p>
          </div>
        </div>
        
        {/* Search bar */}
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search by ID, user, or package..."
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
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Status filter */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all border-gray-300 text-sm"
                >
                  <option value="all">All Statuses</option>
                  <option value="completed">Completed</option>
                  <option value="refunded">Refunded</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
              
              {/* Date range filter - Start date */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">From Date</label>
                <div className="relative">
                  <input
                    type="date"
                    value={dateRange.start || ''}
                    onChange={(e) => handleDateRangeChange('start', e.target.value)}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all border-gray-300 text-sm"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                    <Calendar className="h-4 w-4" />
                  </div>
                </div>
              </div>
              
              {/* Date range filter - End date */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">To Date</label>
                <div className="relative">
                  <input
                    type="date"
                    value={dateRange.end || ''}
                    onChange={(e) => handleDateRangeChange('end', e.target.value)}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all border-gray-300 text-sm"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                    <Calendar className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Transactions table */}
        {isLoading ? (
          <div className="bg-white rounded-lg p-8">
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        ) : paginatedTransactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transaction ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Package
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedTransactions.map((transaction) => (
                  <tr key={transaction.id} className={
                    transaction.status === 'refunded' 
                      ? 'bg-error-50' 
                      : transaction.status === 'failed'
                        ? 'bg-gray-50'
                        : ''
                  }>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                      {transaction.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-800">{transaction.userName}</div>
                      <div className="text-xs text-gray-500">{transaction.userEmail}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {transaction.packageName} ({transaction.credits} credits)
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-medium">
                      ${transaction.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        transaction.status === 'completed' 
                          ? 'bg-success-100 text-success-800' 
                          : transaction.status === 'refunded'
                            ? 'bg-error-100 text-error-800'
                            : 'bg-gray-100 text-gray-800'
                      }`}>
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(transaction.date).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => setViewTransaction(transaction)}
                        className="text-primary-600 hover:text-primary-800"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-10 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No transactions found matching your filters.</p>
            <button
              onClick={clearFilters}
              className="mt-2 text-primary-600 hover:text-primary-700"
            >
              Clear filters
            </button>
          </div>
        )}
        
        {/* Pagination */}
        {filteredTransactions.length > 0 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-500">
              Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredTransactions.length)} of {filteredTransactions.length} transactions
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
      
      {/* Transaction Details Modal */}
      {viewTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-md"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  Transaction Details
                </h3>
                <button
                  onClick={() => setViewTransaction(null)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="mb-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  viewTransaction.status === 'completed' 
                    ? 'bg-success-100 text-success-800' 
                    : viewTransaction.status === 'refunded'
                      ? 'bg-error-100 text-error-800'
                      : 'bg-gray-100 text-gray-800'
                }`}>
                  {viewTransaction.status === 'completed' && <CheckCircle className="h-3 w-3 mr-1" />}
                  {viewTransaction.status.charAt(0).toUpperCase() + viewTransaction.status.slice(1)}
                </span>
              </div>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Transaction ID</p>
                  <p className="font-medium text-gray-800">{viewTransaction.id}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Date & Time</p>
                  <p className="font-medium text-gray-800">
                    {new Date(viewTransaction.date).toLocaleString()}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">User</p>
                  <p className="font-medium text-gray-800">{viewTransaction.userName}</p>
                  <p className="text-sm text-gray-600">{viewTransaction.userEmail}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Package</p>
                  <p className="font-medium text-gray-800">{viewTransaction.packageName}</p>
                </div>
                
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Amount</p>
                    <p className="font-medium text-gray-800">${viewTransaction.amount.toFixed(2)}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Credits</p>
                    <p className="font-medium text-gray-800">{viewTransaction.credits}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Payment Method</p>
                  <p className="font-medium text-gray-800">
                    {viewTransaction.paymentMethod === 'credit_card' ? 'Credit Card' : 'PayPal'}
                  </p>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setViewTransaction(null)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;