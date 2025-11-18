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
    idType: "NIC" | "Passport";
    idNumber: string;
    password: string;
}

interface OtpVerificationData {
    phoneNumber: string;
    otp: string;
}

// the user not store in the local storage yet
interface User {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    role: string;
    age: number;
    gender: string;
    created_at: string;
    updated_at: string;
}

interface LoginResponse {
    message: string;
    user: User;
    token: string;
}

interface LoginData {
    email: string;
    password: string;
}

// data types of state
interface AuthState {
    userToken: string | null;
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

function safeDecodeJwt(token?: string | null) {
    if (!token || typeof token !== "string") return null;
    const parts = token.split(".");
    if (parts.length < 2) return null;
    try {
        const payload = JSON.parse(atob(parts[1]));
        return payload;
    } catch {
        return null;
    }
}

const decodedPayload = safeDecodeJwt(token)

// intial state
const initialState: AuthState = {
    userToken: token ? token : null,
    role: decodedPayload?.role ?? null ,
    userId: decodedPayload?.sub ?? null ,
    isLoginLoading: false,
    isLoginError: null,
    isLoginSuccess: !!decodedPayload && (!decodedPayload.exp || decodedPayload.exp * 1000 > Date.now()),
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
            err.response?.data?.message || "Invalid OTP code."
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
            err.response?.data?.message || "An error occurred during signup."
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
        const response = await api.post("/auth/login", loginData);
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
            state.userToken = null;
            state.userId = null;
            state.role = null;
            state.isLoginSuccess = false;
            state.isLoginError = null;
            state.isLoginLoading = false;
            state.signupData = {};
            if (typeof window !== "undefined") localStorage.removeItem("token");
        },
        setSignupData: (state, action: PayloadAction<Partial<SignupData>>) => {
            state.signupData = { ...state.signupData, ...action.payload };
        },
        resetSignup: (state) => {
            state.signupData = {};
            state.isOtpVerified = false;
            state.isSignupSuccess = false;
        },
    },
    extraReducers: (builder) =>
        builder
            // Login reducers
            .addCase(login.pending, (state) => {
                state.isLoginLoading = true;
                state.isLoginError = null;
                state.isLoginSuccess = false;
            })
            .addCase(
                login.fulfilled,
                (state, action: PayloadAction<LoginResponse>) => {
                    state.isLoginLoading = false;
                    state.isLoginError = null;
                    // get the token only
                    const token = action.payload?.token;
                    if (!token) {
                        state.isLoginError = "Login succeeded but token missing.";
                        state.isLoginSuccess = false;
                        return;
                    }
                    state.isLoginSuccess = true;                  
                    state.userToken = token;
                    const payload = safeDecodeJwt(token);
                    // get role and user id from the token payload
                    state.role = payload?.role ?? null;
                    state.userId = payload.sub ?? null;
                    if (typeof window !== "undefined") {
                        localStorage.setItem("token", token);
                    }
                }
            )
            .addCase(login.rejected, (state, action) => {
                state.isLoginLoading = false;
                state.isLoginSuccess = false;
                state.isLoginError =
                    action.payload ||
                    "An unexpected error occurred during login.";
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
                state.role =
                    (JSON.parse(atob(token.split(".")[1])) as { role?: string })
                        .role ?? null;
                state.userId =
                    (JSON.parse(atob(token.split(".")[1])) as { sub?: string })
                        .sub ?? null;
                localStorage.setItem("token", token);
            })
            .addCase(signup.rejected, (state, action) => {
                state.isSignupLoading = false;
                state.isSignupError = action.payload || "Signup failed";
                state.isSignupSuccess = true; //remove latter
            }),
});

export const { clearErrors, logout, setSignupData, resetSignup } =
    authSlice.actions;
export default authSlice.reducer;
