import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";

/**
 * Datos del carrusel (Con las rutas de información actualizadas)
 */
const SLIDES = [
    {
        title: "Estudia en equipo",
        text1: "Encuentra y reserva la sala de estudio perfecta en el campus con facilidad.",
        text2: "Colabora eficazmente con tus compañeros en un ambiente cómodo y productivo.",
        buttonText: "Cómo funciona",
        link: "/info/equipo"
    },
    {
        title: "Gestiona tu tiempo",
        text1: "Organiza tus horarios de estudio sin complicaciones desde cualquier lugar.",
        text2: "Evita filas y asegura tu espacio con anticipación.",
        buttonText: "Ver beneficios",
        link: "/info/tiempo"
    },
    {
        title: "Espacios conectados",
        text1: "Salas equipadas con pizarra, proyector y todo lo que necesitas.",
        text2: "Lleva tus proyectos grupales al siguiente nivel.",
        buttonText: "Ver equipamiento",
        link: "/info/equipamiento"
    }
];

export function Hero() {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Funciones de Navegación
    const nextSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
    }, []);

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
    };

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
    };

    // Temporizador Automático
    useEffect(() => {
        const intervalId = setInterval(nextSlide, 5000);
        return () => clearInterval(intervalId);
    }, [nextSlide, currentIndex]);

    const currentSlide = SLIDES[currentIndex];

    return (
        <header className="relative overflow-hidden bg-gradient-to-r from-[#002976] to-[#004e92] text-white">

            {/* Decoración de Fondo (Círculos abstractos) */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
                <div className="absolute -top-20 -left-20 w-96 h-96 bg-[#0052cc] rounded-full blur-[80px]"></div>
                <div className="absolute top-1/2 right-0 w-80 h-80 bg-white rounded-full blur-[100px] opacity-20"></div>
            </div>

            {/* Estilos de Animación */}
            <style>{`
                @keyframes fadeSlide {
                    0% { opacity: 0; transform: translateX(20px); }
                    100% { opacity: 1; transform: translateX(0); }
                }
                .animate-fade-slide {
                    animation: fadeSlide 0.6s ease-out forwards;
                }
            `}</style>

            <div className="mx-auto max-w-[1200px] px-4 py-24 md:px-8 relative flex items-center justify-center min-h-[550px] z-10">

                {/* BOTÓN ANTERIOR */}
                <button
                    onClick={prevSlide}
                    className="
                        absolute left-2 md:left-8 z-20
                        p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all
                        text-white backdrop-blur-md border border-white/10
                    "
                    aria-label="Anterior"
                >
                    <CaretLeftIcon size={28} weight="bold" />
                </button>

                {/* CONTENIDO DINÁMICO  */}
                <div className="w-full max-w-[900px] text-center px-8 md:px-16">
                    <div key={currentIndex} className="animate-fade-slide flex flex-col items-center">
                        <h1 className="mb-6 text-4xl font-extrabold leading-[1.1] md:text-[4rem] tracking-tight drop-shadow-sm">
                            {currentSlide.title}
                        </h1>

                        <div className="space-y-4 mb-10 max-w-3xl">
                            <p className="text-lg leading-relaxed text-blue-50 opacity-95 md:text-xl font-light">
                                {currentSlide.text1}
                            </p>
                            <p className="text-lg leading-relaxed text-blue-50 opacity-95 md:text-xl font-light">
                                {currentSlide.text2}
                            </p>
                        </div>

                        <Link
                            to={currentSlide.link}
                            className="
                                inline-flex items-center gap-2
                                rounded-xl bg-white px-10 py-4
                                text-[1.1rem] font-bold text-[#002976]
                                transition-all duration-300
                                hover:bg-gray-100 hover:-translate-y-1 hover:shadow-xl
                                shadow-lg shadow-black/10
                                cursor-pointer no-underline
                            "
                        >
                            {currentSlide.buttonText}
                        </Link>
                    </div>
                </div>

                {/* BOTÓN SIGUIENTE */}
                <button
                    onClick={nextSlide}
                    className="
                        absolute right-2 md:right-8 z-20
                        p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all
                        text-white backdrop-blur-md border border-white/10
                    "
                    aria-label="Siguiente"
                >
                    <CaretRightIcon size={28} weight="bold" />
                </button>

                {/* INDICADORES */}
                <div className="absolute bottom-12 left-0 right-0 flex justify-center gap-3 z-20">
                    {SLIDES.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            aria-label={`Ir al slide ${index + 1}`}
                            className={`
                                h-1.5 rounded-full transition-all duration-300
                                ${currentIndex === index
                                ? "w-8 bg-white opacity-100 shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                                : "w-4 bg-white/40 hover:bg-white/60"
                            }
                            `}
                        />
                    ))}
                </div>

            </div>
        </header>
    );
}