export function Hero() {
    return (
        <header
            // .hero
            // He usado un valor arbitrario para replicar el degradado exacto
            className="bg-[linear-gradient(135deg,_#0052cc_0%,_#4c9aff_100%)] px-8 py-24 text-center text-white"
        >
            {/* .heroContent */}
            <div className="mx-auto max-w-[900px]">
                {/* .heroContent h1 (móvil primero) */}
                <h1 className="mb-4 text-4xl font-extrabold leading-[1.2] md:text-[3.5rem]">
                    Estudia en equipo
                </h1>

                {/* .heroContent p (móvil primero) */}
                <p className="mb-8 text-base leading-relaxed opacity-95 md:text-xl">
                    Encuentra y reserva la sala de estudio perfecta en el campus con
                    facilidad.
                </p>
                <p className="mb-8 text-base leading-relaxed opacity-95 md:text-xl">
                    Colabora eficazmente con tus compañeros en un ambiente cómodo y
                    productivo.
                </p>

                {/* .heroContent button */}
                <button
                    className="
                        rounded-lg bg-white/25 px-10 py-4
                        text-[1.1rem] font-semibold text-white
                        transition-all duration-300
                        hover:bg-white/35 hover:-translate-y-0.5
                    "
                >
                    Ver cómo funciona
                </button>
            </div>
        </header>
    );
}