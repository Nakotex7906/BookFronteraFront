import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { http } from './http';

describe('Servicio: http interceptor', () => {
    const originalLocation = window.location;

    beforeEach(() => {
        Object.defineProperty(window, 'location', {
            configurable: true,
            value: { href: '' },
        });
    });

    afterEach(() => {
        Object.defineProperty(window, 'location', {
            configurable: true,
            value: originalLocation,
        });
        vi.restoreAllMocks();
    });

    it('debe propagar el error 401 (sin redirección automática en este nivel)', async () => {
        http.defaults.adapter = async () => {
            return Promise.reject({
                response: { status: 401 },
                config: { url: '/ruta-protegida' }
            });
        };

        try {
            await http.get('/ruta-protegida');
        } catch (error: any) {
            expect(error.response.status).toBe(401);
        }

        // Verificamos que NO cambia la URL, ya que el código no tiene esa lógica activa
        expect(window.location.href).toBe('');
    });

    it('debe propagar otros errores (ej. 500) sin redirigir', async () => {
        http.defaults.adapter = async () => {
            return Promise.reject({
                response: { status: 500 },
                config: { url: '/ruta-con-error' }
            });
        };

        window.location.href = '/mi-perfil';

        try {
            await http.get('/ruta-con-error');
        } catch (error: any) {
            expect(error.response.status).toBe(500);
        }

        expect(window.location.href).toBe('/mi-perfil');
    });
});