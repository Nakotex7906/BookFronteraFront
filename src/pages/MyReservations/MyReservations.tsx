import { useEffect, useState } from "react";
import { AvailabilityApi } from "../../services/AvailabilityApi";
import type { ReservationDetail } from "../../types/schedule";
import { ReservationCard } from "../../components/ReservationCard/ReservationCard";
import EditReservationModal from "../../components/EditModal/EditReservationModal";
import { ConfirmModal } from "../../components/ConfirmModal/ConfirmModal";

export default function MyReservations() {
    // Estado para cada lista
    const [current, setCurrent] = useState<ReservationDetail | null>(null);
    const [future, setFuture] = useState<ReservationDetail[]>([]);
    const [past, setPast] = useState<ReservationDetail[]>([]);

    // Estados de UI
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [cancellingId, setCancellingId] = useState<number | null>(null);

    // 2Estado para controlar qué reserva se está editando
    const [editingReservation, setEditingReservation] = useState<ReservationDetail | null>(null);

    // NUEVOS ESTADOS PARA EL MODAL DE CANCELACIÓN
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [reservationToCancel, setReservationToCancel] = useState<ReservationDetail | null>(null);

    // Función para cargar los datos
    const fetchReservations = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await AvailabilityApi.getMyReservations();
            setCurrent(data.current);
            setFuture(data.future);
            setPast(data.past);
        } catch (err: any) {
            setError(err.message || "No se pudiero cargar tus reservas.");
        } finally {
            setIsLoading(false);
        }
    };

    // Cargar datos al montar el componente
    useEffect(() => {
        fetchReservations();
    }, []);

    // Función para manejar la cancelación
    const handleRequestCancel = (id: number) => {
        // Buscamos la reserva completa para mostrar su nombre en el modal
        const targetRes =
            (current?.id === id ? current : null) ||
            future.find(r => r.id === id);

        if (targetRes) {
            setReservationToCancel(targetRes);
            setIsCancelModalOpen(true);
        }
    };

    //  NUEVA FUNCIÓN QUE REALMENTE CANCELA (Se llama desde el Modal)
    const handleConfirmCancel = async () => {
        if (!reservationToCancel) return;

        setCancellingId(reservationToCancel.id); // Activa el spinner en la tarjeta (opcional, o usamos isLoading del modal)

        // Opcional: Podrías usar un estado local `isCancellingModal` para el spinner del botón del modal
        // en lugar de `setCancellingId` de la tarjeta, pero mantendremos la lógica simple.

        try {
            await AvailabilityApi.cancelReservation(reservationToCancel.id);
            setIsCancelModalOpen(false);
            setReservationToCancel(null);
            await fetchReservations();
        } catch (err: any) {
            alert(err.message || "Error al cancelar la reserva.");
        } finally {
            setCancellingId(null);
        }
    };

    //  Handler para abrir el modal al hacer clic en "Modificar"
    const handleEdit = (reservation: ReservationDetail) => {
        setEditingReservation(reservation);
    };

    // Handler para recargar datos tras una edición exitosa
    const handleUpdateSuccess = () => {
        // Podrías mostrar un toast/alerta aquí
        fetchReservations();
    };

    if (isLoading) {
        return <div className="p-8 text-center">Cargando tus reservas...</div>;
    }

    if (error) {
        return <div className="p-8 text-center text-red-600">{error}</div>;
    }

    return (
        <main className="container mx-auto p-6 lg:p-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                    Mis Reservas de Salas de Estudio
                </h1>
            </header>

            <div className="space-y-12">
                {/* Sección: Reserva Actual */}
                <section>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Reserva Actual</h2>
                    {current ? (
                        <ReservationCard
                            reservation={current}
                            onCancel={handleRequestCancel}
                            onEdit={handleEdit}
                            isCancelling={cancellingId === current.id}
                            layout="horizontal"
                            showActions={true}
                        />
                    ) : (
                        <p className="text-gray-600">No tienes ninguna reserva en curso.</p>
                    )}
                </section>

                {/* Sección: Reservas Futuras */}
                <section>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Reservas Futuras</h2>
                    {future.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {future.map(res => (
                                <ReservationCard
                                    key={res.id}
                                    reservation={res}
                                    onCancel={handleRequestCancel}
                                    onEdit={handleEdit}
                                    isCancelling={cancellingId === res.id}
                                    layout="vertical"
                                    showActions={true}
                                />
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-600">No tienes reservas futuras.</p>
                    )}
                </section>

                {/* Sección: Reservas Pasadas */}
                <section>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Reservas Pasadas</h2>
                    {past.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {past.map(res => (
                                <ReservationCard
                                    key={res.id}
                                    reservation={res}
                                    onCancel={() => {}}
                                    isCancelling={false}
                                    layout="vertical"
                                    showActions={false}
                                />
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-600">No tienes reservas pasadas.</p>
                    )}
                </section>
            </div>
            {/* Renderizar el Modal Condicionalmente */}
            {editingReservation && (
                <EditReservationModal
                    isOpen={!!editingReservation}
                    onClose={() => setEditingReservation(null)}
                    reservation={editingReservation}
                    onUpdateSuccess={handleUpdateSuccess}
                />
            )}
            {/* MODAL DE CONFIRMACIÓN DE CANCELACIÓN */}
            <ConfirmModal
                isOpen={isCancelModalOpen}
                onClose={() => setIsCancelModalOpen(false)}
                onConfirm={handleConfirmCancel}
                title="Cancelar Reserva"
                isLoading={!!cancellingId} // Muestra loading si cancellingId tiene valor
                showGoogleCalendarCheck={false}
                loadingText= "Cargando..."
            >
                <div className="flex flex-col gap-2">
                    <p>
                        ¿Estás seguro de que deseas cancelar tu reserva en la sala
                        <strong className="text-gray-900"> {reservationToCancel?.room.name}</strong>?
                    </p>
                    <p className="text-sm text-gray-500">
                        Esta acción liberará el horario para otros estudiantes inmediatamente.
                    </p>
                </div>
            </ConfirmModal>
        </main>
    );
}