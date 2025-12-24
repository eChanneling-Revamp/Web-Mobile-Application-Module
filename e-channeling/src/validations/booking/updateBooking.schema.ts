import z from "zod";

const nicRegex = /^(?:\d{9}[vVxX]|\d{12})$/;

export const updateBookingSchema = z.object({
    patientName: z
        .string()
        .min(1, "Patient name is required")
        .max(50, "Patient name must be less than 50 characters")
        .regex(
            /^[a-zA-Z\s'-]+$/,
            "Patient name can only contain letters, spaces, hyphens and apostrophes"
        ),

    patientEmail: z
        .string()
        .min(1, "Email is required")
        .email("Invalid email format")
        .max(255, "Email must be less than 255 characters")
        .toLowerCase(),

    patientPhone: z
        .string()
        .min(10, "Phone number must be at least 10 digits")
        .max(15, "Phone number must be less than 15 digits")
        .regex(
            /^\+?\d+$/,
            "Phone number must contain only digits and optional + prefix"
        ),

    patientNIC: z
        .string()
        .min(1, "NIC is required")
        .regex(nicRegex, "Invalid NIC format"),

    patientDateOfBirth: z
        .string()
        .min(1, "Date of birth is required")
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
        .refine((date) => !isNaN(Date.parse(date)), "Invalid date")
        .refine(
            (date) => new Date(date) <= new Date(),
            "Date of birth cannot be in the future"
        ),

    patientGender: z.enum(["MALE", "FEMALE", "OTHER"], {
        message: "Gender must be MALE, FEMALE, or OTHER",
    }),

    emergencyContactPhone: z
        .string()
        .regex(
            /^\+?\d+$/,
            "Emergency contact phone must contain only digits and optional + prefix"
        )
        .min(10, "Emergency contact phone must be at least 10 digits")
        .max(15, "Emergency contact phone must be less than 15 digits")
        .or(z.literal("")),

    status: z
        .enum(
            [
                "CONFIRMED",
                "CANCELLED",
                "COMPLETED",
                "NO_SHOW",
                "RESCHEDULED",
                "UNPAID",
            ],
            {
                message:
                    "Status must be one of: CONFIRMED, CANCELLED, COMPLETED, NO_SHOW, RESCHEDULED, UNPAID",
            }
        )
        .optional(),

    paymentStatus: z
        .enum(
            [
                "PENDING",
                "COMPLETED",
                "FAILED",
                "REFUNDED",
                "CANCELLED",
                "UNPAID",
            ],
            {
                message:
                    "Payment status must be one of: PENDING, COMPLETED, FAILED, REFUNDED, CANCELLED, UNPAID",
            }
        )
        .optional(),

    medicalReports: z.string().url("Invalid format").optional(),
});

export type UpdateBookingInput = z.infer<typeof updateBookingSchema>;
