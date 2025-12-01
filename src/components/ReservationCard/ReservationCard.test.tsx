import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ReservationCard } from './ReservationCard';

// Mock de datos
const mockReservation = {
    id: 123,
    startAt: "2024-07-23T10:00:00",
    endAt: "2024-07-23T11:00:00",
    room: {
        id: 1,
        name: "Sala de Estudio 1",
        capacity: 4,
        imageUrl: "https://res.cloudinary.com/demo/image/upload/v1/sala.jpg"
    },
    user: {
        id: 1,
        email: "test@ufro.cl",
        nombre: "Test User",
        rol: "STUDENT" as const
    }
};

describe('ReservationCard Component', () => {

    it('debe renderizar la imagen si viene del backend', () => {
        render(
            <ReservationCard
                reservation={mockReservation}
                onCancel={() => {}}
                layout="horizontal"
            />
        );

        const imageDiv = screen.getByRole('img', { name: /Imagen de Sala de Estudio 1/i });
        expect(imageDiv).toBeInTheDocument();
        expect(imageDiv).toHaveStyle(`background-image: url(${mockReservation.room.imageUrl})`);
    });

    it('debe llamar a onCancel cuando se confirma la alerta (OK)', () => {
        const handleCancel = vi.fn();
        // Simulamos que el usuario dice si (true)
        vi.spyOn(window, 'confirm').mockReturnValue(true);

        render(
            <ReservationCard
                reservation={mockReservation}
                onCancel={handleCancel}
                showActions={true}
            />
        );

        const cancelButton = screen.getByText("Cancelar");
        fireEvent.click(cancelButton);

        expect(handleCancel).toHaveBeenCalledWith(123);
    });

    it('NO debe llamar a onCancel si el usuario cancela la alerta', () => {
        const handleCancel = vi.fn();
        // Simulamos que el usuario dice no (false)
        vi.spyOn(window, 'confirm').mockReturnValue(false);

        render(
            <ReservationCard
                reservation={mockReservation}
                onCancel={handleCancel}
                showActions={true}
            />
        );

        const cancelButton = screen.getByText("Cancelar");
        fireEvent.click(cancelButton);

        // Verificamos que la función no fue llamada
        expect(handleCancel).not.toHaveBeenCalled();
    });
});