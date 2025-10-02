import { useEffect, useState } from "react";
import { fetchAvailability } from "../services/api";
import type { Room } from "../types/room";
import type { TimeSlot, Availability } from "../types/schedule";

// Datos mock para desarrollo
const mockRooms: Room[] = [
    { id: "sala-a", name: "Sala A", capacity: 4 },
    { id: "sala-b", name: "Sala B", capacity: 6 },
    { id: "sala-c", name: "Sala C", capacity: 8 },
];

const mockSlots: TimeSlot[] = [
    { id: "08-09", label: "08:00 - 09:00" },
    { id: "09-10", label: "09:00 - 10:00" },
    { id: "10-11", label: "10:00 - 11:00" },
    { id: "11-12", label: "11:00 - 12:00" },
    { id: "12-13", label: "12:00 - 13:00" },
    { id: "13-14", label: "13:00 - 14:00" },
    { id: "14-15", label: "14:00 - 15:00" },
    { id: "15-16", label: "15:00 - 16:00" },
    { id: "16-17", label: "16:00 - 17:00" },
    { id: "17-18", label: "17:00 - 18:00" },
];

// Generar disponibilidad aleatoria para demostración
const generateMockAvailability = (): Availability[] => {
    const availability: Availability[] = [];
    mockRooms.forEach(room => {
        mockSlots.forEach(slot => {
            availability.push({
                roomId: room.id,
                slotId: slot.id,
                available: Math.random() > 0.4, // 60% disponible
            });
        });
    });
    return availability;
};

const mockAvailability = generateMockAvailability();

export function useAvailability(dateISO: string) {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [slots, setSlots] = useState<TimeSlot[]>([]);
    const [matrix, setMatrix] = useState<Availability[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        (async () => {
            setLoading(true);
            try {
                const data = await fetchAvailability(dateISO);
                if (mounted) {
                    setRooms(data.rooms);
                    setSlots(data.slots);
                    setMatrix(data.availability);
                }
            } catch (error) {
                // Si la API falla, usar datos mock
                console.log("API no disponible, usando datos de ejemplo");
                if (mounted) {
                    setRooms(mockRooms);
                    setSlots(mockSlots);
                    setMatrix(mockAvailability);
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        })();
        return () => { mounted = false; };
    }, [dateISO]);

    return { rooms, slots, matrix, loading };
}
