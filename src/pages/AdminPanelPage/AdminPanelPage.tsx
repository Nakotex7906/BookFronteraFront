import { useEffect, useState } from 'react';
import {
    MagnifyingGlassIcon,
    PlusIcon,
    PencilSimpleLineIcon,
    TrashIcon,
    MonitorIcon,
    ChalkboardIcon,
    WarningCircleIcon,
    DesktopIcon,
    EyeIcon,
    CalendarBlankIcon
} from '@phosphor-icons/react';
import { RoomApi, type Room, type RoomDto } from '../../services/RoomApi';
import RoomModal from '../../components/Admin/RoomModal';
import ImageModal from '../../components/Admin/ImageModal';
import ReservationManagerModal from '../../components/Admin/ReservationManagerModal';

const ResourceIcon = ({ name }: { name: string }) => {
    const n = name.toLowerCase();
    if (n.includes('proyector') || n.includes('pantalla')) return <MonitorIcon size={16} className="text-gray-500"/>;
    if (n.includes('pc') || n.includes('computador')) return <DesktopIcon size={16} className="text-gray-500"/>;
    if (n.includes('pizarra')) return <ChalkboardIcon size={16} className="text-gray-500"/>;
    return <WarningCircleIcon size={16} className="text-gray-300"/>;
}

