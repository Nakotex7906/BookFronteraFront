import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AvailabilityGrid from './AvailabilityGrid';

// --- DATOS MOCK ---
const mockRooms = [
    { id: "1", name: "Sala A", capacity: 5, equipment: [] },
    { id: "2", name: "Sala B", capacity: 10, equipment: [] }
];

const mockSlots = [
    { id: "08:30-09:30", label: "Bloque 1", start: "08:30", end: "09:30" },
    { id: "09:40-10:40", label: "Bloque 2", start: "09:40", end: "10:40" }
];

// Matriz de disponibilidad:
// Sala A (1) -> Bloque 1: Disponible, Bloque 2: Ocupado
// Sala B (2) -> Bloque 1: Ocupado, Bloque 2: Disponible
const mockData = [
    { roomId: "1", slotId: "08:30-09:30", available: true },
    { roomId: "1", slotId: "09:40-10:40", available: false },
    { roomId: "2", slotId: "08:30-09:30", available: false },
    { roomId: "2", slotId: "09:40-10:40", available: true }
];

describe('AvailabilityGrid Component', () => {

    it('debe renderizar las salas y los bloques horarios', () => {
        render(
            <AvailabilityGrid
                rooms={mockRooms}
                slots={mockSlots}
                data={mockData}
                onSelect={() => {}}
            />
        );

        expect(screen.getByText("Bloque 1")).toBeInTheDocument();
        expect(screen.getByText("Bloque 2")).toBeInTheDocument();

        expect(screen.getByText(/Sala A/i)).toBeInTheDocument();
        expect(screen.getByText(/Sala B/i)).toBeInTheDocument();
    });

    it('debe permitir seleccionar un bloque disponible', () => {
        const handleSelect = vi.fn();

        render(
            <AvailabilityGrid
                rooms={mockRooms}
                slots={mockSlots}
                data={mockData}
                onSelect={handleSelect}
            />
        );

        // Buscamos el botón de Sala A en Bloque 1 (Disponible)
        // Usamos el 'title' que pusiste en el componente para identificarlo
        const availableBtn = screen.getByTitle(/Sala A, Bloque 1: Disponible/i);

        fireEvent.click(availableBtn);

        expect(handleSelect).toHaveBeenCalledWith("1", "08:30-09:30");

    });

    it('NO debe permitir seleccionar un bloque no disponible (ocupado)', () => {
        const handleSelect = vi.fn();

        render(
            <AvailabilityGrid
                rooms={mockRooms}
                slots={mockSlots}
                data={mockData}
                onSelect={handleSelect}
            />
        );

        // Buscamos el botón de Sala A en Bloque 2 (No disponible)
        const occupiedBtn = screen.getByTitle(/Sala A, Bloque 2: No disponible/i);

        fireEvent.click(occupiedBtn);

        expect(handleSelect).not.toHaveBeenCalled();

        expect(occupiedBtn).toBeDisabled();
    });
});