import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Search,
  ChevronLeft,
  ChevronRight,
  Download,
  Filter,
  X,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getAllMessages } from '../../services/messageTrackingService';

// Map MessageStatus to UI-friendly format
interface Message {
  id: string;
  recipientPhone: string;
  content: string;
  status: 'delivered' | 'failed' | 'pending';
  sentAt: string;
  deliveredAt?: string;
  errorMessage?: string;
}

const ITEMS_PER_PAGE = 10;

const MessageHistory: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Load tracked messages
  useEffect(() => {
    loadMessages();
    
    // Set up periodic refresh
    const intervalId = setInterval(() => {
      loadMessages(false);
    }, 10000); // Refresh every 10 seconds
    
    return () => clearInterval(intervalId);
  }, []);
  
  const loadMessages = (showLoading = true) => {
    if (showLoading) {
      setIsRefreshing(true);
    }
    
    try {
      // Get all messages from tracking service
      const trackedMessages = getAllMessages();
      
      // Convert to UI format
      const formattedMessages: Message[] = trackedMessages.map(msg => ({
        id: msg.id,
        recipientPhone: msg.to,
        content: msg.content,
        status: mapStatus(msg.status),
        sentAt: msg.createdAt.toISOString(),
        deliveredAt: msg.status === 'delivered' ? msg.updatedAt.toISOString() : undefined,
        errorMessage: msg.errorMessage
      }));
      
      setMessages(formattedMessages);
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      if (showLoading) {
        setIsRefreshing(false);
      }
    }
  };
  
  // Map tracking status to UI status
  const mapStatus = (status: 'queued' | 'sent' | 'delivered' | 'failed'): 'delivered' | 'failed' | 'pending' => {
    if (status === 'delivered') return 'delivered';
    if (status === 'failed') return 'failed';
    return 'pending'; // For both 'queued' and 'sent'
  };

  // Apply filters and search
  const getFilteredMessages = () => {
    return messages.filter(message => {
      // Search filter
      const matchesSearch = searchTerm === '' || 
        message.recipientPhone.includes(searchTerm) || 
        message.content.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Status filter
      const matchesStatus = statusFilter === 'all' || message.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  };
  
  const filteredMessages = getFilteredMessages();

  // Pagination
  const totalPages = Math.ceil(filteredMessages.length / ITEMS_PER_PAGE);
  const paginatedMessages = filteredMessages.slice(
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
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handleFilterToggle = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  // Download messages as CSV
  const handleDownload = () => {
    // Create CSV content
    const headers = ['ID', 'Recipient', 'Message', 'Status', 'Sent At', 'Delivered At'];
    const rows = filteredMessages.map(msg => [
      msg.id,
      msg.recipientPhone,
      `"${msg.content.replace(/"/g, '""')}"`, // Escape quotes in CSV
      msg.status,
      new Date(msg.sentAt).toLocaleString(),
      msg.deliveredAt ? new Date(msg.deliveredAt).toLocaleString() : ''
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `messages-${new Date().toISOString().split('T')[0]}.csv`);
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
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Message History</h2>
          
          <div className="flex space-x-2">
            <button 
              onClick={() => loadMessages()}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md"
              disabled={isRefreshing}
            >
              <RefreshCw size={20} className={isRefreshing ? 'animate-spin' : ''} />
            </button>
            
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md"
            >
              <Filter size={20} />
            </button>
            
            <button 
              onClick={handleDownload}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md"
            >
              <Download size={20} />
            </button>
          </div>
        </div>
        
        {/* Search bar */}
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search by phone number or message content..."
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
        {isFilterOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-50 p-4 rounded-lg mb-4"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-medium text-gray-700">Filters</h3>
              <button
                onClick={handleFilterToggle}
                className="text-xs text-primary-600 hover:text-primary-700 flex items-center"
              >
                Close filters
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Status filter */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all border-gray-300 text-sm"
                >
                  <option value="all">All Statuses</option>
                  <option value="delivered">Delivered</option>
                  <option value="failed">Failed</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Messages table */}
        {isRefreshing ? (
          <div className="bg-white rounded-lg p-8">
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        ) : paginatedMessages.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Recipient
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Message
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sent At
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedMessages.map((message) => (
                  <tr key={message.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                      {message.recipientPhone}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                      {message.content}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        message.status === 'delivered' 
                          ? 'bg-success-100 text-success-800' 
                          : message.status === 'failed' 
                            ? 'bg-error-100 text-error-800'
                            : 'bg-warning-100 text-warning-800'
                      }`}>
                        {message.status === 'delivered' && <CheckCircle className="h-3 w-3 mr-1" />}
                        {message.status === 'failed' && <AlertCircle className="h-3 w-3 mr-1" />}
                        {message.status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                        {message.status.charAt(0).toUpperCase() + message.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(message.sentAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-10 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No messages found matching your filters.</p>
          </div>
        )}
        
        {/* Pagination */}
        {filteredMessages.length > 0 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-500">
              Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredMessages.length)} of {filteredMessages.length} messages
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
    </div>
  );
};

export default MessageHistory;