import React from "react";
import { useAuth } from "../context/AuthContext";

/**
 * Modal emergente para el inicio de sesión con Google.
 * Se controla globalmente desde AuthContext.
 */
export const LoginModal: React.FC = () => {
    const { isLoginModalOpen, closeLoginModal } = useAuth();

    // URL al backend para OAuth2
    const googleLoginUrl = "http://localhost:8080/oauth2/authorization/google";

    if (!isLoginModalOpen) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4"
            onClick={closeLoginModal}
            role="dialog"
            aria-modal="true"
        >
            <div
                className="w-full max-w-[440px] rounded-2xl border border-[#eef2f7] bg-white p-7 shadow-[0_10px_30px_rgba(2,6,23,0.06)]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* .header */}
                <header className="mb-[18px] text-center">
                    <h1 className="m-0 text-[28px] font-extrabold leading-[1.2] text-[#0a3fa6]">
                        BookFrontera
                    </h1>
                    <p className="mt-2 text-center">
                        Inicia sesión para continuar
                    </p>
                </header>

                {/* Botón Google */}
                <a
                    className="
                        inline-flex h-[42px] w-full items-center justify-center
                        gap-2.5 rounded-[10px] border border-[#e5e7eb] bg-white
                        text-[0.95rem] font-semibold text-[#111827] no-underline
                        shadow-[0_1px_2px_rgba(0,0,0,.05)]
                        transition-all duration-150
                        hover:border-[#d1d5db]
                        hover:shadow-[0_4px_18px_rgba(0,0,0,.08)]
                        active:translate-y-px
                        focus-visible:outline-2 focus-visible:outline-offset-2
                        focus-visible:outline-[#60a5fa]
                    "
                    href={googleLoginUrl}
                    rel="noopener noreferrer"
                >
                    {/* Icono Google */}
                    <svg
                        className="inline-block h-[18px] w-[18px]"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                    >
                        <path fill="#FFC107" d="M43.6 20.5h-1.8V20H24v8h11.3C33.8 31.9 29.3 35 24 35c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.3 0 6.3 1.2 8.6 3.2l5.7-5.7C34.4 3 29.5 1 24 1 11.8 1 2 10.8 2 23s9.8 22 22 22c11.3 0 21-8.2 21-22 0-1.3-.1-2.7-.4-3.9z" />
                        <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16 18.9 13 24 13c3.3 0 6.3 1.2 8.6 3.2l5.7-5.7C34.4 3 29.5 1 24 1 15.3 1 7.9 6 4.6 13.2l1.7 1.5z" />
                        <path fill="#4CAF50" d="M24 45c5.2 0 10.1-2 13.7-5.3l-6.3-5.2C29.2 36.6 26.7 37.5 24 37.5c-5.2 0-9.6-3.3-11.2-8l-6.5 5.1C9.6 39.9 16.3 45 24 45z" />
                        <path fill="#1976D2" d="M43.6 20.5H24v8h11.3c-1 3-3.4 5.4-6.6 6.6l6.3 5.2C38.9 38.8 43 33 43 23c0-1.3-.1-2.7-.4-3.9z" />
                    </svg>
                    <span>Iniciar Sesión con Google</span>
                </a>
            </div>
        </div>
    );
};