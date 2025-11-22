import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAvailability } from "../../hooks/useAvailability";
import { Hero } from "../../components/Hero/Hero";
import AvailabilityGrid from "../../components/Availability/AvailabilityGrid";
import { Legend } from "../../components/Availability/Legend";
import { useAuth } from "../../context/AuthContext";
import { ConfirmModal } from "../../components/ConfirmModal/ConfirmModal";
import { AvailabilityApi } from "../../services/AvailabilityApi";

// --- UTILIDADES PARA LOS DÍAS (Del código de navegación) ---
const getLocalISOString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

const getNextBusinessDays = (count: number) => {
    const days = [];
    const current = new Date();
    while (days.length < count) {
        const dayOfWeek = current.getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Lunes a Viernes
            days.push(new Date(current));
        }
        current.setDate(current.getDate() + 1);
    }
    return days;
};

const formatDateLabel = (date: Date) => {
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const dayName = days[date.getDay()];
    const dayNumber = date.getDate();
    return `${dayName} ${dayNumber}`;
};

export default function Home() {
    // 1. Generamos los días hábiles para los botones
    const businessDays = useMemo(() => getNextBusinessDays(8), []);

    // 2. ESTADO: Fecha seleccionada (Inicializamos con el primer día hábil)
    //    Esto reemplaza al 'const today' fijo.
    const [selectedDateISO, setSelectedDateISO] = useState<string>(
        getLocalISOString(businessDays[0])
    );

    // 3. HOOK: Ahora depende de 'selectedDateISO'.
    //    Al cambiar la fecha, la grilla se recargará con los datos de ESE día.
    const { rooms, slots, matrix, loading } = useAvailability(selectedDateISO);

    const navigate = useNavigate();
    const { user, openLoginModal } = useAuth();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<{ roomId: string; slotId: string } | null>(null);
    const [isBooking, setIsBooking] = useState(false);
    const [bookingError, setBookingError] = useState<string | null>(null);
    const [addToGoogle, setAddToGoogle] = useState(true);

    // Limpiamos selección al cambiar de día
    useEffect(() => {
        setSelectedBooking(null);
        setIsModalOpen(false);
    }, [selectedDateISO]);

    const handleSlotSelect = (roomId: string, slotId: string) => {
        setSelectedBooking({ roomId, slotId });
        setIsModalOpen(true);
        setBookingError(null);
    };

    const handleConfirmBooking = async () => {
        if (!user) {
            openLoginModal();
            return;
        }
        if (!selectedBooking) return;

        setIsBooking(true);
        setBookingError(null);

        try {
            const slotInfo = slots.find(s => s.id === selectedBooking.slotId);
            if (!slotInfo) {
                setBookingError("Error: No se pudo encontrar el horario.");
                setIsBooking(false);
                return;
            }

            // Usamos 'selectedDateISO' en lugar de 'today' para que la reserva
            // se haga en el día que estás mirando en pantalla.
            const startDateTime = new Date(`${selectedDateISO}T${slotInfo.start}:00`);
            const endDateTime = new Date(`${selectedDateISO}T${slotInfo.end}:00`);

            const startAtISO = startDateTime.toISOString();
            const endAtISO = endDateTime.toISOString();

            console.log("Reservando para:", startAtISO); // Debug

            await AvailabilityApi.createReservation({
                roomId: selectedBooking.roomId,
                startAt: startAtISO,
                endAt: endAtISO,
                addToGoogleCalendar: addToGoogle
            });

            // Redirección de éxito
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
            <section className="mx-auto max-w-[1200px] px-8 py-16">
                <h2 className="mb-8 text-center text-4xl font-bold text-[#1a1a1a]">
                    Disponibilidad de Salas
                </h2>

                {/* --- SELECTOR DE DÍAS --- */}
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
                                    <span className="mb-1 text-xs font-medium uppercase opacity-80">
                                        {formatDateLabel(date).split(' ')[0]}
                                    </span>
                                    <span className="text-xl font-bold">
                                        {formatDateLabel(date).split(' ')[1]}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                    <p className="text-center text-sm text-gray-500 mt-2">
                        Viendo disponibilidad para el: <strong>{selectedDateISO}</strong>
                    </p>
                </div>

                {/* --- GRILLA CON OVERLAY DE CARGA --- */}
                <div className="relative min-h-[300px]">
                    {loading && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 backdrop-blur-[1px]">
                            <p className="text-sm font-bold text-[#0052cc]">Cargando disponibilidad...</p>
                        </div>
                    )}

                    <div className={`transition-opacity duration-200 ${loading ? 'opacity-50' : 'opacity-100'}`}>
                        <AvailabilityGrid
                            rooms={rooms}
                            slots={slots}
                            data={matrix}
                            onSelect={handleSlotSelect}
                        />
                        <Legend />
                    </div>
                </div>
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
                    <strong> {modalRoomName ?? ''}</strong> para el día
                    <strong> {selectedDateISO} </strong>
                    en el horario
                    <strong> {modalSlotLabel ?? ''}</strong>?
                </p>
            </ConfirmModal>
        </main>
    );
}