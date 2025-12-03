import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import RoomModal from './RoomModal';

describe('Componente: RoomModal', () => {
    const handleClose = vi.fn();
    const handleSave = vi.fn();

    it('no debe renderizarse si isOpen es false', () => {
        render(
            <RoomModal
                isOpen={false}
                onClose={handleClose}
                onSave={handleSave}
            />
        );
        // No debería haber nada en el documento
        expect(screen.queryByText(/Nueva Sala/i)).not.toBeInTheDocument();
    });

    it('debe renderizar el formulario correctamente cuando está abierto', () => {
        render(
            <RoomModal
                isOpen={true}
                onClose={handleClose}
                onSave={handleSave}
            />
        );
        expect(screen.getByText("Nueva Sala")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Ej: Sala de Estudio A")).toBeInTheDocument();
    });

    it('debe llamar a onSave con los datos del formulario', async () => {
        render(
            <RoomModal
                isOpen={true}
                onClose={handleClose}
                onSave={handleSave}
            />
        );

        // Llenar el formulario
        fireEvent.change(screen.getByPlaceholderText("Ej: Sala de Estudio A"), { target: { value: "Sala Gamma" } });

        const inputs = screen.getAllByRole('spinbutton');
        fireEvent.change(inputs[0], { target: { value: "8" } }); // Capacidad
        fireEvent.change(inputs[1], { target: { value: "3" } }); // Piso

        fireEvent.change(screen.getByPlaceholderText("Proyector, Pizarra, TV..."), { target: { value: "TV, HDMI" } });

        // 2. Guardar
        const saveBtn = screen.getByText("Guardar Sala");
        fireEvent.click(saveBtn);

        // 3. Verificar llamada
        expect(handleSave).toHaveBeenCalledWith({
            id: undefined,
            name: "Sala Gamma",
            capacity: 8,
            floor: 3,
            equipment: ["TV", "HDMI"]
        }, null);

        // Esperamos a que el estado interno isSaving vuelva a false.
        await waitFor(() => {
            expect(screen.getByText("Guardar Sala")).toBeInTheDocument();
        });
    });

    it('debe cargar datos iniciales si se está editando', () => {
        const initialData = {
            id: 99,
            name: "Sala Existente",
            capacity: 20,
            floor: 1,
            equipment: ["PC"]
        };

        render(
            <RoomModal
                isOpen={true}
                onClose={handleClose}
                onSave={handleSave}
                initialData={initialData}
            />
        );

        expect(screen.getByText("Editar Sala")).toBeInTheDocument();
        expect(screen.getByDisplayValue("Sala Existente")).toBeInTheDocument();
    });
});