import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/lib/utils/api";
import type { 
  BookingState, 
  Doctor,
  Hospital,
  AvailableDate,
  SessionSlot,
  SessionCard,
  CreateBookingRequest,
  CreateBookingResponse,
  PaymentRequest,
  PaymentResponse,
  Gender
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
    dateOfBirth: "",
    gender: "",
    emergencyContactPhone: "",
    disease: "",
  },

  // Step 4
  paymentDetails: {
    cardNumber: "",
    cardHolderName: "",
    expiryDate: "",
    cvv: "",
  },

  // Confirmation
  confirmationData: null,

  // Loading states
  isLoadingDoctor: false,
  isLoadingSessions: false,
  isCreatingBooking: false,
  isProcessingPayment: false,

  // Errors
  bookingError: null,
  paymentError: null,
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

// Search sessions - INTEGRATED WITH BACKEND
// Uses backend GET /api/search with filters
export const searchSessions = createAsyncThunk<
  SessionCard[],
  {
    doctorId?: string;
    date?: string;
    specialization?: string;
    location?: string;
    limit?: number;
    offset?: number;
  },
  { rejectValue: string }
>(
  "booking/searchSessions",
  async (filters, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (filters.doctorId) params.append("doctorId", filters.doctorId);
      if (filters.date) params.append("date", filters.date);
      if (filters.specialization) params.append("specialization", filters.specialization);
      if (filters.location) params.append("location", filters.location);
      if (filters.limit) params.append("limit", filters.limit.toString());
      if (filters.offset) params.append("offset", filters.offset.toString());
      
      const response = await api.get(`/search?${params.toString()}`);
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(
        err.response?.data?.message || "Failed to search sessions"
      );
    }
  }
);

// Create booking - INTEGRATED WITH BACKEND
export const createBooking = createAsyncThunk<
  CreateBookingResponse,
  { userId: string },
  { rejectValue: string }
>(
  "booking/createBooking",
  async ({ userId }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { booking: BookingState };
      const { selectedSessionId, patientDetails } = state.booking;
      
      if (!selectedSessionId) {
        throw new Error("Session ID is required");
      }

      // Validate required fields
      if (!patientDetails.fullName || !patientDetails.phone || !patientDetails.nic || 
          !patientDetails.dateOfBirth || !patientDetails.gender) {
        throw new Error("All required patient details must be filled");
      }
      
      const requestData: CreateBookingRequest = {
        userId,
        sessionId: selectedSessionId,
        patientName: patientDetails.fullName,
        patientEmail: patientDetails.email || "",
        patientPhone: patientDetails.phone,
        patientNIC: patientDetails.nic,
        patientDateOfBirth: patientDetails.dateOfBirth,
        patientGender: patientDetails.gender as Gender,
        emergencyContactPhone: patientDetails.emergencyContactPhone || undefined,
      };
      
      const response = await api.post<CreateBookingResponse>("/bookings", requestData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || error.message || "Failed to create booking"
      );
    }
  }
);

// Process payment - INTEGRATED WITH BACKEND
export const processPayment = createAsyncThunk<
  PaymentResponse,
  { appointmentNumber: string; amount: number },
  { rejectValue: string }
>(
  "booking/processPayment",
  async ({ appointmentNumber, amount }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { booking: BookingState };
      const { paymentDetails } = state.booking;
      
      // Validate payment details
      if (!paymentDetails.cardNumber || !paymentDetails.cardHolderName || 
          !paymentDetails.expiryDate || !paymentDetails.cvv) {
        throw new Error("All payment details must be filled");
      }

      // Remove spaces from card number for backend
      const cleanCardNumber = paymentDetails.cardNumber.replace(/\s/g, "");
      
      const requestData: PaymentRequest = {
        appointmentNumber,
        amount,
        cardNumber: cleanCardNumber,
        cardHolderName: paymentDetails.cardHolderName,
        expiryDate: paymentDetails.expiryDate,
        cvv: paymentDetails.cvv,
      };
      
      const response = await api.post<PaymentResponse>("/payments", requestData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || error.message || "Payment failed"
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
    // Set all session details at once when card is selected
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

    // Step 4 actions
    setPaymentDetails: (
      state,
      action: PayloadAction<Partial<BookingState["paymentDetails"]>>
    ) => {
      state.paymentDetails = { ...state.paymentDetails, ...action.payload };
    },

    // Clear errors
    clearBookingError: (state) => {
      state.bookingError = null;
    },
    clearPaymentError: (state) => {
      state.paymentError = null;
    },

    // Reset booking
    resetBooking: () => initialState,
  },

  extraReducers: (builder) => {
    // Fetch doctor details
    builder
      .addCase(fetchDoctorById.pending, (state) => {
        state.isLoadingDoctor = true;
        state.bookingError = null;
      })
      .addCase(fetchDoctorById.fulfilled, (state) => {
        state.isLoadingDoctor = false;
      })
      .addCase(fetchDoctorById.rejected, (state, action) => {
        state.isLoadingDoctor = false;
        state.bookingError = action.payload || "Failed to fetch doctor";
      });

    // Search sessions
    builder
      .addCase(searchSessions.pending, (state) => {
        state.isLoadingSessions = true;
        state.bookingError = null;
      })
      .addCase(searchSessions.fulfilled, (state) => {
        state.isLoadingSessions = false;
      })
      .addCase(searchSessions.rejected, (state, action) => {
        state.isLoadingSessions = false;
        state.bookingError = action.payload || "Failed to search sessions";
      });

    // Create booking
    builder
      .addCase(createBooking.pending, (state) => {
        state.isCreatingBooking = true;
        state.bookingError = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.isCreatingBooking = false;
        state.confirmationData = action.payload;
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.isCreatingBooking = false;
        state.bookingError = action.payload || "Failed to create booking";
      });

    // Process payment
    builder
      .addCase(processPayment.pending, (state) => {
        state.isProcessingPayment = true;
        state.paymentError = null;
      })
      .addCase(processPayment.fulfilled, (state) => {
        state.isProcessingPayment = false;
      })
      .addCase(processPayment.rejected, (state, action) => {
        state.isProcessingPayment = false;
        state.paymentError = action.payload || "Payment failed";
      });
  },
});

export const {
  setSelectedDoctorId,
  setSelectedHospitalId,
  setSelectedHospitalName,
  setSelectedDate,
  setSelectedSessionId,
  setSelectedSessionCard,
  setForWhom,
  setPatientDetails,
  setPaymentDetails,
  clearBookingError,
  clearPaymentError,
  resetBooking,
} = bookingSlice.actions;

export default bookingSlice.reducer;