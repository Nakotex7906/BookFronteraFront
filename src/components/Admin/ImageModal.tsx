import { X } from '@phosphor-icons/react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    imageUrl?: string;
}

export default function ImageModal({ isOpen, onClose, imageUrl }: Props) {
    if (!isOpen || !imageUrl) return null;

    return (
        <div
            className="fixed inset-0 z-[300] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm transition-all"
            onClick={onClose}
        >
            <div
                className="relative bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-w-4xl w-full max-h-[90vh] flex flex-col"
                onClick={e => e.stopPropagation()} // Evita cierre al hacer clic dentro
            >
                {/* Header con botón de cerrar */}
                <div className="px-3 py-3 flex justify-end absolute top-0 right-0 w-full bg-gradient-to-b from-black/30 to-transparent p-2">
                    <button
                        onClick={onClose}
                        className="p-2 text-white bg-black/20 hover:bg-black/40 rounded-full transition-colors backdrop-blur-md"
                    >
                        <X size={24} weight="bold" />
                    </button>
                </div>

                {/* Condetendor de la imagen */}
                <div className="flex-1 flex items-center justify-center bg-gray-100 p-2">
                    <img
                        src={imageUrl}
                        alt="Vista previa de la sala"
                        className="w-full h-full object-contain rounded-lg"
                        style={{ maxHeight: '85vh' }}
                    />
                </div>
            </div>
        </div>
    );
}