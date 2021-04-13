import {google} from "googleapis";
import nodemailer from "nodemailer";

const oath2Client = new google.auth.OAuth2(
    process.env.GOOGLE_NODEMAILER_CLIENT_ID,
    process.env.GOOGLE_NODEMAILER_CLIENT_SECRET,
    process.env.GOOGLE_NODEMAILER_REDIRECT_URI,
);

oath2Client.setCredentials({
    refresh_token: process.env.GOOGLE_NODEMAILER_REFRESH_TOKEN,
});

const sendEmail = async (to, subject, message) => {
    try {
        const accessToken = await oath2Client.getAccessToken();
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            port: 465,
            auth: {
                type: 'OAuth2',
                user: 'mchemweno27@gmail.com',
                clientId: process.env.GOOGLE_NODEMAILER_CLIENT_ID,
                clientSecret: process.env.GOOGLE_NODEMAILER_CLIENT_SECRET,
                refreshToken: process.env.GOOGLE_NODEMAILER_REFRESH_TOKEN,
                accessToken,
            },
        });
        const response = await transporter.sendMail({
            from: 'mchemweno27@gmail.com',
            to,
            subject,
            text: message,
        });
        return response;
    } catch (e) {
        return e;
    }
};

export default sendEmail;
