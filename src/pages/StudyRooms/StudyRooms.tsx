import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from "react-router-dom";
import { CheckCircleIcon, MagnifyingGlassIcon, DoorOpenIcon, SmileySadIcon } from "@phosphor-icons/react";
import { AvailabilityApi } from "../../services/AvailabilityApi";
import type { DailyAvailabilityResponse } from "../../types/schedule";
import type { Room } from "../../types/room";
import { CustomSelect } from "../../components/UI/CustomSelect";
import { CustomDatePicker } from "../../components/UI/CustomDatePicker";
import { ConfirmModal } from "../../components/ConfirmModal/ConfirmModal";
import { useAuth } from "../../context/AuthContext";

// Helper para obtener string YYYY-MM-DD local
const getLocalISOString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

export default function StudyRooms() {
    const navigate = useNavigate();
    const { user, openLoginModal } = useAuth();

    // ESTADOS DE DATOS
    const [data, setData] = useState<DailyAvailabilityResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // ESTADOS DEL MODAL DE RESERVA
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [isBooking, setIsBooking] = useState(false);
    const [bookingError, setBookingError] = useState<string | null>(null);
    const [addToGoogle, setAddToGoogle] = useState(true);

    // Estado para "Reservar a nombre de otro" (Admin)
    const [behalfEmail, setBehalfEmail] = useState("");

    // Filtros seleccionados
    const [filters, setFilters] = useState({
        date: getLocalISOString(new Date()), // Hoy
        slotId: 'Cualquiera',
        capacity: 'Cualquiera',
        resource: 'Cualquiera'
    });

    const [results, setResults] = useState<Room[]>([]);
    const [hasSearched, setHasSearched] = useState(false);

    // CÁLCULO DE FECHAS
    const { minDate, maxDate } = useMemo(() => {
        const today = new Date();
        const min = getLocalISOString(today);
        let businessDaysAdded = 0;
        const pointerDate = new Date(today);
        while (businessDaysAdded < 7) {
            pointerDate.setDate(pointerDate.getDate() + 1);
            const day = pointerDate.getDay();
            if (day !== 0 && day !== 6) businessDaysAdded++;
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

    const handleFilterUpdate = (name: string, value: string) => {
        setFilters(prev => ({ ...prev, [name]: value }));
        if (error) setError(null);
    };

    const handleSearch = () => {
        if (!data) return;

        if (filters.slotId === 'Cualquiera') {
            setError("Debes seleccionar una hora específica para buscar.");
            setHasSearched(false);
            return;
        }

        setError(null);
        setHasSearched(true);

        const { slotId, capacity, resource } = filters;

        const filtered = data.rooms.filter(room => {
            if (capacity !== 'Cualquiera') {
                const minCap = parseInt(capacity, 10);
                if (room.capacity < minCap) return false;
            }
            if (resource !== 'Cualquiera') {
                const hasResource = room.equipment?.some(eq =>
                    eq.toLowerCase().includes(resource.toLowerCase())
                );
                if (!hasResource) return false;
            }
            const availabilityEntry = data.availability.find(
                a => String(a.roomId) === String(room.id) && a.slotId === slotId
            );
            return availabilityEntry && availabilityEntry.available;
        });

        setResults(filtered);
    };

    const handleRoomClick = (room: Room) => {
        if (!user) {
            openLoginModal();
            return;
        }
        setSelectedRoom(room);
        setBookingError(null);
        setIsModalOpen(true);
        setBehalfEmail(""); // Limpiar email al abrir
    };

    // CONFIRMAR RESERVA
    const handleConfirmBooking = async () => {
        if (!selectedRoom || !data) return;

        setIsBooking(true);
        setBookingError(null);

        try {
            const slotInfo = data.slots.find(s => s.id === filters.slotId);
            if (!slotInfo) throw new Error("Horario inválido.");

            const startDateTime = new Date(`${filters.date}T${slotInfo.start}:00`);
            const endDateTime = new Date(`${filters.date}T${slotInfo.end}:00`);

            const startAtISO = startDateTime.toISOString();
            const endAtISO = endDateTime.toISOString();

            // Lógica Dual: Admin reservando para otro vs Reserva Normal
            if (user?.rol === 'ADMIN' && behalfEmail.trim() !== "") {
                await AvailabilityApi.createOnBehalf({
                    roomId: String(selectedRoom.id), // Aseguramos string
                    startAt: startAtISO,
                    endAt: endAtISO,
                    othersEmail: behalfEmail.trim()
                });
            } else {
                await AvailabilityApi.createReservation({
                    roomId: String(selectedRoom.id),
                    startAt: startAtISO,
                    endAt: endAtISO,
                    addToGoogleCalendar: addToGoogle
                });
            }

            const params = new URLSearchParams();
            params.append("room", selectedRoom.name);
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
        setSelectedRoom(null);
        setBookingError(null);
        setBehalfEmail(""); // Limpiar
        setAddToGoogle(true);
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
        { value: "Cualquiera", label: "Seleccionar hora..." },
        ...(data?.slots.map(s => ({ value: s.id, label: s.label })) || [])
    ];

    const slotLabel = data?.slots.find(s => s.id === filters.slotId)?.label || filters.slotId;

    return (
        <main className="min-h-screen bg-[#f4f6f9] p-6 lg:p-8 font-sans">
            <div className="mx-auto max-w-5xl">
                <header className="mb-8">
                    <h1 className="text-3xl font-extrabold text-[#1a1a1a] tracking-tight">
                        Encuentra una Sala de Estudio
                    </h1>
                </header>

                {/* FILTROS */}
                <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-10 relative z-20">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="relative z-50">
                            <CustomDatePicker
                                label="Día (Lun-Vie)"
                                value={filters.date}
                                onChange={(val) => handleFilterUpdate('date', val)}
                                minDate={minDate}
                                maxDate={maxDate}
                                disableWeekends={true}
                            />
                        </div>
                        <div className="relative z-40">
                            <CustomSelect
                                label="Hora *"
                                value={filters.slotId}
                                onChange={(val) => handleFilterUpdate('slotId', val)}
                                options={timeOptions}
                                disabled={isLoading || !data}
                            />
                        </div>
                        <div className="relative z-30">
                            <CustomSelect
                                label="Capacidad"
                                value={filters.capacity}
                                onChange={(val) => handleFilterUpdate('capacity', val)}
                                options={capacityOptions}
                            />
                        </div>
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
                            className="flex items-center gap-2 bg-[#0a3fa6] text-white font-semibold text-sm py-3 px-8 rounded-lg hover:bg-[#072d78] hover:shadow-lg transition-all disabled:opacity-50"
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
                        <div className="mt-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm font-medium text-center border border-red-100 flex items-center justify-center gap-2">
                            <SmileySadIcon size={20} />
                            {error}
                        </div>
                    )}
                </section>

                {/* RESULTADOS */}
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
                                    onClick={() => handleRoomClick(room)}
                                    className="
                                        bg-white rounded-xl p-5
                                        border border-transparent shadow-[0_2px_8px_rgba(0,0,0,0.04)]
                                        flex flex-col md:flex-row items-center justify-between gap-4
                                        transition-all duration-300 ease-out
                                        cursor-pointer
                                        hover:border-[#0a3fa6] hover:ring-1 hover:ring-[#0a3fa6] hover:shadow-md hover:-translate-y-1
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
                                        <div className="flex items-center gap-2 text-[#0a3fa6] font-bold text-sm bg-blue-50 px-4 py-2 rounded-full transition-colors group-hover:bg-[#0a3fa6] group-hover:text-white">
                                            <span>Reservar</span>
                                            <CheckCircleIcon size={18} weight="fill" />
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

            {/* MODAL DE CONFIRMACIÓN */}
            <ConfirmModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onConfirm={handleConfirmBooking}
                title="Confirmar Reserva"
                isLoading={isBooking}
                error={bookingError}
                // Si hay behalfEmail, ocultamos Google Calendar (igual que en Home)
                showGoogleCalendarCheck={!behalfEmail}
                googleCalendarChecked={addToGoogle}
                onGoogleCalendarChange={setAddToGoogle}
            >
                <div className="flex flex-col gap-5">
                    <p>
                        ¿Estás seguro de que quieres reservar la sala
                        <strong> {selectedRoom?.name ?? ''}</strong> para el día
                        <strong> {filters.date} </strong>
                        en el horario
                        <strong> {slotLabel ?? ''}</strong>?
                    </p>

                    {/* SECCIÓN EXCLUSIVA ADMIN */}
                    {user?.rol === 'ADMIN' && (
                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-left animate-in fade-in zoom-in-95">
                            <label className="block text-xs font-bold text-blue-800 uppercase mb-2">
                                Opción Admin: Reservar para estudiante
                            </label>
                            <input
                                type="email"
                                placeholder="ejemplo@ufromail.cl"
                                value={behalfEmail}
                                onChange={(e) => setBehalfEmail(e.target.value)}
                                className="w-full px-3 py-2 border border-blue-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none placeholder:text-blue-300"
                            />
                            <p className="text-[11px] text-blue-600 mt-1.5 leading-tight">
                                * Si dejas este campo vacío, la reserva quedará a tu nombre.
                                <br />
                                * Las reservas a nombre de terceros no se sincronizan con Google Calendar.
                            </p>
                        </div>
                    )}
                </div>
            </ConfirmModal>
        </main>
    );
}