import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useAvailability } from './useAvailability';
import { http } from '../services/http';

vi.mock('../services/http');

describe('Hook: useAvailability', () => {
    it('debe retornar las salas y slots cuando la API responde correctamente', async () => {
        const mockResponse = {
            data: {
                rooms: [{ id: 1, name: "Sala 1", capacity: 5 }],
                slots: [{ id: "08:30", label: "Bloque 1" }],
                availability: [{ roomId: "1", slotId: "08:30", available: true }]
            }
        };

        (http.get as any).mockResolvedValue(mockResponse);

        const { result } = renderHook(() => useAvailability("2025-11-20"));

        expect(result.current.loading).toBe(true);
        await waitFor(() => expect(result.current.loading).toBe(false));

        expect(result.current.rooms).toHaveLength(1);
        expect(result.current.rooms[0].name).toBe("Sala 1");
        expect(result.current.error).toBeNull();
    });

    it('debe manejar errores si la API falla', async () => {
        (http.get as any).mockRejectedValue(new Error("Error 500"));

        const { result } = renderHook(() => useAvailability("2025-11-20"));

        await waitFor(() => expect(result.current.loading).toBe(false));

        expect(result.current.error).toBe("No se pudo cargar la disponibilidad.");
        expect(result.current.rooms).toEqual([]);
    });
});