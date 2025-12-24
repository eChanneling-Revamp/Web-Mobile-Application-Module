import { rateLimit } from "@/lib/utils/rateLimit";
import { updateBooking } from "@/services/booking/booking.service";
import {
    UpdateBookingInput,
    updateBookingSchema,
} from "@/validations/booking/updateBooking.schema";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

// update appointment by id
export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ appointmentNumber: string }> }
) {
    try {
        const { appointmentNumber } = await params;
        const body = await request.json();

        // rate limiting
        const forwarded = request.headers.get("x-forwarded-for");
        const ip = forwarded ? forwarded.split(",")[0] : "unknown";

        const isAllowed = await rateLimit(`getSingleBooking:${ip}`, 5);
        if (!isAllowed) {
            return NextResponse.json(
                { error: "Too many booking attempts. Please try again later." },
                { status: 429 }
            );
        }

        let validatedData: UpdateBookingInput;

        try {
            validatedData = updateBookingSchema.parse(body);
        } catch (error) {
            if (error instanceof ZodError) {
                const firstError = error.issues[0];
                return NextResponse.json(
                    { error: firstError.message },
                    { status: 400 }
                );
            }
            throw error;
        }

        const updateAppointment = await updateBooking(
            appointmentNumber,
            validatedData
        );

        return NextResponse.json({
            success: true,
            message: "Booking updated successfully",
            data: updateAppointment,
        });
    } catch (error: any) {
        console.log(error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}
