import { useAvailability } from "../../hooks/useAvailability";
import { Hero } from "../../components/Hero/Hero";
import AvailabilityGrid from "../../components/Availability/AvailabilityGrid";
import { Legend } from "../../components/Availability/Legend";

export default function Home() {
    const today = new Date().toISOString().slice(0, 10);
    const { rooms, slots, matrix, loading } = useAvailability(today);

    return (
        <main>
            <Hero />

            {/* --- .section --- */}
            <section className="mx-auto max-w-[1200px] px-8 py-16">

                {/* --- .section h2 --- */}
                <h2 className="mb-12 text-center text-4xl font-bold text-[#1a1a1a]">
                    Disponibilidad de Salas
                </h2>

                {loading ? (
                    <p className="text-center text-[1.1rem] text-[#666]">
                        Cargando…
                    </p>
                ) : (
                    <>
                        <AvailabilityGrid
                            rooms={rooms}
                            slots={slots}
                            data={matrix}
                            onSelect={(roomId, slotId) => {
                                console.log(`Selected room ${roomId} at slot ${slotId}`);
                                // TODO: navegar a /reservar?roomId=...&slotId=...
                            }}
                        />
                        <Legend />
                    </>
                )}
            </section>
        </main>
    );
}