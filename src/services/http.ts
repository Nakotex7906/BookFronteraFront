import axios from "axios";

export const http = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:8080/api",
    timeout: 10_000,
    withCredentials: true,
});

// (Opcional) Manejo global de 401/403
http.interceptors.response.use(
    (r) => r,
    (error) => {
        if (error.response?.status === 401) {
            // Si una API request falla por no estar autenticado,
            // redirige a login.
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);
