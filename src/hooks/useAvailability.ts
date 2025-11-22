import { useEffect, useState } from 'react';
import apiClient from '../services/api';
import type { Room } from '../types/room';
import type { TimeSlot, Availability } from '../types/schedule';

export function useAvailability(dateISO: string) {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [slots, setSlots] = useState<TimeSlot[]>([]);
    const [matrix, setMatrix] = useState<Availability[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!dateISO) return;

        const fetchAvailability = async () => {
            setLoading(true);
            setMatrix([]);
            setError(null);
            try {
                // El frontend envía params: { date: ... }
                // Ahora el backend con @RequestParam("date") lo leerá correctamente.
                const response = await apiClient.get('/v1/availability', {
                    params: { date: dateISO },
                });

                const data = response.data;
                setRooms(data?.rooms || []);
                setSlots(data?.slots || []);
                setMatrix(data?.availability || []);

            } catch (err) {
                console.error("Error fetching availability:", err);
                setError('No se pudo cargar la disponibilidad.');
                setMatrix([]); // Asegura que quede vacío si falla
            } finally {
                setLoading(false);
            }
        };

        fetchAvailability();

    }, [dateISO]);

    return { rooms, slots, matrix, loading, error };
}