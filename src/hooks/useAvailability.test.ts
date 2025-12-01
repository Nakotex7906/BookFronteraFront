import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useAvailability } from './useAvailability';
import apiClient from '../services/api';

// Mockeamos axios/apiClient
vi.mock('../services/api');

describe('Hook: useAvailability', () => {
    it('debe retornar las salas y slots cuando la API responde correctamente', async () => {
        // Datos simulados que devolvería el backend
        const mockResponse = {
            data: {
                rooms: [{ id: 1, name: "Sala 1", capacity: 5 }],
                slots: [{ id: "08:30", label: "Bloque 1" }],
                availability: [{ roomId: "1", slotId: "08:30", available: true }]
            }
        };

        // Simulamos respuesta exitosa
        (apiClient.get as any).mockResolvedValue(mockResponse);

        // Ejecutamos el hook
        const { result } = renderHook(() => useAvailability("2025-11-20"));

        // Verificar estado inicial de carga
        expect(result.current.loading).toBe(true);

        // Esperar a que termine de cargar
        await waitFor(() => expect(result.current.loading).toBe(false));

        // Verificar los datos procesados
        expect(result.current.rooms).toHaveLength(1);
        expect(result.current.rooms[0].name).toBe("Sala 1");
        expect(result.current.slots).toHaveLength(1);
        expect(result.current.error).toBeNull();
    });

    it('debe manejar errores si la API falla', async () => {
        // Simulamos error del servidor
        (apiClient.get as any).mockRejectedValue(new Error("Error 500"));

        const { result } = renderHook(() => useAvailability("2025-11-20"));

        await waitFor(() => expect(result.current.loading).toBe(false));

        // Verificar que capturó el error
        expect(result.current.error).toBe("No se pudo cargar la disponibilidad.");
        expect(result.current.rooms).toEqual([]); // Debe limpiar las salas
    });
});