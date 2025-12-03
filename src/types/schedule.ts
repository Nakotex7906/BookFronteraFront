export type TimeSlot = {
    id: string;
    label: string;
    start: string;
    end: string
};

export interface Availability {
    roomId: string;
    slotId: string;
    available: boolean;
}

// Objeto que contiene las 3 listas
export type DailyAvailabilityResponse = {
    rooms: import('../types/room').Room[];
    slots: TimeSlot[];
    availability: Availability[];
};

export type ReservationRequest = {
    roomId: string;
    startAt: string;
    endAt: string;
    addToGoogleCalendar: boolean;
};

export type ReservationResponse = {
    id: string;
};

// Tipos para mis reservas
export type UserDto = {
    id: number;
    email: string;
    nombre: string;
    rol: 'STUDENT' | 'ADMIN';
};

export type RoomDto = {
    id: number;
    name: string;
    capacity: number;
};

export type ReservationDetail = {
    id: number;
    startAt: string;
    endAt: string;
    room: RoomDto;
    user: UserDto;
};

export type MyReservationsResponse = {
    current: ReservationDetail | null;
    future: ReservationDetail[];
    past: ReservationDetail[];
};
export type ReservationOnBehalfRequest = {
    roomId: string;
    startAt: string;
    endAt: string;
    othersEmail: string;
};