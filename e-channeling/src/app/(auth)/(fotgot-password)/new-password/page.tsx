// src/app/(auth)/new-password/page.tsx
'use client';

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
    setTimeout(() => {
      setIsLoading(false);
      router.push("/success");
    }, 900);
  };

  const handleCancel = () => {
    router.push("/login");
  };

  const isFormValid =
    newPassword &&
    confirmPassword &&
    newPassword === confirmPassword &&
    newPassword.length >= 8;

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-cyan-100 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-12 left-8 w-20 h-20 bg-blue-50 rounded-full opacity-60"></div>
      </div>

      <div className="relative w-full max-w-md mb-12">
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">New Password</h1>
            <p className="text-gray-600 text-sm leading-relaxed">
              * Please enter new password with 8 characters including numbers, special characters and letters.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New Password"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label="toggle new password"
              >
                {showNewPassword ? "Hide" : "Show"}
              </button>
            </div>

            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label="toggle confirm password"
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>

            {newPassword && (
              <div className="text-sm space-y-1">
                <p className={newPassword.length >= 8 ? "text-green-600" : "text-red-600"}>
                  {newPassword.length >= 8 ? "✓" : "✗"} At least 8 characters
                </p>
                <p className={/[0-9]/.test(newPassword) ? "text-green-600" : "text-red-600"}>
                  {/[0-9]/.test(newPassword) ? "✓" : "✗"} Contains numbers
                </p>
                <p className={/[!@#$%^&*(),.?":{}|<>]/.test(newPassword) ? "text-green-600" : "text-red-600"}>
                  {/[!@#$%^&*(),.?":{}|<>]/.test(newPassword) ? "✓" : "✗"} Contains special characters
                </p>
                <p className={/[a-zA-Z]/.test(newPassword) ? "text-green-600" : "text-red-600"}>
                  {/[a-zA-Z]/.test(newPassword) ? "✓" : "✗"} Contains letters
                </p>
              </div>
            )}

            {confirmPassword && newPassword !== confirmPassword && (
              <p className="text-red-600 text-sm">Passwords do not match</p>
            )}

            <div className="flex items-center justify-between pt-4">
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
                className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 disabled:bg-gray-300 text-white font-medium py-2 px-6 rounded-full transition-shadow shadow-md"
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
