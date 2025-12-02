import axios from "axios";

export const http = axios.create({
    baseURL: "/api/v1",
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