import { z } from "zod";

export const paymentSchema = z.object({
    appointmentNumber: z
        .string()
        .min(1, "Appointment number is required"),
    amount: z
        .number()
        .positive("Payment amount must be greater than zero")
        .max(1000000, "Payment amount exceeds allowed limit"),

    cardNumber: z
        .string()
        .trim()
        .regex(/^\d{16}$/, "Card number must be exactly 16 digits"),

    cardHolderName: z
        .string()
        .trim()
        .min(3, "Card holder name must be at least 3 characters")
        .max(50, "Card holder name must be less than 50 characters")
        .regex(
            /^[A-Za-z\s]+$/,
            "Card holder name can contain only letters and spaces"
        ),

    expiryDate: z
        .string()
        .regex(
            /^(0[1-9]|1[0-2])\/\d{2}$/,
            "Expiry date must be in MM/YY format"
        ),

    cvv: z.string().regex(/^\d{3,4}$/, "CVV must be 3 or 4 digits"),
});

export type PaymentInput = z.infer<typeof paymentSchema>;
