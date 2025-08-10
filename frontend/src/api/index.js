import axios from 'axios';

// IMPORTANT: Replace with your backend URL.
// Use http://localhost:5000 for local development.
// Use your deployed Render/Fly.io URL for production.
const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
});

// Interceptor to add the JWT token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;