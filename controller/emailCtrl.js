const nodemailer = require("nodemailer");
const asyncHandler = require("express-async-handler");

const sendEmail = asyncHandler(async (data, req, res) => {
    try {
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // Use a secure connection
            auth: {
                user: process.env.Email_ID,
                pass: process.env.Email_Pass,
            },
        });

        let info = await transporter.sendMail({
            from: '"Hey" <rajon.zhsust15@gmail.com>',
            to: data.to,
            subject: data.subject,
            text: data.text,
            html: data.htm,
        });

        console.log("Message sent: %s", info.messageId);
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Error sending email");
    }
});

module.exports = sendEmail;
