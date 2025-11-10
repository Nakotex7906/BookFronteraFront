export type TimeSlot = {
    id: string; label: string; start: string; end: string };

export interface Availability {
    roomId: string;
    slotId: string;
    available: boolean;
}

// Este tipo ahora debe coincidir con DTO de Spring
export type ReservationRequest = {
    roomId: string;
    startAt: string;  // <-- Coincide con req.startAt()
    endAt: string;    // <-- Coincide con req.endAt()
    addToGoogleCalendar: boolean; // <-- Coincide con req.addToGoogleCalendar()
};

export type ReservationResponse = {
    id: string;
};

// El DTO del Usuario (simplificado)
export type UserDto = {
    id: number;
    email: string;
    nombre: string;
    rol: 'STUDENT' | 'ADMIN';
};

// El DTO de la Sala (simplificado)
export type RoomDto = {
    id: number;
    name: string;
    capacity: number;
};

// El DTO de 'Reservation.Detail' que viene del backend
export type ReservationDetail = {
    id: number;
    startAt: string; // (string ISO, ej: "2025-11-10T14:00:00Z")
    endAt: string;
    room: RoomDto;
    user: UserDto;
};

// La respuesta completa del endpoint /my-reservations
export type MyReservationsResponse = {
    current: ReservationDetail | null;
    future: ReservationDetail[];
    past: ReservationDetail[];
};