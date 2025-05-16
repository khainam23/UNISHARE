/**
 * Utility functions for checking user roles
 */

/**
 * Check if a user has a specific role
 * @param {Object} user - The user object
 * @param {String} roleName - The role name to check
 * @returns {Boolean} - True if the user has the role
 */
export const hasRole = (user, roleName) => {
  if (!user || !user.roles || !Array.isArray(user.roles)) {
    return false;
  }
  
  return user.roles.some(role => role.name === roleName);
};

/**
 * Check if the user is an admin
 * @param {Object} user - The user object
 * @returns {Boolean} - True if the user is an admin
 */
export const isAdmin = (user) => {
  return hasRole(user, 'admin');
};

/**
 * Check if the user is a moderator
 * @param {Object} user - The user object
 * @returns {Boolean} - True if the user is a moderator
 */
export const isModerator = (user) => {
  return hasRole(user, 'moderator');
};

/**
 * Check if the user is a lecturer
 * @param {Object} user - The user object
 * @returns {Boolean} - True if the user is a lecturer
 */
export const isLecturer = (user) => {
  return hasRole(user, 'lecturer');
};

/**
 * Check if the user is a student
 * @param {Object} user - The user object
 * @returns {Boolean} - True if the user is a student
 */
export const isStudent = (user) => {
  return hasRole(user, 'student');
};

/**
 * Get the redirect path based on user role
 * @param {Object} user - The user object
 * @returns {String} - The redirect path
 */
export const getRedirectPathForUser = (user) => {
  if (!user) return '/login';
  
  if (isAdmin(user)) {
    return '/admin';
  }
  
  if (isModerator(user)) {
    return '/admin';
  }
  
  return '/';
};
