"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
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

/**
 * NOTES
 * - Normal search fields: doctorName, specialization, hospital, date
 * - Advanced search fields: hospitalType, location, hospitalName, specialization, gender, sessionTime, date, priceRange, doctorName
 * - Advanced is a dropdown panel toggled by a small button next to normal search.
 * - API: uses `api` from "@/utils/api" via the async thunk in the slice.
 * - Single-file component as requested (no child components).
 */

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
    { label: "Dr Sanjeewa", value: "dr sanjeewa" },
    { label: "Dr John", value: "dr john" },
    { label: "Dr Peter", value: "dr peter" },
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

  // --- Close advanced when clicking outside of panel
  const advRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (!advRef.current) return;
      const target = e.target as Node;
      const inside = advRef.current.contains(target);
      const toggleBtn = document.getElementById("adv-toggle-btn");
      const clickedToggle = toggleBtn ? toggleBtn.contains(target) : false;
      if (!inside && !clickedToggle && showAdvanced) {
        dispatch(toggleAdvancedOpen(false));
      }
    };
    document.addEventListener("click", handle);
    return () => document.removeEventListener("click", handle);
  }, [dispatch, showAdvanced]);

  // --- Run initial fetch with defaults (optional)
  useEffect(() => {
    // Don’t auto-run if you’d rather wait for user input.
    // Here we run once to show initial data grid quickly.
    if (!hasSearchedOnce) {
      dispatch(fetchDoctors({ mode: "normal" }) as any);
    }
  }, [dispatch, hasSearchedOnce]);

  const onNormalSearch = useCallback(() => {
    dispatch(fetchDoctors({ mode: "normal" }) as any);
  }, [dispatch]);

  const onAdvancedSearch = useCallback(() => {
    dispatch(fetchDoctors({ mode: "advanced" }) as any);
  }, [dispatch]);

  const placeholderImg = useMemo(
    () =>
      "https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=1200&auto=format&fit=crop",
    []
  );

  const goBook = useCallback(
    (doc: any) => {
      // Route to your booking page with useful defaults
      const hospital = Array.isArray(doc?.hospitals) ? doc.hospitals[0] : "";
      const fee = doc?.fee ?? "";
      router.push(
        `/booking?doctorName=${encodeURIComponent(doc?.name || "")}&hospital=${encodeURIComponent(
          hospital || ""
        )}&fee=${encodeURIComponent(fee)}`
      );
    },
    [router]
  );

  // --- Small helpers
  const inputBase =
    "w-full h-10 px-3 rounded-md border outline-none text-sm";
  const selectBase =
    "w-full h-10 px-3 rounded-md border outline-none text-sm bg-white";
  const labelBase = "text-xs font-medium text-gray-600 mb-1";
  const row = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3";

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* HEADER */}
      <div className="mb-4">
        <h1 className="text-2xl font-semibold">Find a Doctor</h1>
        <p className="text-sm text-gray-600">
          Book medical consultations across hospitals and specializations.
        </p>
      </div>

      {/* NORMAL SEARCH BAR (top, like existing) */}
      <div className="w-full rounded-xl border p-4 bg-white shadow-sm">
        <div className={row}>
          {/* Doctor Name */}
          <div className="flex flex-col">
            <label className={labelBase}>Doctor name</label>
            <input
              className={inputBase}
              placeholder="Search Doctor Name"
              value={normal.doctorName}
              onChange={(e) =>
                dispatch(setNormalField({ key: "doctorName", value: e.target.value }))
              }
            />
          </div>
          {/* Specialization */}
          <div className="flex flex-col">
            <label className={labelBase}>Specialization</label>
            <select
              className={selectBase}
              value={normal.specialization}
              onChange={(e) =>
                dispatch(setNormalField({ key: "specialization", value: e.target.value }))
              }
            >
              <option value="">Select Specialization</option>
              {ADV_OPTIONS.specialization.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          {/* Hospital */}
          <div className="flex flex-col">
            <label className={labelBase}>Hospital</label>
            <select
              className={selectBase}
              value={normal.hospital}
              onChange={(e) =>
                dispatch(setNormalField({ key: "hospital", value: e.target.value }))
              }
            >
              <option value="">Select Hospital</option>
              {ADV_OPTIONS.hospitalName.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          {/* Date */}
          <div className="flex flex-col">
            <label className={labelBase}>Date</label>
            <input
              type="date"
              className={inputBase}
              value={normal.date}
              onChange={(e) =>
                dispatch(setNormalField({ key: "date", value: e.target.value }))
              }
            />
          </div>
        </div>

        {/* Actions row */}
        <div className="mt-4 flex items-center gap-2">
          <button
            onClick={onNormalSearch}
            className="h-10 px-4 rounded-md bg-emerald-600 text-white text-sm font-medium hover:opacity-90"
          >
            Search
          </button>

          <button
            id="adv-toggle-btn"
            onClick={() => dispatch(toggleAdvancedOpen(!showAdvanced))}
            className="h-10 px-3 rounded-md border text-sm bg-white hover:bg-gray-50"
            aria-expanded={showAdvanced}
            aria-controls="advanced-panel"
          >
            Advanced Search
          </button>

          <button
            onClick={async () => {
                // 1) Clear all filters
                dispatch(resetAllFilters());
                // 2) Reload full catalog (no filters) → shows all doctors
                await dispatch(fetchDoctors({ mode: "normal" }) as any);
            }}
            className="h-10 px-3 rounded-md border text-sm bg-white hover:bg-gray-50"
            title="Reset all fields"
        >
            Reset
          </button>

        </div>

        {/* ADVANCED DROPDOWN PANEL */}
        {showAdvanced && (
          <div
            ref={advRef}
            id="advanced-panel"
            className="mt-4 rounded-lg border bg-slate-50 p-4"
          >
            <div className={row}>
              {/* Hospital Type */}
              <div className="flex flex-col">
                <label className={labelBase}>Hospital Type</label>
                <select
                  className={selectBase}
                  value={advanced.hospitalType}
                  onChange={(e) =>
                    dispatch(
                      setAdvancedField({ key: "hospitalType", value: e.target.value })
                    )
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

              {/* Location */}
              <div className="flex flex-col">
                <label className={labelBase}>Location</label>
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

              {/* Hospital Name */}
              <div className="flex flex-col">
                <label className={labelBase}>Hospital Name</label>
                <select
                  className={selectBase}
                  value={advanced.hospitalName}
                  onChange={(e) =>
                    dispatch(
                      setAdvancedField({ key: "hospitalName", value: e.target.value })
                    )
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

              {/* Specialization */}
              <div className="flex flex-col">
                <label className={labelBase}>Specialization</label>
                <select
                  className={selectBase}
                  value={advanced.specialization}
                  onChange={(e) =>
                    dispatch(
                      setAdvancedField({ key: "specialization", value: e.target.value })
                    )
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

              {/* Gender */}
              <div className="flex flex-col">
                <label className={labelBase}>Gender</label>
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

              {/* Session Time */}
              <div className="flex flex-col">
                <label className={labelBase}>Session Time</label>
                <select
                  className={selectBase}
                  value={advanced.sessionTime}
                  onChange={(e) =>
                    dispatch(
                      setAdvancedField({ key: "sessionTime", value: e.target.value })
                    )
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

              {/* Date */}
              <div className="flex flex-col">
                <label className={labelBase}>Date</label>
                <input
                  type="date"
                  className={inputBase}
                  value={advanced.date}
                  onChange={(e) =>
                    dispatch(setAdvancedField({ key: "date", value: e.target.value }))
                  }
                />
              </div>

              {/* Price Range */}
              <div className="flex flex-col">
                <label className={labelBase}>Price Range</label>
                <select
                  className={selectBase}
                  value={advanced.priceRange}
                  onChange={(e) =>
                    dispatch(
                      setAdvancedField({ key: "priceRange", value: e.target.value })
                    )
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

              {/* Doctor name (advanced list) */}
              <div className="flex flex-col">
                <label className={labelBase}>Doctor name</label>
                <select
                  className={selectBase}
                  value={advanced.doctorName}
                  onChange={(e) =>
                    dispatch(
                      setAdvancedField({ key: "doctorName", value: e.target.value })
                    )
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
              <button
                onClick={onAdvancedSearch}
                className="h-10 px-4 rounded-md bg-blue-600 text-white text-sm font-medium hover:opacity-90"
              >
                Advanced Search
              </button>
              <span className="text-xs text-gray-500">
                Use this button to search with the advanced filters only.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* RESULTS */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Results</h2>
          {loading && (
            <span className="text-sm text-gray-500">Searching doctors…</span>
          )}
        </div>

        {error && (
          <div className="mb-4 rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {results.map((doc) => (
            <div
              key={doc.id}
              className="rounded-xl border bg-white shadow-sm overflow-hidden flex flex-col"
            >
              <div className="relative h-36 w-full overflow-hidden bg-gray-100">
                <img
                  src={doc.image || placeholderImg}
                  alt={doc.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <div className="text-base font-semibold">{doc.name}</div>
                <div className="text-xs text-emerald-700 font-medium mt-0.5">
                  {doc.specialization || "—"}
                </div>
                <div className="text-xs text-gray-600 mt-2">
                  <span className="font-medium">Hospitals:</span>{" "}
                  {Array.isArray(doc.hospitals) && doc.hospitals.length > 0
                    ? doc.hospitals.join(", ")
                    : "—"}
                </div>
                {doc.fee ? (
                  <div className="text-xs text-gray-600 mt-1">
                    <span className="font-medium">Fee:</span> LKR {doc.fee}
                  </div>
                ) : null}
                <div className="mt-auto pt-4">
                  <button
                    onClick={() => goBook(doc)}
                    className="w-full h-10 rounded-md bg-emerald-600 text-white text-sm font-medium hover:opacity-90"
                  >
                    Book
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {!loading && results.length === 0 && (
          <div className="mt-10 text-center text-sm text-gray-600">
            No doctors found. Try adjusting your filters.
          </div>
        )}
      </div>
    </div>
  );
}
