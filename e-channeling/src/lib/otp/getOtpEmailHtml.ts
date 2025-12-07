export const getOtpEmailHtml = (otp: string) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Email Verification</title>
    </head>

    <body style="margin:0;padding:0;background:#f5f7fa;font-family:Arial, Helvetica, sans-serif;">

    <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
        <td align="center" style="padding:40px 15px;">

            <table width="600" cellpadding="0" cellspacing="0" style="
            background:#ffffff;
            border-radius:14px;
            padding:40px;
            box-shadow:0 6px 20px rgba(0,0,0,0.06);
            ">

            <tr>
                <td align="center" style="padding-bottom:25px;">
                <h2 style="margin:0;font-size:26px;color:#0d0d0d;font-weight:600;">
                    Verify Your Email
                </h2>
                </td>
            </tr>

            <tr>
                <td style="font-size:16px;color:#444;line-height:1.6;">
                <p style="margin:0;">
                    Hello,
                </p>

                <p style="margin-top:15px;">
                    Thank you for using our service. To complete your verification, please use the
                    following One-Time Password (OTP). This code is valid for 
                    <strong style="color:#0d6efd;">3 minutes</strong>.
                </p>
                </td>
            </tr>

            <tr>
                <td align="center" style="padding:40px 0;">
                <div style="
                    font-size:38px;
                    font-weight:700;
                    color:#0d6efd;
                    letter-spacing:10px;
                    background:#eef3ff;
                    border:1px solid #d7e1ff;
                    border-radius:12px;
                    padding:18px 30px;
                    display:inline-block;
                ">
                    ${otp}
                </div>
                </td>
            </tr>

            <tr>
                <td style="font-size:14px;color:#777;line-height:1.6;">
                <p style="margin:0;">
                    If you did not request this code, you can safely ignore this message.
                </p>
                </td>
            </tr>

            <tr>
                <td style="padding-top:30px;">
                <hr style="border:0;border-top:1px solid #eee;">
                </td>
            </tr>

            <tr>
                <td align="center" style="padding-top:15px;font-size:12px;color:#999;">
                © 2025 eChanneling. All rights reserved.
                </td>
            </tr>

            </table>

        </td>
        </tr>
    </table>
    </body>
    </html>

    `;
};
