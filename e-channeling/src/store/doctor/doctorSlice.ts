import api from "@/utils/api";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

// doctor type
interface Doctor {
    id: string;
    name: string;
    hospital: string;
    rating: number;
    specialization: string;
    availabilityColor: string;
    availability: string;
    reviews: string;
    experience: number;
    image: string;
}

interface DoctorState {
    doctors: Doctor[];
    loading: boolean;
    error: string | null;
}

// initial state
const initialState: DoctorState = {
    doctors: [],
    loading: false,
    error: null,
};

// fetch top rating doctors
export const fetchTopRatedDoctors = createAsyncThunk<
    Doctor[],
    void,
    { rejectValue: string }
>("doctor/fetchTopRatedDoctors", async (_, { rejectWithValue }) => {
    try {
        const response = await api.get("/topRatedDoctors");
        return response.data;
    } catch (error: any) {
        return rejectWithValue(
            error.response?.data?.message ||
                "Failed to fetch top rated Doctors!"
        );
    }
});

// slice
const doctorSlice = createSlice({
    name: "doctor",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTopRatedDoctors.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(
                fetchTopRatedDoctors.fulfilled,
                (state, action: PayloadAction<Doctor[]>) => {
                    state.loading = false;
                    state.doctors = action.payload;
                }
            )
            .addCase(fetchTopRatedDoctors.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Something went wrong";
            });
    },
});

export default doctorSlice.reducer;
