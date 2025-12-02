import { http } from "./http";

export interface Room {
    id: number;
    name: string;
    capacity: number;
    floor: number;
    equipment: string[];
    imageUrl?: string;
}

export interface RoomDto {
    id?: number;
    name: string;
    capacity: number;
    floor: number;
    equipment: string[];
}

export class RoomApi {
    static async getAll(): Promise<Room[]> {
        const { data } = await http.get<Room[]>("/rooms");
        return data;
    }

    static async create(room: RoomDto, image?: File | null): Promise<Room> {
        const formData = new FormData();
        const roomBlob = new Blob([JSON.stringify(room)], { type: "application/json" });
        formData.append("room", roomBlob);
        if (image) formData.append("image", image);

        const { data } = await http.post<Room>("/rooms", formData);
        return data;
    }

    // --- ACTUALIZADO: Ahora soporta imagen ---
    static async update(id: number, room: RoomDto, image?: File | null): Promise<Room> {
        const formData = new FormData();

        // 1. DTO
        const roomBlob = new Blob([JSON.stringify(room)], { type: "application/json" });
        formData.append("room", roomBlob);

        // 2. Imagen (si el usuario seleccionó una nueva)
        if (image) {
            formData.append("image", image);
        }

        // Usamos PATCH con FormData
        const { data } = await http.patch<Room>(`/rooms/${id}`, formData);
        return data;
    }

    static async delete(id: number): Promise<void> {
        await http.delete(`/rooms/${id}`);
    }
}