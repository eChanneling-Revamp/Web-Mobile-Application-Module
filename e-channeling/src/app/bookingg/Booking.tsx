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

/* ---------- Initial State ---------- */
const initialState: BookingState = {
  step: 1,
  patient: {
    fullName: "",
    phone: "",
    email: "",
    age: "",
    gender: "",
    reason: "",
  },
};

/* ---------- Slice ---------- */
const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    setStep(state, action: PayloadAction<Step>) {
      state.step = action.payload;
    },
    setPatientDetails(state, action: PayloadAction<Partial<PatientDetails>>) {
      state.patient = { ...state.patient, ...action.payload };
    },
    resetBooking() {
      return initialState;
    },
  },
});

/* ---------- Exports ---------- */
export const { setStep, setPatientDetails, resetBooking } = bookingSlice.actions;
export default bookingSlice.reducer;
