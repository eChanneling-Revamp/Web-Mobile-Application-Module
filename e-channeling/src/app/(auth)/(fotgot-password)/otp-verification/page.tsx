// src/app/(auth)/otp-verification/page.tsx
'use client';

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const OTPVerificationPage = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(89); // 1:29
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) return;
    if (value && !/^[0-9]$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join("");
    if (otpValue.length !== 6) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push("/new-password");
    }, 800);
  };

  const handleResendOTP = () => {
    setTimeLeft(89);
    setOtp(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();
  };

  const isOtpComplete = otp.every((d) => d !== "");

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-cyan-100 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-12 left-12 w-20 h-20 bg-blue-50 rounded-full opacity-60"></div>
      </div>

      <div className="relative w-full max-w-md mb-12">
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          <div className="text-center mb-4">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">OTP Verification</h1>
            <p className="text-gray-600 text-sm leading-relaxed">
              We have shared the OTP with the registered mobile number / email address
            </p>
          </div>

          <div className="flex items-center justify-center text-gray-500 text-sm mb-6">
            <div className="w-4 h-4 border border-gray-400 rounded-full flex items-center justify-center mr-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            </div>
            <span>OTP Expires in {formatTime(timeLeft)}</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center gap-3">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => { inputRefs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleInputChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  className="w-14 h-14 border-2 border-gray-300 rounded-lg text-center text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ))}
            </div>

            <div className="text-center">
              <p className="text-gray-600 text-sm mb-2">Didn&apos;t receive an OTP?</p>
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={timeLeft > 0}
                className="text-blue-500 hover:text-blue-600 disabled:text-gray-400 text-sm font-medium transition-colors underline"
              >
                Resend OTP
              </button>
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => router.back()}
                className="text-blue-500 hover:text-blue-600 text-sm font-medium transition-colors"
              >
                Close
              </button>

              <button
                type="submit"
                disabled={!isOtpComplete || isLoading}
                className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 disabled:bg-gray-300 text-white font-medium py-2 px-6 rounded-full transition-shadow shadow-md"
              >
                {isLoading ? "Verifying..." : "Verify OTP"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OTPVerificationPage;
