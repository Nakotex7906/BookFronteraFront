import React, { useState, useEffect } from 'react';
import type { RoomDto } from '../../services/RoomApi';
import { X, UploadSimple } from '@phosphor-icons/react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSave: (room: RoomDto, image?: File | null) => Promise<void>;
    initialData?: RoomDto | null;
}

export default function RoomModal({ isOpen, onClose, onSave, initialData }: Props) {
    const [name, setName] = useState('');
    const [capacity, setCapacity] = useState(1);
    const [floor, setFloor] = useState(1);
    const [equipmentStr, setEquipmentStr] = useState('');

    // Estados para la imagen
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setSelectedFile(null);
            if (initialData) {
                setName(initialData.name);
                setCapacity(initialData.capacity);
                setFloor(initialData.floor);
                setEquipmentStr(initialData.equipment ? initialData.equipment.join(', ') : '');
            } else {
                setName('');
                setCapacity(4);
                setFloor(1);
                setEquipmentStr('');
            }
        }
    }, [isOpen, initialData]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const equipmentArray = equipmentStr
                .split(',')
                .map(s => s.trim())
                .filter(s => s.length > 0);

            const roomData: RoomDto = {
                id: initialData?.id,
                name,
                capacity,
                floor,
                equipment: equipmentArray
            };

            await onSave(roomData, selectedFile);
            onClose();
        } catch (error) {
            console.error(error);
            alert("Ocurrió un error al guardar la sala.");
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-800">
                        {initialData ? 'Editar Sala' : 'Nueva Sala'}
                    </h3>
                    <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                            Nombre de la Sala
                        </label>
                        <input
                            type="text" required
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-sm font-medium"
                            value={name} onChange={e => setName(e.target.value)}
                            placeholder="Ej: Sala de Estudio A"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                                Capacidad
                            </label>
                            <input
                                type="number" min="1" required
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-sm font-medium"
                                value={capacity} onChange={e => setCapacity(parseInt(e.target.value))}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                                Piso
                            </label>
                            <input
                                type="number" min="1" required
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-sm font-medium"
                                value={floor} onChange={e => setFloor(parseInt(e.target.value))}
                            />
                        </div>
                    </div>

                    {/* INPUT DE IMAGEN */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                            {initialData ? "Cambiar Imagen (Opcional)" : "Imagen (Opcional)"}
                        </label>
                        <label className="flex items-center gap-3 px-4 py-2.5 border border-gray-200 border-dashed rounded-xl cursor-pointer hover:bg-gray-50 transition-colors group">
                            <UploadSimple size={20} className="text-blue-600 group-hover:scale-110 transition-transform" />
                            <span className="text-sm text-gray-600 truncate">
                                {selectedFile
                                    ? selectedFile.name
                                    : (initialData ? "Click para reemplazar imagen actual..." : "Seleccionar imagen...")
                                }
                            </span>
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                        </label>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                            Equipamiento
                        </label>
                        <input
                            type="text"
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-sm font-medium"
                            value={equipmentStr} onChange={e => setEquipmentStr(e.target.value)}
                            placeholder="Proyector, Pizarra, TV..."
                        />
                        <p className="text-[11px] text-gray-400 mt-1.5">Separa los elementos con comas.</p>
                    </div>

                    <div className="pt-2 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="px-6 py-2.5 text-sm font-bold text-white bg-[#0a3fa6] rounded-xl hover:bg-[#083285] transition-colors shadow-lg shadow-blue-900/10 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isSaving ? 'Guardando...' : 'Guardar Sala'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}