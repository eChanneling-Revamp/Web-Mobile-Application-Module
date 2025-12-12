"use client";
import { ResetPasswordStep } from "@/components/forgot-password/ResetPasswordStep";
import { SendIdentifierStep } from "@/components/forgot-password/SendIdentifierStep";
import { SuccessStep } from "@/components/forgot-password/SuccessStep";
import { VerifyStep } from "@/components/forgot-password/VerifyOTPStep";

import Image from "next/image";
import { useCallback, useState } from "react";

const ForgotPasswordPage = () => {
    const [step, setStepState] = useState(1);

    const setStep = useCallback((newStep: number) => {
        setStepState(newStep);
    }, []);

    const renderStep = () => {
        switch (step) {
            case 1:
                return <SendIdentifierStep setStep={setStep} />;
            case 2:
                return <VerifyStep setStep={setStep} />;
            case 3:
            return <ResetPasswordStep setStep={setStep} />;
            case 4:
            return <SuccessStep setStep={setStep} />;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-300 to-gray-50 flex flex-col items-center justify-center py-10 px-7">
            <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-10 w-full max-w-md md:max-w-5xl relative overflow-hidden flex flex-col md:flex-row items-center justify-center gap-6 md:gap-16 transform -translate-y-6 md:translate-y-0 ">
                <div className="flex-shrink-0 ">
                    <Image
                        src="/Forgot-password.png"
                        alt="E-channeling Decorative"
                        width={350}
                        height={350}
                        className="object-contain w-40 sm:w-55 md:w-65 lg:w-90 transition-all duration-300 ease-in-out"
                        placeholder="blur"
                        blurDataURL="/Forgot-password.png"
                        sizes="(max-width: 640px) 5rem, (max-width: 768px) 7rem, (max-width: 1024px) 14rem, 20rem"
                    />
                </div>
                <div className="w-full mr-0 md:mr-5">
                    <div className="">
                        <h1 className="text-2xl md:text-3xl font-bold text-center mb-4 md:mb-10">
                            Forgot Password ?
                        </h1>

                        {/* <p className="text-gray-600 text-center mb-6 md:mb-8 text-sm">
                            * Please enter your registered email address and we&apos;ll send an email or SMS contain OTP to reset password.
                        </p> */}

                        <div className="flex justify-center items-center space-x-2 mb-6">
                            {[1, 2, 3, 4].map((stepNumber) => (
                                <div
                                    key={stepNumber}
                                    className="flex items-center"
                                >
                                    <div
                                        className={`rounded-full h-8 w-8 flex items-center justify-center ${
                                            stepNumber <= step
                                                ? "bg-blue-600 text-white"
                                                : "border-2 border-gray-200 text-gray-400"
                                        }`}
                                    >
                                        {stepNumber < step ? "✓" : stepNumber}
                                    </div>
                                    {stepNumber < 4 && (
                                        <div
                                            className={`w-5 sm:w-8 h-0.5 ${stepNumber < step ? "bg-blue-600" : "bg-gray-200"}`}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-8">{renderStep()}</div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
