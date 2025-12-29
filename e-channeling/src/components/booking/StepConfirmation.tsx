"use client";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { createBooking } from "@/store/booking/bookingSlice";
import jsPDF from "jspdf";

interface StepConfirmationProps {
  doctorName: string;
  doctorFee: string;
  onBackHome: () => void;
  onViewAppointments: () => void;
}

export const StepConfirmation: React.FC<StepConfirmationProps> = ({
  doctorName,
  doctorFee,
  onBackHome,
  onViewAppointments,
}) => {
  // Get confirmation data from Redux (set by createBooking thunk)
  const { 
    confirmationData,
    selectedHospitalName,
    selectedDate, 
    selectedSessionStartTime,
    isCreatingBooking, 
    isProcessingPayment,
    bookingError 
  } = useSelector((state: RootState) => state.booking);

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Download receipt as PDF
  const downloadReceipt = () => {
    if (!confirmationData) return;
    
    const doc = new jsPDF();

    // Title
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("Appointment Receipt", 105, 20, { align: "center" });

    // Horizontal line
    doc.setLineWidth(0.5);
    doc.line(20, 25, 190, 25);

    // Content
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");

    let yPos = 40;
    const lineHeight = 10;

    doc.text(`Appointment Number: ${confirmationData.data.appointmentNumber}`, 20, yPos);
    yPos += lineHeight;

    doc.text(`Appointment ID: ${confirmationData.data.appointmentId}`, 20, yPos);
    yPos += lineHeight;

    doc.text(`Hospital: ${selectedHospitalName || 'N/A'}`, 20, yPos);
    yPos += lineHeight;

    doc.text(`Queue Position: #${confirmationData.data.queuePosition}`, 20, yPos);
    yPos += lineHeight;

    doc.text(`Patient Name: ${confirmationData.data.patientName}`, 20, yPos);
    yPos += lineHeight;

    doc.text(`Patient NIC: ${confirmationData.data.patientNIC}`, 20, yPos);
    yPos += lineHeight;

    doc.text(`Doctor Name: ${doctorName}`, 20, yPos);
    yPos += lineHeight;

    doc.text(`Date: ${formatDate(selectedDate!)}`, 20, yPos);
    yPos += lineHeight;

    doc.text(`Time: ${selectedSessionStartTime}`, 20, yPos);
    yPos += lineHeight + 10;

    // Amount details
    doc.setFont("helvetica", "bold");
    doc.text("Payment Summary:", 20, yPos);
    yPos += lineHeight;

    doc.setFont("helvetica", "normal");
    doc.text(`Consultation Fee: Rs. ${confirmationData.data.consultationFee.toFixed(2)}`, 20, yPos);
    yPos += lineHeight;

    doc.text(`Platform Fee: Rs. 200.00`, 20, yPos);
    yPos += lineHeight;

    doc.setFont("helvetica", "bold");
    doc.text(
      `Total Amount Paid: Rs. ${(confirmationData.data.consultationFee + 200).toFixed(2)}`,
      20,
      yPos
    );
    yPos += lineHeight;

    doc.text(`Payment Status: ${confirmationData.data.paymentStatus}`, 20, yPos);
    yPos += lineHeight + 10;

    // Footer
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text(
      "Thank you for booking with eChannelling by SLT Mobitel!",
      105,
      yPos,
      { align: "center" }
    );

    // Save PDF
    doc.save(`Appointment_${confirmationData.data.appointmentNumber}.pdf`);
  };

  // Loading state
  if (isCreatingBooking || isProcessingPayment) {
    return (
      <div className="w-full flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            {isCreatingBooking ? "Creating your appointment..." : "Processing payment..."}
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (bookingError) {
    return (
      <div className="w-full flex items-center justify-center py-8">
        <div className="text-center">
          <p className="text-red-600 mb-4">{bookingError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // No confirmation data
  if (!confirmationData) {
    return (
      <div className="w-full flex items-center justify-center py-8">
        <div className="text-center">
          <p className="text-gray-600">Unable to load appointment details</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-full"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex items-center justify-center py-0.01">
      <div className="w-full max-w-2xl">
        {/* Success Message with Icon */}
        <div className="text-center mb-4">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg
                className="w-5 h-5 text-green-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Appointment Confirmed!
            </h2>
          </div>
          <p className="text-1lg text-gray-600">
            Your appointment has been successfully booked.
          </p>
        </div>

        {/* Appointment Details Card */}
        <div className="bg-white rounded-3xl border-2 border-gray-200 p-4 mb-4">
          <div className="space-y-0.5">
            {/* Appointment Number */}
            <div>
              <span className="font-bold text-gray-900">Appointment Number:</span>
              <span className="text-gray-700 ml-2">
                {confirmationData.data.appointmentNumber}
              </span>
            </div>

            {/* Hospital */}
            <div>
              <span className="font-bold text-gray-900">Hospital:</span>
              <span className="text-gray-700 ml-2">
                {selectedHospitalName || "N/A"}
              </span>
            </div>

            {/* Queue Position */}
            <div>
              <span className="font-bold text-gray-900">Queue Position:</span>
              <span className="text-gray-700 ml-2">
                #{confirmationData.data.queuePosition}
              </span>
            </div>

            {/* Patient Name */}
            <div>
              <span className="font-bold text-gray-900">Patient Name:</span>
              <span className="text-gray-700 ml-2">
                {confirmationData.data.patientName}
              </span>
            </div>

            {/* Patient NIC */}
            <div>
              <span className="font-bold text-gray-900">Patient NIC:</span>
              <span className="text-gray-700 ml-2">
                {confirmationData.data.patientNIC}
              </span>
            </div>

            {/* Doctor Name */}
            <div>
              <span className="font-bold text-gray-900">Doctor Name:</span>
              <span className="text-gray-700 ml-2">
                {doctorName}
              </span>
            </div>

            {/* Date */}
            <div>
              <span className="font-bold text-gray-900">Date:</span>
              <span className="text-gray-700 ml-2">
                {formatDate(selectedDate!)}
              </span>
            </div>

            {/* Time */}
            <div>
              <span className="font-bold text-gray-900">Time:</span>
              <span className="text-gray-700 ml-2">
                {selectedSessionStartTime}
              </span>
            </div>

            {/* Payment Status */}
            <div>
              <span className="font-bold text-gray-900">Payment Status:</span>
              <span className="text-gray-700 ml-2">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  confirmationData.data.paymentStatus === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                  confirmationData.data.paymentStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {confirmationData.data.paymentStatus}
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col items-center justify-center gap-3">
          {/* Top Row - Two Buttons */}
          <div className="flex gap-3 justify-center">
            {/* Primary Button */}
            <button
              onClick={onViewAppointments}
              className="px-8 py-2.5 border-2 border-gray-300 text-gray-700 font-medium rounded-full hover:bg-gray-100 transition-all duration-200"
            >
              Appointments History
            </button>

            {/* Secondary Button */}
            <button
              onClick={onBackHome}
              className="px-8 py-2.5 border-2 border-gray-300 text-gray-700 font-medium rounded-full hover:bg-gray-100 transition-all duration-200"
            >
              Back to Home
            </button>
          </div>

          {/* Bottom Row - Download Receipt Button */}
          <button
            onClick={downloadReceipt}
            className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full transition ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            Download Receipt
          </button>
        </div>
      </div>
    </div>
  );
};