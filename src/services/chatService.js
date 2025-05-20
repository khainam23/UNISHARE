import api from './api';

const chatService = {
  /**
   * Get user's chats
   * @param {Object} params - Query parameters like page, limit, etc.
   * @returns {Promise} Promise with user's chats
   */
  getUserChats: async (params = {}) => {
    try {
      const response = await api.get('/chats', { params });
      
      // Log the raw response for debugging
      console.log('Raw getUserChats response:', response.data);
      
      // If the API returns a nested structure with data.data, standardize it
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
      console.error('Error fetching user chats:', error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Could not fetch user chats',
        data: []
      };
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
      const response = await api.get(`/chats/${chatId}/messages`, { params });
      
      // If the API returns data in a nested structure, standardize it
      if (response.data && typeof response.data === 'object') {
        return {
          success: true,
          data: response.data
        };
      }
      
      return response.data;
    } catch (error) {
      console.error('Error fetching chat messages:', error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Could not fetch chat messages'
      };
    }
  },

  /**
   * Send a message to a chat
   * @param {Number} chatId - The ID of the chat
   * @param {Object} messageData - The message data
   * @returns {Promise} Promise with sent message data
   */
  sendMessage: async (chatId, messageData) => {
    try {
      const response = await api.post(`/chats/${chatId}/messages`, messageData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
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
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
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
        
        if (response.data.success && response.data.data) {
          return {
            success: true,
            data: response.data.data
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
        
        if (!createResponse.data.success) {
          // If there was a specific error with the creation, but we want to handle it gracefully
          throw new Error(createResponse.data.message || 'Failed to create group chat');
        }
        
        return {
          success: true,
          data: createResponse.data.data
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
            data: retryResponse.data.data
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
  }
};

export default chatService;
