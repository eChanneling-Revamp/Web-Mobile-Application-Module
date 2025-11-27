"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { setPatientDetails, resetBooking } from "@/store/booking/bookingSlice";
import jsPDF from "jspdf";

type VisitType = "in_person" | "video";
type PatientSelectionType = "for_you" | "someone_else";
type UIStep = 1 | 2 | 3 | 4 | 5;

export default function Booking() {
    const dispatch = useDispatch();
    const patient = useSelector((s: RootState) => s.booking.patient);
    const authState = useSelector((s: RootState) => s.auth);

    // Use local step state for UI-level 5-step flow
    const [step, setStepLocal] = useState<UIStep>(1);

    // Read doctor card info from URL (no mock data)
    const params = useSearchParams();
    const doctorName = params.get("doctorName") || "Dr. Samantha Perera";
    const specialization = params.get("specialization") || "Cardiologist";

    // Parse hospitals array from URL
    const hospitalsParam = params.get("hospitals");
    const hospitals = useMemo(() => {
        if (!hospitalsParam) return ["National Hospital, Colombo"];
        try {
            const parsed = JSON.parse(decodeURIComponent(hospitalsParam));
            return Array.isArray(parsed) ? parsed : [parsed];
        } catch {
            return [hospitalsParam];
        }
    }, [hospitalsParam]);

    const fee = useMemo(() => {
        const f = Number(params.get("fee"));
        return Number.isFinite(f) ? f : 3500;
    }, [params]);

    // Step 1 local state: appointment type, date, hospital, session
    const [visitType, setVisitType] = useState<VisitType>("in_person");
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedHospital, setSelectedHospital] = useState<string>(
        hospitals[0] || ""
    );
    const [selectedSession, setSelectedSession] = useState<string>("");

    // Hospital sessions - dummy data for demonstration
    const hospitalSessions = useMemo(
        () => ({
            Morning: "8:00 AM - 12:00 PM",
            Afternoon: "1:00 PM - 5:00 PM",
            Evening: "6:00 PM - 9:00 PM",
        }),
        []
    );

    // Step 2 local state: patient selection
    const [patientSelection, setPatientSelection] =
        useState<PatientSelectionType | null>(null);

    // Update selectedHospital when hospitals change
    useEffect(() => {
        if (hospitals.length > 0 && !selectedHospital) {
            setSelectedHospital(hospitals[0]);
        }
    }, [hospitals, selectedHospital]);

    // Next 7 days for the date row
    const next7Days = useMemo(() => {
        const out: { day: string; dateNum: number; full: Date }[] = [];
        const fmt: Intl.DateTimeFormatOptions = { weekday: "short" };
        for (let i = 0; i < 7; i++) {
            const d = new Date();
            d.setDate(d.getDate() + i);
            out.push({
                day: new Intl.DateTimeFormat(undefined, fmt).format(d),
                dateNum: d.getDate(),
                full: d,
            });
        }
        return out;
    }, []);

    // --- Availability map (grey/inactive, green/available, red/full) ---
    const availability = useMemo(() => {
        const map: Record<string, "inactive" | "available" | "full"> = {};
        next7Days.forEach(({ full }, idx) => {
            const key = full.toISOString().split("T")[0];
            // Demo logic so you can see all 3 states. Replace with real data when you have it.
            map[key] =
                idx % 5 === 0
                    ? "full"
                    : idx % 3 === 0
                      ? "inactive"
                      : "available";
        });
        return map;
    }, [next7Days]);

    // Payment local inputs (UI only)
    const [cardNumber, setCardNumber] = useState("");
    const [cardholderName, setCardholderName] = useState("");
    const [expiry, setExpiry] = useState("");
    const [cvv, setCvv] = useState("");
    const [promo, setPromo] = useState("");

    // Discount via "Apply"
    const platformFee = 200;
    const [discount, setDiscount] = useState(0);
    const total = Math.max(0, fee + platformFee - discount);

    /* ---------- appointments state (no new pages) ---------- */
    const [lastAppt, setLastAppt] = useState<null | {
        id: string;
        patientName: string;
        doctorName: string;
        hospital: string;
        date: string;
        time: string;
    }>(null);

    const [showAppointments, setShowAppointments] = useState(false);
    const [appointments, setAppointments] = useState<
        {
            id: string;
            patientName: string;
            doctorName: string;
            hospital: string;
            date: string;
            time: string;
        }[]
    >([]);

    useEffect(() => {
        const stored = localStorage.getItem("appointments");
        if (stored) setAppointments(JSON.parse(stored));
    }, []);

    const saveAppointment = () => {
        const appt = {
            id: `APT-${Date.now()}`,
            patientName: patient.fullName || "—",
            doctorName,
            hospital: selectedHospital,
            date: (selectedDate || new Date()).toLocaleDateString(),
            time: "10:00 AM",
        };
        const stored = JSON.parse(localStorage.getItem("appointments") || "[]");
        stored.push(appt);
        localStorage.setItem("appointments", JSON.stringify(stored));
        setAppointments(stored);
        setLastAppt(appt);
    };

    const downloadReceipt = (appt: NonNullable<typeof lastAppt>) => {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text("Appointment Receipt", 20, 20);

        doc.setFontSize(12);
        doc.text(`Appointment ID: ${appt.id}`, 20, 40);
        doc.text(`Patient Name: ${appt.patientName}`, 20, 50);
        doc.text(`Doctor Name: ${appt.doctorName}`, 20, 60);
        doc.text(`Hospital: ${appt.hospital}`, 20, 70);
        doc.text(`Appointment Date: ${appt.date}`, 20, 80);
        doc.text(`Appointment Time: ${appt.time}`, 20, 90);

        doc.setFontSize(10);
        doc.text("Thank you for booking with eChannelling!", 20, 110);

        doc.save(`${appt.id}.pdf`);
    };

    /* ---------- Render ---------- */
    return (
        <section className="min-h-screen bg-gray-50 flex justify-center items-start py-10">
            <div className="w-full max-w-7xl bg-white shadow-xl rounded-3xl p-10">
                <h2 className="text-3xl font-semibold mb-6">
                    Book Appointment
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-8">
                    {/* Left: doctor summary */}
                    <LeftDoctorCard
                        doctorName={doctorName}
                        specialization={specialization}
                        hospital={selectedHospital}
                        fee={fee}
                    />

                    {/* Right: stepper + content */}
                    <div>
                        {/* Stepper strip */}
                        <div className="rounded-2xl bg-gray-50 shadow-sm p-6 mb-8">
                            <div className="flex items-center justify-between">
                                <StepPill
                                    n={1}
                                    label="Type & Date"
                                    step={step}
                                />
                                <div className="hidden md:block h-px flex-1 mx-2 bg-gray-200 relative">
                                    <div
                                        className="absolute left-0 top-0 h-2 bg-green-600 rounded-full transition-all duration-300"
                                        style={{
                                            width:
                                                step === 1
                                                    ? "0%"
                                                    : step === 2
                                                      ? "25%"
                                                      : step === 3
                                                        ? "50%"
                                                        : step === 4
                                                          ? "75%"
                                                          : "100%",
                                        }}
                                    />
                                </div>
                                <StepPill n={2} label="For Whom" step={step} />
                                <StepPill
                                    n={3}
                                    label="Patient Info"
                                    step={step}
                                />
                                <StepPill n={4} label="Payment" step={step} />
                                <StepPill n={5} label="Confirm" step={step} />
                            </div>
                        </div>

                        {/* Content */}
                        <div className="bg-white rounded-xl shadow-sm p-8">
                            {step === 1 && (
                                <StepOne
                                    visitType={visitType}
                                    setVisitType={setVisitType}
                                    next7Days={next7Days}
                                    selectedDate={selectedDate}
                                    setSelectedDate={setSelectedDate}
                                    availability={availability}
                                    hospitals={hospitals}
                                    selectedHospital={selectedHospital}
                                    setSelectedHospital={setSelectedHospital}
                                    hospitalSessions={hospitalSessions}
                                    selectedSession={selectedSession}
                                    setSelectedSession={setSelectedSession}
                                    onNext={() => setStepLocal(2)}
                                />
                            )}

                            {step === 2 && (
                                <StepTwo
                                    patientSelection={patientSelection}
                                    setPatientSelection={(selection) => {
                                        setPatientSelection(selection);
                                        // Auto-fill dummy data when "For You" is selected
                                        if (selection === "for_you") {
                                            dispatch(
                                                setPatientDetails({
                                                    fullName: "John Doe",
                                                    phone: "0771234567",
                                                    email: "johndoe@example.com",
                                                    age: "35",
                                                    gender: "Male",
                                                    reason: "",
                                                })
                                            );
                                        } else {
                                            // Clear fields for "Someone Else"
                                            dispatch(
                                                setPatientDetails({
                                                    fullName: "",
                                                    phone: "",
                                                    email: "",
                                                    age: "",
                                                    gender: "",
                                                    reason: "",
                                                })
                                            );
                                        }
                                    }}
                                    onPrev={() => setStepLocal(1)}
                                    onNext={() => setStepLocal(3)}
                                />
                            )}

                            {step === 3 && (
                                <PatientSection
                                    patient={patient}
                                    onChange={(patch) =>
                                        dispatch(setPatientDetails(patch))
                                    }
                                    patientSelection={patientSelection}
                                    authState={authState}
                                    onPrev={() => setStepLocal(2)}
                                    onNext={(e) => {
                                        e.preventDefault();
                                        setStepLocal(4);
                                    }}
                                />
                            )}

                            {step === 4 && (
                                <PaymentSection
                                    fee={fee}
                                    platformFee={platformFee}
                                    discount={discount}
                                    total={total}
                                    cardNumber={cardNumber}
                                    setCardNumber={setCardNumber}
                                    cardholderName={cardholderName}
                                    setCardholderName={setCardholderName}
                                    expiry={expiry}
                                    setExpiry={setExpiry}
                                    cvv={cvv}
                                    setCvv={setCvv}
                                    promo={promo}
                                    setPromo={setPromo}
                                    applyPromo={() => {
                                        const amt = Number(promo.trim());
                                        if (Number.isFinite(amt) && amt > 0) {
                                            setDiscount(
                                                Math.min(amt, fee + platformFee)
                                            );
                                        } else {
                                            setDiscount(0);
                                        }
                                    }}
                                    onPrev={() => setStepLocal(3)}
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        saveAppointment();
                                        setStepLocal(5);
                                    }}
                                />
                            )}

                            {step === 5 && (
                                <ConfirmationSection
                                    patientName={patient.fullName}
                                    doctorName={doctorName}
                                    hospital={selectedHospital}
                                    lastAppt={lastAppt}
                                    onBackHome={() => {
                                        dispatch(resetBooking());
                                        setStepLocal(1);
                                    }}
                                    onViewAppointments={() =>
                                        setShowAppointments(true)
                                    }
                                    onDownload={() =>
                                        lastAppt && downloadReceipt(lastAppt)
                                    }
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* My Appointments modal */}
            <AppointmentsModal
                open={showAppointments}
                onClose={() => setShowAppointments(false)}
                appointments={appointments}
            />
        </section>
    );
}

