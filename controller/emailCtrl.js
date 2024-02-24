const nodemailer = require("nodemailer");
const asyncHandler = require("express-async-handler");

const sendEmail = asyncHandler(async(data,req,res)=>{
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth:{
            user: process.env.Email_ID,
            pass: process.env.Email_Pass
        }
    });

    let info = await transporter.sendMail({
        from: '"Hey" <rajon.zhsust15@gmail.com>',
        to: data.to,
        subject: data.subject,
        text: data.text,
        html: data.htm
    })
});

module.exports = sendEmail;