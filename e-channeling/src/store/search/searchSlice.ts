import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

/* ---------- Types ---------- */
type NormalFilters = {
  doctorName: string;      // -> keyword
  specialization: string;  // -> specialtyId
  hospitalType: string;    // -> hospitalType
  location: string;        // -> district
  hospital: string;        // -> hospitalId (mapped from hospital name)
  date: string;            // -> date
};

export type Doctor = {
  id: string;
  name?: string;
  specialization?: string;
  hospitals?: string[];
  fee?: number | string;
  image?: string;
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

/* ---------- MAPPINGS (UI values -> API expected values) ---------- */

/**
 * ✅ District (UI stores lowercase values like "colombo")
 * API expects title-case values like "Mannar", so we map properly.
 */
const DISTRICT_MAP: Record<string, string> = {
  colombo: "Colombo",
  kandy: "Kandy",
//   gampaha: "Gampaha",
//   jaffna: "Jaffna",
};

/**
 * ✅ Hospital Type:
 * UI values: "government" | "private"
 * API example shows: hospitalType=PRIVATE
 */
const HOSPITAL_TYPE_MAP: Record<string, string> = {
  private: "PRIVATE",
  government: "GOVERNMENT", // if your backend expects "GOVERNMENT"
};

/**
 * ✅ Speciality:
 * UI values are lowercase (e.g., "cardiology")
 * API expects a string in specialtyId (example: Surgery, Nephrology).
 * We'll send proper label casing for your options.
 */
const SPECIALTY_MAP: Record<string, string> = {
  nephrology: "Nephrology",
  geriatrics: "Geriatrics",
  "obstetrics and gynecology": "Obstetrics and Gynecology",
  cardiology: "Cardiology",
  surgery: "Surgery",
};


/**
 * ✅ Hospital Name -> Hospital ID
 * Your API filters by hospitalId. Your UI dropdown uses hospital *names*.
 * So we MUST map hospital name -> hospitalId.
 *
 * ⚠️ IMPORTANT: Replace these IDs with your real hospital IDs from your DB.
 * I only have ONE example from your screenshot.
 */
const HOSPITAL_ID_MAP: Record<string, string> = {
  "durdan": "cmigxd6a40000v4n4b5tqtpbs",
  "sri jayewardenepura general hospital": "cmihxkds10001v4p6j8a0tq9r",
  "kandy general hospital": "cmihxkds20002v4p8k4b9u1ls",
  "lady ridgeway hospital for children": "cmihxkds30003v4pb8s9rtzqw",
  "national hospital of sri lanka": "cmihxkds40004v4pd2tq8amrx",
  "asiri hospital": "cmiszgzoy0000v404s822jm9c",
  "joe": "cmj0y7qbe0000ih048xnovh8k",
};


function normalize(v?: string) {
  return (v || "").trim().toLowerCase();
}

/* ---------- API Fetch ---------- */
async function fetchDoctorsFromAPI(filters: NormalFilters): Promise<Doctor[]> {
  // Use relative URL so it works on Vercel + local (no CORS issues)
  const baseUrl = "/api/search";

  const params = new URLSearchParams();

  // 1) Doctor Name -> keyword
  const keyword = filters.doctorName.trim();
  if (keyword) params.set("keyword", keyword);

  // 2) Speciality -> specialtyId
  const specKey = normalize(filters.specialization);
  if (specKey) params.set("specialtyId", SPECIALTY_MAP[specKey] ?? filters.specialization);

  // 3) Date -> date (must be YYYY-MM-DD, your input already is)
  if (filters.date) params.set("date", filters.date);

  // 4) District -> district
  const distKey = normalize(filters.location);
  if (distKey) params.set("district", DISTRICT_MAP[distKey] ?? filters.location);

  // 5) Hospital Type -> hospitalType
  const typeKey = normalize(filters.hospitalType);
  if (typeKey) params.set("hospitalType", HOSPITAL_TYPE_MAP[typeKey] ?? filters.hospitalType);

  // 6) Hospital Name -> hospitalId (only if selected AND mapped)


//   const hospitalKey = normalize(filters.hospital);
//   if (hospitalKey) {
//     const hospitalId = HOSPITAL_ID_MAP[hospitalKey];
//     if (hospitalId) {
//       params.set("hospitalId", hospitalId);
//     }
//     // If not mapped, we simply do NOT send hospitalId (so it won't break the search).
//     // You should fill real IDs in HOSPITAL_ID_MAP for full functionality.
//   }

  const hospitalNameKey = (filters.hospital || "").trim().toLowerCase();
    if (hospitalNameKey) {
    const hospitalId = HOSPITAL_ID_MAP[hospitalNameKey];
    if (hospitalId) params.set("hospitalId", hospitalId);
    }


  const url = params.toString() ? `${baseUrl}?${params.toString()}` : baseUrl;

  const res = await fetch(url, { method: "GET" });

  if (!res.ok) {
    throw new Error(`Search API failed (${res.status})`);
  }

  const data = await res.json();

  // Support different response shapes:
  // - array directly
  // - { data: [...] }
  // - { doctors: [...] }
  const payload =
    Array.isArray(data) ? data :
    Array.isArray(data?.data) ? data.data :
    Array.isArray(data?.doctors) ? data.doctors :
    [];

return (payload as any[]).map((d) => ({
  ...d,

  // ✅ for your card display (doc.hospitals.join(", "))
  hospitals: Array.isArray(d?.doctor_hospitals)
    ? d.doctor_hospitals
        .map((x: any) => x?.hospitals?.name)
        .filter(Boolean)
    : [],

  // ✅ for your card image (doc.image)
  image: d?.profileImage || d?.image || null,

  // ✅ for your card fee display (doc.fee)
  fee: d?.consultationFee ?? d?.fee ?? null,
})) as Doctor[];

}

/* ---------- Thunk ---------- */
export const fetchDoctors = createAsyncThunk<
  Doctor[],
  { mode: "normal" },
  { state: { search: SearchState } }
>("search/fetchDoctors", async (_arg, { getState }) => {
  const { normal } = getState().search;
  return await fetchDoctorsFromAPI(normal);
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
        state.error = action.error.message || "Something went wrong";
      });
  },
});

export const { setNormalField, resetAllFilters } = searchSlice.actions;
export default searchSlice.reducer;
