"use client";
import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useDispatch } from "react-redux";
import { clearErrors, login } from "@/store/auth/authSlice";
import type { AppDispatch } from "@/store";
import { useRouter } from "next/navigation";

const SignInPage = () => {
    const { isLoginLoading, isLoginError, isLoginSuccess } = useSelector(
        (state: RootState) => state.auth
    );
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        rememberMe: false,
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");

    const validateSignIn = () => {
        setError("");

        if (!formData.email.trim()) {
            setError("Please enter your Email!");
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
    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        dispatch(clearErrors());

        // validate input
        const isValid = validateSignIn();
        if (!isValid) return;

        dispatch(
            login({
                email: formData.email,
                password: formData.password,
            })
        );
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSubmit();
        }
    };

    console.log(isLoginSuccess);
    // after log according to the user redirect relevant url
    useEffect(() => {
        if (isLoginSuccess) {
            router.push("/");
        }
    }, [isLoginSuccess, router]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-300 to-gray-50 flex flex-col items-center justify-center p-4">
            {/* Logo
            <div className="mb-8">
                <Image
                    src="/logo.jpg"
                    alt="E-channeling Logo"
                    width={80}
                    height={80}
                    className="object-contain"
                />
            </div> */}

            {/* Sign In Card */}
            <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 w-full max-w-md md:max-w-4xl relative overflow-hidden flex flex-col md:flex-row items-center justify-center gap-6 md:gap-20 transform -translate-y-6 md:translate-y-0">
                <div className="flex-shrink-0">
                    <Image
                        src="/signin-image.png"
                        alt="E-channeling Decorative"
                        width={400}
                        height={0}
                        className="object-contain w-56 md:w-96 h-auto"
                        placeholder="blur"
                        blurDataURL="/signin-image.png"
                    />
                </div>
                <div className="w-full md:w-1/2">
                    <h1 className="text-2xl md:text-3xl font-bold text-center mb-4 md:mb-6">
                        SIGN IN
                    </h1>

                    <p className="text-gray-600 text-center mb-6 md:mb-8 text-sm">
                        * Please enter your registered email in below field.
                    </p>

                    <div className="space-y-4 md:space-y-6">
                        <div>
                            <input
                                type="text"
                                value={formData.email}
                                onChange={(e) => {
                                    setFormData((prev) => ({
                                        ...prev,
                                        email: e.target.value,
                                    }));
                                    setError("");
                                    dispatch(clearErrors());
                                }}
                                onKeyDown={handleKeyDown}
                                placeholder=" Email"
                                className={`w-full px-4 py-3 border-2 rounded-full focus:outline-none transition-colors placeholder:text-gray-500 ${
                                    error && !formData.email
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
                                    dispatch(clearErrors());
                                }}
                                onKeyDown={handleKeyDown}
                                placeholder=" Password"
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
                            type="button"
                            onClick={handleSubmit}
                            disabled={isLoginLoading}
                            className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-semibold py-3 rounded-full transition ease-in-out duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg active:scale-95 cursor-pointer"
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
                        <div className="text-center pt-2 md:pt-4">
                            <p className="text-gray-700 text-sm md:text-base">
                                I&apos;m a new user,{" "}
                                <Link
                                    href={"/signup"}
                                    className="text-blue-600 hover:text-blue-700 font-semibold transition-colors cursor-pointer"
                                >
                                    Sign Up
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer spacing */}
            <div className="h-8"></div>
        </div>
    );
};

export default SignInPage;
