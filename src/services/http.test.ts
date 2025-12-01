import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { http } from './http';

describe('Servicio: http interceptor', () => {
    // Guardamos la ubicación original para restaurarla después
    const originalLocation = window.location;

    beforeEach(() => {
        // Mockeamos window.location para poder verificar si cambia
        Object.defineProperty(window, 'location', {
            configurable: true,
            value: { href: '' },
        });
    });

    afterEach(() => {
        // Restauramos window.location original
        Object.defineProperty(window, 'location', {
            configurable: true,
            value: originalLocation,
        });
        // Limpiamos mocks
        vi.restoreAllMocks();
    });

    it('debe redirigir a /login cuando la API responde con 401', async () => {
        //  Interceptamos el adaptador de axios para simular un fallo 401
        // Esto evita hacer una llamada real y nos permite controlar la respuesta exacta
        http.defaults.adapter = async () => {
            return Promise.reject({
                response: { status: 401 }
            });
        };

        //  Hacemos una petición cualquiera
        try {
            await http.get('/ruta-protegida');
        } catch (error) {
            // Esperamos que falle, así que ignoramos el catch
        }

        //  Verificamos que el interceptor cambió la URL
        expect(window.location.href).toBe('/login');
    });

    it('debe propagar otros errores (ej. 500) sin redirigir', async () => {
        // Simulamos un error 500 (Error del servidor)
        http.defaults.adapter = async () => {
            return Promise.reject({
                response: { status: 500 }
            });
        };

        window.location.href = '/mi-perfil'; // URL actual simulada

        //  Hacemos la petición
        try {
            await http.get('/ruta-con-error');
        } catch (error: any) {
            //  Verificamos que el error llegó hasta aquí (se propagó)
            expect(error.response.status).toBe(500);
        }

        //  Verificamos que NO nos redirigió
        expect(window.location.href).toBe('/mi-perfil');
    });
});