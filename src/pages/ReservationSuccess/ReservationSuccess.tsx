import React, { useMemo } from "react";
import type { Props } from "../../types/Props.ts";

/**
 * Pantalla de confirmación de reserva.
 */
const ReservationSuccess: React.FC<Props> = ({
                                                 roomId,
                                                 startISO,
                                                 endISO,
                                             }) => {
    const params = useMemo(() => new URLSearchParams(window.location.search), []);
    const room = roomId ?? params.get("room") ?? "SL-201";
    const startStr = startISO ?? params.get("start") ?? "2024-07-23T10:00:00-04:00";
    const endStr = endISO ?? params.get("end") ?? "2024-07-23T11:00:00-04:00";

    const start = useMemo(() => new Date(startStr), [startStr]);
    const end = useMemo(() => new Date(endStr), [endStr]);

    const formatDateLong = (d: Date) =>
        new Intl.DateTimeFormat("es-CL", {
            weekday: "long",
            day: "2-digit",
            month: "long",
            year: "numeric",
        }).format(d);

    const formatHour = (d: Date) =>
        new Intl.DateTimeFormat("es-CL", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        }).format(d);

    return (
        // .page
        <main className="min-h-screen grid place-items-center bg-[#f4f6f9] p-6">
            {/* .card */}
            <section
                className="w-full max-w-[720px] rounded-2xl border border-[#eef2f7] bg-white p-[40px_44px_28px] text-center shadow-[0_10px_30px_rgba(2,6,23,.08)]"
                role="status"
                aria-live="polite"
            >
                {/* .iconWrap */}
                <div className="grid place-items-center mb-3" aria-hidden="true">
                    {/* .icon */}
                    <svg className="h-[76px] w-[76px]" viewBox="0 0 48 48">
                        <circle
                            cx="24"
                            cy="24"
                            r="22"
                            className="fill-[#e6f0ff] stroke-[#bdd2ff] stroke-2" // .iconBg
                        />
                        <path
                            className="fill-[#0ea5e9]" // .iconCheck
                            d="M34.6 17.8a1.5 1.5 0 0 1 0 2.1l-12 12a1.5 1.5 0 0 1-2.1 0l-6-6a1.5 1.5 0 0 1 2.1-2.1l4.9 4.9 10.9-10.9a1.5 1.5 0 0 1 2.2 0z"
                        />
                    </svg>
                </div>

                {/* .title */}
                <h1 className="my-1.5 text-3xl font-extrabold leading-[1.2] text-[#0f172a] md:text-[32px]">
                    ¡Reserva Confirmada!
                </h1>

                {/* .lead */}
                <p className="mx-auto mb-[18px] max-w-[52ch] text-base text-[#64748b]">
                    ¡Has reservado la sala <strong>{room}</strong> en el{" "}
                    <strong>{formatDateLong(start)}</strong> a las{" "}
                    <strong>{formatHour(start)}</strong>!
                </p>

                {/* .hr */}
                <hr className="my-4 border-0 border-t border-[#e5e7eb]" />

                {/* .details */}
                <dl className="mb-[18px] grid gap-2.5 text-left">
                    {/* .row */}
                    <div className="flex items-center justify-between py-1.5 text-[0.975rem]">
                        <dt className="text-[#64748b]">Sala:</dt>
                        <dd className="m-0 font-bold text-[#0f172a]">{room}</dd>
                    </div>
                    <div className="flex items-center justify-between py-1.5 text-[0.975rem]">
                        <dt className="text-[#64748b]">Fecha:</dt>
                        <dd className="m-0 font-bold text-[#0f172a]">{formatDateLong(start)}</dd>
                    </div>
                    <div className="flex items-center justify-between py-1.5 text-[0.975rem]">
                        <dt className="text-[#64748b]">Hora:</dt>
                        <dd className="m-0 font-bold text-[#0f172a]">
                            {formatHour(start)} - {formatHour(end)}
                        </dd>
                    </div>
                </dl>

                {/* .note */}
                <p className="mx-auto mt-4 max-w-[60ch] text-[0.9rem] text-[#64748b]">
                    Si necesitas cancelar o modificar tu reserva, puedes hacerlo desde la
                    sección <strong>“Mis Reservas”</strong>.
                </p>
            </section>
        </main>
    );
};

export default ReservationSuccess;