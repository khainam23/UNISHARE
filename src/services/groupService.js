import api, { apiRequestWithRetry } from './api';
import { authService } from './index';
import { isLecturer, isAdmin, isModerator } from '../utils/roleUtils';
import cacheService from './cacheService';

/**
 * Xử lý các tham số truy vấn để tránh lỗi cột không tồn tại
 * @param {Object} params - Các tham số truy vấn gốc
 * @returns {Object} Các tham số đã được xử lý an toàn
 */
const sanitizeQueryParams = (params = {}) => {
  const safeParams = { ...params };
  
  // Danh sách các tham số có thể gây lỗi
  const problematicParams = [
    'is_private',
    'requires_approval',
    'featured'
  ];
  
  // Xóa các tham số có thể gây lỗi
  problematicParams.forEach(param => {
    if (safeParams[param] !== undefined) {
      console.log(`Removing potentially problematic parameter: ${param}`);
      delete safeParams[param];
    }
  });
  
  return safeParams;
};

// Biến track thử lại để ngăn retry vô hạn
const retryTracker = {};

/**
 * Xử lý lỗi cột không tồn tại và quyết định có nên thử lại không
 * @param {Error} error - Lỗi gặp phải
 * @param {Object} params - Tham số ban đầu
 * @param {string} cacheKey - Khóa cache nếu có
 * @returns {Object} Tham số được chỉnh sửa và thông tin thử lại
 */
const handleColumnNotFoundError = (error, params, cacheKey = null) => {
  // Tạo một ID duy nhất cho lỗi này để tránh thử lại vô hạn
  const requestId = JSON.stringify(params) + (cacheKey || '');
  
  // Nếu đã thử lại trước đó, không thử nữa
  if (retryTracker[requestId]) {
    console.log('Already retried this request, not retrying again:', requestId);
    return { shouldRetry: false };
  }
  
  // Chỉ thử lại nếu là lỗi "Column not found"
  if (error.response?.data?.message?.includes('Column not found')) {
    console.log('Column not found error detected:', error.response.data.message);
    
    // Đánh dấu đã thử lại request này
    retryTracker[requestId] = true;
    
    // Sau 60 giây, xóa khỏi retry tracker để cho phép thử lại trong tương lai
    setTimeout(() => {
      delete retryTracker[requestId];
    }, 60000);
    
    // Tạo tham số mới không có các cột gây lỗi
    const retryParams = { ...params };
    
    // Xóa các tham số có thể gây lỗi
    if (error.response.data.message.includes("'is_private'")) {
      console.log('Removing is_private parameter');
      delete retryParams.is_private;
    }
    
    if (error.response.data.message.includes("'requires_approval'")) {
      console.log('Removing requires_approval parameter');
      delete retryParams.requires_approval;
    }
    
    if (error.response.data.message.includes("'featured'")) {
      console.log('Removing featured parameter');
      delete retryParams.featured;
    }
    
    // Xóa cache nếu có
    if (cacheKey) {
      cacheService.remove(cacheKey);
    }
    
    return {
      shouldRetry: true,
      retryParams
    };
  }
  
  return { shouldRetry: false };
};

/**
 * Service for group-related operations
 */
