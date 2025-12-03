import { http } from "./http";
import type {
    DailyAvailabilityResponse,
    ReservationRequest,
    ReservationResponse,
    MyReservationsResponse,
    ReservationOnBehalfRequest,
    ReservationDetail
} from "../types/schedule";
import { AxiosError } from "axios";

function errorMessage(e: unknown): string {
    if (e instanceof AxiosError) {
        const msg =
            (e.response?.data as any)?.message ??
            (e.response?.data as any)?.error ??
            e.message;
        return msg || "Error de red";
    }
    return (e as any)?.message ?? "Error de red";
}

export class AvailabilityApi {
    // Debe retornar Promise<DailyAvailabilityResponse>
    static async getAvailability(
        date: string,
        signal?: AbortSignal
    ): Promise<DailyAvailabilityResponse> {
        try {
            const { data } = await http.get<DailyAvailabilityResponse>("/availability", {
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

    static async getMyReservations(): Promise<MyReservationsResponse> {
        try {
            const { data } = await http.get<MyReservationsResponse>("/reservations/my-reservations");
            return data;
        } catch (e) {
            throw new Error(errorMessage(e));
        }
    }

    static async cancelReservation(id: number): Promise<void> {
        try {
            await http.delete(`/reservations/${id}`);
        } catch (e) {
            throw new Error(errorMessage(e));
        }
    }

    static async createOnBehalf(
        payload: ReservationOnBehalfRequest
    ): Promise<void> {
        try {
            await http.post("/reservations/on-behalf", payload);
        } catch (e) {
            throw new Error(errorMessage(e));
        }
    }


    // (ADMIN) Permite ver quién tiene reservada una sala específica
    static async getReservationsByRoom(roomId: number): Promise<ReservationDetail[]> {
        try {
            const { data } = await http.get<ReservationDetail[]>(`/room/${roomId}`);
            return data;
        } catch (e) {
            throw new Error(errorMessage(e));
        }
    }

}