import Navbar from "../components/Navbar/Navbar";
import { Footer } from "../components/Footer/Footer";
import "../styles/globals.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "../pages/Home/Home";
import ReservationSuccess from "../pages/ReservationSuccess/ReservationSuccess";
import { ProtectedRoute } from "../components/ProtectedRoute";
import MyReservations from "../pages/MyReservations/MyReservations";
import { LoginModal } from "../components/LoginModal";
import StudyRooms from "../pages/StudyRooms/StudyRooms";
import TeamStudyInfo from "../pages/info/TeamStudyInfo.tsx";
import TimeManagementInfo from "../pages/info/TimeManagementInfo.tsx";
import EquipmentInfo from "../pages/info/EquipmentInfo.tsx";

function AppLayout() {
    const location = useLocation();

    // Define aquí rutas donde NO quieras ver el Navbar/Footer
    const noNavFooterPaths: string[] = [];
    const showNavFooter = !noNavFooterPaths.includes(location.pathname);

    return (
        // 1. Contenedor principal: Ocupa al menos el 100% de la altura de la ventana
        <div className="flex min-h-screen flex-col bg-[#f4f6f9]">

            {showNavFooter && <Navbar />}

            <LoginModal />

            <div className="flex flex-grow flex-col">
                <Routes>
                    {/* --- Rutas Públicas --- */}
                    <Route path="/" element={<Home />} />
                    {/* RUTAS DE INFORMACIÓN */}
                    <Route path="/info/equipo" element={<TeamStudyInfo />} />
                    <Route path="/info/tiempo" element={<TimeManagementInfo />} />
                    <Route path="/info/equipamiento" element={<EquipmentInfo />} />

                    {/* --- Rutas Protegidas --- */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/mis-reservas" element={<MyReservations />} />
                        <Route path="/salas-de-estudio" element={<StudyRooms />} />
                        <Route path="/reservation-success" element={<ReservationSuccess />} />
                    </Route>
                </Routes>
            </div>

            {/* El footer se renderiza al final del flex container */}
            {showNavFooter && <Footer />}
        </div>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <AppLayout />
        </BrowserRouter>
    );
}