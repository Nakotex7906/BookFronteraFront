import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAvailability } from "../../hooks/useAvailability";
import { Hero } from "../../components/Hero/Hero";
import AvailabilityGrid from "../../components/Availability/AvailabilityGrid";
import { Legend } from "../../components/Availability/Legend";
import { useAuth } from "../../context/AuthContext";
import { ConfirmModal } from "../../components/ConfirmModal/ConfirmModal";
import { AvailabilityApi } from "../../services/AvailabilityApi";

// --- UTILIDADES DE FECHA ---

/**
 * Obtiene una fecha en formato YYYY-MM-DD respetando la zona horaria local.
 * (toISOString suele dar la fecha en UTC y puede causar errores de "día anterior").
 */
const getLocalISOString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

/**
 * Genera una lista de 'count' días hábiles (Lunes a Viernes) a partir de hoy.
 */
const getNextBusinessDays = (count: number) => {
    const days = [];
    const current = new Date();
    
    // Iteramos hasta encontrar la cantidad deseada de días hábiles
    while (days.length < count) {
        const dayOfWeek = current.getDay();
        // 0 = Domingo, 6 = Sábado. Solo agregamos si no es fin de semana.
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
            days.push(new Date(current));
        }
        // Avanzamos al día siguiente
        current.setDate(current.getDate() + 1);
    }
    return days;
};

/**
 * Formatea la fecha para mostrarla en el botón (ej: "Lun 15", "Mar 16")
 */
const formatDateLabel = (date: Date) => {
    // Días de la semana en español
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const dayName = days[date.getDay()];
    const dayNumber = date.getDate();
    return `${dayName} ${dayNumber}`; // Ej: "Lun 24"
};


