import { AppDispatch, RootState } from "@/store";
import {
    clearErrors,
    requestOtp,
    setRequestOtpSuccessFalse,
    verifyOtp,
} from "@/store/auth/authSlice";
import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export const StepOTPVerification = () => {
    const [otp, setOtp] = useState("");
    const [otpTimer, setOtpTimer] = useState(120);
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const OTP_LENGTH = 6;
    const dispatch = useDispatch<AppDispatch>();

    const {
        isRequestOtpLoading,
        isVerifyOtpLoading,
        isVerifyOtpError,
        signupData,
    } = useSelector((state: RootState) => state.auth);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!otp) dispatch(clearErrors());
        let value = e.target.value.replace(/\D/g, ""); // allow digits only
        if (value.length > OTP_LENGTH) value = value.slice(0, OTP_LENGTH); // remove above the range
        setOtp(value);
    };

    const focusInput = () => {
        inputRef.current?.focus();
        setIsFocused(true);
    };

    const handleBlur = () => {
        setIsFocused(false);
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        const digits = e.clipboardData.getData("text").replace(/\D/g, "");
        setOtp(digits.slice(0, OTP_LENGTH));
    };

    useEffect(() => {
        console.log("OTP =", otp);
    }, [otp]);

    useEffect(() => {
        const interval = setInterval(() => {
            setOtpTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const handleOtpSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        const phoneFromState = signupData?.phoneNumber as string;
        dispatch(verifyOtp({ phone_number: phoneFromState, otp: otp }));
    };

    const handleBack = () => {
        dispatch(setRequestOtpSuccessFalse());
    };

    const phoneFromState = signupData?.phoneNumber as string;

    const reSendOtpRequest = () => {
        dispatch(clearErrors());
        if (otpTimer !== 0) return;

        setOtp("");
        setOtpTimer(120);

        dispatch(requestOtp({ phone_number: phoneFromState }));
    };

    return (
        <form onSubmit={handleOtpSubmit} className="space-y-6">
            <div>
                <h2 className="text-lg font-medium mb-4 text-center">
                    Verify Mobile Number
                </h2>
                <div className="space-y-4">
                    <div className="text-center mb-4">
                        <p className="text-[16px] text-gray-600 mt-2">
                            OTP Verification
                        </p>
                        <p className="text-sm text-gray-600 mt-2">
                            We have send OTP to your mobile number{" "}
                            {phoneFromState}
                        </p>
                    </div>

                    {/* hidden actual input */}
                    <input
                        ref={inputRef}
                        value={otp}
                        onChange={(e) => {
                            handleChange(e);
                        }}
                        onFocus={() => setIsFocused(true)}
                        onBlur={handleBlur}
                        maxLength={OTP_LENGTH}
                        className="opacity-0 absolute pointer-events-none"
                        type="tel"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        autoComplete="one-time-code"
                        onPaste={handlePaste}
                    />

                    {/* visible OTP Boxes */}
                    <div
                        className="flex gap-3 justify-center"
                        onClick={focusInput}
                    >
                        {Array.from({ length: OTP_LENGTH }).map((_, index) => {
                            const isFilled = Boolean(otp[index]);
                            const isActive =
                                isFocused &&
                                (otp.length === index ||
                                    (otp.length === OTP_LENGTH &&
                                        index === OTP_LENGTH - 1));

                            return (
                                <div
                                    key={index}
                                    className={`w-10 h-12 border rounded-lg flex items-center justify-center text-xl font-medium cursor-text transition-colors duration-150 relative ${
                                        isFilled
                                            ? "bg-blue-100 border-blue-500 text-blue-800"
                                            : "bg-white border-gray-300 text-gray-700"
                                    } ${isActive ? "ring-2 ring-blue-300" : ""}`}
                                >
                                    {otp[index] || ""}
                                    {isActive && !isFilled && (
                                        <span className="absolute blink text-gray-700">
                                            |
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <div className="text-center space-y-4">
                        {isVerifyOtpError ? (
                            <p className="text-red-500 text-sm text-center font-medium">
                                {isVerifyOtpError}
                            </p>
                        ) : (
                            <p className="text-sm text-gray-600">
                                OTP Expires in {Math.floor(otpTimer / 60)}:
                                {(otpTimer % 60).toString().padStart(2, "0")}
                            </p>
                        )}

                        <p className="text-sm">
                            Didn&apos;t receive an OTP?{" "}
                            <button
                                type="button"
                                onClick={reSendOtpRequest}
                                className="text-blue-600 hover:text-blue-700 hover:underline cursor-pointer disabled:text-gray-400 disabled:cursor-not-allowed disabled:no-underline transition-colors"
                                disabled={otpTimer > 0}
                                aria-disabled={otpTimer > 0}
                            >
                                {isRequestOtpLoading
                                    ? "Sending..."
                                    : "Resend OTP"}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
            <div className="flex justify-end space-x-4">
                <button
                    type="button"
                    onClick={handleBack}
                    className="px-6 py-2 border border-gray-500 rounded-full hover:bg-gray-800 hover:text-white transition ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                    Previous
                </button>
                <button
                    type="submit"
                    disabled={isVerifyOtpLoading || otp.length < 6}
                    aria-busy={isVerifyOtpLoading}
                    className="px-4 py-2 w-36 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-semibold rounded-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition ease-in-out duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300"
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
    );
};
