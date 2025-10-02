import Navbar from "../components/Navbar/Navbar";
import Home from "../pages/Home/Home";
import { Footer } from "../components/Footer/Footer";
import "../styles/globals.css";

export default function App() {
    return (
        <>
            <Navbar />
            <Home />
            <Footer />
        </>
    );
}
