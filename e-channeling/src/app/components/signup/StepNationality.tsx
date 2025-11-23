import { AppDispatch, RootState } from "@/store";
import { clearErrors, requestOtp, setSignupData } from "@/store/auth/authSlice";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";

export const StepNationality = () => {
    const [nationality, setNationality] = useState("Sri Lankan");
    const [phoneNumber, setPhoneNumber] = useState({
        phone_number: "",
    });
    const [error, setError] = useState("");
    const { isRequestOtpLoading, isRequestOtpError } = useSelector(
        (state: RootState) => state.auth
    );

    const validateNumber = () => {
        setError("");
        const num = phoneNumber.phone_number.trim();

        if (!num) {
            setError("Please enter your Number!");
            return false;
        }

        if (nationality === "Sri Lankan") {
            if (!/^\d{9}$/.test(num)) {
                setError(
                    "Sri Lankan phone number must be exactly 9 digits and contain only numbers"
                );
                return false;
            }
        } else {
            if (!/^\d{11}$/.test(num)) {
                setError(
                    "phone number must be exactly 11 digits and contain only numbers"
                );
                return false;
            }
        }
        return true;
    };

    const formatNumber = () => {
        let number;
        if (nationality === "Sri Lankan") {
            number = `+94${phoneNumber.phone_number}`;
        } else {
            number = `${phoneNumber.phone_number}`;
        }
        return number;
    };

    const dispatch = useDispatch<AppDispatch>();

    const sendOtpRequest = (e?: FormEvent) => {
        e?.preventDefault();
        if (!validateNumber()) return;
        dispatch(clearErrors());
        console.log("sending OTP to", formatNumber());
        const num = formatNumber();
        dispatch(setSignupData({ phoneNumber: num }));
        dispatch(requestOtp({ phone_number: num }));
    };

    return (
        <form onSubmit={sendOtpRequest} className="space-y-6">
            <div>
                <h2 className="text-lg font-medium mb-4 text-center">
                    Set Nationality
                </h2>
                <p className="text-sm text-center text-gray-600 mb-5">
                    Select your nationality and enter your mobile number
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
                            }}
                            className="w-full px-4 py-3 border-2 rounded-full focus:outline-none transition-colors placeholder:text-gray-500 border-gray-300 focus:border-indigo-400"
                            required
                        >
                            <option value="Sri Lankan">Sri Lankan</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div>
                        <label className="block mb-2 text-sm sm:text-[16px]">
                            Phone Number *
                        </label>
                        <div className="flex">
                            {nationality === "Sri Lankan" ? (
                                <>
                                    <span className="px-3 py-3 border-2 border-r-0 rounded-l-full border-gray-500 bg-gray-50">
                                        +94
                                    </span>
                                    <input
                                        type="tel"
                                        name="phone_number"
                                        inputMode="numeric"
                                        value={phoneNumber.phone_number}
                                        onChange={(e) => {
                                            setPhoneNumber((prev) => ({
                                                ...prev,
                                                phone_number: e.target.value,
                                            }));
                                            setError("");
                                            dispatch(clearErrors());
                                        }}
                                        placeholder="Ex: 711234567"
                                        className="flex-1 px-4 py-3 border-2  rounded-r-full focus:outline-none transition-colors placeholder:text-gray-500 border-gray-300 focus:border-indigo-400"
                                        required
                                    />
                                </>
                            ) : (
                                <input
                                    type="tel"
                                    name="phone_number"
                                    inputMode="numeric"
                                    value={phoneNumber.phone_number}
                                    onChange={(e) => {
                                        setPhoneNumber((prev) => ({
                                            ...prev,
                                            phone_number: e.target.value,
                                        }));
                                        setError("");
                                        dispatch(clearErrors());
                                    }}
                                    placeholder="Ex: +44********* ( number with county code )"
                                    className="flex-1 px-4 py-3 border-2 rounded-full focus:outline-none transition-colors placeholder:text-gray-500 border-gray-300 focus:border-indigo-400"
                                    required
                                />
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
            </div>
            <div className="flex justify-end space-x-4 mt-10">
                <Link
                    href={"/login"}
                    type="button"
                    className="px-6 py-2 border border-gray-500 rounded-full hover:bg-gray-800 hover:text-white transition ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
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
