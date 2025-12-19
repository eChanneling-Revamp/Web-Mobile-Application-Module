import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/lib/utils/api";
import type { 
  BookingState, 
  Doctor,
  Hospital,
  AvailableDate,
  SessionSlot,
  SessionCard
} from "@/components/booking/types";

// Initial state
const initialState: BookingState = {
  // Step 1
  selectedDoctorId: null,
  selectedHospitalId: null,
  selectedHospitalName: null,
  selectedDate: null,
  selectedSessionId: null,
  selectedSessionName: null,
  selectedSessionStartTime: null,

  // Step 2
  forWhom: null,

  // Step 3
  patientDetails: {
    fullName: "",
    phone: "",
    email: "",
    nic: "",
    disease: "",
  },

  // Loading states
  isLoadingDoctor: false,
  isLoadingHospitals: false,
  isLoadingDates: false,
  isLoadingSessions: false,
  isCreatingBooking: false,

  // Error
  error: null,
};

// ==================== ASYNC THUNKS ====================

// Fetch doctor details by ID
export const fetchDoctorById = createAsyncThunk<
  Doctor,
  string,
  { rejectValue: string }
>("booking/fetchDoctorById", async (doctorId, { rejectWithValue }) => {
  try {
    const response = await api.get(`/doctors/${doctorId}`);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to fetch doctor details"
    );
  }
});

// Fetch available hospitals for a doctor
export const fetchDoctorHospitals = createAsyncThunk<
  Hospital[],
  string,
  { rejectValue: string }
>("booking/fetchDoctorHospitals", async (doctorId, { rejectWithValue }) => {
  try {
    const response = await api.get(`/doctors/${doctorId}/hospitals`);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to fetch hospitals"
    );
  }
});

// Fetch available dates (next 7 days with availability)
export const fetchAvailableDates = createAsyncThunk<
  AvailableDate[],
  { doctorId: string; hospitalId: string },
  { rejectValue: string }
>(
  "booking/fetchAvailableDates",
  async ({ doctorId, hospitalId }, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `/doctors/${doctorId}/available-dates?hospitalId=${hospitalId}`
      );
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch available dates"
      );
    }
  }
);

// Fetch available session slots for a specific date
export const fetchSessionSlots = createAsyncThunk<
  SessionSlot[],
  { doctorId: string; hospitalId: string; date: string },
  { rejectValue: string }
>(
  "booking/fetchSessionSlots",
  async ({ doctorId, hospitalId, date }, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `/sessions/available-slots?doctorId=${doctorId}&hospitalId=${hospitalId}&date=${date}`
      );
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch session slots"
      );
    }
  }
);

// NEW: Fetch all available sessions for next 7 days
export const fetchAllSessions = createAsyncThunk<
  SessionCard[],
  { doctorId: string; hospitalId?: string },
  { rejectValue: string }
>(
  "booking/fetchAllSessions",
  async ({ doctorId, hospitalId }, { rejectWithValue }) => {
    try {
      const url = hospitalId
        ? `/doctors/${doctorId}/sessions?hospitalId=${hospitalId}`
        : `/doctors/${doctorId}/sessions`;
      const response = await api.get(url);
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch sessions"
      );
    }
  }
);

// Create booking with sequential patient numbering
export const createBooking = createAsyncThunk<
  {
    appointmentId: string;
    patientNumber: number;
    hospitalName: string;
    roomNumber: string;
    patientName: string;
    doctorName: string;
    date: string;
    time: string;
  },
  {
    doctorId: string;
    hospitalId: string;
    date: string;
    sessionId: string;
    patientDetails: BookingState["patientDetails"];
    totalAmount: number;
  },
  { rejectValue: string }
>(
  "booking/createBooking",
  async (bookingData, { rejectWithValue }) => {
    try {
      const response = await api.post("/bookings/create", bookingData);
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(
        err.response?.data?.message || "Failed to create booking"
      );
    }
  }
);

