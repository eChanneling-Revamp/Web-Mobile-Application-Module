"use client";
import { StepNationality } from "@/app/components/signup/StepNationality";
import { StepOTPVerification } from "@/app/components/signup/StepOTPVerification";
import { StepPackageSelection } from "@/app/components/signup/StepPackageSelection";
// import { StepPersonalDetails } from "@/app/components/signup/StepPersonalDetails";
// import { StepSuccess } from "@/app/components/signup/StepSuccess";
import { RootState } from "@/store";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const SignUpPage = () => {
    const [step, setStep] = useState(1);

    const { isRequestOtpSuccess, isOtpVerified } = useSelector(
        (state: RootState) => state.auth
    );

    useEffect(() => {
        if (!isRequestOtpSuccess) {
            setStep(1);
        }
        if (isRequestOtpSuccess) {
            setStep(2);
        }
        if (isOtpVerified) {
            setStep(3);
        }
    }, [isRequestOtpSuccess, isOtpVerified]);

    const renderStep = () => {
        switch (step) {
            case 1:
                return <StepNationality />;
            case 2:
                return <StepOTPVerification />;
            case 3:
                return <StepPackageSelection setStep={setStep} />;
            default:
                return null;
        }
    };

    console.log("main");

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-300 to-gray-50 flex flex-col items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 w-full max-w-md md:max-w-4xl relative overflow-hidden flex flex-col md:flex-row items-center justify-center gap-6 md:gap-17 transform -translate-y-6 md:translate-y-0 ">
                <div className="flex-shrink-0 ">
                    <Image
                        src="/signin-image.png"
                        alt="E-channeling Decorative"
                        width={350}
                        height={0}
                        className="object-contain w-56 md:w-86 h-auto"
                        placeholder="blur"
                        blurDataURL="/signin-image.png"
                    />
                </div>
                <div className="w-full md:w-1/2 ">
                    <div className="">
                        <h1 className="text-2xl md:text-3xl font-bold text-center mb-4 md:mb-6">
                            SIGN UP
                        </h1>

                        <p className="text-gray-600 text-center mb-6 md:mb-8 text-sm">
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
                                        {stepNumber < step ? "✓" : stepNumber}
                                    </div>
                                    {stepNumber < 5 && (
                                        <div
                                            className={`w-5 sm:w-8 h-0.5 ${stepNumber < step ? "bg-blue-600" : "bg-gray-200"}`}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-8 ">{renderStep()}</div>
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;
