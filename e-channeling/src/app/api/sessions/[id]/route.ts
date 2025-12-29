import { rateLimit } from "@/lib/utils/rateLimit";
import getSessionsByDoctorId from "@/services/sessions/sessions.service";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // rate limiting
        const forwarded = request.headers.get("x-forwarded-for");
        const ip = forwarded ? forwarded.split(",")[0] : "unknown";

        const isAllowed = await rateLimit(`getSessionsByDoctorId:${ip}`, 30);
        if (!isAllowed) {
            return NextResponse.json(
                { error: "Too many attempts. Please try again later." },
                { status: 429 }
            );
        }
        const { id } = await params;

        if (!id) {
            return NextResponse.json({ error: "Id required" }, { status: 400 });
        }

        const sessions = await getSessionsByDoctorId(id);

        return NextResponse.json({
            success: true,
            data: sessions,
        });
    } catch (error: any) {
        console.log(error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}
