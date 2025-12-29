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
    Gender,
    Session,
    User,
} from "@/components/booking/types";

// Initial state
const initialState: BookingState = {
    // Step 1

    selectedHospitalId: null,
    selectedHospitalName: null,
    selectedDate: null,
    selectedSessionName: null,
    selectedSessionStartTime: null,

    selectedDoctorId: null,
    selectedSessionId: null,

    // fetchDoctorById
    fetchDoctorByIdLoading: false,
    fetchDoctorByIdError: null,
    doctorProfile: null,

    //sessionsByDoctorId
    sessionsByDoctorIdLoading: false,
    sessionsByDoctorIdError: null,
    doctorSessions: null,

    //fetchUserDetails
    fetchUserDetailsdLoading: false,
    fetchUserDetailsIdError: null,
    user: null,

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
    isCreatingBooking: false,
    isProcessingPayment: false,

    // Errors
    bookingError: null,
    paymentError: null,
};

// Fetch doctor details by ID
export const fetchDoctorById = createAsyncThunk<
    Doctor,
    string,
    { rejectValue: string }
>("booking/fetchDoctorById", async (doctorId, { rejectWithValue }) => {
    try {
        const response = await api.get(`/doctor/${doctorId}`);
        return response.data.data;
    } catch (error: unknown) {
        const err = error as { response?: { data?: { message?: string } } };
        return rejectWithValue(
            err.response?.data?.message || "Failed to fetch doctor details"
        );
    }
});

// get doctor's all sessions by doctor id
export const sessionsByDoctorId = createAsyncThunk<
    Session,
    string,
    { rejectValue: string }
>("booking/sessionsByDoctorId", async (doctorId, { rejectWithValue }) => {
    try {
        const response = await api.get(`/sessions/${doctorId}`);
        return response.data.data;
    } catch (error: unknown) {
        const err = error as { response?: { data?: { message?: string } } };
        return rejectWithValue(
            err.response?.data?.message || "Failed to fetch doctor sessions"
        );
    }
});

// get user information (for you)
export const fetchUserDetails = createAsyncThunk<
    User,
    string | null,
    { rejectValue: string }
>("booking/fetchUserDetails", async (userId, { rejectWithValue }) => {
    try {
        const response = await api.get(`/user/${userId}`);
        return response.data.data;
    } catch (error: unknown) {
        const err = error as { response?: { data?: { message?: string } } };
        return rejectWithValue(
            err.response?.data?.message || "Failed to fetch user details"
        );
    }
});

// // Search sessions - INTEGRATED WITH BACKEND
// // Uses backend GET /api/search with filters
// export const searchSessions = createAsyncThunk<
//     SessionCard[],
//     {
//         doctorId?: string;
//         date?: string;
//         specialization?: string;
//         location?: string;
//         limit?: number;
//         offset?: number;
//     },
//     { rejectValue: string }
// >("booking/searchSessions", async (filters, { rejectWithValue }) => {
//     try {
//         const params = new URLSearchParams();
//         if (filters.doctorId) params.append("doctorId", filters.doctorId);
//         if (filters.date) params.append("date", filters.date);
//         if (filters.specialization)
//             params.append("specialization", filters.specialization);
//         if (filters.location) params.append("location", filters.location);
//         if (filters.limit) params.append("limit", filters.limit.toString());
//         if (filters.offset) params.append("offset", filters.offset.toString());

