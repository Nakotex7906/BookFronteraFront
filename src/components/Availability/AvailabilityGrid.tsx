import { useMemo, useState } from "react";
import type { Room } from "../../types/room";
import type { TimeSlot, Availability } from "../../types/schedule";

type Props = {
    rooms: Room[];
    slots: TimeSlot[];
    data: Availability[];
    onSelect: (roomId: string, slotId: string) => void;
};

// Función auxiliar para ordenar slots por hora
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

    // Cambie '1fr' por '140px'
    // Esto obliga a que el título y la celda midan SIEMPRE lo mismo.
    // 250px para el nombre de la sala (columna fija a la izquierda)
    const gridTemplate = useMemo(
        () => `250px repeat(${sortedSlots.length}, 140px)`,
        [sortedSlots.length]
    );

    const isAvailable = (roomId: string | number, slotId: string) =>
        data.some(
            (a) => String(a.roomId) === String(roomId) && a.slotId === slotId && a.available
        );

    const handleClick = (roomId: string, slotId: string, available: boolean) => {
        if (!available) return;
        setSelected({ roomId, slotId });
        onSelect(roomId, slotId);
    };

    const cellBaseClasses =
        "block w-full h-10 rounded-lg border-none cursor-pointer transition-all duration-75 ease-out hover:enabled:scale-[0.98] focus-visible:outline-offset-2 focus-visible:outline-3 focus-visible:outline-[#91caff] aria-disabled:cursor-not-allowed aria-disabled:opacity-90";

    return (
        <div className="w-full rounded-xl bg-white shadow-lg overflow-hidden border border-gray-100">
            <div className="w-full overflow-x-auto
                /* 1. Tamaño del scrollbar */
                /* En tu CSS tenías 'height: 10px'. Agregué 'w-[10px]' para que funcione si el scroll es vertical */
                [&::-webkit-scrollbar]:w-[10px]
                [&::-webkit-scrollbar]:h-[12px]

                /* 2. Estilos del Track (Riel) */
                [&::-webkit-scrollbar-track]:bg-transparent
                [&::-webkit-scrollbar-track]:m-[0_16px]

                /* 3. Estilos del Thumb (Barra) */
                [&::-webkit-scrollbar-thumb]:bg-[#dcdcdc]
                [&::-webkit-scrollbar-thumb]:rounded-[12px]

                /* El truco del borde para simular espacio */
                [&::-webkit-scrollbar-thumb]:border-[3px]
                [&::-webkit-scrollbar-thumb]:border-solid
                [&::-webkit-scrollbar-thumb]:border-white
                [&::-webkit-scrollbar-thumb]:bg-clip-content

                /* 4. Estilos Hover */
                [&::-webkit-scrollbar-thumb:hover]:bg-[#cbcbcb]"
            >

                <div
                    // 'w-max': El ancho será igual a la suma de todas las columnas (no se corta).
                    // 'min-w-full': Si hay pocas columnas, ocupa al menos toda la pantalla.
                    className="p-4 w-max min-w-full"
                >
                    {/* Header */}
                    <div
                        className="grid items-center gap-x-4 border-b-2 border-[#e9ecef] pb-4 mb-4"
                        style={{ gridTemplateColumns: gridTemplate }}
                    >
                        <span className="font-bold text-[.85rem] text-[#495057] whitespace-nowrap pl-2">
                            SALA (CAPACIDAD)
                        </span>
                        {sortedSlots.map((s) => (
                            <span
                                key={s.id}
                                // 'text-center' asegura que el texto del horario quede alineado con el bloque
                                className="font-bold text-[.80rem] text-[#495057] text-center whitespace-nowrap px-1"
                            >
                                {s.label}
                            </span>
                        ))}
                    </div>

                    {/* Filas de Salas */}
                    {rooms.map((room) => (
                        <div
                            key={room.id}
                            className="grid items-center gap-x-4 py-3 border-b border-[#f1f3f5] last:border-b-0 hover:bg-gray-50 transition-colors"
                            style={{ gridTemplateColumns: gridTemplate }}
                            role="row"
                        >
                            {/* Nombre de la Sala */}
                            <span className="font-semibold text-[#212529] whitespace-nowrap pl-2 text-sm">
                                {room.name} ({room.capacity})
                            </span>

                            {/* Botones (Celdas) */}
                            {sortedSlots.map((slot) => {
                                const available = isAvailable(room.id, slot.id);
                                const isSelected =
                                    selected?.roomId === String(room.id) && selected?.slotId === slot.id;

                                const cellStateClasses = isSelected
                                    ? "bg-[#1890ff] shadow-[0_0_0_3px_rgba(24,144,255,.25)]"
                                    : available
                                        ? "bg-[#69bc41]"
                                        : "bg-[#f5222d]";

                                return (
                                    <div key={slot.id} className="px-1"> {/* Padding extra para separar visualmente los bloques */}
                                        <button
                                            className={`${cellBaseClasses} ${cellStateClasses}`}
                                            role="gridcell"
                                            type="button"
                                            onClick={() =>
                                                handleClick(String(room.id), slot.id, available)
                                            }
                                            disabled={!available}
                                            title={`${room.name}, ${slot.label}: ${isSelected ? "Seleccionado" : available ? "Disponible" : "No disponible"
                                            }`}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}