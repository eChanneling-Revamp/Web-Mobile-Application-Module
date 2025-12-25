"use client";

import React, { useCallback, useEffect, useMemo } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { setNormalField, resetAllFilters, fetchDoctors } from "@/store/search/searchSlice";
import { useRouter } from "next/navigation";

type Option = { label: string; value: string };

const OPTIONS = {
  hospitalType: [
    { label: "Private Hospital", value: "private hospital" },
    { label: "Public Hospital", value: "public hospital" },
    { label: "Ayurvedic Hospital", value: "ayurvedic hospital" },
  ] as Option[],

  district: [
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
    { label: "ENT Surgeon", value: "ent surgeon" },
    { label: "Pediatrics", value: "pediatrics" },
  ] as Option[],
};

// District -> Hospitals mapping (for dependent dropdown)
const HOSPITALS_BY_DISTRICT: Record<string, Option[]> = {
  colombo: [{ label: "Lanka Hospital", value: "lanka hospital" }],
  kandy: [{ label: "Kandy General Hospital", value: "kandy general hospital" }],
  gampaha: [{ label: "Gampaha General Hospital", value: "gampaha general hospital" }],
  jaffna: [{ label: "Jaffna General Hospital", value: "jaffna general hospital" }],
};

export default function SearchPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { normal, results, loading, error, hasSearchedOnce } = useSelector(
    (s: RootState) => s.search
  );

  // initial load → show all
  useEffect(() => {
    if (!hasSearchedOnce) dispatch(fetchDoctors({ mode: "normal" }));
  }, [dispatch, hasSearchedOnce]);

  const onNormalSearch = useCallback(() => {
    dispatch(fetchDoctors({ mode: "normal" }));
  }, [dispatch]);

  const placeholderImg = useMemo(() => "/sample-doctor.png", []);

  // Hospital options depend on District
  const filteredHospitalOptions = useMemo(() => {
    const district = (normal.location || "").toLowerCase().trim();
    if (!district) return OPTIONS.hospitalName; // show all if no district
    return HOSPITALS_BY_DISTRICT[district] ?? OPTIONS.hospitalName; // fallback
  }, [normal.location]);

  // If district changes and selected hospital is not in that district, clear it
  useEffect(() => {
    if (!normal.location) return;

    const allowed = new Set(filteredHospitalOptions.map((h) => h.value));
    if (normal.hospital && !allowed.has(normal.hospital)) {
      dispatch(setNormalField({ key: "hospital", value: "" }));
    }
  }, [dispatch, normal.location, normal.hospital, filteredHospitalOptions]);

  interface Doctor {
    id?: string;
    name?: string;
    hospitals?: string | string[];
    fee?: number | string;
  }

  const goBook = (doc: Doctor) => {
    const hospital = Array.isArray(doc?.hospitals) ? doc.hospitals[0] : "";
    router.push(
      `/booking?doctorName=${encodeURIComponent(doc?.name || "")}&hospital=${encodeURIComponent(
        hospital || ""
      )}&fee=${encodeURIComponent(doc?.fee ?? "")}`
    );
  };

  /* ------- UI tokens ------- */
  const greenBtn =
    "h-10 px-6 rounded-md bg-green-500 hover:bg-green-600 text-white text-sm font-semibold cursor-pointer hover:opacity-95 active:opacity-100";
  const ghostBtn =
    "h-10 px-4 rounded-md border border-gray-400 text-sm bg-white hover:bg-gray-50 cursor-pointer";
  const inputBase =
    "h-11 w-full rounded-md border border-gray-200 px-3 text-[14px] outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-100 bg-white";
  const selectBase = inputBase;

  const labelClass =
    "text-[12px] font-medium text-gray-600 mb-1 text-left self-start pl-2";

  return (
    <div className="min-h-screen bg-[#F7F8FB]">
      {/* HERO */}
      <section className="mx-auto max-w-[1400px] px-10 pt-8">
        <div
          className="relative rounded-2xl overflow-hidden shadow-sm text-center"
          style={{
            background: "linear-gradient(135deg,#099d9b 0%,#1b74e8 100%)",
          }}
        >
          <h1 className="text-white font-bold tracking-tight text-2xl sm:text-3xl md:text-4xl leading-tight drop-shadow-lg px-6 pt-6">
            Your Health, Our Priority
          </h1>
          <p className="text-white/90 text-sm md:text-[15px] px-6 pb-2 mt-3">
            Find and book appointments with top doctors near you
          </p>

          {/* Search box */}
          <div className="w-full flex justify-center pb-8 pt-6">
            <div className="w-[92%] md:w-[860px] bg-white/95 backdrop-blur rounded-xl shadow-md border border-white/70 p-4">
              {/* Search input */}
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

              {/* Filters row
                  Order required:
                  Speciality | Hospital Type | District | Hospital Name | Date | Find
              */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[1fr_1fr_1fr_1fr_1fr_120px] gap-3">
                {/* Speciality */}
                <div className="flex flex-col items-start">
                  <span className={labelClass}>Speciality</span>
                  <select
                    className={selectBase}
                    value={normal.specialization}
                    onChange={(e) =>
                      dispatch(setNormalField({ key: "specialization", value: e.target.value }))
                    }
                  >
                    <option value="">All Specialties</option>
                    {OPTIONS.specialization.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Hospital Type */}
                <div className="flex flex-col items-start">
                  <span className={labelClass}>Hospital Type</span>
                  <select
                    className={selectBase}
                    value={normal.hospitalType}
                    onChange={(e) =>
                      dispatch(setNormalField({ key: "hospitalType", value: e.target.value }))
                    }
                  >
                    <option value="">Any</option>
                    {OPTIONS.hospitalType.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* District */}
                <div className="flex flex-col items-start">
                  <span className={labelClass}>District</span>
                  <select
                    className={selectBase}
                    value={normal.location}
                    onChange={(e) =>
                      dispatch(setNormalField({ key: "location", value: e.target.value }))
                    }
                  >
                    <option value="">Any</option>
                    {OPTIONS.district.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Hospital Name (depends on District) */}
                <div className="flex flex-col items-start">
                  <span className={labelClass}>Hospital Name</span>
                  <select
                    className={selectBase}
                    value={normal.hospital}
                    onChange={(e) =>
                      dispatch(setNormalField({ key: "hospital", value: e.target.value }))
                    }
                  >
                    <option value="">All Hospitals</option>
                    {filteredHospitalOptions.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date */}
                <div className="flex flex-col items-start">
                  <span className={labelClass}>Date</span>
                  <input
                    type="date"
                    className={inputBase}
                    value={normal.date}
                    onChange={(e) => dispatch(setNormalField({ key: "date", value: e.target.value }))}
                  />
                </div>

                {/* Find */}
                <div className="flex flex-col justify-end">
                  <button onClick={onNormalSearch} className={greenBtn}>
                    Find
                  </button>
                </div>
              </div>

              {/* Reset aligned under Find (right corner) */}
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[1fr_1fr_1fr_1fr_1fr_120px] gap-3">
                <div className="md:col-span-5" />
                <button
                  onClick={async () => {
                    dispatch(resetAllFilters());
                    await dispatch(fetchDoctors({ mode: "normal" }));
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

      {/* RESULTS */}
      <section className="mx-auto max-w-[1400px] px-10 mt-10 pb-16">
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

        <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {results.map((doc: any) => (
            <div
              key={doc.id}
              className="flex flex-col h-full rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden"
            >
              <div className="h-[220px] w-full bg-gray-100 relative">
                <Image
                  src={doc.image || placeholderImg}
                  alt={doc.name || "Doctor"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                />
              </div>

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
