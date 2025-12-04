import { useState, useRef, useEffect } from "react";
import { CalendarBlankIcon, CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";

interface CustomDatePickerProps {
    label?: string;
    value: string; // Formato YYYY-MM-DD
    onChange: (date: string) => void;
    minDate?: string;
    maxDate?: string;
    disableWeekends?: boolean;
}

export function CustomDatePicker({
                                     label,
                                     value,
                                     onChange,
                                     minDate,
                                     maxDate,
                                     disableWeekends = false
                                 }: CustomDatePickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Inicializamos viewDate evitando desfases horarios
    const [viewDate, setViewDate] = useState(() => {
        const d = value ? new Date(value + "T12:00:00") : new Date();
        return isNaN(d.getTime()) ? new Date() : d;
    });

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Domingo

    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const dayNames = ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"];

    const emptySlots = Array.from({ length: firstDayOfMonth });
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const changeMonth = (offset: number) => {
        const newDate = new Date(viewDate.setMonth(viewDate.getMonth() + offset));
        setViewDate(new Date(newDate));
    };

    const handleDaySelect = (day: number, isDisabled: boolean) => {
        if (isDisabled) return; // Bloquear acción si está deshabilitado

        const yyyy = year;
        const mm = String(month + 1).padStart(2, '0');
        const dd = String(day).padStart(2, '0');
        onChange(`${yyyy}-${mm}-${dd}`);
        setIsOpen(false);
    };

    const formatDateDisplay = (isoDate: string) => {
        if (!isoDate) return "Seleccionar fecha";
        const [y, m, d] = isoDate.split("-");
        return `${d}/${m}/${y}`;
    };

    // Función auxiliar para verificar si un día está deshabilitado
    const isDateDisabled = (day: number) => {
        const currentIso = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dateObj = new Date(year, month, day);
        const dayOfWeek = dateObj.getDay(); // 0 Dom, 6 Sab

        // Validar Fin de Semana
        if (disableWeekends && (dayOfWeek === 0 || dayOfWeek === 6)) {
            return true;
        }
        // Validar MinDate
        if (minDate && currentIso < minDate) {
            return true;
        }
        // Validar MaxDate
        if (maxDate && currentIso > maxDate) {
            return true;
        }
        return false;
    };

    return (
        <div className="relative w-full min-w-[160px]" ref={containerRef}>
            {label && (
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                    {label}
                </label>
            )}

            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    relative w-full cursor-pointer rounded-xl bg-white py-3 pl-4 pr-10 text-left shadow-sm 
                    border border-gray-200 transition-all duration-200 ease-out
                    hover:border-blue-400 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500
                    ${isOpen ? "border-blue-500 ring-2 ring-blue-100" : ""}
                `}
            >
                <span className="block truncate text-gray-900 font-medium">
                    {formatDateDisplay(value)}
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <CalendarBlankIcon
                        className={`h-5 w-5 transition-colors ${isOpen ? "text-blue-500" : "text-gray-400"}`}
                        weight={isOpen ? "fill" : "regular"}
                    />
                </span>
            </button>

            <div
                className={`
                    absolute z-[70] mt-2 w-[280px] rounded-2xl bg-white p-4 shadow-xl ring-1 ring-black/5
                    origin-top-left transition-all duration-200 ease-out
                    ${isOpen
                    ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                    : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                }
                `}
            >
                <div className="flex items-center justify-between mb-4 px-1">
                    <button onClick={() => changeMonth(-1)} className="p-1.5 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                        <CaretLeftIcon size={16} weight="bold" />
                    </button>
                    <span className="font-bold text-gray-800 text-sm">
                        {monthNames[month]} {year}
                    </span>
                    <button onClick={() => changeMonth(1)} className="p-1.5 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                        <CaretRightIcon size={16} weight="bold" />
                    </button>
                </div>

                <div className="grid grid-cols-7 gap-1 mb-2 text-center">
                    {dayNames.map(d => (
                        <span key={d} className="text-[0.7rem] font-bold text-gray-400 uppercase tracking-wider">{d}</span>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-1 text-center">
                    {emptySlots.map((_, i) => (
                        <div key={`empty-${i}`} />
                    ))}

                    {days.map(d => {
                        const currentIso = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                        const isSelected = value === currentIso;
                        const isDisabled = isDateDisabled(d);

                        const today = new Date();
                        const isToday = today.getDate() === d && today.getMonth() === month && today.getFullYear() === year;

                        // Clases base
                        let classes = "h-8 w-8 rounded-full text-sm flex items-center justify-center transition-all duration-200 ";

                        // Lógica de estilos
                        if (isDisabled) {
                            classes += "text-gray-300 cursor-not-allowed bg-transparent";
                        } else if (isSelected) {
                            classes += "bg-[#0a3fa6] text-white shadow-md font-bold scale-105";
                        } else if (isToday) {
                            classes += "text-[#0a3fa6] font-bold bg-blue-50 border border-blue-200 hover:bg-blue-100";
                        } else {
                            classes += "text-gray-700 hover:bg-gray-100 hover:text-gray-900";
                        }

                        return (
                            <button
                                key={d}
                                onClick={() => handleDaySelect(d, isDisabled)}
                                disabled={isDisabled}
                                className={classes}
                            >
                                {d}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}