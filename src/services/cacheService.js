/**
 * Service for caching API responses
 */
class CacheService {
  constructor() {
    this.cache = {};
    this.timestamps = {};
    this.pendingRequests = {};
    this.debugMode = true; // Bật chế độ debug để theo dõi cache
  }

  /**
   * Get data from cache
   * @param {string} key - Cache key
   * @param {number} maxAge - Maximum age of cache in milliseconds
   * @returns {any|null} Cached data or null if not found or expired
   */
  get(key, maxAge = 5 * 60 * 1000) {
    // Kiểm tra xem key có tồn tại trong cache không
    if (!this.cache[key]) {
      if (this.debugMode) console.log(`[Cache] MISS: ${key}`);
      return null;
    }

    // Kiểm tra xem cache có hết hạn không
    const timestamp = this.timestamps[key] || 0;
    const now = Date.now();
    if (now - timestamp > maxAge) {
      // Cache đã hết hạn, xóa và trả về null
      if (this.debugMode) console.log(`[Cache] EXPIRED: ${key}`);
      this.remove(key);
      return null;
    }

    if (this.debugMode) console.log(`[Cache] HIT: ${key}`);
    return this.cache[key];
  }

  /**
   * Set data in cache
   * @param {string} key - Cache key
   * @param {any} data - Data to cache
   */
  set(key, data) {
    if (this.debugMode) console.log(`[Cache] SET: ${key}`);
    this.cache[key] = data;
    this.timestamps[key] = Date.now();
  }

  /**
   * Remove data from cache
   * @param {string} key - Cache key
   */
  remove(key) {
    if (this.debugMode) console.log(`[Cache] REMOVE: ${key}`);
    delete this.cache[key];
    delete this.timestamps[key];
  }

  /**
   * Clear all cache
   */
  clear() {
    if (this.debugMode) console.log(`[Cache] CLEAR ALL`);
    this.cache = {};
    this.timestamps = {};
  }

  /**
   * Clear cache by prefix
   * @param {string} prefix - Prefix to match
   */
  clearByPrefix(prefix) {
    if (this.debugMode) console.log(`[Cache] CLEAR PREFIX: ${prefix}`);
    Object.keys(this.cache).forEach(key => {
      if (key.startsWith(prefix)) {
        this.remove(key);
      }
    });
  }
  
  /**
   * Memoize an async function call to prevent duplicate calls
   * @param {string} key - Cache key
   * @param {Function} asyncFn - Async function to call
   * @param {number} maxAge - Maximum age of cache in milliseconds
   * @returns {Promise<any>} Result of the async function
   */
  async memoize(key, asyncFn, maxAge = 5 * 60 * 1000) {
    // Kiểm tra cache trước
    const cachedData = this.get(key, maxAge);
    if (cachedData) {
      return cachedData;
    }
    
    // Kiểm tra xem có request đang chờ không
    if (this.pendingRequests[key]) {
      if (this.debugMode) console.log(`[Cache] PENDING: ${key}`);
      return this.pendingRequests[key];
    }
    
    // Tạo promise mới và lưu vào pendingRequests
    if (this.debugMode) console.log(`[Cache] FETCH: ${key}`);
    this.pendingRequests[key] = asyncFn().then(result => {
      // Lưu kết quả vào cache
      this.set(key, result);
      // Xóa khỏi pendingRequests
      delete this.pendingRequests[key];
      return result;
    }).catch(error => {
      // Xóa khỏi pendingRequests nếu có lỗi
      delete this.pendingRequests[key];
      throw error;
    });
    
    return this.pendingRequests[key];
  }
}

// Tạo một instance duy nhất để sử dụng trong toàn bộ ứng dụng
const cacheService = new CacheService();

export default cacheService;