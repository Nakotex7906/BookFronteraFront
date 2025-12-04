import { useEffect, useState, useMemo } from 'react';
import { CheckCircleIcon, MagnifyingGlassIcon, DoorOpenIcon, SmileySadIcon } from "@phosphor-icons/react";
import { AvailabilityApi } from "../../services/AvailabilityApi";
import type { DailyAvailabilityResponse } from "../../types/schedule";
import type { Room } from "../../types/room";
import { CustomSelect } from "../../components/UI/CustomSelect";
import { CustomDatePicker } from "../../components/UI/CustomDatePicker";

// Helper para obtener string YYYY-MM-DD local
const getLocalISOString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

export default function StudyRooms() {
    const [data, setData] = useState<DailyAvailabilityResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Filtros seleccionados
    const [filters, setFilters] = useState({
        date: getLocalISOString(new Date()), // Hoy
        slotId: 'Cualquiera',
        capacity: 'Cualquiera',
        resource: 'Cualquiera'
    });

    const [results, setResults] = useState<Room[]>([]);
    const [hasSearched, setHasSearched] = useState(false);

    // CÁLCULO DE FECHAS (Lógica de Negocio) ---
    const { minDate, maxDate } = useMemo(() => {
        const today = new Date();
        const min = getLocalISOString(today);

        // Calcular 7 días hábiles a futuro
        let businessDaysAdded = 0;
        const pointerDate = new Date(today);

        // Sumamos hasta encontrar 7 días hábiles (Lunes a Viernes)
        while (businessDaysAdded < 7) {
            pointerDate.setDate(pointerDate.getDate() + 1);
            const day = pointerDate.getDay();
            if (day !== 0 && day !== 6) { // Si no es Domingo (0) ni Sábado (6)
                businessDaysAdded++;
            }
        }

        const max = getLocalISOString(pointerDate);
        return { minDate: min, maxDate: max };
    }, []);

    // CARGAR DATOS
    useEffect(() => {
        let isMounted = true;
        const loadData = async () => {
            setIsLoading(true);
            if(filters.slotId !== 'Cualquiera') setError(null);
            setHasSearched(false);

            try {
                const response = await AvailabilityApi.getAvailability(filters.date);
                if (isMounted) {
                    setData(response);
                    setResults([]);
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

    // MANEJO DE FILTROS
    const handleFilterUpdate = (name: string, value: string) => {
        setFilters(prev => ({ ...prev, [name]: value }));
        // Limpiamos el error si el usuario cambia algo
        if (error) setError(null);
    };

    // LÓGICA DE BÚSQUEDA
    const handleSearch = () => {
        if (!data) return;

        // VALIDACIÓN: Hora obligatoria
        if (filters.slotId === 'Cualquiera') {
            setError(" Debes seleccionar una hora específica para buscar.");
            setHasSearched(false); // Evita mostrar "No se encontraron salas"
            return;
        }

        setError(null);
        setHasSearched(true);

        const { slotId, capacity, resource } = filters;

        const filtered = data.rooms.filter(room => {
            // Filtro Capacidad
            if (capacity !== 'Cualquiera') {
                const minCap = parseInt(capacity, 10);
                if (room.capacity < minCap) return false;
            }

            // Filtro Recursos
            if (resource !== 'Cualquiera') {
                const hasResource = room.equipment?.some(eq =>
                    eq.toLowerCase().includes(resource.toLowerCase())
                );
                if (!hasResource) return false;
            }

            // Filtro Disponibilidad (Ya validamos que slotId no es 'Cualquiera')
            const availabilityEntry = data.availability.find(
                a => String(a.roomId) === String(room.id) && a.slotId === slotId
            );

            if (!availabilityEntry || !availabilityEntry.available) {
                return false;
            }

            return true;
        });

        setResults(filtered);
    };

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

    const timeOptions = [
        { value: "Cualquiera", label: "Seleccionar hora..." }, // Texto más explicativo
        ...(data?.slots.map(s => ({ value: s.id, label: s.label })) || [])
    ];

    return (
        <main className="min-h-screen bg-[#f4f6f9] p-6 lg:p-8 font-sans">
            <div className="mx-auto max-w-5xl">
                <header className="mb-8">
                    <h1 className="text-3xl font-extrabold text-[#1a1a1a] tracking-tight">
                        Encuentra una Sala de Estudio
                    </h1>
                </header>

                <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-10 relative z-20 transition-all duration-300 hover:shadow-md">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">

                        {/* Día con RESTRICCIONES */}
                        <div className="relative z-50">
                            <CustomDatePicker
                                label="Día (Lun-Vie)"
                                value={filters.date}
                                onChange={(val) => handleFilterUpdate('date', val)}
                                minDate={minDate}         // No antes de hoy
                                maxDate={maxDate}         // Máximo 7 días hábiles
                                disableWeekends={true}    // Bloquear Sáb/Dom
                            />
                        </div>

                        {/* 2. Hora */}
                        <div className="relative z-40">
                            <CustomSelect
                                label="Hora *"
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

                    {/* MENSAJE DE ERROR O VALIDACIÓN */}
                    {error && (
                        <div className="mt-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm font-medium text-center border border-red-100 flex items-center justify-center gap-2 animate-in fade-in slide-in-from-top-1">
                            <SmileySadIcon size={20} />
                            {error}
                        </div>
                    )}
                </section>

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
                                    <div className="flex items-center gap-5 flex-1 w-full">
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

                                    <div className="flex items-center justify-between w-full md:w-auto border-t md:border-t-0 border-gray-100 pt-4 md:pt-0 mt-2 md:mt-0">
                                        <div className="flex items-center gap-2 text-green-600 font-semibold text-sm bg-green-50 px-4 py-2 rounded-full">
                                            <CheckCircleIcon size={18} weight="fill" />
                                            <span>Disponible</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-4 text-gray-400">
                                    {hasSearched ? <SmileySadIcon size={32} /> : <MagnifyingGlassIcon size={32} />}
                                </div>
                                <h3 className="text-lg font-medium text-gray-900">
                                    {hasSearched ? "No se encontraron salas" : "Realiza una búsqueda"}
                                </h3>
                                <p className="text-gray-500 mt-1 max-w-md mx-auto">
                                    {hasSearched
                                        ? "Intenta cambiar los filtros de capacidad o recursos."
                                        : "Selecciona una fecha y una hora obligatoria para ver las salas disponibles."
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