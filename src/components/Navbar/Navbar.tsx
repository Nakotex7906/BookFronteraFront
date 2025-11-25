import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import logoUfro from '../../assets/icons/Logo_Ufro.png';
import { useAuth } from "../../context/AuthContext.tsx";
import {
    HouseIcon,
    CalendarIcon,
    BooksIcon,
    UserCircleIcon,
    CaretDownIcon,
    ListIcon,
    SignOutIcon
} from "@phosphor-icons/react";

export default function Navbar() {
    const { user, isLoading, logout, openLoginModal } = useAuth();

    // AÑADIR LOS ESTADOS PARA LOS TRES MENÚS
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
    const [isMobileAccountOpen, setIsMobileAccountOpen] = useState(false);

    // Clases para los enlaces de la AppNavbar
    const appNavLinkClasses = ({ isActive }: { isActive: boolean }) =>
        `flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            isActive
                ? 'bg-[#eef6ff] text-[#0a3fa6]'
                : 'text-[#434a54] hover:bg-gray-100'
        }`;

    // Clases para los enlaces en el menú móvil
    const mobileNavLinkClasses = ({ isActive }: { isActive: boolean }) =>
        `flex items-center gap-3 px-3 py-3 text-base ${
            isActive
                ? 'font-bold text-[#0a3fa6]'
                : 'font-medium text-[#434a54]'
        }`;

    if (isLoading) {
        return null;
    }

    //RENDERIZADO DE LA <AppNavbar> (SI ESTÁ LOGUEADO)
    if (user) {
        return (
            <nav
                className="sticky top-0 z-[100] w-full bg-white shadow-lg"
                role="navigation"
                aria-label="Aplicación"
            >
                {/*SECCIÓN DESKTOP */}
                <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 p-4 lg:grid lg:grid-cols-3">

                    {/* Logo (Izquierda) */}
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2.5 justify-self-start no-underline transition-opacity duration-200 hover:opacity-90"
                    >
                        <img src={logoUfro} alt="Logo" className="h-[53px] w-auto" />
                        <span className="text-xl font-bold text-[#002976]">
                        BookFrontera
                    </span>
                    </Link>

                    {/*Links de la App (Oculto en celular) */}
                    <ul className="m-0 hidden list-none justify-center gap-2 p-0 lg:flex lg:col-span-1 lg:justify-self-center">
                        <li>
                            <NavLink to="/" className={appNavLinkClasses}>
                                <HouseIcon size={20} weight="fill" />
                                Inicio
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/mis-reservas" className={appNavLinkClasses}>
                                <CalendarIcon size={20} weight="fill" />
                                Mis Reservas
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/salas-de-estudio" className={appNavLinkClasses}>
                                <BooksIcon size={20} weight="fill" />
                                Salas de Estudio
                            </NavLink>
                        </li>
                    </ul>

                    {/* Acciones (Desktop) */}
                    <div className="hidden items-center justify-end gap-2 lg:flex lg:col-span-1 lg:justify-self-end">


                        <div className="relative">
                            <button
                                className={appNavLinkClasses({isActive: false})}
                                onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                            >
                                <UserCircleIcon size={20} />
                                <span className="max-w-[100px] truncate">
                                    {user.nombre.split(' ')[0]}
                                </span>
                                <CaretDownIcon size={16} />
                            </button>

                            {isAccountMenuOpen && (
                                <div
                                    className="absolute top-full right-0 z-10 mt-2 w-56 rounded-lg bg-white p-2 shadow-lg ring-1 ring-black ring-opacity-5"
                                    onMouseLeave={() => setIsAccountMenuOpen(false)}
                                >
                                    <button
                                        onClick={() => {
                                            logout();
                                            setIsAccountMenuOpen(false);
                                        }}
                                        className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm text-[#434a54] hover:bg-gray-100"
                                    >
                                        <SignOutIcon size={20} />
                                        <span>Cerrar sesión</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* BOTÓN HAMBURGUESA (solo se ve en celular) */}
                    <button
                        className="block border-0 bg-transparent p-2 text-[#002976] lg:hidden"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Abrir menú"
                        aria-expanded={isMobileMenuOpen}
                    >
                        <ListIcon size={32} />
                    </button>
                </div>

                {/* Seccion menu celular */}
                <div
                    className={`absolute left-0 w-full bg-white shadow-xl lg:hidden ${
                        isMobileMenuOpen ? 'block' : 'hidden'
                    }`}
                >
                    {/* Enlaces */}
                    <ul className="flex flex-col p-4">
                        <li>
                            <NavLink to="/" className={mobileNavLinkClasses} onClick={() => setIsMobileMenuOpen(false)}>
                                <HouseIcon size={22} />
                                Inicio
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/mis-reservas" className={mobileNavLinkClasses} onClick={() => setIsMobileMenuOpen(false)}>
                                <CalendarIcon size={22} />
                                Mis Reservas
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/salas-de-estudio" className={mobileNavLinkClasses} onClick={() => setIsMobileMenuOpen(false)}>
                                <BooksIcon size={22} />
                                Salas de Estudio
                            </NavLink>
                        </li>
                    </ul>

                    {/* Acciones Celular */}
                    <div className="flex flex-col gap-3 border-t border-gray-100 p-4">

                        {/* Botón "Cuenta" ahora es un desplegable */}
                        <button
                            className={`${mobileNavLinkClasses({isActive: false})} w-full justify-between`}
                            onClick={() => setIsMobileAccountOpen(!isMobileAccountOpen)}
                        >
                            <span className="flex items-center gap-3">
                                <UserCircleIcon size={22} />
                                Cuenta: {user.nombre}
                            </span>
                            <CaretDownIcon size={16} />
                        </button>

                        {/* Contenido desplegable de "Cuenta" */}
                        {isMobileAccountOpen && (
                            <div className="flex flex-col pl-8">
                                <button
                                    onClick={logout}
                                    className={`${mobileNavLinkClasses({isActive: false})} w-full text-red-600 hover:bg-red-50`}
                                >
                                    <SignOutIcon size={22} />
                                    Cerrar sesión
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </nav>
        );
    }

    // RENDERIZADO DE LA <PublicNavbar> (SI NO ESTÁ LOGUEADO)
    return (
        <nav
            className="sticky top-0 z-[100] w-full bg-white shadow-lg"
            role="navigation"
            aria-label="Principal"
        >
            <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 p-4 lg:grid lg:grid-cols-3">

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

                <ul
                    className="
                        m-0 hidden list-none p-0
                        lg:flex lg:justify-center lg:gap-[18px]
                        xl:gap-7
                    "
                >
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
                            href="https://www.ufro.cl/webmail/WebMail-NS.htm"
                            className="text-[0.95rem] text-[#434a54] no-underline whitespace-nowrap transition-colors duration-150 hover:text-[#1f3b8a]"
                        >
                            Webmail
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
                </ul>

                <div className="flex items-center justify-self-end gap-4">
                    <button
                        type="button"
                        onClick={openLoginModal}
                        className={`px-[18px] py-[10px] text-sm font-medium text-white bg-[#1b66e5] border-0 rounded-lg cursor-pointer transition-all duration-150 hover:bg-[#1556c4] active:translate-y-px`}
                    >
                        Iniciar sesión
                    </button>
                </div>
            </div>
        </nav>
    );
}