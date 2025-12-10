import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1";

export const http = axios.create({
    baseURL: API_URL,
    timeout: 10_000,
    withCredentials: true,
});

// Interceptor para redirigir al login si la sesión expira
http.interceptors.response.use(
    (r) => r,
    (error) => {
        if (error.response?.status === 401 && !error.config.url.includes('/users/me')) {
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);