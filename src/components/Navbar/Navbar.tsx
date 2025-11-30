import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import logoUfro from '../../assets/icons/Logo_Ufro.png';
import { useAuth } from "../../context/AuthContext";
import apiClient from "../../services/api"; // Importamos cliente API
import {
    HouseIcon,
    CalendarIcon,
    BooksIcon,
    UserCircleIcon,
    CaretDownIcon,
    ListIcon,
    SignOutIcon,
    PresentationChartIcon,
    ArrowsLeftRightIcon,
    IdentificationBadgeIcon
} from "@phosphor-icons/react";

export default function Navbar() {
    const { user, isLoading, logout, openLoginModal } = useAuth();

    // Estados de menús
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
    const [isMobileAccountOpen, setIsMobileAccountOpen] = useState(false);

    // Estado para feedback de carga al cambiar rol
    const [isSwitchingRole, setIsSwitchingRole] = useState(false);

    // --- FUNCIÓN PARA CAMBIAR ROL ---
    const handleSwitchRole = async () => {
        setIsSwitchingRole(true);
        try {
            // Llamada al endpoint del backend
            await apiClient.patch('/v1/users/toggle-role');
            // Recargamos la página para actualizar permisos y UI
            window.location.reload();
        } catch (error) {
            console.error("Error al cambiar rol:", error);
            alert("Error al cambiar de rol. Verifica que el backend esté corriendo.");
            setIsSwitchingRole(false);
        }
    };

    // Clases CSS base para enlaces
    const appNavLinkClasses = ({ isActive }: { isActive: boolean }) =>
        `flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
            isActive
                ? 'bg-[#eef6ff] text-[#0a3fa6]'
                : 'text-[#434a54] hover:bg-gray-100'
        }`;

    const mobileNavLinkClasses = ({ isActive }: { isActive: boolean }) =>
        `flex items-center gap-3 px-3 py-3 text-base ${
            isActive
                ? 'font-bold text-[#0a3fa6]'
                : 'font-medium text-[#434a54]'
        }`;

    if (isLoading) return null;

    // =================================================================
    //  VISTA PARA USUARIOS LOGUEADOS
    // =================================================================
    if (user) {
        return (
            <nav className="sticky top-0 z-[100] w-full bg-white shadow-lg">
                <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 p-4 lg:grid lg:grid-cols-[auto_1fr_auto]">

                    {/* 1. Logo */}
                    <Link to="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
                        <img src={logoUfro} alt="Logo" className="h-[48px] w-auto" />
                        <span className="text-xl font-bold text-[#002976] hidden sm:block">BookFrontera</span>
                    </Link>

                    {/* 2. Menú Central (Desktop) */}
                    <ul className="hidden lg:flex list-none items-center justify-center gap-1 p-0 m-0">
                        <li>
                            <NavLink to="/" className={appNavLinkClasses}>
                                <HouseIcon size={20} weight="fill" />
                                <span>Inicio</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/mis-reservas" className={appNavLinkClasses}>
                                <CalendarIcon size={20} weight="fill" />
                                <span>Mis Reservas</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/salas-de-estudio" className={appNavLinkClasses}>
                                <BooksIcon size={20} weight="fill" />
                                <span>Salas de Estudio</span>
                            </NavLink>
                        </li>

                        {/* ENLACE AL PANEL (SOLO ADMIN) */}
                        {user.rol === 'ADMIN' && (
                            <li>
                                <NavLink to="/admin/panel" className={appNavLinkClasses}>
                                    <PresentationChartIcon size={20} weight="fill" />
                                    <span>Panel</span>
                                </NavLink>
                            </li>
                        )}
                    </ul>

                    {/* 3. Menú Usuario / Acciones (Desktop) */}
                    <div className="hidden lg:flex items-center justify-end gap-2">
                        <div className="relative">
                            <button
                                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-[#434a54] font-medium text-sm"
                                onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                            >
                                <UserCircleIcon size={24} />
                                <span className="max-w-[100px] truncate">{user.nombre.split(' ')[0]}</span>
                                <CaretDownIcon size={16} />
                            </button>

                            {/* Dropdown de Usuario */}
                            {isAccountMenuOpen && (
                                <div
                                    className="absolute top-full right-0 z-10 mt-2 w-64 rounded-xl bg-white p-3 shadow-xl ring-1 ring-black/5 flex flex-col gap-2"
                                    onMouseLeave={() => setIsAccountMenuOpen(false)}
                                >

                                    {/* INFO DE ROL */}
                                    <div className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <IdentificationBadgeIcon size={18} />
                                            <span className="font-semibold">Rol:</span>
                                        </div>
                                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                                            user.rol === 'ADMIN'
                                                ? 'bg-purple-100 text-purple-700 border border-purple-200'
                                                : 'bg-blue-100 text-blue-700 border border-blue-200'
                                        }`}>
                                            {user.rol}
                                        </span>
                                    </div>

                                    {/* BOTÓN CAMBIAR ROL */}
                                    <button
                                        onClick={handleSwitchRole}
                                        disabled={isSwitchingRole}
                                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-[#002976] hover:bg-blue-50 transition-colors disabled:opacity-50"
                                    >
                                        <ArrowsLeftRightIcon size={20} weight="bold" />
                                        <span>
                                            {isSwitchingRole ? "Cambiando..." : "Cambiar Rol"}
                                        </span>
                                    </button>

                                    <div className="h-px bg-gray-100 my-1"></div>

                                    <button
                                        onClick={() => { logout(); setIsAccountMenuOpen(false); }}
                                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
                                    >
                                        <SignOutIcon size={20} />
                                        <span>Cerrar sesión</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Botón Menú Móvil */}
                    <button className="lg:hidden p-2 text-[#002976]" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                        <ListIcon size={32} />
                    </button>
                </div>

                {/* 4. Menú Móvil Desplegable */}
                {isMobileMenuOpen && (
                    <div className="absolute top-full left-0 w-full bg-white shadow-xl border-t border-gray-100 lg:hidden flex flex-col">
                        <ul className="flex flex-col p-4 gap-2">
                            <li><NavLink to="/" className={mobileNavLinkClasses} onClick={() => setIsMobileMenuOpen(false)}><HouseIcon size={22} /> Inicio</NavLink></li>
                            <li><NavLink to="/mis-reservas" className={mobileNavLinkClasses} onClick={() => setIsMobileMenuOpen(false)}><CalendarIcon size={22} /> Mis Reservas</NavLink></li>
                            <li><NavLink to="/salas-de-estudio" className={mobileNavLinkClasses} onClick={() => setIsMobileMenuOpen(false)}><BooksIcon size={22} /> Salas de Estudio</NavLink></li>
                            {user.rol === 'ADMIN' && (
                                <li><NavLink to="/admin/panel" className={mobileNavLinkClasses} onClick={() => setIsMobileMenuOpen(false)}><PresentationChartIcon size={22} /> Panel Admin</NavLink></li>
                            )}
                        </ul>

                        {/* Acciones Móvil */}
                        <div className="border-t border-gray-100 p-4 space-y-3">
                            {/* Info Rol Móvil */}
                            <div className="flex items-center justify-between px-2">
                                <span className="text-sm font-medium text-gray-500">Rol Actual:</span>
                                <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                                    user.rol === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                                }`}>
                                    {user.rol}
                                </span>
                            </div>

                            {/* Botón Cambiar Rol Móvil */}
                            <button
                                onClick={handleSwitchRole}
                                disabled={isSwitchingRole}
                                className="flex w-full items-center gap-3 px-3 py-3 text-base font-medium text-[#002976] hover:bg-blue-50 rounded-lg disabled:opacity-50"
                            >
                                <ArrowsLeftRightIcon size={22} />
                                {isSwitchingRole ? "Cambiando..." : "Cambiar Rol"}
                            </button>

                            {/* Botón Cerrar Sesión Móvil */}
                            <button
                                onClick={() => { setIsMobileAccountOpen(!isMobileAccountOpen); setIsMobileMenuOpen(false); }}
                                className="flex w-full items-center justify-between text-left"
                            >
                                <div className="flex items-center gap-3 px-3 py-1">
                                    <UserCircleIcon size={22} className="text-gray-500" />
                                    <span className="font-medium text-gray-700">{user.nombre}</span>
                                </div>
                                <CaretDownIcon size={16} className="text-gray-400 mr-2"/>
                            </button>

                            {/* Submenú móvil para logout si se expande la cuenta */}
                            {isMobileAccountOpen && (
                                <button onClick={logout} className="flex w-full items-center gap-3 px-6 py-2 text-base font-medium text-red-600 hover:bg-red-50 rounded-lg">
                                    <SignOutIcon size={22} /> Cerrar sesión
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </nav>
        );
    }

    // =================================================================
    //  VISTA PÚBLICA (NO LOGUEADO)
    // =================================================================
    return (
        <nav className="sticky top-0 z-[100] w-full bg-white shadow-lg">
            <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 p-4 lg:grid lg:grid-cols-3">

                {/* Logo */}
                <Link to="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
                    <img src={logoUfro} alt="Logo" className="h-[48px] w-auto" />
                    <span className="text-xl font-bold text-[#002976] hidden sm:block">BookFrontera</span>
                </Link>

                {/* Enlaces Públicos */}
                <ul className="hidden lg:flex justify-center gap-6 list-none p-0 m-0">
                    <li><a href="https://www.ufro.cl/servicios-online/" className="text-sm font-medium text-[#434a54] hover:text-[#002976]">Servicios Online</a></li>
                    <li><a href="https://campusvirtual.ufro.cl/" className="text-sm font-medium text-[#434a54] hover:text-[#002976]">Campus Virtual</a></li>
                    <li><a href="https://intranet.ufro.cl/" className="text-sm font-medium text-[#434a54] hover:text-[#002976]">Intranet</a></li>
                </ul>

                {/* Botón Login */}
                <div className="flex items-center justify-end">
                    <button onClick={openLoginModal} className="px-6 py-2.5 text-sm font-bold text-white bg-[#0a3fa6] rounded-xl hover:bg-[#083285] transition-colors shadow-md hover:shadow-lg transform active:scale-95 duration-150">
                        Iniciar sesión
                    </button>
                </div>
            </div>
        </nav>
    );
}