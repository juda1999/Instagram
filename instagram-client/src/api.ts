import axios from 'axios';

export function getImageRequestPath(path) {
  return `http://localhost:3001/image?path=${path}`;
}

const api = axios.create({
  baseURL: 'http://localhost:3001/',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');

    if (
      accessToken &&
      !config.url.includes('/register') &&
      !config.url.includes('/login') &&
      !config.url.includes('/googleLogin')
    ) {
      config.headers['Authorization'] = accessToken;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');

        const res = await api.post('/refresh', { refreshToken });

        const newAccessToken = res.data.accessToken;

        localStorage.setItem('accessToken', newAccessToken);

        // Retry the original request with the new access token
        originalRequest.headers['Authorization'] = newAccessToken;

        return api(originalRequest);
      } catch (refreshError) {
        // If refreshing fails (e.g., refresh token is expired), you might want to log the user out
        // logout();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
