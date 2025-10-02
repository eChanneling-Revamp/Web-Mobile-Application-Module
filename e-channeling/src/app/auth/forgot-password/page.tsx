"use client";

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
            router.push("/auth/forgot-password/otp-verification");
        }, 1000);
    };

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
                            Forgot Password
                        </h1>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            * Please enter your registered email address and
                            we'll
                            <br />
                            send an email or SMS contain OTP to reset password.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <input
                                type="text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Member ID / Email / NIC"
                                className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                                required
                            />
                        </div>

                        <div className="pt-8">
                            <Link
                                href="/auth/login"
                                className="text-blue-500 hover:text-blue-600 text-sm font-medium transition-colors"
                            >
                                Back
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={!email.trim() || isLoading}
                            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white font-medium py-4 px-6 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            {isLoading ? "Sending..." : "Send OTP"}
                        </button>
                    </form>
                </div>

                
            </div>
        </div>
    );
};

export default ForgotPasswordPage;