//         const response = await api.get(`/search?${params.toString()}`);
//         return response.data;
//     } catch (error: unknown) {
//         const err = error as { response?: { data?: { message?: string } } };
//         return rejectWithValue(
//             err.response?.data?.message || "Failed to search sessions"
//         );
//     }
// });

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
            if (
                !patientDetails.fullName ||
                !patientDetails.phone ||
                !patientDetails.nic ||
                !patientDetails.dateOfBirth ||
                !patientDetails.gender
            ) {
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
                emergencyContactPhone:
                    patientDetails.emergencyContactPhone || undefined,
            };

            const response = await api.post<CreateBookingResponse>(
                "/bookings",
                requestData
            );
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.error ||
                    error.message ||
                    "Failed to create booking"
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
            if (
                !paymentDetails.cardNumber ||
                !paymentDetails.cardHolderName ||
                !paymentDetails.expiryDate ||
                !paymentDetails.cvv
            ) {
                throw new Error("All payment details must be filled");
            }

            // Remove spaces from card number for backend
            const cleanCardNumber = paymentDetails.cardNumber.replace(
                /\s/g,
                ""
            );

            const requestData: PaymentRequest = {
                appointmentNumber,
                amount,
                cardNumber: cleanCardNumber,
                cardHolderName: paymentDetails.cardHolderName,
                expiryDate: paymentDetails.expiryDate,
                cvv: paymentDetails.cvv,
            };

            const response = await api.post<PaymentResponse>(
                "/payments",
                requestData
            );
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
        setForWhom: (
            state,
            action: PayloadAction<"myself" | "someone_else">
        ) => {
            state.forWhom = action.payload;
        },

        // Step 3 actions
        setPatientDetails: (
            state,
            action: PayloadAction<Partial<BookingState["patientDetails"]>>
        ) => {
            state.patientDetails = {
                ...state.patientDetails,
                ...action.payload,
            };
        },

        // Step 4 actions
        setPaymentDetails: (
            state,
            action: PayloadAction<Partial<BookingState["paymentDetails"]>>
        ) => {
            state.paymentDetails = {
                ...state.paymentDetails,
                ...action.payload,
            };
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
        builder
            // Fetch doctor details
            .addCase(fetchDoctorById.pending, (state) => {
                state.fetchDoctorByIdLoading = true;
                state.fetchDoctorByIdError = null;
            })
            .addCase(fetchDoctorById.fulfilled, (state, action) => {
                state.fetchDoctorByIdLoading = false;
                state.fetchDoctorByIdError = null;
                state.doctorProfile = action.payload;
            })
            .addCase(fetchDoctorById.rejected, (state, action) => {
                state.fetchDoctorByIdLoading = false;
                state.fetchDoctorByIdError =
                    action.payload || "Failed to fetch doctor";
            })
            // fetch all doctor sessions
            .addCase(sessionsByDoctorId.pending, (state) => {
                state.sessionsByDoctorIdLoading = true;
                state.sessionsByDoctorIdError = null;
            })
            .addCase(sessionsByDoctorId.fulfilled, (state, action) => {
                state.sessionsByDoctorIdLoading = false;
                state.sessionsByDoctorIdError = null;
                state.doctorSessions = action.payload;
            })
            .addCase(sessionsByDoctorId.rejected, (state, action) => {
                state.sessionsByDoctorIdLoading = false;
                state.sessionsByDoctorIdError =
                    action.payload || "Failed to fetch doctor";
            })

            // fetch user details
            .addCase(fetchUserDetails.pending, (state) => {
                state.fetchUserDetailsdLoading = true;
                state.fetchUserDetailsIdError = null;
            })
            .addCase(fetchUserDetails.fulfilled, (state, action) => {
                state.fetchUserDetailsdLoading = false;
                state.fetchUserDetailsIdError = null;
                state.user = action.payload;
            })
            .addCase(fetchUserDetails.rejected, (state, action) => {
                state.fetchUserDetailsdLoading = false;
                state.fetchUserDetailsIdError =
                    action.payload || "Failed to fetch user details";
            })

            // Search sessions

            // .addCase(searchSessions.pending, (state) => {
            //     state.isLoadingSessions = true;
            //     state.bookingError = null;
            // })
            // .addCase(searchSessions.fulfilled, (state) => {
            //     state.isLoadingSessions = false;
            // })
            // .addCase(searchSessions.rejected, (state, action) => {
            //     state.isLoadingSessions = false;
            //     state.bookingError =
            //         action.payload || "Failed to search sessions";
            // })

            // Create booking
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
                state.bookingError =
                    action.payload || "Failed to create booking";
            })

            // Process payment
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
