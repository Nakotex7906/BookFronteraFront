import { http } from "./http";
import type { Room } from "../types/room";
import type {
    TimeSlot,
    Availability,
    ReservationRequest,
    ReservationResponse,
    MyReservationsResponse,
} from "../types/schedule";
import { AxiosError } from "axios";

function errorMessage(e: unknown): string {
    if (e instanceof AxiosError) {
        // Intenta leer un mensaje de error del backend
        const msg =
            (e.response?.data as any)?.message ??
            (e.response?.data as any)?.error ??
            e.message;
        return msg || "Error de red";
    }
    return (e as any)?.message ?? "Error de red";
}

export class AvailabilityApi {
    static async getRooms(signal?: AbortSignal): Promise<Room[]> {
        try {
            const { data } = await http.get<Room[]>("rooms", { signal });
            return data;
        } catch (e) {
            throw new Error(errorMessage(e));
        }
    }

    static async getSlots(signal?: AbortSignal): Promise<TimeSlot[]> {
        try {
            const { data } = await http.get<TimeSlot[]>("slots", { signal });
            return data;
        } catch (e) {
            throw new Error(errorMessage(e));
        }
    }

    static async getAvailability(
        date: string,
        signal?: AbortSignal
    ): Promise<Availability[]> {
        try {
            const { data } = await http.get<Availability[]>("/availability", {
                params: { date },
                signal,
            });
            return data;
        } catch (e) {
            throw new Error(errorMessage(e));
        }
    }

    static async createReservation(
        payload: ReservationRequest
    ): Promise<ReservationResponse> {
        try {
            const { data } = await http.post<ReservationResponse>(
                "/reservations",
                payload
            );
            return data;
        } catch (e) {
            throw new Error(errorMessage(e));
        }
    }

    /**
     * Obtiene las reservas del usuario autenticado.
     */
    static async getMyReservations(): Promise<MyReservationsResponse> {
        try {
            const { data } = await http.get<MyReservationsResponse>("/reservations/my-reservations");
            return data;
        } catch (e) {
            throw new Error(errorMessage(e));
        }
    }

    /**
     * Cancela una reserva por su ID.
     */
    static async cancelReservation(id: number): Promise<void> {
        try {
            await http.delete(`/reservations/${id}`);
        } catch (e) {
            throw new Error(errorMessage(e));
        }
    }

}
