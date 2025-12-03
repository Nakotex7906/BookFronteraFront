import React from "react";
import { useAuth } from "../context/AuthContext";
import { InfoIcon, XIcon } from "@phosphor-icons/react";

export const LoginModal: React.FC = () => {
    const { isLoginModalOpen, closeLoginModal } = useAuth();
    const googleLoginUrl = "http://localhost:8080/oauth2/authorization/google";

    if (!isLoginModalOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 grid place-items-center bg-[#0a3fa6]/20 backdrop-blur-sm p-4 transition-all"
            onClick={closeLoginModal}
            role="dialog"
            aria-modal="true"
        >
            <div
                className="relative w-full max-w-[420px] rounded-3xl bg-white p-8 shadow-2xl shadow-blue-900/10 animate-in fade-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Botón cerrar */}
                <button
                    onClick={closeLoginModal}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <XIcon size={20} />
                </button>

                <header className="mb-8 text-center">
                    <h1 className="text-3xl font-extrabold text-[#0a3fa6]">
                        BookFrontera
                    </h1>
                    <p className="mt-3 text-base text-gray-600 leading-relaxed">
                        Bienvenido a tu plataforma de gestión de espacios universitarios.
                    </p>
                </header>

                {/* --- AVISO INTEGRADO CON LA MARCA --- */}
                {/* Usamos bg-blue-50, bordes azules suaves y el color principal para el icono y énfasis */}
                <div className="mb-8 rounded-2xl bg-blue-50/80 p-5 border border-blue-100/50 flex items-start gap-4">
                    <InfoIcon size={26} className="text-[#0a3fa6] shrink-0 mt-0.5" weight="fill" />
                    <div className="flex-1">
                        <h3 className="text-[#0a3fa6] font-bold text-sm mb-1">
                            Información de Acceso
                        </h3>
                        <p className="text-sm text-blue-900/80 leading-snug">
                            El ingreso es exclusivo para miembros de la universidad. Por favor, utiliza tu cuenta institucional
                            <span className="font-bold ml-1.5 text-[#0a3fa6] whitespace-nowrap">
                                @ufromail.cl
                            </span>.
                        </p>
                    </div>
                </div>

                <a
                    className="
                        relative flex w-full items-center justify-center
                        gap-3 rounded-xl bg-[#0a3fa6] py-4
                        text-white font-bold text-[0.95rem]
                        shadow-lg shadow-blue-900/20
                        transition-all duration-200
                        hover:bg-[#083285] hover:-translate-y-0.5 hover:shadow-xl
                        active:scale-[0.98] active:shadow-md
                    "
                    href={googleLoginUrl}
                >
                    {/* Icono de Google blanco simple para que combine mejor con el botón azul */}
                    <svg className="h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M23.745 12.27c0-.79-.07-1.54-.19-2.27h-11.3v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z" fill="#ffffff"/>
                        <path d="M12.255 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96h-3.98v3.09c1.97 3.92 6.02 6.62 10.71 6.62z" fill="#ffffff"/>
                        <path d="M5.525 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29v-3.09h-3.98c-.82 1.64-1.29 3.48-1.29 5.38s.47 3.74 1.29 5.38l3.98-3.09z" fill="#ffffff"/>
                        <path d="M12.255 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42c-2.07-1.94-4.78-3.13-8.02-3.13-4.69 0-8.74 2.7-10.71 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z" fill="#ffffff"/>
                    </svg>
                    <span>Continuar con Google</span>
                </a>
            </div>
        </div>
    );
};