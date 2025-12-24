import prisma from "@/lib/db/prisma";
import { rateLimit } from "@/lib/utils/rateLimit";
import {
    SignupInput,
    signupSchema,
} from "@/validations/signup/createUser.schema";
import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { v4 as UUIDv4 } from "uuid";
import { ZodError } from "zod";

// auth service response
interface AuthServiceResponse {
    user?: {
        id: string;
    };
    accessToken?: string;
    error?: string;
}

export async function POST(req: Request) {
    let authUserId: string | null = null;
    let createdUserId: string | null = null;

    try {
        //Get client IP for rate limiting
        const forwarded = req.headers.get("x-forwarded-for");
        const ip = forwarded ? forwarded.split(",")[0] : "unknown";
        console.log("Client IP ", ip);

        const isAllowed = await rateLimit(`signup:${ip}`);
        if (!isAllowed) {
            return NextResponse.json(
                { error: "Too many signup attempts. Please try again later." },
                { status: 429 }
            );
        }

        const body = await req.json();
        console.log("Body data ", body);

        // validate input data
        let validatedData: SignupInput;
        try {
            validatedData = signupSchema.parse(body);
        } catch (error) {
            if (error instanceof ZodError) {
                // Return the first validation error message
                const firstError = error.issues[0];
                return NextResponse.json(
                    { error: firstError.message },
                    { status: 400 }
                );
            }
            throw error;
        }

        console.log("Validated Data ", validatedData);

        const contactNumber = `${validatedData.country_code}${validatedData.phone_number}`;

        const existingUser = await prisma.users.findUnique({
            where: {
                email: validatedData.email,
                contactNumber: contactNumber,
            },
        });

        if (existingUser) {
            return NextResponse.json(
                {
                    error: "User with this email or contact number already exists",
                },
                { status: 400 }
            );
        }

        // check the employee id in the employees table
        const employee = await prisma.corporate_employees.findUnique({
            where: {
                employeeId: body.employee_id,
            },
        });

        if (validatedData.employee_id !== "" && !employee) {
            return NextResponse.json(
                { error: "Invalid employee ID " },
                { status: 400 }
            );
        }

        const AUTH_SERVICE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/register`;

        // call auth service
        const authRes = await fetch(AUTH_SERVICE_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                first_name: validatedData.first_name,
                last_name: validatedData.last_name,
                email: validatedData.email,
                password: validatedData.password,
                confirm_password: validatedData.confirm_password,
                phone_number: validatedData.phone_number,
                role: "patient",
                age: validatedData.age,
                gender: validatedData.gender,
                nic: validatedData.nic_number,
            }),
        });

        if (!authRes.ok) {
            const errorData = await authRes.json().catch(() => ({}));
            console.error("Auth service error:", errorData);

            return NextResponse.json(
                {
                    error:
                        errorData.message ||
                        "Authentication service error. Please try again later.",
                },
                { status: authRes.status }
            );
        }

        const authData: AuthServiceResponse = await authRes.json();
        console.log("SuperBase response ", authData);

        if (!authData.user?.id) {
            console.error("Invalid auth service response:", authData);
            return NextResponse.json(
                { error: "Invalid response from authentication service" },
                { status: 500 }
            );
        }

        authUserId = authData.user.id;
        const name = `${validatedData.first_name} ${validatedData.last_name}`;
        const userId = UUIDv4();
        const hashedPassword = await hash(validatedData.password, 12);

        const user = await prisma.users.create({
            data: {
                id: userId,
                authUserId: authUserId,
                name: name,
                userType: validatedData.user_type || "",
                role: "PATIENT",
                title: validatedData.title || null,
                age:
                    typeof validatedData.age === "number"
                        ? validatedData.age
                        : parseInt(validatedData.age as string),
                gender: validatedData.gender || null,
                email: validatedData.email,
                contactNumber: contactNumber,
                nicNumber: validatedData.nic_number || null,
                passportNumber: validatedData.passport_number || null,
                password: hashedPassword,
                employeeId: validatedData.employee_id || null,
                packageId: validatedData.package || null,
                nationality: validatedData.nationality,
                acceptedTerms: validatedData.accepted_terms,
                isNumberVerified: validatedData.is_number_verified || false,
                isEmailVerified: validatedData.is_email_verified || false,
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        });

        createdUserId = user.id;

        return NextResponse.json(
            {
                message: "User registered successfully",
                data: {
                    userId: user.id,
                    authUserId: authUserId,
                    name: user.name,
                    email: user.email,
                },
                ...(authData.accessToken && {
                    accessToken: authData.accessToken,
                }),
            },
            { status: 201 }
        );
    } catch (error) {
        console.error(
            "Signup error:",
            error instanceof Error ? error.message : "Unknown error"
        );

        if (authUserId) {
            try {
                // Rollback - delete the auth user
            } catch (cleanupError) {
                console.error("Auth rollback failed:", cleanupError);
            }
        }
        return NextResponse.json(
            { error: "Signup failed, please try again later." },
            { status: 500 }
        );
    }
}
