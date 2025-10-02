import styles from "./Legend.module.css";

export function Legend() {
    return (
        <div className={styles.legend}>
            <div className={styles.legendItem}>
                <span className={`${styles.legendColor} ${styles.available}`} />
                <span>Disponible</span>
            </div>
            <div className={styles.legendItem}>
                <span className={`${styles.legendColor} ${styles.occupied}`} />
                <span>No Disponible</span>
            </div>
            <div className={styles.legendItem}>
                <span className={`${styles.legendColor} ${styles.selected}`} />
                <span>Seleccionado</span>
            </div>
        </div>
    );
}