// ==================== SLICE ====================

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    // Step 1 actions
    setSelectedDoctorId: (state, action: PayloadAction<string>) => {
      state.selectedDoctorId = action.payload;
    },
    setSelectedHospitalId: (state, action: PayloadAction<string>) => {
      state.selectedHospitalId = action.payload;
    },
    setSelectedHospitalName: (state, action: PayloadAction<string>) => {
      state.selectedHospitalName = action.payload;
    },
    setSelectedDate: (state, action: PayloadAction<string>) => {
      state.selectedDate = action.payload;
    },
    setSelectedSessionId: (state, action: PayloadAction<string>) => {
      state.selectedSessionId = action.payload;
    },
    setSelectedSessionInfo: (
      state,
      action: PayloadAction<{ name: string; startTime: string }>
    ) => {
      state.selectedSessionName = action.payload.name;
      state.selectedSessionStartTime = action.payload.startTime;
    },
    // NEW: Set all session details at once when card is selected
    setSelectedSessionCard: (
      state,
      action: PayloadAction<{
        sessionId: string;
        hospitalId: string;
        hospitalName: string;
        date: string;
        startTime: string;
      }>
    ) => {
      state.selectedSessionId = action.payload.sessionId;
      state.selectedHospitalId = action.payload.hospitalId;
      state.selectedHospitalName = action.payload.hospitalName;
      state.selectedDate = action.payload.date;
      state.selectedSessionStartTime = action.payload.startTime;
    },

    // Step 2 actions
    setForWhom: (state, action: PayloadAction<"myself" | "someone_else">) => {
      state.forWhom = action.payload;
    },

    // Step 3 actions
    setPatientDetails: (
      state,
      action: PayloadAction<Partial<BookingState["patientDetails"]>>
    ) => {
      state.patientDetails = { ...state.patientDetails, ...action.payload };
    },

    // Clear errors
    clearErrors: (state) => {
      state.error = null;
    },

    // Reset booking
    resetBooking: () => initialState,
  },

  extraReducers: (builder) => {
    // Fetch doctor details
    builder
      .addCase(fetchDoctorById.pending, (state) => {
        state.isLoadingDoctor = true;
        state.error = null;
      })
      .addCase(fetchDoctorById.fulfilled, (state) => {
        state.isLoadingDoctor = false;
      })
      .addCase(fetchDoctorById.rejected, (state, action) => {
        state.isLoadingDoctor = false;
        state.error = action.payload || "Failed to fetch doctor";
      });

    // Fetch hospitals
    builder
      .addCase(fetchDoctorHospitals.pending, (state) => {
        state.isLoadingHospitals = true;
        state.error = null;
      })
      .addCase(fetchDoctorHospitals.fulfilled, (state) => {
        state.isLoadingHospitals = false;
      })
      .addCase(fetchDoctorHospitals.rejected, (state, action) => {
        state.isLoadingHospitals = false;
        state.error = action.payload || "Failed to fetch hospitals";
      });

    // Fetch available dates
    builder
      .addCase(fetchAvailableDates.pending, (state) => {
        state.isLoadingDates = true;
        state.error = null;
      })
      .addCase(fetchAvailableDates.fulfilled, (state) => {
        state.isLoadingDates = false;
      })
      .addCase(fetchAvailableDates.rejected, (state, action) => {
        state.isLoadingDates = false;
        state.error = action.payload || "Failed to fetch dates";
      });

    // Fetch session slots
    builder
      .addCase(fetchSessionSlots.pending, (state) => {
        state.isLoadingSessions = true;
        state.error = null;
      })
      .addCase(fetchSessionSlots.fulfilled, (state) => {
        state.isLoadingSessions = false;
      })
      .addCase(fetchSessionSlots.rejected, (state, action) => {
        state.isLoadingSessions = false;
        state.error = action.payload || "Failed to fetch sessions";
      });

    // NEW: Fetch all sessions
    builder
      .addCase(fetchAllSessions.pending, (state) => {
        state.isLoadingSessions = true;
        state.error = null;
      })
      .addCase(fetchAllSessions.fulfilled, (state) => {
        state.isLoadingSessions = false;
      })
      .addCase(fetchAllSessions.rejected, (state, action) => {
        state.isLoadingSessions = false;
        state.error = action.payload || "Failed to fetch sessions";
      });

    // Create booking
    builder
      .addCase(createBooking.pending, (state) => {
        state.isCreatingBooking = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state) => {
        state.isCreatingBooking = false;
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.isCreatingBooking = false;
        state.error = action.payload || "Failed to create booking";
      });
  },
});

export const {
  setSelectedDoctorId,
  setSelectedHospitalId,
  setSelectedHospitalName,
  setSelectedDate,
  setSelectedSessionId,
  setSelectedSessionInfo,
  setSelectedSessionCard,
  setForWhom,
  setPatientDetails,
  clearErrors,
  resetBooking,
} = bookingSlice.actions;

export default bookingSlice.reducer;