"use client";
import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import {setSelectedHospitalId,setSelectedSessionCard,fetchDoctorHospitals,fetchAllSessions,} from "@/store/booking/bookingSlice";
import type { Hospital, SessionCard } from "./types";

interface StepTypeAndDateProps {
  doctorId: string;
  onNext: () => void;
}

export const StepTypeAndDate: React.FC<StepTypeAndDateProps> = ({
  doctorId,
  onNext,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  // Redux state
  const {
    selectedHospitalId,
    selectedSessionId,
    isLoadingHospitals,
    isLoadingSessions,
  } = useSelector((state: RootState) => state.booking);

  // Local state for hospital filter
  const [filterHospitalId, setFilterHospitalId] = useState<string>("");

  // ==================== HARDCODED DATA FOR TESTING ====================
  // 🔴 REMOVE THESE WHEN CONNECTING TO BACKEND 🔴

  const [hospitals, setHospitals] = useState<Hospital[]>([
    { id: "1", name: "National Hospital", location: "Colombo" },
    { id: "2", name: "Lanka Hospital", location: "Colombo" },
    { id: "3", name: "Asiri Hospital", location: "Colombo" },
  ]);

  // Generate mock sessions for next 7 days
  const generateMockSessions = (): SessionCard[] => {
    const sessions: SessionCard[] = [];
    const today = new Date();
    const hospitalNames = ["National Hospital", "Lanka Hospital", "Asiri Hospital"];
    const hospitalIds = ["1", "2", "3"];
    const times = [
      { time: "8:00 AM", name: "Morning" },
      { time: "1:00 PM", name: "Afternoon" },
      { time: "6:00 PM", name: "Evening" },
    ];

    for (let day = 0; day < 7; day++) {
      const date = new Date(today);
      date.setDate(date.getDate() + day);

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const dayNum = String(date.getDate()).padStart(2, "0");
      const isoDate = `${year}-${month}-${dayNum}`;

      // Format date
      let dateFormatted = "";
      if (day === 0) {
        dateFormatted = `Today, ${date.toLocaleDateString("en-US", { month: "long", day: "numeric" })}`;
      } else if (day === 1) {
        dateFormatted = `Tomorrow, ${date.toLocaleDateString("en-US", { month: "long", day: "numeric" })}`;
      } else {
        dateFormatted = date.toLocaleDateString("en-US", { 
          month: "short", 
          day: "numeric", 
          weekday: "long" 
        });
      }

      // Create 2-3 random sessions per day
      const numSessions = Math.floor(Math.random() * 2) + 2; // 2 or 3 sessions
      for (let i = 0; i < numSessions && i < times.length; i++) {
        const hospitalIdx = Math.floor(Math.random() * hospitalNames.length);
        sessions.push({
          id: `session-${day}-${i}`,
          hospitalId: hospitalIds[hospitalIdx],
          hospitalName: hospitalNames[hospitalIdx],
          hospitalLocation: "Colombo",
          date: isoDate,
          dateFormatted: dateFormatted,
          startTime: times[i].time,
        });
      }
    }

    // Sort by date, then by time
    return sessions.sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date);
      return a.startTime.localeCompare(b.startTime);
    });
  };

  const [allSessions, setAllSessions] = useState<SessionCard[]>(generateMockSessions());
  // ==================== END HARDCODED DATA ====================

  // ==================== UNCOMMENT WHEN CONNECTING TO BACKEND ====================
  /*
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [allSessions, setAllSessions] = useState<SessionCard[]>([]);

  // Fetch hospitals on mount
  useEffect(() => {
    if (doctorId) {
      dispatch(fetchDoctorHospitals(doctorId))
        .unwrap()
        .then((data) => setHospitals(data))
        .catch((error) => console.error("Error fetching hospitals:", error));
    }
  }, [doctorId, dispatch]);

  // Fetch all sessions on mount or when filter changes
  useEffect(() => {
    if (doctorId) {
      dispatch(
        fetchAllSessions({
          doctorId,
          hospitalId: filterHospitalId || undefined,
        })
      )
        .unwrap()
        .then((data) => setAllSessions(data))
        .catch((error) => console.error("Error fetching sessions:", error));
    }
  }, [doctorId, filterHospitalId, dispatch]);
  */
  // ==================== END BACKEND CONNECTION CODE ====================

  // Filter sessions by hospital if selected
  const filteredSessions = useMemo(() => {
    if (!filterHospitalId) return allSessions;
    return allSessions.filter((s) => s.hospitalId === filterHospitalId);
  }, [allSessions, filterHospitalId]);

  // Handle hospital filter change
  const handleHospitalFilterChange = (hospitalId: string) => {
    setFilterHospitalId(hospitalId);
  };

  // Handle session card selection
  const handleSessionSelect = (session: SessionCard) => {
    dispatch(
      setSelectedSessionCard({
        sessionId: session.id,
        hospitalId: session.hospitalId,
        hospitalName: session.hospitalName,
        date: session.date,
        startTime: session.startTime,
      })
    );
  };

  // Check if form is valid
  const isFormValid = selectedSessionId !== null;

  return (
    <div className="space-y-4">
      {/* Select Hospital (Optional Filter) */}
      <div>
        <h3 className="text-lg font-semibold mb-0.5">
          Select Hospital <span className="text-sm text-gray-500"></span>
        </h3>
        <div className="mb-3 flex items-center gap-2 text-sm text-blue-600">
          <svg
            className="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          <span>Filter sessions by hospital or view all</span>
        </div>
        {isLoadingHospitals ? (
          <div className="text-gray-500">Loading hospitals...</div>
        ) : (
          <select
            className="w-full rounded-xl border-2 border-gray-300 px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            value={filterHospitalId}
            onChange={(e) => handleHospitalFilterChange(e.target.value)}
          >
            <option value="">All Hospitals</option>
            {hospitals.map((hospital) => (
              <option key={hospital.id} value={hospital.id}>
                {hospital.name}, {hospital.location}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Available Sessions */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Available Sessions</h3>
        {isLoadingSessions ? (
          <div className="text-gray-500">Loading sessions...</div>
        ) : filteredSessions.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
            <svg
              className="w-16 h-16 mx-auto text-gray-400 mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-gray-600 font-medium">
              No sessions available for this hospital within next 7 days.
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Try selecting a different hospital or view all hospitals.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {filteredSessions.map((session) => {
              const isSelected = selectedSessionId === session.id;

              return (
                <button
                  key={session.id}
                  type="button"
                  onClick={() => handleSessionSelect(session)}
                  className={`rounded-xl border-2 p-3 text-left transition-all duration-200 hover:shadow-lg ${
                    isSelected
                      ? "border-green-500 bg-green-50 shadow-md ring-2 ring-green-200"
                      : "border-gray-300 bg-white hover:border-green-300"
                  }`}
                >
                  <div className="space-y-1">
                    {/* Hospital */}
                    <div className="flex items-center gap-2">
                      <svg
                        className={`w-5 h-5 flex-shrink-0 ${
                          isSelected ? "text-green-600" : "text-gray-600"
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                      <span
                        className={`font-semibold ${
                          isSelected ? "text-green-800" : "text-gray-900"
                        }`}
                      >
                        {session.hospitalName}
                      </span>
                    </div>

                    {/* Date */}
                    <div className="flex items-center gap-2">
                      <svg
                        className={`w-5 h-5 flex-shrink-0 ${
                          isSelected ? "text-green-600" : "text-gray-600"
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span
                        className={`text-sm ${
                          isSelected ? "text-green-700" : "text-gray-700"
                        }`}
                      >
                        {session.dateFormatted}
                      </span>
                    </div>

                    {/* Time */}
                    <div className="flex items-center gap-2">
                      <svg
                        className={`w-5 h-5 flex-shrink-0 ${
                          isSelected ? "text-green-600" : "text-gray-600"
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span
                        className={`text-sm font-medium ${
                          isSelected ? "text-green-700" : "text-gray-700"
                        }`}
                      >
                        {session.startTime}
                      </span>
                    </div>

                    {/* Selected Indicator */}
                    {isSelected && (
                      <div className="flex items-center justify-end pt-0.5">
                        <div className="flex items-center gap-1 text-green-600">
                          <svg
                            className="w-5 h-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                          >
                            <path d="M20 6 9 17l-5-5" />
                          </svg>
                          <span className="text-sm font-semibold">Selected</span>
                        </div>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Next Button */}
      <div className="flex justify-end pt-4">
        <button
          type="button"
          onClick={onNext}
          disabled={!isFormValid}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition ease-in-out duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          Next
        </button>
      </div>
    </div>
  );
};