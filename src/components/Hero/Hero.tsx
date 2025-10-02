import styles from "./Hero.module.css";

export function Hero() {
    return (
        <header className={styles.hero}>
            <div className={styles.heroContent}>
                <h1>Estudia en equipo</h1>
                <p>Encuentra y reserva la sala de estudio perfecta en el campus con facilidad.</p>
                <p>Colabora eficazmente con tus compañeros en un ambiente cómodo y productivo.</p>
                <button>Ver cómo funciona</button>
            </div>
        </header>
    );
}