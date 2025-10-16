import api from "@/utils/api";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

// single user type
// change the User according to the response data
interface User {
    id: string;
    name: string;
    role: string;
    token: string;
}

interface LoginData {
    username: string;
    password: string;
}

// data types of state
interface userState {
    user: any; // add User as a type later
    isLoginLoading: boolean;
    isLoginError: string | null;
    isLoginSuccess: boolean;
    role: string | null;
}

// intial state
const initialState: userState = {
    user: [],
    isLoginLoading: false,
    isLoginError: null,
    isLoginSuccess: false,
    role: null,
};

// login
export const login = createAsyncThunk<User, LoginData, { rejectValue: string }>(
    "auth/login",
    async (loginData, { rejectWithValue }) => {
        try {
            const response = await api.post("/login", { loginData });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message ||
                    "An unexpected error occurred during login."
            );
        }
    }
);

// auth slice
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        clearErrors: (state) => {
            state.isLoginError = null;
        },
    },
    extraReducers: (builder) =>
        builder
            .addCase(login.pending, (state) => {
                state.isLoginLoading = true;
                state.isLoginError = null;
                state.isLoginSuccess = false;
            })
            .addCase(login.fulfilled, (state, action: PayloadAction<User>) => {
                state.isLoginLoading = false;
                state.isLoginError = null;
                state.user = action.payload;
                state.isLoginSuccess = true;
                state.role = action.payload.role;
                // token save to the local storaage
                localStorage.setItem("token", action.payload.token);
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoginLoading = false;
                state.isLoginError =
                    action.payload ||
                    "An unexpected error occurred during login.";
            }),
});

export const { clearErrors } = authSlice.actions;
export default authSlice.reducer;