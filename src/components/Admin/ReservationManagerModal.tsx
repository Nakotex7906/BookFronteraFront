import { useEffect, useState } from 'react';
import { XIcon, TrashIcon, CalendarBlankIcon, UserIcon, ClockIcon, SmileySadIcon } from '@phosphor-icons/react';
import { AvailabilityApi } from '../../services/AvailabilityApi';
import type { ReservationDetail } from '../../types/schedule';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    roomId: number | null;
    roomName: string;
}

export default function ReservationManagerModal({ isOpen, onClose, roomId, roomName }: Props) {
    const [reservations, setReservations] = useState<ReservationDetail[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Cargar reservas cuando se abre el modal
    useEffect(() => {
        if (isOpen && roomId) {
            loadReservations();
        }
    }, [isOpen, roomId]);

    const loadReservations = async () => {
        if (!roomId) return;
        setIsLoading(true);
        try {
            const data = await AvailabilityApi.getReservationsByRoom(roomId);
            setReservations(data);
        } catch (error) {
            console.error("Error cargando reservas:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("¿Seguro que deseas eliminar esta reserva? Esta acción liberará el horario.")) return;

        try {
            // El backend ya permite esto si eres ADMIN
            await AvailabilityApi.cancelReservation(id);
            // Recargamos la lista para ver los cambios
            loadReservations();
        } catch (error) {
            alert("Error al eliminar la reserva. Verifica tu conexión.");
        }
    };

    // Helpers de formato
    const formatDate = (iso: string) => new Date(iso).toLocaleDateString('es-CL', { weekday: 'short', day: 'numeric', month: 'short' });
    const formatTime = (start: string, end: string) => {
        const s = new Date(start).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });
        const e = new Date(end).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });
        return `${s} - ${e}`;
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in fade-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center shrink-0">
                    <div>
                        <h3 className="text-lg font-bold text-gray-800">Gestionar Reservas</h3>
                        <p className="text-sm text-gray-500 font-medium">{roomName}</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full transition-colors">
                        <XIcon size={20} weight="bold" />
                    </button>
                </div>

                {/* Lista de Reservas */}
                <div className="overflow-y-auto p-6 flex-1 bg-[#f9fafb]">
                    {isLoading ? (
                        <div className="flex justify-center py-10">
                            <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                        </div>
                    ) : reservations.length === 0 ? (
                        <div className="text-center py-12 flex flex-col items-center opacity-60">
                            <SmileySadIcon size={48} className="text-gray-300 mb-3" />
                            <p className="text-gray-500 font-medium">No hay reservas activas para esta sala.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {reservations.map((res) => (
                                <div key={res.id} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all">

                                    {/* Info Reserva */}
                                    <div className="flex flex-col gap-1.5">
                                        <div className="flex items-center gap-2 text-sm font-bold text-[#0a3fa6]">
                                            <CalendarBlankIcon weight="fill" className="text-blue-500"/>
                                            <span className="capitalize">{formatDate(res.startAt)}</span>
                                            <span className="text-gray-300 mx-1">|</span>
                                            <ClockIcon weight="fill" className="text-blue-500"/>
                                            {formatTime(res.startAt, res.endAt)}
                                        </div>

                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <div className="flex items-center gap-1.5 bg-gray-100 px-2 py-1 rounded-md">
                                                <UserIcon weight="bold" size={14}/>
                                                <span className="font-semibold text-gray-700">{res.user.nombre}</span>
                                            </div>
                                            <span className="text-xs text-gray-400">({res.user.email})</span>
                                        </div>
                                    </div>

                                    {/* Botón Eliminar */}
                                    <button
                                        onClick={() => handleDelete(res.id)}
                                        className="group p-2.5 text-red-500 bg-red-50 hover:bg-red-500 hover:text-white rounded-xl transition-all shadow-sm"
                                        title="Cancelar y eliminar reserva"
                                    >
                                        <TrashIcon size={20} weight="bold" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}