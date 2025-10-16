"use client";
import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useDispatch } from "react-redux";
import { clearErrors, login } from "@/store/auth/authSlice";
import type { AppDispatch } from "@/store";
import { useRouter } from "next/navigation";

export default function SignInPage() {
    const { isLoginLoading, isLoginError, isLoginSuccess, role } = useSelector(
        (state: RootState) => state.auth
    );
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();

    const [formData, setFormData] = useState({
        identifier: "",
        password: "",
        rememberMe: false,
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");

    const validateSignIn = () => {
        setError("");

        if (!formData.identifier.trim()) {
            setError("Please enter your Member ID / Email / NIC");
            return;
        }

        if (!formData.password) {
            setError("Please enter your password");
            return;
        }

        setError("");
        return true;
    };

    // handle login
    const handleSubmit = () => {
        dispatch(clearErrors());

        // validate input
        const isValid = validateSignIn();
        if (!isValid) return;

        dispatch(
            login({
                username: formData.identifier,
                password: formData.password,
            })
        );
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSubmit();
        }
    };

    // after log according to the user redirect relevant url
    useEffect(() => {
        if (!role) return;
        if (role === "ADMIN") {
            router.push("/");
        } else if (role === "INTERN") {
            router.push("/");
        }
    }, [role, router]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-cyan-100 to-gray-50 flex flex-col items-center justify-center p-4">
            {/* Logo */}
            <div className="mb-8">
                <img
                    src="/logo.jpg"
                    alt="E-channeling Logo"
                    className="w-20 h-20 object-contain"
                />
            </div>

            {/* Sign In Card */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md relative overflow-hidden">
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold text-center mb-6">
                        SIGN IN
                    </h1>

                    <p className="text-gray-600 text-center mb-8 text-sm">
                        * Please enter your registered mobile number in below
                        field and we'll send SMS contains OTP to sign in.
                    </p>

                    <div className="space-y-6">
                        {/* Member ID / Email / NIC Input */}
                        <div>
                            <input
                                type="text"
                                value={formData.identifier}
                                onChange={(e) => {
                                    setFormData((prev) => ({
                                        ...prev,
                                        identifier: e.target.value,
                                    }));
                                    setError("");
                                }}
                                onKeyPress={handleKeyPress}
                                placeholder="Member ID / Email / NIC"
                                className={`w-full px-4 py-3 border-2 rounded-full focus:outline-none transition-colors placeholder:text-gray-500 ${
                                    error && !formData.identifier
                                        ? "border-red-400 focus:border-red-400"
                                        : "border-gray-300 focus:border-indigo-400"
                                }`}
                            />
                        </div>

                        {/* Password Input */}
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={formData.password}
                                onChange={(e) => {
                                    setFormData((prev) => ({
                                        ...prev,
                                        password: e.target.value,
                                    }));
                                    setError("");
                                }}
                                onKeyPress={handleKeyPress}
                                placeholder="Password"
                                className={`w-full px-4 py-3 border-2 rounded-full focus:outline-none transition-colors placeholder:text-gray-500 pr-12 ${
                                    error && !formData.password
                                        ? "border-red-400 focus:border-red-400"
                                        : "border-gray-300 focus:border-indigo-400"
                                }`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                {showPassword ? (
                                    <EyeOff size={20} />
                                ) : (
                                    <Eye size={20} />
                                )}
                            </button>
                        </div>

                        {/* Error Message */}
                        {(isLoginError || error) && (
                            <p className="text-red-500 text-sm text-center font-medium">
                                {error || isLoginError}
                            </p>
                        )}

                        {/* Remember Me Checkbox */}
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="rememberMe"
                                checked={formData.rememberMe}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        rememberMe: e.target.checked,
                                    }))
                                }
                                className="w-4 h-4 text-indigo-500 border-gray-300 rounded focus:ring-indigo-400 cursor-pointer"
                            />
                            <label
                                htmlFor="rememberMe"
                                className="ml-2 text-gray-700 text-sm cursor-pointer select-none"
                            >
                                Remember Information
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button
                            onClick={handleSubmit}
                            disabled={isLoginLoading}
                            className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-semibold py-3 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg active:scale-95"
                        >
                            {isLoginLoading ? "Signing In..." : "Sign In"}
                        </button>

                        {/* Forget Password Link */}
                        <div className="text-center">
                            <Link
                                href={"/forgot-password"}
                                className="text-blue-600 hover:text-blue-700 text-sm underline transition-colors"
                            >
                                Forget Password?
                            </Link>
                        </div>

                        {/* Sign Up Link */}
                        <div className="text-center pt-4">
                            <p className="text-gray-700">
                                I'm a new user,{" "}
                                <button
                                    onClick={() =>
                                        console.log("Sign up clicked")
                                    }
                                    className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                                >
                                    Sign Up
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer spacing */}
            <div className="h-8"></div>
        </div>
    );
}