const groupService = {
  /**
   * Get all groups with optional filters
   * @param {Object} params - Query parameters like page, type, search, etc.
   * @param {boolean} useCache - Whether to use cached data if available
   * @returns {Promise} Promise with groups list
   */
  getAllGroups: async (params = {}, useCache = true) => {
    // Xử lý các tham số truy vấn để tránh lỗi SQL trước khi tạo cache key
    const safeParams = sanitizeQueryParams(params);
    
    // Tạo cache key từ params
    const cacheKey = `groups_${JSON.stringify(safeParams)}`;
    
    // Sử dụng memoize để tránh duplicate calls
    if (useCache) {
      return cacheService.memoize(
        cacheKey,
        async () => {
          try {
            const response = await apiRequestWithRetry('get', '/groups', null, {
              params: safeParams
            });
            
            let result;
            
            if (response.data) {
              if (response.data.data) {
                result = {
                  success: true,
                  data: response.data.data,
                  meta: response.data.meta || null
                };
              } else if (Array.isArray(response.data)) {
                result = {
                  success: true,
                  data: response.data
                };
              }
            } else {
              result = {
                success: false,
                message: 'Unexpected response format',
                data: []
              };
            }
            
            return result;
          } catch (error) {
            console.error("Error fetching all groups:", error);
            
            // Xử lý lỗi cột không tồn tại với công cụ mới
            const { shouldRetry, retryParams } = handleColumnNotFoundError(error, params, cacheKey);
            
            if (shouldRetry) {
              try {
                console.log('Retrying with adjusted parameters:', retryParams);
                return await groupService.getAllGroups(retryParams, false);
              } catch (retryError) {
                console.error("Retry also failed:", retryError);
              }
            }
            
            return {
              success: false,
              message: error.response?.data?.message || 'Failed to fetch groups',
              data: []
            };
          }
        },
        5 * 60 * 1000 // 5 minute cache time
      );
    } else {
      try {
        const response = await apiRequestWithRetry('get', '/groups', null, {
          params: safeParams
        });
        
        let result;
        
        if (response.data) {
          if (response.data.data) {
            result = {
              success: true,
              data: response.data.data,
              meta: response.data.meta || null
            };
          } else if (Array.isArray(response.data)) {
            result = {
              success: true,
              data: response.data
            };
          }
        } else {
          result = {
            success: false,
            message: 'Unexpected response format',
            data: []
          };
        }
        
        return result;
      } catch (error) {
        console.error("Error fetching all groups:", error);
        
        // Xử lý lỗi cột không tồn tại với công cụ mới
        const { shouldRetry, retryParams } = handleColumnNotFoundError(error, params);
        
        if (shouldRetry) {
          try {
            console.log('Retrying with adjusted parameters:', retryParams);
            return await groupService.getAllGroups(retryParams, false);
          } catch (retryError) {
            console.error("Retry also failed:", retryError);
          }
        }
        
        return {
          success: false,
          message: error.response?.data?.message || 'Failed to fetch groups',
          data: []
        };
      }
    }
  },

  /**
   * Get user's groups
   * @param {Object} params - Query parameters like page, limit, status, etc.
   * @param {boolean} useCache - Whether to use cached data if available
   * @returns {Promise} Promise with user's groups
   */
  getUserGroups: async (params = {}, useCache = true) => {
    // Xử lý các tham số truy vấn để tránh lỗi SQL trước khi tạo cache key
    const safeParams = sanitizeQueryParams(params);
    
    // Tạo cache key từ params và user ID
    const user = authService.getUser();
    const userId = user?.id || 'anonymous';
    const cacheKey = `user_groups_${userId}_${JSON.stringify(safeParams)}`;
    
    // Sử dụng memoize để tránh duplicate calls
    if (useCache) {
      return cacheService.memoize(
        cacheKey,
        async () => {
          try {
            const response = await apiRequestWithRetry('get', '/user/groups', null, {
              params: safeParams
            });
            
            let result;
            
            if (response.data) {
              result = {
                success: true,
                data: response.data.data || response.data,
                meta: response.data.meta || null
              };
            } else {
              result = {
                success: false,
                message: 'Unexpected response format',
                data: []
              };
            }
            
            return result;
          } catch (error) {
            console.error("Error fetching user groups:", error);
            
            // Xử lý lỗi cột không tồn tại với công cụ mới
            const { shouldRetry, retryParams } = handleColumnNotFoundError(error, params, cacheKey);
            
            if (shouldRetry) {
              try {
                console.log('Retrying with adjusted parameters:', retryParams);
                return await groupService.getUserGroups(retryParams, false);
              } catch (retryError) {
                console.error("Retry also failed:", retryError);
              }
            }
            
            return {
              success: false,
              message: error.response?.data?.message || 'Failed to fetch groups',
              data: []
            };
          }
        },
        5 * 60 * 1000 // 5 minute cache time
      );
    } else {
      try {
        const response = await apiRequestWithRetry('get', '/user/groups', null, {
          params: safeParams
        });
        
        let result;
        
        if (response.data) {
          result = {
            success: true,
            data: response.data.data || response.data,
            meta: response.data.meta || null
          };
        } else {
          result = {
            success: false,
            message: 'Unexpected response format',
            data: []
          };
        }
        
        return result;
      } catch (error) {
        console.error("Error fetching user groups:", error);
        
        // Xử lý lỗi cột không tồn tại với công cụ mới
        const { shouldRetry, retryParams } = handleColumnNotFoundError(error, params);
        
        if (shouldRetry) {
          try {
            console.log('Retrying with adjusted parameters:', retryParams);
            return await groupService.getUserGroups(retryParams, false);
          } catch (retryError) {
            console.error("Retry also failed:", retryError);
          }
        }
        
        return {
          success: false,
          message: error.response?.data?.message || 'Failed to fetch groups',
          data: []
        };
      }
    }
  },
  
  /**
   * Check if the current user can create groups
   * @param {boolean} useCache - Whether to use cached data if available
   * @returns {Promise<boolean>} Whether the user can create groups
   */
  canCreateGroups: async (useCache = true) => {
    // First try to get a user with current permissions
    const user = authService.getUser();
    
    if (!user) {
      console.log('No user found, cannot create groups');
      return false;
    }
    
    // Tạo cache key từ user ID
    const userId = user.id || 'anonymous';
    const cacheKey = `can_create_groups_${userId}`;
    
    // Sử dụng memoize để tránh duplicate calls
    if (useCache) {
      return cacheService.memoize(
        cacheKey,
        async () => {
          try {
            // Kiểm tra quyền từ thông tin người dùng hiện tại
            if (user.roles) {
              // Sử dụng các hàm tiện ích để kiểm tra vai trò
              if (isAdmin(user) || isModerator(user) || isLecturer(user)) {
                console.log('User has permission to create groups by role');
                return true;
              }
              
              // Kiểm tra quyền rõ ràng
              if (user.permissions && user.permissions.includes('create group')) {
                console.log('User has explicit permission to create groups');
                return true;
              }
            }
            
            // Làm mới thông tin người dùng
            console.log('Refreshing user permissions from server');
            const refreshedUser = await authService.refreshUserInfo();
            
            // Kiểm tra vai trò với dữ liệu người dùng đã làm mới
            if (refreshedUser) {
              if (isAdmin(refreshedUser) || isModerator(refreshedUser) || isLecturer(refreshedUser)) {
                console.log('Refreshed user has permission to create groups by role');
                return true;
              }
              
              // Kiểm tra quyền rõ ràng trong người dùng đã làm mới
              if (refreshedUser.permissions && refreshedUser.permissions.includes('create group')) {
                console.log('Refreshed user has explicit permission to create groups');
                return true;
              }
            }
            
            console.log('User does not have permission to create groups');
            return false;
          } catch (error) {
            console.error("Error checking group creation permissions:", error);
            // Default to false if we can't determine permissions
            return false;
          }
        },
        10 * 60 * 1000 // 10 phút
      );
    } else {
      try {
        // Kiểm tra quyền từ thông tin người dùng hiện tại
        if (user.roles) {
          // Sử dụng các hàm tiện ích để kiểm tra vai trò
          if (isAdmin(user) || isModerator(user) || isLecturer(user)) {
            console.log('User has permission to create groups by role');
            return true;
          }
          
          // Kiểm tra quyền rõ ràng
          if (user.permissions && user.permissions.includes('create group')) {
            console.log('User has explicit permission to create groups');
            return true;
          }
        }
        
        // Làm mới thông tin người dùng
        console.log('Refreshing user permissions from server');
        const refreshedUser = await authService.refreshUserInfo();
        
        // Kiểm tra vai trò với dữ liệu người dùng đã làm mới
        if (refreshedUser) {
          if (isAdmin(refreshedUser) || isModerator(refreshedUser) || isLecturer(refreshedUser)) {
            console.log('Refreshed user has permission to create groups by role');
            return true;
          }
          
          // Kiểm tra quyền rõ ràng trong người dùng đã làm mới
          if (refreshedUser.permissions && refreshedUser.permissions.includes('create group')) {
            console.log('Refreshed user has explicit permission to create groups');
            return true;
          }
        }
        
        console.log('User does not have permission to create groups');
        return false;
      } catch (error) {
        console.error("Error checking group creation permissions:", error);
        // Default to false if we can't determine permissions
        return false;
      }
    }
  },
  
  /**
   * Create a new group
   * @param {Object} groupData - Group data including name, description, etc.
   * @returns {Promise} Promise with created group data
   */
  createGroup: async (groupData) => {
    try {
      const formData = new FormData();
      
      // Get current user to set as creator
      const currentUser = authService.getUser();
      if (!currentUser || !currentUser.id) {
        throw new Error('User information not available. Please log in again.');
      }
      
      // Xử lý dữ liệu nhóm để tránh lỗi SQL
      const processedData = { ...groupData };
      
      // Chuyển đổi is_private thành requires_approval để tương thích với backend
      if (processedData.is_private !== undefined) {
        processedData.requires_approval = processedData.is_private;
        delete processedData.is_private;
        console.log('Converting is_private to requires_approval:', processedData.requires_approval);
      }
      
      // Add creator_id to the form data
      processedData.creator_id = currentUser.id;
      console.log('Setting creator_id:', currentUser.id);
      
      // Append text fields
      Object.keys(processedData).forEach(key => {
        if (key !== 'cover_image') {
          formData.append(key, processedData[key]);
        }
      });
      
      // Append cover image if exists
      if (groupData.cover_image instanceof File) {
        formData.append('cover_image', groupData.cover_image);
      }
      
      // Log the form data for debugging
      console.log('Form data entries:');
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }
      
      const response = await apiRequestWithRetry('post', '/groups', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      
      return {
        success: true,
        data: response.data.data || response.data
      };
    } catch (error) {
      console.error("Error creating group:", error);
      
      // Handle specific error cases
      if (error.response?.status === 403) {
        return {
          success: false,
          message: 'Bạn không có quyền tạo nhóm học. Hãy liên hệ quản trị viên để được cấp quyền.',
          errorDetail: error.response?.data?.message || 'Permission denied'
        };
      }
      
      // If there's a column not found error, try again with adjusted parameters
      if (error.response?.data?.message?.includes('Column not found: 1054 Unknown column')) {
        console.log('Trying to create group with adjusted parameters due to schema mismatch');
        
        try {
          // Create a new form data without the problematic field
          const newFormData = new FormData();
          const processedData = { ...groupData };
          
          // Get current user to set as creator
          const currentUser = authService.getUser();
          if (!currentUser || !currentUser.id) {
            throw new Error('User information not available. Please log in again.');
          }
          
          // Add creator_id to the form data
          processedData.creator_id = currentUser.id;
          console.log('Setting creator_id in retry:', currentUser.id);
          
          // Xử lý lỗi cột is_private
          if (error.response.data.message.includes("'is_private'")) {
            console.log('Error related to is_private column, using requires_approval instead');
            // Luôn xóa is_private và sử dụng requires_approval
            if (processedData.is_private !== undefined) {
              processedData.requires_approval = processedData.is_private;
              delete processedData.is_private;
            }
          }
          
          // Xử lý các lỗi cột khác nếu có
          if (error.response.data.message.includes("'requires_approval'")) {
            console.log('Error related to requires_approval column, removing it');
            delete processedData.requires_approval;
          }
          
          // Append the adjusted fields
          Object.keys(processedData).forEach(key => {
            if (key !== 'cover_image') {
              newFormData.append(key, processedData[key]);
            }
          });
          
          if (groupData.cover_image instanceof File) {
            newFormData.append('cover_image', groupData.cover_image);
          }
          
          // Log the form data for debugging
          console.log('Retry form data entries:');
          for (let pair of newFormData.entries()) {
            console.log(pair[0] + ': ' + pair[1]);
          }
          
          const retryResponse = await apiRequestWithRetry('post', '/groups', newFormData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            }
          });
          
          return {
            success: true,
            data: retryResponse.data.data || retryResponse.data
          };
        } catch (retryError) {
          console.error("Retry with adjusted parameters also failed:", retryError);
        }
      }
      
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể tạo nhóm. Vui lòng thử lại sau.',
        errors: error.response?.data?.errors
      };
    }
  },
  
  /**
   * Get group details
   * @param {Number} groupId - The ID of the group
   * @returns {Promise} Promise with group details
   */
  getGroupDetails: async (groupId) => {
    try {
      const response = await apiRequestWithRetry('get', `/groups/${groupId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching group details for ID ${groupId}:`, error);
      return {
        success: false,
        message: error.response?.data?.message || `Failed to fetch group details for ID ${groupId}`,
        data: null
      };
    }
  },
  
  /**
   * Update a group
   * @param {Number} groupId - The ID of the group to update
   * @param {Object} groupData - Updated group data
   * @returns {Promise} Promise with updated group data
   */
  updateGroup: async (groupId, groupData) => {
    try {
      const formData = new FormData();
      
      // Append text fields
      Object.keys(groupData).forEach(key => {
        if (key !== 'cover_image') {
          formData.append(key, groupData[key]);
        }
      });
      
      // Append cover image if exists
      if (groupData.cover_image instanceof File) {
        formData.append('cover_image', groupData.cover_image);
      }
      
      // Use PUT for updating
      const response = await apiRequestWithRetry('post', `/groups/${groupId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-HTTP-Method-Override': 'PUT',
        }
      });
      
      return response.data;
    } catch (error) {
      console.error(`Error updating group ID ${groupId}:`, error);
      throw error.response ? error.response.data : error;
    }
  },
  
  /**
   * Join a group
   * @param {Number} groupId - The ID of the group to join
   * @returns {Promise} Promise with success message
   */
  joinGroup: async (groupId) => {
    try {
      const response = await apiRequestWithRetry('post', `/groups/${groupId}/join`);
      return response.data;
    } catch (error) {
      console.error(`Error joining group ID ${groupId}:`, error);
      throw error.response ? error.response.data : error;
    }
  },
  
  /**
   * Leave a group
   * @param {Number} groupId - Group ID to leave
   * @returns {Promise} Promise with success/failure info
   */
  leaveGroup: async (groupId) => {
    try {
      const response = await apiRequestWithRetry('post', `/groups/${groupId}/leave`);
      
      return {
        success: true,
        message: response.data.message || 'Đã rời nhóm thành công'
      };
    } catch (error) {
      console.error(`Error leaving group ${groupId}:`, error);
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể rời nhóm. Vui lòng thử lại sau.'
      };
    }
  },
  
  /**
   * Get group members
   * @param {Number} groupId - The ID of the group
   * @param {Object} params - Query parameters like page, limit, etc.
   * @returns {Promise} Promise with group members
   */
  getGroupMembers: async (groupId, params = {}) => {
    try {
      const response = await apiRequestWithRetry('get', `/groups/${groupId}/members`, null, {
        params
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching members for group ID ${groupId}:`, error);
      return {
        success: false,
        message: error.response?.data?.message || `Failed to fetch members for group ID ${groupId}`,
        data: []
      };
    }
  },
  
  /**
   * Get pending group join requests
   * @param {Number} groupId - The ID of the group
   * @returns {Promise} Promise with join requests
   */
  getGroupJoinRequests: async (groupId) => {
    try {
      const response = await apiRequestWithRetry('get', `/groups/${groupId}/join-requests`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching join requests for group ID ${groupId}:`, error);
      throw error.response ? error.response.data : error;
    }
  },
  
  /**
   * Approve a group join request
   * @param {Number} groupId - The ID of the group
   * @param {Number} userId - The ID of the user
   * @returns {Promise} Promise with success message
   */
  approveJoinRequest: async (groupId, userId) => {
    try {
      const response = await apiRequestWithRetry('post', `/groups/${groupId}/join-requests/${userId}/approve`);
      return response.data;
    } catch (error) {
      console.error(`Error approving join request for user ${userId} in group ${groupId}:`, error);
      throw error.response ? error.response.data : error;
    }
  },
  
  /**
   * Reject a group join request
   * @param {Number} groupId - The ID of the group
   * @param {Number} userId - The ID of the user
   * @returns {Promise} Promise with success message
   */
  rejectJoinRequest: async (groupId, userId) => {
    try {
      const response = await apiRequestWithRetry('post', `/groups/${groupId}/join-requests/${userId}/reject`);
      return response.data;
    } catch (error) {
      console.error(`Error rejecting join request for user ${userId} in group ${groupId}:`, error);
      throw error.response ? error.response.data : error;
    }
  },
  
  /**
   * Change a member's role in a group
   * @param {Number} groupId - The ID of the group
   * @param {Number} userId - The ID of the user
   * @param {String} role - The new role (admin, moderator, member)
   * @returns {Promise} Promise with success message
   */
  changeGroupMemberRole: async (groupId, userId, role) => {
    try {
      const response = await apiRequestWithRetry('put', `/groups/${groupId}/members/${userId}`, {
        role
      });
      return response.data;
    } catch (error) {
      console.error(`Error changing role for user ${userId} in group ${groupId}:`, error);
      throw error.response ? error.response.data : error;
    }
  },
  
  /**
   * Remove a member from a group
   * @param {Number} groupId - The ID of the group
   * @param {Number} userId - The ID of the user to remove
   * @returns {Promise} Promise with success message
   */
  removeGroupMember: async (groupId, userId) => {
    try {
      const response = await apiRequestWithRetry('delete', `/groups/${groupId}/members/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error removing user ${userId} from group ${groupId}:`, error);
      throw error.response ? error.response.data : error;
    }
  },
  
  /**
   * Get posts for a specific group
   * @param {Number} groupId - The ID of the group
   * @param {Object} params - Query parameters like page, limit, etc.
   * @returns {Promise} Promise with group posts
   */
  getGroupPosts: async (groupId, params = {}) => {
    try {
      const response = await apiRequestWithRetry('get', `/groups/${groupId}/posts`, null, {
        params
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching posts for group ${groupId}:`, error);
      return {
        success: false,
        message: error.response?.data?.message || `Failed to fetch posts for group ${groupId}`,
        data: []
      };
    }
  },
  
  /**
   * Create a post in a group
   * @param {Number} groupId - The ID of the group
   * @param {Object} postData - Post data including content and attachments
   * @returns {Promise} Promise with created post data
   */
  createGroupPost: async (groupId, postData) => {
    try {
      const formData = new FormData();
      
      if (postData.content) {
        formData.append('content', postData.content);
      }
      
      if (postData.title) {
        formData.append('title', postData.title);
      }
      
      // Append attachments if any
      if (postData.attachments && postData.attachments.length > 0) {
        for (let i = 0; i < postData.attachments.length; i++) {
          formData.append('attachments[]', postData.attachments[i]);
        }
      }
      
      const response = await apiRequestWithRetry('post', `/groups/${groupId}/posts`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      
      return response.data;
    } catch (error) {
      console.error(`Error creating post in group ${groupId}:`, error);
      return {
        success: false,
        message: error.response?.data?.message || `Failed to create post in group ${groupId}`,
        errors: error.response?.data?.errors
      };
    }
  },
  
  /**
   * Get documents for a specific group
   * @param {Number} groupId - The ID of the group
   * @param {Object} params - Query parameters like page, search, etc.
   * @returns {Promise} Promise with group documents
   */
  getGroupDocuments: async (groupId, params = {}) => {
    try {
      const response = await apiRequestWithRetry('get', `/groups/${groupId}/documents`, null, {
        params
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching documents for group ${groupId}:`, error);
      return {
        success: false,
        message: error.response?.data?.message || `Failed to fetch documents for group ${groupId}`,
        data: []
      };
    }
  },
  
  /**
   * Upload a document to a group
   * @param {Number} groupId - The ID of the group
   * @param {FormData} formData - Form data with document file and metadata
   * @returns {Promise} Promise with uploaded document data
   */
  uploadGroupDocument: async (groupId, formData) => {
    try {
      const response = await apiRequestWithRetry('post', `/groups/${groupId}/documents`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      
      return response.data;
    } catch (error) {
      console.error(`Error uploading document to group ${groupId}:`, error);
      return {
        success: false,
        message: error.response?.data?.message || `Failed to upload document to group ${groupId}`,
        errors: error.response?.data?.errors
      };
    }
  },
  
  /**
   * Delete a group
   * @param {Number} groupId - The ID of the group to delete
   * @returns {Promise} Promise with success message
   */
  deleteGroup: async (groupId) => {
    try {
      const response = await apiRequestWithRetry('delete', `/groups/${groupId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting group ${groupId}:`, error);
      throw error.response ? error.response.data : error;
    }
  }
};

export default groupService;
