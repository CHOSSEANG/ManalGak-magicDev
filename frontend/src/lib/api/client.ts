import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // participant_token이 있으면 헤더에 추가
    const token = localStorage.getItem('participant_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response) {
      // 서버가 응답을 반환한 경우
      console.error('API Error:', error.response.data);
    } else if (error.request) {
      // 요청이 전송되었지만 응답을 받지 못한 경우
      console.error('No response received:', error.request);
    } else {
      // 요청 설정 중 오류가 발생한 경우
      console.error('Request setup error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
