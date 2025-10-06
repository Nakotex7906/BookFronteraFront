export type TimeSlot = {
    id: string; label: string; start: string; end: string };

export interface Availability {
    roomId: string;
    slotId: string;
    available: boolean;
}
export type ReservationRequest = {
    roomId: string;
    slotId: string;
    date: string;        // "2025-10-06"
    userId: string;
};
export type ReservationResponse = {
    id: string;
};
