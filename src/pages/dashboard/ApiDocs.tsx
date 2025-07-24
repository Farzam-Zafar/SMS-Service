import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, CheckCircle, Key, Code, RotateCw, RefreshCw, Shield } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const ApiDocs: React.FC = () => {
  const { user } = useAuth();
  const [copied, setCopied] = useState<{[key: string]: boolean}>({});
  const [apiKey, setApiKey] = useState('sk_test_51HG7uyDXgzGTRQr7j9l2jSKk3mGZ');
  const [isRegeneratingKey, setIsRegeneratingKey] = useState(false);
  
  // Sample code snippets
  const codeSnippets = {
    curl: `curl -X POST https://api.textpulse.com/v1/send \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "to": "+12345678901",
    "message": "Hello from TextPulse!"
  }'`,
    
    node: `const axios = require('axios');

const sendSMS = async () => {
  try {
    const response = await axios.post('https://api.textpulse.com/v1/send', {
      to: '+12345678901',
      message: 'Hello from TextPulse!'
    }, {
      headers: {
        'Authorization': 'Bearer ${apiKey}',
        'Content-Type': 'application/json'
      }
    });
    
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
};

sendSMS();`,
    
    python: `import requests

url = "https://api.textpulse.com/v1/send"
headers = {
    "Authorization": "Bearer ${apiKey}",
    "Content-Type": "application/json"
}
payload = {
    "to": "+12345678901",
    "message": "Hello from TextPulse!"
}

response = requests.post(url, json=payload, headers=headers)
print(response.json())`,
  };
  
  const endpoints = [
    {
      path: '/v1/send',
      method: 'POST',
      description: 'Send a single SMS message',
      parameters: [
        { name: 'to', type: 'string', required: true, description: 'Recipient phone number in E.164 format' },
        { name: 'message', type: 'string', required: true, description: 'The message content to send' },
        { name: 'from', type: 'string', required: false, description: 'Custom sender ID (if available)' },
      ]
    },
    {
      path: '/v1/send/bulk',
      method: 'POST',
      description: 'Send messages to multiple recipients',
      parameters: [
        { name: 'messages', type: 'array', required: true, description: 'Array of message objects with to and message properties' },
        { name: 'from', type: 'string', required: false, description: 'Custom sender ID (if available)' },
      ]
    },
    {
      path: '/v1/messages',
      method: 'GET',
      description: 'List message history',
      parameters: [
        { name: 'limit', type: 'number', required: false, description: 'Number of messages to return (default: 20, max: 100)' },
        { name: 'status', type: 'string', required: false, description: 'Filter by status: delivered, failed, pending' },
        { name: 'from', type: 'string', required: false, description: 'Filter by start date (ISO format)' },
        { name: 'to', type: 'string', required: false, description: 'Filter by end date (ISO format)' },
      ]
    },
    {
      path: '/v1/messages/:id',
      method: 'GET',
      description: 'Get details of a specific message',
      parameters: [
        { name: 'id', type: 'string', required: true, description: 'Message ID' },
      ]
    },
  ];
  
  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied({ [id]: true });
    setTimeout(() => {
      setCopied({ [id]: false });
    }, 2000);
  };
  
  const regenerateApiKey = async () => {
    setIsRegeneratingKey(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate new "API key"
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let newKey = 'sk_test_';
      
      for (let i = 0; i < 30; i++) {
        newKey += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      
      setApiKey(newKey);
    } catch (error) {
      console.error('Error regenerating API key:', error);
    } finally {
      setIsRegeneratingKey(false);
    }
  };
  
  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-6 rounded-lg shadow-sm mb-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">API Access</h2>
            <p className="text-gray-500 mt-1">Integrate SMS capabilities into your applications</p>
          </div>
        </div>
        
        {/* API Key Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-gray-50 p-6 rounded-lg mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center">
              <div className="bg-primary-100 p-2 rounded-full mr-4">
                <Key className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Your API Key</h3>
                <p className="text-sm text-gray-500">Use this key to authenticate your API requests</p>
              </div>
            </div>
            
            <button
              onClick={regenerateApiKey}
              disabled={isRegeneratingKey}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium ${
                isRegeneratingKey
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-primary-50 text-primary-600 hover:bg-primary-100'
              }`}
            >
              {isRegeneratingKey ? (
                <>
                  <RotateCw className="h-4 w-4 mr-2 animate-spin" />
                  Regenerating...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Regenerate Key
                </>
              )}
            </button>
          </div>
          
          <div className="mt-4 relative">
            <div className="flex items-center justify-between bg-gray-800 text-gray-200 p-3 rounded-md font-mono text-sm overflow-x-auto">
              <div className="truncate pr-10">
                {apiKey}
              </div>
              <button
                onClick={() => copyToClipboard(apiKey, 'apiKey')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {copied['apiKey'] ? (
                  <CheckCircle className="h-5 w-5 text-green-400" />
                ) : (
                  <Copy className="h-5 w-5" />
                )}
              </button>
            </div>
            <p className="mt-2 text-xs text-gray-500 flex items-center">
              <Shield className="h-3 w-3 mr-1" />
              Keep your API key secure and never share it publicly
            </p>
          </div>
        </motion.div>
        
        {/* Code Examples */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex items-center mb-4">
            <Code className="h-5 w-5 text-primary-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-800">Code Examples</h3>
          </div>
          
          <div className="border rounded-lg overflow-hidden">
            <div className="flex border-b">
              <button className="px-4 py-2 text-primary-600 border-b-2 border-primary-500 font-medium">
                Send SMS
              </button>
            </div>
            
            <div className="p-4 bg-gray-50">
              <div className="mb-6">
                <div className="flex border-b">
                  <button className="px-4 py-2 text-primary-600 border-b-2 border-primary-500 font-medium">
                    cURL
                  </button>
                  <button className="px-4 py-2 text-gray-500 hover:text-gray-700">
                    Node.js
                  </button>
                  <button className="px-4 py-2 text-gray-500 hover:text-gray-700">
                    Python
                  </button>
                </div>
                
                <div className="relative mt-4">
                  <pre className="bg-gray-800 text-gray-200 p-4 rounded-md overflow-x-auto text-sm">
                    {codeSnippets.curl}
                  </pre>
                  <button
                    onClick={() => copyToClipboard(codeSnippets.curl, 'curl')}
                    className="absolute top-3 right-3 p-1 bg-gray-700 rounded text-gray-300 hover:text-white"
                  >
                    {copied['curl'] ? (
                      <CheckCircle className="h-4 w-4 text-green-400" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              
              <div className="text-sm text-gray-600">
                <p>This example demonstrates how to send a single SMS message using the TextPulse API.</p>
                <p className="mt-2">
                  <strong>Note:</strong> Replace the phone number with the actual recipient's number in E.164 format (e.g., +12345678901).
                </p>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* API Endpoints Reference */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex items-center mb-4">
            <Code className="h-5 w-5 text-primary-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-800">API Reference</h3>
          </div>
          
          <div className="space-y-6">
            {endpoints.map((endpoint, index) => (
              <div 
                key={index} 
                className="border rounded-lg overflow-hidden"
              >
                <div className="flex items-center p-4 border-b bg-gray-50">
                  <span className={`px-2 py-1 text-xs font-bold rounded ${
                    endpoint.method === 'GET' 
                      ? 'bg-secondary-100 text-secondary-800' 
                      : 'bg-primary-100 text-primary-800'
                  }`}>
                    {endpoint.method}
                  </span>
                  <span className="ml-3 font-mono text-gray-800">{endpoint.path}</span>
                </div>
                
                <div className="p-4">
                  <p className="text-gray-600 mb-4">{endpoint.description}</p>
                  
                  <h4 className="font-medium text-gray-800 mb-2">Parameters</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                          <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                          <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Required</th>
                          <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {endpoint.parameters.map((param, i) => (
                          <tr key={i}>
                            <td className="px-4 py-2 text-sm font-medium text-gray-800">{param.name}</td>
                            <td className="px-4 py-2 text-sm text-gray-600">{param.type}</td>
                            <td className="px-4 py-2 text-sm">
                              {param.required ? (
                                <span className="text-primary-600">Yes</span>
                              ) : (
                                <span className="text-gray-500">No</span>
                              )}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-600">{param.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
      
      {/* Rate Limits & Policies */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-white p-6 rounded-lg shadow-sm"
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Rate Limits & Policies</h3>
        
        <div className="space-y-6">
          <div>
            <h4 className="font-medium text-gray-800 mb-2">Rate Limits</h4>
            <p className="text-gray-600 text-sm">
              To ensure API stability and prevent abuse, we enforce the following rate limits:
            </p>
            <ul className="mt-2 space-y-1 text-sm text-gray-600">
              <li className="flex items-start">
                <span className="text-primary-500 mr-2">•</span>
                <span>100 requests per minute for standard accounts</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-500 mr-2">•</span>
                <span>500 requests per minute for premium accounts</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-500 mr-2">•</span>
                <span>Rate limit headers are included in all API responses</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-800 mb-2">Authentication</h4>
            <p className="text-gray-600 text-sm">
              All API requests must include your API key in the Authorization header:
            </p>
            <pre className="mt-2 bg-gray-50 p-3 rounded text-sm overflow-x-auto">
              Authorization: Bearer YOUR_API_KEY
            </pre>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-800 mb-2">Error Handling</h4>
            <p className="text-gray-600 text-sm">
              The API uses conventional HTTP response codes to indicate success or failure:
            </p>
            <ul className="mt-2 space-y-1 text-sm text-gray-600">
              <li className="flex items-start">
                <span className="text-primary-500 mr-2">•</span>
                <span>2xx: Success</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-500 mr-2">•</span>
                <span>4xx: Client errors (e.g., invalid parameters, authentication errors)</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-500 mr-2">•</span>
                <span>5xx: Server errors</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-800 mb-2">Support</h4>
            <p className="text-gray-600 text-sm">
              If you encounter any issues or have questions about our API, please contact our support team at <a href="mailto:api-support@textpulse.com" className="text-primary-600 hover:underline">api-support@textpulse.com</a>.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ApiDocs;