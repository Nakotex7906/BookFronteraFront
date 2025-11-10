import Navbar from "../components/Navbar/Navbar";
import { Footer } from "../components/Footer/Footer";
import "../styles/globals.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import ReservationSuccess from "../pages/ReservationSuccess/ReservationSuccess";
import { ProtectedRoute } from "../components/ProtectedRoute";
import MyReservations from "../pages/MyReservations/MyReservations";

function AppLayout() {
    const location = useLocation();

    const noNavFooterPaths = ["/login", "/reservation-success"];
    const showNavFooter = !noNavFooterPaths.includes(location.pathname);

    return (
        <>
            {showNavFooter && <Navbar />}
            <Routes>
                {/* --- Rutas Públicas --- */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route
                    path="/reservation-success"
                    element={<ReservationSuccess />}
                />

                {/* --- Rutas Protegidas --- */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/mis-reservas" element={<MyReservations />} />
                    {/* <Route path="/perfil" element={<Perfil />} /> */}
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