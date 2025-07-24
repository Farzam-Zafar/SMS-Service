import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Key, Shield, AlertCircle, CheckCircle, RefreshCw, Zap } from 'lucide-react';
import { configureSMSService, loadSMSConfiguration, testConnection } from '../../services/smsService';

const ApiSettings: React.FC = () => {
  const [formData, setFormData] = useState({
    accountSid: '',
    apiKey: '',
    fromNumber: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [testResult, setTestResult] = useState<{success: boolean; message: string} | null>(null);
  
  // Load existing configuration on component mount
  useEffect(() => {
    const config = loadSMSConfiguration();
    setFormData({
      accountSid: config.accountSid || '',
      apiKey: config.apiKey || '',
      fromNumber: config.fromNumber || ''
    });
  }, []);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);
    setTestResult(null);
    
    try {
      // Save the configuration
      configureSMSService({
        accountSid: formData.accountSid,
        apiKey: formData.apiKey,
        fromNumber: formData.fromNumber
      });
      
      setMessage({
        type: 'success',
        text: 'API settings saved successfully!'
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to save API settings'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    
    try {
      // Test the API connection
      const result = await testConnection();
      setTestResult({
        success: result.success,
        message: result.success ? 'Connection successful! Your API credentials are working.' : result.error || 'Connection failed. Please check your credentials.'
      });
    } catch (error) {
      setTestResult({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to test connection'
      });
    } finally {
      setIsTesting(false);
    }
  };
  
  return (
    <motion.div 
      className="p-6 bg-white rounded-xl shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center mb-6">
        <Key className="w-6 h-6 text-blue-600 mr-2" />
        <h2 className="text-2xl font-bold text-gray-800">API Settings</h2>
      </div>
      
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-blue-600" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Free Trial Credits</h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>To use free trial credits, sign up for a Twilio account at <a href="https://www.twilio.com/try-twilio" target="_blank" rel="noopener noreferrer" className="font-medium underline">twilio.com/try-twilio</a>.</p>
              <p className="mt-1">After signing up, you'll receive:</p>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>Account SID</li>
                <li>Auth Token (API Key)</li>
                <li>Twilio Phone Number</li>
              </ul>
              <p className="mt-2">Enter these credentials below to start sending SMS messages with your free trial credits.</p>
            </div>
          </div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="accountSid" className="block text-sm font-medium text-gray-700">
              Account SID
            </label>
            <input
              type="text"
              id="accountSid"
              name="accountSid"
              value={formData.accountSid}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              required
            />
          </div>
          
          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700">
              Auth Token (API Key)
            </label>
            <input
              type="password"
              id="apiKey"
              name="apiKey"
              value={formData.apiKey}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              <Shield className="inline-block w-3 h-3 mr-1" />
              Your API key is stored locally and never sent to our servers
            </p>
          </div>
          
          <div>
            <label htmlFor="fromNumber" className="block text-sm font-medium text-gray-700">
              Twilio Phone Number
            </label>
            <input
              type="text"
              id="fromNumber"
              name="fromNumber"
              value={formData.fromNumber}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="+1234567890"
              required
            />
          </div>
        </div>
        
        {message && (
          <div className={`mt-4 p-3 rounded-md ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            {message.type === 'success' ? (
              <CheckCircle className="inline-block w-4 h-4 mr-2" />
            ) : (
              <AlertCircle className="inline-block w-4 h-4 mr-2" />
            )}
            {message.text}
          </div>
        )}
        
        <div className="mt-6 space-y-3">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <RefreshCw className="animate-spin -ml-1 mr-2 h-4 w-4" />
                Saving...
              </>
            ) : (
              <>
                <Save className="-ml-1 mr-2 h-4 w-4" />
                Save API Settings
              </>
            )}
          </button>
          
          <button
            type="button"
            onClick={handleTestConnection}
            disabled={isTesting || !formData.accountSid || !formData.apiKey || !formData.fromNumber}
            className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isTesting ? (
              <>
                <RefreshCw className="animate-spin -ml-1 mr-2 h-4 w-4" />
                Testing Connection...
              </>
            ) : (
              <>
                <Zap className="-ml-1 mr-2 h-4 w-4" />
                Test Connection
              </>
            )}
          </button>
          
          {testResult && (
            <div className={`mt-4 p-3 rounded-md ${testResult.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
              {testResult.success ? (
                <CheckCircle className="inline-block w-4 h-4 mr-2" />
              ) : (
                <AlertCircle className="inline-block w-4 h-4 mr-2" />
              )}
              {testResult.message}
            </div>
          )}
        </div>
      </form>
    </motion.div>
  );
};

export default ApiSettings;
