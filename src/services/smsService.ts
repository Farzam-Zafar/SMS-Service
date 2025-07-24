// SMS Service using Twilio API
// This service handles SMS sending functionality with API key authentication

import { trackMessage, updateMessageStatus, pollMessageStatus } from './messageTrackingService';

interface SMSResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

interface BulkSMSResponse {
  success: boolean;
  messageIds?: string[];
  failedCount?: number;
  error?: string;
}

// Configuration for the SMS service
interface SMSConfig {
  apiKey: string;
  accountSid: string;
  fromNumber: string;
}

// Default configuration with provided Twilio credentials

};

// Current configuration
let currentConfig: SMSConfig = {...defaultConfig};

/**
 * Configure the SMS service with API credentials
 * @param config SMS service configuration
 */
export const configureSMSService = (config: Partial<SMSConfig>) => {
  currentConfig = {
    ...currentConfig,
    ...config
  };
  
  // Store in localStorage for persistence
  localStorage.setItem('sms_api_config', JSON.stringify(currentConfig));
  
  return currentConfig;
};

/**
 * Load SMS configuration from localStorage
 */
export const loadSMSConfiguration = (): SMSConfig => {
  const storedConfig = localStorage.getItem('sms_api_config');
  if (storedConfig) {
    try {
      const parsedConfig = JSON.parse(storedConfig);
      currentConfig = {
        ...currentConfig,
        ...parsedConfig
      };
    } catch (e) {
      console.error('Failed to parse stored SMS configuration');
    }
  }
  return currentConfig;
};

/**
 * Send a single SMS message
 * @param to Recipient phone number (E.164 format)
 * @param message Message content
 * @returns Promise with SMS response
 */
// Set to false to send real SMS messages
const SIMULATION_MODE = false;

export const sendSMS = async (to: string, message: string): Promise<SMSResponse> => {
  // Use the hardcoded credentials from your code example
    
  try {
    // Create a placeholder tracking record
    const tempId = `temp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    trackMessage(tempId, to, message);
    
    // Add sender name to the message
    const messageWithTitle = `Message from ${senderName}:\n\n${message}`;
    
    // Check if we're in simulation mode
    if (SIMULATION_MODE) {
      console.log('SIMULATION MODE: No actual SMS sent');
      console.log('Would have sent the following message:');
      console.log(`To: ${to}`);
      console.log(`From: ${fromNumber}`);
      console.log(`Message: ${messageWithTitle}`);
      
      // Generate a fake message SID
      const fakeSid = `SM${Math.random().toString(36).substring(2, 12)}${Date.now().toString().substring(5)}`;
      console.log(`Simulated Message SID: ${fakeSid}`);
      
      // Update tracking with success
      updateMessageStatus(tempId, 'sent');
      setTimeout(() => updateMessageStatus(tempId, 'delivered'), 3000);
      
      return {
        success: true,
        messageId: fakeSid
      };
    }
    
    // Real SMS sending mode below
    // Twilio API endpoint
    const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
    
    // Create form data (Twilio uses form data instead of JSON)
    const formData = new URLSearchParams();
    formData.append('To', to);
    formData.append('From', fromNumber);
    formData.append('Body', messageWithTitle);
    
    // Basic auth with Account SID and Auth Token
    const auth = btoa(`${accountSid}:${authToken}`);
    
    // Make API request
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      // Update tracking with failure
      updateMessageStatus(tempId, 'failed', data.message || 'Failed to send SMS');
      
      console.error('Failed to send message:', data);
      return {
        success: false,
        error: data.message || 'Failed to send SMS'
      };
    }
    
    // Update tracking with real message ID and sent status
    const realId = data.sid;
    updateMessageStatus(tempId, 'sent');
    
    // Log the message SID as in your example
    console.log('Message SID:', data.sid);
    
    // Start polling for status updates in the background
    setTimeout(() => {
      pollMessageStatus(tempId).catch(console.error);
    }, 5000);
    
    return {
      success: true,
      messageId: realId
    };
  } catch (error) {
    console.error('Error sending message:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

/**
 * Send bulk SMS messages
 * @param recipients Array of recipient phone numbers
 * @param message Message content
 * @returns Promise with bulk SMS response
 */
export const sendBulkSMS = async (recipients: string[], message: string): Promise<BulkSMSResponse> => {
  // Load configuration if not already loaded
  if (!currentConfig.apiKey) {
    loadSMSConfiguration();
  }
  
  // Check if configuration is set
  if (!currentConfig.apiKey || !currentConfig.accountSid) {
    return {
      success: false,
      error: 'SMS service not configured. Please set your API credentials.'
    };
  }
  
  try {
    const messageIds: string[] = [];
    let failedMessages: number = 0;
    
    // Send messages sequentially to avoid rate limiting
    for (const recipient of recipients) {
      const result = await sendSMS(recipient, message);
      if (result.success && result.messageId) {
        messageIds.push(result.messageId);
      } else {
        failedMessages += 1;
      }
    }
    
    return {
      success: messageIds.length > 0,
      messageIds,
      failedCount: failedMessages
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

/**
 * Test the API connection to verify credentials
 * @returns Promise with test result
 */
export const testConnection = async (): Promise<{success: boolean; error?: string}> => {
  // Load configuration if not already loaded
  if (!currentConfig.apiKey) {
    loadSMSConfiguration();
  }
  
  // Check if configuration is set
  if (!currentConfig.apiKey || !currentConfig.accountSid || !currentConfig.fromNumber) {
    return {
      success: false,
      error: 'SMS service not configured. Please set your API credentials.'
    };
  }
  
  try {
    // Twilio API endpoint to fetch account info
    const url = `https://api.twilio.com/2010-04-01/Accounts/${currentConfig.accountSid}.json`;
    
    // Basic auth with Account SID and Auth Token (API Key)
    const auth = btoa(`${currentConfig.accountSid}:${currentConfig.apiKey}`);
    
    // Make API request
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.message || `API returned error: ${response.status} ${response.statusText}`
      };
    }
    
    // If we get here, the connection was successful
    return {
      success: true
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};
