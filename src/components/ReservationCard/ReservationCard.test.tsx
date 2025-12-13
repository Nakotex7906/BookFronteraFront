import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ReservationCard } from './ReservationCard';

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

    it('debe llamar a onCancel al hacer clic en el botón cancelar', () => {
        const handleCancel = vi.fn();

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

});