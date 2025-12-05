import { useState, useEffect, useMemo } from 'react';
import { CustomDatePicker } from '../UI/CustomDatePicker';
import { CustomSelect } from '../UI/CustomSelect';
import { AvailabilityApi } from '../../services/AvailabilityApi';
import type { ReservationDetail, DailyAvailabilityResponse } from '../../types/schedule';
import { XIcon, FloppyDiskIcon,WarningIcon } from '@phosphor-icons/react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    reservation: ReservationDetail;
    onUpdateSuccess: () => void;
}

export default function EditReservationModal({ isOpen, onClose, reservation, onUpdateSuccess }: Props) {
    // Fecha seleccionada (String YYYY-MM-DD)
    const [date, setDate] = useState('');
    // ID del bloque horario (ej: "08:30-09:30")
    const [slotId, setSlotId] = useState('');
    // ID de la sala seleccionada
    const [roomId, setRoomId] = useState('');

    const getLocalISOString = (date: Date): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    // CÁLCULO DE LÍMITES DE FECHA (Igual que en StudyRooms)
    const { minDate, maxDate } = useMemo(() => {
        const today = new Date();
        const min = getLocalISOString(today);

        let businessDaysAdded = 0;
        const pointerDate = new Date(today);

        // Sumar 7 días hábiles
        while (businessDaysAdded < 7) {
            pointerDate.setDate(pointerDate.getDate() + 1);
            const day = pointerDate.getDay();
            // 0 = Domingo, 6 = Sábado
            if (day !== 0 && day !== 6) {
                businessDaysAdded++;
            }
        }
        const max = getLocalISOString(pointerDate);

        return { minDate: min, maxDate: max };
    }, []);

    // Datos de disponibilidad para la fecha seleccionada
    const [availabilityData, setAvailabilityData] = useState<DailyAvailabilityResponse | null>(null);

    // Estados de carga y error
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    //  INICIALIZAR VALORES CUANDO SE ABRE EL MODAL
    useEffect(() => {
        if (isOpen && reservation) {
            // Extraer fecha en formato local YYYY-MM-DD
            const start = new Date(reservation.startAt);
            // Truco para obtener fecha local en formato ISO sin conversión a UTC
            const isoDate = start.toLocaleDateString('en-CA'); // en-CA da formato YYYY-MM-DD

            // Reconstruir el ID del Slot actual para pre-seleccionarlo
            // Backend usa formato "HH:mm-HH:mm" (ej: 10:00-11:00)
            const fmtTime = (d: Date) => d.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit', hour12: false });
            const startStr = fmtTime(start);
            const endStr = fmtTime(new Date(reservation.endAt));
            const currentSlotId = `${startStr}-${endStr}`;

            setDate(isoDate);
            setSlotId(currentSlotId);
            setRoomId(String(reservation.room.id));
        }
    }, [isOpen, reservation]);

    //  CARGAR DISPONIBILIDAD AL CAMBIAR LA FECHA
    useEffect(() => {
        if (!isOpen || !date) return;

        const loadAvailability = async () => {
            setIsLoadingData(true);
            setAvailabilityData(null); // Limpiar datos viejos
            try {
                const data = await AvailabilityApi.getAvailability(date);
                setAvailabilityData(data);
            } catch (e) {
                console.error("Error cargando disponibilidad:", e);
                setError("No se pudieron cargar los horarios para esta fecha.");
            } finally {
                setIsLoadingData(false);
            }
        };
        loadAvailability();
    }, [date, isOpen]);

    // ENVIAR CAMBIOS (PUT)
    const handleSave = async () => {
        if (!availabilityData) return;
        setIsSaving(true);
        setError(null);

        try {
            // Buscar la info completa del horario seleccionado
            const slot = availabilityData.slots.find(s => s.id === slotId);
            if (!slot) throw new Error("El horario seleccionado no es válido.");

            // Construir fechas ISO completas
            const startDateTime = new Date(`${date}T${slot.start}:00`).toISOString();
            const endDateTime = new Date(`${date}T${slot.end}:00`).toISOString();

            // Llamada al endpoint de modificación
            await AvailabilityApi.updateReservation(reservation.id, {
                roomId: roomId,
                startAt: startDateTime,
                endAt: endDateTime,
                addToGoogleCalendar: true // Opcional: Podrías hacerlo configurable
            });

            onUpdateSuccess();
            onClose();
        } catch (err: any) {
            setError(err.message || "Error al modificar la reserva");
        } finally {
            setIsSaving(false);
        }
    };

    //  LÓGICA DE FILTRADO DE SALAS
    // Calcula qué salas mostrar en el dropdown basado en el horario elegido
    const availableRooms = useMemo(() => {
        if (!availabilityData || !slotId) return [];

        return availabilityData.rooms.filter(r => {
            //  Si es la MISMA sala y MISMA fecha/hora original, permitirla (es mi propia reserva)
            const isOriginalRoom = String(r.id) === String(reservation.room.id);
            const isOriginalDate = date === new Date(reservation.startAt).toLocaleDateString('en-CA');

            //  Verificar disponibilidad en la matriz (para cambios de sala u hora)
            const entry = availabilityData.availability.find(
                a => String(a.roomId) === String(r.id) && a.slotId === slotId
            );

            // Permitimos si está disponible O si es la sala original en la fecha original
            // (esto último para que aparezca en la lista aunque la matriz diga "ocupado" por mí mismo)
            return (entry && entry.available) || (isOriginalRoom && isOriginalDate);
        });
    }, [availabilityData, slotId, reservation, date]);

    if (!isOpen) return null;

    // Opciones para los Selects
    const timeOptions = availabilityData?.slots.map(s => ({ value: s.id, label: s.label })) || [];
    const roomOptions = availableRooms.map(r => ({
        value: String(r.id),
        label: `${r.name} (Cap: ${r.capacity})`
    }));

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm transition-opacity">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                    <h2 className="text-xl font-bold text-gray-800">Modificar Reserva</h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <XIcon size={20} weight="bold"/>
                    </button>
                </div>

                <div className="space-y-5">
                    {/* Selector de Fecha */}
                    <div className="relative z-30">
                        <CustomDatePicker
                            label="Nueva Fecha"
                            value={date}
                            onChange={setDate}
                            minDate={minDate}
                            maxDate={maxDate}
                            disableWeekends={true}
                        />
                    </div>

                    {/* Selector de Horario */}
                    <div className="relative z-20">
                        <CustomSelect
                            label="Nuevo Horario"
                            value={slotId}
                            onChange={setSlotId}
                            options={timeOptions}
                            disabled={isLoadingData}
                            placeholder={isLoadingData ? "Cargando horarios..." : "Selecciona hora"}
                        />
                    </div>

                    {/* Selector de Sala */}
                    <div className="relative z-10">
                        <CustomSelect
                            label="Nueva Sala"
                            value={roomId}
                            onChange={setRoomId}
                            options={roomOptions}
                            disabled={!slotId || availableRooms.length === 0}
                            placeholder={!slotId ? "Elige horario primero" : "Selecciona sala"}
                        />
                        {/* Mensaje de ayuda si no hay salas */}
                        {slotId && availableRooms.length === 0 && !isLoadingData && (
                            <p className="text-xs text-red-500 mt-1 font-medium bg-red-50 p-2 rounded-lg">
                                No hay salas disponibles en este horario.
                            </p>
                        )}
                    </div>

                    {/* Mensaje de Error General */}
                    {error && (
                        <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100 flex items-start gap-2">
                            <WarningIcon size={20} weight="bold"/>
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Botón de Guardar */}
                    <button
                        onClick={handleSave}
                        disabled={isSaving || !roomId || !slotId}
                        className="w-full py-3.5 bg-[#0a3fa6] text-white rounded-xl font-bold hover:bg-[#083285] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none mt-4"
                    >
                        {isSaving ? (
                            <>
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                Guardando...
                            </>
                        ) : (
                            <>
                                <FloppyDiskIcon size={20} weight="bold"/>
                                Confirmar Cambios
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}