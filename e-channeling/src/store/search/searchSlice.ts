import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import api from "@/utils/api";

type NormalFilters = {
  doctorName: string;
  specialization: string;
  hospital: string;
  date: string; // ISO (yyyy-mm-dd)
};

type AdvancedFilters = {
  hospitalType: string;
  location: string;
  hospitalName: string;
  specialization: string;
  gender: string;
  sessionTime: string;
  date: string; // ISO
  priceRange: string;
  doctorName: string;
};

export type Doctor = {
  id: string;
  name: string;
  specialization: string;
  hospitals: string[];
  fee?: number;
  image?: string;
};

type SearchState = {
  normal: NormalFilters;
  advanced: AdvancedFilters;
  showAdvanced: boolean;
  results: Doctor[];
  loading: boolean;
  error: string | null;
  hasSearchedOnce: boolean;
};

const initialState: SearchState = {
  normal: {
    doctorName: "",
    specialization: "",
    hospital: "",
    date: "",
  },
  advanced: {
    hospitalType: "",
    location: "",
    hospitalName: "",
    specialization: "",
    gender: "",
    sessionTime: "",
    date: "",
    priceRange: "",
    doctorName: "",
  },
  showAdvanced: false,
  results: [],
  loading: false,
  error: null,
  hasSearchedOnce: false,
};

/**
 * Async search thunk.
 * mode = "normal" uses only normal filters.
 * mode = "advanced" uses only advanced filters.
 * 
 * Replace the endpoint string with your real API route if different.
 * The request uses `api` from "@/utils/api" as required.
 */
export const fetchDoctors = createAsyncThunk<
  Doctor[],
  { mode: "normal" | "advanced" },
  { state: { search: SearchState } }
>("search/fetchDoctors", async ({ mode }, { getState, rejectWithValue }) => {
  const { normal, advanced } = getState().search;

  // Build params based on mode
  const params =
    mode === "normal"
      ? {
          doctorName: normal.doctorName || undefined,
          specialization: normal.specialization || undefined,
          hospital: normal.hospital || undefined,
          date: normal.date || undefined,
          mode,
        }
      : {
          hospitalType: advanced.hospitalType || undefined,
          location: advanced.location || undefined,
          hospitalName: advanced.hospitalName || undefined,
          specialization: advanced.specialization || undefined,
          gender: advanced.gender || undefined,
          sessionTime: advanced.sessionTime || undefined,
          date: advanced.date || undefined,
          priceRange: advanced.priceRange || undefined,
          doctorName: advanced.doctorName || undefined,
          mode,
        };

  try {
    // Example endpoint; adjust to your backend
    const res = await api.get("/doctors/search", { params });

    // Expecting: { data: Doctor[] } or Doctor[]
    const payload = Array.isArray(res.data) ? res.data : res.data?.data;

    // Fallback mock mapping (if backend not ready)
    const list: Doctor[] =
      payload ??
      [
        {
          id: "demo-1",
          name: "Dr. Samantha Perera",
          specialization: "Cardiology",
          hospitals: ["Lanka Hospital", "Kandy General Hospital"],
          fee: 3500,
        },
        {
          id: "demo-2",
          name: "Dr. John Doe",
          specialization: "Dermatology",
          hospitals: ["Gampaha General Hospital"],
          fee: 2400,
        },
        {
          id: "demo-3",
          name: "Dr. A. B. M. Milhan",
          specialization: "ENT Surgeon",
          hospitals: ["Jaffna General Hospital"],
          fee: 2900,
        },
      ];

    return list;
  } catch (err: any) {
    const msg =
      err?.response?.data?.message ||
      err?.message ||
      "Failed to fetch doctors";
    return rejectWithValue(msg);
  }
});

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setNormalField: (
      state,
      action: PayloadAction<{ key: keyof NormalFilters; value: string }>
    ) => {
      state.normal[action.payload.key] = action.payload.value;
    },
    setAdvancedField: (
      state,
      action: PayloadAction<{ key: keyof AdvancedFilters; value: string }>
    ) => {
      state.advanced[action.payload.key] = action.payload.value;
    },
    toggleAdvancedOpen: (state, action: PayloadAction<boolean | undefined>) => {
      state.showAdvanced =
        typeof action.payload === "boolean"
          ? action.payload
          : !state.showAdvanced;
    },
    resetAllFilters: (state) => {
      state.normal = { ...initialState.normal };
      state.advanced = { ...initialState.advanced };
      state.error = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchDoctors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDoctors.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload;
        state.hasSearchedOnce = true;
      })
      .addCase(fetchDoctors.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) ||
          action.error.message ||
          "Something went wrong";
      });
  },
});

export const {
  setNormalField,
  setAdvancedField,
  toggleAdvancedOpen,
  resetAllFilters,
} = searchSlice.actions;

export default searchSlice.reducer;
