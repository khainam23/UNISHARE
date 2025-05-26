import api, { apiRequestWithRetry } from './api';
import cacheService from './cacheService';
import { authService } from './index';
import echo from './echoService';

const chatService = {
  /**
   * Get user's chats
   * @param {Object} params - Query parameters like page, limit, etc.
   * @param {boolean} useCache - Whether to use cached data if available
   * @returns {Promise} Promise with user's chats
   */  getUserChats: async (params = {}, useCache = true) => {
    // Tạo cache key từ params và user ID
    const user = authService.getUser();
    const userId = user?.id || 'anonymous';
    const cacheKey = `user_chats_${userId}_${JSON.stringify(params)}`;
    
    // Sử dụng memoize để tránh duplicate calls
    if (useCache) {
      console.log('Using cached user chats data');
      return cacheService.memoize(
        cacheKey,
        async () => {
          try {
            const response = await api.get('/chats', { params });
            
            let result;
            
            // If the API returns a nested structure with data.data, standardize it
            if (response.data && response.data.data) {
              result = {
                success: true,
                data: response.data.data
              };
            }
            // If the API returns data directly
            else if (response.data) {
              result = {
                success: true,
                data: response.data
              };
            }
            else {
              result = response.data;
            }
            
            return result;
          } catch (error) {
            console.error('Error fetching user chats:', error.response?.data || error.message);
            return {
              success: false,
              message: error.response?.data?.message || error.message || 'Could not fetch user chats',
              data: []
            };
          }
        }
      );
    } else {
      console.log('Bypassing cache for user chats, fetching fresh data');
      try {
        const response = await api.get('/chats', { params });
        
        let result;
        
        // If the API returns a nested structure with data.data, standardize it
        if (response.data && response.data.data) {
          result = {
            success: true,
            data: response.data.data
          };
        }
        // If the API returns data directly
        else if (response.data) {
          result = {
            success: true,
            data: response.data
          };
        }
        else {
          result = response.data;
        }
        
        return result;
      } catch (error) {
        console.error('Error fetching user chats:', error.response?.data || error.message);
        return {
          success: false,
          message: error.response?.data?.message || error.message || 'Could not fetch user chats',
          data: []
        };
      }
    }
  },

  /**
   * Get a specific chat by ID
   * @param {Number} chatId - The ID of the chat
   * @returns {Promise} Promise with chat data
   */
  getChat: async (chatId) => {
    try {
      const response = await api.get(`/chats/${chatId}`);
      
      // If the API returns a nested structure, unwrap it for consistency
      if (response.data && response.data.data) {
        return {
          success: true,
          data: response.data.data
        };
      }
      
      // If the API returns data directly
      if (response.data) {
        return {
          success: true,
          data: response.data
        };
      }
      
      return response.data;
    } catch (error) {
      console.error('Error fetching chat:', error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Could not fetch chat details'
      };
    }
  },

  /**
   * Get messages for a chat
   * @param {Number} chatId - The ID of the chat
   * @param {Object} params - Query parameters like page, limit, etc.
   * @returns {Promise} Promise with chat messages
   */
  getChatMessages: async (chatId, params = {}) => {
    try {
      console.log(`Fetching messages for chat ${chatId}`);
      
      // Add sort parameter to ensure messages are returned in chronological order
      const queryParams = { 
        ...params,
        sort_by: 'created_at',
        sort_direction: 'asc' 
      };
      
      const response = await apiRequestWithRetry('get', `/chats/${chatId}/messages`, null, {
        params: queryParams
      });
      
      console.log('Messages response:', response.data);
      
      // Standardize the response format to ensure we always return an array
      if (response.data && typeof response.data === 'object') {
        // Check if the response has a data property that's an array
        if (response.data.data && Array.isArray(response.data.data)) {
          return {
            success: true,
            data: response.data.data
          };
        }
        
        // Check if the response itself is an array
        if (Array.isArray(response.data)) {
          return {
            success: true,
            data: response.data
          };
        }
        
        // Default fallback - return an empty array if we can't find a valid messages array
        console.warn('Unexpected chat messages format:', response.data);
        return {
          success: true,
          data: []
        };
      }
      
      // If response.data is not an object, return empty array
      return {
        success: false,
        message: 'Invalid response format',
        data: []
      };
    } catch (error) {
      console.error('Error fetching chat messages:', error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Could not fetch chat messages',
        data: []
      };
    }
  },

  /**
   * Send a message to a chat
   * @param {Number} chatId - The ID of the chat
   * @param {Object} messageData - The message data
   * @returns {Promise} Promise with sent message data
   */  sendMessage: async (chatId, messageData) => {
    try {
      console.log(`Sending message to chat ${chatId}:`, messageData);
      
      // Ensure content is sent properly and never null/undefined
      const payload = {
        content: (messageData.content || '').trim()
      };
      
      // Validate that we have content to send
      if (!payload.content) {
        return {
          success: false,
          message: 'Message content is required'
        };
      }
      
      const response = await apiRequestWithRetry('post', `/chats/${chatId}/messages`, payload);
      
      console.log('Message send response:', response.data);
      
      // Check for various success response formats
      if (response.data) {
        return {
          success: true,
          data: response.data.data || response.data,
          message: 'Message sent successfully'
        };
      }
      
      return {
        success: false,
        message: 'Invalid response format from server'
      };
    } catch (error) {
      console.error(`Error sending message to chat ${chatId}:`, error);
      
      let errorMessage = 'Could not send message';
      
      // Extract error message from response if available
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return {
        success: false,
        message: errorMessage,
        error: error.response?.data || error.message
      };
    }
  },

  /**
   * Send a message with attachments to a chat
   * @param {Number} chatId - The ID of the chat
   * @param {Object} messageData - The message data
   * @param {Array} files - Array of files to attach
   * @returns {Promise} Promise with sent message data
   */
  sendMessageWithAttachments: async (chatId, messageData, files) => {
    try {
      console.log(`Sending message with attachments to chat ${chatId}`);
      
      const formData = new FormData();
      
      // Always add content field, even if it's an empty string
      // This prevents NULL values that can cause database constraint violations
      formData.append('content', messageData.content?.trim() || '');
      
      // Add files
      if (files && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          formData.append('attachments[]', files[i]);
        }
      }
      
      const response = await api.post(
        `/chats/${chatId}/messages`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }
      );
      
      console.log('Message with attachments response:', response.data);
      
      // Ensure we return a consistent response format
      let result;
      if (response.data && response.data.data) {
        result = {
          success: true,
          data: response.data.data
        };
      } else {
        result = {
          success: true,
          data: response.data
        };
      }
      
      return result;
    } catch (error) {
      console.error(`Error sending message with attachments to chat ${chatId}:`, error);
      return {
        success: false,
        message: error.response?.data?.message || 'Could not send message with attachments',
        error: error.response?.data || error.message
      };
    }
  },

  /**
   * Create a new chat
   * @param {Object} chatData - The chat data
   * @returns {Promise} Promise with created chat data
   */
  createChat: async (chatData) => {
    try {
      const response = await api.post('/chats', chatData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  /**
   * Add a user to a chat
   * @param {Number} chatId - The ID of the chat
   * @param {Number} userId - The ID of the user to add
   * @returns {Promise} Promise with success message
   */
  addUserToChat: async (chatId, userId) => {
    try {
      const response = await api.post(`/chats/${chatId}/participants`, { user_id: userId });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  /**
   * Remove a user from a chat
   * @param {Number} chatId - The ID of the chat
   * @param {Number} userId - The ID of the user to remove
   * @returns {Promise} Promise with success message
   */
  removeUserFromChat: async (chatId, userId) => {
    try {
      const response = await api.delete(`/chats/${chatId}/participants/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  /**
   * Mark a chat as read
   * @param {Number} chatId - The ID of the chat
   * @returns {Promise} Promise with success message
   */
  markChatAsRead: async (chatId) => {
    try {
      const response = await api.post(`/chats/${chatId}/read`);
      
      // Return a standardized response
      return {
        success: true,
        data: response.data.data || response.data,
        message: 'Chat marked as read successfully'
      };
    } catch (error) {
      console.error(`Error marking chat ${chatId} as read:`, error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Could not mark chat as read',
        error: error.response?.data || error.message
      };
    }
  },

  /**
   * Get or create a group chat
   * @param {Number} groupId - The ID of the group
   * @returns {Promise} Promise with chat data
   */
  getGroupChat: async (groupId) => {
    try {
      console.log(`Getting chat for group ${groupId}`);
      
      // First try to get existing chat
      try {
        const response = await api.get(`/groups/${groupId}/chat`);
        console.log('GET chat response:', response.data);
        
        if (response.data.success !== false) {
          return {
            success: true,
            data: response.data.data || response.data
          };
        }
      } catch (error) {
        console.warn('Get group chat failed, will try to create:', error.message);
        // If GET fails because the chat doesn't exist, continue to create it
      }
      
      // Create a new chat if one doesn't exist
      console.log(`Creating new chat for group ${groupId}`);
      try {
        const createResponse = await api.post(`/groups/${groupId}/chat`);
        console.log('Create chat response:', createResponse.data);
        
        if (createResponse.data.success === false) {
          // If there was a specific error with the creation, but we want to handle it gracefully
          throw new Error(createResponse.data.message || 'Failed to create group chat');
        }
        
        return {
          success: true,
          data: createResponse.data.data || createResponse.data
        };
      } catch (createError) {
        // If creation failed, try one more time after a short delay
        // This can help if the error was due to a missing column that was just added by a migration
        console.warn('Creating chat failed, retrying after delay:', createError.message);
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        try {
          const retryResponse = await api.post(`/groups/${groupId}/chat`);
          return {
            success: true,
            data: retryResponse.data.data || retryResponse.data
          };
        } catch (retryError) {
          console.error('Retry also failed:', retryError);
          throw retryError;
        }
      }
    } catch (error) {
      console.error('Error fetching/creating group chat:', error);
      
      // Return structured error response
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Could not get or create group chat',
        error: error.response?.data || error.message
      };
    }
  },

  /**
   * Send a message to a group chat
   * @param {Number} groupId - The ID of the group
   * @param {Object} messageData - The message data
   * @returns {Promise} Promise with sent message data
   */
  sendGroupMessage: async (groupId, messageData) => {
    try {
      // First, ensure we have a chat for this group
      const chatResponse = await chatService.getGroupChat(groupId);
      
      if (!chatResponse.success || !chatResponse.data) {
        return {
          success: false,
          message: 'Failed to get or create chat for this group'
        };
      }
      
      const chat = chatResponse.data;
      const chatId = chat.id;
      
      // Send the message to the chat
      const response = await api.post(`/chats/${chatId}/messages`, messageData);
      
      return {
        success: true,
        data: response.data.data || response.data
      };
    } catch (error) {
      console.error(`Error sending message to group ${groupId}:`, error);
      return {
        success: false,
        message: error.response?.data?.message || 'Could not send message to group chat',
        error: error.response?.data || error.message
      };
    }
  },

  /**
   * Get group chat messages
   * @param {Number} groupId - The ID of the group
   * @param {Object} params - Query parameters like page, limit, etc.
   * @returns {Promise} Promise with chat messages
   */
  getGroupChatMessages: async (groupId, params = {}) => {
    try {
      // First, ensure we have a chat for this group
      const chatResponse = await chatService.getGroupChat(groupId);
      
      if (!chatResponse.success || !chatResponse.data) {
        return {
          success: false,
          message: 'Failed to get or create chat for this group',
          data: []
        };
      }
      
      const chat = chatResponse.data;
      const chatId = chat.id;
      
      // Get messages for the chat
      const response = await api.get(`/chats/${chatId}/messages`, { params });
      
      return {
        success: true,
        data: response.data.data || response.data
      };
    } catch (error) {
      console.error(`Error fetching messages for group ${groupId}:`, error);
      return {
        success: false,
        message: error.response?.data?.message || 'Could not fetch group chat messages',
        data: []
      };
    }
  },

  /**
   * Get unread message counts for all chats
   * @returns {Promise} Promise with unread counts data
   */
  getUnreadCounts: async () => {
    try {
      const response = await api.get('/chats/unread-counts');
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  /**
   * Download a message attachment
   * @param {Number} attachmentId - The ID of the attachment
   * @returns {Promise} Promise with download URL
   */
  downloadAttachment: async (attachmentId) => {
    try {
      const response = await api.get(`/message-attachments/${attachmentId}/download`, {
        responseType: 'blob'
      });
      
      // Create a download URL
      const url = window.URL.createObjectURL(new Blob([response.data]));
      return {
        success: true,
        url
      };
    } catch (error) {
      console.error(`Error downloading attachment ${attachmentId}:`, error);
      return {
        success: false,
        message: error.response?.data?.message || 'Could not download attachment',
        error: error.response?.data || error.message
      };
    }
  },

  // Real-time event listeners
  _listeners: new Map(),

  /**
   * Subscribe to real-time chat events
   * @param {Function} onNewMessage - Callback for new messages
   * @param {Function} onChatUpdated - Callback for chat updates
   * @param {Function} onChatListUpdated - Callback for chat list updates
   */
  subscribeToRealTimeEvents: (onNewMessage, onChatUpdated, onChatListUpdated) => {
    try {
      // Listen for new messages on private channel for current user
      const user = authService.getUser();
      if (user && user.id) {
        const userChannel = echo.private(`chat.user.${user.id}`);
        
        // Listen for new messages
        userChannel.listen('MessageSent', (e) => {
          console.log('Real-time: New message received', e);
          if (onNewMessage) {
            onNewMessage(e.message, e.chat);
          }
        });

        // Listen for chat updates
        userChannel.listen('ChatUpdated', (e) => {
          console.log('Real-time: Chat updated', e);
          if (onChatUpdated) {
            onChatUpdated(e.chat);
          }
        });

        // Store listeners for cleanup
        chatService._listeners.set('userChannel', userChannel);
      }

      // Listen for general chat events
      if (onChatListUpdated) {
        const generalChannel = echo.channel('chats');
        generalChannel.listen('ChatCreated', (e) => {
          console.log('Real-time: New chat created', e);
          if (onChatListUpdated) {
            onChatListUpdated();
          }
        });

        chatService._listeners.set('generalChannel', generalChannel);
      }
    } catch (error) {
      console.error('Error setting up real-time listeners:', error);
      // Fallback to polling if WebSocket fails
      return false;
    }
    return true;
  },

  /**
   * Subscribe to a specific chat for real-time messages
   * @param {Number} chatId - Chat ID to subscribe to
   * @param {Function} onNewMessage - Callback for new messages
   */
  subscribeToChat: (chatId, onNewMessage) => {
    try {
      const chatChannel = echo.private(`chat.${chatId}`);
      
      chatChannel.listen('MessageSent', (e) => {
        console.log(`Real-time: New message in chat ${chatId}`, e);
        if (onNewMessage) {
          onNewMessage(e.message);
        }
      });

      // Store listener for cleanup
      chatService._listeners.set(`chat.${chatId}`, chatChannel);
      return true;
    } catch (error) {
      console.error(`Error subscribing to chat ${chatId}:`, error);
      return false;
    }
  },

  /**
   * Unsubscribe from a specific chat
   * @param {Number} chatId - Chat ID to unsubscribe from
   */
  unsubscribeFromChat: (chatId) => {
    const channelKey = `chat.${chatId}`;
    if (chatService._listeners.has(channelKey)) {
      try {
        const channel = chatService._listeners.get(channelKey);
        channel.stopListening('MessageSent');
        echo.leave(`chat.${chatId}`);
        chatService._listeners.delete(channelKey);
        console.log(`Unsubscribed from chat ${chatId}`);
      } catch (error) {
        console.error(`Error unsubscribing from chat ${chatId}:`, error);
      }
    }
  },

  /**
   * Clean up all real-time listeners
   */
  unsubscribeFromAllEvents: () => {
    chatService._listeners.forEach((channel, key) => {
      try {
        if (key.startsWith('chat.')) {
          channel.stopListening('MessageSent');
          const chatId = key.split('.')[1];
          echo.leave(`chat.${chatId}`);
        } else if (key === 'userChannel') {
          channel.stopListening('MessageSent');
          channel.stopListening('ChatUpdated');
          const user = authService.getUser();
          if (user?.id) {
            echo.leave(`chat.user.${user.id}`);
          }
        } else if (key === 'generalChannel') {
          channel.stopListening('ChatCreated');
          echo.leave('chats');
        }
      } catch (error) {
        console.error(`Error cleaning up listener ${key}:`, error);
      }
    });
    chatService._listeners.clear();
    console.log('All real-time listeners cleaned up');
  },
};

export default chatService;
