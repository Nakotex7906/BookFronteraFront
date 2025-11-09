import Navbar from "../components/Navbar/Navbar";
import { Footer } from "../components/Footer/Footer";
import "../styles/globals.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import ReservationSuccess from "../pages/ReservationSuccess/ReservationSuccess";
import { ProtectedRoute } from "../components/ProtectedRoute";

function AppLayout() {
    const location = useLocation();
    const noNavFooterPaths = ["/login"];
    const showNavFooter = !noNavFooterPaths.includes(location.pathname);

    return (
        <>
            {showNavFooter && <Navbar />}
            <Routes>
                {/* --- Rutas Públicas --- */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />

                {/* --- Rutas Protegidas --- */}
                {/* Este 'Route' especial envuelve a todas las rutas hijas.
                  Usará <ProtectedRoute /> para decidir si renderiza
                  el <Outlet /> (las rutas hijas) o redirige a /login.
                */}
                <Route element={<ProtectedRoute />}>
                    <Route
                        path="/reservation-success"
                        element={<ReservationSuccess />}
                    />
                    {/* Si tuvieras más rutas protegidas, irían aquí: */}
                    {/* <Route path="/mis-reservas" element={<MisReservas />} /> */}
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