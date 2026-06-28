import nodemailer from "nodemailer";
import { env } from "../../config/env.local";

const userEmail: string = env.USER_EMAIL || "";
const passwordEmail: string = env.USER_PASSWORD || "";
const configEmail = {
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: userEmail,
        pass: passwordEmail
    }
}

const transporter = nodemailer.createTransport(configEmail);

const sendEmail = async ({ email, subject, text, html, attachments }:
    { email: string, subject: string, text: string, html?: string, attachments?: any[] }) => {
    await transporter.sendMail({
        from: `Edulearn <${userEmail}>`,
        to: email,
        subject: subject,
        text: text,
        html: html,
        attachments: attachments || []
    });
};

export default sendEmail;