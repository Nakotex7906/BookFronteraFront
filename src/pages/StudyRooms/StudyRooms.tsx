import { useEffect, useState } from 'react';
import { CheckCircleIcon, MagnifyingGlassIcon, DoorOpenIcon, SmileySadIcon } from "@phosphor-icons/react";
import { AvailabilityApi } from "../../services/AvailabilityApi";
import type { DailyAvailabilityResponse } from "../../types/schedule";
import type { Room } from "../../types/room";
import { CustomSelect } from "../../components/UI/CustomSelect";
import { CustomDatePicker } from "../../components/UI/CustomDatePicker";

export default function StudyRooms() {
    // --- ESTADOS ---
    const [data, setData] = useState<DailyAvailabilityResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Filtros seleccionados
    const [filters, setFilters] = useState({
        date: new Date().toISOString().slice(0, 10), // 'YYYY-MM-DD'
        slotId: 'Cualquiera',
        capacity: 'Cualquiera',
        resource: 'Cualquiera'
    });

    // Resultados filtrados
    const [results, setResults] = useState<Room[]>([]);
    const [hasSearched, setHasSearched] = useState(false);

    // --- CARGAR DATOS AL INICIO O AL CAMBIAR FECHA ---
    useEffect(() => {
        let isMounted = true;
        const loadData = async () => {
            setIsLoading(true);
            setError(null);
            setHasSearched(false);
            try {
                // Llamamos a la API para obtener  el día
                const response = await AvailabilityApi.getAvailability(filters.date);
                if (isMounted) {
                    setData(response);
                    setResults([]); // Empezamos vacío hasta que den a "Buscar"
                }
            } catch (err: any) {
                if (isMounted) setError(err.message || "Error al cargar disponibilidad.");
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };
        loadData();
        return () => { isMounted = false; };
    }, [filters.date]);

    // --- MANEJO DE FILTROS ---
    const handleFilterUpdate = (name: string, value: string) => {
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    // --- LÓGICA DE BÚSQUEDA (FILTRADO EN MEMORIA) ---
    const handleSearch = () => {
        if (!data) return;
        setHasSearched(true);

        const { slotId, capacity, resource } = filters;

        const filtered = data.rooms.filter(room => {
            // 1. Filtro de Capacidad
            if (capacity !== 'Cualquiera') {
                const minCap = parseInt(capacity, 10);
                if (room.capacity < minCap) return false;
            }

            // 2. Filtro de Recursos
            if (resource !== 'Cualquiera') {
                // room.equipment es string[], verificamos si incluye el recurso
                const hasResource = room.equipment?.some(eq =>
                    eq.toLowerCase().includes(resource.toLowerCase())
                );
                if (!hasResource) return false;
            }

            // 3. Filtro de Disponibilidad (Hora)
            if (slotId !== 'Cualquiera') {
                // Buscamos en la matriz de disponibilidad si esta sala está libre en ese bloque
                // Nota: convertimos roomId a String para asegurar coincidencia
                const availabilityEntry = data.availability.find(
                    a => String(a.roomId) === String(room.id) && a.slotId === slotId
                );

                // Si no existe entrada o available es false, descartamos la sala
                if (!availabilityEntry || !availabilityEntry.available) {
                    return false;
                }
            }

            return true;
        });

        setResults(filtered);
    };

    // --- OPCIONES PARA LOS SELECTS ---
    const capacityOptions = [
        { value: "Cualquiera", label: "Cualquiera" },
        { value: "2", label: "2 Personas" },
        { value: "4", label: "4 Personas" },
        { value: "6", label: "6 Personas" },
        { value: "10", label: "10+ Personas" },
    ];

    const resourceOptions = [
        { value: "Cualquiera", label: "Cualquiera" },
        { value: "Pizarra", label: "Pizarra" },
        { value: "Proyector", label: "Proyector" },
        { value: "Mesas Grupales", label: "Mesas Grupales" },
        { value: "Pc", label: "PC" },
    ];

    // Las opciones de hora vienen de la API (data.slots)
    const timeOptions = [
        { value: "Cualquiera", label: "Cualquiera" },
        ...(data?.slots.map(s => ({ value: s.id, label: s.label })) || [])
    ];

    return (
        <main className="min-h-screen bg-[#f4f6f9] p-6 lg:p-8 font-sans">
            <div className="mx-auto max-w-5xl">

                {/* Título */}
                <header className="mb-8">
                    <h1 className="text-3xl font-extrabold text-[#1a1a1a] tracking-tight">
                        Encuentra una Sala de Estudio
                    </h1>
                </header>

                {/* --- TARJETA DE FILTROS --- */}
                <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-10 relative z-20 transition-all duration-300 hover:shadow-md">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">

                        {/* 1. Día (Tu componente CustomDatePicker) */}
                        <div className="relative z-50">
                            <CustomDatePicker
                                label="Día"
                                value={filters.date}
                                onChange={(val) => handleFilterUpdate('date', val)}
                            />
                        </div>

                        {/* 2. Hora (Tu componente CustomSelect) */}
                        <div className="relative z-40">
                            <CustomSelect
                                label="Hora"
                                value={filters.slotId}
                                onChange={(val) => handleFilterUpdate('slotId', val)}
                                options={timeOptions}
                                disabled={isLoading || !data}
                            />
                        </div>

                        {/* 3. Capacidad */}
                        <div className="relative z-30">
                            <CustomSelect
                                label="Capacidad"
                                value={filters.capacity}
                                onChange={(val) => handleFilterUpdate('capacity', val)}
                                options={capacityOptions}
                            />
                        </div>

                        {/* 4. Recursos */}
                        <div className="relative z-20">
                            <CustomSelect
                                label="Recursos"
                                value={filters.resource}
                                onChange={(val) => handleFilterUpdate('resource', val)}
                                options={resourceOptions}
                            />
                        </div>
                    </div>

                    {/* Botón Buscar */}
                    <div className="flex justify-end pt-2 border-t border-gray-50">
                        <button
                            onClick={handleSearch}
                            disabled={isLoading || !data}
                            className="
                                flex items-center gap-2
                                bg-[#0a3fa6] text-white font-semibold text-sm
                                py-3 px-8 rounded-lg
                                transition-all duration-200
                                hover:bg-[#072d78] hover:shadow-lg hover:-translate-y-0.5
                                active:translate-y-0 active:shadow-none
                                disabled:opacity-50 disabled:cursor-not-allowed
                            "
                        >
                            {isLoading ? (
                                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"/>
                            ) : (
                                <MagnifyingGlassIcon size={18} weight="bold" />
                            )}
                            Buscar
                        </button>
                    </div>

                    {error && (
                        <div className="mt-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm text-center border border-red-100">
                            {error}
                        </div>
                    )}
                </section>

                {/* --- RESULTADOS --- */}
                <section>
                    <h2 className="text-xl font-bold text-[#1a1a1a] mb-6 flex items-center gap-2">
                        Resultados de Búsqueda
                        {results.length > 0 && (
                            <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                                {results.length}
                            </span>
                        )}
                    </h2>

                    <div className="space-y-4 relative z-0 pb-12">
                        {results.length > 0 ? (
                            results.map((room, index) => (
                                // ANIMACIÓN: Usamos delay basado en el índice para efecto cascada
                                <div
                                    key={room.id}
                                    className="
                                        bg-white rounded-xl p-5
                                        border border-transparent shadow-[0_2px_8px_rgba(0,0,0,0.04)]
                                        flex flex-col md:flex-row items-center justify-between gap-4
                                        transition-all duration-500 ease-out
                                        hover:border-blue-100 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:-translate-y-1
                                        animate-in fade-in slide-in-from-bottom-4 fill-mode-backwards
                                    "
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    {/* Info Izquierda */}
                                    <div className="flex items-center gap-5 flex-1 w-full">
                                        {/* Icono Sala */}
                                        <div className="h-14 w-14 min-w-[56px] rounded-xl bg-[#eef6ff] flex items-center justify-center text-[#0a3fa6]">
                                            <DoorOpenIcon size={28} weight="duotone" />
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900 mb-1">
                                                {room.name}
                                            </h3>
                                            <div className="flex flex-wrap gap-y-1 gap-x-3 text-sm text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <span className="font-medium text-gray-700">Capacidad:</span> {room.capacity}
                                                </span>
                                                <span className="hidden md:inline text-gray-300">|</span>
                                                <span className="flex items-center gap-1">
                                                    <span className="font-medium text-gray-700">Recursos:</span> {room.equipment?.join(", ") || "Ninguno"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Estado Derecha */}
                                    <div className="flex items-center justify-between w-full md:w-auto border-t md:border-t-0 border-gray-100 pt-4 md:pt-0 mt-2 md:mt-0">
                                        <div className="flex items-center gap-2 text-green-600 font-semibold text-sm bg-green-50 px-4 py-2 rounded-full">
                                            <CheckCircleIcon size={18} weight="fill" />
                                            <span>Disponible</span>
                                        </div>

                                        {/* Botón Reservar (Opcional, si quieres acción directa aquí) */}
                                        {/* <button className="ml-4 text-blue-600 font-medium hover:underline text-sm">
                                            Reservar
                                        </button>
                                        */}
                                    </div>
                                </div>
                            ))
                        ) : (
                            // ESTADO VACÍO
                            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-4 text-gray-400">
                                    {hasSearched ? (
                                        <SmileySadIcon size={32} />
                                    ) : (
                                        <MagnifyingGlassIcon size={32} />
                                    )}
                                </div>
                                <h3 className="text-lg font-medium text-gray-900">
                                    {hasSearched ? "No se encontraron salas" : "Realiza una búsqueda"}
                                </h3>
                                <p className="text-gray-500 mt-1 max-w-md mx-auto">
                                    {hasSearched
                                        ? "Intenta cambiar los filtros de hora o capacidad para encontrar resultados."
                                        : "Selecciona una fecha y hora para ver las salas disponibles."
                                    }
                                </p>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </main>
    );
}