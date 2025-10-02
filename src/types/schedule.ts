export interface TimeSlot {
    id: string;           // "08-09"
    label: string;        // "08:00 - 09:00"
}
export interface Availability {
    roomId: string;
    slotId: string;
    available: boolean;
}
