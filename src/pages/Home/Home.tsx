import { useAvailability } from "../../hooks/useAvailability";
import { Hero } from "../../components/Hero/Hero";
import AvailabilityGrid from "../../components/Availability/AvailabilityGrid";
import { Legend } from "../../components/Availability/Legend";
import styles from "./Home.module.css";

export default function Home() {
    const today = new Date().toISOString().slice(0, 10);
    const { rooms, slots, matrix, loading } = useAvailability(today);

    return (
        <main>
            <Hero />
            <section className={styles.section}>
                <h2>Disponibilidad de Salas</h2>
                {loading ? <p>Cargando…</p> : (
                    <>
                        <AvailabilityGrid
                            rooms={rooms}
                            slots={slots}
                            data={matrix}
                            onSelect={(roomId, slotId) => {
                                console.log(`Selected room ${roomId} at slot ${slotId}`);
                                // abrir modal o navegar a /reservar?roomId=...&slotId=...
                            }}
                        />
                        <Legend />
                    </>
                )}
            </section>
        </main>
    );
}
