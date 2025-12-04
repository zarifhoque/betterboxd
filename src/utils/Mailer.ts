// utils/mailer.ts
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendConfirmationEmail = async (to: string, token: string) => {
  const url = `${process.env.FRONTEND_URL}/api/auth/confirm-email/${token}`;
  await transporter.sendMail({
    from: '"BetterBoxd" <no-reply@betterboxd.com>',
    to,
    subject: 'Confirm your email',
    html: `<p>Click <a href="${url}">here</a> to confirm your email.</p>`,
  });
};
