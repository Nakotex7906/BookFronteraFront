import { useMemo, useState} from "react";
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

    const sortedSlots = useMemo(
        () => [...slots].sort((a, b) => toMinutes(a.id) - toMinutes(b.id)),
        [slots]
    );

    const gridTemplate = useMemo(
        () => `240px repeat(${sortedSlots.length}, 1fr)`,
        [sortedSlots.length]
    );

    // 2. Lógica de min-width movida aquí desde el CSS para Tailwind
    // (Tu CSS usaba max-width, así que invertimos para mobile-first de Tailwind)
    const gridMinWClasses = `
      min-w-[calc(160px+${sortedSlots.length}*80px)]
      md:min-w-[calc(200px+${sortedSlots.length}*90px)]
      lg:min-w-[calc(240px+${sortedSlots.length}*100px)]
    `;

    const isAvailable = (roomId: string | number, slotId: string) =>
        data.some(
            (a) => String(a.roomId) === String(roomId) && a.slotId === slotId && a.available
        );

    const handleClick = (roomId: string, slotId: string, available: boolean) => {
        if (!available) return;
        setSelected({ roomId, slotId });
        onSelect(roomId, slotId);
    };

    // 3. Clases base de Tailwind para la celda
    const cellBaseClasses =
        "block w-full h-8 rounded-lg border-none cursor-pointer transition-all duration-75 ease-out hover:enabled:scale-[0.98] focus-visible:outline-offset-2 focus-visible:outline-3 focus-visible:outline-[#91caff] aria-disabled:cursor-not-allowed aria-disabled:opacity-90";

    return (
        // 4. Todas las clases de `styles.wrapper` reemplazadas
        <div className="w-full overflow-x-auto overflow-y-hidden">
            <div
                // 5. Clases de `styles.grid` + `min-width` dinámico
                className={`bg-white rounded-xl shadow-lg mx-auto mb-4 p-4 ${gridMinWClasses}`}
                // `style={cssVars}` ya no es necesario
            >
                {/* Header */}
                <div
                    // 6. Clases de `styles.header`
                    className="grid items-center gap-x-3.5 border-b-2 border-[#e9ecef] pb-2.5"
                    style={{ gridTemplateColumns: gridTemplate }}
                >
                    <span
                        // 7. Clases de `styles.headCell` + `first-child`
                        className="font-bold text-[.85rem] text-[#495057] text-center whitespace-nowrap first:text-left first:pl-1.5"
                    >
                        SALA (CAPACIDAD)
                    </span>
                    {sortedSlots.map((s) => (
                        <span
                            key={s.id}
                            className="font-bold text-[.85rem] text-[#495057] text-center whitespace-nowrap first:text-left first:pl-1.5"
                        >
                            {s.label}
                        </span>
                    ))}
                </div>

                {/* Filas */}
                {rooms.map((room) => (
                    <div
                        key={room.id}
                        // 8. Clases de `styles.row` + `last-child`
                        className="grid items-center gap-x-3.5 py-3 border-b border-[#f1f3f5] last:border-b-0"
                        style={{ gridTemplateColumns: gridTemplate }}
                        role="row"
                    >
                        <span
                            // 9. Clases de `styles.roomCell`
                            className="font-semibold text-[#212529] whitespace-nowrap"
                        >
                            {room.name} ({room.capacity})
                        </span>

                        {sortedSlots.map((slot) => {
                            const available = isAvailable(room.id, slot.id);
                            const isSelected =
                                selected?.roomId === String(room.id) && selected?.slotId === slot.id;

                            // 10. Lógica de clases movida a Tailwind
                            const cellStateClasses = isSelected
                                ? "bg-[#1890ff] shadow-[0_0_0_3px_rgba(24,144,255,.25)]" // .selected
                                : available
                                    ? "bg-[#69bc41]" // .available
                                    : "bg-[#f5222d]"; // .unavailable

                            return (
                                <button
                                    key={slot.id}
                                    // 11. Se combinan las clases base y las de estado
                                    className={`${cellBaseClasses} ${cellStateClasses}`}
                                    role="gridcell"
                                    type="button"
                                    onClick={() =>
                                        handleClick(String(room.id), slot.id, available)
                                    }
                                    aria-disabled={!available}
                                    aria-label={`${room.name}, ${slot.label}: ${
                                        isSelected
                                            ? "Seleccionado"
                                            : available
                                                ? "Disponible"
                                                : "No disponible"
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