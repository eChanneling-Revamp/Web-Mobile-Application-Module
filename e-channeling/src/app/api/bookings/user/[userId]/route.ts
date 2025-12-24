import { rateLimit } from "@/lib/utils/rateLimit";
import { getBookingsById } from "@/services/booking/booking.service";
import { NextResponse } from "next/server";

// get all appointments by user created
export async function GET(
    _request: Request,
    { params }: { params: Promise<{ userId: string }> }
) {
    try {
        const { userId } = await params;
        // rate limiting
        const forwarded = _request.headers.get("x-forwarded-for");
        const ip = forwarded ? forwarded.split(",")[0] : "unknown";

        const isAllowed = await rateLimit(`getUserBookings:${ip}`, 10);
        if (!isAllowed) {
            return NextResponse.json(
                { error: "Too many booking attempts. Please try again later." },
                { status: 429 }
            );
        }

        const appointments = await getBookingsById(userId);

        if (!appointments) {
            return NextResponse.json(
                { error: "Appointments not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: appointments });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}
