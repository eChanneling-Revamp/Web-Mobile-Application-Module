// src/store/booking/bookingSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/* -------- Types -------- */
export type Step = 1 | 2 | 3 | 4;

export interface BookingState {
  step: Step;
}

/* -------- Initial State -------- */
const initialState: BookingState = {
  step: 1,
};

/* -------- Slice -------- */
const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    setStep(state, action: PayloadAction<Step>) {
      state.step = action.payload;
    },
    resetBooking: () => initialState,
  },
  // If you add async thunks later, handle them here:
  // extraReducers: (builder) => { ... }
});

/* -------- Exports (order matters) -------- */
export const { setStep, resetBooking } = bookingSlice.actions;
export default bookingSlice.reducer; // <-- must be last
