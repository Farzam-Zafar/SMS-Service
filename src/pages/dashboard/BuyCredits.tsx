import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, CreditCard, Sparkles, Shield, Tag, Zap } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface Package {
  id: string;
  name: string;
  credits: number;
  price: number;
  popular?: boolean;
  features: string[];
}

const packages: Package[] = [
  {
    id: 'basic',
    name: 'Basic',
    credits: 100,
    price: 5,
    features: [
      '100 SMS credits',
      'Standard delivery',
      '24/7 support',
      '30-day validity'
    ]
  },
  {
    id: 'standard',
    name: 'Standard',
    credits: 500,
    price: 20,
    popular: true,
    features: [
      '500 SMS credits',
      'Priority delivery',
      'Delivery reports',
      'API access',
      '60-day validity'
    ]
  },
  {
    id: 'premium',
    name: 'Premium',
    credits: 2000,
    price: 65,
    features: [
      '2000 SMS credits',
      'Premium delivery',
      'Advanced analytics',
      'Dedicated support',
      'Custom sender ID',
      '90-day validity'
    ]
  },
];

const BuyCredits: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const handlePackageSelect = (pkg: Package) => {
    setSelectedPackage(pkg);
    setError('');
    setIsSuccess(false);
  };
  
  const handlePurchase = async () => {
    if (!selectedPackage) return;
    
    setIsProcessing(true);
    setError('');
    setIsSuccess(false);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate success
      if (Math.random() > 0.1) { // 90% success rate for demonstration
        // Update user credits (in a real app, this would be done by the backend)
        updateUser({
          credits: (user?.credits || 0) + selectedPackage.credits
        });
        
        setIsSuccess(true);
      } else {
        throw new Error('Payment processing failed. Please try again.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <div className="max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-6 rounded-lg shadow-sm mb-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Buy SMS Credits</h2>
            <p className="text-gray-500 mt-1">Choose a package that fits your messaging needs</p>
          </div>
          <div className="text-sm text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
            Current balance: {user?.credits || 0} credits
          </div>
        </div>
        
        {/* Package selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {packages.map((pkg, index) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative rounded-xl overflow-hidden ${
                pkg.popular ? 'border-2 border-primary-500' : 'border border-gray-200'
              }`}
            >
              {pkg.popular && (
                <div className="absolute top-0 right-0 bg-primary-500 text-white text-xs px-3 py-1 font-medium">
                  MOST POPULAR
                </div>
              )}
              
              <div className={`p-6 ${selectedPackage?.id === pkg.id ? 'bg-primary-50' : 'bg-white'}`}>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{pkg.name}</h3>
                <div className="flex items-baseline mb-4">
                  <span className="text-3xl font-bold text-gray-900">${pkg.price}</span>
                  <span className="text-gray-500 ml-1">one-time</span>
                </div>
                
                <div className="mb-6">
                  <span className="inline-flex items-center bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium">
                    <Zap className="h-4 w-4 mr-1" /> {pkg.credits} credits
                  </span>
                </div>
                
                <ul className="space-y-3 mb-6">
                  {pkg.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="h-5 w-5 text-primary-500 mr-2 flex-shrink-0" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button
                  onClick={() => handlePackageSelect(pkg)}
                  className={`w-full py-2 rounded-lg transition-all ${
                    selectedPackage?.id === pkg.id
                      ? 'bg-primary-500 text-white hover:bg-primary-600'
                      : 'border border-primary-500 text-primary-500 hover:bg-primary-50'
                  }`}
                >
                  {selectedPackage?.id === pkg.id ? 'Selected' : 'Select'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Result messages */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-error-50 text-error-700 p-4 rounded-md mb-6"
          >
            <div className="flex items-start">
              <Shield className="h-5 w-5 mr-2 flex-shrink-0" />
              <span>{error}</span>
            </div>
          </motion.div>
        )}
        
        {isSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-success-50 text-success-700 p-4 rounded-md mb-6"
          >
            <div className="flex items-start">
              <Sparkles className="h-5 w-5 mr-2 flex-shrink-0" />
              <div>
                <p className="font-medium">Purchase successful!</p>
                <p className="text-sm">
                  {selectedPackage?.credits} credits have been added to your account.
                  Your new balance is {user?.credits || 0} credits.
                </p>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Payment section */}
        {selectedPackage && !isSuccess && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
            className="border rounded-lg p-6"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="mb-4">
                  <p className="text-gray-600 mb-1">Selected Package</p>
                  <p className="font-medium text-gray-800">{selectedPackage.name} - {selectedPackage.credits} credits</p>
                </div>
                
                <div>
                  <p className="text-gray-600 mb-1">Amount</p>
                  <p className="font-medium text-gray-800">${selectedPackage.price.toFixed(2)}</p>
                </div>
              </div>
              
              <div>
                <div className="mb-4">
                  <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Card Number
                  </label>
                  <div className="relative">
                    <input
                      id="cardNumber"
                      type="text"
                      placeholder="4242 4242 4242 4242"
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all border-gray-300"
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <CreditCard className="h-4 w-4" />
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-gray-500 flex items-center">
                    <Tag className="h-3 w-3 mr-1" />
                    For demo purposes, no real payment will be processed
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="expDate" className="block text-sm font-medium text-gray-700 mb-1">
                      Expiration
                    </label>
                    <input
                      id="expDate"
                      type="text"
                      placeholder="MM/YY"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all border-gray-300"
                    />
                  </div>
                  <div>
                    <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                      CVV
                    </label>
                    <input
                      id="cvv"
                      type="text"
                      placeholder="123"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all border-gray-300"
                    />
                  </div>
                </div>
                
                <button
                  onClick={handlePurchase}
                  disabled={isProcessing}
                  className={`w-full py-2 px-4 bg-primary-500 text-white rounded-lg font-medium transition-all ${
                    isProcessing 
                      ? 'opacity-70 cursor-not-allowed'
                      : 'hover:bg-primary-600 active:bg-primary-700'
                  }`}
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    <span>Pay ${selectedPackage.price.toFixed(2)}</span>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
      
      {/* Additional info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white p-6 rounded-lg shadow-sm"
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Frequently Asked Questions</h3>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-800 mb-2">What are SMS credits?</h4>
            <p className="text-gray-600 text-sm">
              SMS credits are used to send text messages through our platform. Each message sent consumes one credit, regardless of the message length.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-800 mb-2">How long do credits last?</h4>
            <p className="text-gray-600 text-sm">
              Credits validity depends on the package you purchase. Basic package credits last for 30 days, Standard for 60 days, and Premium for 90 days.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-800 mb-2">Can I get a refund for unused credits?</h4>
            <p className="text-gray-600 text-sm">
              We don't offer refunds for purchased credits. However, if you encounter any issues with message delivery, our support team will assist you.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-800 mb-2">Do you offer custom packages?</h4>
            <p className="text-gray-600 text-sm">
              Yes, we offer custom packages for businesses with higher volume needs. Please contact our sales team for a tailored solution.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default BuyCredits;