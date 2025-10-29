import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://d26fo7i4zd5ke7.cloudfront.net',
  timeout: 10000
});

export default api;
