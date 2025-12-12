"use client";

import { RootState } from "@/store";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useSelector } from "react-redux";

interface StepPackageSelectionProps {
    setStep?: (step: number) => void;
}

export const SendIdentifierStep = ({ setStep }: StepPackageSelectionProps) => {
    const {isVerifyOtpLoading} = useSelector((state: RootState) => state.auth)

    //const handleClose = () => {};

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (setStep) {
            setStep(2);
        }
    };

    return (
        <div className="flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                <div className="text-center mb-6">
                    <h2 className="text-[16px] text-gray-600 mt-2 mb-5">
                        Enter Member ID, Email, or NIC
                    </h2>
                    <p className="text-gray-600 text-sm leading-relaxed">
                        * Please enter your registered email address and
                        we&apos;ll send an email or SMS contain OTP to reset
                        password.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-10">
                    <div>
                        <input
                            type="text"
                            //value={email}
                            //onChange={(e) => setEmail(e.target.value)}
                            placeholder="Member ID / Email / NIC"
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                            required
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <Link
                            href="/login"
                            className="px-6 w-32 py-2 text-center border-2 border-gray-300 text-gray-700 font-medium rounded-full transition-all  hover:bg-gray-800 hover:text-white hover:border-gray-400 hover:shadow-md active:scale-95 cursor-pointer"
                        >
                            Back
                        </Link>

                        <button
                            type="submit"
                            //disabled={!email.trim() || isLoading}
                            className="px-7 py-2 w-36 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-semibold rounded-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition ease-in-out duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300"
                        >
                            {isVerifyOtpLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Sending...
                                </span>
                            ) : (
                                "Next"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
