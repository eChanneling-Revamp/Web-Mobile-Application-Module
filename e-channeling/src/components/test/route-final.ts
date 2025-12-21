// import prisma from "@/lib/db/prisma";
// import { NextResponse } from "next/server";
// import { v4 as UUIDv4 } from "uuid";
// import { signupSchema, type SignupInput } from "../../app/api/auth/signup/validation";
// import { ZodError } from "zod";
// import { hash } from "bcryptjs";
// import { rateLimit } from "@/lib/utils/rateLimit";

// // Type for the auth service response
// interface AuthServiceResponse {
//     user?: {
//         id: string;
//     };
//     accessToken?: string;
//     error?: string;
// }

// /**
//  * POST /api/auth/signup
//  * Handles user registration for corporate employees
//  *
//  * @param req - Request object containing user registration data
//  * @returns JSON response with user data or error message
//  */
// export async function POST(req: Request) {
//     let authUserId: string | null = null;
//     let createdUserId: string | null = null;

//     try {
//         // Get client IP for rate limiting
//         const forwarded = req.headers.get("x-forwarded-for");
//         const ip = forwarded ? forwarded.split(",")[0] : "unknown";

//         // Apply rate limiting (3 attempts per 60 seconds per IP)
//         const isAllowed = await rateLimit(`signup:${ip}`);
//         if (!isAllowed) {
//             return NextResponse.json(
//                 { error: "Too many signup attempts. Please try again later." },
//                 { status: 429 }
//             );
//         }

//         // Parse and validate request body
//         const body = await req.json();

//         // Validate input using Zod schema
//         let validatedData: SignupInput;
//         try {
//             validatedData = signupSchema.parse(body);
//         } catch (error) {
//             if (error instanceof ZodError) {
//                 return NextResponse.json(
//                     {
//                         error: "Validation failed",
//                         details: error.errors.map((err) => ({
//                             field: err.path.join("."),
//                             message: err.message,
//                         })),
//                     },
//                     { status: 400 }
//                 );
//             }
//             throw error;
//         }

//         // Check if user already exists
//         const existingUser = await prisma.users.findUnique({
//             where: { email: validatedData.email },
//         });

//         if (existingUser) {
//             return NextResponse.json(
//                 { error: "User with this email already exists" },
//                 { status: 409 }
//             );
//         }

//         // Verify employee ID exists and is active
//         const employee = await prisma.corporate_employees.findUnique({
//             where: {
//                 employeeId: validatedData.employee_id,
//             },
//         });

//         if (!employee) {
//             return NextResponse.json(
//                 {
//                     error: "Invalid employee ID. Please contact your organization.",
//                 },
//                 { status: 400 }
//             );
//         }

//         if (!employee.isActive) {
//             return NextResponse.json(
//                 {
//                     error: "This employee ID has been deactivated. Please contact your organization.",
//                 },
//                 { status: 400 }
//             );
//         }

//         // Check if employee is already registered
//         const existingEmployeeUser = await prisma.users.findFirst({
//             where: {
//                 employeeId: validatedData.employee_id,
//             },
//         });

//         if (existingEmployeeUser) {
//             return NextResponse.json(
//                 { error: "This employee ID is already registered" },
//                 { status: 409 }
//             );
//         }

//         // Validate package if provided
//         if (validatedData.package_id) {
//             const packageExists = await prisma.packages.findUnique({
//                 where: {
//                     packageId: validatedData.package_id,
//                 },
//             });

//             if (!packageExists) {
//                 return NextResponse.json(
//                     { error: "Invalid package ID" },
//                     { status: 400 }
//                 );
//             }
//         }

//         // Call auth service to create user
//         const AUTH_SERVICE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/register`;

//         if (!AUTH_SERVICE_URL || !process.env.NEXT_PUBLIC_API_BASE_URL) {
//             console.error("AUTH_SERVICE_URL is not configured");
//             return NextResponse.json(
//                 { error: "Service configuration error" },
//                 { status: 500 }
//             );
//         }

