import { useSearchParams } from "react-router-dom";
import { WarningCircleIcon, XCircleIcon } from "@phosphor-icons/react";

export default function LoginPage() {
    const [searchParams] = useSearchParams();

    // Capturamos el mensaje que viene del backend (ya decodificado por React Router)
    const errorMessage = searchParams.get("error");

    const googleLoginUrl = "http://localhost:8080/oauth2/authorization/google";

    return (
        <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#f4f6f9]">
            <div className="w-full max-w-[420px] bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">

                <div className="p-8 text-center">
                    <h1 className="text-2xl font-extrabold text-[#0a3fa6] mb-2">
                        Iniciar Sesión
                    </h1>
                    <p className="text-gray-500 text-sm mb-6">
                        Accede a BookFrontera para gestionar tus reservas
                    </p>

                    {/* ZONA DE ERROR */}
                    {errorMessage && (
                        <div className="mb-6 bg-red-50 border border-red-100 rounded-xl p-4 flex flex-col items-center gap-2 animate-in fade-in slide-in-from-top-2">
                            <XCircleIcon size={32} className="text-red-500" weight="fill" />
                            <div className="text-center">
                                <h3 className="text-red-800 font-bold text-sm">Error de Acceso</h3>
                                <p className="text-red-600 text-xs mt-1">
                                    {errorMessage}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Si no hay error, mostramos el aviso normal */}
                    {!errorMessage && (
                        <div className="mb-6 bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-start gap-2 text-left">
                            <WarningCircleIcon size={20} className="text-blue-600 mt-0.5 shrink-0" />
                            <p className="text-xs text-blue-800">
                                Recuerda utilizar tu correo institucional <strong>@ufromail.cl</strong>.
                            </p>
                        </div>
                    )}

                    <a
                        href={googleLoginUrl}
                        className="
                            flex w-full items-center justify-center gap-3 rounded-xl
                            bg-[#0a3fa6] py-3.5 text-white font-bold text-sm
                            shadow-lg shadow-blue-900/20 transition-all
                            hover:bg-[#083285] hover:-translate-y-0.5
                        "
                    >
                        <span>Intentar nuevamente con Google</span>
                    </a>
                </div>

                <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
                    <a href="/" className="text-xs text-gray-500 hover:text-gray-800 font-medium">
                        ← Volver al inicio
                    </a>
                </div>
            </div>
        </main>
    );
}