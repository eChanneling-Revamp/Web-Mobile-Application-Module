// src/app/(auth)/forgot-password/page.tsx
'use client';

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Navigate to OTP verification page
      router.push("/otp-verification");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-cyan-100 flex items-center justify-center p-4">
      {/* decorative */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-8 left-8 w-24 h-24 bg-blue-50 rounded-full opacity-60"></div>
        <div className="absolute bottom-12 right-12 w-36 h-36 bg-green-50 rounded-full opacity-40"></div>
      </div>

      <div className="relative w-full max-w-md mb-12"> {/* mb-12 to create gap to footer */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Forgot Password</h1>
            <p className="text-gray-600 text-sm leading-relaxed">
              * Please enter your registered email address and we&apos;ll send an email or SMS contain OTP to reset password.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Member ID / Email / NIC"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <Link href="/login" className="text-blue-500 hover:text-blue-600 text-sm font-medium transition-colors">
                Back
              </Link>

              <button
                type="submit"
                disabled={!email.trim() || isLoading}
                className="ml-2 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 disabled:opacity-50 text-white font-medium py-2 px-6 rounded-full transition-all shadow-md"
              >
                {isLoading ? "Sending..." : "Send OTP"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
