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