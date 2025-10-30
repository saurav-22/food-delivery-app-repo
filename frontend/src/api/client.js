import axios from 'axios';

// Use relative base by default so the app calls the same origin that served the static files.
// Override at build time with VITE_API_BASE_URL if you need to point to a different host.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '',
  timeout: 10000
});

// Log chosen base URL to help debugging in deployed environments.
console.info('API base URL:', api.defaults.baseURL || '(relative)');

export default api;
