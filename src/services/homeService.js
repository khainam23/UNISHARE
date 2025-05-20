import api, { apiRequestWithRetry } from './api';
import { getCachedData } from '../utils/apiCache';

// Make sure we're not importing anything from components that might import this service

const homeService = {
  /**
   * Get featured documents for homepage
   */
  getFeaturedDocuments: async () => {
    return getCachedData('home-featured-documents', async () => {
      try {
        const response = await apiRequestWithRetry('get', '/documents/featured');
        return response.data.data || response.data;
      } catch (error) {
        console.error("Error fetching featured documents:", error);
        return []; // Return empty array on error
      }
    }, { ttl: 10 * 60 * 1000 }); // 10 minute cache
  },
  
  /**
   * Get popular courses for homepage
   */
  getPopularCourses: async () => {
    return getCachedData('home-popular-courses', async () => {
      try {
        const response = await apiRequestWithRetry('get', '/courses/popular');
        return response.data.data || response.data;
      } catch (error) {
        console.error("Error fetching popular courses:", error);
        return []; // Return empty array on error
      }
    }, { ttl: 10 * 60 * 1000 }); // 10 minute cache
  },
  
  /**
   * Get testimonials for homepage
   */
  getTestimonials: async () => {
    return getCachedData('home-testimonials', async () => {
      try {
        const response = await apiRequestWithRetry('get', '/testimonials');
        return response.data.data || response.data;
      } catch (error) {
        console.error("Error fetching testimonials:", error);
        // Return default testimonials instead of empty array
        return [
          {
            id: 1,
            name: 'Nguyễn Văn A',
            role: 'Sinh viên',
            avatar: null,
            content: 'Tôi đã học được rất nhiều kiến thức bổ ích từ các khóa học trên Unishare. Giao diện dễ sử dụng và nội dung được trình bày rõ ràng.'
          },
          {
            id: 2,
            name: 'Trần Thị B',
            role: 'Nhân viên văn phòng',
            avatar: null,
            content: 'Unishare là nền tảng tuyệt vời để học thêm kỹ năng mới. Tôi đã học được nhiều điều giúp ích cho công việc của mình.'
          },
          {
            id: 3,
            name: 'Lê Văn C',
            role: 'Giáo viên',
            avatar: null,
            content: 'Tôi rất ấn tượng với chất lượng các khóa học và tài liệu trên Unishare. Đây là một nền tảng đáng tin cậy cho việc học tập.'
          }
        ];
      }
    }, { ttl: 60 * 60 * 1000 }); // 1 hour cache for testimonials
  },
  
  /**
   * Get recent blog posts for homepage
   */
  getRecentBlogPosts: async (limit = 4) => {
    return getCachedData(`home-blog-posts-${limit}`, async () => {
      try {
        const response = await apiRequestWithRetry('get', '/blog/posts', null, {
          params: { limit, sort: 'recent' }
        });
        return response.data.data || response.data;
      } catch (error) {
        console.error("Error fetching blog posts:", error);
        return []; // Return empty array on error
      }
    }, { ttl: 15 * 60 * 1000 }); // 15 minute cache
  },
  
  /**
   * Get free documents for homepage
   */
  getFreeDocuments: async (limit = 5) => {
    return getCachedData(`home-free-documents-${limit}`, async () => {
      try {
        const response = await apiRequestWithRetry('get', '/documents/free', null, {
          params: { limit }
        });
        return response.data.data || response.data;
      } catch (error) {
        console.error("Error fetching free documents:", error);
        return []; // Return empty array on error
      }
    }, { ttl: 10 * 60 * 1000 }); // 10 minute cache
  },
  
  /**
   * Get platform statistics
   */
  getPlatformStats: async () => {
    return getCachedData('home-platform-stats', async () => {
      try {
        const response = await apiRequestWithRetry('get', '/statistics/platform');
        return response.data || {};
      } catch (error) {
        console.error("Error fetching platform statistics:", error);
        return {
          users: 0,
          courses: 0,
          documents: 0,
          completions: 0
        };
      }
    }, { ttl: 30 * 60 * 1000 }); // 30 minute cache
  }
};

export default homeService;
