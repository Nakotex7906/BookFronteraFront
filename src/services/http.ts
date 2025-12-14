import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1";

export const http = axios.create({
    baseURL: API_URL,
    timeout: 10_000,
    withCredentials: true,
    // Nota: xsrfCookieName ya no nos sirve de mucho por el tema de puertos, pero déjalo por si acaso.
    xsrfCookieName: "XSRF-TOKEN",
    xsrfHeaderName: "X-XSRF-TOKEN",
});

http.interceptors.response.use(
    (response) => {
        // Buscamos el token en los headers de respuesta
        const csrfToken = response.headers['x-xsrf-token'];

        if (csrfToken) {
            // Lo guardamos en los defaults de Axios para que se envíe en la próxima petición
            http.defaults.headers.common['X-XSRF-TOKEN'] = csrfToken;
        }
        return response;
    },
    (error) => {
        // (Mantén tu lógica de error 401 aquí si la tenías)
        return Promise.reject(error);
    }
);

export default http;