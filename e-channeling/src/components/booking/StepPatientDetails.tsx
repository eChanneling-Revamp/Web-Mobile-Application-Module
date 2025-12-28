"use client";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { setPatientDetails } from "@/store/booking/bookingSlice";

interface StepPatientDetailsProps {
  onPrev: () => void;
  onNext: () => void;
}

export const StepPatientDetails: React.FC<StepPatientDetailsProps> = ({
  onPrev,
  onNext,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  // Get Redux state
  const { forWhom, patientDetails } = useSelector(
    (state: RootState) => state.booking
  );
  const authState = useSelector((state: RootState) => state.auth);

  // Track which fields have been touched for validation
  const [touched, setTouched] = useState({
    fullName: false,
    phone: false,
    email: false,
    nic: false,
  });

  // Check if "For You" was selected
  const isForYou = forWhom === "myself";

  // ==================== AUTO-FILL FOR "FOR YOU" ====================
  // 🔴 HARDCODED DATA FOR TESTING - REPLACE WITH ACTUAL USER DATA 🔴
  useEffect(() => {
    if (isForYou && !patientDetails.fullName) {
      // Auto-fill with hardcoded data for testing
      dispatch(
        setPatientDetails({
          fullName: "John Doe",
          phone: "0771234567",
          email: "johndoe@example.com",
          nic: "199512345678",
          disease: "",
        })
      );
    }
  }, [isForYou, dispatch, patientDetails.fullName]);

  // ==================== UNCOMMENT WHEN BACKEND IS READY ====================
  /*
  useEffect(() => {
    if (isForYou && !patientDetails.fullName && authState.user) {
      // Auto-fill with actual logged-in user data
      dispatch(
        setPatientDetails({
          fullName: authState.user.fullName || "",
          phone: authState.user.phone || "",
          email: authState.user.email || "",
          nic: authState.user.nic || "",
          disease: "",
        })
      );
    }
  }, [isForYou, authState.user, dispatch, patientDetails.fullName]);
  */
  // ==================== END BACKEND CONNECTION CODE ====================

  // Handle input change
  const handleChange = (
    field: keyof typeof patientDetails,
    value: string
  ) => {
    dispatch(setPatientDetails({ [field]: value }));
  };

  // Handle blur (mark as touched)
  const handleBlur = (field: keyof typeof touched) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // Validation functions
  const isValidEmail = (email: string) => {
    if (!email.trim()) return true; // Email is optional
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isValidPhone = (phone: string) => {
    return /^\d{10}$/.test(phone.trim());
  };

  const isValidNIC = (nic: string) => {
    // Sri Lankan NIC: 9 digits + V/X OR 12 digits
    return /^([0-9]{9}[vVxX]|[0-9]{12})$/.test(nic.trim());
  };

  // Validation errors
  const errors = {
    fullName: patientDetails.fullName.trim() === "",
    phone: !isValidPhone(patientDetails.phone),
    email: !isValidEmail(patientDetails.email),
    nic: !isValidNIC(patientDetails.nic),
  };

  // Show errors only for touched fields
  const showErrors = {
    fullName: touched.fullName && errors.fullName,
    phone: touched.phone && errors.phone,
    email: touched.email && errors.email,
    nic: touched.nic && errors.nic,
  };

  // Form is valid if all required fields are valid
  const isFormValid =
    !errors.fullName && !errors.phone && !errors.email && !errors.nic;

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      onNext();
    }
  };

  const inputClass = "w-full rounded-xl border-2 border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200";
  const errorClass = "border-red-500 focus:ring-red-500 focus:border-red-500";

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <h2 className="text-2xl font-bold text-gray-900">Patient Details</h2>

      {/* Auto-fill Info Banner (only show for "For You") */}
      {isForYou && (
        <div className="rounded-xl bg-blue-50 border-2 border-blue-200 p-4 flex items-start gap-3">
          <div className="flex-shrink-0">
            <svg
              className="w-6 h-6 text-blue-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-blue-900 mb-1">
              Auto-filled with your information
            </h3>
            <p className="text-sm text-blue-800">
              Your personal details have been automatically populated. You can
              edit any field if needed.
            </p>
          </div>
        </div>
      )}

      {/* Full Name and NIC Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Full Name */}
        <div>
          <input
            type="text"
            placeholder="Full Name"
            value={patientDetails.fullName}
            onChange={(e) => handleChange("fullName", e.target.value)}
            onBlur={() => handleBlur("fullName")}
            className={`${inputClass} ${showErrors.fullName ? errorClass : ""}`}
          />
          {showErrors.fullName && (
            <p className="text-sm text-red-600 mt-1">Full name is required</p>
          )}
        </div>

        {/* NIC */}
        <div>
          <input
            type="text"
            placeholder="NIC (e.g., 199512345678 or 951234567V)"
            value={patientDetails.nic}
            onChange={(e) => handleChange("nic", e.target.value)}
            onBlur={() => handleBlur("nic")}
            className={`${inputClass} ${showErrors.nic ? errorClass : ""}`}
          />
          {showErrors.nic && (
            <p className="text-sm text-red-600 mt-1">
              Enter a valid Sri Lankan NIC (12 digits or 9 digits + V/X)
            </p>
          )}
        </div>
      </div>

      {/* Phone and Email Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Phone */}
        <div>
          <input
            type="tel"
            placeholder="Phone Number"
            value={patientDetails.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            onBlur={() => handleBlur("phone")}
            className={`${inputClass} ${showErrors.phone ? errorClass : ""}`}
          />
          {showErrors.phone && (
            <p className="text-sm text-red-600 mt-1">
              Enter a valid 10-digit phone number
            </p>
          )}
        </div>

        {/* Email (Optional) */}
        <div>
          <input
            type="email"
            placeholder="Email (Optional)"
            value={patientDetails.email}
            onChange={(e) => handleChange("email", e.target.value)}
            onBlur={() => handleBlur("email")}
            className={`${inputClass} ${showErrors.email ? errorClass : ""}`}
          />
          {showErrors.email && (
            <p className="text-sm text-red-600 mt-1">
              Enter a valid email address
            </p>
          )}
        </div>
      </div>

      {/* Disease (Optional) */}
      <div>
        <textarea
          placeholder="What is the disease? (Optional)"
          value={patientDetails.disease}
          onChange={(e) => handleChange("disease", e.target.value)}
          rows={3}
          className={`${inputClass} resize-none`}
        />
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-4">
        <button
          type="button"
          onClick={onPrev}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full transition ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          ← Previous
        </button>

        <button
          type="submit"
          disabled={!isFormValid}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition ease-in-out duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          Next →
        </button>
      </div>
    </form>
  );
};