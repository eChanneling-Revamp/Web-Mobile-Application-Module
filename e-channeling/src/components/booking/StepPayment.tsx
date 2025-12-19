"use client";
import React, { useState } from "react";

interface StepPaymentProps {
  doctorFee: number;
  onPrev: () => void;
  onNext: () => void;
}

export const StepPayment: React.FC<StepPaymentProps> = ({
  doctorFee,
  onPrev,
  onNext,
}) => {
  // Payment form state
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolderName, setcardHolderName] = useState("");
  const [validDate, setValidDate] = useState("");
  const [securityCode, setSecurityCode] = useState("");

  // Track touched fields for validation
  const [touched, setTouched] = useState({
    cardNumber: false,
    cardHolderName: false,
    validDate: false,
    securityCode: false,
  });

  // Fixed platform fee
  const platformFee = 200.0;

  // Calculate total
  const totalAmount = doctorFee + platformFee;

  // Validation functions
  const isValidCardNumber = (num: string) => {
    const digits = num.replace(/\s/g, "");
    return /^\d{13,19}$/.test(digits);
  };

  const isValidDate = (date: string) => {
    return /^(0[1-9]|1[0-2])\/\d{2}$/.test(date.trim());
  };

  const isValidSecurityCode = (code: string) => {
    return /^\d{3,4}$/.test(code.trim());
  };

  // Validation errors
  const errors = {
    cardNumber: !isValidCardNumber(cardNumber),
    cardHolderName: cardHolderName.trim() === "",
    validDate: !isValidDate(validDate),
    securityCode: !isValidSecurityCode(securityCode),
  };

  // Show errors only for touched fields
  const showErrors = {
    cardNumber: touched.cardNumber && errors.cardNumber,
    cardHolderName: touched.cardHolderName && errors.cardHolderName,
    validDate: touched.validDate && errors.validDate,
    securityCode: touched.securityCode && errors.securityCode,
  };

  // Form is valid
  const isFormValid =
    !errors.cardNumber &&
    !errors.cardHolderName &&
    !errors.validDate &&
    !errors.securityCode;

  // Handle blur
  const handleBlur = (field: keyof typeof touched) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // Handle card number formatting (add spaces)
  const handleCardNumberChange = (value: string) => {
    const digits = value.replace(/\D/g, "");
    const formatted = digits.replace(/(\d{4})/g, "$1 ").trim();
    setCardNumber(formatted);
  };

  // Handle valid date formatting
  const handleValidDateChange = (value: string) => {
    let cleaned = value.replace(/\D/g, "");
    if (cleaned.length >= 2) {
      cleaned = cleaned.slice(0, 2) + "/" + cleaned.slice(2, 4);
    }
    setValidDate(cleaned);
  };

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      onNext();
    }
  };

  const inputClass =
    "w-full rounded-xl border-2 border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200";
  const errorClass = "border-red-500 focus:ring-red-500 focus:border-red-500";

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Payment Details */}
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-gray-900">Payment Details</h2>

          {/* Card Number */}
          <div>
            <input
              type="text"
              placeholder="Credit Card Number"
              value={cardNumber}
              onChange={(e) => handleCardNumberChange(e.target.value)}
              onBlur={() => handleBlur("cardNumber")}
              maxLength={19}
              className={`${inputClass} ${showErrors.cardNumber ? errorClass : ""}`}
            />
            {showErrors.cardNumber && (
              <p className="text-sm text-red-600 mt-1">
                Enter a valid card number (13-19 digits)
              </p>
            )}
          </div>

          {/* Cardholder Name */}
          <div>
            <input
              type="text"
              placeholder="Card Holder Name"
              value={cardHolderName}
              onChange={(e) => setcardHolderName(e.target.value)}
              onBlur={() => handleBlur("cardHolderName")}
              className={`${inputClass} ${showErrors.cardHolderName ? errorClass : ""}`}
            />
            {showErrors.cardHolderName && (
              <p className="text-sm text-red-600 mt-1">
                Card holder name is required
              </p>
            )}
          </div>

          {/* Valid Date and Security Code */}
          <div className="grid grid-cols-2 gap-4">
            {/* Valid Date */}
            <div>
              <input
                type="text"
                placeholder="Valid Date (MM/YY)"
                value={validDate}
                onChange={(e) => handleValidDateChange(e.target.value)}
                onBlur={() => handleBlur("validDate")}
                maxLength={5}
                className={`${inputClass} ${showErrors.validDate ? errorClass : ""}`}
              />
              {showErrors.validDate && (
                <p className="text-sm text-red-600 mt-1">Format: MM/YY</p>
              )}
            </div>

            {/* Security Code */}
            <div>
              <input
                type="text"
                placeholder="Security Code (CVV)"
                value={securityCode}
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, "");
                  setSecurityCode(digits);
                }}
                onBlur={() => handleBlur("securityCode")}
                maxLength={4}
                className={`${inputClass} ${showErrors.securityCode ? errorClass : ""}`}
              />
              {showErrors.securityCode && (
                <p className="text-sm text-red-600 mt-1">3-4 digits</p>
              )}
            </div>
          </div>
        </div>

        {/* Total Amount */}
        <div className="space-y-6">
          {/* Amount Card */}
          <div className="rounded-2xl bg-white border-2 border-gray-200 p-6 space-y-2">
            <h2 className="text-lg font-bold text-gray-900">Total Amount</h2>

            {/* Consultation Fee */}
            <div className="flex items-center justify-between text-base">
              <span className="text-gray-700">Consultation Fee</span>
              <span className="font-medium text-gray-900">
                Rs. {doctorFee.toFixed(2)}
              </span>
            </div>

            {/* Platform Fee */}
            <div className="flex items-center justify-between text-base">
              <span className="text-gray-700">Platform Fee</span>
              <span className="font-medium text-gray-900">
                Rs. {platformFee.toFixed(2)}
              </span>
            </div>

            {/* Divider */}
            <div className="border-t-2 border-gray-200 my-4"></div>

            {/* Total */}
            <div className="flex items-center justify-between text-base">
              <span className="font-bold text-gray-900">Total Amount</span>
              <span className="font-bold text-gray-900">
                Rs. {totalAmount.toFixed(2)}
              </span>
            </div>

            {/* Terms Notice */}
            <div className="mt-4 rounded-lg bg-blue-50 p-3 text-xs text-gray-700">
              By proceeding with the payment, you agree to our Terms of Service
              and Privacy Policy.
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-8">
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
          className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition ease-in-out duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-300"
        >
          Confirm and Pay →
        </button>
      </div>
    </form>
  );
};