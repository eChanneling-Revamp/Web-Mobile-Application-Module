export type AppointmentType = "In-Person" | "Telehealth";
export type AppointmentStatus = "upcoming" | "past" | "cancelled";

export interface Appointment {
  id: string;
  doctorName: string;
  specialty: string;
  date: string;
  type: AppointmentType;
  time: string;
  location?: string;
  status: AppointmentStatus;
  actions: {
    canJoin: boolean;
    canCancel: boolean;
    canReschedule: boolean;
  };
}

export interface User {
  name: string;
  email: string;
}