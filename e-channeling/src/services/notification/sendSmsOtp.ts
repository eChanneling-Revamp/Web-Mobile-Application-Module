import twilio from "twilio";

const client = twilio(process.env.TWILIO_SID!, process.env.TWILIO_AUTH_TOKEN!);

export const sendSmsOtp = async (phone: string, otp: string) => {
    await client.messages.create({
        from: process.env.TWILIO_PHONE!,
        to: phone,
        body: `Your E-Channeling OTP is ${otp}. It expires in 3 minutes.`,
    });
};