/* ====================== Stable child components (outside Booking) ====================== */

function StepPill({
    n,
    label,
    step,
}: {
    n: 1 | 2 | 3 | 4 | 5;
    label: string;
    step: number;
}) {
    const isDone = step > n;
    const isActive = step === n;

    const base =
        "h-9 w-9 grid place-items-center rounded-full text-sm shadow-md border transition-all duration-200";
    const style = isDone
        ? "bg-white border-green-500 text-green-600 shadow-[0_0_8px_rgba(34,197,94,0.4)]"
        : isActive
          ? "bg-blue-600 border-blue-600 text-white shadow-[0_0_8px_rgba(37,99,235,0.4)]"
          : "bg-white border-gray-300 text-gray-600 shadow-[0_0_4px_rgba(0,0,0,0.1)]";

    return (
        <div className="flex flex-col items-center gap-2 w-28">
            <div className={`${base} ${style}`}>
                {isDone ? (
                    <svg
                        viewBox="0 0 24 24"
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.4"
                    >
                        <path d="M20 6 9 17l-5-5" />
                    </svg>
                ) : (
                    n
                )}
            </div>
            <span className="text-xs text-gray-700">{label}</span>
        </div>
    );
}

function LeftDoctorCard({
    doctorName,
    specialization,
    hospital,
    fee,
}: {
    doctorName: string;
    specialization: string;
    hospital: string;
    fee: number;
}) {
    return (
        <aside className="rounded-2xl bg-white shadow-md p-5">
            <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-200" />
                <div>
                    <p className="font-semibold">{doctorName}</p>
                    <p className="text-sm text-gray-600">{specialization}</p>
                    <p className="text-sm text-gray-600">{hospital}</p>
                </div>
            </div>
            <div className="my-4 h-px bg-gray-200" />
            <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Consultation Fee:</span>
                <span className="font-medium">Rs. {fee.toLocaleString()}</span>
            </div>
        </aside>
    );
}

