import {
    ClockIcon,
    CalendarCheckIcon,
    BellRingingIcon,
    HourglassHighIcon,
    CheckCircleIcon,
    DeviceMobileIcon,
    GoogleLogoIcon
} from "@phosphor-icons/react";
import { Link } from "react-router-dom";

export default function TimeManagementInfo() {
    return (
        <main className="w-full font-sans text-gray-800">

            {/*HERO SECTION*/}
            <section className="bg-gradient-to-r from-[#002976] to-[#004e92] py-24 px-6 text-center text-white relative overflow-hidden">
                {/* Decoración de fondo (Reloj abstracto) */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border-[2px] border-white/5 rounded-full"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] border-[2px] border-white/10 rounded-full"></div>

                <div className="mx-auto max-w-4xl relative z-10">
                    <div className="mb-8 flex justify-center">
                        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/20 shadow-xl">
                            <ClockIcon size={56} weight="duotone" className="text-white" />
                        </div>
                    </div>
                    <h1 className="mb-6 text-4xl font-extrabold md:text-6xl tracking-tight">
                        Tu tiempo vale oro
                    </h1>
                    <p className="text-xl text-blue-100 opacity-95 max-w-2xl mx-auto leading-relaxed">
                        Entre clases, pruebas y vida social, cada minuto cuenta. Organiza tu semana con anticipación y olvídate del estrés de buscar sala.
                    </p>
                </div>
            </section>

            {/* BENEFIT CARDS (Grid)*/}
            <section className="py-20 px-6 bg-white">
                <div className="mx-auto max-w-6xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-[#002976] mb-4">
                            Toma el control de tu horario
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            BookFrontera está diseñado para adaptarse al ritmo universitario.
                        </p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-3">
                        {/* Card 1 */}
                        <div className="group rounded-2xl border border-gray-100 bg-[#f8fbff] p-8 transition-all duration-300 hover:shadow-xl hover:border-blue-200 hover:-translate-y-1">
                            <div className="mb-6 inline-block rounded-xl bg-white p-3 shadow-sm text-[#002976] group-hover:bg-[#002976] group-hover:text-white transition-colors">
                                <CalendarCheckIcon size={32} weight="fill" />
                            </div>
                            <h3 className="text-xl font-bold text-[#002976] mb-3">Reserva Anticipada</h3>
                            <p className="text-gray-600 leading-relaxed">
                                No esperes a último minuto. Asegura tu espacio hasta con 7 días de antelación y planifica tu semana de estudio con calma.
                            </p>
                        </div>

                        {/* Card 2 */}
                        <div className="group rounded-2xl border border-gray-100 bg-[#f8fbff] p-8 transition-all duration-300 hover:shadow-xl hover:border-blue-200 hover:-translate-y-1">
                            <div className="mb-6 inline-block rounded-xl bg-white p-3 shadow-sm text-[#002976] group-hover:bg-[#002976] group-hover:text-white transition-colors">
                                <DeviceMobileIcon size={32} weight="fill" />
                            </div>
                            <h3 className="text-xl font-bold text-[#002976] mb-3">Acceso 24/7</h3>
                            <p className="text-gray-600 leading-relaxed">
                                La plataforma está siempre disponible. Revisa la disponibilidad desde tu celular mientras vas en la micro o desde tu casa.
                            </p>
                        </div>

                        {/* Card 3 */}
                        <div className="group rounded-2xl border border-gray-100 bg-[#f8fbff] p-8 transition-all duration-300 hover:shadow-xl hover:border-blue-200 hover:-translate-y-1">
                            <div className="mb-6 inline-block rounded-xl bg-white p-3 shadow-sm text-[#002976] group-hover:bg-[#002976] group-hover:text-white transition-colors">
                                <GoogleLogoIcon size={32} weight="fill" />
                            </div>
                            <h3 className="text-xl font-bold text-[#002976] mb-3">Sincronización</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Añade tus reservas directamente a Google Calendar con un clic para que recibas notificaciones antes de que empiece tu bloque.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* VISUAL SPLIT SECTION (Calendar/Workflow) */}
            <section className="py-20 px-6 bg-[#f4f6f9]">
                <div className="mx-auto max-w-6xl">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">

                        {/* Texto Izquierda */}
                        <div className="order-2 lg:order-1">
                            <div className="inline-block px-4 py-1 rounded-full bg-blue-100 text-[#002976] font-semibold text-sm mb-4">
                                Flujo de Estudio
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-[#002976] mb-6 leading-tight">
                                El ciclo perfecto de organización
                            </h2>
                            <div className="space-y-8">
                                <div className="flex gap-4">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white border border-blue-100 text-[#002976] shadow-sm font-bold text-lg">
                                        1
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-gray-900">Encuentra tu ventana</h4>
                                        <p className="text-gray-600 mt-1">Identifica esas "ventanas" libres entre clases y aprovéchalas en lugar de perder el tiempo.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white border border-blue-100 text-[#002976] shadow-sm font-bold text-lg">
                                        2
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-gray-900">Reserva en segundos</h4>
                                        <p className="text-gray-600 mt-1">Selecciona bloque y sala. Recibe tu confirmación al instante. Sin burocracia.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white border border-blue-100 text-[#002976] shadow-sm font-bold text-lg">
                                        3
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-gray-900">Enfoque Total</h4>
                                        <p className="text-gray-600 mt-1">Llega a tu sala reservada y dedica 60 minutos de concentración ininterrumpida.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contenido Visual (Derecha) - Representación de Calendario */}
                        <div className="order-1 lg:order-2 relative h-[500px] w-full rounded-3xl bg-white border border-gray-200 p-8 shadow-lg flex flex-col items-center justify-center overflow-hidden">
                            <div className="absolute inset-0 bg-[#eef6ff] opacity-40"></div>

                            {/* Mockup de Calendario */}
                            <div className="relative z-10 w-[300px] bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                                {/* Header Calendario */}
                                <div className="bg-[#002976] p-4 flex items-center justify-between text-white">
                                    <span className="font-bold">Mi Agenda</span>
                                    <BellRingingIcon weight="fill" />
                                </div>
                                {/* Cuerpo Calendario */}
                                <div className="p-4 space-y-3">
                                    {/* Bloque Clase */}
                                    <div className="flex gap-3 text-sm opacity-50">
                                        <span className="text-gray-500 font-mono w-12 text-right">08:30</span>
                                        <div className="flex-1 bg-gray-100 p-2 rounded text-gray-500 font-medium border-l-4 border-gray-300">
                                            Clase: Cálculo II
                                        </div>
                                    </div>

                                    {/* Bloque Libre -> Reserva */}
                                    <div className="flex gap-3 text-sm relative">
                                        <span className="text-gray-500 font-mono w-12 text-right pt-2">10:00</span>
                                        <div className="flex-1 bg-blue-50 p-3 rounded-lg border border-blue-100 shadow-sm transform scale-105 transition-transform">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="font-bold text-[#002976]">Estudio Grupal</span>
                                                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                            </div>
                                            <p className="text-xs text-blue-600">Sala 204 • Confirmado</p>
                                        </div>
                                        {/* Cursor simulado */}
                                        <div className="absolute -right-2 top-8">
                                            <svg className="w-8 h-8 text-gray-800 drop-shadow-md" viewBox="0 0 24 24" fill="currentColor"><path d="M7 2l12 11.2-5.8.5 3.3 7.3-2.2.9-3.2-7.4-4.4 4z"/></svg>
                                        </div>
                                    </div>

                                    {/* Bloque Clase */}
                                    <div className="flex gap-3 text-sm opacity-50">
                                        <span className="text-gray-500 font-mono w-12 text-right">11:30</span>
                                        <div className="flex-1 bg-gray-100 p-2 rounded text-gray-500 font-medium border-l-4 border-gray-300">
                                            Clase: Física
                                        </div>
                                    </div>
                                </div>
                                {/* Footer Mockup */}
                                <div className="bg-gray-50 p-3 text-center text-xs text-gray-400 border-t border-gray-100">
                                    Sincronizado con Google Calendar
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* TIPS SECTION */}
            <section className="py-20 px-6 bg-white border-t border-gray-100">
                <div className="mx-auto max-w-4xl">
                    <h2 className="text-3xl font-bold text-[#002976] mb-12 text-center">
                        Técnicas para aprovechar tu reserva
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-6">
                        <div className="flex items-start gap-4 rounded-xl bg-[#f8fbff] p-6 border border-blue-50 hover:shadow-md transition-shadow">
                            <HourglassHighIcon size={32} className="text-[#0052cc] shrink-0" weight="duotone" />
                            <div>
                                <h4 className="font-bold text-gray-900 mb-1">Técnica Pomodoro</h4>
                                <p className="text-sm text-gray-600">Divide tu hora en bloques de 25 min de foco y 5 de descanso. Es ideal para sesiones cortas.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 rounded-xl bg-[#f8fbff] p-6 border border-blue-50 hover:shadow-md transition-shadow">
                            <CheckCircleIcon size={32} className="text-[#0052cc] shrink-0" weight="duotone" />
                            <div>
                                <h4 className="font-bold text-gray-900 mb-1">Objetivos Micro</h4>
                                <p className="text-sm text-gray-600">No intentes "estudiar todo". Define una meta pequeña: "Terminar 3 ejercicios".</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA FOOTER */}
            <section className="py-24 px-6 text-center bg-[#002976] text-white">
                <h2 className="text-3xl font-bold mb-6">
                    Organízate y rinde más
                </h2>
                <p className="text-blue-200 mb-10 max-w-lg mx-auto text-lg">
                    El tiempo perdido buscando dónde estudiar no vuelve. Reserva tu sala ahora y haz que tu tiempo cuente.
                </p>
                <div className="flex justify-center gap-4">
                    <Link to="/" className="rounded-xl bg-white px-8 py-4 font-bold text-[#002976] transition hover:bg-gray-100 shadow-lg hover:-translate-y-1">
                        Ver Disponibilidad
                    </Link>
                </div>
            </section>
        </main>
    );
}