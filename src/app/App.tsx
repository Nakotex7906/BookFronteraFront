import Navbar from "../components/Navbar/Navbar";
import { Footer } from "../components/Footer/Footer";
import "../styles/globals.css";
import {Outlet} from "react-router-dom";

export default function App() {
    return (
        <>
            <Navbar />
            <Outlet />
            <Footer />
        </>
    );
}
