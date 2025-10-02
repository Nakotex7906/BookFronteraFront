import styles from "./Navbar.module.css";

export default function Navbar() {
    return (
        <nav className={styles.navbar} role="navigation" aria-label="Principal">
            <div className={styles.navContainer}>
                <a href="/" className={styles.logo} aria-label="Inicio BookFrontera">
                    <span aria-hidden="true" className={styles.logoMark} />
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
                    <button type="button" className={styles.loginButton}>Login</button>
                </div>
            </div>
        </nav>
    );
}
