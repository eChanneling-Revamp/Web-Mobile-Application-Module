"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

interface StepPackageSelectionProps {
    setStep?: (step: number) => void;
}

export const ResetPasswordStep = ({ setStep }: StepPackageSelectionProps) => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newPassword || !confirmPassword) return;

        if (newPassword !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        if (newPassword.length < 8) {
            alert("Password must be at least 8 characters long!");
            return;
        }

        setIsLoading(true);

        // Simulate API call - replace with actual API call
        setTimeout(() => {
            setIsLoading(false);
            // Navigate to success step
            if (setStep) {
                setStep(4);
            }
        }, 1000);
    };

    const handleBack = () => {
        if (setStep) {
            setStep(2);
        }
    };

    const isFormValid =
        newPassword &&
        confirmPassword &&
        newPassword === confirmPassword &&
        newPassword.length >= 8 &&
        /[0-9]/.test(newPassword) &&
        /[!@#$%^&*(),.?":{}|<>]/.test(newPassword) &&
        /[a-zA-Z]/.test(newPassword);

    return (
        <div className="flex items-center justify-center">
            <div className="bg-white rounded-3xl p-2">
                <div className="text-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">
                        Reset Password
                    </h2>
                    <p className="text-gray-600 text-sm leading-relaxed">
                        * Please enter new password with 8 characters including
                        <br />
                        numbers, special characters and letters.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* New Password Field */}
                    <div className="relative">
                        <input
                            type={showNewPassword ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="New Password"
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400 pr-12"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            {showNewPassword ? (
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                                    />
                                </svg>
                            ) : (
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                    />
                                </svg>
                            )}
                        </button>
                    </div>

                    {/* Confirm Password Field */}
                    <div className="relative">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm Password"
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400 pr-12"
                            required
                        />
                        <button
                            type="button"
                            onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            {showConfirmPassword ? (
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                                    />
                                </svg>
                            ) : (
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                    />
                                </svg>
                            )}
                        </button>
                    </div>

                    {/* Password Validation Feedback */}
                    {newPassword && (
                        <div className="text-sm space-y-1 bg-gray-50 p-3 rounded-lg">
                            <p
                                className={`flex items-center gap-2 ${
                                    newPassword.length >= 8
                                        ? "text-green-600"
                                        : "text-red-600"
                                }`}
                            >
                                <span className="font-bold">
                                    {newPassword.length >= 8 ? "✓" : "✗"}
                                </span>
                                At least 8 characters
                            </p>
                            <p
                                className={`flex items-center gap-2 ${
                                    /[0-9]/.test(newPassword)
                                        ? "text-green-600"
                                        : "text-red-600"
                                }`}
                            >
                                <span className="font-bold">
                                    {/[0-9]/.test(newPassword) ? "✓" : "✗"}
                                </span>
                                Contains numbers
                            </p>
                            <p
                                className={`flex items-center gap-2 ${
                                    /[!@#$%^&*(),.?":{}|<>]/.test(newPassword)
                                        ? "text-green-600"
                                        : "text-red-600"
                                }`}
                            >
                                <span className="font-bold">
                                    {/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)
                                        ? "✓"
                                        : "✗"}
                                </span>
                                Contains special characters
                            </p>
                            <p
                                className={`flex items-center gap-2 ${
                                    /[a-zA-Z]/.test(newPassword)
                                        ? "text-green-600"
                                        : "text-red-600"
                                }`}
                            >
                                <span className="font-bold">
                                    {/[a-zA-Z]/.test(newPassword) ? "✓" : "✗"}
                                </span>
                                Contains letters
                            </p>
                        </div>
                    )}

                    {/* Password Mismatch Warning */}
                    {confirmPassword && newPassword !== confirmPassword && (
                        <p className="text-red-600 text-sm font-medium flex items-center gap-2">
                            <span>⚠</span>
                            Passwords do not match
                        </p>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-4">
                        <button
                            type="button"
                            onClick={handleBack}
                            className="px-6 w-32 py-2 text-center border-2 border-gray-300 text-gray-700 font-medium rounded-full transition-all hover:bg-gray-800 hover:text-white hover:border-gray-400 hover:shadow-md active:scale-95 cursor-pointer"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={!isFormValid || isLoading}
                            className="text-[16px] px-5 py-2 w-44 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-semibold rounded-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition ease-in-out duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Updating...
                                </span>
                            ) : (
                                "Update Password"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
