import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AdminPanelPage from './AdminPanelPage';
import { RoomApi } from '../../services/RoomApi';

vi.mock('../../services/RoomApi');

const mockRooms = [
    { id: 1, name: "Sala Alpha", capacity: 5, floor: 1, equipment: ["PC"] },
    { id: 2, name: "Sala Beta", capacity: 10, floor: 2, equipment: ["Proyector"] }
];

describe('Página: AdminPanelPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('debe mostrar la lista de salas obtenidas de la API', async () => {
        (RoomApi.getAll as any).mockResolvedValue(mockRooms);

        render(<AdminPanelPage />);

        expect(screen.getByText("Cargando información...")).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText("Sala Alpha")).toBeInTheDocument();
            expect(screen.getByText("Sala Beta")).toBeInTheDocument();
        });
    });

    it('debe filtrar las salas por nombre usando el buscador', async () => {
        (RoomApi.getAll as any).mockResolvedValue(mockRooms);
        render(<AdminPanelPage />);

        await waitFor(() => expect(screen.getByText("Sala Alpha")).toBeInTheDocument());

        const searchInput = screen.getByPlaceholderText("Buscar por nombre...");
        fireEvent.change(searchInput, { target: { value: "Beta" } });

        expect(screen.queryByText("Sala Alpha")).not.toBeInTheDocument();
        expect(screen.getByText("Sala Beta")).toBeInTheDocument();
    });

    it('debe intentar eliminar una sala al confirmar en el modal', async () => {
        (RoomApi.getAll as any).mockResolvedValue(mockRooms);
        (RoomApi.delete as any).mockResolvedValue({});

        render(<AdminPanelPage />);
        await waitFor(() => expect(screen.getByText("Sala Alpha")).toBeInTheDocument());

        const deleteButtons = screen.getAllByTitle("Eliminar sala");
        fireEvent.click(deleteButtons[0]);

        await waitFor(() => {
            expect(screen.getByText("Eliminar Sala")).toBeInTheDocument();
            expect(screen.getByText("¿Estás seguro de que deseas eliminar la sala", { exact: false })).toBeInTheDocument();
        });

        const confirmButton = screen.getByRole('button', { name: "Confirmar" });
        fireEvent.click(confirmButton);

        expect(RoomApi.delete).toHaveBeenCalledWith(1);

        await waitFor(() => {
            expect(RoomApi.getAll).toHaveBeenCalledTimes(2);
        });
    });
});