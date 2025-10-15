import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import api from "@/utils/api";

/* ---------- Types ---------- */
type NormalFilters = {
  doctorName: string;
  specialization: string;
  hospital: string;
  date: string; // ISO
};

type AdvancedFilters = {
  hospitalType: string;
  location: string;
  hospitalName: string;
  specialization: string;
  gender: string;
  sessionTime: string;
  date: string;
  priceRange: string; // below_1499 | 1500_2499 | ...
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
  normal: { doctorName: "", specialization: "", hospital: "", date: "" },
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

/* ---------- Helpers ---------- */
function priceToMinMax(code?: string) {
  switch (code) {
    case "below_1499": return { min: 0, max: 1499 };
    case "1500_2499": return { min: 1500, max: 2499 };
    case "2500_3499": return { min: 2500, max: 3499 };
    case "3500_4499": return { min: 3500, max: 4499 };
    case "4500_5499": return { min: 4500, max: 5499 };
    default: return undefined;
  }
}

function normalize(v?: string) {
  return (v || "").trim().toLowerCase();
}

/** Client-side filtering for mock data so UX matches backend behavior */
function filterDoctorsClient(
  list: Doctor[],
  mode: "normal" | "advanced",
  normal: NormalFilters,
  advanced: AdvancedFilters
) {
  let out = [...list];

  if (mode === "normal") {
    const n = {
      doctorName: normalize(normal.doctorName),
      specialization: normalize(normal.specialization),
      hospital: normalize(normal.hospital),
      date: normalize(normal.date), // available if your mock models it
    };

    if (n.doctorName) out = out.filter(d => normalize(d.name).includes(n.doctorName));
    if (n.specialization) out = out.filter(d => normalize(d.specialization) === n.specialization);
    if (n.hospital) out = out.filter(d => d.hospitals.some(h => normalize(h) === n.hospital));
    // date ignored in mock unless you add availability in your JSON
    return out;
  }

  // advanced
  const a = {
    hospitalType: normalize(advanced.hospitalType),
    location: normalize(advanced.location),
    hospitalName: normalize(advanced.hospitalName),
    specialization: normalize(advanced.specialization),
    gender: normalize(advanced.gender),
    sessionTime: normalize(advanced.sessionTime),
    date: normalize(advanced.date),
    priceRange: advanced.priceRange,
    doctorName: normalize(advanced.doctorName),
  };

  if (a.doctorName) out = out.filter(d => normalize(d.name).includes(a.doctorName));
  if (a.specialization) out = out.filter(d => normalize(d.specialization) === a.specialization);

  // hospitalName (advanced) — same as hospital in normal
  if (a.hospitalName) out = out.filter(d => d.hospitals.some(h => normalize(h) === a.hospitalName));

  // price range
  const rng = priceToMinMax(a.priceRange);
  if (rng) out = out.filter(d => typeof d.fee === "number" && d.fee! >= rng.min && d.fee! <= rng.max);

  // hospitalType, location, gender, sessionTime, date — apply if you add these fields to mock JSON
  // For now we skip them to avoid filtering everything out.

  return out;
}

/** Load mock JSON from /public/mock/doctors.json */
async function loadMockDoctors(): Promise<Doctor[]> {
  try {
    const res = await fetch("/mock/doctors.json", { cache: "no-store" });
    const data = await res.json();
    // supports [ ... ] or { data: [ ... ] }
    return (Array.isArray(data) ? data : data?.data) as Doctor[];
  } catch {
    // Last-resort inline sample so the UI never breaks
    return [
      {
        id: "demo-1",
        name: "Dr. Samantha Perera",
        specialization: "cardiology",
        hospitals: ["lanka hospital", "kandy general hospital"],
        fee: 3500,
      },
      {
        id: "demo-2",
        name: "Dr. John Doe",
        specialization: "dermatology",
        hospitals: ["gampaha general hospital"],
        fee: 2400,
      },
    ];
  }
}

/* ---------- Thunk (backend-first, mock fallback) ---------- */
export const fetchDoctors = createAsyncThunk<
  Doctor[],
  { mode: "normal" | "advanced" },
  { state: { search: SearchState } }
>("search/fetchDoctors", async ({ mode }, { getState, rejectWithValue }) => {
  const { normal, advanced } = getState().search;

  const useMock = process.env.NEXT_PUBLIC_USE_MOCK === "1";

  // Params for backend
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

  // If forced mock, skip API entirely
  if (useMock) {
    const list = await loadMockDoctors();
    return filterDoctorsClient(list, mode, normal, advanced);
  }

  // Try backend first
  try {
    const res = await api.get("/doctors/search", { params });
    const payload = Array.isArray(res.data) ? res.data : res.data?.data;
    if (payload && Array.isArray(payload) && payload.length > 0) {
      return payload as Doctor[];
    }
    // If backend returns empty, fall through to mock (optional)
  } catch (err: any) {
    // Swallow and fall back to mock
  }

  // Fallback to mock JSON
  const list = await loadMockDoctors();
  return filterDoctorsClient(list, mode, normal, advanced);
});

/* ---------- Slice ---------- */
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
