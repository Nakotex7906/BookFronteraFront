import { MagnifyingGlassIcon } from '@phosphor-icons/react';

// Datos Mock basados en tu imagen
const mockRooms = [
    { id: 1, name: 'Sala de Estudio A', capacity: 10, resources: 'Proyector, Pizarra', status: 'active' },
    { id: 2, name: 'Sala de Estudio B', capacity: 6, resources: 'Pizarra', status: 'disabled', disabledUntil: '25/12/2024' },
    { id: 3, name: 'Sala de Estudio C', capacity: 12, resources: 'Proyector, Sonido', status: 'active' },
    { id: 4, name: 'Sala de Estudio D', capacity: 8, resources: 'Ninguno', status: 'active' },
    { id: 5, name: 'Sala de Estudio E', capacity: 4, resources: 'Pizarra', status: 'active' },
];

const AdminPanelPage = () => {
    return (
        <main className="min-h-screen bg-white p-6 md:p-12 font-sans text-gray-800">
            <div className="mx-auto max-w-6xl">

                {/* HEADER */}
                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold text-[#1f2937] mb-2 tracking-tight">
                        Gestión de Salas
                    </h1>
                    <p className="text-gray-500">
                        Administra las salas de estudio disponibles para los estudiantes.
                    </p>
                </div>

                {/* BARRA DE BÚSQUEDA */}
                <div className="mb-8 relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" weight="bold" />
                    </div>
                    <input
                        type="text"
                        placeholder="Buscar salas por nombre o estado"
                        className="
                            w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200
                            bg-white text-gray-700 shadow-sm
                            focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500
                            transition-all duration-200
                        "
                    />
                </div>

                {/* TABLA */}
                <div className="border border-gray-100 rounded-2xl shadow-sm overflow-hidden bg-white">
                    <table className="w-full text-left border-collapse">
                        <thead>
                        <tr className="bg-[#f9fafb] border-b border-gray-100">
                            <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Nombre</th>
                            <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Capacidad</th>
                            <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Estado</th>
                            <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Recursos</th>
                            <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Acciones</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                        {mockRooms.map((room) => (
                            <tr key={room.id} className="hover:bg-gray-50/50 transition-colors group">
                                {/* Nombre */}
                                <td className="py-5 px-6 font-bold text-gray-800">
                                    {room.name}
                                </td>

                                {/* Capacidad */}
                                <td className="py-5 px-6 text-gray-600">
                                    {room.capacity}
                                </td>

                                {/* Estado */}
                                <td className="py-5 px-6">
                                    {room.status === 'active' ? (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                                                Disponible
                                            </span>
                                    ) : (
                                        <div className="flex flex-col items-start">
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800 mb-1">
                                                    Deshabilitada
                                                </span>
                                            <span className="text-[10px] text-gray-400 pl-1">
                                                    Hasta {room.disabledUntil}
                                                </span>
                                        </div>
                                    )}
                                </td>

                                {/* Recursos */}
                                <td className="py-5 px-6 text-gray-500 text-sm">
                                    {room.resources}
                                </td>

                                {/* Acciones */}
                                <td className="py-5 px-6 text-right">
                                    <div className="flex items-center justify-end gap-4 text-sm font-semibold">
                                        <button className="text-blue-600 hover:text-blue-800 transition-colors">
                                            Editar
                                        </button>
                                        <button className={`${room.status === 'active' ? 'text-yellow-600 hover:text-yellow-800' : 'text-green-600 hover:text-green-800'} transition-colors`}>
                                            {room.status === 'active' ? 'Deshabilitar' : 'Habilitar'}
                                        </button>
                                        <button className="text-red-500 hover:text-red-700 transition-colors">
                                            Eliminar
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    );
};

export default AdminPanelPage;