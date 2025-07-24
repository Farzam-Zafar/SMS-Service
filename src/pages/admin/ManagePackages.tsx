import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Package,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  AlertTriangle,
  DollarSign,
  Zap,
  Calendar
} from 'lucide-react';

// Mock package data
interface SmsPackage {
  id: string;
  name: string;
  credits: number;
  price: number;
  validity: number; // in days
  popular: boolean;
  features: string[];
  createdAt: string;
}

// Generate mock packages
const initialPackages: SmsPackage[] = [
  {
    id: 'basic',
    name: 'Basic',
    credits: 100,
    price: 5,
    validity: 30,
    popular: false,
    features: [
      '100 SMS credits',
      'Standard delivery',
      '24/7 support',
      '30-day validity'
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'standard',
    name: 'Standard',
    credits: 500,
    price: 20,
    validity: 60,
    popular: true,
    features: [
      '500 SMS credits',
      'Priority delivery',
      'Delivery reports',
      'API access',
      '60-day validity'
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'premium',
    name: 'Premium',
    credits: 2000,
    price: 65,
    validity: 90,
    popular: false,
    features: [
      '2000 SMS credits',
      'Premium delivery',
      'Advanced analytics',
      'Dedicated support',
      'Custom sender ID',
      '90-day validity'
    ],
    createdAt: new Date().toISOString()
  },
];

const ManagePackages: React.FC = () => {
  const [packages, setPackages] = useState<SmsPackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedPackage, setSelectedPackage] = useState<SmsPackage | null>(null);
  const [formData, setFormData] = useState<Partial<SmsPackage>>({});
  const [confirmDeletePackage, setConfirmDeletePackage] = useState<SmsPackage | null>(null);
  const [feature, setFeature] = useState('');
  
  // Load mock data
  useEffect(() => {
    const fetchPackages = async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPackages(initialPackages);
      setIsLoading(false);
    };
    
    fetchPackages();
  }, []);
  
  const openAddPackageModal = () => {
    setModalMode('add');
    setSelectedPackage(null);
    setFormData({
      name: '',
      credits: 100,
      price: 5,
      validity: 30,
      popular: false,
      features: []
    });
    setIsModalOpen(true);
  };
  
  const openEditPackageModal = (pkg: SmsPackage) => {
    setModalMode('edit');
    setSelectedPackage(pkg);
    setFormData({
      name: pkg.name,
      credits: pkg.credits,
      price: pkg.price,
      validity: pkg.validity,
      popular: pkg.popular,
      features: [...pkg.features]
    });
    setIsModalOpen(true);
  };
  
  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    // Handle checkbox for popular field
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
      return;
    }
    
    // Handle number fields
    if (name === 'credits' || name === 'price' || name === 'validity') {
      setFormData(prev => ({
        ...prev,
        [name]: parseFloat(value)
      }));
      return;
    }
    
    // Handle other fields
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const addFeature = () => {
    if (!feature.trim()) return;
    
    setFormData(prev => ({
      ...prev,
      features: [...(prev.features || []), feature.trim()]
    }));
    
    setFeature('');
  };
  
  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: (prev.features || []).filter((_, i) => i !== index)
    }));
  };
  
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (modalMode === 'add') {
      // Generate a new package
      const newPackage: SmsPackage = {
        id: `pkg-${Date.now()}`,
        name: formData.name || 'New Package',
        credits: formData.credits || 0,
        price: formData.price || 0,
        validity: formData.validity || 30,
        popular: formData.popular || false,
        features: formData.features || [],
        createdAt: new Date().toISOString()
      };
      
      setPackages(prev => [...prev, newPackage]);
    } else if (modalMode === 'edit' && selectedPackage) {
      // Update existing package
      setPackages(prev => 
        prev.map(pkg => 
          pkg.id === selectedPackage.id 
            ? { 
                ...pkg, 
                name: formData.name || pkg.name,
                credits: formData.credits !== undefined ? formData.credits : pkg.credits,
                price: formData.price !== undefined ? formData.price : pkg.price,
                validity: formData.validity !== undefined ? formData.validity : pkg.validity,
                popular: formData.popular !== undefined ? formData.popular : pkg.popular,
                features: formData.features || pkg.features
              } 
            : pkg
        )
      );
    }
    
    setIsModalOpen(false);
  };
  
  const confirmDelete = (pkg: SmsPackage) => {
    setConfirmDeletePackage(pkg);
  };
  
  const handleDeletePackage = () => {
    if (!confirmDeletePackage) return;
    
    setPackages(prev => prev.filter(pkg => pkg.id !== confirmDeletePackage.id));
    setConfirmDeletePackage(null);
  };
  
  const togglePopular = (pkg: SmsPackage) => {
    setPackages(prev => 
      prev.map(p => 
        p.id === pkg.id 
          ? { ...p, popular: !p.popular } 
          : p
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
            <h2 className="text-2xl font-bold text-gray-800">Manage SMS Packages</h2>
            <p className="text-gray-500 mt-1">Create and manage SMS packages available for purchase</p>
          </div>
          
          <button
            onClick={openAddPackageModal}
            className="px-4 py-2 bg-primary-500 text-white rounded-md text-sm font-medium hover:bg-primary-600 flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Package
          </button>
        </div>
        
        {/* Packages grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse border rounded-lg p-6">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6 mb-6"></div>
                <div className="h-8 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : packages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg, index) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative rounded-xl overflow-hidden border ${
                  pkg.popular ? 'border-2 border-primary-500' : 'border-gray-200'
                }`}
              >
                {pkg.popular && (
                  <div className="absolute top-0 right-0 bg-primary-500 text-white text-xs px-3 py-1 font-medium">
                    MOST POPULAR
                  </div>
                )}
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{pkg.name}</h3>
                  <div className="flex items-baseline mb-4">
                    <span className="text-3xl font-bold text-gray-900">${pkg.price}</span>
                    <span className="text-gray-500 ml-1">one-time</span>
                  </div>
                  
                  <div className="mb-6">
                    <span className="inline-flex items-center bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium">
                      <Zap className="h-4 w-4 mr-1" /> {pkg.credits} credits
                    </span>
                    <span className="inline-flex items-center bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium ml-2">
                      <Calendar className="h-4 w-4 mr-1" /> {pkg.validity} days
                    </span>
                  </div>
                  
                  <ul className="space-y-3 mb-6">
                    {pkg.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-primary-500 mr-2">•</span>
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="flex space-x-2 mt-4">
                    <button
                      onClick={() => togglePopular(pkg)}
                      className={`p-2 rounded-md ${
                        pkg.popular
                          ? 'bg-primary-100 text-primary-600'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                      title={pkg.popular ? 'Remove Popular Badge' : 'Mark as Popular'}
                    >
                      <Package className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => openEditPackageModal(pkg)}
                      className="p-2 bg-gray-100 text-gray-600 hover:bg-primary-100 hover:text-primary-600 rounded-md"
                      title="Edit Package"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => confirmDelete(pkg)}
                      className="p-2 bg-gray-100 text-gray-600 hover:bg-error-100 hover:text-error-600 rounded-md"
                      title="Delete Package"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-gray-50 rounded-lg">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No packages found</p>
            <button
              onClick={openAddPackageModal}
              className="px-4 py-2 bg-primary-500 text-white rounded-md text-sm font-medium hover:bg-primary-600 flex items-center mx-auto"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create First Package
            </button>
          </div>
        )}
      </motion.div>
      
      {/* Package Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white p-6 rounded-lg shadow-sm"
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Package Pricing Tips</h3>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-800 mb-2">Optimizing Your Package Offerings</h4>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li className="flex items-start">
                <span className="text-primary-500 mr-2">•</span>
                <span>Offer volume discounts to encourage purchase of larger packages</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-500 mr-2">•</span>
                <span>Include extra benefits (like priority sending) to high-tier packages</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-500 mr-2">•</span>
                <span>Consider seasonal promotions for special occasions (holidays, back to school, etc.)</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-500 mr-2">•</span>
                <span>Track package purchase patterns to optimize pricing and features</span>
              </li>
            </ul>
          </div>
        </div>
      </motion.div>
      
      {/* Add/Edit Package Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  {modalMode === 'add' ? 'Add New Package' : 'Edit Package'}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Package Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name || ''}
                      onChange={handleFormChange}
                      required
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all border-gray-300"
                      placeholder="e.g., Basic, Premium, Enterprise"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="popular" className="flex items-center text-sm font-medium text-gray-700 h-9 mt-5">
                      <input
                        id="popular"
                        name="popular"
                        type="checkbox"
                        checked={formData.popular || false}
                        onChange={handleFormChange}
                        className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 mr-2"
                      />
                      Mark as Popular
                    </label>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="credits" className="block text-sm font-medium text-gray-700 mb-1">
                      Credits
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <Zap className="h-5 w-5" />
                      </div>
                      <input
                        id="credits"
                        name="credits"
                        type="number"
                        min="1"
                        value={formData.credits || ''}
                        onChange={handleFormChange}
                        required
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all border-gray-300"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                      Price ($)
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <DollarSign className="h-5 w-5" />
                      </div>
                      <input
                        id="price"
                        name="price"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.price || ''}
                        onChange={handleFormChange}
                        required
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all border-gray-300"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="validity" className="block text-sm font-medium text-gray-700 mb-1">
                      Validity (days)
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <Calendar className="h-5 w-5" />
                      </div>
                      <input
                        id="validity"
                        name="validity"
                        type="number"
                        min="1"
                        value={formData.validity || ''}
                        onChange={handleFormChange}
                        required
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all border-gray-300"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Features
                  </label>
                  
                  <div className="space-y-2 mb-4">
                    {(formData.features || []).map((feat, index) => (
                      <div key={index} className="flex items-center">
                        <span className="text-primary-500 mr-2">•</span>
                        <span className="text-gray-600 flex-1">{feat}</span>
                        <button
                          type="button"
                          onClick={() => removeFeature(index)}
                          className="text-gray-400 hover:text-error-500 p-1"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => setFeature(e.target.value)}
                      placeholder="Add a feature..."
                      className="flex-1 px-4 py-2 border rounded-l-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={addFeature}
                      className="px-4 py-2 bg-primary-500 text-white rounded-r-lg font-medium hover:bg-primary-600"
                    >
                      Add
                    </button>
                  </div>
                </div>
                
                <div className="pt-4 flex justify-end space-x-3">
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
                    {modalMode === 'add' ? 'Create Package' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {confirmDeletePackage && (
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
                  <h3 className="text-lg font-medium text-gray-900">Delete Package</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Are you sure you want to delete the <strong>{confirmDeletePackage.name}</strong> package? This action cannot be undone.
                  </p>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setConfirmDeletePackage(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeletePackage}
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

export default ManagePackages;