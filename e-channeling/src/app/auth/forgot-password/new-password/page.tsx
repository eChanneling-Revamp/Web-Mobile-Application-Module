
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const NewPasswordPage = () => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const router = useRouter();

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

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            // Navigate to success page
            router.push("/auth/forgot-password/success");
        }, 1000);
    };

    const handleCancel = () => {
        router.push("/auth/login");
    };

    const isFormValid =
        newPassword &&
        confirmPassword &&
        newPassword === confirmPassword &&
        newPassword.length >= 8;

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
                            New Password
                        </h1>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            * Please enter new password with 8 characters
                            <br />
                            including numbers, special characters and letters.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="relative">
                            <input
                                type={showNewPassword ? "text" : "password"}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="New Password"
                                className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400 pr-12"
                                required
                            />
                            <button
                                type="button"
                                onClick={() =>
                                    setShowNewPassword(!showNewPassword)
                                }
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
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

                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                                placeholder="Confirm Password"
                                className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400 pr-12"
                                required
                            />
                            <button
                                type="button"
                                onClick={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                }
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
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

                        {/* Password validation feedback */}
                        {newPassword && (
                            <div className="text-sm">
                                <p
                                    className={`${
                                        newPassword.length >= 8
                                            ? "text-green-600"
                                            : "text-red-600"
                                    }`}
                                >
                                    {newPassword.length >= 8 ? "✓" : "✗"} At
                                    least 8 characters
                                </p>
                                <p
                                    className={`${
                                        /[0-9]/.test(newPassword)
                                            ? "text-green-600"
                                            : "text-red-600"
                                    }`}
                                >
                                    {/[0-9]/.test(newPassword) ? "✓" : "✗"}{" "}
                                    Contains numbers
                                </p>
                                <p
                                    className={`${
                                        /[!@#$%^&*(),.?":{}|<>]/.test(
                                            newPassword
                                        )
                                            ? "text-green-600"
                                            : "text-red-600"
                                    }`}
                                >
                                    {/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)
                                        ? "✓"
                                        : "✗"}{" "}
                                    Contains special characters
                                </p>
                                <p
                                    className={`${
                                        /[a-zA-Z]/.test(newPassword)
                                            ? "text-green-600"
                                            : "text-red-600"
                                    }`}
                                >
                                    {/[a-zA-Z]/.test(newPassword) ? "✓" : "✗"}{" "}
                                    Contains letters
                                </p>
                            </div>
                        )}

                        {confirmPassword && newPassword !== confirmPassword && (
                            <p className="text-red-600 text-sm">
                                Passwords do not match
                            </p>
                        )}

                        <div className="flex space-x-4 pt-8">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="text-blue-500 hover:text-blue-600 text-sm font-medium transition-colors"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={!isFormValid || isLoading}
                                className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white font-medium py-4 px-6 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                {isLoading ? "Updating..." : "Update Password"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default NewPasswordPage;