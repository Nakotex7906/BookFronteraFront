import { useState } from "react";
import styles from "./AvailabilityGrid.module.css";
import type { Room } from "../../types/room";
import type { TimeSlot, Availability } from "../../types/schedule";

type Props = {
    rooms: Room[];
    slots: TimeSlot[];
    data: Availability[];
    onSelect: (roomId: string, slotId: string) => void;
};

export default function AvailabilityGrid({ rooms, slots, data, onSelect }: Props) {
    const [selected, setSelected] = useState<{roomId: string, slotId: string} | null>(null);

    const isAvailable = (r: string, s: string) =>
        data.some(a => a.roomId === r && a.slotId === s && a.available);

    const handleClick = (roomId: string, slotId: string, available: boolean) => {
        if (!available) return;
        setSelected({ roomId, slotId });
        onSelect(roomId, slotId);
    };

    return (
        <div role="grid" aria-label="Disponibilidad de salas" className={styles.grid}>
            <div className={styles.header}>
                <span className={styles.headCell}>SALA (CAPACIDAD)</span>
                {slots.map(s => <span key={s.id} className={styles.headCell}>{s.label}</span>)}
            </div>

            {rooms.map(room => (
                <div role="row" key={room.id} className={styles.row}>
                    <span className={styles.roomCell}>{room.name} ({room.capacity})</span>
                    {slots.map(slot => {
                        const available = isAvailable(room.id, slot.id);
                        const isSelected = selected?.roomId === room.id && selected?.slotId === slot.id;
                        const cellClass = isSelected
                            ? styles.selected
                            : (available ? styles.available : styles.unavailable);

                        return (
                            <button
                                key={slot.id}
                                role="gridcell"
                                type="button"
                                className={`${styles.cell} ${cellClass}`}
                                onClick={() => handleClick(room.id, slot.id, available)}
                                aria-disabled={!available}
                                aria-label={`${room.name}, ${slot.label}: ${
                                    isSelected ? "Seleccionado" : available ? "Disponible" : "No disponible"
                                }`}
                            />
                        );
                    })}
                </div>
            ))}
        </div>
    );
}
