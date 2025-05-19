/**
 * Simple cache utility for API responses
 */

// Cache storage
const apiCache = new Map();

// Default TTL in milliseconds (5 minutes)
const DEFAULT_TTL = 5 * 60 * 1000;

/**
 * Get data from cache or fetch it and store in cache
 * 
 * @param {string} key - Unique cache key
 * @param {Function} fetchFn - Function that returns a Promise to fetch data
 * @param {Object} options - Cache options
 * @param {number} options.ttl - Time to live in milliseconds
 * @param {boolean} options.refreshIfExpired - Auto refresh if expired instead of returning null
 * @returns {Promise<any>} - Cached data or freshly fetched data
 */
export const getCachedData = async (key, fetchFn, options = {}) => {
  const { ttl = DEFAULT_TTL, refreshIfExpired = true } = options;
  const now = Date.now();
  
  // Check if we have a valid cache entry
  if (apiCache.has(key)) {
    const { data, expiry } = apiCache.get(key);
    
    // Return cached data if not expired
    if (expiry > now) {
      console.log(`Using cached data for: ${key}`);
      return data;
    }
    
    // Cache expired
    if (!refreshIfExpired) {
      apiCache.delete(key);
      return null;
    }
  }
  
  try {
    // Fetch fresh data
    console.log(`Fetching fresh data for: ${key}`);
    const data = await fetchFn();
    
    // Store in cache
    apiCache.set(key, {
      data,
      expiry: now + ttl
    });
    
    return data;
  } catch (error) {
    console.error(`Error fetching data for ${key}:`, error);
    throw error;
  }
};

/**
 * Invalidate a specific cache entry
 * 
 * @param {string} key - Cache key to invalidate
 */
export const invalidateCache = (key) => {
  apiCache.delete(key);
};

/**
 * Clear all cache entries
 */
export const clearCache = () => {
  apiCache.clear();
};

export default {
  getCachedData,
  invalidateCache,
  clearCache
};
