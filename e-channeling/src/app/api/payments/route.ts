import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const payments = "";

        return NextResponse.json(
            {
                success: true,
                data: payments,
            },
            { status: 201 }
        );
    } catch (error: any) {
        return NextResponse.json(
            {
                success: false,
                message: error.message,
            },
            { status: 400 }
        );
    }
}
