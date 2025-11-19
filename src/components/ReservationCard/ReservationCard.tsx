import type { ReservationDetail } from "../../types/schedule";

// Función helper para formatear fechas
const formatReservationDate = (isoString: string) => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat("es-CL", {
        dateStyle: "long",
    }).format(date);
};

// Función helper para formatear horas
const formatReservationTime = (startISO: string, endISO: string) => {
    const start = new Date(startISO);
    const end = new Date(endISO);
    const timeFormat = new Intl.DateTimeFormat("es-CL", {
        hour: "numeric",
        minute: "2-digit",
    });
    return `${timeFormat.format(start)} - ${timeFormat.format(end)}`;
};


// --- Props ---
type Props = {
    reservation: ReservationDetail & {
        room: { imageUrl?: string; name: string }
    };
    onCancel: (id: number) => void;
    isCancelling?: boolean;
    showActions?: boolean;
    layout?: 'default' | 'horizontal' | 'vertical';
};


// --- Sub-componentes (para ordenar el código) ---

// Botones (Estilo "Stitch" unificado)
const btnBase = "flex items-center justify-center gap-2 h-10 px-4 rounded-lg text-sm font-bold transition-colors";
const btnModify = `bg-blue-100 text-blue-700 hover:bg-blue-200 ${btnBase} disabled:opacity-70`;
const btnCancel = `bg-red-100 text-red-600 hover:bg-red-200 ${btnBase} disabled:opacity-70`;

// --- CORRECCIÓN AQUÍ: Quité 'onCancel' de los props, ya que no se usaba ---
const ActionButtons = ({ isCancelling, handleCancelClick, isVertical = false }: any) => (
    <div className={`flex items-center gap-2 ${isVertical ? 'w-full mt-auto' : 'mt-4'}`}>
        <button
            className={`${btnModify} ${isVertical ? 'w-full' : ''}`}
            disabled={true}
        >
            <span className="material-symbols-outlined text-base"></span>
            <span>Modificar</span>
        </button>
        <button
            className={`${btnCancel} ${isVertical ? 'w-full' : ''}`}
            onClick={handleCancelClick}
            disabled={isCancelling}
        >
            <span className="material-symbols-outlined text-base"></span>
            <span>{isCancelling ? "Cancelando..." : "Cancelar"}</span>
        </button>
    </div>
);

// Info de la Reserva
const ReservationInfo = ({ reservation }: { reservation: Props['reservation'] }) => (
    <div>
        <h3 className="text-lg font-bold text-gray-900">
            {reservation.room.name}
        </h3>
        <p className="text-sm text-gray-600 mt-1">
            Fecha: {formatReservationDate(reservation.startAt)}
        </p>
        <p className="text-sm text-gray-600">
            Hora: {formatReservationTime(reservation.startAt, reservation.endAt)}
        </p>
    </div>
);

// Imagen de la Reserva (usa background-image para replicar el HTML)
const ReservationImage = ({ imageUrl, alt, className }: any) => (
    <div className={`flex-shrink-0 w-full ${className}`}>
        <div
            className="w-full h-full bg-cover bg-center rounded-lg"
            style={{ backgroundImage: `url(${imageUrl})`, backgroundColor: '#f0f0f0' }}
            role="img"
            aria-label={alt}
        ></div>
    </div>
);


// --- Componente Principal ---
export function ReservationCard({
                                    reservation,
                                    onCancel,
                                    isCancelling = false,
                                    showActions = true,
                                    layout = 'default'
                                }: Props) {

    const handleCancelClick = () => {
        if (window.confirm("¿Estás seguro de que quieres cancelar esta reserva?")) {
            onCancel(reservation.id);
        }
    };

    const { imageUrl, name } = reservation.room;

    // --- Layout: 'vertical' (Para Reservas Futuras) ---
    if (layout === 'vertical') {
        return (
            <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col gap-4">
                {imageUrl && (
                    <ReservationImage
                        imageUrl={imageUrl}
                        alt={`Imagen de ${name}`}
                        className="h-40" // Altura del HTML de Stitch
                    />
                )}
                <ReservationInfo reservation={reservation} />
                {showActions && (
                    <ActionButtons
                        isCancelling={isCancelling}
                        handleCancelClick={handleCancelClick}
                        isVertical={true}
                    />
                )}
            </div>
        );
    }

    // --- Layout: 'horizontal' (Para Reserva Actual) ---
    if (layout === 'horizontal') {
        return (
            <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col md:flex-row items-start gap-4">
                <div className="flex-1">
                    <ReservationInfo reservation={reservation} />
                    {showActions && (
                        <ActionButtons
                            isCancelling={isCancelling}
                            handleCancelClick={handleCancelClick}
                        />
                    )}
                </div>
                {imageUrl && (
                    <ReservationImage
                        imageUrl={imageUrl}
                        alt={`Imagen de ${name}`}
                        className="md:w-1/3 h-48" // Tamaño del HTML de Stitch
                    />
                )}
            </div>
        );
    }

    // --- Layout: 'default' (Para Reservas Pasadas) ---
    // (Info a la izquierda, botones a la derecha (si se muestran), sin imagen)
    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col md:flex-row items-start gap-4">
            <div className="flex-1">
                <ReservationInfo reservation={reservation} />
            </div>
            {showActions && (
                <div className="flex-shrink-0">
                    <ActionButtons
                        isCancelling={isCancelling}
                        handleCancelClick={handleCancelClick}
                    />
                </div>
            )}
        </div>
    );
}