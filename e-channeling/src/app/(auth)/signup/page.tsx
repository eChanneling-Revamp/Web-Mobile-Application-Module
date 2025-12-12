"use client";
import { StepVerify } from "@/components/signup/StepVerify";
import { StepOTPVerification } from "@/components/signup/StepOTPVerification";
import { StepPackageSelection } from "@/components/signup/StepPackageSelection";
import { StepPersonalDetails } from "@/components/signup/StepPersonalDetails";
import { StepFinal } from "@/components/signup/StepFinal";
import Image from "next/image";
import { useState, useCallback } from "react";

const SignUpPage = () => {
    const [step, setStepState] = useState(1);

    const setStep = useCallback((newStep: number) => {
        setStepState(newStep);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    const renderStep = () => {
        switch (step) {
            case 1:
                return <StepVerify setStep={setStep} />;
            case 2:
                return <StepOTPVerification setStep={setStep} />;
            case 3:
                return <StepPackageSelection setStep={setStep} />;
            case 4:
                return <StepPersonalDetails setStep={setStep} />;
            case 5:
                return <StepFinal setStep={setStep} />;
            default:
                return null;
        }
    };
    

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-300 to-gray-50 flex flex-col items-center  py-10 px-7">
            <div className="bg-white rounded-3xl shadow-2xl p-6  w-full max-w-md md:max-w-5xl relative overflow-hidden flex flex-col md:flex-row items-center justify-center gap-6 md:gap-16 transform -translate-y-6 md:translate-y-0 ">
                {step !== 4 && (
                    <div className="flex-shrink-0 ">
                        <Image
                            src="/signin-image.png"
                            alt="E-channeling Decorative"
                            width={350}
                            height={350}
                            className="object-contain w-40 sm:w-55 md:w-65 lg:w-90 transition-all duration-300 ease-in-out"
                            sizes="(max-width: 640px) 5rem, (max-width: 768px) 7rem, (max-width: 1024px) 14rem, 20rem"
                        />
                    </div>
                )}
                <div className="w-full mr-0 md:mr-5">
                    <div className="">
                        {step != 4 ? (
                            <>
                                <h1 className="text-2xl md:text-[28px] font-bold text-center mb-4 ">
                                    SIGN UP
                                </h1>

                                <p className="text-gray-600 text-center mb-6  text-sm">
                                    Hello there! Let&apos;s create your account.
                                </p>

                                <div className="flex justify-center items-center space-x-2 mb-6">
                                    {[1, 2, 3, 4, 5].map((stepNumber) => (
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
                                                {stepNumber < step
                                                    ? "✓"
                                                    : stepNumber}
                                            </div>
                                            {stepNumber < 5 && (
                                                <div
                                                    className={`w-5 sm:w-8 h-0.5 ${stepNumber < step ? "bg-blue-600" : "bg-gray-200"}`}
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <>
                                <h1 className="text-2xl  font-bold text-center mb-3">
                                    SIGN UP
                                </h1>

                                <p className="text-gray-600 text-center mb-4  text-sm">
                                    Hello there! Let&apos;s create your account.
                                </p>

                                <div className="flex justify-center items-center space-x-2 mb-4">
                                    {[1, 2, 3, 4, 5].map((stepNumber) => (
                                        <div
                                            key={stepNumber}
                                            className="flex items-center"
                                        >
                                            <div
                                                className={`rounded-full h-6 w-6 flex items-center justify-center ${
                                                    stepNumber <= step
                                                        ? "bg-blue-600 text-white"
                                                        : "border-2 border-gray-200 text-gray-400"
                                                }`}
                                            >
                                                {stepNumber < step
                                                    ? "✓"
                                                    : stepNumber}
                                            </div>
                                            {stepNumber < 5 && (
                                                <div
                                                    className={`w-5 sm:w-8 h-0.5 ${stepNumber < step ? "bg-blue-600" : "bg-gray-200"}`}
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    <div className={`${step === 4 ? "mt-2" : "mt-6"}`}>
                        {renderStep()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;
