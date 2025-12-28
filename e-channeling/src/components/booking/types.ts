export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  image?: string;
  fee: number;
}

export interface Hospital {
  id: string;
  name: string;
  location: string;
}

export interface AvailableDate {
  date: string;
  isAvailable: boolean;
}

export interface SessionSlot {
  id: string;
  name: string;
  startTime: string;
  icon?: string;
}

export type ForWhomType = "myself" | "someone_else";

export interface BookingState {
  // Step 1 data
  selectedDoctorId: string | null;
  selectedHospitalId: string | null;
  selectedHospitalName: string | null;
  selectedDate: string | null; // ISO format
  selectedSessionId: string | null;
  selectedSessionName: string | null;
  selectedSessionStartTime: string | null;

  // Step 2 data (will add later)
  forWhom: ForWhomType | null;

  // Step 3 data (will add later)
  patientDetails: {
    fullName: string;
    phone: string;
    email: string;
    nic: string;
    disease: string;
  };

  // Loading states
  isLoadingDoctor: boolean;
  isLoadingHospitals: boolean;
  isLoadingDates: boolean;
  isLoadingSessions: boolean;
  isCreatingBooking: boolean;

  // Error states
  error: string | null;
}

export interface BookingConfirmation {
  appointmentId: string;
  patientNumber: string;
  hospitalName: string;
  roomNumber: string;
  patientName: string;
  doctorName: string;
  date: string;
  time: string;
}

export interface Step1FormData {
  selectedHospitalId: string;
  selectedDate: string;
  selectedSessionId: string;
}

export interface SessionCard {
  id: string;
  hospitalId: string;
  hospitalName: string;
  hospitalLocation: string;
  date: string; 
  dateFormatted: string;
  startTime: string;
}