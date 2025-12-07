import { redis } from "@/lib/db/redis";
import { verifyOtpHash } from "@/lib/otp/verifyOtpHash";
import { NextResponse } from "next/server";

// Verify the OTP
export async function POST(req: Request) {
    try {
        const { identifier, otp } = await req.json();

        if (!identifier || !otp) {
            return NextResponse.json(
                { error: "Missing fields" },
                { status: 400 }
            );
        }

        const storedHash = await redis.get(`otp:${identifier}`);

        if (!storedHash) {
            return NextResponse.json(
                { error: "OTP expired or not found" },
                { status: 400 }
            );
        }

        const isValid = verifyOtpHash(otp, String(storedHash));

        if (!isValid) {
            return NextResponse.json({ error: "Invalid OTP" }, { status: 401 });
        }

        // After verified delete OTP
        await redis.del(`otp:${identifier}`);

        return NextResponse.json({ message: "OTP Verified" }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
