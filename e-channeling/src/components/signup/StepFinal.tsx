import { AppDispatch, RootState } from "@/store";
import { FaStar } from "react-icons/fa6";
import Link from "next/link";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
    clearErrors,
    resetSignup,
    setSignupData,
    signup,
    type SignupData,
} from "@/store/auth/authSlice";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface StepPackageSelectionProps {
    setStep?: (step: number) => void;
}

// Type guard to validate complete signup data
const isCompleteSignupData = (
    data: Partial<SignupData>
): data is SignupData => {
    return (
        typeof data.phone_number === "string" &&
        typeof data.country_code === "string" &&
        typeof data.package === "string" &&
        typeof data.title === "string" &&
        typeof data.first_name === "string" &&
        typeof data.last_name === "string" &&
        typeof data.email === "string" &&
        typeof data.password === "string" &&
        typeof data.confirm_password === "string" &&
        (data.id_type === "nic" || data.id_type === "passport") &&
        (data.user_type === "individual" || data.user_type === "corporate") &&
        typeof data.accepted_terms === "boolean"
    );
};

export const StepFinal = ({ setStep }: StepPackageSelectionProps) => {
    const { signupData, isSignupLoading, isSignupError, isSignupSuccess } =
        useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();

    const handleBack = () => {
        dispatch(clearErrors());
        if (setStep) {
            setStep(4);
        }
    };

    const handleCancel = () => {
        dispatch(clearErrors());
        dispatch(resetSignup());
        if (setStep) {
            setStep(1);
        }
    };

    const handleTermsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(
            setSignupData({
                ...signupData,
                accepted_terms: e.target.checked,
            })
        );
    };

    const handleSubmit = () => {
        // Validate that all required fields are present
        if (!isCompleteSignupData(signupData)) {
            console.error("Incomplete signup data:", signupData);
            return;
        }
        dispatch(signup(signupData));
    };

    useEffect(() => {
        if (isSignupSuccess) {
            dispatch(resetSignup());
            window.location.href = "/";
        }
    }, [isSignupSuccess, dispatch]);

    // console.log("signupData", signupData);

    return (
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-1 py-1  ">
            <div className="mb-4">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    Summary
                </h1>
                <p className="text-sm sm:text-[15px] text-gray-500">
                    Please check the information is correct before continue
                </p>
            </div>

            <div className="mb-6">
                {signupData?.package === "FREE Member" ? (
                    <div className="inline-flex items-center gap-2 sm:gap-3 px-3  py-1.5  bg-blue-50 rounded-full border border-blue-200">
                        <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                            <FaStar className="text-white" />
                        </div>
                        <span className="text-base sm:text-[15px] font-semibold text-blue-700">
                            {signupData.package}
                        </span>
                    </div>
                ) : (
                    <div className="inline-flex items-center gap-2 sm:gap-3 px-3  py-1.5  bg-green-50 rounded-full border border-green-200">
                        <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                            <FaStar className="text-white" />
                        </div>
                        <span className="text-base sm:text-[15px] font-semibold text-green-700">
                            {signupData.package}
                        </span>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4  mb-6 sm:mb-8">
                <div className="space-y-1">
                    <p className="text-xs sm:text-sm text-gray-500 font-medium">
                        User Type
                    </p>
                    <p className="text-base sm:text-lg font-semibold text-gray-800">
                        {signupData.user_type}
                    </p>
                </div>

                <div className="space-y-1">
                    <p className="text-xs sm:text-sm text-gray-500 font-medium">
                        Title
                    </p>
                    <p className="text-base sm:text-lg font-semibold text-gray-800">
                        {signupData.title}
                    </p>
                </div>

                <div className="space-y-1">
                    <p className="text-xs sm:text-sm text-gray-500 font-medium">
                        First name
                    </p>
                    <p className="text-base sm:text-lg font-semibold text-gray-800">
                        {signupData.first_name}
                    </p>
                </div>

                <div className="space-y-1">
                    <p className="text-xs sm:text-sm text-gray-500 font-medium">
                        Last name
                    </p>
                    <p className="text-base sm:text-lg font-semibold text-gray-800">
                        {signupData.last_name}
                    </p>
                </div>

                {signupData.user_type === "corporate" && (
                    <>
                        <div className="space-y-1">
                            <p className="text-xs sm:text-sm text-gray-500 font-medium">
                                Company Name
                            </p>
                            <p className="text-base sm:text-lg font-semibold text-gray-800">
                                {signupData.company_name}
                            </p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs sm:text-sm text-gray-500 font-medium">
                                Employee Number/Member ID
                            </p>
                            <p className="text-base sm:text-lg font-semibold text-gray-800">
                                {signupData.employee_id}
                            </p>
                        </div>
                    </>
                )}

                <div className="space-y-1">
                    <p className="text-xs sm:text-sm text-gray-500 font-medium">
                        Email
                    </p>
                    <p className="text-base sm:text-[15px] font-semibold text-gray-800 break-all">
                        {signupData.email}
                    </p>
                </div>

                <div className="space-y-1">
                    <p className="text-xs sm:text-sm text-gray-500 font-medium">
                        Mobile number
                    </p>
                    <p className="text-base sm:text-lg font-semibold text-gray-800">
                        {signupData.phone_number}
                    </p>
                </div>

                {signupData.id_type === "passport" ? (
                    <>
                        <div className="space-y-1">
                            <p className="text-xs sm:text-sm text-gray-500 font-medium">
                                Nationality
                            </p>
                            <p className="text-base sm:text-lg font-semibold text-gray-800">
                                {signupData.nationality}
                            </p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs sm:text-sm text-gray-500 font-medium">
                                Passport Number
                            </p>
                            <p className="text-base sm:text-lg font-semibold text-gray-800">
                                {signupData.passport_number}
                            </p>
                        </div>
                    </>
                ) : (
                    <div className="space-y-1">
                        <p className="text-xs sm:text-sm text-gray-500 font-medium">
                            NIC / Passport
                        </p>
                        <p className="text-base sm:text-lg font-semibold text-gray-800">
                            {signupData.nic_number}
                        </p>
                    </div>
                )}
            </div>

            <div className="mb-6 sm:mb-8">
                <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                        type="checkbox"
                        checked={signupData.accepted_terms || false}
                        onChange={handleTermsChange}
                        className="w-4 h-4  mt-1 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer transition-all"
                    />
                    <span className="text-sm sm:text-base text-gray-600 select-none group-hover:text-gray-800 transition-colors">
                        I agree to the{" "}
                        <Link
                            href="/terms"
                            className="text-blue-600 hover:text-blue-700 underline font-medium"
                        >
                            terms and conditions
                        </Link>
                    </span>
                </label>
            </div>

            {isSignupError && (
                <div className="mb-4 text-red-600 text-[15px] text-center">
                    {isSignupError}
                </div>
            )}

            <div className="flex flex-col sm:flex-row justify-center px-10 sm:px-0 gap-5 sm:gap-5 pt-2">
                <button
                    onClick={handleBack}
                    className="w-full- sm:w-[120px]  px-7  py-2 border-2 border-gray-300 text-gray-700 font-medium rounded-full transition-all  hover:bg-gray-800 hover:text-white hover:border-gray-400 hover:shadow-md active:scale-95 cursor-pointer"
                >
                    Back
                </button>

                <button
                    onClick={handleCancel}
                    className="w-full sm:w-[120px]  px-7  py-2 border-2 border-gray-300 text-gray-700 font-medium rounded-full transition-all  hover:bg-gray-800 hover:text-white hover:border-gray-400 hover:shadow-md active:scale-95 cursor-pointer"
                >
                    Cancel
                </button>

                <button
                    disabled={!signupData.accepted_terms}
                    onClick={handleSubmit}
                    aria-busy={isSignupLoading}
                    className="w-full sm:w-[130px] px-4 py-2 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-semibold rounded-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition ease-in-out duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                    {isSignupLoading ? (
                        <span className="flex items-center justify-center gap-2">
                            <Loader2 className="w-4.5 h-4.5 animate-spin" />
                            Sending...
                        </span>
                    ) : (
                        "Register"
                    )}
                </button>
            </div>
        </div>
    );
};
