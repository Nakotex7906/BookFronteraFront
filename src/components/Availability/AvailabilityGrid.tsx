import { useMemo, useState, type CSSProperties } from "react";
import styles from "./AvailabilityGrid.module.css";
import type { Room } from "../../types/room";
import type { TimeSlot, Availability } from "../../types/schedule";

type Props = {
    rooms: Room[];
    slots: TimeSlot[];
    data: Availability[];
    onSelect: (roomId: string, slotId: string) => void;
};

const toMinutes = (id: string) => {
    const [from] = id.split("-");
    const [hh, mm = "00"] = from.split(":");
    return parseInt(hh, 10) * 60 + parseInt(mm, 10);
};

export default function AvailabilityGrid({ rooms, slots, data, onSelect }: Props) {
    const [selected, setSelected] = useState<{ roomId: string; slotId: string } | null>(null);

    // Ordena por hora de inicio para que los encabezados y celdas coincidan
    const sortedSlots = useMemo(
        () => [...slots].sort((a, b) => toMinutes(a.id) - toMinutes(b.id)),
        [slots]
    );

    // Plantilla de columnas: 1 fija para "Sala" y N para slots
    const gridTemplate = useMemo(
        () => `240px repeat(${sortedSlots.length}, 1fr)`,
        [sortedSlots.length]
    );

    const cssVars: CSSProperties = {
        ["--slot-count" as any]: sortedSlots.length,
    };

    const isAvailable = (roomId: string | number, slotId: string) =>
        data.some(
            (a) => String(a.roomId) === String(roomId) && a.slotId === slotId && a.available
        );

    const handleClick = (roomId: string, slotId: string, available: boolean) => {
        if (!available) return;
        setSelected({ roomId, slotId });
        onSelect(roomId, slotId);
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.grid} style={cssVars}>
                {/* Header */}
                <div className={styles.header} style={{ gridTemplateColumns: gridTemplate }}>
                    <span className={styles.headCell}>SALA (CAPACIDAD)</span>
                    {sortedSlots.map((s) => (
                        <span key={s.id} className={styles.headCell}>
              {s.label}
            </span>
                    ))}
                </div>

                {/* Filas */}
                {rooms.map((room) => (
                    <div
                        key={room.id}
                        className={styles.row}
                        style={{ gridTemplateColumns: gridTemplate }}
                        role="row"
                    >
            <span className={styles.roomCell}>
              {room.name} ({room.capacity})
            </span>

                        {sortedSlots.map((slot) => {
                            const available = isAvailable(room.id, slot.id);
                            const isSelected =
                                selected?.roomId === String(room.id) && selected?.slotId === slot.id;

                            const cellClass = isSelected
                                ? styles.selected
                                : available
                                    ? styles.available
                                    : styles.unavailable;

                            return (
                                <button
                                    key={slot.id}
                                    className={`${styles.cell} ${cellClass}`}
                                    role="gridcell"
                                    type="button"
                                    onClick={() =>
                                        handleClick(String(room.id), slot.id, available)
                                    }
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
        </div>
    );
}
