import prisma from "@/lib/db/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    const user = await prisma.users.findMany();

    return NextResponse.json({ user });
}