const AdminPanelPage = () => {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Estados para Modales de Creación/Edición y Vista de Imagen
    const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
    const [editingRoom, setEditingRoom] = useState<RoomDto | null>(null);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [viewingImageUrl, setViewingImageUrl] = useState<string | undefined>(undefined);

    // GESTIÓN DE RESERVAS
    const [isResManagerOpen, setIsResManagerOpen] = useState(false);
    const [selectedRoomForRes, setSelectedRoomForRes] = useState<{id: number, name: string} | null>(null);

    const loadRooms = async () => {
        setIsLoading(true);
        try {
            const data = await RoomApi.getAll();
            setRooms(data);
        } catch (error) {
            console.error("Error cargando salas:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadRooms();
    }, []);

    const filteredRooms = rooms.filter(r =>
        r.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCreate = () => {
        setEditingRoom(null);
        setIsRoomModalOpen(true);
    };

    const handleEdit = (room: Room) => {
        setEditingRoom({
            id: room.id,
            name: room.name,
            capacity: room.capacity,
            floor: room.floor,
            equipment: room.equipment
        });
        setIsRoomModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("¿Estás seguro de eliminar esta sala? Esta acción es irreversible.")) {
            try {
                await RoomApi.delete(id);
                loadRooms();
            } catch (error) {
                alert("Error al eliminar la sala.");
            }
        }
    };

    const handleSave = async (roomData: RoomDto, image?: File | null) => {
        try {
            if (roomData.id) {
                await RoomApi.update(roomData.id, roomData, image);
            } else {
                await RoomApi.create(roomData, image);
            }
            await loadRooms();
        } catch (error) {
            console.error("Error al guardar:", error);
            alert("Error al guardar la sala.");
        }
    };

    const handleViewImage = (url: string) => {
        setViewingImageUrl(url);
        setIsImageModalOpen(true);
    };

    const handleCloseImageModal = () => {
        setIsImageModalOpen(false);
        setViewingImageUrl(undefined);
    };

    // ABRIR GESTOR DE RESERVAS
    const handleManageReservations = (room: Room) => {
        setSelectedRoomForRes({ id: room.id, name: room.name });
        setIsResManagerOpen(true);
    };

    return (
        <main className="min-h-screen bg-[#f4f6f9] p-6 md:p-12 font-sans text-gray-800">
            <div className="mx-auto max-w-6xl">

                {/* HEADER */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-[#1f2937] mb-2 tracking-tight">
                            Gestión de Salas
                        </h1>
                        <p className="text-gray-500 text-lg">
                            Panel de administración de espacios físicos.
                        </p>
                    </div>
                    <button
                        onClick={handleCreate}
                        className="flex items-center gap-2 bg-[#0a3fa6] text-white px-6 py-3 rounded-xl hover:bg-[#083285] transition-all hover:-translate-y-1 shadow-lg shadow-blue-900/10 font-bold"
                    >
                        <PlusIcon size={20} weight="bold"/>
                        Nueva Sala
                    </button>
                </div>

                {/* SEARCH */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex items-center">
                    <div className="relative w-full md:w-96">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" weight="bold" />
                        </div>
                        <input
                            type="text"
                            placeholder="Buscar por nombre..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none font-medium text-gray-700"
                        />
                    </div>
                </div>

                {/* TABLE */}
                <div className="border border-gray-200 rounded-2xl shadow-sm overflow-hidden bg-white">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="py-5 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Nombre</th>
                                <th className="py-5 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">Imagen</th>
                                <th className="py-5 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">Capacidad</th>
                                <th className="py-5 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">Piso</th>
                                <th className="py-5 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Equipamiento</th>
                                <th className="py-5 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Acciones</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-gray-500 font-medium animate-pulse">
                                        Cargando información...
                                    </td>
                                </tr>
                            ) : filteredRooms.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-gray-500">
                                        No se encontraron salas registradas.
                                    </td>
                                </tr>
                            ) : (
                                filteredRooms.map((room) => (
                                    <tr key={room.id} className="hover:bg-blue-50/30 transition-colors group">
                                        <td className="py-5 px-6">
                                            <span className="font-bold text-gray-800 text-[15px]">{room.name}</span>
                                        </td>
                                        <td className="py-5 px-6 text-center">
                                            {room.imageUrl ? (
                                                <button
                                                    onClick={() => handleViewImage(room.imageUrl!)}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-bold transition-colors border border-blue-100"
                                                    title="Ver imagen en grande"
                                                >
                                                    <EyeIcon size={16} weight="bold" />
                                                    Ver
                                                </button>
                                            ) : (
                                                <span className="text-gray-400 text-xs italic">Sin imagen</span>
                                            )}
                                        </td>
                                        <td className="py-5 px-6 text-center">
                                                <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-gray-100 text-gray-700 font-bold text-xs">
                                                    {room.capacity}
                                                </span>
                                        </td>
                                        <td className="py-5 px-6 text-center text-gray-500 font-medium">
                                            {room.floor}°
                                        </td>
                                        <td className="py-5 px-6">
                                            <div className="flex flex-wrap gap-2">
                                                {room.equipment && room.equipment.length > 0 ? (
                                                    room.equipment.map((res, idx) => (
                                                        <span key={idx} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-gray-200 text-gray-600 text-xs font-medium shadow-sm">
                                                                <ResourceIcon name={res}/>
                                                            {res}
                                                            </span>
                                                    ))
                                                ) : (
                                                    <span className="text-gray-300 text-xs italic">Sin equipamiento</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-5 px-6 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">

                                                {/*BOTÓN GESTIONAR RESERVAS */}
                                                <button
                                                    onClick={() => handleManageReservations(room)}
                                                    className="p-2 text-purple-600 bg-purple-50 hover:bg-purple-600 hover:text-white rounded-lg transition-colors shadow-sm"
                                                    title="Ver y gestionar reservas"
                                                >
                                                    <CalendarBlankIcon size={18} weight="bold" />
                                                </button>

                                                <button
                                                    onClick={() => handleEdit(room)}
                                                    className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                                                    title="Editar datos"
                                                >
                                                    <PencilSimpleLineIcon size={18} weight="bold" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(room.id)}
                                                    className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                                                    title="Eliminar sala"
                                                >
                                                    <TrashIcon size={18} weight="bold" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <RoomModal
                isOpen={isRoomModalOpen}
                onClose={() => setIsRoomModalOpen(false)}
                onSave={handleSave}
                initialData={editingRoom}
            />

            <ImageModal
                isOpen={isImageModalOpen}
                onClose={handleCloseImageModal}
                imageUrl={viewingImageUrl}
            />

            {/* MODAL DE RESERVAS */}
            <ReservationManagerModal
                isOpen={isResManagerOpen}
                onClose={() => setIsResManagerOpen(false)}
                roomId={selectedRoomForRes?.id ?? null}
                roomName={selectedRoomForRes?.name ?? ''}
            />
        </main>
    );
};

export default AdminPanelPage;