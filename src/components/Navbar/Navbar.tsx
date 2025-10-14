import styles from "./Navbar.module.css";
import { Link } from "react-router-dom";
import logoUfro from '../../assets/icons/Logo_Ufro.png';
import { useAuth } from "../../context/AuthContext.tsx";

export default function Navbar() {
    const { user, isLoading, logout } = useAuth();

    return (
        <nav className={styles.navbar} role="navigation" aria-label="Principal">
            <div className={styles.navContainer}>
                <a href="/" className={styles.logo} aria-label="Inicio BookFrontera">
                    <img src={logoUfro} alt="Logo" className={styles.logoImage} />
                    <span className={styles.logoText}>BookFrontera</span>
                </a>

                <ul className={styles.navLinks}>
                    <li><a href="https://www.ufro.cl/servicios-online/">Servicios Online</a></li>
                    <li><a href="https://www.ufro.cl/">Universidad</a></li>
                    <li><a href="https://campusvirtual.ufro.cl/">Campus Virtual</a></li>
                    <li><a href="https://intranet.ufro.cl/">Intranet</a></li>
                </ul>

                <div className={styles.navActions}>
                    <button type="button" className={styles.helpButton} aria-haspopup="menu" aria-expanded="false">
                        Ayuda <span className={styles.chevron} aria-hidden="true">▾</span>
                    </button>
                    {isLoading ? null : user ? (
                        <>
                            <span className={styles.userName}>Hola, {user.nombre}</span>
                            <button onClick={logout} className={styles.loginButton}>Cerrar sesión</button>
                        </>
                    ) : (
                        <Link to="/login" className={styles.loginButton}>Iniciar sesión</Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
