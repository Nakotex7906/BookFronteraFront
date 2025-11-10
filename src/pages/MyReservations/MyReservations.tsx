import { useEffect, useState } from "react";
import { AvailabilityApi } from "../../services/AvailabilityApi";
import type { ReservationDetail } from "../../types/schedule";
import { ReservationCard } from "../../components/ReservationCard/ReservationCard";

export default function MyReservations() {
    // Estado para cada lista
    const [current, setCurrent] = useState<ReservationDetail | null>(null);
    const [future, setFuture] = useState<ReservationDetail[]>([]);
    const [past, setPast] = useState<ReservationDetail[]>([]);

    // Estados de UI
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [cancellingId, setCancellingId] = useState<number | null>(null);

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
    const handleCancel = async (id: number) => {
        setCancellingId(id);
        try {
            await AvailabilityApi.cancelReservation(id);
            await fetchReservations(); // Recargar todo
        } catch (err: any) { // <-- ¡AQUÍ ESTABA EL ERROR!
            // Faltaban estas llaves { }
            alert(err.message || "Error al cancelar la reserva.");
        } finally {
            setCancellingId(null);
        }
    };

    if (isLoading) {
        return <div className="p-8 text-center">Cargando tus reservas...</div>;
    }

    if (error) {
        return <div className="p-8 text-center text-red-600">{error}</div>;
    }

    // --- NUEVO LAYOUT (Basado en HTML de Stitch) ---
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
                            onCancel={handleCancel}
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
                                    onCancel={handleCancel}
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

                {/* Sección: Reservas Pasadas (Mantenemos esta sección) */}
                <section>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Reservas Pasadas</h2>
                    {past.length > 0 ? (
                        <div className="space-y-4">
                            {past.map(res => (
                                <ReservationCard
                                    key={res.id}
                                    reservation={res}
                                    onCancel={() => {}}
                                    isCancelling={false}
                                    layout="default"
                                    showActions={false}
                                />
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-600">No tienes reservas pasadas.</p>
                    )}
                </section>
            </div>
        </main>
    );
}