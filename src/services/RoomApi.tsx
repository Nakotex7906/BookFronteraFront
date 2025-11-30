// src/services/RoomApi.ts
import { http } from "./http";

export interface Room {
    id: number;
    name: string;
    capacity: number;
    floor: number;
    equipment: string[];
}

// DTO para crear/editar
export interface RoomDto {
    id?: number;
    name: string;
    capacity: number;
    floor: number;
    equipment: string[];
}

export class RoomApi {
    // Obtener todas las salas
    static async getAll(): Promise<Room[]> {
        const { data } = await http.get<Room[]>("/rooms");
        return data;
    }

    // Crear sala
    static async create(room: RoomDto): Promise<Room> {
        const { data } = await http.post<Room>("/rooms", room);
        return data;
    }

    // Actualizar sala
    static async update(id: number, room: RoomDto): Promise<Room> {
        const { data } = await http.patch<Room>(`/rooms/${id}`, room);
        return data;
    }

    // Eliminar sala
    static async delete(id: number): Promise<void> {
        await http.delete(`/rooms/${id}`);
    }
}