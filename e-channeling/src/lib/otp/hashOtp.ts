import crypto from "crypto";

// SHA-256 hashing algorithm.
export const hashOtp = (otp: string): string => {
    if (typeof otp !== "string") throw new TypeError("otp must be a string");
    return crypto.createHash("sha256").update(otp, "utf8").digest("hex");
};
