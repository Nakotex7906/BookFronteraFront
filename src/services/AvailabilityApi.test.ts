import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AvailabilityApi } from './AvailabilityApi';
import { http } from './http';
import { AxiosError } from 'axios';

// Mockeamos el cliente http
vi.mock('./http', () => ({
    http: {
        get: vi.fn(),
        post: vi.fn(),
        delete: vi.fn(),
        put: vi.fn(),
    },
}));

describe('Service: AvailabilityApi', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('getAvailability: debe llamar a GET /availability con los parámetros correctos', async () => {
        const mockResponse = { data: { rooms: [], slots: [], availability: [] } };
        (http.get as any).mockResolvedValue(mockResponse);

        const result = await AvailabilityApi.getAvailability('2025-10-10');

        expect(http.get).toHaveBeenCalledWith('/availability', {
            params: { date: '2025-10-10' },
            signal: undefined
        });
        expect(result).toEqual(mockResponse.data);
    });

    it('createReservation: debe llamar a POST /reservations', async () => {
        const payload = { roomId: "1", startAt: "ISO", endAt: "ISO", addToGoogleCalendar: true };
        const mockResponse = { data: { id: "123" } };
        (http.post as any).mockResolvedValue(mockResponse);

        const result = await AvailabilityApi.createReservation(payload);

        expect(http.post).toHaveBeenCalledWith('/reservations', payload);
        expect(result).toEqual(mockResponse.data);
    });

    it('cancelReservation: debe llamar a DELETE /reservations/:id', async () => {
        (http.delete as any).mockResolvedValue({});

        await AvailabilityApi.cancelReservation(99);

        expect(http.delete).toHaveBeenCalledWith('/reservations/99');
    });

    it('createOnBehalf: debe llamar a POST /reservations/on-behalf', async () => {
        const payload = { roomId: "1", startAt: "ISO", endAt: "ISO", othersEmail: "a@u.cl", addToGoogleCalendar: false };
        (http.post as any).mockResolvedValue({});

        await AvailabilityApi.createOnBehalf(payload);

        expect(http.post).toHaveBeenCalledWith('/reservations/on-behalf', payload);
    });

    it('getReservationsByRoom: debe llamar a GET /room/:id', async () => {
        const mockRes = { data: [{ id: 1 }] };
        (http.get as any).mockResolvedValue(mockRes);

        const result = await AvailabilityApi.getReservationsByRoom(5);

        expect(http.get).toHaveBeenCalledWith('/room/5');
        expect(result).toEqual(mockRes.data);
    });

    it('updateReservation: debe llamar a PUT /reservations/:id', async () => {
        const payload = { roomId: "2", startAt: "ISO", endAt: "ISO", addToGoogleCalendar: true };
        const mockRes = { data: { id: 1, ...payload } };
        (http.put as any).mockResolvedValue(mockRes);

        const result = await AvailabilityApi.updateReservation(10, payload);

        expect(http.put).toHaveBeenCalledWith('/reservations/10', payload);
        expect(result).toEqual(mockRes.data);
    });

    // --- TEST DE MANEJO DE ERRORES (Cubre el catch y errorMessage) ---
    it('debe manejar errores de Axios y lanzar un Error con el mensaje correcto', async () => {
        const axiosError = new AxiosError();
        axiosError.response = {
            data: { message: "Error personalizado del backend" },
            status: 400,
            statusText: "Bad Request",
            headers: {},
            config: {} as any
        };

        (http.get as any).mockRejectedValue(axiosError);

        await expect(AvailabilityApi.getMyReservations()).rejects.toThrow("Error personalizado del backend");
    });

    it('debe manejar errores genéricos', async () => {
        (http.get as any).mockRejectedValue(new Error("Error de red"));
        await expect(AvailabilityApi.getMyReservations()).rejects.toThrow("Error de red");
    });
});