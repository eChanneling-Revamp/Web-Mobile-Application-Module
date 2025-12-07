import { AppDispatch, RootState } from "@/store";
import { resetSignup, setSignupData } from "@/store/auth/authSlice";
import Link from "next/link";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

interface StepPackageSelectionProps {
    setStep?: (step: number) => void;
}

export const StepPackageSelection = ({
    setStep,
}: StepPackageSelectionProps) => {
    const { signupData } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch<AppDispatch>();

    const packages = [
        {
            name: "Free Member",
            price: "0 LKR",
            duration: "Life time",
            features: [
                "Member loyalty point scheme",
                "Able to view Doctor Channel History",
            ],
        },
        {
            name: "Premium Member",
            price: "2000 LKR",
            duration: "1 Year",
            features: ["30% on ECH Service fee", "15% on ECH Service fee"],
        },
    ];

    const [formData, setFormData] = useState({
        package: signupData.package || "",
    });

    const handlePackageSelect = (packageName: string) => {
        setFormData({
            package: packageName,
        });
    };

    const handleNext = () => {
        dispatch(
            setSignupData({
                package: formData.package,
            })
        );
        if (setStep && formData.package) {
            setStep(4);
        }
    };

    const handleCancel = () => {
        dispatch(resetSignup());
        if (setStep) {
            setStep(1);
        }
    };

    console.log("signupData ", signupData)

    return (
        <div className="space-y-8 ">
            <h2 className="text-lg font-bold text-center">Select Package</h2>

            <div className="grid md:grid-cols-2 gap-6">
                {packages.map((pkg) => (
                    <div
                        key={pkg.name}
                        onClick={() => handlePackageSelect(pkg.name)}
                        className={`relative cursor-pointer transition-all rounded-xl border p-6 min-h-[200px] md:min-h-[300px] flex flex-col justify-between hover:bg-blue-100 ${
                            formData.package === pkg.name
                                ? "border-[#4B5BDA] shadow-md bg-blue-100"
                                : "border-gray-300 hover:shadow-sm bg-gray-50"
                        }`}
                    >
                        <div className="flex items-start justify-between">
                            <div
                                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                    pkg.name === "Free Member"
                                        ? "bg-[#E8F4FE]"
                                        : "bg-[#F1FFE9]"
                                }`}
                            >
                                {pkg.name === "Free Member" ? (
                                    <span className="text-[#4B5BDA] text-xl">
                                        ★
                                    </span>
                                ) : (
                                    <span className="text-[#75B53B] text-xl">
                                        👑
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="flex-1 flex flex-col justify-center items-start">
                            <h3 className="font-medium">{pkg.name}</h3>
                            <p className="text-2xl font-extrabold mt-2">
                                {pkg.price}
                            </p>
                            <p className="text-sm text-gray-500 mt-2">
                                {pkg.duration}
                            </p>
                        </div>

                        <ul className="space-y-2 text-sm text-gray-700 mt-4">
                            {pkg.features.map((feature, index) => (
                                <li
                                    key={index}
                                    className="flex items-start gap-2"
                                >
                                    <svg
                                        className="w-4 h-4 text-green-500 mt-1"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                    <span className="leading-tight">
                                        {feature}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            <div className="text-center text-sm">
                <Link
                    href="/membership-details"
                    className="text-blue-600 hover:text-blue-700 underline"
                >
                    To view more info regarding eChannelling membership and
                    benefits visit Membership Details
                </Link>
            </div>

            <div className="flex justify-between space-x-4 pt-2">
                <button
                    onClick={handleCancel}
                    className="sm:w-auto px-7 w-32 py-2 border-2 border-gray-300 text-gray-700 font-medium rounded-full transition-all  hover:bg-gray-800 hover:text-white hover:border-gray-400 hover:shadow-md active:scale-95 cursor-pointer"
                >
                    Cancel
                </button>

                <button
                    type="button"
                    onClick={handleNext}
                    className="px-4 py-2 w-32 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-semibold rounded-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition ease-in-out duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    disabled={!formData.package}
                >
                    Next
                </button>
            </div>
        </div>
    );
};
