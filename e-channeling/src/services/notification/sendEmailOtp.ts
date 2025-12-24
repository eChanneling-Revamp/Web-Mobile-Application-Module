import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export const sendEmailOtp = async (to: string, otp: string, html: string) => {
    await transporter.sendMail({
        from: `"E-Channeling" <${process.env.MAIL_USER}>`,
        to,
        subject: "E-Channeling Verification",
        html,
    });
};
