import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASS
    }
});

export const sendVerificationEmail = async (to, code) => {
    console.log('trying to send an email');
    await transporter.sendMail({
        from: `"Bry Insurance" <${process.env.EMAIL_FROM}>`,
        to,
        subject: 'Email Verification Code',
        html: `<p>Your verification code is: <b>${code}</b></p>`
    });
    console.log('after email send');
};