//         const authRes = await fetch(AUTH_SERVICE_URL, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({
//                 first_name: validatedData.first_name,
//                 last_name: validatedData.last_name,
//                 email: validatedData.email,
//                 password: validatedData.password,
//                 confirm_password: validatedData.confirm_password,
//                 phone_number: validatedData.phone_number,
//                 role: "patient",
//                 age: validatedData.age,
//                 gender: validatedData.gender,
//                 nic: validatedData.nic_number,
//             }),
//         });

//         if (!authRes.ok) {
//             const errorData = await authRes.json().catch(() => ({}));
//             console.error("Auth service error:", errorData);

//             return NextResponse.json(
//                 {
//                     error:
//                         errorData.error ||
//                         "Authentication service error. Please try again later.",
//                 },
//                 { status: authRes.status }
//             );
//         }

//         const authData: AuthServiceResponse = await authRes.json();

//         if (!authData.user?.id) {
//             console.error("Invalid auth service response:", authData);
//             return NextResponse.json(
//                 { error: "Invalid response from authentication service" },
//                 { status: 500 }
//             );
//         }

//         authUserId = authData.user.id;
//         const name = `${validatedData.first_name} ${validatedData.last_name}`;
//         const contactNumber = `${validatedData.country_code}${validatedData.phone_number}`;
//         const userId = UUIDv4();

//         // Hash password before storing (NEVER store plain text passwords)
//         const hashedPassword = await hash(validatedData.password, 12);

//         // Create user in local database
//         const user = await prisma.users.create({
//             data: {
//                 id: userId,
//                 authUserId: authUserId,
//                 name: name,
//                 userType: validatedData.user_type || null,
//                 role: validatedData.role || "AGENT",
//                 title: validatedData.title || null,
//                 age:
//                     typeof validatedData.age === "number"
//                         ? validatedData.age
//                         : parseInt(validatedData.age as string),
//                 gender: validatedData.gender || null,
//                 email: validatedData.email,
//                 contactNumber: contactNumber,
//                 nicNumber: validatedData.nic_number || null,
//                 passportNumber: validatedData.passport_number || null,
//                 password: hashedPassword, // Store hashed password
//                 employeeId: validatedData.employee_id,
//                 packageId: validatedData.package_id || null,
//                 nationality: validatedData.nationality || null,
//                 acceptedTerms: validatedData.accepted_terms,
//                 isNumberVerified: validatedData.is_number_verified || false,
//                 isEmailVerified: validatedData.is_email_verified || false,
//                 isActive: true,
//                 createdAt: new Date(),
//                 updatedAt: new Date(),
//             },
//         });

//         createdUserId = user.id;

//         return NextResponse.json(
//             {
//                 message: "User registered successfully",
//                 data: {
//                     userId: user.id,
//                     name: user.name,
//                     email: user.email,
//                     role: user.role,
//                     // Only return token if it exists
//                     ...(authData.accessToken && {
//                         token: authData.accessToken,
//                     }),
//                 },
//             },
//             { status: 201 }
//         );
//     } catch (error) {
//         console.error(
//             "Signup error:",
//             error instanceof Error ? error.message : "Unknown error"
//         );

//         // Rollback: delete created local user if auth service succeeded
//         if (createdUserId) {
//             try {
//                 await prisma.users.delete({
//                     where: { id: createdUserId },
//                 });
//                 console.log(
//                     `Rolled back local user creation: ${createdUserId}`
//                 );
//             } catch (cleanupError) {
//                 console.error("Failed to rollback local user:", cleanupError);
//             }
//         }

//         // TODO: Implement rollback for auth service user
//         // This requires the auth service to have a delete endpoint
//         if (authUserId && !createdUserId) {
//             console.error(
//                 `Orphaned auth user created: ${authUserId} - manual cleanup required`
//             );
//             // You would call the auth service delete endpoint here
//             // Example:
//             // try {
//             //   await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/user/${authUserId}`, {
//             //     method: 'DELETE',
//             //     headers: { 'Authorization': `Bearer ${serviceToken}` }
//             //   });
//             // } catch (deleteError) {
//             //   console.error("Failed to delete orphaned auth user:", deleteError);
//             // }
//         }

//         return NextResponse.json(
//             { error: "Signup failed. Please try again later." },
//             { status: 500 }
//         );
//     }
// }
