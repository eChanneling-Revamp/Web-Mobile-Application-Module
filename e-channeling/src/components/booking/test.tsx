"use client";
import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import {
    setSelectedHospitalId,
    setSelectedSessionCard,
    sessionsByDoctorId,
} from "@/store/booking/bookingSlice";
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
        sessionsByDoctorIdLoading,
        sessionsByDoctorIdError,
        doctorSessions
    } = useSelector((state: RootState) => state.booking);

    // Local state for hospital filter
    //const [filterHospitalId, setFilterHospitalId] = useState<string>("");
    const [appointmentType, setAppointmentType] = useState<
        "in-person" | "video-consultation"
    >("in-person");

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const SESSIONS_PER_PAGE = 10;

    useEffect(() => {
        dispatch(sessionsByDoctorId(doctorId))
    }, [dispatch]);

    // // Extract unique locations from sessions for the filter dropdown
    // const uniqueLocations = useMemo(() => {
    //     const locations = new Set<string>();
    //     if (Array.isArray(allSessions)) {
    //         allSessions.forEach((session) => {
    //             if (
    //                 session.hospitalLocation &&
    //                 session.appointmentType === "in-person"
    //             ) {
    //                 locations.add(session.hospitalLocation);
    //             }
    //         });
    //     }
    //     return Array.from(locations).sort();
    // }, [allSessions]);

    // Filter out past sessions
    // const filterPastSessions = (sessions: SessionCard[]): SessionCard[] => {
    //     const now = new Date();
    //     const currentTime = now.getHours() * 60 + now.getMinutes(); // Current time in minutes
    //     const currentDateStr = now.toISOString().split("T")[0]; // YYYY-MM-DD format

    //     return sessions.filter((session) => {
    //         // If session is on a future date, keep it
    //         if (session.date > currentDateStr) return true;

    //         // If session is on a past date, remove it
    //         if (session.date < currentDateStr) return false;

    //         // If session is today, check the time
    //         const sessionTime = session.startTime;
    //         const [time, period] = sessionTime.split(" ");
    //         const [hours, minutes] = time.split(":").map(Number);

    //         let sessionHours = hours;
    //         if (period === "PM" && hours !== 12) sessionHours += 12;
    //         if (period === "AM" && hours === 12) sessionHours = 0;

    //         const sessionTimeInMinutes = sessionHours * 60 + minutes;

    //         return sessionTimeInMinutes > currentTime;
    //     });
    // };

    // // Group sessions by date
    // const groupSessionsByDate = (
    //     sessions: SessionCard[]
    // ): { date: string; dateFormatted: string; sessions: SessionCard[] }[] => {
    //     const groups: {
    //         [key: string]: {
    //             date: string;
    //             dateFormatted: string;
    //             sessions: SessionCard[];
    //         };
    //     } = {};

    //     sessions.forEach((session) => {
    //         if (!groups[session.date]) {
    //             groups[session.date] = {
    //                 date: session.date,
    //                 dateFormatted: session.dateFormatted,
    //                 sessions: [],
    //             };
    //         }
    //         groups[session.date].sessions.push(session);
    //     });

    //     return Object.values(groups).sort((a, b) =>
    //         a.date.localeCompare(b.date)
    //     );
    // };

    // // Filter sessions by appointment type, hospital, remove past sessions, and group by date
    // const { groupedSessions, totalSessions, totalPages } = useMemo(() => {
    //     // First filter by appointment type
    //     let sessions = allSessions.filter(
    //         (s) => s.appointmentType === appointmentType
    //     );

    //     // Then filter by location (only for in-person)
    //     if (appointmentType === "in-person" && filterHospitalId) {
    //         sessions = sessions.filter(
    //             (s) => s.hospitalLocation === filterHospitalId
    //         );
    //     }

    //     // Then filter out past sessions
    //     sessions = filterPastSessions(sessions);

    //     // Group by date
    //     const grouped = groupSessionsByDate(sessions);

        // Calculate pagination
    //     const total = doctorSessions.length;
    //     const pages = Math.ceil(total / SESSIONS_PER_PAGE);

    //     return {
    //         groupedSessions: grouped,
    //         totalSessions: total,
    //         totalPages: pages,
    //     };
    // }, [allSessions, appointmentType, filterHospitalId]);

    // Get sessions for current page
    // const paginatedGroups = useMemo(() => {
    //     const startIdx = (currentPage - 1) * SESSIONS_PER_PAGE;
    //     const endIdx = startIdx + SESSIONS_PER_PAGE;

    //     let sessionCount = 0;
    //     const result: {
    //         date: string;
    //         dateFormatted: string;
    //         sessions: SessionCard[];
    //     }[] = [];

    //     for (const group of groupedSessions) {
    //         if (sessionCount >= endIdx) break;

    //         if (sessionCount + group.sessions.length <= startIdx) {
    //             sessionCount += group.sessions.length;
    //             continue;
    //         }

    //         const groupStartIdx = Math.max(0, startIdx - sessionCount);
    //         const groupEndIdx = Math.min(
    //             group.sessions.length,
    //             groupStartIdx + (endIdx - sessionCount)
    //         );

    //         if (groupStartIdx < group.sessions.length) {
    //             result.push({
    //                 date: group.date,
    //                 dateFormatted: group.dateFormatted,
    //                 sessions: group.sessions.slice(groupStartIdx, groupEndIdx),
    //             });
    //             sessionCount += groupEndIdx - groupStartIdx;
    //         }
    //     }

    //     return result;
    // }, [groupedSessions, currentPage]);

    // Auto-jump to first page with sessions
    // useEffect(() => {
    //     if (paginatedGroups.length === 0 && currentPage > 1 && totalPages > 0) {
    //         setCurrentPage(1);
    //     }
    // }, [paginatedGroups, currentPage, totalPages]);

    // // Reset to page 1 when filter changes
    // useEffect(() => {
    //     setCurrentPage(1);
    // }, [filterHospitalId]);

    // // Reset to page 1 and clear hospital filter when appointment type changes
    // useEffect(() => {
    //     setCurrentPage(1);
    //     if (appointmentType === "video-consultation") {
    //         setFilterHospitalId("");
    //     }
    // }, [appointmentType]);

    // // Handle hospital filter change
    // const handleHospitalFilterChange = (hospitalId: string) => {
    //     setFilterHospitalId(hospitalId);
    // };

    // // Handle session card selection
    // const handleSessionSelect = (session: SessionCard) => {
    //     dispatch(
    //         setSelectedSessionCard({
    //             sessionId: session.id,
    //             hospitalId: session.hospitalId,
    //             hospitalName: session.hospitalName,
    //             date: session.date,
    //             startTime: session.startTime,
    //         })
    //     );
    // };

    // // Render pagination
    // const renderPagination = () => {
    //     if (totalPages <= 1) return null;

    //     const pages: (number | string)[] = [];

    //     if (totalPages <= 7) {
    //         for (let i = 1; i <= totalPages; i++) pages.push(i);
    //     } else {
    //         if (currentPage <= 3) {
    //             pages.push(1, 2, 3, 4, "...", totalPages);
    //         } else if (currentPage >= totalPages - 2) {
    //             pages.push(
    //                 1,
    //                 "...",
    //                 totalPages - 3,
    //                 totalPages - 2,
    //                 totalPages - 1,
    //                 totalPages
    //             );
    //         } else {
    //             pages.push(
    //                 1,
    //                 "...",
    //                 currentPage - 1,
    //                 currentPage,
    //                 currentPage + 1,
    //                 "...",
    //                 totalPages
    //             );
    //         }
    //     }

        return (
            <div className="flex items-center justify-center gap-2 mt-6">
                <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="w-10 h-10 rounded-lg border-2 border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                        />
                    </svg>
                </button>

                {/* {pages.map((page, idx) =>
                    typeof page === "number" ? (
                        <button
                            key={idx}
                            onClick={() => setCurrentPage(page)}
                            className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center font-medium transition-all ${
                                currentPage === page
                                    ? "bg-blue-600 text-white border-blue-600"
                                    : "border-gray-300 hover:bg-gray-50"
                            }`}
                        >
                            {page}
                        </button>
                    ) : (
                        <span
                            key={idx}
                            className="w-10 h-10 flex items-center justify-center text-gray-400"
                        >
                            {page}
                        </span>
                    )
                )} */}

                {/* <button
                    onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="w-10 h-10 rounded-lg border-2 border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                        />
                    </svg>
                </button> */}
            </div>
        );
    };

    // Check if form is valid
    //const isFormValid = selectedSessionId !== null;

    return (
        <div className="space-y-4">
            {/* Appointment Type Selection */}
            <div>
                <h3 className="text-lg font-semibold mb-3">Appointment Type</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* In-Person Visit */}
                    <button
                        type="button"
                        onClick={() => setAppointmentType("in-person")}
                        className={`rounded-xl border-2 p-4 text-left transition-all duration-200 ${
                            appointmentType === "in-person"
                                ? "border-green-500 bg-green-50 shadow-md ring-2 ring-green-200"
                                : "border-gray-300 bg-white hover:border-green-300 hover:shadow-lg"
                        }`}
                    >
                        <div className="flex items-start gap-3">
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                                    appointmentType === "in-person"
                                        ? "bg-green-100"
                                        : "bg-gray-100"
                                }`}
                            >
                                <svg
                                    className={`w-6 h-6 ${
                                        appointmentType === "in-person"
                                            ? "text-green-600"
                                            : "text-gray-600"
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
                            </div>
                            <div className="flex-1">
                                <h4
                                    className={`font-semibold text-base mb-0.5 ${
                                        appointmentType === "in-person"
                                            ? "text-green-800"
                                            : "text-gray-900"
                                    }`}
                                >
                                    In-Person Visit
                                </h4>
                                <p
                                    className={`text-sm ${
                                        appointmentType === "in-person"
                                            ? "text-green-700"
                                            : "text-gray-600"
                                    }`}
                                >
                                    Visit the doctor at the hospital
                                </p>
                            </div>
                            {appointmentType === "in-person" && (
                                <svg
                                    className="w-6 h-6 text-green-600 flex-shrink-0"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                >
                                    <path d="M20 6 9 17l-5-5" />
                                </svg>
                            )}
                        </div>
                    </button>

                    {/* Video Consultation */}
                    <button
                        type="button"
                        onClick={() => setAppointmentType("video-consultation")}
                        className={`rounded-xl border-2 p-4 text-left transition-all duration-200 ${
                            appointmentType === "video-consultation"
                                ? "border-green-500 bg-green-50 shadow-md ring-2 ring-green-200"
                                : "border-gray-300 bg-white hover:border-green-300 hover:shadow-lg"
                        }`}
                    >
                        <div className="flex items-start gap-3">
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                                    appointmentType === "video-consultation"
                                        ? "bg-green-100"
                                        : "bg-gray-100"
                                }`}
                            >
                                <svg
                                    className={`w-6 h-6 ${
                                        appointmentType === "video-consultation"
                                            ? "text-green-600"
                                            : "text-gray-600"
                                    }`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                                    />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h4
                                    className={`font-semibold text-base mb-1 ${
                                        appointmentType === "video-consultation"
                                            ? "text-green-800"
                                            : "text-gray-900"
                                    }`}
                                >
                                    Video Consultation
                                </h4>
                                <p
                                    className={`text-sm ${
                                        appointmentType === "video-consultation"
                                            ? "text-green-700"
                                            : "text-gray-600"
                                    }`}
                                >
                                    Consult with the doctor online
                                </p>
                            </div>
                            {appointmentType === "video-consultation" && (
                                <svg
                                    className="w-6 h-6 text-green-600 flex-shrink-0"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                >
                                    <path d="M20 6 9 17l-5-5" />
                                </svg>
                            )}
                        </div>
                    </button>
                </div>
            </div>

            {/* Select Hospital (Optional Filter) - Only show for in-person */}
            {appointmentType === "in-person" && (
                <div>
                    <h3 className="text-lg font-semibold mb-0.5">
                        Select Hospital{" "}
                        <span className="text-sm text-gray-500"></span>
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
                    <select
                        className="w-full rounded-xl border-2 border-gray-300 px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        value={filterHospitalId}
                        onChange={(e) =>
                            handleHospitalFilterChange(e.target.value)
                        }
                    >
                        <option value="">All Locations</option>
                        {uniqueLocations.map((location) => (
                            <option key={location} value={location}>
                                {location}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {/* Available Sessions */}
            <div>
                <h3 className="text-lg font-semibold mb-2">
                    Available Sessions
                </h3>
                {isLoadingSessions ? (
                    <div className="text-gray-500">Loading sessions...</div>
                ) : totalSessions === 0 ? (
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
                            No upcoming sessions available.
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                            {filterHospitalId
                                ? "Try selecting a different hospital or view all hospitals."
                                : "Please check back later."}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="space-y-6">
                            {paginatedGroups.map((group) => (
                                <div key={group.date}>
                                    {/* Date Header */}
                                    <h4 className="text-lg font-semibold text-gray-800 mb-3 pb-2 border-b-2 border-gray-200">
                                        {group.dateFormatted}
                                    </h4>

                                    {/* Sessions Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                        {group.sessions.map((session) => {
                                            const isSelected =
                                                selectedSessionId ===
                                                session.id;

                                            return (
                                                <button
                                                    key={session.id}
                                                    type="button"
                                                    onClick={() =>
                                                        handleSessionSelect(
                                                            session
                                                        )
                                                    }
                                                    className={`rounded-xl border-2 p-3 text-left transition-all duration-200 hover:shadow-lg ${
                                                        isSelected
                                                            ? "border-green-500 bg-green-50 shadow-md ring-2 ring-green-200"
                                                            : "border-gray-300 bg-white hover:border-green-300"
                                                    }`}
                                                >
                                                    <div className="space-y-1">
                                                        {/* Hospital - Only show for in-person appointments */}
                                                        {appointmentType ===
                                                            "in-person" && (
                                                            <div className="flex items-center gap-2">
                                                                <svg
                                                                    className={`w-5 h-5 flex-shrink-0 ${
                                                                        isSelected
                                                                            ? "text-green-600"
                                                                            : "text-gray-600"
                                                                    }`}
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    viewBox="0 0 24 24"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={
                                                                            2
                                                                        }
                                                                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                                                    />
                                                                </svg>
                                                                <span
                                                                    className={`font-semibold ${
                                                                        isSelected
                                                                            ? "text-green-800"
                                                                            : "text-gray-900"
                                                                    }`}
                                                                >
                                                                    {
                                                                        session.hospitalName
                                                                    }
                                                                </span>
                                                            </div>
                                                        )}

                                                        {/* Date */}
                                                        <div className="flex items-center gap-2">
                                                            <svg
                                                                className={`w-5 h-5 flex-shrink-0 ${
                                                                    isSelected
                                                                        ? "text-green-600"
                                                                        : "text-gray-600"
                                                                }`}
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={
                                                                        2
                                                                    }
                                                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                                />
                                                            </svg>
                                                            <span
                                                                className={`text-sm ${
                                                                    isSelected
                                                                        ? "text-green-700"
                                                                        : "text-gray-700"
                                                                }`}
                                                            >
                                                                {
                                                                    session.dateFormatted
                                                                }
                                                            </span>
                                                        </div>

                                                        {/* Time */}
                                                        <div className="flex items-center gap-2">
                                                            <svg
                                                                className={`w-5 h-5 flex-shrink-0 ${
                                                                    isSelected
                                                                        ? "text-green-600"
                                                                        : "text-gray-600"
                                                                }`}
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={
                                                                        2
                                                                    }
                                                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                                                />
                                                            </svg>
                                                            <span
                                                                className={`text-sm font-medium ${
                                                                    isSelected
                                                                        ? "text-green-700"
                                                                        : "text-gray-700"
                                                                }`}
                                                            >
                                                                {
                                                                    session.startTime
                                                                }
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
                                                                    <span className="text-sm font-semibold">
                                                                        Selected
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {renderPagination()}
                    </>
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
