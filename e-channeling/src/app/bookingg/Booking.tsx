import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/* ---------- Types ---------- */
export type Step = 1 | 2 | 3 | 4;

interface PatientDetails {
  fullName: string;
  phone: string;
  email: string;
  age: string;
  gender: string;
  reason: string;
}

interface BookingState {
  step: Step;
  patient: PatientDetails;
}

