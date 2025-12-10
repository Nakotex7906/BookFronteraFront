import { useEffect, useState } from 'react';
import { AvailabilityApi } from '../services/AvailabilityApi'; // <-- Usamos el servicio correcto
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

        // Creamos un controlador para poder cancelar la petición si el componente se desmonta
        const controller = new AbortController();

        const fetchAvailability = async () => {
            setLoading(true);
            setMatrix([]);
            setError(null);
            try {
                // Usamos AvailabilityApi que ya usa 'http.ts' y la variable de entorno
                const data = await AvailabilityApi.getAvailability(dateISO, controller.signal);

                setRooms(data?.rooms || []);
                setSlots(data?.slots || []);
                setMatrix(data?.availability || []);

            } catch (err: any) {
                // Ignoramos errores de cancelación (cuando cambias rápido de fecha)
                if (err.name === 'CanceledError' || err.message === 'canceled') return;

                console.error("Error fetching availability:", err);
                setError('No se pudo cargar la disponibilidad.');
                setRooms([]);
                setSlots([]);
                setMatrix([]);
            } finally {
                setLoading(false);
            }
        };

        fetchAvailability();

        // Cleanup: Cancela la petición si el usuario cambia de fecha rápido
        return () => controller.abort();

    }, [dateISO]);

    return { rooms, slots, matrix, loading, error };
}