import { useState, useRef, useEffect } from "react";
import { CaretDownIcon, CheckIcon } from "@phosphor-icons/react";

interface Option {
    value: string | number;
    label: string;
}

interface CustomSelectProps {
    label?: string;        // Etiqueta opcional arriba
    value: string | number;
    onChange: (value: string) => void;
    options: Option[];
    disabled?: boolean;
    placeholder?: string;
}

export function CustomSelect({
                                 label,
                                 value,
                                 onChange,
                                 options,
                                 disabled = false,
                                 placeholder = "Seleccionar..."
                             }: CustomSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Cerrar al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (optionValue: string | number) => {
        onChange(String(optionValue));
        setIsOpen(false);
    };

    const selectedOption = options.find((opt) => String(opt.value) === String(value));

    return (
        <div className="relative w-full min-w-[140px]" ref={containerRef}>
            {label && (
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                    {label}
                </label>
            )}

            {/* Botón Trigger */}
            <button
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                className={`
                    relative w-full cursor-default rounded-xl bg-white py-3 pl-4 pr-10 text-left shadow-sm 
                    border border-gray-200 transition-all duration-200 ease-out
                    ${disabled
                    ? "bg-gray-50 text-gray-400 cursor-not-allowed border-gray-100"
                    : "hover:border-blue-400 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 cursor-pointer"
                }
                    ${isOpen ? "border-blue-500 ring-2 ring-blue-100" : ""}
                `}
            >
                <span className={`block truncate ${!selectedOption ? 'text-gray-400' : 'text-gray-900 font-medium'}`}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <CaretDownIcon
                        className={`h-4 w-4 text-gray-400 transition-transform duration-300 ease-out ${isOpen ? "rotate-180 text-blue-500" : ""}`}
                        aria-hidden="true"
                    />
                </span>
            </button>

            {/* Menú Desplegable Animado */}
            <div
                className={`
                    absolute z-[60] mt-2 max-h-60 w-full overflow-auto rounded-xl bg-white py-2 text-base shadow-xl ring-1 ring-black/5 focus:outline-none sm:text-sm
                    origin-top transition-all duration-200 ease-out
                    ${isOpen
                    ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                    : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                }
                `}
            >
                {options.map((option) => {
                    const isSelected = String(option.value) === String(value);
                    return (
                        <div
                            key={option.value}
                            onClick={() => handleSelect(option.value)}
                            className={`
                                relative cursor-pointer select-none py-2.5 pl-10 pr-4 transition-colors duration-150
                                ${isSelected
                                ? "bg-blue-50 text-blue-900 font-medium"
                                : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                            }
                            `}
                        >
                            {isSelected && (
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                                    <CheckIcon className="h-4 w-4" weight="bold" />
                                </span>
                            )}
                            <span className="block truncate">
                                {option.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}