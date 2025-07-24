// MessageBird SMS Service
// This service handles SMS sending functionality with MessageBird API

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
  originator: string; // Sender ID or phone number
}

// Default configuration - you'll need to replace with your MessageBird credentials
const defaultConfig: SMSConfig = {
  apiKey: '', // Your MessageBird API Key
  originator: 'Farzam', // Your sender name or phone number
};

// Current configuration
let currentConfig: SMSConfig = {...defaultConfig};

/**
 * Configure the SMS service with API credentials
 * @param config SMS service configuration
 */
export const configureMessageBirdService = (config: Partial<SMSConfig>) => {
  currentConfig = {
    ...currentConfig,
    ...config
  };
  
  // Store in localStorage for persistence
  localStorage.setItem('messagebird_config', JSON.stringify(currentConfig));
  
  return currentConfig;
};

/**
 * Load SMS configuration from localStorage
 */
export const loadMessageBirdConfiguration = (): SMSConfig => {
  const storedConfig = localStorage.getItem('messagebird_config');
  if (storedConfig) {
    try {
      const parsedConfig = JSON.parse(storedConfig);
      currentConfig = {
        ...currentConfig,
        ...parsedConfig
      };
    } catch (e) {
      console.error('Failed to parse stored MessageBird configuration');
    }
  }
  return currentConfig;
};

// Set to false to send real SMS messages
const SIMULATION_MODE = true;

/**
 * Send a single SMS message using MessageBird
 * @param to Recipient phone number (E.164 format)
 * @param message Message content
 * @returns Promise with SMS response
 */
export const sendSMS = async (to: string, message: string): Promise<SMSResponse> => {
  // Use hardcoded credentials for testing
  // Replace with your MessageBird API key when you sign up
  const apiKey = 'YOUR_MESSAGEBIRD_API_KEY'; 
  const originator = 'Farzam';
  const senderName = 'Farzam';
  
  try {
    // Create a placeholder tracking record
    const tempId = `temp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    trackMessage(tempId, to, message);
    
    // Add sender name to the message
    const messageWithTitle = `Message from ${senderName}:\n\n${message}`;
    
    // Check if we're in simulation mode
    if (SIMULATION_MODE) {
      console.log('SIMULATION MODE: No actual SMS sent');
      console.log('Would have sent the following message via MessageBird:');
      console.log(`To: ${to}`);
      console.log(`From: ${originator}`);
      console.log(`Message: ${messageWithTitle}`);
      
      // Generate a fake message ID
      const fakeId = `mb-${Math.random().toString(36).substring(2, 12)}${Date.now().toString().substring(5)}`;
      console.log(`Simulated MessageBird ID: ${fakeId}`);
      
      // Update tracking with success
      updateMessageStatus(tempId, 'sent');
      setTimeout(() => updateMessageStatus(tempId, 'delivered'), 3000);
      
      return {
        success: true,
        messageId: fakeId
      };
    }
    
    // MessageBird API endpoint
    const url = 'https://rest.messagebird.com/messages';
    
    // Create request body
    const requestBody = {
      recipients: [to],
      originator: originator,
      body: messageWithTitle
    };
    
    // Make API request
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `AccessKey ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      // Update tracking with failure
      updateMessageStatus(tempId, 'failed', data.errors?.[0]?.description || 'Failed to send SMS');
      
      console.error('Failed to send message:', data);
      return {
        success: false,
        error: data.errors?.[0]?.description || 'Failed to send SMS'
      };
    }
    
    // Update tracking with real message ID and sent status
    const realId = data.id;
    updateMessageStatus(tempId, 'sent');
    
    // Log the message ID
    console.log('MessageBird Message ID:', data.id);
    
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
 * Send bulk SMS messages using MessageBird
 * @param recipients Array of recipient phone numbers
 * @param message Message content
 * @returns Promise with bulk SMS response
 */
export const sendBulkSMS = async (recipients: string[], message: string): Promise<BulkSMSResponse> => {
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
  if (SIMULATION_MODE) {
    return {
      success: true
    };
  }
  
  try {
    // Load configuration
    loadMessageBirdConfiguration();
    
    // Check if configuration is set
    if (!currentConfig.apiKey) {
      return {
        success: false,
        error: 'MessageBird API key not configured'
      };
    }
    
    // MessageBird API endpoint to check balance (simple test)
    const url = 'https://rest.messagebird.com/balance';
    
    // Make API request
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `AccessKey ${currentConfig.apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.errors?.[0]?.description || `API returned error: ${response.status} ${response.statusText}`
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
