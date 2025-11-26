"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface StepPackageSelectionProps {
    setStep?: (step: number) => void;
}

export const SuccessStep = ({ setStep }: StepPackageSelectionProps) => {
    const router = useRouter();
    const [countdown, setCountdown] = useState(6);
    const [shouldRedirect, setShouldRedirect] = useState(false);

    // Countdown timer
    useEffect(() => {
        const countdownInterval = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    setShouldRedirect(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(countdownInterval);
    }, []);

    // Handle redirect separately
    useEffect(() => {
        if (shouldRedirect) {
            router.push("/");
        }
    }, [shouldRedirect, router]);

    const handleGoHome = () => {
        router.push("/");
    };

    const handleGoLogin = () => {
        router.push("/login");
    };

    return (
        <div className="flex items-center justify-center p-1">
            <div className="bg-white rounded-3xl p-6 text-center max-w-md w-full">
                <div className="mx-auto w-10 h-10 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mb-6 animate-bounce shadow-lg">
                    <svg
                        className="w-7 h-7 text-white"
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

                {/* Success Message */}
                <h2 className="text-2xl  font-bold text-gray-900 mb-3">
                    Password Reset Successful!
                </h2>

                <p className="text-gray-600 text-base mb-2">
                    Your password has been updated successfully.
                </p>

                <p className="text-sm text-gray-500 mb-8">
                    You can now login with your new password.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-3 px-5 w-full">
                    <button
                        onClick={handleGoHome}
                        className="w-full sm:w-1/2 px-5 py-2 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-semibold rounded-full transition-transform duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-md"
                    >
                        Go to Home
                    </button>

                    <button
                        onClick={handleGoLogin}
                        className="w-full sm:w-1/2 px-5 py-2 border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white font-semibold rounded-full transition-transform duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    >
                        Go to Login
                    </button>
                </div>

                {/* Auto-redirect Notice */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                    <p className="text-xs text-gray-400">
                        Redirecting to home in{" "}
                        <span className="font-bold text-blue-500">
                            {countdown}
                        </span>{" "}
                        seconds...
                    </p>
                </div>
            </div>
        </div>
    );
};
