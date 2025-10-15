"use client";

import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import {
  setNormalField,
  setAdvancedField,
  toggleAdvancedOpen,
  resetAllFilters,
  fetchDoctors,
} from "@/store/search/searchSlice";
import { useRouter } from "next/navigation";

/** Home-UI aligned options (unchanged functionality) */
type Option = { label: string; value: string };

const ADV_OPTIONS = {
  hospitalType: [
    { label: "Private Hospital", value: "private hospital" },
    { label: "Public Hospital", value: "public hospital" },
    { label: "Ayurvedic Hospital", value: "ayurvedic hospital" },
  ] as Option[],
  location: [
    { label: "Colombo", value: "colombo" },
    { label: "Kandy", value: "kandy" },
    { label: "Gampaha", value: "gampaha" },
    { label: "Jaffna", value: "jaffna" },
  ] as Option[],
  hospitalName: [
    { label: "Lanka Hospital", value: "lanka hospital" },
    { label: "Kandy General Hospital", value: "kandy general hospital" },
    { label: "Gampaha General Hospital", value: "gampaha general hospital" },
    { label: "Jaffna General Hospital", value: "jaffna general hospital" },
  ] as Option[],
  specialization: [
    { label: "Cardiology", value: "cardiology" },
    { label: "Dermatology", value: "dermatology" },
    { label: "Neurology", value: "neurology" },
    { label: "ENT Surgeon", value: "ENT Surgeon" },
    { label: "Pediatrics", value: "pediatrics" },
  ] as Option[],
  gender: [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
    { label: "Other", value: "other" },
  ] as Option[],
  sessionTime: [
    { label: "Morning", value: "morning" },
    { label: "Evening", value: "evening" },
  ] as Option[],
  priceRange: [
    { label: "Below 1499", value: "below_1499" },
    { label: "1500 - 2499", value: "1500_2499" },
    { label: "2500 - 3499", value: "2500_3499" },
    { label: "3500 - 4499", value: "3500_4499" },
    { label: "4500 - 5499", value: "4500_5499" },
  ] as Option[],
  doctorName: [
    { label: "Dr. Samantha Perera", value: "Dr. Samantha Perera" },
    { label: "Dr. Sanjeewa Gunasekara", value: "Dr. Sanjeewa Gunasekara" },
    { label: "Dr. John Doe", value: "Dr. John Doe" },
    { label: "Dr. A. B. M. Milhan", value: "Dr. A. B. M. Milhan" },
    { label: "Dr. Peter Jayasekara", value: "Dr. Peter Jayasekara" },
  ] as Option[],
};

export default function Search() {
  const dispatch = useDispatch();
  const router = useRouter();

  const {
    normal,
    advanced,
    showAdvanced,
    results,
    loading,
    error,
    hasSearchedOnce,
  } = useSelector((s: RootState) => s.search);

  // close advanced on outside click (unchanged behavior)
  const advRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (!advRef.current) return;
      const target = e.target as Node;
      const toggleBtn = document.getElementById("adv-toggle-btn");
      if (!advRef.current.contains(target) && !toggleBtn?.contains(target) && showAdvanced) {
        dispatch(toggleAdvancedOpen(false));
      }
    };
    document.addEventListener("click", handle);
    return () => document.removeEventListener("click", handle);
  }, [dispatch, showAdvanced]);

  // initial load → show all
  useEffect(() => {
    if (!hasSearchedOnce) dispatch(fetchDoctors({ mode: "normal" }) as any);
  }, [dispatch, hasSearchedOnce]);

  const onNormalSearch = useCallback(() => {
    dispatch(fetchDoctors({ mode: "normal" }) as any);
  }, [dispatch]);

  const onAdvancedSearch = useCallback(() => {
    dispatch(fetchDoctors({ mode: "advanced" }) as any);
  }, [dispatch]);

  const placeholderImg = useMemo(
    () =>
      "\sample-doctor.png",
    []
  );

  const goBook = (doc: any) => {
    const hospital = Array.isArray(doc?.hospitals) ? doc.hospitals[0] : "";
    router.push(
      `/booking?doctorName=${encodeURIComponent(doc?.name || "")}&hospital=${encodeURIComponent(
        hospital || ""
      )}&fee=${encodeURIComponent(doc?.fee ?? "")}`
    );
  };

  /* ------- UI Tokens to match Home screenshots ------- */
  const greenBtn =
    "h-11 px-6 rounded-md bg-green-500 hover:bg-green-600 text-white text-sm font-semibold hover:opacity-95 active:opacity-100";
  const ghostBtn =
    "h-11 px-4 rounded-md border border-gray-400 text-sm bg-white hover:bg-gray-50";
  const inputBase =
    "h-11 w-full rounded-md border border-gray-200 px-3 text-[14px] outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-100 bg-white";
  const selectBase = inputBase;
  const labelBase = "text-[12px] font-medium text-gray-600 mb-1";
  const gridRow = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3";

  return (
    <div className="min-h-screen bg-[#F7F8FB]">
      {/* HERO (same look as Home hero) */}
      <section className="mx-auto max-w-[1400px] px-5 pt-6">
        <div
          className="relative rounded-2xl overflow-hidden shadow-sm"
          style={{
            background: "linear-gradient(135deg,#099d9b 0%,#1b74e8 100%)",
          }}
        >
          {/* title/subtitle like Home */}
          <h1 className="text-white font-extrabold tracking-tight text-[34px] md:text-[42px] leading-tight drop-shadow-lg px-6 pt-6">
            Your Health, Our Priority
          </h1>
          <p className="text-white/90 text-sm md:text-[15px] px-6 pb-2">
            Find and book appointments with top doctors near you
          </p>

          {/* floating white search box */}
          <div className="w-full flex justify-center pb-10 pt-6">
            <div className="w-[92%] md:w-[860px] bg-white/95 backdrop-blur rounded-xl shadow-md border border-white/70 p-4">
              {/* Row 1: search input like home */}
              <div className="mb-3">
                <input
                  className={inputBase}
                  placeholder="Search by doctor, specialty or hospital"
                  value={normal.doctorName}
                  onChange={(e) =>
                    dispatch(setNormalField({ key: "doctorName", value: e.target.value }))
                  }
                />
              </div>
              {/* Row 2: specialization + hospital + date + Find */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[1fr_1fr_1fr_120px] gap-3">
                <select
                  className={selectBase}
                  value={normal.specialization}
                  onChange={(e) =>
                    dispatch(setNormalField({ key: "specialization", value: e.target.value }))
                  }
                >
                  <option value="">All Specialties</option>
                  {ADV_OPTIONS.specialization.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>

                <select
                  className={selectBase}
                  value={normal.hospital}
                  onChange={(e) =>
                    dispatch(setNormalField({ key: "hospital", value: e.target.value }))
                  }
                >
                  <option value="">All Hospitals</option>
                  {ADV_OPTIONS.hospitalName.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>

                <input
                  type="date"
                  className={inputBase}
                  value={normal.date}
                  onChange={(e) =>
                    dispatch(setNormalField({ key: "date", value: e.target.value }))
                  }
                />

                <button onClick={onNormalSearch} className={greenBtn}>
                  Find
                </button>
              </div>

              {/* actions: Advanced & Reset */}
              <div className="mt-3 flex items-center gap-2">
                <button
                  id="adv-toggle-btn"
                  onClick={() => dispatch(toggleAdvancedOpen(!showAdvanced))}
                  className={ghostBtn}
                  aria-expanded={showAdvanced}
                  aria-controls="advanced-panel"
                >
                  Advanced Search
                </button>
                <button
                  onClick={async () => {
                    dispatch(resetAllFilters());
                    await dispatch(fetchDoctors({ mode: "normal" }) as any);
                  }}
                  className={ghostBtn}
                  title="Reset all fields"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ADVANCED DROPDOWN (Home card look) */}
      {showAdvanced && (
        <section className="mx-auto max-w-[1200px] px-5 mt-5" id="advanced-panel" ref={advRef}>
          <div className="rounded-xl border bg-white shadow-sm p-5">
            <div className={gridRow}>
              <div className="flex flex-col">
                <span className={labelBase}>Hospital Type</span>
                <select
                  className={selectBase}
                  value={advanced.hospitalType}
                  onChange={(e) =>
                    dispatch(setAdvancedField({ key: "hospitalType", value: e.target.value }))
                  }
                >
                  <option value="">Any</option>
                  {ADV_OPTIONS.hospitalType.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <span className={labelBase}>Location</span>
                <select
                  className={selectBase}
                  value={advanced.location}
                  onChange={(e) =>
                    dispatch(setAdvancedField({ key: "location", value: e.target.value }))
                  }
                >
                  <option value="">Any</option>
                  {ADV_OPTIONS.location.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <span className={labelBase}>Hospital Name</span>
                <select
                  className={selectBase}
                  value={advanced.hospitalName}
                  onChange={(e) =>
                    dispatch(setAdvancedField({ key: "hospitalName", value: e.target.value }))
                  }
                >
                  <option value="">Any</option>
                  {ADV_OPTIONS.hospitalName.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <span className={labelBase}>Specialization</span>
                <select
                  className={selectBase}
                  value={advanced.specialization}
                  onChange={(e) =>
                    dispatch(setAdvancedField({ key: "specialization", value: e.target.value }))
                  }
                >
                  <option value="">Any</option>
                  {ADV_OPTIONS.specialization.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <span className={labelBase}>Gender</span>
                <select
                  className={selectBase}
                  value={advanced.gender}
                  onChange={(e) =>
                    dispatch(setAdvancedField({ key: "gender", value: e.target.value }))
                  }
                >
                  <option value="">Any</option>
                  {ADV_OPTIONS.gender.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <span className={labelBase}>Session Time</span>
                <select
                  className={selectBase}
                  value={advanced.sessionTime}
                  onChange={(e) =>
                    dispatch(setAdvancedField({ key: "sessionTime", value: e.target.value }))
                  }
                >
                  <option value="">Any</option>
                  {ADV_OPTIONS.sessionTime.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <span className={labelBase}>Date</span>
                <input
                  type="date"
                  className={inputBase}
                  value={advanced.date}
                  onChange={(e) =>
                    dispatch(setAdvancedField({ key: "date", value: e.target.value }))
                  }
                />
              </div>

              <div className="flex flex-col">
                <span className={labelBase}>Price Range</span>
                <select
                  className={selectBase}
                  value={advanced.priceRange}
                  onChange={(e) =>
                    dispatch(setAdvancedField({ key: "priceRange", value: e.target.value }))
                  }
                >
                  <option value="">Any</option>
                  {ADV_OPTIONS.priceRange.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <span className={labelBase}>Doctor Name</span>
                <select
                  className={selectBase}
                  value={advanced.doctorName}
                  onChange={(e) =>
                    dispatch(setAdvancedField({ key: "doctorName", value: e.target.value }))
                  }
                >
                  <option value="">Any</option>
                  {ADV_OPTIONS.doctorName.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <button onClick={onAdvancedSearch} className={greenBtn}>
                Advanced Search
              </button>
              <span className="text-xs text-gray-500">
                Use this to search with the filters above.
              </span>
            </div>
          </div>
        </section>
      )}

      {/* RESULTS — card style aligned to Home's cards */}
      <section className="mx-auto max-w-[1200px] px-5 mt-10 pb-16">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[22px] md:text-[24px] font-semibold text-[#0b1324]">
            Results
          </h2>
          {loading && <span className="text-sm text-gray-500">Searching…</span>}
        </div>

        {error && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {results.map((doc) => (
            <div
              key={doc.id}
              className="flex flex-col h-full rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden"
            >
              <div className="h-36 w-full bg-gray-100">
                <img
                  src={doc.image || placeholderImg}
                  alt={doc.name}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Content grows; button is pinned to bottom */}
              <div className="p-4 flex flex-col flex-1">
                <div className="text-[15px] font-semibold text-[#0b1324]">
                  {doc.name}
                </div>
                <div className="text-[12px] text-emerald-700 font-medium mt-1">
                  {doc.specialization || "—"}
                </div>
                <div className="text-[12px] text-gray-600 mt-2">
                  <span className="font-medium">Hospitals:</span>{" "}
                  {Array.isArray(doc.hospitals) && doc.hospitals.length > 0
                    ? doc.hospitals.join(", ")
                    : "—"}
                </div>
                {doc.fee ? (
                  <div className="text-[12px] text-gray-600 mt-1 pb-4">
                    <span className="font-medium">Fee:</span> LKR {doc.fee}
                  </div>
                ) : null}

                <button onClick={() => goBook(doc)} className={`${greenBtn} w-full mt-auto`}>
                  Book
                </button>
              </div>
            </div>
          ))}
        </div>

        {!loading && results.length === 0 && (
          <div className="mt-10 text-center text-sm text-gray-600">
            No doctors found. Try adjusting your filters.
          </div>
        )}
      </section>
    </div>
  );
}
