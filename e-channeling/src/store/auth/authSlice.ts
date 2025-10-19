import api from "@/utils/api";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

// single user type
// change the User according to the response data
// interface User {
//     id: string;
//     name: string;
//     role: string;
//     token: string;
// }

interface LoginResponse {
    token: string;
}

interface LoginData {
    username: string;
    password: string;
}

// data types of state
interface userState {
    //user: any; // add User as a type later
    userToken: any[];
    role: string | null;
    userId: string | null;
    isLoginLoading: boolean;
    isLoginError: string | null;
    isLoginSuccess: boolean;
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
};

// login
export const login = createAsyncThunk<
    LoginResponse,
    LoginData,
    { rejectValue: string }
>("auth/login", async (loginData, { rejectWithValue }) => {
    try {
        const response = await api.post("/login", { loginData });
        return response.data;
    } catch (error: any) {
        return rejectWithValue(
            error.response?.data?.message ||
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
        },
        logout: (state) => {
            state.userToken = [];
            state.userId = null;
            state.role = null;
            state.isLoginSuccess = false;
            state.isLoginError = null;
            state.isLoginLoading = false;
        },
    },
    extraReducers: (builder) =>
        builder
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
                    state.isLoginSuccess = true;
                    const token = action.payload.token;
                    state.userToken = JSON.parse(atob(token.split(".")[1]));
                    state.role =
                        (
                            JSON.parse(atob(token.split(".")[1])) as {
                                role?: string;
                            }
                        ).role ?? null;
                    state.userId =
                        (
                            JSON.parse(atob(token.split(".")[1])) as {
                                id?: string;
                            }
                        ).id ?? null;
                    // token save to the local storaage
                    localStorage.setItem("token", token);
                }
            )
            .addCase(login.rejected, (state, action) => {
                state.isLoginLoading = false;
                state.isLoginError =
                    action.payload ||
                    "An unexpected error occurred during login.";
            }),
});

export const { clearErrors ,logout } = authSlice.actions;
export default authSlice.reducer;
