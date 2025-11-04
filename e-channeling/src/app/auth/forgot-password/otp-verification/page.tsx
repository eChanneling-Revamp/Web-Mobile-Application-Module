
"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const OTPVerificationPage = () => {
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [timeLeft, setTimeLeft] = useState(89); // 1:29 in seconds
    const [isLoading, setIsLoading] = useState(false);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const router = useRouter();

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
    };

    const handleInputChange = (index: number, value: string) => {
        if (value.length > 1) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const otpValue = otp.join("");
        if (otpValue.length !== 6) return;

        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            // Navigate to new password page
            router.push("/auth/forgot-password/new-password");
        }, 1000);
    };

    const handleResendOTP = () => {
        setTimeLeft(89);
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
    };

    const isOtpComplete = otp.every((digit) => digit !== "");

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-100 to-cyan-100 flex items-center justify-center p-4">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-green-500 rounded-full opacity-80"></div>
            </div>

            <div className="relative w-full max-w-md">
                {/* Main card */}
                <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">
                            OTP Verification
                        </h1>
                        <p className="text-gray-600 text-sm leading-relaxed mb-6">
                            We have shared the OTP with the registered
                            <br />
                            mobile number / email address
                        </p>

                        {/* Timer */}
                        <div className="flex items-center justify-center text-gray-500 text-sm mb-8">
                            <div className="w-4 h-4 border border-gray-400 rounded-full flex items-center justify-center mr-2">
                                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                            </div>
                            <span>OTP Expires in {formatTime(timeLeft)}</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* OTP Input Fields */}
                        <div className="flex justify-center space-x-3">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(el) => {
                                        inputRefs.current[index] = el;
                                    }}
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) =>
                                        handleInputChange(index, e.target.value)
                                    }
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    className="w-12 h-12 border border-gray-300 rounded-lg text-center text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            ))}
                        </div>

                        {/* Resend OTP */}
                        <div className="text-center">
                            <p className="text-gray-600 text-sm mb-2">
                                Didn&apos;t recieve an OTP ?
                            </p>
                            <button
                                type="button"
                                onClick={handleResendOTP}
                                disabled={timeLeft > 0}
                                className="text-blue-500 hover:text-blue-600 disabled:text-gray-400 text-sm font-medium transition-colors underline"
                            >
                                Resend OTP
                            </button>
                        </div>

                        <div className="pt-8">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="text-blue-500 hover:text-blue-600 text-sm font-medium transition-colors mb-4"
                            >
                                Close
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={!isOtpComplete || isLoading}
                            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white font-medium py-4 px-6 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            {isLoading ? "Verifying..." : "Verify OTP"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default OTPVerificationPage;