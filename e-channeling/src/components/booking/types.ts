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
export type AppointmentType = "in-person" | "video-consultation";

// Backend enums
export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER"
}

export enum AppointmentStatus {
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
  NO_SHOW = "NO_SHOW",
  RESCHEDULED = "RESCHEDULED",
  UNPAID = "UNPAID"
}

export enum PaymentStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
  CANCELLED = "CANCELLED",
  UNPAID = "UNPAID"
}

export interface BookingState {
  // Step 1 data
  selectedDoctorId: string | null;
  selectedHospitalId: string | null;
  selectedHospitalName: string | null;
  selectedDate: string | null; // ISO format
  selectedSessionId: string | null;
  selectedSessionName: string | null;
  selectedSessionStartTime: string | null;

  // Step 2 data
  forWhom: ForWhomType | null;

  // Step 3 data - Updated to match backend schema
  patientDetails: {
    fullName: string;
    phone: string;
    email: string;
    nic: string;
    dateOfBirth: string; // YYYY-MM-DD format
    gender: Gender | "";
    emergencyContactPhone: string;
    disease: string; // Optional notes
  };

  // Step 4 - Payment data
  paymentDetails: {
    cardNumber: string;
    cardHolderName: string;
    expiryDate: string; // MM/YY
    cvv: string;
  };

  // Confirmation data from backend
  confirmationData: CreateBookingResponse | null;

  // Loading states
  isLoadingDoctor: boolean;
  isLoadingSessions: boolean;
  isCreatingBooking: boolean;
  isProcessingPayment: boolean;

  // Error states
  bookingError: string | null;
  paymentError: string | null;
}

// API Request/Response types matching backend
export interface CreateBookingRequest {
  userId: string;
  sessionId: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  patientNIC: string;
  patientDateOfBirth: string; // YYYY-MM-DD
  patientGender: Gender;
  emergencyContactPhone?: string;
  medicalReports?: string;
}

export interface CreateBookingResponse {
  success: boolean;
  message: string;
  data: {
    appointmentId: string;
    appointmentNumber: string;
    sessionId: string;
    bookedByUserId: string;
    patientName: string;
    patientEmail: string;
    patientPhone: string;
    patientNIC: string;
    patientDateOfBirth: Date;
    patientGender: Gender;
    status: AppointmentStatus;
    consultationFee: number;
    paymentStatus: PaymentStatus;
    queuePosition: number;
  };
}

export interface PaymentRequest {
  appointmentNumber: string;
  amount: number;
  cardNumber: string;
  cardHolderName: string;
  expiryDate: string; // MM/YY
  cvv: string;
}

export interface PaymentResponse {
  success: boolean;
  data: {
    payments: boolean;
    updateAppointment: any;
  };
  message: string;
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
  appointmentType: AppointmentType;
}