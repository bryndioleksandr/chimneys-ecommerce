import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { Resend } from 'resend';

dotenv.config();

const resend = new Resend(process.env.RESEND_URL);

export const sendInfoEmailResend = async (to, subject, htmlContent) => {
    try {
        let sender = 'onboarding@resend.dev'; // temp (without domen)
        let recipient = to;

        if (!process.env.NODE_ENV || process.env.NODE_ENV !== 'production') {
            console.log(`Development mode: redirecting email from ${to} to my email`);
            recipient = 's.v.bryndo@gmail.com';
        } else {
            sender = 'Магазин Димарів <orders@dymohit.com.ua>';
        }

        const data = await resend.emails.send({
            from: sender,
            to: recipient,
            subject: subject,
            html: htmlContent,
        });

        console.log('Email sent:', data);
    } catch (error) {
        console.error('Resend error:', error);
    }
};

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASS
    }
});

export const sendVerificationEmail = async (to, code) => {
    console.log('trying to send an email');
    try {
        await transporter.sendMail({
            from: `"Chimney Store" <${process.env.EMAIL_FROM}>`,
            to,
            subject: 'Email Verification Code',
            html: `<p>Код для підвтердження електронної пошти: <b>${code}</b></p>`
        });
    }
    catch (error) {
        console.error('Email error:', error);
    }
    console.log('after email send');
};

export const sendInfoEmail = async ({to, subject, text}) => {
    console.log('trying to send an email');
    try {
        await transporter.sendMail({
            from: `"Chimney Store" <${process.env.EMAIL_FROM}>`,
            to,
            subject,
            html: `<p>${text}</p>`
        });
        console.log('after email send');
    } catch (error) {
        console.error('Email sending error:', error);
    }
};
