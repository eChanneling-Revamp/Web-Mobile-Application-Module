
"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

const SuccessPage = () => {
    const router = useRouter();

    useEffect(() => {
        // Auto-redirect to login page after 3 seconds
        const timer = setTimeout(() => {
            router.push("/");
        }, 3000);

        return () => clearTimeout(timer);
    }, [router]);

    const handleClose = () => {
        router.push("/");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center p-4">
            {/* Background overlay for the modal effect */}
            <div className="absolute inset-0  bg-opacity-50"></div>

            <div className="relative w-full max-w-md">
                {/* Success Modal */}
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

                    <p className="text-gray-600 text-base mb-8">
                        Password Updated
                    </p>

                    <button
                        onClick={handleClose}
                        className="text-blue-500 hover:text-blue-600 text-sm font-medium transition-colors underline"
                    >
                        Close
                    </button>

                    <div className="mt-6 text-xs text-gray-400">
                        Redirecting to login in 3 seconds...
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuccessPage;