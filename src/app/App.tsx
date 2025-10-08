import Navbar from "../components/Navbar/Navbar";
import { Footer } from "../components/Footer/Footer";
import "../styles/globals.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";

function AppLayout() {
    const location = useLocation();
    const noNavFooterPaths = ["/login"];
    const showNavFooter = !noNavFooterPaths.includes(location.pathname);

    return (
        <>
            {showNavFooter && <Navbar />}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
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
