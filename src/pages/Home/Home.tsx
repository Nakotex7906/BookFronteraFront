import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAvailability } from "../../hooks/useAvailability";
import { Hero } from "../../components/Hero/Hero";
import AvailabilityGrid from "../../components/Availability/AvailabilityGrid";
import { Legend } from "../../components/Availability/Legend";
import { useAuth } from "../../context/AuthContext";
import { ConfirmModal } from "../../components/ConfirmModal/ConfirmModal";
import { AvailabilityApi } from "../../services/AvailabilityApi";

export default function Home() {
    const today = new Date().toISOString().slice(0, 10);
    const { rooms, slots, matrix, loading } = useAvailability(today);

    const navigate = useNavigate();
    const { user } = useAuth();

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

            const startDateTime = new Date(`${today}T${slotInfo.start}:00`);
            const endDateTime = new Date(`${today}T${slotInfo.end}:00`);
            const startAtISO = startDateTime.toISOString();
            const endAtISO = endDateTime.toISOString();

            await AvailabilityApi.createReservation({
                roomId: selectedBooking.roomId,
                startAt: startAtISO,
                endAt: endAtISO,
                addToGoogleCalendar: addToGoogle
            });

            // --- Éxito: Navegar a ReservationSuccess ---
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
        setAddToGoogle(true); // Resetea el checkbox a 'true' al cerrar
    };

    const modalRoomName = rooms.find(r => r.id === selectedBooking?.roomId)?.name;
    const modalSlotLabel = slots.find(s => s.id === selectedBooking?.slotId)?.label;

    return (
        <main>
            <Hero />
            <section className="mx-auto max-w-[1200px] px-8 py-16">
                <h2 className="mb-12 text-center text-4xl font-bold text-[#1a1a1a]">
                    Disponibilidad de Salas
                </h2>

                {loading ? (
                    <p className="text-center text-[1.1rem] text-[#666]">
                        Cargando…
                    </p>
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
                    <strong> {modalRoomName ?? ''}</strong> en el horario
                    <strong> {modalSlotLabel ?? ''}</strong>?
                </p>
            </ConfirmModal>
        </main>
    );
}