import { AppDispatch, RootState } from "@/store";
import {
    clearErrors,
    requestOtp,
    resetSignup,
    setSignupData,
} from "@/store/auth/authSlice";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";

interface StepPackageSelectionProps {
    setStep?: (step: number) => void;
}

export const StepVerify = ({ setStep }: StepPackageSelectionProps) => {
    const [nationality, setNationality] = useState("Sri Lankan");
    const [useEmail, setUseEmail] = useState(false);
    const [contactInfo, setContactInfo] = useState({
        phone_number: "",
        email: "",
        country_code: "",
    });
    const [error, setError] = useState("");
    const { isRequestOtpLoading, isRequestOtpError, isRequestOtpSuccess } =
        useSelector((state: RootState) => state.auth);

    const validateContactInfo = () => {
        setError("");

        if (nationality === "Sri Lankan") {
            if (useEmail) {
                const email = contactInfo.email.trim();
                if (!email) {
                    setError("Please enter your Email!");
                    return false;
                }
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
                if (!emailRegex.test(email)) {
                    setError("Please enter a valid email address");
                    return false;
                }
            } else {
                const num = contactInfo.phone_number.trim();
                if (!num) {
                    setError("Please enter your Number!");
                    return false;
                }
                if (!/^\d{9,10}$/.test(num)) {
                    setError(
                        "Sri Lankan phone number must be 9 or 10 digits and contain only numbers"
                    );
                    return false;
                }
            }
        } else {
            const email = contactInfo.email.trim();
            if (!email) {
                setError("Please enter your Email!");
                return false;
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
            if (!emailRegex.test(email)) {
                setError("Please enter a valid email address");
                return false;
            }
        }

        return true;
    };

    // format the number standard way
    const formatNumber = () => {
        let number;
        if (nationality === "Sri Lankan") {
            const phone = contactInfo.phone_number;
            if (phone.length == 10) {
                number = `+94${phone.slice(1)}`;
            } else {
                number = `+94${phone}`;
            }
        }
        return number;
    };

    const dispatch = useDispatch<AppDispatch>();

    const sendOtpRequest = (e?: FormEvent) => {
        e?.preventDefault();
        if (!validateContactInfo()) return;
        dispatch(clearErrors());

        const formatedNumber = formatNumber();
        //console.log("sending OTP to", formatedNumber);

        if (nationality === "Sri Lankan") {
            if (useEmail) {
                const identifierValue = contactInfo.email || "";
                dispatch(
                    setSignupData({
                        email: identifierValue,
                        country_code: contactInfo.country_code,
                    })
                );
                dispatch(requestOtp({ email: identifierValue }));
            } else {
                const identifierValue = formatedNumber || "";
                dispatch(
                    setSignupData({
                        phone_number: identifierValue,
                        country_code: contactInfo.country_code,
                    })
                );
                dispatch(requestOtp({ phone: identifierValue }));
            }
        } else {
            const identifierValue = contactInfo.email || "";
            dispatch(
                setSignupData({
                    email: identifierValue,
                    country_code: contactInfo.country_code,
                })
            );
            dispatch(requestOtp({ email: identifierValue }));
        }
    };

    useEffect(() => {
        if (isRequestOtpSuccess) {
            if (setStep) {
                setStep(2);
            }
        }
    }, [isRequestOtpSuccess, setStep]);

    // console.log(contactInfo);
    // console.log("Sign up data ",signupData)

    const openEmailBox = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setError("");
        dispatch(clearErrors());
        dispatch(resetSignup());
        setUseEmail(!useEmail);
    };

    //console.log(contactInfo);

    return (
        <form onSubmit={sendOtpRequest} noValidate className="space-y-6">
            <div>
                <h2 className="text-lg font-medium mb-4 text-center">Verify</h2>
                <p className="text-sm text-center text-gray-600 mb-5">
                    Select your nationality and enter your mobile number or
                    email
                </p>
                <div className="space-y-4">
                    <div>
                        <label className="block mb-2 text-sm sm:text-[16px]">
                            Nationality *
                        </label>
                        <select
                            name="nationality"
                            value={nationality}
                            onChange={(e) => {
                                setNationality(e.target.value);
                                setError("");
                                setContactInfo({
                                    phone_number: "",
                                    email: "",
                                    country_code: "",
                                });
                                dispatch(clearErrors());
                                dispatch(resetSignup());
                            }}
                            className="w-full px-4 py-3 border-2 rounded-full focus:outline-none transition-colors placeholder:text-gray-500 border-gray-300 focus:border-indigo-400"
                            required
                        >
                            <option value="Sri Lankan">Sri Lankan</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div className="">
                        {nationality === "Sri Lankan" ? (
                            <>
                                {useEmail ? (
                                    <div className="flex flex-col">
                                        <div className="">
                                            <label className="block mb-2 text-sm sm:text-[16px]">
                                                Email *
                                            </label>
                                            <input
                                                type="text"
                                                name="email"
                                                value={contactInfo.email}
                                                onChange={(e) => {
                                                    setContactInfo((prev) => ({
                                                        ...prev,
                                                        email: e.target.value,
                                                        country_code: "+94",
                                                    }));
                                                    setError("");
                                                    dispatch(clearErrors());
                                                }}
                                                placeholder="Enter your email to send OTP"
                                                className="flex-1 px-4 py-3 border-2 w-full rounded-full focus:outline-none transition-colors placeholder:text-gray-500 border-gray-300 focus:border-indigo-400"
                                                required
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            className="mt-4 text-blue-500 hover:text-blue-800 underline cursor-pointer w-[100px] self-center"
                                            onClick={openEmailBox}
                                        >
                                            Use number
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col">
                                        <div>
                                            <label className="block mb-2 text-sm sm:text-[16px]">
                                                Phone Number *
                                            </label>
                                            <div className="flex">
                                                <span className="px-3 py-3 border-2 border-r-0 rounded-l-full border-gray-500 bg-gray-50">
                                                    +94
                                                </span>
                                                <input
                                                    type="tel"
                                                    name="phone_number"
                                                    inputMode="numeric"
                                                    value={
                                                        contactInfo.phone_number
                                                    }
                                                    onChange={(e) => {
                                                        setContactInfo(
                                                            (prev) => ({
                                                                ...prev,
                                                                phone_number:
                                                                    e.target
                                                                        .value,
                                                                country_code:
                                                                    "+94",
                                                            })
                                                        );
                                                        setError("");
                                                        dispatch(clearErrors());
                                                    }}
                                                    placeholder="Ex: 711234567"
                                                    className="flex-1 px-4 py-3 border-2  rounded-r-full focus:outline-none transition-colors placeholder:text-gray-500 border-gray-300 focus:border-indigo-400"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <button
                                            className="mt-4 text-blue-500 hover:text-blue-800 underline cursor-pointer w-[100px] self-center "
                                            onClick={openEmailBox}
                                        >
                                            Use email
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="">
                                <label className="block mb-2 text-sm sm:text-[16px]">
                                    Email *
                                </label>
                                <input
                                    type="text"
                                    name="email"
                                    value={contactInfo.email}
                                    onChange={(e) => {
                                        setContactInfo((prev) => ({
                                            ...prev,
                                            email: e.target.value,
                                            country_code: "other",
                                        }));
                                        setError("");
                                        dispatch(clearErrors());
                                    }}
                                    placeholder="Enter your email to send OTP"
                                    className="flex-1 px-4 py-3 border-2 w-full rounded-full focus:outline-none transition-colors placeholder:text-gray-500 border-gray-300 focus:border-indigo-400"
                                    required
                                />
                            </div>
                        )}
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm mt-4 text-center">
                            {error}
                        </div>
                    )}

                    {isRequestOtpError && (
                        <div className="text-red-500 text-sm mt-4 text-center">
                            {isRequestOtpError}
                        </div>
                    )}
                </div>
            </div>

            <div className="flex justify-between space-x-4 mt-10">
                <Link
                    href={"/login"}
                    type="button"
                    className=" px-7 w-32 py-2 text-center border-2 border-gray-300 text-gray-700 font-medium rounded-full transition-all  hover:bg-gray-800 hover:text-white hover:border-gray-400 hover:shadow-md active:scale-95 cursor-pointer"
                >
                    Close
                </Link>
                <button
                    type="submit"
                    disabled={isRequestOtpLoading}
                    aria-busy={isRequestOtpLoading}
                    className="px-4 py-2 w-36 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-semibold rounded-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition ease-in-out duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                    {isRequestOtpLoading ? (
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
    );
};
