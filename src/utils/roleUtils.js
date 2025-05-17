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
 * Check if user has admin role
 * @param {Object} user - The user object with roles array
 * @returns {Boolean} true if user has admin role
 */
export const isAdmin = (user) => {
  if (!user || !user.roles || !Array.isArray(user.roles)) {
    return false;
  }
  return user.roles.some(role => role.name === 'admin');
};

/**
 * Check if user has moderator role
 * @param {Object} user - The user object with roles array
 * @returns {Boolean} true if user has moderator role
 */
export const isModerator = (user) => {
  if (!user || !user.roles || !Array.isArray(user.roles)) {
    return false;
  }
  return user.roles.some(role => role.name === 'moderator');
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
 * Determine redirect path based on user role
 * @param {Object} user - The user object with roles
 * @returns {String} The path to redirect to
 */
export const getRedirectPathForUser = (user) => {
  if (!user) {
    return '/login';
  }
  
  // First, check for admin role - highest priority
  if (isAdmin(user)) {
    return '/admin/dashboard';
  }
  
  // Second, check for moderator role
  if (isModerator(user)) {
    return '/admin/dashboard';
  }
  
  // Third, check for teacher role
  if (user.roles && user.roles.some(role => role.name === 'teacher')) {
    return '/teacher/dashboard';
  }
  
  // Default to home page for students or other roles
  return '/';
};
