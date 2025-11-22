import Navbar from "../components/Navbar/Navbar";
import { Footer } from "../components/Footer/Footer";
import "../styles/globals.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "../pages/Home/Home";
import ReservationSuccess from "../pages/ReservationSuccess/ReservationSuccess";
import { ProtectedRoute } from "../components/ProtectedRoute";
import MyReservations from "../pages/MyReservations/MyReservations";
import { LoginModal } from "../components/LoginModal";
import StudyRooms from "../pages/StudyRooms/StudyRooms.tsx";

function AppLayout() {
    const location = useLocation();

    const noNavFooterPaths = ["/reservation-success"];
    const showNavFooter = !noNavFooterPaths.includes(location.pathname);

    return (
        <>
            {showNavFooter && <Navbar />}
            <LoginModal />

            <Routes>
                {/* --- Rutas Públicas --- */}
                <Route path="/" element={<Home />} />
                <Route
                    path="/reservation-success"
                    element={<ReservationSuccess />}
                />

                {/* --- Rutas Protegidas --- */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/mis-reservas" element={<MyReservations />} />
                    <Route path="/salas-de-estudio" element={<StudyRooms />} />
                </Route>

            </Routes>
            {showNavFooter && <Footer />}
        </>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <AppLayout />
        </BrowserRouter>
    );
}