import {
    MonitorIcon,
    WifiHighIcon,
    ChalkboardTeacherIcon,
    PlugIcon,
    SunIcon,
    ArmchairIcon,
    LaptopIcon,
    BroadcastIcon,
    LightningIcon
} from "@phosphor-icons/react";
import { Link } from "react-router-dom";

export default function EquipmentInfo() {

    // Lista de características principales
    const features = [
        { icon: WifiHighIcon, title: "Wi-Fi 6", desc: "Red dedicada de alta velocidad y baja latencia para que tus investigaciones vuelen." },
        { icon: ChalkboardTeacherIcon, title: "Pizarras Muro a Muro", desc: "Espacio infinito para diagramar. Marcadores disponibles en recepción." },
        { icon: MonitorIcon, title: "Proyección HD", desc: "Pantallas de 50\" o proyectores listos para conectar vía HDMI." },
        { icon: PlugIcon, title: "Energía para Todos", desc: "Torres de enchufes y puertos USB integrados en cada mesa." },
        { icon: SunIcon, title: "Iluminación Focalizada", desc: "Luz fría de 4000K calibrada para mantener la concentración sin cansar la vista." },
        { icon: ArmchairIcon, title: "Sillas Ergonómicas", desc: "Soporte lumbar ajustable pensado para sesiones de estudio de más de 2 horas." },
    ];

    return (
        <main className="w-full font-sans text-gray-800">

            {/* HERO SECTION */}
            <section className="bg-gradient-to-r from-[#002976] to-[#004e92] py-24 px-6 text-center text-white relative overflow-hidden">
                {/* Decoración de fondo (Ondas abstractas) */}
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute top-10 left-10 w-96 h-96 bg-white rounded-full blur-[100px]"></div>
                    <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#0052cc] rounded-full blur-[80px]"></div>
                </div>

                <div className="mx-auto max-w-4xl relative z-10">
                    <div className="mb-8 flex justify-center">
                        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/20 shadow-xl">
                            <MonitorIcon size={56} weight="duotone" className="text-white" />
                        </div>
                    </div>
                    <h1 className="mb-6 text-4xl font-extrabold md:text-6xl tracking-tight">
                        Equipamiento de Primera
                    </h1>
                    <p className="text-xl text-blue-100 opacity-95 max-w-2xl mx-auto leading-relaxed">
                        No necesitas traer tu escritorio completo. Nuestras salas están tecnológicamente preparadas para que solo te preocupes de aprender.
                    </p>
                </div>
            </section>

            {/* SPECS GRID */}
            <section className="py-20 px-6 bg-white">
                <div className="mx-auto max-w-6xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-[#002976] mb-4">
                            Todo lo que necesitas para rendir
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Estándares de calidad pensados para la exigencia universitaria.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((item, idx) => (
                            <div key={idx} className="group bg-[#f8fbff] rounded-2xl p-8 border border-gray-100 hover:border-blue-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                <div className="mb-6 inline-block rounded-xl bg-white p-3 shadow-sm text-[#002976] group-hover:bg-[#002976] group-hover:text-white transition-colors">
                                    <item.icon size={32} weight="fill" />
                                </div>
                                <h3 className="text-xl font-bold text-[#002976] mb-3">{item.title}</h3>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* VISUAL SPLIT SECTION (Conectividad) */}
            <section className="py-20 px-6 bg-[#f4f6f9]">
                <div className="mx-auto max-w-6xl">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">

                        {/* Visual (Izquierda) - Representación de Conectividad */}
                        <div className="relative h-[450px] w-full rounded-3xl bg-gradient-to-br from-[#002976] to-[#001540] p-8 shadow-2xl flex flex-col items-center justify-center overflow-hidden text-white">
                            {/* Círculos de señal */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-[600px] h-[600px] border border-white/5 rounded-full animate-[pulse_4s_infinite]"></div>
                                <div className="w-[450px] h-[450px] border border-white/10 rounded-full"></div>
                                <div className="w-[300px] h-[300px] border border-white/20 rounded-full"></div>
                            </div>

                            {/* Icono Central */}
                            <div className="relative z-10 bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 mb-8">
                                <BroadcastIcon size={64} weight="duotone" className="text-blue-300" />
                            </div>

                            <div className="relative z-10 grid grid-cols-3 gap-4 w-full max-w-sm">
                                <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl text-center border border-white/10">
                                    <LaptopIcon size={32} className="mx-auto mb-2 text-blue-200" />
                                    <span className="text-xs font-bold text-blue-100">Laptop</span>
                                </div>
                                <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl text-center border border-white/10">
                                    <MonitorIcon size={32} className="mx-auto mb-2 text-blue-200" />
                                    <span className="text-xs font-bold text-blue-100">Screen</span>
                                </div>
                                <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl text-center border border-white/10">
                                    <LightningIcon size={32} className="mx-auto mb-2 text-yellow-300" />
                                    <span className="text-xs font-bold text-blue-100">Power</span>
                                </div>
                            </div>
                        </div>

                        {/* Texto (Derecha) */}
                        <div>
                            <div className="inline-block px-4 py-1 rounded-full bg-blue-100 text-[#002976] font-semibold text-sm mb-4">
                                Conectividad Total
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-[#002976] mb-6 leading-tight">
                                Conectar y presentar nunca fue tan fácil
                            </h2>
                            <p className="text-lg text-gray-600 mb-8">
                                Olvídate de los problemas técnicos antes de una presentación. Nuestras salas están diseñadas "Plug & Play".
                            </p>

                            <ul className="space-y-6">
                                <li className="flex gap-4">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eef6ff] text-[#002976]">
                                        <span className="font-bold">1</span>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-gray-900">Conexión HDMI Universal</h4>
                                        <p className="text-gray-600 text-sm mt-1">Cable disponible en mesa. Compatible con la mayoría de los notebooks modernos.</p>
                                    </div>
                                </li>
                                <li className="flex gap-4">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eef6ff] text-[#002976]">
                                        <span className="font-bold">2</span>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-gray-900">Redundancia de Red</h4>
                                        <p className="text-gray-600 text-sm mt-1">Si el Wi-Fi falla (raro, pero pasa), tienes puertos Ethernet RJ45 en la pared.</p>
                                    </div>
                                </li>
                                <li className="flex gap-4">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eef6ff] text-[#002976]">
                                        <span className="font-bold">3</span>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-gray-900">Audio Integrado</h4>
                                        <p className="text-gray-600 text-sm mt-1">Algunas salas cuentan con parlantes básicos para videos o conferencias.</p>
                                    </div>
                                </li>
                            </ul>
                        </div>

                    </div>
                </div>
            </section>

            {/* INFO BOX (Kit de Supervivencia) */}
            <section className="py-20 px-6 bg-white border-t border-gray-100">
                <div className="mx-auto max-w-3xl text-center">
                    <h2 className="text-2xl font-bold text-[#002976] mb-8">
                         Kit de Supervivencia Tecnológica
                    </h2>
                    <div className="bg-[#f8fbff] rounded-2xl p-8 border border-blue-50 text-left">
                        <p className="text-gray-700 mb-4 font-medium text-center">
                            Aunque tenemos casi todo, te recomendamos traer:
                        </p>
                        <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-3">
                                <div className="h-2 w-2 rounded-full bg-orange-400"></div>
                                <span>Adaptador USB-C a HDMI (MacBooks)</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="h-2 w-2 rounded-full bg-blue-400"></div>
                                <span>Tus propios plumones (si prefieres colores específicos)</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="h-2 w-2 rounded-full bg-green-400"></div>
                                <span>Cargador de notebook (por si acaso)</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="h-2 w-2 rounded-full bg-purple-400"></div>
                                <span>Botella de agua (mantente hidratado)</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA FOOTER */}
            <section className="py-24 px-6 text-center bg-[#002976] text-white">
                <h2 className="text-3xl font-bold mb-6">
                    Ven a probarlo tú mismo
                </h2>
                <p className="text-blue-200 mb-10 max-w-lg mx-auto text-lg">
                    La mejor tecnología del campus está esperando por tu equipo.
                </p>
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 bg-white text-[#002976] px-8 py-4 rounded-xl font-bold shadow-lg hover:bg-gray-100 transition-all hover:-translate-y-1"
                >
                    Explorar salas disponibles
                    <span className="text-xl">→</span>
                </Link>
            </section>
        </main>
    );
}