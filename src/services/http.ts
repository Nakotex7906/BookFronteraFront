import axios from "axios";

export const http = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:8080/api",
    timeout: 10_000,
    withCredentials: false, // ponlo true si usarás cookie de sesión
});

// (Opcional) Interceptor para Auth (Bearer o cookie)
http.interceptors.request.use((config) => {
    const token = localStorage.getItem("token"); // o donde lo guardes
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// (Opcional) Manejo global de 401/403
http.interceptors.response.use(
    (r) => r,
    (error) => {
        if (error.response?.status === 401) {
            // redirige a login, limpia storage, etc.
        }
        return Promise.reject(error);
    }
);
