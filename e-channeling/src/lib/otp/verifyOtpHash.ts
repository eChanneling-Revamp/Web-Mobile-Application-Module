import crypto from "crypto";

// SHA-256 always gives the same hash for the same input
export const verifyOtpHash = (otp: string, storedOtpHash: string) => {
    const newHashOtp = crypto.createHash("sha256").update(otp).digest("hex");
    return newHashOtp === storedOtpHash;
};