export default function Home() {
    // 1. Generamos los días disponibles (Hoy + 7 días hábiles = 8 botones en total)
    // Usamos useMemo para que no se recalcule en cada render innecesariamente.
    const businessDays = useMemo(() => getNextBusinessDays(8), []);

    // 2. Estado para la fecha seleccionada. Por defecto es el primer día de la lista.
    // Guardamos el string YYYY-MM-DD directamente.
    const [selectedDateISO, setSelectedDateISO] = useState<string>(
        getLocalISOString(businessDays[0])
    );

    // 3. El hook ahora depende de 'selectedDateISO'. 
    // Cuando cambies la fecha, el hook hará el fetch automáticamente.
    const { rooms, slots, matrix, loading } = useAvailability(selectedDateISO);

    const navigate = useNavigate();
    const { user } = useAuth();

    // Estados del Modal y Reserva
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<{ roomId: string; slotId: string } | null>(null);
    const [isBooking, setIsBooking] = useState(false);
    const [bookingError, setBookingError] = useState<string | null>(null);
    const [addToGoogle, setAddToGoogle] = useState(true);

    const handleSlotSelect = (roomId: string, slotId: string) => {
        setSelectedBooking({ roomId, slotId });
        setIsModalOpen(true);
        setBookingError(null);
    };

    const handleConfirmBooking = async () => {
        if (!user) {
            // Si tienes el LoginModal configurado globalmente, aquí llamarías a openLoginModal()
            // Por ahora, mantengo tu lógica de redirección o lo que definiste antes
            navigate('/login'); 
            return;
        }

        if (!selectedBooking) return;

        setIsBooking(true);
        setBookingError(null);

        try {
            const slotInfo = slots.find(s => s.id === selectedBooking.slotId);

            if (!slotInfo) {
                setBookingError("Error: No se pudo encontrar la información del horario seleccionado.");
                setIsBooking(false);
                return;
            }

            // Usamos selectedDateISO para construir la fecha correcta de reserva
            const startDateTime = new Date(`${selectedDateISO}T${slotInfo.start}:00`);
            const endDateTime = new Date(`${selectedDateISO}T${slotInfo.end}:00`);
            const startAtISO = startDateTime.toISOString();
            const endAtISO = endDateTime.toISOString();

            await AvailabilityApi.createReservation({
                roomId: selectedBooking.roomId,
                startAt: startAtISO,
                endAt: endAtISO,
                addToGoogleCalendar: addToGoogle
            });

            // Navegar a éxito
            const roomInfo = rooms.find(r => r.id === selectedBooking.roomId);
            const params = new URLSearchParams();
            params.append("room", roomInfo?.name ?? selectedBooking.roomId);
            params.append("start", startAtISO);
            params.append("end", endAtISO);

            setIsModalOpen(false);
            navigate(`/reservation-success?${params.toString()}`);

        } catch (error: any) {
            setBookingError(error.message || "No se pudo completar la reserva.");
        } finally {
            setIsBooking(false);
        }
    };

    const handleCloseModal = () => {
        if (isBooking) return;
        setIsModalOpen(false);
        setSelectedBooking(null);
        setBookingError(null);
        setAddToGoogle(true);
    };

    const modalRoomName = rooms.find(r => r.id === selectedBooking?.roomId)?.name;
    const modalSlotLabel = slots.find(s => s.id === selectedBooking?.slotId)?.label;

    return (
        <main>
            <Hero />
            <section className="mx-auto max-w-[1200px] px-4 py-12 md:px-8">
                <h2 className="mb-8 text-center text-3xl font-bold text-[#1a1a1a] md:text-4xl">
                    Disponibilidad de Salas
                </h2>

                {/* --- SELECTOR DE FECHAS --- */}
                <div className="mb-8">
                    <div className="flex gap-3 overflow-x-auto pb-4 sm:justify-center">
                        {businessDays.map((date) => {
                            const iso = getLocalISOString(date);
                            const isSelected = iso === selectedDateISO;

                            return (
                                <button
                                    key={iso}
                                    onClick={() => setSelectedDateISO(iso)}
                                    className={`
                                        flex min-w-[80px] flex-col items-center rounded-xl border px-4 py-3 text-sm transition-all duration-200
                                        ${isSelected 
                                            ? "border-[#0052cc] bg-[#0052cc] text-white shadow-md transform scale-105" 
                                            : "border-gray-200 bg-white text-gray-600 hover:border-[#0052cc] hover:text-[#0052cc]"
                                        }
                                    `}
                                >
                                    {/* Día (Lun, Mar...) */}
                                    <span className="mb-1 text-xs font-medium uppercase opacity-80">
                                        {formatDateLabel(date).split(' ')[0]}
                                    </span>
                                    {/* Número (21, 22...) */}
                                    <span className="text-xl font-bold">
                                        {formatDateLabel(date).split(' ')[1]}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                    {/* Texto informativo de la fecha seleccionada */}
                    <p className="text-center text-sm text-gray-500">
                        Viendo disponibilidad para el: <span className="font-semibold text-gray-800">{selectedDateISO}</span>
                    </p>
                </div>

                {/* --- GRID O CARGANDO --- */}
                {loading ? (
                    <div className="flex h-64 items-center justify-center rounded-xl bg-gray-50">
                        <div className="flex flex-col items-center gap-3">
                            {/* Spinner simple con CSS */}
                            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#0052cc]"></div>
                            <p className="text-gray-500">Cargando horarios...</p>
                        </div>
                    </div>
                ) : (
                    <>
                        <AvailabilityGrid
                            rooms={rooms}
                            slots={slots}
                            data={matrix}
                            onSelect={handleSlotSelect}
                        />
                        <Legend />
                    </>
                )}
            </section>

            {/* MODAL */}
            <ConfirmModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onConfirm={handleConfirmBooking}
                title="Confirmar Reserva"
                isLoading={isBooking}
                error={bookingError}
                showGoogleCalendarCheck={true}
                googleCalendarChecked={addToGoogle}
                onGoogleCalendarChange={setAddToGoogle}
            >
                <p>
                    ¿Estás seguro de que quieres reservar la sala
                    <strong> {modalRoomName ?? ''}</strong> el día 
                    <strong> {selectedDateISO} </strong> 
                    en el horario
                    <strong> {modalSlotLabel ?? ''}</strong>?
                </p>
            </ConfirmModal>
        </main>
    );
}