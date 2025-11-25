import {
    UsersThreeIcon,
    ChatsCircleIcon,
    HandshakeIcon,
    CheckCircleIcon,
    LightbulbIcon,
    PresentationChartIcon,
    StudentIcon
} from "@phosphor-icons/react";
import { Link } from "react-router-dom";

export default function TeamStudyInfo() {
    return (
        <main className="w-full font-sans text-gray-800">

            {/* HERO SECTION */}
            <section className="bg-gradient-to-r from-[#002976] to-[#004e92] py-24 px-6 text-center text-white relative overflow-hidden">
                {/* Elementos decorativos de fondo */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#0052cc]/30 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>

                <div className="mx-auto max-w-4xl relative z-10">
                    <div className="mb-8 flex justify-center">
                        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/20 shadow-xl">
                            <UsersThreeIcon size={56} weight="duotone" className="text-white" />
                        </div>
                    </div>
                    <h1 className="mb-6 text-4xl font-extrabold md:text-6xl tracking-tight">
                        Estudia en Equipo
                    </h1>
                    <p className="text-xl text-blue-100 opacity-95 max-w-2xl mx-auto leading-relaxed">
                        La colaboración es el motor del aprendizaje. Descubre espacios diseñados específicamente para potenciar el trabajo grupal.
                    </p>
                </div>
            </section>

            {/* BENEFIT CARDS (Grid) */}
            <section className="py-20 px-6 bg-white">
                <div className="mx-auto max-w-6xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-[#002976] mb-4">
                            ¿Por qué reservar una sala grupal?
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Olvídate de estudiar en los pasillos o en cafeterías ruidosas.
                        </p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-3">
                        <div className="group rounded-2xl border border-gray-100 bg-[#f8fbff] p-8 transition-all duration-300 hover:shadow-xl hover:border-blue-200 hover:-translate-y-1">
                            <div className="mb-6 inline-block rounded-xl bg-white p-3 shadow-sm text-[#002976] group-hover:bg-[#002976] group-hover:text-white transition-colors">
                                <ChatsCircleIcon size={32} weight="fill" />
                            </div>
                            <h3 className="text-xl font-bold text-[#002976] mb-3">Debate Activo</h3>
                            <p className="text-gray-600 leading-relaxed">
                                En la biblioteca piden silencio. Aquí, discutir ideas, ensayar disertaciones y pensar en voz alta es parte del proceso.
                            </p>
                        </div>

                        <div className="group rounded-2xl border border-gray-100 bg-[#f8fbff] p-8 transition-all duration-300 hover:shadow-xl hover:border-blue-200 hover:-translate-y-1">
                            <div className="mb-6 inline-block rounded-xl bg-white p-3 shadow-sm text-[#002976] group-hover:bg-[#002976] group-hover:text-white transition-colors">
                                <HandshakeIcon size={32} weight="fill" />
                            </div>
                            <h3 className="text-xl font-bold text-[#002976] mb-3">Colaboración Real</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Mesas amplias donde caben todos los computadores. Conexión eléctrica y espacio para que nadie se quede fuera.
                            </p>
                        </div>

                        <div className="group rounded-2xl border border-gray-100 bg-[#f8fbff] p-8 transition-all duration-300 hover:shadow-xl hover:border-blue-200 hover:-translate-y-1">
                            <div className="mb-6 inline-block rounded-xl bg-white p-3 shadow-sm text-[#002976] group-hover:bg-[#002976] group-hover:text-white transition-colors">
                                <UsersThreeIcon size={32} weight="fill" />
                            </div>
                            <h3 className="text-xl font-bold text-[#002976] mb-3">Flexibilidad</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Desde duplas de estudio intensivo hasta grupos grandes de proyecto. Tenemos la sala que se ajusta a tu equipo.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* USE CASES SECTION (Split Layout) - NUEVA SECCIÓN  */}
            <section className="py-20 px-6 bg-[#f4f6f9]">
                <div className="mx-auto max-w-6xl">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">

                        {/* Contenido Visual (Izquierda) */}
                        <div className="relative h-[450px] w-full rounded-3xl bg-white border border-gray-200 p-8 shadow-lg flex flex-col justify-center items-center overflow-hidden">
                            {/* Representación abstracta de una mesa de trabajo */}
                            <div className="absolute inset-0 bg-[#eef6ff] opacity-50"></div>

                            <div className="relative z-10 w-full max-w-sm">
                                <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 mb-4 flex items-center gap-4">
                                    <div className="bg-blue-100 p-3 rounded-full text-[#002976]">
                                        <PresentationChartIcon size={24} weight="fill" />
                                    </div>
                                    <div>
                                        <div className="h-2 w-24 bg-gray-200 rounded mb-2"></div>
                                        <div className="h-2 w-32 bg-gray-100 rounded"></div>
                                    </div>
                                </div>
                                <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 mb-4 flex items-center gap-4 translate-x-4">
                                    <div className="bg-green-100 p-3 rounded-full text-green-700">
                                        <LightbulbIcon size={24} weight="fill" />
                                    </div>
                                    <div>
                                        <div className="h-2 w-20 bg-gray-200 rounded mb-2"></div>
                                        <div className="h-2 w-40 bg-gray-100 rounded"></div>
                                    </div>
                                </div>
                                <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 flex items-center gap-4">
                                    <div className="bg-purple-100 p-3 rounded-full text-purple-700">
                                        <StudentIcon size={24} weight="fill" />
                                    </div>
                                    <div>
                                        <div className="h-2 w-28 bg-gray-200 rounded mb-2"></div>
                                        <div className="h-2 w-16 bg-gray-100 rounded"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Texto (Derecha) */}
                        <div>
                            <div className="inline-block px-4 py-1 rounded-full bg-blue-100 text-[#002976] font-semibold text-sm mb-4">
                                Escenarios Ideales
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-[#002976] mb-6 leading-tight">
                                Diseñado para cada etapa de tu semestre
                            </h2>
                            <div className="space-y-8">
                                <div className="flex gap-4">
                                    <div className="shrink-0 mt-1">
                                        <CheckCircleIcon size={24} className="text-[#0052cc]" weight="fill" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-gray-900">Preparación de Exámenes</h4>
                                        <p className="text-gray-600 mt-1">Repasen materia, háganse preguntas y resuelvan dudas difíciles en conjunto antes de la prueba.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="shrink-0 mt-1">
                                        <CheckCircleIcon size={24} className="text-[#0052cc]" weight="fill" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-gray-900">Proyectos Semestrales</h4>
                                        <p className="text-gray-600 mt-1">Conecten sus notebooks, usen la pizarra para diagramar y avancen en el informe final sin distracciones.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="shrink-0 mt-1">
                                        <CheckCircleIcon size={24} className="text-[#0052cc]" weight="fill" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-gray-900">Tutorías entre Pares</h4>
                                        <p className="text-gray-600 mt-1">El espacio perfecto para enseñar a un compañero o recibir ayuda en esa asignatura complicada.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* TIPS SECTION */}
            <section className="py-20 px-6 bg-white border-t border-gray-100">
                <div className="mx-auto max-w-4xl text-center">
                    <h2 className="text-2xl font-bold text-[#002976] mb-12">
                        Tips para una sesión productiva
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-4 text-left">
                        {[
                            "Define un objetivo claro antes de entrar.",
                            "Asigna un moderador para guiar el estudio.",
                            "Haz pausas activas de 5 min cada hora.",
                            "Usa la pizarra para visualizar conceptos."
                        ].map((tip, idx) => (
                            <div key={idx} className="flex items-center gap-4 rounded-xl bg-[#f8fbff] p-5 border border-blue-50">
                                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-[#002976] font-bold text-sm shrink-0">
                                    {idx + 1}
                                </div>
                                <span className="text-gray-700 font-medium">{tip}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA FOOTER */}
            <section className="py-24 px-6 text-center bg-[#002976] text-white">
                <h2 className="text-3xl font-bold mb-6">
                    ¿Tu equipo ya está listo?
                </h2>
                <p className="text-blue-200 mb-10 max-w-lg mx-auto text-lg">
                    No pierdan tiempo buscando dónde sentarse. Reserven su espacio ahora y aseguren el éxito del semestre.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Link to="/" className="rounded-xl bg-white px-8 py-4 font-bold text-[#002976] transition hover:bg-gray-100 shadow-lg hover:-translate-y-1">
                        Reservar Sala Ahora
                    </Link>
                    <Link to="/info/equipamiento" className="rounded-xl border border-white/30 bg-transparent px-8 py-4 font-bold text-white transition hover:bg-white/10">
                        Ver Equipamiento
                    </Link>
                </div>
            </section>
        </main>
    );
}