import api from "@/utils/api";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

interface SignupData {
    nationality: string;
    phoneNumber: string;
    package: string;
    title: string;
    firstName: string;
    lastName: string;
    email: string;
    idType: 'NIC' | 'Passport';
    idNumber: string;
    password: string;
}

interface OtpVerificationData {
    phoneNumber: string;
    otp: string;
}

interface LoginResponse {
    token: string;
}

interface LoginData {
    username: string;
    password: string;
}

// data types of state
interface userState {
    userToken: Record<string, unknown>;
    role: string | null;
    userId: string | null;
    isLoginLoading: boolean;
    isLoginError: string | null;
    isLoginSuccess: boolean;
    isSignupLoading: boolean;
    isSignupError: string | null;
    isSignupSuccess: boolean;
    isOtpLoading: boolean;
    isOtpError: string | null;
    isOtpVerified: boolean;
    signupData: Partial<SignupData>;
}

// intial state
const initialState: userState = {
    userToken: token ? JSON.parse(atob(token.split(".")[1])) || "{}" : {},
    role: token
        ? ((JSON.parse(atob(token.split(".")[1])) as { role?: string }).role ??
          null)
        : null,
    userId: token
        ? ((JSON.parse(atob(token.split(".")[1])) as { id?: string }).id ??
          null)
        : null,
    isLoginLoading: false,
    isLoginError: null,
    isLoginSuccess: !!token,
    isSignupLoading: false,
    isSignupError: null,
    isSignupSuccess: false,
    isOtpLoading: false,
    isOtpError: null,
    isOtpVerified: false,
    signupData: {},
};

// Request OTP
export const requestOtp = createAsyncThunk<
    { message: string },
    { phoneNumber: string },
    { rejectValue: string }
>("auth/requestOtp", async ({ phoneNumber }, { rejectWithValue }) => {
    try {
        const response = await api.post("/auth/request-otp", { phoneNumber });
        return response.data;
    } catch (error: unknown) {
        const err = error as { response?: { data?: { message?: string } } };
        return rejectWithValue(
            err.response?.data?.message ||
            "An error occurred while sending OTP."
        );
    }
});

// Verify OTP
export const verifyOtp = createAsyncThunk<
    { message: string },
    OtpVerificationData,
    { rejectValue: string }
>("auth/verifyOtp", async (data, { rejectWithValue }) => {
    try {
        const response = await api.post("/auth/verify-otp", data);
        return response.data;
    } catch (error: unknown) {
        const err = error as { response?: { data?: { message?: string } } };
        return rejectWithValue(
            err.response?.data?.message ||
            "Invalid OTP code."
        );
    }
});

// Sign up
export const signup = createAsyncThunk<
    { token: string },
    SignupData,
    { rejectValue: string }
>("auth/signup", async (signupData, { rejectWithValue }) => {
    try {
        const response = await api.post("/auth/signup", signupData);
        return response.data;
    } catch (error: unknown) {
        const err = error as { response?: { data?: { message?: string } } };
        return rejectWithValue(
            err.response?.data?.message ||
            "An error occurred during signup."
        );
    }
});

// login
export const login = createAsyncThunk<
    LoginResponse,
    LoginData,
    { rejectValue: string }
>("auth/login", async (loginData, { rejectWithValue }) => {
    try {
        const response = await api.post("/login", { loginData });
        return response.data;
    } catch (error: unknown) {
        const err = error as { response?: { data?: { message?: string } } };
        return rejectWithValue(
            err.response?.data?.message ||
            "An unexpected error occurred during login."
        );
    }
});

// auth slice
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        clearErrors: (state) => {
            state.isLoginError = null;
            state.isSignupError = null;
            state.isOtpError = null;
        },
        logout: (state) => {
            state.userToken = {};
            state.userId = null;
            state.role = null;
            state.isLoginSuccess = false;
            state.isLoginError = null;
            state.isLoginLoading = false;
            state.signupData = {};
        },
        setSignupData: (state, action: PayloadAction<Partial<SignupData>>) => {
            state.signupData = { ...state.signupData, ...action.payload };
        },
        resetSignup: (state) => {
            state.signupData = {};
            state.isOtpVerified = false;
            state.isSignupSuccess = false;
        }
    },
    extraReducers: (builder) =>
        builder
            // Login reducers
            .addCase(login.pending, (state) => {
                state.isLoginLoading = true;
                state.isLoginError = null;
                state.isLoginSuccess = false;
            })
            .addCase(login.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
                state.isLoginLoading = false;
                state.isLoginError = null;
                state.isLoginSuccess = true;
                const token = action.payload.token;
                state.userToken = JSON.parse(atob(token.split(".")[1]));
                state.role = (JSON.parse(atob(token.split(".")[1])) as { role?: string }).role ?? null;
                state.userId = (JSON.parse(atob(token.split(".")[1])) as { id?: string }).id ?? null;
                localStorage.setItem("token", token);
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoginLoading = false;
                state.isLoginError = action.payload || "An unexpected error occurred during login.";
            })
            // OTP request reducers
            .addCase(requestOtp.pending, (state) => {
                state.isOtpLoading = true;
                state.isOtpError = null;
            })
            .addCase(requestOtp.fulfilled, (state) => {
                state.isOtpLoading = false;
                state.isOtpError = null;
            })
            .addCase(requestOtp.rejected, (state, action) => {
                state.isOtpLoading = false;
                state.isOtpError = action.payload || "Failed to send OTP";
            })
            // OTP verification reducers
            .addCase(verifyOtp.pending, (state) => {
                state.isOtpLoading = true;
                state.isOtpError = null;
            })
            .addCase(verifyOtp.fulfilled, (state) => {
                state.isOtpLoading = false;
                state.isOtpError = null;
                state.isOtpVerified = true;
            })
            .addCase(verifyOtp.rejected, (state, action) => {
                state.isOtpLoading = false;
                state.isOtpError = action.payload || "OTP verification failed";
            })
            // Signup reducers
            .addCase(signup.pending, (state) => {
                state.isSignupLoading = true;
                state.isSignupError = null;
            })
            .addCase(signup.fulfilled, (state, action) => {
                state.isSignupLoading = false;
                state.isSignupError = null;
                state.isSignupSuccess = true;
                const token = action.payload.token;
                state.userToken = JSON.parse(atob(token.split(".")[1]));
                state.role = (JSON.parse(atob(token.split(".")[1])) as { role?: string }).role ?? null;
                state.userId = (JSON.parse(atob(token.split(".")[1])) as { id?: string }).id ?? null;
                localStorage.setItem("token", token);
            })
            .addCase(signup.rejected, (state, action) => {
                state.isSignupLoading = false;
                state.isSignupError = action.payload || "Signup failed";
                state.isSignupSuccess = true; //remove latter
            }),
});

export const { clearErrors, logout, setSignupData, resetSignup } = authSlice.actions;
export default authSlice.reducer;
