import axios from 'axios';

// point at your API (adjust if different)
const API_BASE =
  import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:13000';

const http = axios.create({
  baseURL: API_BASE,
  withCredentials: false, // set true ONLY if you're using cookie auth
});

// attach Bearer token on every request
http.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken'); // or pull from your AuthContext
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// optional: handle 401s cleanly (redirect to login, clear token, etc.)
http.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      localStorage.removeItem('accessToken');
      // e.g., window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default http;
