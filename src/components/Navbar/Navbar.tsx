import { Link, NavLink } from "react-router-dom";
import logoUfro from '../../assets/icons/Logo_Ufro.png';
import { useAuth } from "../../context/AuthContext.tsx";

export default function Navbar() {
    const { user, isLoading, logout } = useAuth();

    const baseButtonClasses = "text-sm font-medium text-white bg-[#1b66e5] border-0 rounded-lg cursor-pointer transition-all duration-150 hover:bg-[#1556c4] active:translate-y-px";

    // Usa NavLink para detectar la ruta activa
    const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
        `text-[0.95rem] no-underline whitespace-nowrap transition-colors duration-150 px-3 py-2 rounded-md ${
            isActive
                ? 'font-semibold text-[#1f3b8a] bg-blue-100' // Estilo activo
                : 'text-[#434a54] hover:text-[#1f3b8a]'
        }`;

    return (
        <nav
            className="sticky top-0 z-[100] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)]
                       after:content-[''] after:block after:h-1
                       after:bg-gradient-to-r after:from-[#0d3398] after:to-[#2b73ff]"
            role="navigation"
            aria-label="Principal"
        >
            <div
                className="
                    mx-auto h-[70px] max-w-[1600px] overflow-hidden
                    grid grid-cols-[1fr_auto] items-center gap-4 px-6
                    lg:grid-cols-[auto_1fr_auto]
                    xl:grid-cols-[250px_1fr_250px] xl:gap-6
                "
            >
                {/* --- Logo --- */}
                <Link
                    to="/"
                    className="inline-flex items-center gap-2.5 justify-self-start no-underline transition-opacity duration-200 hover:opacity-90"
                    aria-label="Inicio BookFrontera"
                >
                    <img src={logoUfro} alt="Logo" className="h-[53px] w-auto" />
                    <span className="text-xl font-bold text-[#002976]">
                        BookFrontera
                    </span>
                </Link>

                {/* --- Links (CONDICIONALES) --- */}
                <ul
                    className="
                        m-0 hidden list-none p-0
                        lg:flex lg:justify-center lg:gap-[18px]
                        xl:gap-7
                    "
                >
                    {user ? (
                        <>
                            {/* --- Links de APP (Logueado) --- */}
                            <li>
                                <NavLink to="/" className={navLinkClasses}>
                                    Inicio
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/mis-reservas" className={navLinkClasses}>
                                    Reservas
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/" className={navLinkClasses}>
                                    Salas de Estudio
                                </NavLink>
                            </li>
                        </>
                    ) : (
                        <>
                            {/* --- Links Públicos (No Logueado) --- */}
                            <li>
                                <a
                                    href="https://www.ufro.cl/servicios-online/"
                                    className="text-[0.95rem] text-[#434a54] no-underline whitespace-nowrap transition-colors duration-150 hover:text-[#1f3b8a]"
                                >
                                    Servicios Online
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://www.ufro.cl/"
                                    className="text-[0.95rem] text-[#434a54] no-underline whitespace-nowrap transition-colors duration-150 hover:text-[#1f3b8a]"
                                >
                                    Universidad
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://campusvirtual.ufro.cl/"
                                    className="text-[0.95rem] text-[#434a54] no-underline whitespace-nowrap transition-colors duration-150 hover:text-[#1f3b8a]"
                                >
                                    Campus Virtual
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://intranet.ufro.cl/"
                                    className="text-[0.95rem] text-[#434a54] no-underline whitespace-nowrap transition-colors duration-150 hover:text-[#1f3b8a]"
                                >
                                    Intranet
                                </a>
                            </li>
                        </>
                    )}
                </ul>

                {/* --- Acciones (Botones) --- */}
                <div className="flex items-center justify-self-end gap-4">
                    <button
                        type="button"
                        className="border-0 bg-transparent px-3 py-2 text-[0.95rem] text-[#434a54] cursor-pointer transition-colors duration-150 hover:text-[#1f3b8a]"
                        aria-haspopup="menu"
                        aria-expanded="false"
                    >
                        Ayuda <span className="ml-1.5" aria-hidden="true">▾</span>
                    </button>

                    {/* Lógica de Auth */}
                    {isLoading ? null : user ? (
                        <div className="inline-flex items-center gap-3">
                            <span
                                className="
                                    max-w-[150px] overflow-hidden text-ellipsis
                                    whitespace-nowrap text-right text-[0.95rem]
                                    font-medium text-[#434a54]
                                "
                            >
                                Hola, {user.nombre}
                            </span>
                            <button
                                onClick={logout}
                                className={`${baseButtonClasses} flex-shrink-0 whitespace-nowrap px-3.5 py-2`}
                            >
                                Cerrar sesión
                            </button>
                        </div>
                    ) : (
                        <Link
                            to="/login"
                            className={`${baseButtonClasses} px-[18px] py-[10px]`}
                        >
                            Iniciar sesión
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}