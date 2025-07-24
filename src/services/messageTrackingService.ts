// Message Tracking Service
// This service handles tracking the status of sent SMS messages

export interface MessageStatus {
  id: string;
  to: string;
  content: string;
  status: 'queued' | 'sent' | 'delivered' | 'failed';
  createdAt: Date;
  updatedAt: Date;
  errorMessage?: string;
}

// In-memory storage for message tracking (in a real app, this would use a database)
const messageStore: Record<string, MessageStatus> = {};

/**
 * Track a new message
 * @param id Message ID
 * @param to Recipient phone number
 * @param content Message content
 * @returns The created message status object
 */
export const trackMessage = (id: string, to: string, content: string): MessageStatus => {
  const now = new Date();
  const message: MessageStatus = {
    id,
    to,
    content,
    status: 'queued',
    createdAt: now,
    updatedAt: now
  };
  
  messageStore[id] = message;
  return message;
};

/**
 * Update the status of a message
 * @param id Message ID
 * @param status New status
 * @param errorMessage Optional error message
 * @returns The updated message status object or null if not found
 */
export const updateMessageStatus = (
  id: string, 
  status: 'queued' | 'sent' | 'delivered' | 'failed',
  errorMessage?: string
): MessageStatus | null => {
  if (!messageStore[id]) {
    return null;
  }
  
  messageStore[id] = {
    ...messageStore[id],
    status,
    updatedAt: new Date(),
    ...(errorMessage && { errorMessage })
  };
  
  return messageStore[id];
};

/**
 * Get all tracked messages
 * @returns Array of message status objects
 */
export const getAllMessages = (): MessageStatus[] => {
  return Object.values(messageStore).sort((a, b) => 
    b.createdAt.getTime() - a.createdAt.getTime()
  );
};

/**
 * Get a specific message by ID
 * @param id Message ID
 * @returns Message status object or null if not found
 */
export const getMessage = (id: string): MessageStatus | null => {
  return messageStore[id] || null;
};

/**
 * Poll for message status updates (simulated for demo)
 * In a real implementation, this would call the SMS provider's API
 * @param messageId Message ID to check
 * @returns Promise that resolves when the status is updated
 */
export const pollMessageStatus = async (messageId: string): Promise<MessageStatus | null> => {
  const message = getMessage(messageId);
  if (!message) {
    return null;
  }
  
  // Skip if already in a final state
  if (message.status === 'delivered' || message.status === 'failed') {
    return message;
  }
  
  // Simulate status progression with random timing and outcomes
  const delay = 2000 + Math.random() * 3000;
  
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate status progression
      if (message.status === 'queued') {
        // Move from queued to sent (95% chance of success)
        if (Math.random() < 0.95) {
          updateMessageStatus(messageId, 'sent');
        } else {
          updateMessageStatus(messageId, 'failed', 'Failed to send message');
        }
      } else if (message.status === 'sent') {
        // Move from sent to delivered (90% chance of success)
        if (Math.random() < 0.9) {
          updateMessageStatus(messageId, 'delivered');
        } else {
          updateMessageStatus(messageId, 'failed', 'Delivery failed');
        }
      }
      
      resolve(getMessage(messageId));
    }, delay);
  });
};
