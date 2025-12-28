"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { StepTypeAndDate } from "@/components/booking/StepTypeAndDate";
import {fetchDoctorById,setSelectedDoctorId,resetBooking,} from "@/store/booking/bookingSlice";
import type { Doctor } from "@/components/booking/types";
import { StepForWhom } from "@/components/booking/StepForWhom";
import { StepPatientDetails } from "@/components/booking/StepPatientDetails";
import { StepPayment } from "@/components/booking/StepPayment";
import { StepConfirmation } from "@/components/booking/StepConfirmation";

type UIStep = 1 | 2 | 3 | 4 | 5;

const BookingPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const searchParams = useSearchParams();

  // Get doctor details from URL parameters
  const doctorId = searchParams.get("doctorId") || "";
  const doctorName = searchParams.get("doctorName") || "";
  const specialization = searchParams.get("specialization") || "";
  const fee = parseInt(searchParams.get("fee") || "0", 10);

  // Local state for UI step management
  const [step, setStepState] = useState<UIStep>(1);

  // Redux state
  const { isLoadingDoctor, bookingError } = useSelector(
    (state: RootState) => state.booking
  );
  
  // Get user ID from auth state
  const { userId } = useSelector((state: RootState) => state.auth);

  // Doctor data from backend
  const [doctor, setDoctor] = useState<Doctor | null>(null);

  // Fetch doctor details from backend on mount
  useEffect(() => {
    if (doctorId) {
      dispatch(setSelectedDoctorId(doctorId));
      dispatch(fetchDoctorById(doctorId))
        .unwrap()
        .then((data) => setDoctor(data))
        .catch((error) => console.error("Error fetching doctor:", error));
    }
  }, [doctorId, dispatch]);

  // Scroll to top on step change
  const setStep = useCallback((newStep: UIStep) => {
    setStepState(newStep);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Reset booking on unmount
  useEffect(() => {
    return () => {
      dispatch(resetBooking());
    };
  }, [dispatch]);

  // Render step content
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <StepTypeAndDate
            doctorId={doctorId}
            onNext={() => setStep(2)}
          />
        );
      case 2:
        return (
          <StepForWhom
            onPrev={() => setStep(1)}
            onNext={() => setStep(3)}
          />
        );
      case 3:
        return (
          <StepPatientDetails
            onPrev={() => setStep(2)}
            onNext={() => setStep(4)}
          />
        );
      case 4:
        return (
          <StepPayment
            doctorFee={doctor?.fee || 0}
            userId={userId || ""}
            onPrev={() => setStep(3)}
            onNext={() => setStep(5)}
          />
        );
      case 5:
        return (
          <StepConfirmation
            doctorName={doctor?.name || ""}
            doctorFee={doctor?.fee || 0}
            onBackHome={() => {
              dispatch(resetBooking());
              window.location.href = "/";
            }}
            onViewAppointments={() => {
              window.location.href = "/profile";
            }}
          />
        );
      default:
        return null;
    }
  };

  // Loading state
  if (isLoadingDoctor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading doctor information...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (bookingError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">{bookingError}</p>
          <button
            onClick={() => window.history.back()}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-full"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // No doctor ID provided
  if (!doctorId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No doctor selected</p>
          <button
            onClick={() => window.history.back()}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-full"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-150 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-3">
          <h1 className="text-3xl font-bold text-center mb-6">
            Book Appointment
          </h1>
          <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
            {/* Left: Doctor Info Card */}
            <aside className="rounded-2xl bg-gray-50 shadow-md p-5 h-fit">
              {doctor ? (
                <div className="flex items-start gap-3 mb-0.5">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                    {doctor.image ? (
                      <img
                        src={doctor.image}
                        alt={doctor.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-300"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-lg">{doctor.name}</p>
                    <p className="text-sm text-gray-600">
                      {doctor.specialization}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="animate-pulse">
                  <div className="flex items-start gap-3">
                    <div className="w-16 h-16 rounded-full bg-gray-300"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-5 bg-gray-300 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              )}
            </aside>

            {/* Step Content */}
            <div>
              {/* Step Indicator */}
              <div className="mb-1">
                <div className="flex items-start justify-center gap-6 w-full px-4 mb-8">
                  {[1, 2, 3, 4, 5].map((stepNumber) => {
                    const stepLabels = ["Session", "For Whom", "Info", "Payment", "Confirm"];
                    return (
                      <div key={stepNumber} className="flex flex-col items-center relative" style={{ flex: "0 1 auto" }}>
                        {/* Connecting Line (before this step) */}
                        {stepNumber > 1 && (
                          <div
                            className={`absolute -left-3 top-4 w-6 h-0.5 ${
                              stepNumber - 1 < step ? "bg-blue-600" : "bg-gray-200"
                            }`}
                          />
                        )}
                        
                        {/* Step Circle */}
                        <div
                          className={`rounded-full h-8 w-8 flex items-center justify-center text-sm font-medium transition-all duration-200 mb-2 relative z-10 ${
                            stepNumber <= step
                              ? "bg-blue-600 text-white shadow-md"
                              : "border-2 border-gray-200 text-gray-400"
                          }`}
                        >
                          {stepNumber < step ? "✓" : stepNumber}
                        </div>
                        
                        {/* Step Label */}
                        <span className="text-xs text-gray-600 text-center w-14">
                          {stepLabels[stepNumber - 1]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step Content */}
              <div className="bg-white rounded-xl shadow-sm p-3">
                {renderStep()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;