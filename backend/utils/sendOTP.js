import nodemailer from "nodemailer";

export const sendOTP = async (email, otp) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        },
    });

    const mailOptions = {
        from: `"Job Portal Team" <${process.env.MAIL_USER}>`, // trusted sender name
        to: email,
        subject: "Your Job Portal OTP Code",
        text: `Hello,\n\nYour OTP code is: ${otp}\n\nThis OTP is valid for 5 minutes. Do not share it with anyone.\n\nIf you did not request this, please ignore this email.`,
        html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>OTP Verification</title>
            </head>
            <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px;">
                <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                        <td align="center">
                            <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="background: #fff; padding: 40px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                                <tr>
                                    <td align="center" style="font-size: 24px; color: #333; font-weight: bold;">
                                        Verify Your Email
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 20px 0; font-size: 16px; color: #555;">
                                        Hello,<br><br>
                                        Use the OTP below to verify your email address for your Job Portal account:
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="font-size: 32px; color: #007BFF; font-weight: bold; padding: 20px 0;">
                                        ${otp}
                                    </td>
                                </tr>
                                <tr>
                                    <td style="font-size: 14px; color: #777;">
                                        This OTP is valid for only 5 minutes. Do not share it with anyone.
                                    </td>
                                </tr>
                                <tr>
                                    <td style="font-size: 12px; color: #aaa; padding-top: 30px;">
                                        If you didn’t request this email, you can safely ignore it.<br><br>
                                        Sent from Job Portal Team.
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
        `,
    };

    await transporter.sendMail(mailOptions);
};
