import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import api from "@/lib/utils/api";

/* ---------- Types ---------- */
type NormalFilters = {
  doctorName: string;
  specialization: string;
  hospitalType: string;
  location: string; // district
  hospital: string; // hospital name
  date: string;
};

export type Doctor = {
  id: string;
  name?: string;
  specialization?: string;
  hospitals?: string[];
  fee?: number | string;
  image?: string;

  // Optional (if your dataset supports)
  location?: string;      // "colombo"
  hospitalType?: string;  // "private hospital"
};

type SearchState = {
  normal: NormalFilters;
  results: Doctor[];
  loading: boolean;
  error: string | null;
  hasSearchedOnce: boolean;
};

const initialState: SearchState = {
  normal: {
    doctorName: "",
    specialization: "",
    hospitalType: "",
    location: "",
    hospital: "",
    date: "",
  },
  results: [],
  loading: false,
  error: null,
  hasSearchedOnce: false,
};

function normalize(v?: string) {
  return (v || "").trim().toLowerCase();
}

/**
 * ✅ IMPORTANT
 * This mapping must match the district -> hospital list used in the UI logic.
 * Purpose: allow District filtering to work even when Hospital Name is not selected.
 */
const HOSPITALS_BY_DISTRICT_VALUES: Record<string, string[]> = {
  colombo: ["lanka hospital"],
  kandy: ["kandy general hospital"],
  gampaha: ["gampaha general hospital"],
  jaffna: ["jaffna general hospital"],
};

// Client-side filter (mock/local fallback)
function filterDoctorsClient(list: Doctor[], normal: NormalFilters) {
  let out = [...list];

  const f = {
    doctorName: normalize(normal.doctorName),
    specialization: normalize(normal.specialization),
    hospitalType: normalize(normal.hospitalType),
    location: normalize(normal.location), // district
    hospital: normalize(normal.hospital), // hospital name
    date: normalize(normal.date),
  };

  // Doctor name
  if (f.doctorName) {
    out = out.filter((d) => normalize(d.name).includes(f.doctorName));
  }

  // Specialization
  if (f.specialization) {
    out = out.filter((d) => normalize(d.specialization) === f.specialization);
  }

  /**
   * ✅ FIX (your bug):
   * If District is selected BUT Hospital Name is empty,
   * we still must filter results by that district.
   *
   * We do this by filtering doctors whose hospitals[] contain
   * any hospital that belongs to the selected district.
   */
  if (f.location && !f.hospital) {
    const allowedHospitals = (HOSPITALS_BY_DISTRICT_VALUES[f.location] || []).map(normalize);

    // Main method: filter by mapped hospitals (works with your current doctor dataset shape)
    if (allowedHospitals.length > 0) {
      out = out.filter((d) => {
        const docHospitals = (d.hospitals || []).map(normalize);
        return docHospitals.some((h) => allowedHospitals.includes(h));
      });
    } else {
      // Fallback if your dataset has doctor.location directly
      if (out.some((d) => !!d.location)) {
        out = out.filter((d) => normalize(d.location) === f.location);
      }
    }
  }

  // Hospital name (when explicitly selected)
  if (f.hospital) {
    out = out.filter((d) =>
      (d.hospitals || []).some((h) => normalize(h) === f.hospital)
    );
  }

  // Hospital Type (only filters if dataset contains it)
  if (f.hospitalType && out.some((d) => !!d.hospitalType)) {
    out = out.filter((d) => normalize(d.hospitalType) === f.hospitalType);
  }

  // Date is kept for backend; mock filtering ignores it unless your dataset supports schedules
  void f.date;

  return out;
}

async function loadMockDoctors(): Promise<Doctor[]> {
  const res = await fetch("/mock/doctors.json", { cache: "no-store" });
  const data = await res.json();
  return (Array.isArray(data) ? data : data?.data) as Doctor[];
}

export const fetchDoctors = createAsyncThunk<
  Doctor[],
  { mode: "normal" },
  { state: { search: SearchState } }
>("search/fetchDoctors", async (_arg, { getState }) => {
  const { normal } = getState().search;

  const useMock = process.env.NEXT_PUBLIC_USE_MOCK === "1";

  const params = {
    doctorName: normal.doctorName || undefined,
    specialization: normal.specialization || undefined,
    hospitalType: normal.hospitalType || undefined,
    location: normal.location || undefined,
    hospital: normal.hospital || undefined,
    date: normal.date || undefined,
  };

  if (useMock) {
    const list = await loadMockDoctors();
    return filterDoctorsClient(list, normal);
  }

  // Backend first, fallback to mock
  try {
    const res = await api.get("/doctors/search", { params });
    const payload = Array.isArray(res.data) ? res.data : res.data?.data;
    if (Array.isArray(payload)) return payload as Doctor[];
  } catch {
    const list = await loadMockDoctors();
    return filterDoctorsClient(list, normal);
  }

  const list = await loadMockDoctors();
  return filterDoctorsClient(list, normal);
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
    resetAllFilters: (state) => {
      state.normal = { ...initialState.normal };
      state.error = null;
    },
  },
  extraReducers: (builder) => {
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

export const { setNormalField, resetAllFilters } = searchSlice.actions;
export default searchSlice.reducer;
