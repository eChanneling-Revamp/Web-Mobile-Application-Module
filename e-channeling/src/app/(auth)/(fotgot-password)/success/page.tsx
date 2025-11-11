"use client";

import React from "react";
import { useRouter } from "next/navigation";

const SuccessPage = () => {
  const router = useRouter();

  const handleClose = () => {
    router.push("/login"); // stays until manually closed
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-cyan-100 flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-24 h-24 bg-blue-50 rounded-full opacity-60"></div>
        <div className="absolute bottom-12 right-12 w-36 h-36 bg-green-50 rounded-full opacity-40"></div>
      </div>

      <div className="relative w-full max-w-md mb-12">
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 text-center">
          {/* Success Icon */}
          <div className="mx-auto w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-6">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Successful
          </h1>
          <p className="text-gray-600 text-base mb-6">
            Password Updated
          </p>

          <button
            onClick={handleClose}
            className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-medium py-2 px-6 rounded-full transition-all shadow-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
