import { z } from "zod";

// Phone number regex - basic international format
const phoneRegex = /^\+?[1-9]\d{1,14}$/;

// NIC regex for Sri Lankan NIC (old: 9 digits + V, new: 12 digits)
const nicRegex = /^(?:\d{9}[vVxX]|\d{12})$/;

// Passport regex - alphanumeric, 6-9 characters
const passportRegex = /^[A-Z0-9]{6,9}$/;

export const signupSchema = z
    .object({
        // Personal Information
        first_name: z
            .string()
            .min(1, "First name is required")
            .max(50, "First name must be less than 50 characters")
            .regex(
                /^[a-zA-Z\s'-]+$/,
                "First name can only contain letters, spaces, hyphens and apostrophes"
            ),

        last_name: z
            .string()
            .min(1, "Last name is required")
            .max(50, "Last name must be less than 50 characters")
            .regex(
                /^[a-zA-Z\s'-]+$/,
                "Last name can only contain letters, spaces, hyphens and apostrophes"
            ),

        title: z
            .enum(["Mr", "Mrs", "Miss", "Dr", "Prof", "Rev"], {
                message: "Invalid title",
            })
            .optional(),

        age: z
            .number()
            .int("Age must be an integer")
            .min(1, "Age must be at least 1")
            .max(150, "Age must be less than 150")
            .or(
                z
                    .string()
                    .regex(/^\d+$/, "Age must be a number")
                    .transform(Number)
            ),

        gender: z
            .enum(["male", "female", "other"], {
                message: "Gender must be male, female, or other",
            })
            .optional(),

        // Contact Information
        email: z
            .string()
            .min(1, "Email is required")
            .email("Invalid email format")
            .max(255, "Email must be less than 255 characters")
            .toLowerCase(),

        country_code: z
            .string()
            .regex(
                /^\+\d{1,4}$/,
                "Country code must start with + and contain 1-4 digits"
            )
            .default("+94"),

        phone_number: z
            .string()
            .min(9, "Phone number must be at least 9 digits")
            .max(13, "Phone number must be less than 13 digits")
            .regex(/^\d+$/, "Phone number must contain only digits"),

        // Authentication
        password: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .max(100, "Password must be less than 100 characters")
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
            ),

        confirm_password: z.string().min(1, "Please confirm your password"),

        // Identification
        nic_number: z
            .string()
            .regex(nicRegex, "Invalid NIC format")
            .optional()
            .nullable()
            .optional()
            .nullable()
            .or(z.literal("")),

        passport_number: z
            .string()
            .regex(passportRegex, "Invalid passport format")
            .optional()
            .nullable()
            .optional()
            .nullable()
            .or(z.literal("")),

        nationality: z
            .string()
            .min(2, "Nationality must be at least 2 characters")
            .max(50, "Nationality must be less than 50 characters")
            .optional()
            .nullable()
            .or(z.literal("")),

        // Employment & Package
        employee_id: z
            .string()
            .max(50, "Employee ID must be less than 50 characters")
            .optional()
            .nullable()
            .or(z.literal("")),

        package: z
            .string()
            .optional()
            .nullable(),

        // User Type & Role
        user_type: z
            .enum(["individual", "corporate"], {
                message: "User type must be individual or corporate",
            })
            .optional(),

        role: z
            .enum(["patient"], {
                message: "Invalid role",
            })
            .default("patient"),

        // Terms & Conditions
        accepted_terms: z
            .boolean({
                message: "You must accept the terms and conditions",
            })
            .refine((val) => val === true, {
                message: "You must accept the terms and conditions",
            }),

        // Verification Status (optional)
        is_number_verified: z.boolean().default(false).optional(),
        is_email_verified: z.boolean().default(false).optional(),
    })
    .refine((data) => data.password === data.confirm_password, {
        message: "Passwords do not match",
        path: ["confirm_password"],
    })
    .refine(
        (data) => {
            // Either NIC number OR (nationality AND passport number) must be provided
            return (
                data.nic_number || (data.nationality && data.passport_number)
            );
        },
        {
            message:
                "Either NIC number OR both nationality and passport number are required",
            path: ["nic_number"],
        }
    );

export type SignupInput = z.infer<typeof signupSchema>;
