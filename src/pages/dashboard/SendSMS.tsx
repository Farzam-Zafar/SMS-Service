import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { motion } from 'framer-motion';
import { 
  Send, 
  Plus, 
  Trash2, 
  Upload, 
  MessageSquare, 
  AlertCircle, 
  CheckCircle,
  FileText,
  List
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SingleMessageFormData {
  recipientPhone: string;
  messageContent: string;
}

interface BulkMessageFormData {
  messageContent: string;
  recipients: { phone: string }[];
}

type MessageMode = 'single' | 'bulk';

const SendSMS: React.FC = () => {
  const { user } = useAuth();
  const [apiConfigured, setApiConfigured] = useState(false);
  
  // Check if API is configured on component mount
  useEffect(() => {
    const checkApiConfig = async () => {
      const { loadSMSConfiguration } = await import('../../services/smsService');
      const config = loadSMSConfiguration();
      setApiConfigured(Boolean(config.apiKey && config.accountSid && config.fromNumber));
    };
    
    checkApiConfig();
  }, []);
  const [mode, setMode] = useState<MessageMode>('single');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{success?: boolean; message?: string}>({});
  
  // Form for single message
  const { 
    register: registerSingle, 
    handleSubmit: handleSubmitSingle, 
    reset: resetSingle,
    watch: watchSingle,
    formState: { errors: errorsSingle } 
  } = useForm<SingleMessageFormData>();
  
  // Form for bulk messages
  const { 
    register: registerBulk, 
    control,
    handleSubmit: handleSubmitBulk, 
    reset: resetBulk,
    watch: watchBulk,
    formState: { errors: errorsBulk },
    setValue
  } = useForm<BulkMessageFormData>({
    defaultValues: {
      messageContent: '',
      recipients: [{ phone: '' }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "recipients"
  });
  
  const onSubmitSingle = async (data: SingleMessageFormData) => {
    setIsLoading(true);
    setResult({});
    
    try {
      // Import dynamically to avoid circular dependencies
      const { sendSMS, loadSMSConfiguration } = await import('../../services/smsService');
      
      // Check if API is configured
      const config = loadSMSConfiguration();
      if (!config.apiKey || !config.accountSid || !config.fromNumber) {
        throw new Error('SMS API not configured. Please set up your API credentials in Settings.');
      }
      
      // Check if user has enough credits
      if ((user?.credits || 0) < 1) {
        throw new Error('Insufficient credits. Please purchase more credits to send messages.');
      }
      
      // Send SMS using the service
      const response = await sendSMS(data.recipientPhone, data.messageContent);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to send message');
      }
      
      setResult({
        success: true,
        message: `Message sent to ${data.recipientPhone}${response.messageId ? ` (ID: ${response.messageId})` : ''}`
      });
      
      // Reset form after successful submission
      resetSingle();
      
    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to send message'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const onSubmitBulk = async (data: BulkMessageFormData) => {
    setIsLoading(true);
    setResult({});
    
    try {
      // Import dynamically to avoid circular dependencies
      const { sendBulkSMS, loadSMSConfiguration } = await import('../../services/smsService');
      
      // Check if API is configured
      const config = loadSMSConfiguration();
      if (!config.apiKey || !config.accountSid || !config.fromNumber) {
        throw new Error('SMS API not configured. Please set up your API credentials in Settings.');
      }
      
      // Check if user has enough credits
      const requiredCredits = data.recipients.length;
      if ((user?.credits || 0) < requiredCredits) {
        throw new Error('Insufficient credits. Please purchase more credits to send bulk messages.');
      }
      
      // Extract phone numbers from recipients
      const phoneNumbers = data.recipients.map(r => r.phone).filter(Boolean);
      
      // Send bulk SMS using the service
      const response = await sendBulkSMS(phoneNumbers, data.messageContent);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to send messages');
      }
      
      setResult({
        success: true,
        message: `${phoneNumbers.length} messages sent${response.failedCount ? ` (${response.failedCount} failed)` : ''}`
      });
      
      // Reset form after successful submission
      resetBulk();
      setValue('recipients', [{ phone: '' }]);
      
    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to send messages'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // CSV format: phone,name (optional)
    // Example: +1234567890,John Doe
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const csvData = event.target?.result as string;
        const lines = csvData.split('\n').filter(line => line.trim());
        
        // Skip header line if it exists
        const firstLine = lines[0];
        const startIndex = firstLine.includes('phone') || firstLine.includes('Phone') ? 1 : 0;
        
        // Parse phone numbers
        const phones = lines.slice(startIndex).map(line => {
          const parts = line.split(',');
          return { phone: parts[0].trim() };
        }).filter(item => item.phone);
        
        // Update form
        setValue('recipients', phones);
        
      } catch (error) {
        console.error('Error parsing CSV file', error);
        setResult({
          success: false,
          message: 'Error parsing CSV file. Please ensure it is properly formatted.'
        });
      }
    };
    
    reader.readAsText(file);
    
    // Clear the file input value so the same file can be uploaded again
    e.target.value = '';
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-6 rounded-lg shadow-sm mb-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Send SMS</h2>
          <div className="text-sm text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
            {user?.credits || 0} credits available
          </div>
        </div>
        
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <div className="flex">
            <div className="flex-shrink-0">
              <MessageSquare className="h-5 w-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Sending SMS Messages</h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>You currently have <span className="font-semibold">{user?.credits || 0} credits</span> available.</p>
                <p className="mt-1">Each message costs 1 credit. Purchase more credits from the billing page.</p>
                
                {!apiConfigured && (
                  <div className="mt-2 p-2 bg-yellow-100 rounded border border-yellow-200">
                    <p className="text-yellow-800 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      <span>API not configured. <a href="/api-settings" className="underline font-medium">Set up your API credentials</a> to send real messages.</span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Message mode selection tabs */}
        <div className="flex border-b mb-6">
          <button
            onClick={() => setMode('single')}
            className={`px-4 py-2 font-medium text-sm ${
              mode === 'single'
                ? 'text-primary-600 border-b-2 border-primary-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <span className="flex items-center">
              <MessageSquare className="h-4 w-4 mr-2" />
              Single Message
            </span>
          </button>
          <button
            onClick={() => setMode('bulk')}
            className={`px-4 py-2 font-medium text-sm ${
              mode === 'bulk'
                ? 'text-primary-600 border-b-2 border-primary-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <span className="flex items-center">
              <List className="h-4 w-4 mr-2" />
              Bulk Messages
            </span>
          </button>
        </div>
        
        {/* Result message */}
        {result.message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-md mb-6 ${
              result.success
                ? 'bg-success-50 text-success-700'
                : 'bg-error-50 text-error-700'
            }`}
          >
            <div className="flex items-start">
              {result.success ? (
                <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
              ) : (
                <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
              )}
              <span>{result.message}</span>
            </div>
          </motion.div>
        )}
        
        {/* Single message form */}
        {mode === 'single' && (
          <form onSubmit={handleSubmitSingle(onSubmitSingle)} className="space-y-4">
            <div>
              <label htmlFor="recipientPhone" className="block text-sm font-medium text-gray-700 mb-1">
                Recipient Phone Number
              </label>
              <input
                id="recipientPhone"
                type="tel"
                placeholder="+1234567890"
                {...registerSingle('recipientPhone', { 
                  required: 'Phone number is required',
                  pattern: {
                    value: /^\+?[1-9]\d{1,14}$/,
                    message: 'Please enter a valid phone number'
                  }
                })}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all ${
                  errorsSingle.recipientPhone ? 'border-error-500' : 'border-gray-300'
                }`}
              />
              {errorsSingle.recipientPhone && (
                <p className="mt-1 text-sm text-error-600">{errorsSingle.recipientPhone.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="messageContent" className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                id="messageContent"
                rows={4}
                placeholder="Type your message here..."
                {...registerSingle('messageContent', { 
                  required: 'Message is required',
                  maxLength: {
                    value: 160,
                    message: 'Message must be less than 160 characters'
                  }
                })}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all ${
                  errorsSingle.messageContent ? 'border-error-500' : 'border-gray-300'
                }`}
              />
              {errorsSingle.messageContent ? (
                <p className="mt-1 text-sm text-error-600">{errorsSingle.messageContent.message}</p>
              ) : (
                <p className="mt-1 text-xs text-gray-500 flex items-center justify-end">
                  <FileText className="h-3 w-3 mr-1" />
                  Characters count: {
                    (watchSingle('messageContent') || '').length
                  }/160
                </p>
              )}
            </div>
            
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full sm:w-auto px-6 py-2 bg-primary-500 text-white rounded-lg font-medium flex items-center justify-center transition-all ${
                  isLoading 
                    ? 'opacity-70 cursor-not-allowed'
                    : 'hover:bg-primary-600 active:bg-primary-700'
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </span>
                )}
              </button>
            </div>
          </form>
        )}
        
        {/* Bulk message form */}
        {mode === 'bulk' && (
          <form onSubmit={handleSubmitBulk(onSubmitBulk)} className="space-y-4">
            <div>
              <label htmlFor="bulkMessageContent" className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                id="bulkMessageContent"
                rows={4}
                placeholder="Type your message here..."
                {...registerBulk('messageContent', { 
                  required: 'Message is required',
                  maxLength: {
                    value: 160,
                    message: 'Message must be less than 160 characters'
                  }
                })}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all ${
                  errorsBulk.messageContent ? 'border-error-500' : 'border-gray-300'
                }`}
              />
              {errorsBulk.messageContent ? (
                <p className="mt-1 text-sm text-error-600">{errorsBulk.messageContent.message}</p>
              ) : (
                <p className="mt-1 text-xs text-gray-500 flex items-center justify-end">
                  <FileText className="h-3 w-3 mr-1" />
                  Characters count: {
                    (watchBulk('messageContent') || '').length
                  }/160
                </p>
              )}
            </div>
            
            {/* CSV Upload */}
            <div className="p-4 bg-gray-50 rounded-lg mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Import Recipients</h3>
              <div className="flex items-center">
                <label htmlFor="csvFileUpload" className="cursor-pointer flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload CSV
                  <input
                    id="csvFileUpload"
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="sr-only"
                  />
                </label>
                <span className="ml-3 text-xs text-gray-500">
                  CSV format: one phone number per line
                </span>
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Recipients ({fields.length})
                </label>
                <button
                  type="button"
                  onClick={() => append({ phone: '' })}
                  className="text-sm text-primary-600 hover:text-primary-700 flex items-center"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add
                </button>
              </div>
              
              <div className="space-y-2 max-h-80 overflow-y-auto p-1">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-center gap-2">
                    <input
                      type="tel"
                      placeholder="+1234567890"
                      {...registerBulk(`recipients.${index}.phone` as const, { 
                        required: 'Required',
                        pattern: {
                          value: /^\+?[1-9]\d{1,14}$/,
                          message: 'Invalid'
                        }
                      })}
                      className={`flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all ${
                        errorsBulk.recipients?.[index]?.phone ? 'border-error-500' : 'border-gray-300'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="p-2 text-gray-400 hover:text-error-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
              
              {/* Error if no recipients */}
              {errorsBulk.recipients && (
                <p className="mt-1 text-sm text-error-600">At least one recipient is required</p>
              )}
            </div>
            
            <div className="pt-4 flex flex-wrap gap-4">
              <button
                type="submit"
                disabled={isLoading || fields.length === 0}
                className={`px-6 py-2 bg-primary-500 text-white rounded-lg font-medium flex items-center justify-center transition-all ${
                  isLoading || fields.length === 0
                    ? 'opacity-70 cursor-not-allowed'
                    : 'hover:bg-primary-600 active:bg-primary-700'
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Send className="h-4 w-4 mr-2" />
                    Send to {fields.length} Recipients
                  </span>
                )}
              </button>
              
              <p className="text-sm text-gray-500 flex items-center self-center">
                This will use {fields.length} credits
              </p>
            </div>
          </form>
        )}
      </motion.div>
      
      {/* SMS Guidelines */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white p-6 rounded-lg shadow-sm"
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4">SMS Best Practices</h3>
        <ul className="space-y-2 text-gray-600 text-sm">
          <li className="flex items-start">
            <span className="text-primary-500 mr-2">•</span>
            Keep messages concise and under 160 characters to avoid splitting.
          </li>
          <li className="flex items-start">
            <span className="text-primary-500 mr-2">•</span>
            Include a clear call-to-action if applicable.
          </li>
          <li className="flex items-start">
            <span className="text-primary-500 mr-2">•</span>
            Identify yourself at the beginning of the message.
          </li>
          <li className="flex items-start">
            <span className="text-primary-500 mr-2">•</span>
            Respect local regulations and obtain consent before sending messages.
          </li>
          <li className="flex items-start">
            <span className="text-primary-500 mr-2">•</span>
            Include opt-out instructions (e.g., "Reply STOP to unsubscribe").
          </li>
        </ul>
      </motion.div>
    </div>
  );
};

export default SendSMS;