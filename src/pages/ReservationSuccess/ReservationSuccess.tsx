import React from "react";
import { Link } from "react-router-dom";
import { CheckCircleIcon, CalendarCheckIcon, HouseIcon } from "@phosphor-icons/react";
import type { Props } from "../../types/Props.ts";

/**
 * Pantalla de confirmación de reserva exitosa.
 *
 * Muestra los detalles de la reserva recién creada y ofrece opciones de navegación
 * para ir al listado de reservas o volver al inicio.
 *
 * @component
 * @param props - Propiedades del componente (roomId, startISO, endISO).
 */
const ReservationSuccess: React.FC<Props> = ({
                                                 roomId,
                                                 startISO,
                                                 endISO,
                                             }) => {
    // Obtenemos los parámetros de la URL directamente
    const params = new URLSearchParams(window.location.search);

    // Definimos las variables base
    const roomName = roomId ?? params.get("room") ?? "Sala Desconocida";
    const startString = startISO ?? params.get("start") ?? new Date().toISOString();
    const endString = endISO ?? params.get("end") ?? new Date().toISOString();

    // Creamos las fechas
    const startDate = new Date(startString);
    const endDate = new Date(endString);

    /**
     * Formatea la fecha en un formato largo legible en español.
     * Ejemplo: "miércoles, 23 de julio de 2024"
     * @param date - Fecha a formatear.
     */
    const formatDateLong = (date: Date): string =>
        new Intl.DateTimeFormat("es-CL", {
            weekday: "long",
            day: "2-digit",
            month: "long",
            year: "numeric",
        }).format(date);

    /**
     * Formatea la hora en formato de 12 horas.
     * Ejemplo: "10:00 a. m."
     * @param date - Fecha de la cual extraer la hora.
     */
    const formatHour = (date: Date): string =>
        new Intl.DateTimeFormat("es-CL", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        }).format(date);

    // Clases CSS reutilizables
    const buttonBaseClass = "flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 active:scale-[0.98]";
    const primaryButtonClass = "bg-[#0a3fa6] text-white hover:bg-[#072d78] shadow-md hover:shadow-lg";
    const secondaryButtonClass = "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300";

    return (
        <main className="min-h-screen grid place-items-center bg-[#f4f6f9] p-6">
            <section
                className="w-full max-w-[600px] rounded-2xl border border-[#eef2f7] bg-white p-8 text-center shadow-[0_10px_30px_rgba(2,6,23,.08)] md:p-10"
                role="status"
                aria-live="polite"
            >
                {/* Icono de Éxito */}
                <div className="mb-6 flex justify-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 ring-8 ring-blue-50/50">
                        <CheckCircleIcon
                            size={48}
                            weight="fill"
                            className="text-[#0ea5e9]"
                        />
                    </div>
                </div>

                {/* Títulos */}
                <h1 className="mb-3 text-3xl font-extrabold text-[#0f172a] md:text-4xl tracking-tight">
                    ¡Reserva Confirmada!
                </h1>

                <p className="mx-auto mb-8 max-w-[45ch] text-lg text-[#64748b] leading-relaxed">
                    Has reservado la sala <strong className="text-[#0f172a]">{roomName}</strong> exitosamente.
                </p>

                {/* Detalles de la Reserva */}
                <div className="mb-8 rounded-xl bg-gray-50 p-5 border border-gray-100">
                    <dl className="grid gap-3 text-left">
                        <div className="flex items-center justify-between text-[0.95rem]">
                            <dt className="text-gray-500 font-medium">Fecha:</dt>
                            <dd className="font-bold text-[#0f172a] capitalize">
                                {formatDateLong(startDate)}
                            </dd>
                        </div>
                        <div className="flex items-center justify-between text-[0.95rem]">
                            <dt className="text-gray-500 font-medium">Horario:</dt>
                            <dd className="font-bold text-[#0f172a]">
                                {formatHour(startDate)} - {formatHour(endDate)}
                            </dd>
                        </div>
                    </dl>
                </div>

                {/* --- Botones de Acción --- */}
                <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                    <Link
                        to="/mis-reservas"
                        className={`${buttonBaseClass} ${primaryButtonClass}`}
                    >
                        <CalendarCheckIcon size={20} weight="bold" />
                        Ir a Mis Reservas
                    </Link>

                    <Link
                        to="/"
                        className={`${buttonBaseClass} ${secondaryButtonClass}`}
                    >
                        <HouseIcon size={20} weight="bold" />
                        Volver al Inicio
                    </Link>
                </div>

                {/* Nota al pie */}
                <p className="mt-8 text-sm text-gray-400">
                    Puedes cancelar o modificar tu reserva desde la sección "Mis Reservas".
                </p>
            </section>
        </main>
    );
};

export default ReservationSuccess;