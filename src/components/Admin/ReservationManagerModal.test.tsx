import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ReservationManagerModal from './ReservationManagerModal';
import { AvailabilityApi } from '../../services/AvailabilityApi';

// Mockeamos la API
vi.mock('../../services/AvailabilityApi');

const mockReservations = [
    {
        id: 101,
        startAt: "2025-01-01T10:00:00",
        endAt: "2025-01-01T11:00:00",
        room: { id: 1, name: "Sala 1", capacity: 4 },
        user: { id: 1, email: "student@ufro.cl", nombre: "Juan Perez", rol: "STUDENT" }
    }
];

describe('Componente: ReservationManagerModal', () => {
    const handleClose = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('no debe renderizar nada si isOpen es false', () => {
        render(
            <ReservationManagerModal
                isOpen={false}
                onClose={handleClose}
                roomId={1}
                roomName="Sala 1"
            />
        );
        expect(screen.queryByText("Gestionar Reservas")).not.toBeInTheDocument();
    });

    it('debe cargar y mostrar las reservas al abrirse', async () => {
        (AvailabilityApi.getReservationsByRoom as any).mockResolvedValue(mockReservations);

        render(
            <ReservationManagerModal
                isOpen={true}
                onClose={handleClose}
                roomId={1}
                roomName="Sala Alpha"
            />
        );

        // Verificar título y nombre de sala
        expect(screen.getByText("Gestionar Reservas")).toBeInTheDocument();
        expect(screen.getByText("Sala Alpha")).toBeInTheDocument();

        // Esperar a que cargue la reserva simulada
        await waitFor(() => {
            expect(screen.getByText("Juan Perez")).toBeInTheDocument();
            expect(screen.getByText("(student@ufro.cl)")).toBeInTheDocument();
        });
    });

    it('debe mostrar mensaje si no hay reservas', async () => {
        (AvailabilityApi.getReservationsByRoom as any).mockResolvedValue([]);

        render(
            <ReservationManagerModal
                isOpen={true}
                onClose={handleClose}
                roomId={1}
                roomName="Sala Beta"
            />
        );

        await waitFor(() => {
            expect(screen.getByText("No hay reservas activas para esta sala.")).toBeInTheDocument();
        });
    });

    it('debe abrir modal de confirmación y eliminar reserva', async () => {
        (AvailabilityApi.getReservationsByRoom as any).mockResolvedValue(mockReservations);
        (AvailabilityApi.cancelReservation as any).mockResolvedValue({});

        render(
            <ReservationManagerModal
                isOpen={true}
                onClose={handleClose}
                roomId={1}
                roomName="Sala Alpha"
            />
        );

        await waitFor(() => expect(screen.getByText("Juan Perez")).toBeInTheDocument());

        const deleteBtn = screen.getByTitle("Cancelar y eliminar reserva");
        fireEvent.click(deleteBtn);

        expect(screen.getByText("Eliminar Reserva")).toBeInTheDocument();

        expect(screen.getAllByText(/Juan Perez/).length).toBeGreaterThanOrEqual(1);

        const confirmBtn = screen.getByText("Confirmar");
        fireEvent.click(confirmBtn);

        await waitFor(() => {
            expect(AvailabilityApi.cancelReservation).toHaveBeenCalledWith(101);
            expect(AvailabilityApi.getReservationsByRoom).toHaveBeenCalledTimes(2);
        });
    });
});