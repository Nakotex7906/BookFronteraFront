import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AdminPanelPage from './AdminPanelPage';
import { RoomApi } from '../../services/RoomApi';

// Mockeamos el servicio RoomApi para no llamar al backend real
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
        // Simulamos que la API responde con mockRooms
        (RoomApi.getAll as any).mockResolvedValue(mockRooms);

        render(<AdminPanelPage />);

        // Verificar estado de carga
        expect(screen.getByText("Cargando información...")).toBeInTheDocument();

        // Esperar a que aparezcan los datos
        await waitFor(() => {
            expect(screen.getByText("Sala Alpha")).toBeInTheDocument();
            expect(screen.getByText("Sala Beta")).toBeInTheDocument();
        });
    });

    it('debe filtrar las salas por nombre usando el buscador', async () => {
        (RoomApi.getAll as any).mockResolvedValue(mockRooms);
        render(<AdminPanelPage />);

        await waitFor(() => expect(screen.getByText("Sala Alpha")).toBeInTheDocument());

        // Escribir Beta en el buscador
        const searchInput = screen.getByPlaceholderText("Buscar por nombre...");
        fireEvent.change(searchInput, { target: { value: "Beta" } });

        // Verificar que Alpha desaparece y Beta se queda
        expect(screen.queryByText("Sala Alpha")).not.toBeInTheDocument();
        expect(screen.getByText("Sala Beta")).toBeInTheDocument();
    });

    it('debe intentar eliminar una sala al confirmar', async () => {
        (RoomApi.getAll as any).mockResolvedValue(mockRooms);
        (RoomApi.delete as any).mockResolvedValue({});

        const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);

        render(<AdminPanelPage />);
        // Esperamos la carga inicial
        await waitFor(() => expect(screen.getByText("Sala Alpha")).toBeInTheDocument());

        // El título en el JSX es "Eliminar sala", no solo "Eliminar"
        const deleteButtons = screen.getAllByTitle("Eliminar sala");
        fireEvent.click(deleteButtons[0]);

        // Verificamos la llamada a borrar
        expect(confirmSpy).toHaveBeenCalled();
        expect(RoomApi.delete).toHaveBeenCalledWith(1);

        // Esperamos a que el componente termine de recargar los datos tras el borrado.
        await waitFor(() => {
            expect(RoomApi.getAll).toHaveBeenCalledTimes(2);
        });
    });
});