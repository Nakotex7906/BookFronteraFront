import React from 'react';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    children: React.ReactNode;
    isLoading?: boolean;
    error?: string | null;

    showGoogleCalendarCheck?: boolean;
    googleCalendarChecked?: boolean;
    onGoogleCalendarChange?: (isChecked: boolean) => void;
};

export const ConfirmModal: React.FC<Props> = ({
                                                  isOpen,
                                                  onClose,
                                                  onConfirm,
                                                  title,
                                                  isLoading = false,
                                                  error = null,
                                                  showGoogleCalendarCheck = false,
                                                  googleCalendarChecked = false,
                                                  onGoogleCalendarChange,
                                                  children,
                                              }) => {
    if (!isOpen) {
        return null;
    }

    const baseButton = "w-full h-11 rounded-lg font-semibold text-sm transition-all duration-150";
    const primaryButton = "bg-[#0a3fa6] text-white hover:bg-[#072d78] disabled:opacity-70";
    const secondaryButton = "bg-white border border-[#e5e7eb] text-[#6b7280] hover:bg-[#f9fafb] disabled:opacity-70";

    return (
        <div
            className="fixed inset-0 z-49 grid place-items-center bg-black/60 p-4"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
        >
            <div
                className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="mb-2 text-center text-2xl font-bold text-[#111827]">
                    {title}
                </h2>

                <div className="mb-6 text-center text-base text-[#6b7280]">
                    {children}
                </div>

                {/*  EL CHECKBOX  */}
                {showGoogleCalendarCheck && (
                    <div className="mb-5 flex items-center justify-center">
                        <input
                            type="checkbox"
                            id="gcal-check"
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            checked={googleCalendarChecked}
                            onChange={(e) => onGoogleCalendarChange?.(e.target.checked)}
                        />
                        <label
                            htmlFor="gcal-check"
                            className="ml-2 block text-sm text-gray-700"
                        >
                            Añadir a Google Calendar
                        </label>
                    </div>
                )}

                {error && (
                    <div className="mb-4 rounded-md bg-red-100 p-3 text-center text-sm text-red-700">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                    <button
                        className={`${baseButton} ${secondaryButton}`}
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        Cancelar
                    </button>
                    <button
                        className={`${baseButton} ${primaryButton}`}
                        onClick={onConfirm}
                        disabled={isLoading}
                    >
                        {isLoading ? "Reservando..." : "Confirmar"}
                    </button>
                </div>
            </div>
        </div>
    );
};