function StepOne({
    visitType,
    setVisitType,
    next7Days,
    selectedDate,
    setSelectedDate,
    availability,
    hospitals,
    selectedHospital,
    setSelectedHospital,
    hospitalSessions,
    selectedSession,
    setSelectedSession,
    onNext,
}: {
    visitType: VisitType;
    setVisitType: (v: VisitType) => void;
    next7Days: { day: string; dateNum: number; full: Date }[];
    selectedDate: Date | null;
    setSelectedDate: (d: Date) => void;
    availability: Record<string, "inactive" | "available" | "full">;
    hospitals: string[];
    selectedHospital: string;
    setSelectedHospital: (h: string) => void;
    hospitalSessions: Record<string, string>;
    selectedSession: string;
    setSelectedSession: (s: string) => void;
    onNext: () => void;
}) {
    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold">Appointment Type</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
                {/* In-Person */}
                <button
                    type="button"
                    onClick={() => setVisitType("in_person")}
                    className={[
                        "rounded-xl border p-5 text-left",
                        visitType === "in_person"
                            ? "border-green-500 bg-green-50"
                            : "hover:bg-gray-50",
                    ].join(" ")}
                >
                    <div className="flex items-center gap-3 ">
                        <div className="place-items-center">📍</div>
                        <div>
                            <p className="font-semibold text-green-700">
                                In-Person Visit
                            </p>
                            <p className="text-sm text-gray-600">
                                Visit the doctor at the hospital
                            </p>
                        </div>
                    </div>
                </button>

                {/* Video */}
                <button
                    type="button"
                    onClick={() => setVisitType("video")}
                    className={[
                        "rounded-xl border p-5 text-left",
                        visitType === "video"
                            ? "border-green-500 bg-green-50"
                            : "hover:bg-gray-50",
                    ].join(" ")}
                >
                    <div className="flex items-center gap-3">
                        <div className="place-items-center">💻</div>
                        <div>
                            <p className="font-semibold">Video Consultation</p>
                            <p className="text-sm text-gray-600">
                                Consult with the doctor online
                            </p>
                        </div>
                    </div>
                </button>
            </div>

            <div>
                <h3 className="text-lg font-semibold">Select Date</h3>
                <div className="mt-3 flex flex-wrap gap-3">
                    {next7Days.map(({ day, dateNum, full }) => {
                        const active =
                            selectedDate?.toDateString() ===
                            full.toDateString();
                        const key = full.toISOString().split("T")[0];
                        const status = availability[key] || "inactive";

                        // Disable anything that isn't available
                        const isDisabled = status !== "available";

                        let colorClass = "";
                        if (status === "available") {
                            colorClass = active
                                ? "border-green-500 bg-green-50 shadow-[0_0_10px_rgba(34,197,94,0.25)]"
                                : "border-green-400 shadow-[0_0_6px_rgba(34,197,94,0.15)]";
                        } else if (status === "full") {
                            // Red look but disabled
                            colorClass =
                                "border-red-400 bg-red-50/60 text-red-700 opacity-60"; // still red, but visually dimmed
                        } else {
                            // Inactive (grey) and disabled
                            colorClass =
                                "border-gray-300 bg-gray-100 text-gray-400 opacity-60";
                        }

                        return (
                            <button
                                key={full.toISOString()}
                                type="button"
                                onClick={() =>
                                    !isDisabled && setSelectedDate(full)
                                }
                                disabled={isDisabled}
                                aria-disabled={isDisabled}
                                title={
                                    status === "available"
                                        ? "Available"
                                        : status === "full"
                                          ? "Fully booked"
                                          : "Doctor inactive"
                                }
                                className={[
                                    "w-24 rounded-2xl border px-3 py-3 text-center transition-all duration-200 shadow-md",
                                    colorClass,
                                    isDisabled
                                        ? "cursor-not-allowed"
                                        : "hover:shadow-lg",
                                    active && status === "available"
                                        ? "ring-1 ring-green-500"
                                        : "",
                                ].join(" ")}
                            >
                                <div className="text-sm text-gray-600">
                                    {day}
                                </div>
                                <div className="text-lg font-semibold">
                                    {dateNum}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="text-xs text-gray-600 mt-2 space-y-1">
                <p>🟢 Green – Available slots</p>
                <p>🔴 Red – Fully booked day</p>
                <p>⚪ Gray – Doctor inactive</p>
            </div>

            {/* Hospital Selection */}
            <div>
                <h3 className="text-lg font-semibold">Select Hospital</h3>
                <select
                    className="mt-3 w-full rounded-xl border border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                    value={selectedHospital}
                    onChange={(e) => setSelectedHospital(e.target.value)}
                >
                    <option value="">Choose a hospital...</option>
                    {hospitals.map((hosp) => (
                        <option key={hosp} value={hosp}>
                            {hosp}
                        </option>
                    ))}
                </select>
            </div>

            {/* Session Selection */}
            <div>
                <h3 className="text-lg font-semibold">
                    Select Hospital Session
                </h3>
                <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                    {Object.entries(hospitalSessions).map(
                        ([sessionName, timeRange]) => {
                            const isSelected = selectedSession === sessionName;
                            return (
                                <button
                                    key={sessionName}
                                    type="button"
                                    onClick={() =>
                                        setSelectedSession(sessionName)
                                    }
                                    className={[
                                        "rounded-xl border p-4 text-center transition-all duration-200",
                                        isSelected
                                            ? "border-green-500 bg-green-50 shadow-[0_0_10px_rgba(34,197,94,0.25)]"
                                            : "border-gray-300 hover:border-green-300 hover:shadow-md",
                                    ].join(" ")}
                                >
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="text-2xl">🕐</div>
                                        <p
                                            className={`font-semibold ${isSelected ? "text-green-700" : ""}`}
                                        >
                                            {sessionName}
                                        </p>
                                        <p className="text-xs text-gray-600">
                                            {timeRange}
                                        </p>
                                        {isSelected && (
                                            <div className="text-green-600 mt-1">
                                                <svg
                                                    className="h-5 w-5"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2.5"
                                                >
                                                    <path d="M20 6 9 17l-5-5" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                </button>
                            );
                        }
                    )}
                </div>
            </div>

            <div className="flex justify-end pt-2">
                <button
                    type="button"
                    onClick={onNext}
                    className="rounded-lg bg-blue-600 px-5 py-2 text-white disabled:opacity-50"
                    disabled={
                        !selectedDate || !selectedHospital || !selectedSession
                    }
                >
                    Next →
                </button>
            </div>
        </div>
    );
}

/* ---------------- Step Two: Patient Selection ---------------- */

function StepTwo({
    patientSelection,
    setPatientSelection,
    onPrev,
    onNext,
}: {
    patientSelection: PatientSelectionType | null;
    setPatientSelection: (v: PatientSelectionType) => void;
    onPrev: () => void;
    onNext: () => void;
}) {
    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold">
                Who is this appointment for?
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* For You */}
                <button
                    type="button"
                    onClick={() => setPatientSelection("for_you")}
                    className={[
                        "rounded-2xl border p-8 text-center transition-all duration-200",
                        patientSelection === "for_you"
                            ? "border-green-500 bg-green-50 shadow-[0_0_15px_rgba(34,197,94,0.3)]"
                            : "border-gray-300 hover:border-green-300 hover:shadow-lg",
                    ].join(" ")}
                >
                    <div className="text-5xl mb-4">👤</div>
                    <p className="text-xl font-semibold mb-2">For You</p>
                    <p className="text-sm text-gray-600">
                        Book this appointment for yourself. We&apos;ll auto-fill
                        your details.
                    </p>
                </button>

                {/* For Someone Else */}
                <button
                    type="button"
                    onClick={() => setPatientSelection("someone_else")}
                    className={[
                        "rounded-2xl border p-8 text-center transition-all duration-200",
                        patientSelection === "someone_else"
                            ? "border-green-500 bg-green-50 shadow-[0_0_15px_rgba(34,197,94,0.3)]"
                            : "border-gray-300 hover:border-green-300 hover:shadow-lg",
                    ].join(" ")}
                >
                    <div className="text-5xl mb-4">👥</div>
                    <p className="text-xl font-semibold mb-2">
                        For Someone Else
                    </p>
                    <p className="text-sm text-gray-600">
                        Book on behalf of a family member or friend. You&apos;ll
                        enter their details manually.
                    </p>
                </button>
            </div>

            <div className="flex items-center justify-between pt-4">
                <button
                    type="button"
                    onClick={onPrev}
                    className="rounded-lg bg-blue-600 px-5 py-2 text-white"
                >
                    ← Previous
                </button>
                <button
                    type="button"
                    onClick={onNext}
                    disabled={!patientSelection}
                    className="rounded-lg bg-blue-600 px-5 py-2 text-white disabled:opacity-50"
                >
                    Next →
                </button>
            </div>
        </div>
    );
}

/* ---------------- Patient (with validation and auto-population) ---------------- */

function PatientSection({
    patient,
    onChange,
    patientSelection,
    onPrev,
    onNext,
}: {
    patient: {
        fullName: string;
        phone: string;
        email: string;
        age: string;
        gender: string;
        reason: string;
    };
    onChange: (patch: Partial<typeof patient>) => void;
    patientSelection: PatientSelectionType | null;
    authState: RootState["auth"];
    onPrev: () => void;
    onNext: (e: React.FormEvent) => void;
}) {
    const isForYou = patientSelection === "for_you";

    // Track which fields have been touched to avoid showing errors on first render
    const [touched, setTouched] = React.useState({
        fullName: false,
        phone: false,
        email: false,
        age: false,
        gender: false,
    });

    // Validation
    const isEmail = (v: string) => /\S+@\S+\.\S+/.test(v);
    const isNum = (v: string) => /^\d+$/.test(v);
    const errs = {
        fullName: patient.fullName.trim() === "",
        phone: !(
            patient.phone.trim() !== "" &&
            isNum(patient.phone.trim()) &&
            patient.phone.trim().length >= 7
        ),
        email: !(patient.email.trim() !== "" && isEmail(patient.email.trim())),
        age: !(
            patient.age.trim() !== "" &&
            isNum(patient.age.trim()) &&
            Number(patient.age) > 0
        ),
        gender: patient.gender.trim() === "",
    };

    // Only show errors for touched fields
    const showErrs = {
        fullName: touched.fullName && errs.fullName,
        phone: touched.phone && errs.phone,
        email: touched.email && errs.email,
        age: touched.age && errs.age,
        gender: touched.gender && errs.gender,
    };

    const isValid =
        !errs.fullName &&
        !errs.phone &&
        !errs.email &&
        !errs.age &&
        !errs.gender;

    const inputBase = "w-full rounded-lg border px-3 py-2";
    const invalid = "border-red-500 focus:outline-red-500";

    return (
        <form onSubmit={onNext} className="space-y-4">
            <h3 className="text-lg font-semibold">Patient Details</h3>

            {isForYou && (
                <div className="rounded-lg bg-blue-50 border border-blue-200 p-4 flex items-start gap-3">
                    <div className="text-blue-600 text-xl">ℹ️</div>
                    <div className="text-sm text-blue-800">
                        <p className="font-medium mb-1">
                            Auto-filled with your information
                        </p>
                        <p className="text-blue-700">
                            Your personal details have been automatically
                            populated. You can edit any field if needed.
                        </p>
                    </div>
                </div>
            )}

            <div>
                <input
                    className={`${inputBase} ${showErrs.fullName ? invalid : ""}`}
                    placeholder="Full Name"
                    value={patient.fullName}
                    onChange={(e) => onChange({ fullName: e.target.value })}
                    onBlur={() =>
                        setTouched((prev) => ({ ...prev, fullName: true }))
                    }
                />
                {showErrs.fullName && (
                    <p className="text-xs text-red-600 mt-1">
                        Full name is required.
                    </p>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <input
                        className={`${inputBase} ${showErrs.phone ? invalid : ""}`}
                        placeholder="Phone Number"
                        value={patient.phone}
                        onChange={(e) => onChange({ phone: e.target.value })}
                        onBlur={() =>
                            setTouched((prev) => ({ ...prev, phone: true }))
                        }
                    />
                    {showErrs.phone && (
                        <p className="text-xs text-red-600 mt-1">
                            Enter a valid phone number.
                        </p>
                    )}
                </div>
                <div>
                    <input
                        className={`${inputBase} ${showErrs.email ? invalid : ""}`}
                        placeholder="Email"
                        value={patient.email}
                        onChange={(e) => onChange({ email: e.target.value })}
                        onBlur={() =>
                            setTouched((prev) => ({ ...prev, email: true }))
                        }
                    />
                    {showErrs.email && (
                        <p className="text-xs text-red-600 mt-1">
                            Enter a valid email.
                        </p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <input
                        className={`${inputBase} ${showErrs.age ? invalid : ""}`}
                        placeholder="Age"
                        value={patient.age}
                        onChange={(e) => onChange({ age: e.target.value })}
                        onBlur={() =>
                            setTouched((prev) => ({ ...prev, age: true }))
                        }
                    />
                    {showErrs.age && (
                        <p className="text-xs text-red-600 mt-1">
                            Enter a valid age.
                        </p>
                    )}
                </div>

                <div>
                    <select
                        className={`${inputBase} ${showErrs.gender ? invalid : ""}`}
                        value={patient.gender}
                        onChange={(e) => onChange({ gender: e.target.value })}
                        onBlur={() =>
                            setTouched((prev) => ({ ...prev, gender: true }))
                        }
                    >
                        <option value="">Gender...</option>
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                    </select>
                    {showErrs.gender && (
                        <p className="text-xs text-red-600 mt-1">
                            Please select gender.
                        </p>
                    )}
                </div>
            </div>

            <textarea
                className={`${inputBase} h-28`}
                placeholder="Reason for Visit (optional)"
                value={patient.reason}
                onChange={(e) => onChange({ reason: e.target.value })}
            />

            <div className="flex items-center justify-between pt-2">
                <button
                    type="button"
                    onClick={onPrev}
                    className="rounded-lg bg-blue-600 px-5 py-2 text-white"
                >
                    ← Previous
                </button>
                <button
                    type="submit"
                    disabled={!isValid}
                    className="rounded-lg bg-blue-600 px-5 py-2 text-white disabled:opacity-50"
                >
                    Next →
                </button>
            </div>
        </form>
    );
}

/* ---------------- Payment (with validation + Apply) ---------------- */

function PaymentSection({
    fee,
    platformFee,
    discount,
    total,
    cardNumber,
    setCardNumber,
    cardholderName,
    setCardholderName,
    expiry,
    setExpiry,
    cvv,
    setCvv,
    promo,
    setPromo,
    applyPromo,
    onPrev,
    onSubmit,
}: {
    fee: number;
    platformFee: number;
    discount: number;
    total: number;
    cardNumber: string;
    setCardNumber: (v: string) => void;
    cardholderName: string;
    setCardholderName: (v: string) => void;
    expiry: string;
    setExpiry: (v: string) => void;
    cvv: string;
    setCvv: (v: string) => void;
    promo: string;
    setPromo: (v: string) => void;
    applyPromo: () => void;
    onPrev: () => void;
    onSubmit: (e: React.FormEvent) => void;
}) {
    // Track which fields have been touched
    const [touched, setTouched] = React.useState({
        cardNumber: false,
        name: false,
        expiry: false,
        cvv: false,
    });

    const onlyDigits = (s: string) => s.replace(/\D/g, "");
    const errs = {
        cardNumber: onlyDigits(cardNumber).length < 12,
        name: cardholderName.trim() === "",
        expiry: !/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry.trim()),
        cvv: !/^\d{3,4}$/.test(cvv.trim()),
    };

    // Only show errors for touched fields
    const showErrs = {
        cardNumber: touched.cardNumber && errs.cardNumber,
        name: touched.name && errs.name,
        expiry: touched.expiry && errs.expiry,
        cvv: touched.cvv && errs.cvv,
    };

    const canPay = !errs.cardNumber && !errs.name && !errs.expiry && !errs.cvv;

    const inputBase = "w-full rounded-lg border px-3 py-2";
    const invalid = "border-red-500 focus:outline-red-500";

    const promoInvalid =
        promo.trim() !== "" &&
        !(Number.isFinite(Number(promo.trim())) && Number(promo.trim()) > 0);

    return (
        <form
            onSubmit={onSubmit}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Payment Details</h3>

                <div>
                    <input
                        className={`${inputBase} ${showErrs.cardNumber ? invalid : ""}`}
                        placeholder="1234 5678 9012 3456"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        onBlur={() =>
                            setTouched((prev) => ({
                                ...prev,
                                cardNumber: true,
                            }))
                        }
                    />
                    {showErrs.cardNumber && (
                        <p className="text-xs text-red-600 mt-1">
                            Enter a valid card number.
                        </p>
                    )}
                </div>

                <div>
                    <input
                        className={`${inputBase} ${showErrs.name ? invalid : ""}`}
                        placeholder="Cardholder Name"
                        value={cardholderName}
                        onChange={(e) => setCardholderName(e.target.value)}
                        onBlur={() =>
                            setTouched((prev) => ({ ...prev, name: true }))
                        }
                    />
                    {showErrs.name && (
                        <p className="text-xs text-red-600 mt-1">
                            Name is required.
                        </p>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <input
                            className={`${inputBase} ${showErrs.expiry ? invalid : ""}`}
                            placeholder="MM/YY"
                            value={expiry}
                            onChange={(e) => setExpiry(e.target.value)}
                            onBlur={() =>
                                setTouched((prev) => ({
                                    ...prev,
                                    expiry: true,
                                }))
                            }
                        />
                        {showErrs.expiry && (
                            <p className="text-xs text-red-600 mt-1">
                                Format MM/YY.
                            </p>
                        )}
                    </div>
                    <div>
                        <input
                            className={`${inputBase} ${showErrs.cvv ? invalid : ""}`}
                            placeholder="CVV"
                            value={cvv}
                            onChange={(e) => setCvv(e.target.value)}
                            onBlur={() =>
                                setTouched((prev) => ({ ...prev, cvv: true }))
                            }
                        />
                        {showErrs.cvv && (
                            <p className="text-xs text-red-600 mt-1">
                                3–4 digits.
                            </p>
                        )}
                    </div>
                </div>

                <div>
                    <div className="flex gap-2">
                        <input
                            className={`${inputBase} flex-1 ${promoInvalid ? invalid : ""}`}
                            placeholder="Promo Code (enter an amount, e.g. 200)"
                            value={promo}
                            onChange={(e) => setPromo(e.target.value)}
                        />
                        <button
                            type="button"
                            onClick={applyPromo}
                            className="rounded-lg bg-blue-600 px-4 py-2 text-white"
                        >
                            Apply
                        </button>
                    </div>
                    {promoInvalid && (
                        <p className="text-xs text-red-600 mt-1">
                            Enter a positive number.
                        </p>
                    )}
                    {!promoInvalid && discount > 0 && (
                        <p className="text-xs text-green-600 mt-1">
                            Discount applied: Rs. {discount.toFixed(2)}
                        </p>
                    )}
                </div>
            </div>

            <div className="rounded-2xl bg-white shadow-md p-4 h-fit">
                <h4 className="font-semibold mb-4">Total Amount</h4>
                <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <dt className="text-gray-600">Consultation Fee</dt>
                        <dd>
                            Rs.{" "}
                            {fee.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                            })}
                        </dd>
                    </div>
                </dl>
                <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <dt className="text-gray-600">Platform Fee</dt>
                        <dd>Rs. {platformFee.toFixed(2)}</dd>
                    </div>
                    <div className="flex justify-between">
                        <dt className="text-gray-600">Discount</dt>
                        <dd className={discount > 0 ? "text-green-600" : ""}>
                            - Rs. {discount.toFixed(2)}
                        </dd>
                    </div>
                    <div className="h-px bg-gray-200 my-2" />
                    <div className="flex justify-between font-semibold">
                        <dt>Total Amount</dt>
                        <dd>Rs. {total.toFixed(2)}</dd>
                    </div>
                </dl>

                <div className="mt-6 rounded-lg bg-blue-50 p-3 text-xs text-gray-700">
                    By proceeding with the payment, you agree to our Terms of
                    Service and Privacy Policy.
                </div>

                <div className="mt-6 flex items-center justify-between">
                    <button
                        type="button"
                        onClick={onPrev}
                        className="rounded-lg bg-blue-600 px-5 py-2 text-white"
                    >
                        ← Previous
                    </button>
                    <button
                        type="submit"
                        disabled={!canPay}
                        className="rounded-lg bg-green-600 px-5 py-2 text-white disabled:opacity-50"
                    >
                        Make Payment →
                    </button>
                </div>
            </div>
        </form>
    );
}

/* ---------- Confirmation Section ---------- */
interface ConfirmationSectionProps {
    patientName: string;
    doctorName: string;
    hospital: string;
    lastAppt: {
        id: string;
        patientName: string;
        doctorName: string;
        hospital: string;
        date: string;
        time: string;
    } | null;
    onBackHome: () => void;
    onViewAppointments: () => void;
    onDownload: () => void;
}

function ConfirmationSection({
    patientName,
    doctorName,
    hospital,
    lastAppt,
    onBackHome,
    onViewAppointments,
    onDownload,
}: ConfirmationSectionProps) {
    return (
        <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-green-100 grid place-items-center">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-7 w-7 text-green-600"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <path d="M22 4 12 14.01l-3-3" />
                </svg>
            </div>

            <h3 className="text-xl font-semibold">Appointment Confirmed!</h3>
            <p className="text-gray-600 mt-1">
                Your appointment has been successfully booked.
            </p>

            <div className="mt-6 text-left rounded-xl border p-5 inline-block text-sm w-full max-w-xl">
                <p>
                    <b>Appointment ID:</b> {lastAppt?.id}
                </p>
                <p>
                    <b>Patient:</b> {patientName}
                </p>
                <p>
                    <b>Doctor:</b> {doctorName}
                </p>
                <p>
                    <b>Date:</b> {lastAppt?.date}
                </p>
                <p>
                    <b>Time:</b> {lastAppt?.time}
                </p>
                <p className="mt-2">
                    <b>Location:</b> {hospital}
                </p>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                <button
                    onClick={onViewAppointments}
                    className="rounded-lg bg-blue-600 px-5 py-2 text-white"
                >
                    View My Appointments
                </button>
                <button
                    onClick={onBackHome}
                    className="rounded-lg border px-5 py-2"
                >
                    Back to Home
                </button>
            </div>

            <div className="mt-4 text-sm text-gray-600">
                <button
                    onClick={onDownload}
                    className="mx-auto block rounded-lg border px-4 py-2 hover:bg-gray-100"
                >
                    Download Receipt
                </button>
            </div>
        </div>
    );
}

/* ---------- Appointments Modal ---------- */
interface AppointmentsModalProps {
    open: boolean;
    onClose: () => void;
    appointments: {
        id: string;
        patientName: string;
        doctorName: string;
        hospital: string;
        date: string;
        time: string;
    }[];
}

function AppointmentsModal({
    open,
    onClose,
    appointments,
}: AppointmentsModalProps) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 bg-black/40 grid place-items-center z-50 p-4">
            <div className="bg-white p-6 rounded-3xl shadow-2xl w-full max-w-3xl">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">My Appointments</h3>
                    <button
                        onClick={onClose}
                        className="border rounded-lg px-3 py-1"
                    >
                        Close
                    </button>
                </div>
                {appointments.length === 0 ? (
                    <p className="text-gray-600">No appointments found.</p>
                ) : (
                    <ul className="space-y-3 max-h-[60vh] overflow-auto">
                        {appointments.map((a) => (
                            <li
                                key={a.id}
                                className="border rounded-xl p-4 shadow-sm"
                            >
                                <div className="flex items-center justify-between">
                                    <p className="font-semibold">
                                        {a.doctorName}
                                    </p>
                                    <span className="text-xs text-gray-500">
                                        {a.id}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600">
                                    {a.hospital}
                                </p>
                                <p className="text-sm">
                                    {a.date} • {a.time}
                                </p>
                                <p className="text-sm text-gray-700">
                                    Patient: {a.patientName}
                                </p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
