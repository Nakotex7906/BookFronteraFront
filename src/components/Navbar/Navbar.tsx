import styles from "./Navbar.module.css";
import {Link} from "react-router-dom";
import logoUfro from '../../assets/icons/Logo_Ufro.png';

export default function Navbar() {
    return (
        <nav className={styles.navbar} role="navigation" aria-label="Principal">
            <div className={styles.navContainer}>
                <a href="/" className={styles.logo} aria-label="Inicio BookFrontera">
                    <img src={logoUfro} alt="Logo" className={styles.logoImage} />
                    <span className={styles.logoText}>BookFrontera</span>
                </a>

                <ul className={styles.navLinks}>
                    <li><a href="/servicios">Servicios Online</a></li>
                    <li><a href="/webmail">Webmail</a></li>
                    <li><a href="/campus">Campus Virtual</a></li>
                    <li><a href="/intranet">Intranet</a></li>
                </ul>

                <div className={styles.navActions}>
                    <button type="button" className={styles.helpButton} aria-haspopup="menu" aria-expanded="false">
                        Ayuda <span className={styles.chevron} aria-hidden="true">▾</span>
                    </button>
                    <Link to="/login" className={styles.loginButton}>Iniciar sesión</Link>
                </div>
            </div>
        </nav>
    );
}
